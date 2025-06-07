using Microsoft.EntityFrameworkCore;
using Chronus.Domain.Entities;
using Chronus.Infrastructure.Postgres.Mappings;

namespace Chronus.Infrastructure;

public class ChronusDbContext : DbContext
{
    public DbSet<TaskItem> TaskItems { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }

    public ChronusDbContext(DbContextOptions<ChronusDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ChronusDbContext).Assembly);
    }
}