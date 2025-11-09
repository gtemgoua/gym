using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/classes")]
[Authorize]
public class ClassesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> List([FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken cancellationToken)
    {
        var start = from ?? DateTime.UtcNow.AddDays(-1);
        var end = to ?? DateTime.UtcNow.AddDays(7);

        var events = await db.ClassEvents
            .AsNoTracking()
            .Include(c => c.Template)
            .Include(c => c.Bookings)
            .Where(c => c.StartAt >= start && c.StartAt <= end)
            .OrderBy(c => c.StartAt)
            .Select(c => new
            {
                c.Id,
                c.StartAt,
                c.EndAt,
                c.Location,
                c.Room,
                c.Status,
                c.Capacity,
                Template = c.Template == null ? null : new { c.Template.Name },
                Bookings = c.Bookings.Select(b => new { b.Id, b.Status })
            })
            .ToListAsync(cancellationToken);

        return Ok(events);
    }

    [HttpPost("events")]
    public async Task<IActionResult> CreateEvent([FromBody] CreateClassEventRequest request, CancellationToken cancellationToken)
    {
        var evt = new ClassEvent
        {
            TemplateId = request.TemplateId,
            StartAt = request.StartAt,
            EndAt = request.EndAt ?? request.StartAt.AddHours(1),
            CoachId = request.CoachId,
            Capacity = request.Capacity,
            Location = request.Location,
            Room = request.Room,
            Status = request.Status
        };

        db.ClassEvents.Add(evt);
        await db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(List), new { id = evt.Id }, evt);
    }
}

public record CreateClassEventRequest(Guid? TemplateId, DateTime StartAt, DateTime? EndAt, Guid? CoachId, int Capacity, string Location, string? Room, ClassStatus Status = ClassStatus.Scheduled);
