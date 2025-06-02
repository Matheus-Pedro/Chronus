namespace Chronus.Application.Common.Security;

public interface ICurrentUserService
{
    int Id { get; }
    string Email { get; }
}