using Chronus.Domain.Enums;

namespace Chronus.Application.Services;

public interface ISubscriptionService
{
    Task<bool> HasAccessToFeature(int userId, string feature);
    Task<SubscriptionType> GetSubscriptionType(int userId);
}