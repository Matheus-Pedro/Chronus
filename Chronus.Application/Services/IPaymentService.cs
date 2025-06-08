using Chronus.Domain.Enums;

namespace Chronus.Application.Services;

public interface IPaymentService
{
    Task<string> CreateCheckoutSession(int userId, SubscriptionType type, CancellationToken cancellationToken = default);
}
