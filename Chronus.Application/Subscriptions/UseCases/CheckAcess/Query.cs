using Chronus.Domain.Entities;
using MediatR;

namespace Chronus.Application.Subscriptions.UseCases.CheckAcess;

public record CheckAcessQuery(string Feature) : IRequest<Response>;
