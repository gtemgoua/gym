using GymManagement.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<MemberProfile> MemberProfiles => Set<MemberProfile>();
    public DbSet<Plan> Plans => Set<Plan>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();
    public DbSet<ClassTemplate> ClassTemplates => Set<ClassTemplate>();
    public DbSet<ClassEvent> ClassEvents => Set<ClassEvent>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Attendance> Attendance => Set<Attendance>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<LeadActivity> LeadActivities => Set<LeadActivity>();
    public DbSet<MessageTemplate> MessageTemplates => Set<MessageTemplate>();
    public DbSet<MessageLog> MessageLogs => Set<MessageLog>();
    public DbSet<AccessGrant> AccessGrants => Set<AccessGrant>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<MemberProfile>()
            .HasOne(x => x.User)
            .WithOne(x => x.MemberProfile)
            .HasForeignKey<MemberProfile>(x => x.UserId);

        modelBuilder.Entity<MemberProfile>()
            .HasOne(x => x.AccessGrant)
            .WithOne(x => x.MemberProfile)
            .HasForeignKey<AccessGrant>(x => x.MemberProfileId);

        modelBuilder.Entity<Plan>()
            .Property(x => x.Price)
            .HasColumnType("numeric(10,2)");

        modelBuilder.Entity<Invoice>()
            .Property(x => x.Amount)
            .HasColumnType("numeric(10,2)");

        modelBuilder.Entity<Invoice>()
            .Property(x => x.TaxAmount)
            .HasColumnType("numeric(10,2)");

        modelBuilder.Entity<Invoice>()
            .Property(x => x.DiscountAmount)
            .HasColumnType("numeric(10,2)");

        modelBuilder.Entity<ClassEvent>()
            .Property(x => x.StartAt)
            .HasConversion(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        modelBuilder.Entity<ClassEvent>()
            .Property(x => x.EndAt)
            .HasConversion(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        base.OnModelCreating(modelBuilder);
    }
}
