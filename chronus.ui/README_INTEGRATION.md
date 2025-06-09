# 🚀 Chronus Frontend - Integração com Backend

## 📋 Resumo da Implementação

Este projeto implementa uma integração completa entre o frontend Next.js 14 e a API .NET 8 do Chronus, incluindo:

- ✅ **Autenticação JWT** completa com login/registro
- ✅ **Gerenciamento de tarefas** CRUD completo
- ✅ **Hooks personalizados** para estado reativo
- ✅ **Cliente HTTP** com interceptadores
- ✅ **Tipos TypeScript** baseados na API
- ✅ **Atualizações otimistas** para melhor UX
- ✅ **Proteção de rotas** automática
- ✅ **Tratamento de erros** robusto

## 🏗️ Arquitetura Implementada

### Camada de API (`lib/api/`)
```
lib/api/
├── client.ts     # Cliente HTTP base com interceptadores
├── auth.ts       # Serviços de autenticação (login/register/logout)
└── tasks.ts      # Serviços de tarefas (CRUD completo)
```

### Camada de Hooks (`lib/hooks/`)
```
lib/hooks/
├── use-auth.ts   # Hook de autenticação com estado reativo
└── use-tasks.ts  # Hook de gerenciamento de tarefas
```

### Tipos TypeScript (`lib/types/`)
```
lib/types/
└── api.ts        # Interfaces baseadas na API .NET
```

## 🔐 Sistema de Autenticação

### Funcionalidades Implementadas

1. **Login/Registro**: Formulários completos com validação
2. **JWT Storage**: Tokens salvos no localStorage
3. **Auto-redirect**: Redirecionamento automático para login
4. **Token Validation**: Verificação automática de expiração
5. **User Context**: Estado global do usuário autenticado

### Exemplo de Uso

```typescript
// Em qualquer componente
const { user, isAuthenticated, login, logout } = useAuth();

// Login
await login({ email: "user@test.com", password: "123456" });

// Verificar autenticação
if (isAuthenticated) {
  console.log("Usuário logado:", user.name);
}

// Logout
await logout();
```

## 📝 Sistema de Tarefas

### Funcionalidades Implementadas

1. **CRUD Completo**: Criar, ler, atualizar, deletar tarefas
2. **Filtros Avançados**: Por status, prioridade, data
3. **Busca em Tempo Real**: Busca por título/descrição
4. **Estatísticas**: Cálculos automáticos de produtividade
5. **Atualizações Otimistas**: UI atualizada instantaneamente

### Exemplo de Uso

```typescript
// Em componentes de dashboard
const { 
  tasks, 
  loading, 
  statistics, 
  createTask, 
  completeTask, 
  deleteTask 
} = useTasks();

// Criar nova tarefa
await createTask({
  title: "Nova tarefa",
  description: "Descrição da tarefa",
  dueDate: "2024-12-31T23:59:59Z"
});

// Marcar como concluída
await completeTask("task-id");

// Estatísticas automáticas
console.log(`${statistics.completed}/${statistics.total} tarefas concluídas`);
```

## 🛠️ Cliente HTTP

### Recursos Implementados

1. **Base URL Configurável**: Via variável de ambiente
2. **Headers Automáticos**: Content-Type e Authorization
3. **Timeout**: 30 segundos por requisição
4. **Error Handling**: Conversão para exceções tipadas
5. **Token Injection**: JWT adicionado automaticamente

### Configuração

```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:5150

// Uso automático em todos os serviços
const response = await apiClient.get('/api/task/user');
```

## 🔄 Gerenciamento de Estado

### Hooks Implementados

#### `useAuth()`
- Estado de autenticação reativo
- Persistência entre sessões
- Sincronização entre abas
- Redirecionamento automático

#### `useTasks()`
- Lista de tarefas com cache local
- Atualizações otimistas
- Filtros e busca em tempo real
- Estatísticas calculadas automaticamente

### Atualizações Otimistas

