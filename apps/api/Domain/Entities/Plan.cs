namespace GymManagement.Api.Domain.Entities;

public enum BillingPeriod
{
    Weekly,
    Monthly,
    Quarterly,
    Annual,
    DropIn
}

public class Plan
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Name { get; set; }

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public BillingPeriod BillingPeriod { get; set; } = BillingPeriod.Monthly;

    public int? CreditsPerPeriod { get; set; }

    public int? ContractMonths { get; set; }

    public string? CancellationPolicy { get; set; }

    public string? FreezeRules { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public decimal? TaxRate { get; set; }

    public bool Active { get; set; } = true;

    public bool AllowProration { get; set; } = true;

    public bool AllowDropIn { get; set; }

    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
