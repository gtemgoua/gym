using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/leads")]
public class LeadsController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Capture([FromBody] CreateLeadRequest request, CancellationToken cancellationToken)
    {
        var lead = new Lead
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Source = request.Source,
            Stage = LeadStage.Lead,
            Notes = request.Notes
        };

        db.Leads.Add(lead);
        await db.SaveChangesAsync(cancellationToken);

        return StatusCode(StatusCodes.Status201Created, lead);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> List([FromQuery] LeadStage? stage, CancellationToken cancellationToken)
    {
        var query = db.Leads.AsNoTracking().Include(l => l.Activities).AsQueryable();
        if (stage is not null)
        {
            query = query.Where(l => l.Stage == stage);
        }

        var leads = await query.OrderByDescending(l => l.Id).Take(200).ToListAsync(cancellationToken);
        return Ok(leads);
    }
}

public record CreateLeadRequest(string Name, string? Email, string? Phone, string? Source, string? Notes);
