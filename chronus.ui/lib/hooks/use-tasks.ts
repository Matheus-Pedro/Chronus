"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TaskService } from '@/lib/api/tasks';
import type { TaskItem, CreateTaskRequest, UpdateTaskRequest } from '@/lib/types/api';

// ==========================================
// INTERFACES E TIPOS
// ==========================================

export interface UseTasksReturn {
  tasks: TaskItem[];
  loading: boolean;
  error: string | null;
  statistics: TaskStatistics;
  refreshTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskRequest) => Promise<TaskItem>;
  updateTask: (id: string, taskData: Partial<UpdateTaskRequest>) => Promise<TaskItem>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  bulkAction: (taskIds: string[], action: BulkAction) => Promise<void>;
  filterTasks: (filter: TaskFilter) => TaskItem[];
  searchTasks: (searchTerm: string) => TaskItem[];
  clearError: () => void;
  isTaskOverdue: (task: TaskItem) => boolean;
  getTaskPriority: (task: TaskItem) => TaskPriority;
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  dateRange?: DateRange;
  tags?: string[];
}

export interface TaskStatistics {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  dueTodayCount: number;
  dueThisWeekCount: number;
  completionRate: number;
  averageCompletionTime: number;
  productivityScore: number;
  priority: {
    high: number;
    medium: number;
    low: number;
  };
  thisWeek: {
    created: number;
    completed: number;
  };
  trends: {
    completionTrend: number;
    creationTrend: number;
  };
}

export type TaskStatus = 'todas' | 'ativas' | 'concluidas' | 'vencidas' | 'hoje' | 'semana';
export type TaskPriority = 'alta' | 'média' | 'baixa';
export type SortField = 'dueDate' | 'createdAt' | 'title' | 'priority' | 'completedAt';
export type SortOrder = 'asc' | 'desc';
export type BulkAction = 'complete' | 'uncomplete' | 'delete' | 'setDueDate' | 'setPriority';

export interface DateRange {
  start: Date;
  end: Date;
}

