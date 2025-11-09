namespace GymManagement.Api.Domain.Entities;

public enum AccessStatus
{
    Allowed,
    Blocked
}

public class AccessGrant
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MemberProfileId { get; set; }

    public AccessStatus Status { get; set; } = AccessStatus.Allowed;

    public DateTime? LastSyncAt { get; set; }

    public string? ExternalReference { get; set; }

    public MemberProfile? MemberProfile { get; set; }
}
