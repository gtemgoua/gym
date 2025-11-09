namespace GymManagement.Api.Domain.Entities;

public class PaymentMethod
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MemberId { get; set; }

    public PaymentProvider Provider { get; set; } = PaymentProvider.Stripe;

    public required string ProviderPaymentToken { get; set; }

    public string? Brand { get; set; }

    public string? Last4 { get; set; }

    public int? ExpMonth { get; set; }

    public int? ExpYear { get; set; }

    public bool Default { get; set; }

    public User? Member { get; set; }
}
