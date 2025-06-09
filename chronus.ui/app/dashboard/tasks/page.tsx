"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Clock, CheckCircle2, Circle, 
         MoreHorizontal, Trash2, Edit, Eye, Square, CheckSquare, 
         ArrowUpDown, AlertCircle, TrendingUp, CalendarDays, 
         FileText, Users, Target, Activity, ArrowLeft, Lightbulb } from 'lucide-react';
import { useTasks } from '@/lib/hooks/use-tasks';
import type { TaskFilter, TaskStatus, SortField, SortOrder } from '@/lib/hooks/use-tasks';
import { TaskService } from '@/lib/api/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/lib/hooks/use-toast';
import { CreateTaskRequest, UpdateTaskRequest, TaskItem } from '@/lib/types/api';
import { useRouter } from 'next/navigation';
import { TaskSuggestions, SuggestionsExplorer, InlineTaskSuggestions } from "@/components/dashboard/task-suggestions";
import { Separator } from '@/components/ui/separator';

// ==========================================
// UTILITÁRIOS
// ==========================================

const formatSafeDate = (dateValue: string | Date | undefined | null): string => {
  if (!dateValue) return 'Data não disponível';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return new Intl.DateTimeFormat('pt-BR').format(date);
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

const formatDateForInput = (dateValue: string | Date | undefined | null): string => {
  if (!dateValue) return '';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Erro ao formatar data para input:', error);
    return '';
  }
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function TasksPage() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    tasks,
    loading,
    error,
    statistics,
    createTask,
    updateTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    bulkAction,
    filterTasks,
    searchTasks,
    refreshTasks,
    clearError
  } = useTasks();

  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>({
    status: 'todas',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'grid' | 'calendar'>('list');

  // ==========================================
  // DADOS FILTRADOS E PESQUISADOS
  // ==========================================

  const filteredAndSearchedTasks = useMemo(() => {
    let result = filterTasks(currentFilter);
    if (searchTerm.trim()) {
      result = searchTasks(searchTerm);
    }
    return result;
  }, [currentFilter, searchTerm, filterTasks, searchTasks]);

  const taskGroups = useMemo(() => {
    return TaskService.groupTasksByDate(filteredAndSearchedTasks);
  }, [filteredAndSearchedTasks]);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleCreateTask = useCallback(async (data: CreateTaskRequest) => {
    try {
      await createTask(data);
      setShowTaskDialog(false);
      toast({
        title: "Sucesso!",
        description: "Tarefa criada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar tarefa.",
        variant: "destructive",
      });
    }
  }, [createTask, toast]);

  const handleUpdateTask = useCallback(async (id: string, data: Partial<UpdateTaskRequest>) => {
    try {
      await updateTask(id, data);
      
      // Aguardar um momento para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fechar o dialog apenas após sucesso
      setEditingTask(null);
      
      toast({
        title: "Sucesso!",
        description: "Tarefa atualizada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar tarefa.",
        variant: "destructive",
      });
    }
  }, [updateTask, toast]);

  const handleToggleComplete = useCallback(async (task: TaskItem) => {
    try {
      if (task.completedAt) {
        await uncompleteTask(task.id);
      } else {
        await completeTask(task.id);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status da tarefa.",
        variant: "destructive",
      });
    }
  }, [completeTask, uncompleteTask, toast]);

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
      toast({
        title: "Sucesso!",
        description: "Tarefa excluída com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir tarefa.",
        variant: "destructive",
      });
    }
  }, [deleteTask, toast]);

  const handleBulkAction = useCallback(async (action: 'complete' | 'uncomplete' | 'delete') => {
    if (selectedTasks.length === 0) return;
    
    try {
      await bulkAction(selectedTasks, action);
      setSelectedTasks([]);
      
      const actionText = {
        complete: 'concluídas',
        uncomplete: 'marcadas como pendentes',
        delete: 'excluídas'
      }[action];
      
      toast({
        title: "Sucesso!",
        description: `${selectedTasks.length} tarefa(s) ${actionText}.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro na ação em massa.",
        variant: "destructive",
      });
    }
  }, [selectedTasks, bulkAction, toast]);

  const handleSuggestionSelect = useCallback((suggestion: any) => {
    console.log("Sugestão selecionada:", suggestion);
    // Você pode implementar lógica adicional aqui
  }, []);

  // ==========================================
  // UTILITÁRIOS
  // ==========================================

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const selectAllTasks = () => {
    const allTaskIds = filteredAndSearchedTasks.map(task => task.id);
    setSelectedTasks(allTaskIds);
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  if (loading) {
    return <TasksPageSkeleton />;
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header com seta voltar */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
            <p className="text-muted-foreground">
              Gerencie suas tarefas e acompanhe seu progresso
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Explorador de Sugestões */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Explorar Ferramentas
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="sr-only">Explorar ferramentas e metodologias</DialogTitle>
                </DialogHeader>
                <SuggestionsExplorer />
              </DialogContent>
            </Dialog>

            <TaskCreateDialog 
              onCreateTask={handleCreateTask}
              open={showTaskDialog}
              onOpenChange={setShowTaskDialog}
              onSuggestionSelect={handleSuggestionSelect}
            />
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <TaskStatisticsCards statistics={statistics} />

      {/* Filtros e Controles */}
      <TaskFiltersAndControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        selectedTasks={selectedTasks}
        onBulkAction={handleBulkAction}
        onSelectAll={selectAllTasks}
        onClearSelection={clearSelection}
        currentView={currentView}
        onViewChange={setCurrentView}
        totalTasks={filteredAndSearchedTasks.length}
      />

      {/* Lista de Tarefas */}
      <TasksContent
        tasks={filteredAndSearchedTasks}
        taskGroups={taskGroups}
        selectedTasks={selectedTasks}
        onToggleSelection={toggleTaskSelection}
        onToggleComplete={handleToggleComplete}
        onEditTask={setEditingTask}
        onDeleteTask={handleDeleteTask}
        currentView={currentView}
        loading={loading}
        error={error}
      />

      {/* Dialog de Edição */}
      {editingTask && (
        <TaskEditDialog
          task={editingTask}
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
}

// ==========================================
// COMPONENTE: CARDS DE ESTATÍSTICAS
// ==========================================

function TaskStatisticsCards({ statistics }: { statistics: any }) {
  const cards = [
    {
      title: "Total de Tarefas",
      value: statistics.total,
      description: "Todas as suas tarefas",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Concluídas",
      value: statistics.completed,
      description: `${statistics.completionRate}% do total`,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Ativas",
      value: statistics.active,
      description: "Pendentes de conclusão",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Vencidas",
      value: statistics.overdue,
      description: "Precisam de atenção",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Score de Produtividade",
      value: `${statistics.productivityScore}%`,
      description: "Baseado em performance",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Esta Semana",
      value: statistics.thisWeek.completed,
      description: `${statistics.thisWeek.created} criadas`,
      icon: CalendarDays,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ==========================================
// COMPONENTE: FILTROS E CONTROLES
// ==========================================

interface TaskFiltersAndControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  selectedTasks: string[];
  onBulkAction: (action: 'complete' | 'uncomplete' | 'delete') => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  currentView: 'list' | 'grid' | 'calendar';
  onViewChange: (view: 'list' | 'grid' | 'calendar') => void;
  totalTasks: number;
}

function TaskFiltersAndControls({
  searchTerm,
  onSearchChange,
  currentFilter,
  onFilterChange,
  selectedTasks,
  onBulkAction,
  onSelectAll,
  onClearSelection,
  currentView,
  onViewChange,
  totalTasks
}: TaskFiltersAndControlsProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Busca */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar tarefas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={currentFilter.status || 'todas'}
          onValueChange={(value: TaskStatus) => 
            onFilterChange({ ...currentFilter, status: value })
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

        <Select
          value={currentFilter.sortBy || 'dueDate'}
          onValueChange={(value: SortField) => 
            onFilterChange({ ...currentFilter, sortBy: value })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Data de Vencimento</SelectItem>
            <SelectItem value="createdAt">Data de Criação</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="priority">Prioridade</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => 
            onFilterChange({ 
              ...currentFilter, 
              sortOrder: currentFilter.sortOrder === 'asc' ? 'desc' : 'asc' 
            })
          }
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Ações em Massa */}
      {selectedTasks.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedTasks.length} selecionada(s)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('complete')}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Concluir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('uncomplete')}
          >
            <Circle className="h-4 w-4 mr-1" />
            Desfazer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('delete')}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            Limpar
          </Button>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-muted-foreground">
        {totalTasks} tarefa(s)
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: CONTEÚDO DAS TAREFAS
// ==========================================

interface TasksContentProps {
  tasks: TaskItem[];
  taskGroups: Record<string, TaskItem[]>;
  selectedTasks: string[];
  onToggleSelection: (taskId: string) => void;
  onToggleComplete: (task: TaskItem) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  currentView: 'list' | 'grid' | 'calendar';
  loading: boolean;
  error: string | null;
}

function TasksContent({
  tasks,
  taskGroups,
  selectedTasks,
  onToggleSelection,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  currentView,
  loading,
  error
}: TasksContentProps) {
  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Erro ao carregar tarefas</h3>
        <p className="text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
        <p className="text-muted-foreground">
          Crie sua primeira tarefa para começar!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(taskGroups).map(([groupName, groupTasks]) => {
        // Filtrar tarefas válidas no componente também
        const validGroupTasks = groupTasks.filter(task => {
          if (!task.id) {
            console.warn('TasksContent: tarefa sem ID encontrada no grupo', groupName, task);
            return false;
          }
          return true;
        });
        
        if (validGroupTasks.length === 0) {
          return null; // Não renderizar grupos vazios
        }
        
        return (
          <div key={groupName}>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              {groupName} ({validGroupTasks.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {validGroupTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  selected={selectedTasks.includes(task.id)}
                  onToggleSelection={onToggleSelection}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// COMPONENTE: CARD DE TAREFA
// ==========================================

interface TaskCardProps {
  task: TaskItem;
  selected: boolean;
  onToggleSelection: (taskId: string) => void;
  onToggleComplete: (task: TaskItem) => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (taskId: string) => void;
}

function TaskCard({
  task,
  selected,
  onToggleSelection,
  onToggleComplete,
  onEdit,
  onDelete
}: TaskCardProps) {
  const statusBadge = TaskService.getTaskStatusBadge(task);
  const isCompleted = !!task.completedAt;
  const isOverdue = TaskService.isTaskOverdue(task);

  return (
    <Card className={`transition-all hover:shadow-md ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelection(task.id)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={() => onToggleComplete(task)}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant={statusBadge.variant}
              className={`text-xs ${statusBadge.color}`}
            >
              {statusBadge.text}
            </Badge>
            
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className={`font-semibold ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className={`text-sm text-muted-foreground mt-1 ${isCompleted ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}
          </div>

          {task.dueDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span className={isOverdue && !isCompleted ? 'text-red-600 font-medium' : ''}>
                {TaskService.formatDueDate(task.dueDate)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Criada em {formatSafeDate(task.createdAt)}
            </div>
            
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==========================================
// COMPONENTE: DIALOG DE CRIAÇÃO
// ==========================================

interface TaskCreateDialogProps {
  onCreateTask: (data: CreateTaskRequest) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuggestionSelect?: (suggestion: any) => void;
}

function TaskCreateDialog({ onCreateTask, open, onOpenChange, onSuggestionSelect }: TaskCreateDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onCreateTask({
      title: formData.title.trim(),
      description: formData.description.trim() || '',
      dueDate: formData.dueDate || ''
    });
    
    setFormData({ title: '', description: '', dueDate: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
          <DialogDescription>
            Adicione uma nova tarefa à sua lista.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Digite o título da tarefa..."
              required
            />
          </div>

          {/* Sugestões Inline */}
          {formData.title.length > 3 && (
            <div className="space-y-3">
              <Separator />
              <InlineTaskSuggestions
                title={formData.title}
                description={formData.description}
                maxSuggestions={2}
                onSuggestionSelect={onSuggestionSelect}
              />
              <Separator />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Digite uma descrição opcional..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Sugestões Detalhadas */}
          {formData.title && formData.description && (
            <div className="space-y-3">
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Sugestões Inteligentes</span>
                </div>
                <TaskSuggestions
                  task={{
                    title: formData.title,
                    description: formData.description,
                    dueDate: formData.dueDate
                  }}
                  trigger={
                    <Button type="button" variant="outline" size="sm">
                      Ver Todas
                    </Button>
                  }
                  onSuggestionSelect={onSuggestionSelect}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// COMPONENTE: DIALOG DE EDIÇÃO
// ==========================================

interface TaskEditDialogProps {
  task: TaskItem;
  open: boolean;
  onClose: () => void;
  onUpdateTask: (id: string, data: Partial<UpdateTaskRequest>) => void;
}

function TaskEditDialog({ task, open, onClose, onUpdateTask }: TaskEditDialogProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: formatDateForInput(task.dueDate)
  });

  // Atualizar formData quando task mudar
  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: formatDateForInput(task.dueDate)
    });
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onUpdateTask(task.id, {
      title: formData.title.trim(),
      description: formData.description.trim() || '',
      dueDate: formData.dueDate || ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Faça alterações na sua tarefa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-dueDate">Data de Vencimento</Label>
            <Input
              id="edit-dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// COMPONENTE: SKELETON DE LOADING
// ==========================================

function TasksPageSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Skeleton className="h-10 w-80" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-5" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-4 w-32 mb-3" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <div className="flex space-x-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 