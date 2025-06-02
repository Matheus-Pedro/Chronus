using Chronus.Domain.Entities;
using Chronus.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Chronus.Infrastructure.Postgres.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ChronusDbContext _context;

    public UserRepository(ChronusDbContext context) => _context = context;

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FindAsync(id, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Users.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}