# Persistência de Dados - Chronus UI

## 📋 Visão Geral

Este documento explica como foi implementado o sistema de persistência de dados no Chronus UI, os problemas identificados e as soluções implementadas para garantir que os dados sejam corretamente sincronizados com a API.

## 🔍 Problemas Identificados

### 1. **Falta de Sincronização Automática**
- **Problema**: Os dados não eram atualizados automaticamente
- **Impacto**: Interface desatualizada, inconsistências entre abas
- **Solução**: Implementação de sincronização automática com intervalos configuráveis

### 2. **Tratamento Inadequado de Erros**
- **Problema**: Erros de API não eram tratados adequadamente
- **Impacto**: Falhas silenciosas, dados perdidos
- **Solução**: Sistema robusto de tratamento de erros com logs detalhados

### 3. **Updates Otimistas Sem Rollback**
- **Problema**: UI atualizava sem confirmar sucesso da API
- **Impacto**: Interface mostrava dados incorretos em caso de falha
- **Solução**: Implementação de rollback automático em caso de erro

### 4. **Ausência de Estados de Loading**
- **Problema**: Usuário não recebia feedback durante operações
- **Impacto**: Experiência de usuário ruim, operações duplicadas
- **Solução**: Estados de loading e feedback visual adequados

## 🛠 Soluções Implementadas

### 1. **Sistema de Sincronização Automática**

#### Hook `useDataSync`
```typescript
const { syncNow, lastSync, isAutoSyncEnabled } = useDataSync({
  enableAutoSync: true,
  syncInterval: 30000, // 30 segundos
  enableBackgroundSync: true,
  onSyncSuccess: (data) => console.log('Sync realizado:', data),
  onSyncError: (error) => console.error('Erro no sync:', error)
});
```

#### Funcionalidades:
- ✅ **Sincronização Periódica**: A cada 30 segundos por padrão
- ✅ **Sincronização em Background**: Quando app ganha foco ou conecta à internet
- ✅ **Sincronização Manual**: Método `syncNow()` para forçar sincronização
- ✅ **Detecção de Mudanças**: Listener para mudanças no localStorage

### 2. **Melhorias no Hook `useTasks`**

#### Tratamento Robusto de Erros
```typescript
const loadTasks = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    const userTasks = await TaskService.getUserTasks();
    
    // Verificação de segurança
    if (!Array.isArray(userTasks)) {
      console.warn('Resposta inválida da API');
      setTasks([]);
      return;
    }
    
    setTasks(userTasks);
  } catch (err) {
    // Tratamento específico para erros de autenticação
    if (err.status === 401) {
      setTasks([]);
      setError('Sessão expirada. Faça login novamente.');
    } else {
      setError(err.message || 'Erro ao carregar tarefas');
    }
  } finally {
    setLoading(false);
  }
}, []);
```

#### Updates Otimistas com Rollback
```typescript
const updateTask = useCallback(async (id, taskData) => {
  // Update otimista - atualiza UI imediatamente
  const originalTasks = [...tasks];
  setTasks(prevTasks => 
    prevTasks.map(task => 
      task.id === id ? { ...task, ...taskData } : task
    )
  );

  try {
    // Enviar para API
    const updatedTask = await TaskService.updateTask(id, taskData);
    
    // Atualizar com dados reais do servidor
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? updatedTask : task
      )
    );
  } catch (apiError) {
    // Rollback em caso de erro
    console.error('Erro na API, revertendo mudança:', apiError);
    setTasks(originalTasks);
    throw apiError;
  }
}, [tasks]);
```

### 3. **Melhorias no TaskService**

#### Logs Detalhados
```typescript
static async getUserTasks(): Promise<TaskItem[]> {
  try {
    console.log('📋 TaskService - Iniciando requisição getUserTasks');
    console.log('🔗 URL:', `${this.baseUrl}/user`);
    
    const response = await apiClient.get<TaskItem[]>(`${this.baseUrl}/user`);
    
    console.log('✅ TaskService - Sucesso:', {
      total: response.length,
      completed: response.filter(task => !!task.completedAt).length,
      pending: response.filter(task => !task.completedAt).length
    });
    
    return response;
  } catch (error) {
    console.error('❌ TaskService - Erro detalhado:', {
      message: error.message,
      status: error.status,
      url: `${this.baseUrl}/user`,
      stack: error.stack
    });
    
    throw new Error(`Erro ao carregar tarefas: ${error.message}`);
  }
}
```

#### Validações de Resposta
```typescript
// Verificar se recebemos um ID válido
if (!response.id) {
  console.error('API não retornou ID da tarefa criada:', response);
  throw new Error('API não retornou ID da tarefa criada');
}
```

### 4. **Sistema de Testes de Persistência**

#### Arquivo `persistence-test.ts`
```typescript
// Executar todos os testes
await PersistenceTest.runAllTests({
  email: 'user@example.com',
  password: 'password123'
});

// Diagnosticar problemas
PersistenceTest.diagnoseCommonIssues();
```

#### Testes Implementados:
1. **Teste de Conectividade**: Verifica se API está acessível
2. **Teste de Autenticação**: Valida fluxo de login e token
3. **Teste CRUD**: Testa operações create, read, update, delete
4. **Teste de Sincronização**: Verifica consistência de dados

