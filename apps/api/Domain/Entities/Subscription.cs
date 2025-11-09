namespace GymManagement.Api.Domain.Entities;

public enum SubscriptionStatus
{
    Active,
    Trialing,
    PastDue,
    Canceled,
    Paused
}

public enum PaymentProvider
{
    Stripe,
    Square,
    AuthorizeNet
}

public class Subscription
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MemberId { get; set; }

    public Guid PlanId { get; set; }

    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;

    public DateTime StartDate { get; set; } = DateTime.UtcNow;

    public DateTime? EndDate { get; set; }

    public DateTime? NextBillingAt { get; set; }

    public DateTime? CurrentPeriodEnd { get; set; }

    public PaymentProvider PaymentProvider { get; set; } = PaymentProvider.Stripe;

    public string? PaymentProviderSubscriptionId { get; set; }

    public bool CancellationRequested { get; set; }

    public DateTime? CanceledAt { get; set; }

    public DateTime? DelinquentSince { get; set; }

    public User? Member { get; set; }

    public Plan? Plan { get; set; }

    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
