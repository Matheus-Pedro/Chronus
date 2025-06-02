using Chronus.Domain.Repositories;
using MediatR;

namespace Chronus.Application.Tasks.UseCases.Uncomplete;

public class Handler : IRequestHandler<UncompleteTaskCommand, Response>
{
    private readonly ITaskItemRepository _taskItemRepository;

    public Handler(ITaskItemRepository taskItemRepository) => _taskItemRepository = taskItemRepository;

    public async Task<Response> Handle(UncompleteTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _taskItemRepository.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
            throw new InvalidOperationException($"Task with ID {request.Id} not found");

        if (task.CompletedAt == null)
            throw new InvalidOperationException($"Task with ID {request.Id} is not completed");

        task.Uncomplete();
        await _taskItemRepository.UpdateAsync(task, cancellationToken);
        return new Response(task);
    }
}