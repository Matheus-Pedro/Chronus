using Chronus.Application.Common.Security;
using Chronus.Application.Services;
using MediatR;

namespace Chronus.Application.Subscriptions.UseCases.CreateCheckout;

public class Handler : IRequestHandler<CreateCheckoutCommand, Response>
{
    private readonly IPaymentService _paymentService;
    private readonly ICurrentUserService _currentUserService;

    public Handler(IPaymentService paymentService, ICurrentUserService currentUserService)
    {
        _paymentService = paymentService;
        _currentUserService = currentUserService;
    }

    public async Task<Response> Handle(CreateCheckoutCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.Id;
        var url = await _paymentService.CreateCheckoutSession(userId, request.Type, cancellationToken);
        return new Response(url);
    }
}
