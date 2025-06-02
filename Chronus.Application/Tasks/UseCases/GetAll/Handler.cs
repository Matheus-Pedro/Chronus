using MediatR;
using Chronus.Domain.Repositories;

namespace Chronus.Application.Tasks.UseCases.GetAll;

public class Handler : IRequestHandler<GetAllTasksQuery, Response>
{
    private readonly ITaskItemRepository _taskItemRepository;

    public Handler(ITaskItemRepository taskItemRepository) => _taskItemRepository = taskItemRepository;

    public async Task<Response> Handle(GetAllTasksQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _taskItemRepository.GetAllAsync(cancellationToken);
        return new Response(tasks);
    }
}