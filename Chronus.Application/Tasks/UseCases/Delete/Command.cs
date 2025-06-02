using MediatR;

namespace Chronus.Application.Tasks.UseCases.Delete;

public record DeleteTaskCommand(Guid Id) : IRequest<Response>;
