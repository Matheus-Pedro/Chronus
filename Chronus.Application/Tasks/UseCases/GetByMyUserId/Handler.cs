using MediatR;
using Chronus.Domain.Repositories;
using Chronus.Application.Common.Security;

namespace Chronus.Application.Tasks.UseCases.GetByMyUserId;

public class Handler : IRequestHandler<GetTaskByMyUserIdQuery, Response>
{
    private readonly ITaskItemRepository _taskItemRepository;
    private readonly ICurrentUserService _currentUserService;

    public Handler(ITaskItemRepository taskItemRepository, ICurrentUserService currentUserService)
    {
        _taskItemRepository = taskItemRepository;
        _currentUserService = currentUserService;
    }

    public async Task<Response> Handle(GetTaskByMyUserIdQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.Id;
        var tasks = await _taskItemRepository.GetByUserIdAsync(userId, cancellationToken);
        return new Response(tasks);
    }
}