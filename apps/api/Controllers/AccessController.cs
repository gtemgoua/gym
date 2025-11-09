using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/access")]
[Authorize]
public class AccessController(AppDbContext db) : ControllerBase
{
    [HttpGet("allowed")]
    [AllowAnonymous]
    public async Task<IActionResult> Allowed(CancellationToken cancellationToken)
    {
        var members = await db.AccessGrants
            .AsNoTracking()
            .Where(g => g.Status == AccessStatus.Allowed)
            .Select(g => new { MemberProfileId = g.MemberProfileId, g.ExternalReference })
            .ToListAsync(cancellationToken);

        return Ok(new { members });
    }

    [HttpPost]
    public async Task<IActionResult> Upsert([FromBody] UpdateAccessRequest request, CancellationToken cancellationToken)
    {
        var grant = await db.AccessGrants.FirstOrDefaultAsync(g => g.MemberProfileId == request.MemberProfileId, cancellationToken);
        if (grant is null)
        {
            grant = new AccessGrant
            {
                MemberProfileId = request.MemberProfileId,
                Status = request.Status,
                ExternalReference = request.ExternalReference,
                LastSyncAt = DateTime.UtcNow
            };
            db.AccessGrants.Add(grant);
        }
        else
        {
            grant.Status = request.Status;
            grant.ExternalReference = request.ExternalReference;
            grant.LastSyncAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync(cancellationToken);
        return Ok(grant);
    }
}

public record UpdateAccessRequest(Guid MemberProfileId, AccessStatus Status, string? ExternalReference);
