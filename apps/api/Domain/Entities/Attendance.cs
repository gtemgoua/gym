namespace GymManagement.Api.Domain.Entities;

public enum AttendanceMethod
{
    Kiosk,
    Staff,
    Api
}

public class Attendance
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ClassEventId { get; set; }

    public Guid MemberId { get; set; }

    public AttendanceMethod Method { get; set; } = AttendanceMethod.Kiosk;

    public DateTime CheckinAt { get; set; } = DateTime.UtcNow;

    public Guid? StaffId { get; set; }

    public ClassEvent? ClassEvent { get; set; }

    public User? Member { get; set; }
}
