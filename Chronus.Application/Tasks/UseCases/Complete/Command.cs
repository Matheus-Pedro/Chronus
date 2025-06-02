using MediatR;

namespace Chronus.Application.Tasks.UseCases.Complete;

public record CompleteTaskCommand(Guid Id) : IRequest<Response>;