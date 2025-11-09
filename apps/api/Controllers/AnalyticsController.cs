using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/analytics")]
[Authorize]
public class AnalyticsController(AppDbContext db) : ControllerBase
{
    [HttpGet("dashboard/today")]
    public async Task<IActionResult> Today(CancellationToken cancellationToken)
    {
        var start = DateTime.UtcNow.Date;
        var end = start.AddDays(1);

        var newSignupsTask = db.Users.CountAsync(u => u.Role == Domain.Entities.UserRole.Member && u.CreatedAt >= start && u.CreatedAt < end, cancellationToken);
        var failedPaymentsTask = db.Invoices.CountAsync(i => i.Status == Domain.Entities.InvoiceStatus.Open && i.DueAt >= start && i.DueAt < end, cancellationToken);
        var upcomingClassesTask = db.ClassEvents
            .AsNoTracking()
            .Include(c => c.Template)
            .Include(c => c.Bookings)
            .Where(c => c.StartAt >= start && c.StartAt < end)
            .OrderBy(c => c.StartAt)
            .Take(5)
            .Select(c => new
            {
                c.Id,
                c.StartAt,
                c.EndAt,
                c.Location,
                c.Capacity,
                Template = c.Template == null ? null : new { c.Template.Name },
                Bookings = c.Bookings.Select(b => new { b.Id, b.Status })
            })
            .ToListAsync(cancellationToken);
        var attendanceTask = db.Attendance.CountAsync(a => a.CheckinAt >= start && a.CheckinAt < end, cancellationToken);

        await Task.WhenAll(newSignupsTask, failedPaymentsTask, upcomingClassesTask, attendanceTask);

        var occupancy = 0;
        var classes = upcomingClassesTask.Result;
        var capacitySum = classes.Sum(c => c.Capacity);
        if (capacitySum > 0)
        {
            var booked = classes.Sum(c => c.Bookings.Count(b => b.Status == Domain.Entities.BookingStatus.Booked));
            occupancy = (int)Math.Round((double)booked / capacitySum * 100);
        }

        return Ok(new
        {
            newSignups = newSignupsTask.Result,
            failedPayments = failedPaymentsTask.Result,
            upcomingClasses = classes,
            occupancy,
            attendanceCount = attendanceTask.Result
        });
    }

    [HttpGet("metrics")]
    public async Task<IActionResult> Metrics(CancellationToken cancellationToken)
    {
        var activeSubs = await db.Subscriptions
            .Include(s => s.Plan)
            .Where(s => s.Status == Domain.Entities.SubscriptionStatus.Active || s.Status == Domain.Entities.SubscriptionStatus.Trialing)
            .ToListAsync(cancellationToken);

        var totalMembers = await db.Users.CountAsync(u => u.Role == Domain.Entities.UserRole.Member, cancellationToken);
        var churned = await db.Subscriptions.CountAsync(s => s.Status == Domain.Entities.SubscriptionStatus.Canceled && s.CanceledAt >= DateTime.UtcNow.AddMonths(-1), cancellationToken);

        decimal mrr = 0;
        foreach (var sub in activeSubs)
        {
            if (sub.Plan is null) continue;
            var price = sub.Plan.Price;
            var period = sub.Plan.BillingPeriod;
            var monthlyEquivalent = period switch
            {
                Domain.Entities.BillingPeriod.Annual => price / 12,
                Domain.Entities.BillingPeriod.Quarterly => price / 3,
                Domain.Entities.BillingPeriod.Weekly => price * 4,
                _ => price
            };
            mrr += monthlyEquivalent;
        }

        var churnRate = activeSubs.Count == 0 ? 0 : (double)churned / activeSubs.Count * 100;
        var invoices = await db.Invoices.Where(i => i.Status == Domain.Entities.InvoiceStatus.Paid && i.PaidAt >= DateTime.UtcNow.AddMonths(-6)).ToListAsync(cancellationToken);
        var arpu = totalMembers == 0 ? 0 : invoices.Sum(i => i.Amount) / totalMembers;
        var ltv = arpu * 18; // assumption

        return Ok(new
        {
            mrr,
            churnRate = Math.Round(churnRate, 2),
            ltv,
            totalMembers,
            activeSubscriptions = activeSubs.Count
        });
    }
}
