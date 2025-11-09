using System.ComponentModel.DataAnnotations;

namespace GymManagement.Api.Domain.Entities;

public enum UserRole
{
    Owner,
    Manager,
    Staff,
    Member
}

public enum UserStatus
{
    Active,
    Inactive,
    Invited,
    Suspended
}

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(120)]
    public required string Name { get; set; }

    [MaxLength(160)]
    public required string Email { get; set; }

    [MaxLength(32)]
    public string? Phone { get; set; }

    public required string PasswordHash { get; set; }

    public UserRole Role { get; set; } = UserRole.Member;

    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; set; }

    public MemberProfile? MemberProfile { get; set; }

    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}
