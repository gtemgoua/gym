namespace GymManagement.Api.Domain.Entities;

public class ClassTemplate
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Name { get; set; }

    public string? Description { get; set; }

    public Guid? DefaultCoachId { get; set; }

    public int DefaultCapacity { get; set; } = 20;

    public int DefaultDurationMinutes { get; set; } = 60;

    public int CreditCost { get; set; } = 1;

    public string? Category { get; set; }

    public string? Color { get; set; }

    public string? Location { get; set; }

    public string? Room { get; set; }

    public string? RecurrenceRule { get; set; }

    public ICollection<ClassEvent> Events { get; set; } = new List<ClassEvent>();
}
