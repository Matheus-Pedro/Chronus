namespace Chronus.Domain.Entities;

public class TaskItem
{
    public Guid Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public DateTime? DueDate { get; set; }

    public TaskItem(){}

    public TaskItem(int userId, string title, string description, DateTime dueDate)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = title;
        Description = description;
        
        // Garantir que todas as datas sejam UTC
        DueDate = EnsureUtc(dueDate);
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(string title, string description, DateTime dueDate)
    {
        Title = title;
        Description = description;
        DueDate = EnsureUtc(dueDate);
        UpdatedAt = DateTime.UtcNow;
    }

    public void Complete()
    {
        CompletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Uncomplete()
    {
        CompletedAt = null;
        UpdatedAt = DateTime.UtcNow;
    }

    private static DateTime EnsureUtc(DateTime dateTime)
    {
        return dateTime.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(dateTime, DateTimeKind.Utc)
            : dateTime.ToUniversalTime();
    }
}