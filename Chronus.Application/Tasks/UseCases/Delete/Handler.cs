using Chronus.Domain.Repositories;
using MediatR;

namespace Chronus.Application.Tasks.UseCases.Delete;

public class Handler : IRequestHandler<DeleteTaskCommand, Response>
{
    private readonly ITaskItemRepository _taskItemRepository;

    public Handler(ITaskItemRepository taskItemRepository) => _taskItemRepository = taskItemRepository;

    public async Task<Response> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _taskItemRepository.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
            throw new InvalidOperationException($"Task with ID {request.Id} not found");

        await _taskItemRepository.DeleteAsync(request.Id, cancellationToken);
        return new Response(request.Id);
    }
}