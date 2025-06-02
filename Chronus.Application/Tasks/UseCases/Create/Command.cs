using MediatR;

namespace Chronus.Application.Tasks.UseCases.Create;

public record CreateTaskCommand(string Title, string Description, DateTime DueDate) : IRequest<Response>;