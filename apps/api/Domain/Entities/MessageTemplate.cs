namespace GymManagement.Api.Domain.Entities;

public enum MessageChannel
{
    Email,
    Sms
}

public enum MessageStatus
{
    Queued,
    Sent,
    Failed
}

public class MessageTemplate
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Key { get; set; }

    public MessageChannel Channel { get; set; } = MessageChannel.Email;

    public string? Subject { get; set; }

    public required string Body { get; set; }

    public string? MetadataJson { get; set; }
}

public class MessageLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? TemplateId { get; set; }

    public Guid? RecipientId { get; set; }

    public MessageChannel Channel { get; set; } = MessageChannel.Email;

    public required string ToAddress { get; set; }

    public MessageStatus Status { get; set; } = MessageStatus.Queued;

    public string PayloadJson { get; set; } = "{}";

    public string? Error { get; set; }

    public MessageTemplate? Template { get; set; }

    public User? Recipient { get; set; }
}