## 🔧 Como Usar

### 1. **Em Componentes React**

```typescript
import { useTasks } from '@/lib/hooks/use-tasks';
import { useTaskSync } from '@/lib/hooks/use-data-sync';

function TasksPage() {
  const { 
    tasks, 
    loading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask,
    refreshTasks 
  } = useTasks();
  
  // Sincronização automática
  const { syncNow } = useTaskSync((updatedTasks) => {
    console.log('Tarefas sincronizadas:', updatedTasks);
  });

  return (
    <div>
      {loading && <div>Carregando...</div>}
      {error && <div>Erro: {error}</div>}
      
      <button onClick={syncNow}>
        Sincronizar Agora
      </button>
      
      <button onClick={refreshTasks}>
        Atualizar Tarefas
      </button>
      
      {/* Lista de tarefas */}
    </div>
  );
}
```

### 2. **Executar Testes de Persistência**

```typescript
import { runPersistenceTests, diagnosePersistence } from '@/lib/api/persistence-test';

// Executar testes completos
runPersistenceTests({
  email: 'seu@email.com',
  password: 'suasenha'
});

// Apenas diagnóstico
diagnosePersistence();
```

### 3. **Monitoramento via Console**

Abra as **DevTools > Console** para ver logs detalhados:

```
🔄 Configurando sincronização automática a cada 30 segundos
📋 TaskService - Iniciando requisição getUserTasks
🔗 URL: http://localhost:5150/api/task/user
✅ TaskService - Sucesso: { total: 5, completed: 2, pending: 3 }
✅ Tarefas sincronizadas: 5
```

## 📊 Indicadores de Estado

### 1. **Estados de Loading**
```typescript
const { loading, error } = useTasks();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### 2. **Status de Sincronização**
```typescript
const { lastSync, isAutoSyncEnabled } = useDataSync();

console.log('Última sincronização:', new Date(lastSync));
console.log('Sync automático ativo:', isAutoSyncEnabled);
```

### 3. **Informações de Debug**
```typescript
import { syncUtils } from '@/lib/hooks/use-data-sync';

const syncInfo = syncUtils.getSyncInfo();
console.log('Status da sincronização:', syncInfo);
// Output: { isOnline: true, isAuthenticated: true, canSync: true }
```

## 🐛 Resolução de Problemas

### 1. **Dados Não Aparecem na UI**

**Possíveis Causas:**
- API não está rodando
- Token de autenticação expirado
- Erro de rede

**Solução:**
```typescript
// 1. Verificar conectividade
const isConnected = await PersistenceTest.testConnection();

// 2. Verificar autenticação
if (AuthService.isTokenExpired()) {
  // Redirecionar para login
}

// 3. Forçar sincronização
syncNow();
```

### 2. **Mudanças Não São Salvas**

**Possíveis Causas:**
- Erro na requisição para API
- Dados inválidos sendo enviados
- Problemas de autenticação

**Solução:**
```typescript
try {
  await createTask(taskData);
} catch (error) {
  console.error('Erro ao criar tarefa:', error);
  // Tratar erro específico
}
```

### 3. **Interface Desatualizada**

**Solução:**
```typescript
// Forçar atualização manual
await refreshTasks();

// Ou configurar sincronização mais frequente
useDataSync({ syncInterval: 10000 }); // 10 segundos
```

## 🎯 Melhores Práticas

### 1. **Sempre Usar Estados de Loading**
```typescript
const { loading } = useTasks();
return loading ? <Skeleton /> : <TaskList />;
```

### 2. **Tratar Erros Adequadamente**
```typescript
const { error } = useTasks();
if (error) {
  return <Toast type="error" message={error} />;
}
```

### 3. **Sincronização Inteligente**
```typescript
// Sincronizar apenas quando necessário
useEffect(() => {
  if (document.visibilityState === 'visible') {
    syncNow();
  }
}, []);
```

### 4. **Logs para Debug**
```typescript
// Em desenvolvimento, sempre habilitar logs detalhados
if (process.env.NODE_ENV === 'development') {
  console.log('Status da persistência:', syncUtils.getSyncInfo());
}
```

## 📈 Monitoramento e Métricas

### Métricas Importantes:
- **Tempo de Sincronização**: Quanto tempo leva para sincronizar
- **Taxa de Erro**: Porcentagem de falhas nas operações
- **Frequência de Sync**: Quantas vezes sincroniza por minuto
- **Dados Atualizados**: Timestamp da última atualização

### Ferramentas de Debug:
1. **Console do Browser**: Logs detalhados
2. **Network Tab**: Monitorar requisições HTTP
3. **Application Tab**: Verificar localStorage
4. **Redux DevTools**: Se usando Redux

## 🔄 Atualizações e Melhorias Futuras

### Próximos Passos:
1. **Cache Inteligente**: Implementar cache com TTL
2. **Offline Support**: Funcionalidade offline com sync quando conectar
3. **Real-time Updates**: WebSockets para atualizações em tempo real
4. **Compressão de Dados**: Otimizar transferência de dados
5. **Batch Operations**: Agrupar operações para melhor performance

---

**Última Atualização**: Dezembro 2024  
**Versão**: 1.0.0  
**Autor**: Equipe Chronus 