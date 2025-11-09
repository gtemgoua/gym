namespace GymManagement.Api.Domain.Entities;

public enum ClassStatus
{
    Scheduled,
    Canceled,
    Completed
}

public class ClassEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? TemplateId { get; set; }

    public DateTime StartAt { get; set; }

    public DateTime EndAt { get; set; }

    public Guid? CoachId { get; set; }

    public int Capacity { get; set; } = 20;

    public int WaitlistSize { get; set; }

    public string Location { get; set; } = "Main";

    public string? Room { get; set; }

    public ClassStatus Status { get; set; } = ClassStatus.Scheduled;

    public string? Notes { get; set; }

    public ClassTemplate? Template { get; set; }

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public ICollection<Attendance> Attendance { get; set; } = new List<Attendance>();
}
