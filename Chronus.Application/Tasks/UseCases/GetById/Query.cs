using MediatR;

namespace Chronus.Application.Tasks.UseCases.GetById;

public record GetTaskByIdQuery(Guid Id) : IRequest<Response>;