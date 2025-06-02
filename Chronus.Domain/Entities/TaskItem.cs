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
        DueDate = dueDate;
    }

    public void Update(string title, string description, DateTime dueDate)
    {
        Title = title;
        Description = description;
        DueDate = dueDate;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Complete()
    {
        CompletedAt = DateTime.UtcNow;
    }

    public void Uncomplete()
    {
        CompletedAt = null;
    }
}