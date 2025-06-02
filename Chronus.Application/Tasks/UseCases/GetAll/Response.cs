using Chronus.Domain.Entities;

namespace Chronus.Application.Tasks.UseCases.GetAll;

public record Response(IEnumerable<TaskItem> Tasks);