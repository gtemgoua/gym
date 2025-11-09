namespace GymManagement.Api.Domain.Entities;

public enum MemberStatus
{
    Active,
    Trial,
    Frozen,
    Delinquent,
    Canceled
}

public class MemberProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public DateTime? Birthdate { get; set; }

    public string? EmergencyContactName { get; set; }

    public string? EmergencyContactPhone { get; set; }

    public DateTime? WaiverSignedAt { get; set; }

    public string? Notes { get; set; }

    public MemberStatus Status { get; set; } = MemberStatus.Active;

    public string? StripeCustomerId { get; set; }

    public string? PreferredLocation { get; set; }

    public User? User { get; set; }

    public AccessGrant? AccessGrant { get; set; }
}
