# Guia de Implementação - Sistema de Tarefas Refatorado

## 🚀 Início Rápido

### 1. Usar o Hook useTasks

```typescript
import { useTasks } from '@/lib/hooks/use-tasks';

function TasksComponent() {
  const {
    tasks,           // Lista de tarefas
    loading,         // Estado de carregamento
    statistics,      // Estatísticas avançadas
    createTask,      // Função para criar tarefa
    updateTask,      // Função para atualizar
    deleteTask,      // Função para excluir
    filterTasks,     // Aplicar filtros
    searchTasks      // Buscar por texto
  } = useTasks();

  // Usar os dados e funções conforme necessário
}
```

### 2. Criar Nova Tarefa

```typescript
const handleCreateTask = async () => {
  try {
    await createTask({
      title: "Minha nova tarefa",
      description: "Descrição opcional",
      dueDate: "2024-12-31T10:00:00"  // ISO string
    });
    
    toast({
      title: "Sucesso!",
      description: "Tarefa criada com sucesso."
    });
  } catch (error) {
    toast({
      title: "Erro",
      description: error.message,
      variant: "destructive"
    });
  }
};
```

### 3. Filtrar Tarefas

```typescript
const [currentFilter, setCurrentFilter] = useState({
  status: 'ativas',
  sortBy: 'dueDate',
  sortOrder: 'asc'
});

// Aplicar filtros
const filteredTasks = filterTasks(tasks, currentFilter);

// Buscar por texto
const searchResults = searchTasks(filteredTasks, "termo de busca");
```

## 📊 Trabalhando com Estatísticas

### Acessar Estatísticas

```typescript
const { statistics } = useTasks();

// Dados disponíveis
console.log({
  total: statistics.total,                      // Total de tarefas
  completed: statistics.completed,              // Tarefas concluídas
  completionRate: statistics.completionRate,   // Taxa de conclusão (%)
  productivityScore: statistics.productivityScore, // Score 0-100%
  overdue: statistics.overdue,                 // Tarefas vencidas
  thisWeek: {
    created: statistics.thisWeek.created,      // Criadas esta semana
    completed: statistics.thisWeek.completed   // Concluídas esta semana
  }
});
```

### Exibir Cards de Estatísticas

```typescript
function StatsCards({ statistics }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.completed}</div>
          <Progress value={statistics.completionRate} />
        </CardContent>
      </Card>
      
      {/* Mais cards... */}
    </div>
  );
}
```

## 🎯 Componentes Prontos

### TaskCard Completo

