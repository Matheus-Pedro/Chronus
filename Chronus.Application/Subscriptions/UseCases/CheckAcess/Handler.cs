using MediatR;
using Chronus.Application.Services;
using Chronus.Application.Common.Security;

namespace Chronus.Application.Subscriptions.UseCases.CheckAcess;

public class Handler : IRequestHandler<CheckAcessQuery, Response>
{
    private readonly ISubscriptionService _subscriptionService;
    private readonly ICurrentUserService _currentUserService;

    public Handler(ISubscriptionService subscriptionService, ICurrentUserService currentUserService)
    {
        _subscriptionService = subscriptionService;
        _currentUserService = currentUserService;
    }

    public async Task<Response> Handle(CheckAcessQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.Id;
        var hasAccess = await _subscriptionService.HasAccessToFeature(userId, request.Feature);
        return new Response(hasAccess);
    }
}