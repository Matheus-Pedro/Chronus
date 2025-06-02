using MediatR;

namespace Chronus.Application.Tasks.UseCases.Uncomplete;

public record UncompleteTaskCommand(Guid Id) : IRequest<Response>;