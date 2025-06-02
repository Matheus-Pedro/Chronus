using MediatR;
using Chronus.Domain.Entities;
using Chronus.Domain.Repositories;
using Chronus.Application.Common.Security;

namespace Chronus.Application.Tasks.UseCases.Create;

public class Handler : IRequestHandler<CreateTaskCommand, Response>
{
    private readonly ITaskItemRepository _repo;
    private readonly ICurrentUserService _currentUserService;

    public Handler(ITaskItemRepository repo, ICurrentUserService currentUserService)
    {
        _repo = repo;
        _currentUserService = currentUserService;
    }
       
       
    public async Task<Response> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.Id;

        var task = new TaskItem(userId, request.Title, request.Description, request.DueDate);
        await _repo.AddAsync(task, cancellationToken);
        return new Response(task.Id, task.Title);
    }
}