using GymManagement.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GymManagement.Api.Infrastructure;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        await db.Database.MigrateAsync(cancellationToken);

        if (await db.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var owner = new User
        {
            Name = "Demo Owner",
            Email = "owner@gym.test",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("ChangeMe123!"),
            Role = UserRole.Owner
        };

        var staff = new User
        {
            Name = "Coach Carter",
            Email = "coach@gym.test",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("ChangeMe123!"),
            Role = UserRole.Staff
        };

        var plan = new Plan
        {
            Name = "Unlimited Monthly",
            Description = "Unlimited classes",
            Price = 159,
            BillingPeriod = BillingPeriod.Monthly,
            CreditsPerPeriod = null,
            ContractMonths = 12,
            AllowProration = true
        };

        db.Users.AddRange(owner, staff);
        db.Plans.Add(plan);

        var members = new List<User>();
        for (var i = 1; i <= 20; i++)
        {
            var member = new User
            {
                Name = $"Member {i}",
                Email = $"member{i}@gym.test",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("ChangeMe123!"),
                Role = UserRole.Member
            };
            member.MemberProfile = new MemberProfile
            {
                Status = i % 5 == 0 ? MemberStatus.Trial : MemberStatus.Active
            };
            members.Add(member);
        }

        db.Users.AddRange(members);

        await db.SaveChangesAsync(cancellationToken);

        var subs = members.Take(10).Select(m => new Subscription
        {
            MemberId = m.Id,
            PlanId = plan.Id,
            Status = SubscriptionStatus.Active,
            StartDate = DateTime.UtcNow
        });

        db.Subscriptions.AddRange(subs);

        db.ClassTemplates.Add(new ClassTemplate
        {
            Name = "Morning Conditioning",
            DefaultCoachId = staff.Id,
            DefaultCapacity = 20,
            DefaultDurationMinutes = 60,
            CreditCost = 1,
            Location = "Main Floor"
        });

        await db.SaveChangesAsync(cancellationToken);
    }
}
