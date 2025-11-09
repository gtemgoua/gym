namespace GymManagement.Api.Domain.Entities;

public enum InvoiceStatus
{
    Draft,
    Open,
    Paid,
    Void,
    Uncollectible
}

public class Invoice
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MemberId { get; set; }

    public Guid? SubscriptionId { get; set; }

    public decimal Amount { get; set; }

    public decimal? TaxAmount { get; set; }

    public decimal? DiscountAmount { get; set; }

    public string Currency { get; set; } = "USD";

    public InvoiceStatus Status { get; set; } = InvoiceStatus.Open;

    public DateTime DueAt { get; set; } = DateTime.UtcNow;

    public DateTime? PaidAt { get; set; }

    public string? ProviderInvoiceId { get; set; }

    public string? ProviderReceiptUrl { get; set; }

    public string LineItemsJson { get; set; } = "[]";

    public User? Member { get; set; }

    public Subscription? Subscription { get; set; }
}
