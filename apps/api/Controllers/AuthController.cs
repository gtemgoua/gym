using System.Security.Claims;
using GymManagement.Api.Application.DTOs;
using GymManagement.Api.Application.Services;
using GymManagement.Api.Domain.Entities;
using GymManagement.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, JwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (user is null)
        {
            return Unauthorized(new { error = "Invalid credentials" });
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { error = "Invalid credentials" });
        }

        user.LastLoginAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        var token = jwtTokenService.CreateToken(user);
        var summary = new UserSummary(user.Id, user.Name, user.Email, user.Role.ToString().ToUpperInvariant());
        return Ok(new LoginResponse(token, summary));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
        if (userId is null || !Guid.TryParse(userId, out var id))
        {
            return Unauthorized();
        }

        var user = await db.Users
            .Include(u => u.MemberProfile)
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            Role = user.Role.ToString().ToUpperInvariant(),
            user.MemberProfile
        });
    }
}
