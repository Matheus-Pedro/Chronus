"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  MoreHorizontal, 
  User,
  Flag,
  CheckCircle2,
  Circle,
  Star,
  Clock,
  RefreshCw,
  AlertTriangle,
  Plus
} from "lucide-react";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useTaskSync } from "@/lib/hooks/use-data-sync";
import { TaskService } from "@/lib/api/tasks";
import type { TaskItem } from "@/lib/types/api";
import { useToast } from "@/lib/hooks/use-toast";

// ==========================================
// INTERFACES
// ==========================================

interface TaskListProps {
  searchTerm?: string;
  activeFilters?: any;
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export const TaskList = ({ searchTerm = "", activeFilters }: TaskListProps) => {
  const { toast } = useToast();
  
  // Hooks de dados
  const { 
    tasks: allTasks, 
    loading, 
    error, 
    refreshTasks,
    completeTask,
    uncompleteTask,
    deleteTask,
    updateTask,
    filterTasks,
    searchTasks
  } = useTasks();

  // Sincronização automática
  const { syncNow, lastSync } = useTaskSync((updatedTasks) => {
    console.log('📋 Tarefas sincronizadas automaticamente:', updatedTasks.length);
  });

  // ==========================================
  // PROCESSAMENTO DE DADOS
  // ==========================================

  // Filtrar e buscar tarefas
  let tasks = allTasks;
  
  // Aplicar busca se houver termo
  if (searchTerm.trim()) {
    tasks = searchTasks(searchTerm);
  }
  
  // Aplicar filtros se houver
  if (activeFilters) {
    tasks = filterTasks(activeFilters);
  }

  // ==========================================
  // HANDLERS DE AÇÕES
  // ==========================================

  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        await uncompleteTask(taskId);
        toast({
          title: "Tarefa desmarcada",
          description: "A tarefa foi desmarcada como concluída.",
        });
      } else {
        await completeTask(taskId);
        toast({
          title: "Tarefa concluída!",
          description: "Parabéns! A tarefa foi marcada como concluída.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da tarefa.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshTasks();
      toast({
        title: "Atualizado!",
        description: "Lista de tarefas atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as tarefas.",
        variant: "destructive",
      });
    }
  };

  const handleSync = async () => {
    try {
      await syncNow();
      toast({
        title: "Sincronizado!",
        description: "Dados sincronizados com o servidor.",
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os dados.",
        variant: "destructive",
      });
    }
  };

  // ==========================================
  // FUNÇÕES AUXILIARES
  // ==========================================

  const getPriorityColor = (task: TaskItem) => {
    const priority = TaskService.getTaskPriority(task);
    switch (priority) {
      case "alta": return "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";
      case "média": return "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";
      case "baixa": return "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400";
      default: return "border-gray-300 bg-gray-50 text-gray-700";
    }
  };

  const getStatusBadge = (task: TaskItem) => {
    return TaskService.getTaskStatusBadge(task);
  };

  const formatDate = (dateString: string) => {
    return TaskService.formatDueDate(dateString);
  };

  const getUserInitials = (name: string = "Usuário") => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ==========================================
  // ESTADOS DE LOADING E ERRO
  // ==========================================

  if (loading) {
  return (
    <div className="space-y-2">
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">Status</div>
            <div className="col-span-4 lg:col-span-3">Tarefa</div>
            <div className="hidden lg:block lg:col-span-2">Projeto</div>
            <div className="col-span-2 lg:col-span-2">Prioridade</div>
            <div className="col-span-2 lg:col-span-2">Prazo</div>
            <div className="hidden lg:block lg:col-span-1">Responsável</div>
            <div className="col-span-3 lg:col-span-1">Ações</div>
          </div>
        </CardContent>
      </Card>

        {/* Loading skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <div className="col-span-4 lg:col-span-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
                <div className="hidden lg:block lg:col-span-2">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="col-span-2 lg:col-span-2">
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="col-span-2 lg:col-span-2">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="hidden lg:block lg:col-span-1">
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <div className="col-span-3 lg:col-span-1">
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-6 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-destructive">Erro ao carregar tarefas</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button onClick={handleSync} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ==========================================
  // ESTADO VAZIO
  // ==========================================

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <div className="space-y-2">
            <Circle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">
              {searchTerm || activeFilters ? "Nenhuma tarefa encontrada" : "Nenhuma tarefa criada"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || activeFilters 
                ? "Tente ajustar os filtros ou termo de busca."
                : "Que tal criar sua primeira tarefa?"
              }
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            {(searchTerm || activeFilters) && (
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            )}
            <Button onClick={handleSync} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO PRINCIPAL
  // ==========================================

  return (
    <div className="space-y-2">
      {/* Header com controles */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground flex-1">
              <div className="col-span-1">Status</div>
              <div className="col-span-4 lg:col-span-3">Tarefa</div>
              <div className="hidden lg:block lg:col-span-2">Criado em</div>
              <div className="col-span-2 lg:col-span-2">Prioridade</div>
              <div className="col-span-2 lg:col-span-2">Prazo</div>
              <div className="hidden lg:block lg:col-span-1">Status</div>
              <div className="col-span-3 lg:col-span-1">Ações</div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button onClick={handleSync} variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tarefas */}
      {tasks.map((task) => {
        const statusBadge = getStatusBadge(task);
        const isCompleted = !!task.completedAt;
        const isOverdue = TaskService.isTaskOverdue(task);
        
        return (
        <Card 
          key={task.id} 
          className={`group hover:shadow-md transition-all duration-200 border-l-4 ${
              isCompleted
              ? "border-l-green-500 bg-green-50/20 dark:bg-green-950/10" 
                : isOverdue
                  ? "border-l-red-500 bg-red-50/20 dark:bg-red-950/10"
                  : getPriorityColor(task).includes('red')
                ? "border-l-red-500" 
                    : getPriorityColor(task).includes('yellow')
                  ? "border-l-yellow-500"
                  : "border-l-gray-300"
          }`}
        >
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Status Checkbox */}
                <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                    onClick={() => handleToggleComplete(task.id, isCompleted)}
                >
                    {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  )}
                </Button>
              </div>

              {/* Task Title & Description */}
              <div className="col-span-4 lg:col-span-3 min-w-0">
                <div className="space-y-1">
                  <h3 className={`font-semibold text-sm leading-tight ${
                      isCompleted ? "line-through text-muted-foreground" : ""
                  }`}>
                    {task.title}
                  </h3>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>ID: {task.id}</span>
                      {task.updatedAt && (
                        <span>• Atualizado: {new Date(task.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                </div>
              </div>

                {/* Created Date */}
              <div className="hidden lg:block lg:col-span-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString("pt-BR", { 
                        day: "numeric", 
                        month: "short",
                        year: "numeric"
                      })}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="col-span-2 lg:col-span-2">
                  <Badge variant="outline" className={`text-xs border ${getPriorityColor(task)}`}>
                  <Flag className="h-3 w-3 mr-1" />
                    {TaskService.getTaskPriority(task) === "alta" ? "Alta" : 
                     TaskService.getTaskPriority(task) === "média" ? "Média" : "Baixa"}
                </Badge>
              </div>

              {/* Due Date */}
              <div className="col-span-2 lg:col-span-2">
                  {task.dueDate ? (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-xs ${isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                        {formatDate(task.dueDate)}
                  </span>
                      {isOverdue && (
                    <Badge variant="destructive" className="text-xs py-0 px-1">
                      !
                    </Badge>
                  )}
                </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem prazo</span>
                  )}
              </div>

                {/* Status Badge */}
              <div className="hidden lg:block lg:col-span-1">
                  <Badge variant={statusBadge.variant} className={`text-xs ${statusBadge.color}`}>
                    {statusBadge.text}
                  </Badge>
              </div>

              {/* Actions */}
              <div className="col-span-3 lg:col-span-1 flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteTask(task.id)}
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
                {/* Status Badge for mobile */}
                <div className="lg:hidden">
                    <Badge variant={statusBadge.variant} className={`text-xs ${statusBadge.color}`}>
                      {isCompleted ? "✓" : isOverdue ? "!" : "○"}
                  </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Footer com informações */}
      {tasks.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Exibindo {tasks.length} de {allTasks.length} tarefa{allTasks.length !== 1 ? 's' : ''}
              </span>
              {lastSync > 0 && (
                <span>
                  Última sincronização: {new Date(lastSync).toLocaleTimeString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 