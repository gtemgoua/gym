using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/billing")]
[Authorize]
public class BillingController(AppDbContext db) : ControllerBase
{
    [HttpGet("invoices")]
    public async Task<IActionResult> ListInvoices([FromQuery] Guid? memberId, CancellationToken cancellationToken)
    {
        var query = db.Invoices.AsNoTracking().Include(i => i.Member).AsQueryable();
        if (memberId is not null)
        {
            query = query.Where(i => i.MemberId == memberId);
        }

        var invoices = await query
            .OrderByDescending(i => i.DueAt)
            .Take(200)
            .Select(i => new
            {
                i.Id,
                i.Amount,
                i.Status,
                i.DueAt,
                i.PaidAt,
                Member = i.Member == null ? null : new { i.Member.Id, i.Member.Email }
            })
            .ToListAsync(cancellationToken);

        return Ok(invoices);
    }

    [HttpPost("invoices")]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request, CancellationToken cancellationToken)
    {
        var invoice = new Invoice
        {
            MemberId = request.MemberId,
            SubscriptionId = request.SubscriptionId,
            Amount = request.Amount,
            TaxAmount = request.TaxAmount,
            DiscountAmount = request.DiscountAmount,
            Currency = request.Currency ?? "USD",
            DueAt = request.DueAt ?? DateTime.UtcNow,
            Status = InvoiceStatus.Open,
            LineItemsJson = request.LineItemsJson ?? "[]"
        };

        db.Invoices.Add(invoice);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(ListInvoices), new { id = invoice.Id }, invoice);
    }
}

public record CreateInvoiceRequest(Guid MemberId, Guid? SubscriptionId, decimal Amount, decimal? TaxAmount, decimal? DiscountAmount, string? Currency, DateTime? DueAt, string? LineItemsJson);
