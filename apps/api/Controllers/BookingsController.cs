using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] Guid? memberId, [FromQuery] Guid? classEventId, CancellationToken cancellationToken)
    {
        var query = db.Bookings
            .AsNoTracking()
            .Include(b => b.Member)
            .Include(b => b.ClassEvent)
            .AsQueryable();

        if (memberId is not null)
        {
            query = query.Where(b => b.MemberId == memberId);
        }

        if (classEventId is not null)
        {
            query = query.Where(b => b.ClassEventId == classEventId);
        }

        var bookings = await query
            .OrderByDescending(b => b.Id)
            .Take(100)
            .Select(b => new
            {
                b.Id,
                b.Status,
                b.ConsumedCredit,
                Member = b.Member == null ? null : new { b.Member.Id, b.Member.Name },
                Class = b.ClassEvent == null ? null : new { b.ClassEvent.Id, b.ClassEvent.StartAt, b.ClassEvent.Location }
            })
            .ToListAsync(cancellationToken);

        return Ok(bookings);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest request, CancellationToken cancellationToken)
    {
        var existing = await db.Bookings.AnyAsync(b => b.MemberId == request.MemberId && b.ClassEventId == request.ClassEventId && (b.Status == BookingStatus.Booked || b.Status == BookingStatus.Waitlisted), cancellationToken);
        if (existing)
        {
            return Conflict(new { error = "Member already booked" });
        }

        var eventEntity = await db.ClassEvents.Include(c => c.Bookings).FirstOrDefaultAsync(c => c.Id == request.ClassEventId, cancellationToken);
        if (eventEntity is null)
        {
            return NotFound(new { error = "Class not found" });
        }

        var confirmed = eventEntity.Bookings.Count(b => b.Status == BookingStatus.Booked);
        var status = confirmed >= eventEntity.Capacity ? BookingStatus.Waitlisted : BookingStatus.Booked;

        var booking = new Booking
        {
            ClassEventId = request.ClassEventId,
            MemberId = request.MemberId,
            Status = status,
            Source = request.Source
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(booking);
    }
}

public record CreateBookingRequest(Guid ClassEventId, Guid MemberId, string? Source);
