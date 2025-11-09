namespace GymManagement.Api.Domain.Entities;

public enum LeadStage
{
    Lead,
    Trial,
    Member,
    Lost
}

public class Lead
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Name { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Source { get; set; }

    public LeadStage Stage { get; set; } = LeadStage.Lead;

    public string? Notes { get; set; }

    public ICollection<LeadActivity> Activities { get; set; } = new List<LeadActivity>();
}

public enum LeadActivityType
{
    Note,
    Call,
    Email,
    TagUpdate,
    StatusChange
}

public class LeadActivity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LeadId { get; set; }

    public LeadActivityType Type { get; set; }

    public string? DetailsJson { get; set; }

    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

    public Lead? Lead { get; set; }
}
