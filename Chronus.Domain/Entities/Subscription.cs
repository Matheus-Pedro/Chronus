using Chronus.Domain.Enums;

namespace Chronus.Domain.Entities;

public class Subscription
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int UserId { get; set; } = 0;
    public User User { get; set; } = null!;
    public SubscriptionType Type { get; set; } = SubscriptionType.Free;
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; } = null;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CanceledAt { get; set; } = null;
    public bool IsActive => EndDate == null || EndDate > DateTime.UtcNow;
    public bool IsCanceled => CanceledAt != null;

    public Subscription() { }

    public Subscription(Guid id, int userId, SubscriptionType type, DateTime startDate, DateTime? endDate)
    {
        if (endDate.HasValue && endDate < startDate)
            throw new ArgumentException("End date must be after start date");
        
        Id = id;
        UserId = userId;
        Type = type;
        StartDate = startDate;
        EndDate = endDate;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        CanceledAt = DateTime.UtcNow;
    }
}