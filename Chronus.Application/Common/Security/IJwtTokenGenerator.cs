using Chronus.Domain.Entities;

namespace Chronus.Application.Common.Security;

public interface IJwtTokenGenerator
{
    string Generate(User user);
}