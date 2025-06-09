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
        Console.WriteLine($"🔄 StripePaymentService.CreateCheckoutSession - userId: {userId}, type: {type}");
        
        // Verificar se é plano Free
        if (type == SubscriptionType.Free)
        {
            Console.WriteLine("⚠️ Tentativa de criar checkout para plano Free - não permitido");
            throw new InvalidOperationException("Não é possível criar checkout para plano gratuito");
        }

        // Obter o Price ID da configuração
        var priceId = _configuration[$"Stripe:Prices:{type}"];
        Console.WriteLine($"💰 Price ID encontrado: {priceId} para tipo: {type}");
        
        if (string.IsNullOrEmpty(priceId))
        {
            Console.WriteLine($"❌ Price ID não encontrado na configuração para tipo: {type}");
            throw new InvalidOperationException($"Price ID não configurado para o plano {type}");
        }

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
                    Price = priceId,
                    Quantity = 1
                }
            }
        };

        Console.WriteLine($"🚀 Criando sessão Stripe com options: Mode={options.Mode}, Price={priceId}, UserId={userId}");

        var session = await _sessionService.CreateAsync(options, null, cancellationToken);
        
        Console.WriteLine($"✅ Sessão criada com sucesso: {session.Id}, URL: {session.Url}");
        
        return session.Url;
    }
}
