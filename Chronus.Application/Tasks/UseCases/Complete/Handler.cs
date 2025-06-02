using Chronus.Domain.Repositories;
using MediatR;

namespace Chronus.Application.Tasks.UseCases.Complete;

public class Handler : IRequestHandler<CompleteTaskCommand, Response>
{
    private readonly ITaskItemRepository _taskItemRepository;

    public Handler(ITaskItemRepository taskItemRepository) => _taskItemRepository = taskItemRepository;

    public async Task<Response> Handle(CompleteTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _taskItemRepository.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
            throw new InvalidOperationException($"Task with ID {request.Id} not found");

        if (task.CompletedAt != null)
            throw new InvalidOperationException($"Task with ID {request.Id} is already completed");

        task.Complete();
        await _taskItemRepository.UpdateAsync(task, cancellationToken);
        return new Response(task);
    }
}