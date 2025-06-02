using MediatR;
using Chronus.Domain.Repositories;
using Chronus.Application.Common.Security;

namespace Chronus.Application.Users.UseCases.Login;

public class Handler : IRequestHandler<LoginUserCommand, Response>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public Handler(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Response> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null)
        {
            throw new InvalidOperationException("User not found");
        }

        var isValid = _passwordHasher.Verify(request.Password, user.PasswordHash);
        if (!isValid)
        {
            throw new InvalidOperationException("Invalid password");
        }

        var accessToken = _jwtTokenGenerator.Generate(user);
        return new Response(accessToken);
    }
}