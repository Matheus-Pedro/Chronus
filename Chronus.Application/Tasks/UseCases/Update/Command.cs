using MediatR;

namespace Chronus.Application.Tasks.UseCases.Update;

public record UpdateTaskCommand(Guid Id, string Title, string Description, DateTime DueDate) : IRequest<Response>;