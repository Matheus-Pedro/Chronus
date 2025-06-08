using Chronus.Application.Services;
using Chronus.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace Chronus.Infrastructure.Payments;

public class StripePaymentService : IPaymentService
{
    private readonly SessionService _sessionService;
    private readonly IConfiguration _configuration;

    public StripePaymentService(SessionService sessionService, IConfiguration configuration)
    {
        _sessionService = sessionService;
        _configuration = configuration;
        StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];
    }

    public async Task<string> CreateCheckoutSession(int userId, SubscriptionType type, CancellationToken cancellationToken = default)
    {
        var options = new SessionCreateOptions
        {
            Mode = "subscription",
            SuccessUrl = _configuration["Stripe:SuccessUrl"],
            CancelUrl = _configuration["Stripe:CancelUrl"],
            ClientReferenceId = userId.ToString(),
            LineItems = new List<SessionLineItemOptions>
            {
                new()
                {
                    Price = _configuration[$"Stripe:Prices:{type}"]!,
                    Quantity = 1
                }
            }
        };

        var session = await _sessionService.CreateAsync(options, null, cancellationToken);
        return session.Url;
    }
}
