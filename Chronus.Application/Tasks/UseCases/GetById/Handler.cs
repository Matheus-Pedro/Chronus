using Chronus.Domain.Repositories;
using MediatR;

namespace Chronus.Application.Tasks.UseCases.GetById;

public class Handler : IRequestHandler<GetTaskByIdQuery, Response>
{
    private readonly ITaskItemRepository _taskItemRepository;

    public Handler(ITaskItemRepository taskItemRepository) => _taskItemRepository = taskItemRepository;

    public async Task<Response> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        var task = await _taskItemRepository.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
            throw new InvalidOperationException($"Task with ID {request.Id} not found");
        
        return new Response(task);
    }
}