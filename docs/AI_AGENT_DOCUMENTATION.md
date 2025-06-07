# Documentação para Agentes de IA - Projeto Chronus

## 📋 Visão Geral do Projeto

**Chronus** é uma aplicação de gerenciamento de tarefas com sistema de assinaturas baseado em features. Utiliza arquitetura Clean Architecture com .NET 8 e PostgreSQL.

### 🎯 Propósito
- Sistema de gerenciamento de tarefas pessoais
- Controle de acesso baseado em tipos de assinatura
- API REST para integração com frontends

## 🏗️ Arquitetura do Sistema

### Estrutura de Pastas
```
Chronus/
├── Chronus.Api/              # API REST Controllers
├── Chronus.Application/      # Use Cases e Application Services
├── Chronus.Domain/          # Entidades, Enums e Regras de Negócio
└── Chronus.Infrastructure/  # Implementações de Repositórios e Serviços
    ├── Postgres/            # Entity Framework e Repositórios
    ├── Identity/            # Autenticação
    └── Subscription/        # Serviços de Assinatura
```

### Padrões Arquiteturais
- **Clean Architecture**: Separação clara de responsabilidades
- **CQRS**: Usando MediatR para Commands e Queries
- **Repository Pattern**: Abstração da camada de dados
- **Dependency Injection**: Configurado em cada camada

## 🎲 Modelo de Domínio

### Entidades Principais

