using Chronus.Domain.Enums;
using MediatR;

namespace Chronus.Application.Subscriptions.UseCases.CreateCheckout;

public record CreateCheckoutCommand(SubscriptionType Type) : IRequest<Response>;
