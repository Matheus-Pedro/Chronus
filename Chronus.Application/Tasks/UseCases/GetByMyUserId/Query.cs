using MediatR;

namespace Chronus.Application.Tasks.UseCases.GetByMyUserId;

public record GetTaskByMyUserIdQuery() : IRequest<Response>;