namespace GymManagement.Api.Domain.Entities;

public enum BookingStatus
{
    Booked,
    Waitlisted,
    Canceled,
    NoShow
}

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ClassEventId { get; set; }

    public Guid MemberId { get; set; }

    public BookingStatus Status { get; set; } = BookingStatus.Booked;

    public bool ConsumedCredit { get; set; }

    public string? Source { get; set; }

    public string? Notes { get; set; }

    public ClassEvent? ClassEvent { get; set; }

    public User? Member { get; set; }
}
