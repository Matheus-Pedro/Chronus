using Chronus.Domain.Entities;

namespace Chronus.Application.Tasks.UseCases.GetByMyUserId;

public record Response(IEnumerable<TaskItem> Tasks);