using MediatR;

namespace Chronus.Application.Users.UseCases.Register;

public record CreateUserCommand(string Name, string Email, string Password) : IRequest<Response>;