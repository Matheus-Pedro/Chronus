using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Chronus.Domain.Repositories;
using Chronus.Infrastructure.Postgres.Repositories;
using Chronus.Application.Common.Security;
using Chronus.Infrastructure.Identity;
using Chronus.Infrastructure.Chronus.Infrastrucuture.Subscription;
using Chronus.Application.Services;
using Chronus.Infrastructure.Payments;
using Stripe.Checkout;

namespace Chronus.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<ChronusDbContext>(options =>
            options.UseNpgsql(config.GetConnectionString("ChronusDb")));

        services.AddScoped<ITaskItemRepository, TaskItemRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<ISubscriptionService, SubscriptionService>();
        services.AddSingleton<SessionService>();
        services.AddScoped<IPaymentService, StripePaymentService>();

        return services; 
    }
}