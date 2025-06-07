using Chronus.Domain.Repositories;
using Chronus.Domain.Entities;
using Chronus.Domain.Enums;
using Chronus.Application.Services;


namespace Chronus.Infrastructure.Chronus.Infrastrucuture.Subscription;

public class SubscriptionService : ISubscriptionService
{
    private readonly ISubscriptionRepository _subscriptionRepository;

    private static readonly Dictionary<SubscriptionType, List<string>> FeatureMap = new()
    {
        [SubscriptionType.Free] = new() { "BasicReports" },
        [SubscriptionType.Pro] = new() { "BasicReports", "AdvancedAnalytics" },
        [SubscriptionType.Premium] = new() { "BasicReports", "AdvancedAnalytics", "PrioritySupport" },
    };

    public SubscriptionService(ISubscriptionRepository subscriptionRepository)
    {
        _subscriptionRepository = subscriptionRepository;
    }

    public async Task<bool> HasAccessToFeature(int userId, string feature)
    {
        var subscription = await _subscriptionRepository.GetByUserIdAsync(userId);
        return subscription.IsActive && FeatureMap[subscription.Type].Contains(feature);
    }

    public async Task<SubscriptionType> GetSubscriptionType(int userId)
    {
        return (await _subscriptionRepository.GetByUserIdAsync(userId))?.Type ?? SubscriptionType.Free;
    }
}