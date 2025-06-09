using Chronus.Domain.Repositories;
using MediatR;

namespace Chronus.Application.Tasks.UseCases.Update;

public class Handler : IRequestHandler<UpdateTaskCommand, Response>
{
    private readonly ITaskItemRepository _taskItemRepository;

    public Handler(ITaskItemRepository taskItemRepository) => _taskItemRepository = taskItemRepository;

    public async Task<Response> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _taskItemRepository.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
            throw new InvalidOperationException($"Task with ID {request.Id} not found");

        // Garantir que a DueDate seja UTC
        var dueDate = request.DueDate.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(request.DueDate, DateTimeKind.Utc)
            : request.DueDate.ToUniversalTime();

        task.Update(request.Title, request.Description, dueDate);
        await _taskItemRepository.UpdateAsync(task, cancellationToken);
        return new Response(task);
    }
}