```typescript
// Exemplo: UI atualizada instantaneamente
const completeTask = async (id: string) => {
  // 1. Atualizar UI imediatamente
  updateLocalState(id, { completed: true });
  
  try {
    // 2. Sincronizar com servidor
    await api.completeTask(id);
  } catch (error) {
    // 3. Reverter se houver erro
    updateLocalState(id, { completed: false });
    showError(error);
  }
};
```

## 🎨 Componentes Atualizados

### Formulários de Autenticação
- `LoginForm`: Integrado com `useAuth()`
- `RegisterForm`: Validação de senha e termos

### Dashboard
- `TaskDashboard`: Usa hooks reais para dados
- `TaskGrid/TaskList`: Operações CRUD funcionais
- `TaskStats`: Estatísticas calculadas em tempo real

### Proteção de Rotas
```typescript
// Proteção automática
function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null; // Auto-redirect
  
  return <TaskDashboard />;
}
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5150
```

### 2. Executar Backend

```bash
cd ../Chronus.Api
dotnet restore
dotnet run
```

### 3. Executar Frontend

```bash
npm install
npm run dev
```

## 🧪 Testando a Integração

### 1. Teste Manual

1. Acesse `http://localhost:3000`
2. Clique em "Cadastrar" 
3. Preencha o formulário de registro
4. Será redirecionado para o dashboard
5. Teste criar/completar/deletar tarefas

### 2. Teste com API

```bash
# Testar registro
curl -X POST http://localhost:5150/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@test.com","password":"123456"}'

# Testar login
curl -X POST http://localhost:5150/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@test.com","password":"123456"}'
```

## 🔍 Debug e Monitoramento

### Logs Implementados

```typescript
// Logs automáticos em desenvolvimento
console.log('API Request:', method, endpoint, data);
console.log('API Response:', response);
console.error('API Error:', error);
```

### DevTools

1. **Network Tab**: Ver requisições HTTP
2. **Application Tab**: Ver localStorage (tokens)
3. **Console**: Ver logs de debug
4. **React DevTools**: Ver estado dos hooks

## 🛡️ Segurança

### Medidas Implementadas

1. **JWT Validation**: Tokens verificados automaticamente
2. **Auto Logout**: Em caso de token expirado
3. **Route Protection**: Páginas protegidas automaticamente
4. **HTTPS Ready**: Configurado para produção
5. **CORS Handling**: Configuração adequada

## 📊 Performance

### Otimizações

1. **Lazy Loading**: Componentes carregados sob demanda
2. **Memoization**: Hooks otimizados com useCallback
3. **Local Cache**: Dados persistidos localmente
4. **Optimistic Updates**: UI responsiva
5. **Bundle Optimization**: Tree-shaking ativo

## 🐛 Troubleshooting

### Problemas Comuns

#### API não conecta
```
TypeError: Failed to fetch
```
**Solução**: Verificar se a API está rodando em `localhost:5150`

#### CORS Error
```
Access blocked by CORS policy
```
**Solução**: Verificar configuração CORS na API

#### Token Expirado
```
401 Unauthorized
```
**Solução**: Fazer logout e login novamente

## 📈 Próximos Passos

### Melhorias Planejadas

1. **Refresh Tokens**: Renovação automática
2. **Offline Mode**: Funcionalidade offline
3. **Real-time**: WebSockets para updates
4. **Push Notifications**: Notificações do sistema
5. **Advanced Filters**: Mais opções de filtro

### Monitoramento

1. **Error Tracking**: Implementar Sentry
2. **Analytics**: Tracking de uso
3. **Performance**: Métricas de performance
4. **Health Checks**: Monitoramento da API

## 📞 Suporte

### Como Reportar Problemas

1. Verificar logs do console
2. Testar endpoints com curl
3. Verificar variáveis de ambiente
4. Consultar documentação da API

### Recursos Úteis

- [Documentação da API](../docs/API_INTEGRATION.md)
- [Swagger da API](http://localhost:5150/swagger)
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query)

---

**Status**: ✅ **Integração Completa e Funcional**

**Última atualização**: Dezembro 2024

**Desenvolvido por**: Equipe Chronus 