// ==========================================
// HOOK PRINCIPAL - USE TASKS
// ==========================================

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // CARREGAR TAREFAS
  // ==========================================

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Carregando tarefas do servidor...');
      const userTasks = await TaskService.getUserTasks();
      
      // Verificar se a resposta é válida
      if (!Array.isArray(userTasks)) {
        console.warn('⚠️ Resposta da API não é um array, usando array vazio');
        setTasks([]);
        return;
      }
      
      // Validar e filtrar tarefas com IDs válidos
      const validTasks = userTasks.filter((task, index) => {
        if (!task.id) {
          console.warn(`⚠️ Tarefa sem ID encontrada no índice ${index}:`, task);
          return false;
        }
        return true;
      });
      
      // Verificar duplicações de ID
      const uniqueTasks = validTasks.filter((task, index, array) => {
        const firstIndex = array.findIndex(t => t.id === task.id);
        if (firstIndex !== index) {
          console.warn(`⚠️ Tarefa duplicada encontrada (ID: ${task.id}):`, task);
          return false;
        }
        return true;
      });
      
      console.log('✅ Tarefas carregadas com sucesso:', {
        total: userTasks.length,
        valid: validTasks.length,
        unique: uniqueTasks.length
      });
      
      setTasks(uniqueTasks);
    } catch (err: any) {
      console.error('❌ Erro ao carregar tarefas:', err);
      
      // Se for erro de autenticação, limpar dados locais
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

  // ==========================================
  // REFRESH MANUAL
  // ==========================================

  const refreshTasks = useCallback(async () => {
    console.log('🔄 Atualizando tarefas...');
    await loadTasks();
  }, [loadTasks]);

  // ==========================================
  // CRIAR TAREFA
  // ==========================================

  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<TaskItem> => {
    try {
      setError(null);
      console.log('➕ Criando nova tarefa:', taskData);
      
      const response = await TaskService.createTask(taskData);
      console.log('✅ Resposta da criação:', response);
      
      // Extrair tarefa da resposta (pode vir como { task: {...} } ou {...})
      const taskResponse = response.task || response;
      
      // Verificar se recebemos um ID válido
      if (!taskResponse.id) {
        throw new Error('API não retornou ID da tarefa criada');
      }
      
      // Recarregar todas as tarefas para garantir sincronização
      await refreshTasks();
      
      // Encontrar a tarefa criada na lista atualizada
      const newTask = tasks.find(task => task.id === taskResponse.id);
      if (newTask) {
        console.log('✅ Tarefa criada e sincronizada:', newTask);
        return newTask;
      }
      
      // Se não encontrou, criar um objeto temporário
      const tempTask: TaskItem = {
        id: taskResponse.id,
        userId: taskResponse.userId || 0,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return tempTask;
    } catch (err: any) {
      console.error('❌ Erro ao criar tarefa:', err);
      setError(err.message || 'Erro ao criar tarefa');
      throw err;
    }
  }, [tasks, refreshTasks]);

  // ==========================================
  // ATUALIZAR TAREFA
  // ==========================================

  const updateTask = useCallback(async (id: string, taskData: Partial<UpdateTaskRequest>): Promise<TaskItem> => {
    try {
      setError(null);
      console.log('✏️ Atualizando tarefa:', id, taskData);
      
      // Encontrar a tarefa original para preservar dados não editados
      const originalTask = tasks.find(task => task.id === id);
      if (!originalTask) {
        throw new Error('Tarefa não encontrada');
      }
      
      console.log('📋 Tarefa original encontrada:', originalTask);
      
      // Update otimista - atualiza UI imediatamente preservando dados originais
      const originalTasks = [...tasks];
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id 
            ? { 
                ...task,
                title: taskData.title !== undefined ? taskData.title : task.title,
                description: taskData.description !== undefined ? taskData.description : task.description,
                dueDate: taskData.dueDate !== undefined ? taskData.dueDate : task.dueDate,
                updatedAt: new Date().toISOString()
              }
            : task
        )
      );

      console.log('🔄 Update otimista aplicado');

      try {
        // Enviar atualização para API
        const apiData = {
          id,
          title: taskData.title || originalTask.title,
          description: taskData.description || originalTask.description,
          dueDate: taskData.dueDate || originalTask.dueDate,
          ...taskData
        };
        
        console.log('📤 Enviando para API:', apiData);
        const response = await TaskService.updateTask(id, apiData);
        
        console.log('✅ Resposta da API:', response);
        
        // Extrair a tarefa da resposta (a API retorna { task: {...} })
        const updatedTask = response.task || response;
        
        console.log('✅ Tarefa extraída:', updatedTask);
        
        // Atualizar com dados reais do servidor
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? updatedTask : task
          )
        );

        return updatedTask;
      } catch (apiError) {
        // Reverter mudança otimista em caso de erro
        console.error('❌ Erro na API, revertendo mudança:', apiError);
        setTasks(originalTasks);
        throw apiError;
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar tarefa:', err);
      setError(err.message || 'Erro ao atualizar tarefa');
      throw err;
    }
  }, [tasks]);

  // ==========================================
  // COMPLETAR TAREFA
  // ==========================================

  const completeTask = useCallback(async (id: string) => {
    try {
      setError(null);
      console.log('✅ Marcando tarefa como concluída:', id);
      
      // Update otimista
      const originalTasks = [...tasks];
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id 
            ? { ...task, completedAt: new Date().toISOString() }
            : task
        )
      );

      try {
        await TaskService.completeTask(id);
        console.log('✅ Tarefa marcada como concluída no servidor');
        
        // Recarregar para garantir sincronização
        await refreshTasks();
      } catch (apiError) {
        // Reverter mudança otimista
        console.error('❌ Erro na API, revertendo mudança:', apiError);
        setTasks(originalTasks);
        throw apiError;
      }
    } catch (err: any) {
      console.error('❌ Erro ao completar tarefa:', err);
      setError(err.message || 'Erro ao completar tarefa');
      throw err;
    }
  }, [tasks, refreshTasks]);

  // ==========================================
  // DESCOMPLETAR TAREFA
  // ==========================================

  const uncompleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      console.log('🔄 Desmarcando tarefa como concluída:', id);
      
      // Update otimista
      const originalTasks = [...tasks];
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id 
            ? { ...task, completedAt: undefined }
            : task
        )
      );

      try {
        await TaskService.uncompleteTask(id);
        console.log('✅ Tarefa desmarcada no servidor');
        
        // Recarregar para garantir sincronização
        await refreshTasks();
      } catch (apiError) {
        // Reverter mudança otimista
        console.error('❌ Erro na API, revertendo mudança:', apiError);
        setTasks(originalTasks);
        throw apiError;
      }
    } catch (err: any) {
      console.error('❌ Erro ao descompletar tarefa:', err);
      setError(err.message || 'Erro ao descompletar tarefa');
      throw err;
    }
  }, [tasks, refreshTasks]);

  // ==========================================
  // DELETAR TAREFA
  // ==========================================

  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      console.log('🗑️ Excluindo tarefa:', id);
      
      // Update otimista - remove da UI imediatamente
      const originalTasks = [...tasks];
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

      try {
        await TaskService.deleteTask(id);
        console.log('✅ Tarefa excluída do servidor');
        
        // Recarregar para garantir sincronização
        await refreshTasks();
      } catch (apiError) {
        // Reverter mudança otimista
        console.error('❌ Erro na API, revertendo mudança:', apiError);
        setTasks(originalTasks);
        throw apiError;
      }
    } catch (err: any) {
      console.error('❌ Erro ao excluir tarefa:', err);
      setError(err.message || 'Erro ao excluir tarefa');
      throw err;
    }
  }, [tasks, refreshTasks]);

  // ==========================================
  // AÇÕES EM MASSA
  // ==========================================

  const bulkAction = useCallback(async (taskIds: string[], action: BulkAction) => {
    try {
      setError(null);
      
      switch (action) {
        case 'complete':
          for (const id of taskIds) {
            await completeTask(id);
          }
          break;
        case 'uncomplete':
          for (const id of taskIds) {
            await uncompleteTask(id);
          }
          break;
        case 'delete':
          for (const id of taskIds) {
            await deleteTask(id);
          }
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Erro na ação em massa');
      throw err;
    }
  }, [completeTask, uncompleteTask, deleteTask]);

  // ==========================================
  // FILTRAR TAREFAS
  // ==========================================

  const filterTasks = useCallback((filter: TaskFilter): TaskItem[] => {
    return TaskService.filterTasks(tasks, filter);
  }, [tasks]);

  // ==========================================
  // BUSCAR TAREFAS
  // ==========================================

  const searchTasks = useCallback((searchTerm: string): TaskItem[] => {
    return TaskService.searchTasks(tasks, searchTerm);
  }, [tasks]);

  // ==========================================
  // UTILITÁRIOS
  // ==========================================

  const isTaskOverdue = useCallback((task: TaskItem): boolean => {
    return TaskService.isTaskOverdue(task);
  }, []);

  const getTaskPriority = useCallback((task: TaskItem): TaskPriority => {
    return TaskService.getTaskPriority(task);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================
  // ESTATÍSTICAS AVANÇADAS
  // ==========================================

  const statistics = useMemo((): TaskStatistics => {
    const baseStats = TaskService.calculateStatistics(tasks);
    
    // Estatísticas adicionais
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const dueTodayCount = tasks.filter(task => {
      if (!task.dueDate || task.completedAt) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length;

    const dueThisWeekCount = tasks.filter(task => {
      if (!task.dueDate || task.completedAt) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= startOfWeek && dueDate <= new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    }).length;

    // Tempo médio de conclusão
    const completedTasks = tasks.filter(task => task.completedAt);
    const avgCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((acc, task) => {
          const created = new Date(task.createdAt);
          const completed = new Date(task.completedAt!);
          return acc + (completed.getTime() - created.getTime());
        }, 0) / completedTasks.length / (1000 * 60 * 60 * 24) // Em dias
      : 0;

    // Score de produtividade
    const productivityScore = baseStats.total > 0 
      ? Math.round(
          (baseStats.completionRate * 0.4) + 
          (Math.max(0, 100 - (baseStats.overdue / baseStats.total * 100)) * 0.3) +
          (Math.min(100, baseStats.thisWeek.completed * 10) * 0.3)
        )
      : 0;

    return {
      ...baseStats,
      dueTodayCount,
      dueThisWeekCount,
      averageCompletionTime: avgCompletionTime,
      productivityScore,
      trends: {
        completionTrend: 0, // Implementar quando tivermos dados históricos
        creationTrend: 0,
      }
    };
  }, [tasks]);

  // ==========================================
  // EFFECT INICIAL
  // ==========================================

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    statistics,
    refreshTasks,
    createTask,
    updateTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    bulkAction,
    filterTasks,
    searchTasks,
    clearError,
    isTaskOverdue,
    getTaskPriority,
  };
}

// ==========================================
// HOOK PARA TAREFA INDIVIDUAL
// ==========================================

export function useTask(taskId: string) {
  const [task, setTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      setError(null);
      const taskData = await TaskService.getTaskById(taskId);
      setTask(taskData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar tarefa');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  return {
    task,
    loading,
    error,
    refreshTask: loadTask,
  };
} 