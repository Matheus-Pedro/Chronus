using Chronus.Domain.Entities;
using Chronus.Domain.Repositories;
using Chronus.Application.Common.Security;
using MediatR;

namespace Chronus.Application.Users.UseCases.Register;

public class Handler : IRequestHandler<CreateUserCommand, Response>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public Handler(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Response> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var hash = _passwordHasher.Hash(request.Password);
        var user = new User(request.Name, request.Email, hash);
        
        await _userRepository.AddAsync(user, cancellationToken);
        return new Response(user.Id);
    }
}