#### User
```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; } // Único
    public string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

#### TaskItem
```csharp
public class TaskItem
{
    public Guid Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public string Title { get; set; } // Max 200 chars
    public string Description { get; set; } // Max 1000 chars
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? DueDate { get; set; }
}
```

#### Subscription
```csharp
public class Subscription
{
    public Guid Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public SubscriptionType Type { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CanceledAt { get; set; }
    public bool IsActive { get; } // Computed property
    public bool IsCanceled { get; } // Computed property
}
```

### Enums

#### SubscriptionType
```csharp
public enum SubscriptionType
{
    Free = 1,     // Recursos básicos
    Pro = 2,      // Recursos avançados
    Premium = 3   // Todos os recursos
}
```

### Mapeamento de Features por Assinatura
```csharp
Dictionary<SubscriptionType, List<string>> FeatureMap = new()
{
    [Free] = ["BasicReports"],
    [Pro] = ["BasicReports", "AdvancedAnalytics"],
    [Premium] = ["BasicReports", "AdvancedAnalytics", "PrioritySupport"]
};
```

## 🔄 Use Cases e Padrões

### Estrutura de Use Cases
Cada use case segue o padrão:
```
UseCases/
├── {Action}/
    ├── Command.cs|Query.cs  # Request
    ├── Handler.cs           # MediatR Handler
    ├── Response.cs          # Response DTO
    └── Validator.cs         # FluentValidation (quando necessário)
```

### Use Cases Implementados

#### Tasks
- `Create`: Criar nova tarefa
- `Update`: Atualizar tarefa existente
- `GetAll`: Listar todas as tarefas
- `GetById`: Buscar tarefa por ID
- `GetByMyUserId`: Buscar tarefas do usuário atual
- `Complete`: Marcar como completa
- `Delete`: Remover tarefa

#### Users
- `Register`: Registrar novo usuário

#### Subscriptions
- `CheckAccess`: Verificar acesso a feature

### Padrão de Handler
```csharp
public class Handler : IRequestHandler<TRequest, TResponse>
{
    private readonly IDependency _dependency;
    private readonly ICurrentUserService _currentUserService;

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.Id;
        // Lógica do use case
        return new Response(result);
    }
}
```

## 🗄️ Camada de Dados

### Banco de Dados: PostgreSQL
- **Connection String**: Configurada em `appsettings.json`
- **Migrations**: Entity Framework Core
- **Context**: `ChronusDbContext`

### Repositórios Implementados
- `IUserRepository` → `UserRepository`
- `ITaskItemRepository` → `TaskItemRepository`
- `ISubscriptionRepository` → `SubscriptionRepository`

### Padrão de Repositório
```csharp
public interface IRepository<T>
{
    Task<T?> GetByIdAsync(TId id, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(TId id, CancellationToken cancellationToken = default);
}
```

## 🔐 Segurança e Autenticação

### Serviços de Segurança
- `ICurrentUserService`: Obtém ID do usuário atual
- `IPasswordHasher`: Hash e verificação de senhas
- `ISubscriptionService`: Controle de acesso a features

### Controle de Acesso
```csharp
// Verificar se usuário tem acesso a uma feature
var hasAccess = await _subscriptionService.HasAccessToFeature(userId, "AdvancedAnalytics");
```

## 🚀 Como Executar

### Comando para Desenvolvimento
```bash
ASPNETCORE_ENVIRONMENT=Development dotnet watch run --project Chronus.Api/Chronus.Api.csproj
```

### Configuração de Ambiente
- **appsettings.json**: Configurações de produção
- **appsettings.Development.json**: Configurações de desenvolvimento

## 📝 Padrões de Código

### Convenções de Nomenclatura
- **Classes**: PascalCase
- **Métodos**: PascalCase
- **Propriedades**: PascalCase
- **Campos privados**: _camelCase
- **Parâmetros**: camelCase

### Padrões de Async/Await
```csharp
// ✅ Correto - Método async com await
public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
{
    var result = await _service.GetAsync(cancellationToken);
    return new Response(result);
}

// ✅ Correto - Método síncrono retornando Task
public Task<Response> Handle(Request request, CancellationToken cancellationToken)
{
    var result = _service.GetSync();
    return Task.FromResult(new Response(result));
}
```

### Tratamento de Erros
- Use `InvalidOperationException` para erros de negócio
- Use `ArgumentException` para validação de parâmetros
- Prefira validação no Handler em vez de exceptions

## 🔧 Dependências Principais

### Packages por Projeto
```xml
<!-- Chronus.Api -->
<PackageReference Include="Microsoft.AspNetCore.OpenApi" />
<PackageReference Include="Swashbuckle.AspNetCore" />

<!-- Chronus.Application -->
<PackageReference Include="MediatR" />
<PackageReference Include="FluentValidation" />

<!-- Chronus.Infrastructure -->
<PackageReference Include="Microsoft.EntityFrameworkCore" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" />
```

## 🎯 TODO List Atual

### Funcionalidades Pendentes
- **Rate Limiting por Plano**: Free: 100 req/dia, Pro: 1000 req/dia, etc.
- **Feature Toggles Dinâmicas**: Admin pode ativar funcionalidades por usuário
- **Webhook de Billing**: Integração com Stripe ou MercadoPago

### Melhorias Técnicas Sugeridas
- Implementar logging estruturado (Serilog)
- Adicionar testes unitários e de integração
- Implementar cache (Redis) para consultas frequentes
- Adicionar validação com FluentValidation em todos os use cases
- Implementar paginação nas consultas que retornam listas

## 🤖 Instruções para Agentes de IA

### Ao Modificar Código

1. **Sempre mantenha a arquitetura**: Respeite as camadas Domain → Application → Infrastructure → Api
2. **Use padrões estabelecidos**: Siga a estrutura de Use Cases existente
3. **Adicione using necessários**: Principalmente `Microsoft.EntityFrameworkCore` para métodos Async do EF
4. **Implemente CancellationToken**: Todos os métodos async devem aceitar CancellationToken
5. **Valide entrada**: Use validação no Handler ou crie Validators quando necessário

### Ao Criar Novos Use Cases

1. **Estrutura**: Crie pasta com Command/Query, Handler, Response
2. **Naming**: Use verbos para Commands (Create, Update, Delete) e substantivos para Queries (Get, List)
3. **Dependencies**: Injete apenas o que precisa (Repository, Services)
4. **Return Types**: Use Records para Response DTOs simples

### Ao Trabalhar com Banco

1. **Migrations**: Use `dotnet ef migrations add {Name}` e `dotnet ef database update`
2. **Queries**: Sempre use `cancellationToken` em métodos Entity Framework
3. **Mappings**: Configure relacionamentos e constraints na pasta Mappings/

### Resolução de Problemas Comuns

| Erro | Solução |
|------|---------|
| `ToListAsync not found` | Adicionar `using Microsoft.EntityFrameworkCore;` |
| `async method lacks await` | Remover `async` e usar `Task.FromResult()` OU adicionar `await` |
| `Cannot convert Task<bool> to Task<Response>` | Fazer `await` e encapsular em `new Response()` |
| `NotFoundException not found` | Usar `InvalidOperationException` ou criar exception customizada |

### Estrutura de Response Típica
```csharp
// Para entidade única
public record Response(Entity Entity);

// Para coleções
public record Response(IEnumerable<Entity> Entities);

// Para operações simples
public record Response(bool Success);
public record Response(Guid Id);
```

## 📞 Contexto de Negócio

O **Chronus** é um sistema de produtividade que permite:
- Usuários gerenciarem suas tarefas pessoais
- Controle de acesso baseado em planos de assinatura
- Relatórios e analytics conforme o nível de assinatura
- Futura integração com sistemas de pagamento

Este contexto ajuda na tomada de decisões sobre novas funcionalidades e modificações no sistema. 