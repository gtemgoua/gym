using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/plans")]
[Authorize]
public class PlansController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var plans = await db.Plans
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                BillingPeriod = p.BillingPeriod.ToString(),
                p.CreditsPerPeriod,
                p.ContractMonths,
                p.AllowDropIn,
                p.AllowProration,
                p.Active
            })
            .ToListAsync(cancellationToken);

        return Ok(plans);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Plan request, CancellationToken cancellationToken)
    {
        db.Plans.Add(request);
        await db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(List), new { id = request.Id }, request);
    }
}
