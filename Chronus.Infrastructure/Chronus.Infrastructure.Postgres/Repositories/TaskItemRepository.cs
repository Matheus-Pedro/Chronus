using Chronus.Domain.Entities;
using Chronus.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Chronus.Infrastructure.Postgres.Repositories;

public class TaskItemRepository : ITaskItemRepository
{
    private readonly ChronusDbContext _context;

    public TaskItemRepository(ChronusDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.TaskItems.FindAsync(id, cancellationToken);
    }

    public async Task<IEnumerable<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.TaskItems.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        _context.TaskItems.Add(task);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        _context.TaskItems.Update(task);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var task = await _context.TaskItems.FindAsync(id, cancellationToken);
        if (task != null)
        {
            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<IEnumerable<TaskItem>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.TaskItems
            .Where(t => t.UserId == userId)
            .ToListAsync(cancellationToken);
    }
}