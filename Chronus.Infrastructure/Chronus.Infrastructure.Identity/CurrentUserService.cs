using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Chronus.Application.Common.Security;
using Microsoft.AspNetCore.Http;

namespace Chronus.Infrastructure.Identity;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContext;

    public CurrentUserService(IHttpContextAccessor httpContext)
    {
        _httpContext = httpContext;
    }

    public int Id =>
        int.Parse(_httpContext.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                   ?? throw new UnauthorizedAccessException("User ID not found."));

    public string Email =>
        _httpContext.HttpContext?.User?.FindFirst(ClaimTypes.Email)?.Value
        ?? throw new UnauthorizedAccessException("Email not found.");
}
