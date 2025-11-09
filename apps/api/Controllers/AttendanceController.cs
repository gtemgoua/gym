using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/attendance")]
[Authorize]
public class AttendanceController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken cancellationToken)
    {
        var start = from ?? DateTime.UtcNow.AddDays(-7);
        var end = to ?? DateTime.UtcNow;

        var records = await db.Attendance
            .AsNoTracking()
            .Include(a => a.Member)
            .Include(a => a.ClassEvent)
            .Where(a => a.CheckinAt >= start && a.CheckinAt <= end)
            .OrderByDescending(a => a.CheckinAt)
            .Take(200)
            .Select(a => new
            {
                a.Id,
                a.CheckinAt,
                a.Method,
                Member = a.Member == null ? null : new { a.Member.Id, a.Member.Name },
                Class = a.ClassEvent == null ? null : new { a.ClassEvent.Id, a.ClassEvent.StartAt, a.ClassEvent.Location }
            })
            .ToListAsync(cancellationToken);

        return Ok(records);
    }

    [HttpPost("checkin")]
    public async Task<IActionResult> CheckIn([FromBody] CheckInRequest request, CancellationToken cancellationToken)
    {
        var member = await db.Users.Include(u => u.MemberProfile).FirstOrDefaultAsync(u => u.Id == request.MemberId, cancellationToken);
        if (member is null)
        {
            return NotFound(new { error = "Member not found" });
        }

        if (member.MemberProfile?.Status is MemberStatus.Delinquent or MemberStatus.Canceled)
        {
            return BadRequest(new { error = "Member not eligible" });
        }

        var attendance = new Attendance
        {
            MemberId = request.MemberId,
            ClassEventId = request.ClassEventId,
            Method = request.Method
        };

        db.Attendance.Add(attendance);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(attendance);
    }
}

public record CheckInRequest(Guid MemberId, Guid ClassEventId, AttendanceMethod Method = AttendanceMethod.Kiosk);