```typescript
import { TaskService } from '@/lib/api/tasks';

function TaskCard({ task, onUpdate, onDelete }) {
  const statusBadge = TaskService.getTaskStatusBadge(task);
  const isOverdue = TaskService.isTaskOverdue(task);
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className={task.completedAt ? 'line-through' : ''}>
            {task.title}
          </h3>
          <Badge variant={statusBadge.variant}>
            {statusBadge.text}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-2">
            {task.description}
          </p>
        )}
        
        {task.dueDate && (
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span className={isOverdue ? 'text-red-600' : ''}>
              {TaskService.formatDueDate(task.dueDate)}
            </span>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 mt-3">
          <Button size="sm" onClick={() => onUpdate(task)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Dialog de Criação/Edição

```typescript
function TaskDialog({ task, open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (task) {
        await onSave(task.id, formData);  // Editar
      } else {
        await onSave(formData);           // Criar
      }
      onClose();
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({
                ...formData,
                title: e.target.value
              })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({
                ...formData,
                description: e.target.value
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({
                ...formData,
                dueDate: e.target.value
              })}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {task ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## 🔧 Filtros Avançados

### Componente de Filtros

```typescript
function TaskFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    status: 'todas',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-4 mb-6">
      {/* Status */}
      <Select
        value={filters.status}
        onValueChange={(value) => 
          handleFilterChange({ ...filters, status: value })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="ativas">Ativas</SelectItem>
          <SelectItem value="concluidas">Concluídas</SelectItem>
          <SelectItem value="vencidas">Vencidas</SelectItem>
          <SelectItem value="hoje">Hoje</SelectItem>
          <SelectItem value="semana">Esta Semana</SelectItem>
        </SelectContent>
      </Select>

      {/* Ordenação */}
      <Select
        value={filters.sortBy}
        onValueChange={(value) => 
          handleFilterChange({ ...filters, sortBy: value })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Data de Vencimento</SelectItem>
          <SelectItem value="createdAt">Data de Criação</SelectItem>
          <SelectItem value="title">Título</SelectItem>
          <SelectItem value="priority">Prioridade</SelectItem>
        </SelectContent>
      </Select>

      {/* Ordem */}
      <Button
        variant="outline"
        onClick={() => 
          handleFilterChange({ 
            ...filters, 
            sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
          })
        }
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### Busca em Tempo Real

```typescript
function TaskSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce para performance
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Buscar tarefas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
```

## 📱 Estados de Loading

### Skeleton Components

```typescript
function TaskCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}

function TaskListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

### Estados Condicionais

```typescript
function TasksPage() {
  const { tasks, loading, error } = useTasks();

  if (loading) return <TaskListSkeleton />;
  
  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Erro ao carregar tarefas</h3>
        <p className="text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Nenhuma tarefa</h3>
        <p className="text-muted-foreground">
          Crie sua primeira tarefa para começar!
        </p>
      </Card>
    );
  }

  return (
    <div>
      {/* Render das tarefas */}
    </div>
  );
}
```

## 🎨 Agrupamento de Tarefas

### Por Data

```typescript
function GroupedTaskList({ tasks }) {
  const taskGroups = TaskService.groupTasksByDate(tasks);

  return (
    <div className="space-y-6">
      {Object.entries(taskGroups).map(([groupName, groupTasks]) => (
        <div key={groupName}>
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
            {groupName} ({groupTasks.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Por Prioridade

```typescript
function TasksByPriority({ tasks }) {
  const priorityGroups = {
    alta: tasks.filter(t => TaskService.getTaskPriority(t) === 'alta'),
    média: tasks.filter(t => TaskService.getTaskPriority(t) === 'média'),
    baixa: tasks.filter(t => TaskService.getTaskPriority(t) === 'baixa')
  };

  return (
    <Tabs defaultValue="alta">
      <TabsList>
        <TabsTrigger value="alta">
          Alta ({priorityGroups.alta.length})
        </TabsTrigger>
        <TabsTrigger value="média">
          Média ({priorityGroups.média.length})
        </TabsTrigger>
        <TabsTrigger value="baixa">
          Baixa ({priorityGroups.baixa.length})
        </TabsTrigger>
      </TabsList>

      {Object.entries(priorityGroups).map(([priority, tasks]) => (
        <TabsContent key={priority} value={priority}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
```

## 🔄 Ações em Massa

### Seleção Múltipla

```typescript
function TasksWithBulkActions() {
  const { tasks, bulkAction } = useTasks();
  const [selectedTasks, setSelectedTasks] = useState([]);

  const toggleSelection = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const selectAll = () => {
    setSelectedTasks(tasks.map(t => t.id));
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const handleBulkComplete = async () => {
    try {
      await bulkAction(selectedTasks, 'complete');
      clearSelection();
      toast({ title: "Tarefas concluídas!" });
    } catch (error) {
      toast({ 
        title: "Erro", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div>
      {/* Controles de seleção */}
      {selectedTasks.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">
            {selectedTasks.length} selecionada(s)
          </span>
          <Button size="sm" onClick={handleBulkComplete}>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Concluir
          </Button>
          <Button size="sm" variant="outline" onClick={clearSelection}>
            Limpar
          </Button>
        </div>
      )}

      {/* Lista de tarefas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map(task => (
          <TaskCardWithSelection
            key={task.id}
            task={task}
            selected={selectedTasks.includes(task.id)}
            onToggleSelection={toggleSelection}
          />
        ))}
      </div>
    </div>
  );
}
```

## 💡 Dicas e Boas Práticas

### 1. Performance

```typescript
// Use memo para cálculos pesados
const expensiveStats = useMemo(() => {
  return TaskService.calculateStatistics(tasks);
}, [tasks]);

// Use callback para funções estáveis
const handleCreate = useCallback(async (data) => {
  await createTask(data);
}, [createTask]);
```

### 2. Error Handling

```typescript
// Sempre trate erros
const handleAction = async () => {
  try {
    await someTaskAction();
  } catch (error) {
    console.error('Task action failed:', error);
    toast({
      title: "Erro",
      description: error.message || "Algo deu errado",
      variant: "destructive"
    });
  }
};
```

### 3. Acessibilidade

```typescript
// Use labels corretos
<Button
  aria-label={`Completar tarefa: ${task.title}`}
  onClick={() => completeTask(task.id)}
>
  <CheckCircle2 className="h-4 w-4" />
</Button>

// Forneça feedback para screen readers
<div role="status" aria-live="polite">
  {loading ? 'Carregando tarefas...' : `${tasks.length} tarefas carregadas`}
</div>
```

### 4. Responsividade

```typescript
// Grid responsivo
<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {tasks.map(task => <TaskCard key={task.id} task={task} />)}
</div>

// Breakpoints customizados
const isMobile = useMediaQuery('(max-width: 768px)');
const columns = isMobile ? 1 : 3;
```

## 🚀 Extensões

### Adicionar Nova Funcionalidade

```typescript
// 1. Extender o hook
export function useTasks() {
  // ... código existente
  
  const addTaskTag = useCallback(async (taskId, tag) => {
    // Implementar lógica
  }, []);

  return {
    // ... retornos existentes
    addTaskTag
  };
}

// 2. Atualizar o serviço
export class TaskService {
  // ... métodos existentes
  
  static async addTag(taskId: string, tag: string) {
    return ApiClient.post(`/api/tasks/${taskId}/tags`, { tag });
  }
}

// 3. Usar na interface
function TaskCard({ task }) {
  const { addTaskTag } = useTasks();
  
  const handleAddTag = async (tag) => {
    await addTaskTag(task.id, tag);
  };
  
  // ... resto do componente
}
```

Este guia fornece tudo que você precisa para trabalhar com o sistema de tarefas refatorado. Para mais detalhes, consulte a documentação completa em `TASK_SYSTEM_REFACTOR.md`. 