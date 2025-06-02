using MediatR;

namespace Chronus.Application.Tasks.UseCases.GetAll;

public record GetAllTasksQuery : IRequest<Response>;
