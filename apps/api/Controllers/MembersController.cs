using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/members")]
[Authorize]
public class MembersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] MemberStatus? status, CancellationToken cancellationToken)
    {
        var query = db.Users
            .AsNoTracking()
            .Include(u => u.MemberProfile)
            .Where(u => u.Role == UserRole.Member);

        if (status is not null)
        {
            query = query.Where(u => u.MemberProfile != null && u.MemberProfile.Status == status);
        }

        var members = await query
            .OrderByDescending(u => u.CreatedAt)
            .Take(100)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Phone,
                Status = u.MemberProfile!.Status.ToString(),
                u.MemberProfile!.Notes
            })
            .ToListAsync(cancellationToken);

        return Ok(new { items = members, total = members.Count });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMemberRequest request, CancellationToken cancellationToken)
    {
        var exists = await db.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
        if (exists)
        {
            return Conflict(new { error = "Email already exists" });
        }

        var member = new User
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
            Role = UserRole.Member,
            MemberProfile = new MemberProfile
            {
                Status = request.Status,
                Notes = request.Notes
            }
        };

        db.Users.Add(member);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = member.Id }, new { member.Id });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var member = await db.Users
            .AsNoTracking()
            .Include(u => u.MemberProfile)
            .Include(u => u.Subscriptions)
            .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Member, cancellationToken);

        if (member is null)
        {
            return NotFound();
        }

        return Ok(member);
    }
}

public record CreateMemberRequest(string Name, string Email, string? Phone, MemberStatus Status = MemberStatus.Active, string? Notes = null);
