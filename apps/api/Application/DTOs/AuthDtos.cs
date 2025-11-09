namespace GymManagement.Api.Application.DTOs;

public record LoginRequest(string Email, string Password);

public record LoginResponse(string Token, UserSummary User);

public record UserSummary(Guid Id, string Name, string Email, string Role);
