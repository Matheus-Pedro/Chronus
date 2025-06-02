using MediatR;

namespace Chronus.Application.Users.UseCases.Login;

public record LoginUserCommand(string Email, string Password) : IRequest<Response>;