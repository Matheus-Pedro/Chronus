using Chronus.Domain.Entities;
using Chronus.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Chronus.Infrastructure.Postgres.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly ChronusDbContext _context;

    public SubscriptionRepository(ChronusDbContext context)
    {
        _context = context;
    }
    public async Task AddAsync(Subscription subscription, CancellationToken cancellationToken = default)
    {
        _context.Subscriptions.Add(subscription);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Subscription?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions.FindAsync(id, cancellationToken);
    }

    public async Task<Subscription?> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions
            .Where(t => t.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken);
    }
    public async Task<IEnumerable<Subscription>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Subscriptions.ToListAsync(cancellationToken);
    }
    public async Task UpdateAsync(Subscription subscription, CancellationToken cancellationToken = default)
    {
        var existingSubscription = await _context.Subscriptions.FindAsync(subscription.Id, cancellationToken);
        if (existingSubscription == null)
        {
            throw new InvalidOperationException("Subscription not found");
        }
        _context.Subscriptions.Update(subscription);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var subscription = await _context.Subscriptions.FindAsync(id, cancellationToken);
        if (subscription != null)
        {
            _context.Subscriptions.Remove(subscription);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}