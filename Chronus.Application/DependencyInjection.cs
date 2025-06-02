using Microsoft.Extensions.DependencyInjection;
using Chronus.Domain.Repositories;

namespace Chronus.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(x => 
        {
            x.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
        });

        return services;
    }
}