import { apiClient } from './client';
import type { 
  TaskItem, 
  CreateTaskRequest, 
  CreateTaskResponse, 
  UpdateTaskRequest,
  TasksResponse 
} from '@/lib/types/api';
import type { TaskFilter, TaskStatistics, TaskPriority } from '@/lib/hooks/use-tasks';

// ==========================================
// TASK SERVICE
// ==========================================

export class TaskService {
  private static readonly baseUrl = '/api/task';

  /**
   * Obtém todas as tarefas do usuário logado
   */
  static async getUserTasks(): Promise<TaskItem[]> {
    try {
      console.log('📋 TaskService.getUserTasks - Iniciando requisição...');
      console.log('🔗 URL da requisição:', `${this.baseUrl}/user`);
      
      const response = await apiClient.get<TasksResponse | TaskItem[]>(`${this.baseUrl}/user`);
      console.log('📋 TaskService.getUserTasks - Resposta da API:', response);
      
      // Verificar se a resposta é um objeto com propriedade 'tasks' ou um array direto
      let tasksArray: TaskItem[];
      
      if (Array.isArray(response)) {
        // Resposta é um array direto
        tasksArray = response;
      } else if (response && typeof response === 'object' && 'tasks' in response) {
        // Resposta é um objeto com propriedade 'tasks'
        tasksArray = response.tasks;
      } else {
        console.warn('⚠️ TaskService.getUserTasks: Formato de resposta inválido, retornando array vazio:', response);
        return [];
      }
      
      // Verificação final: garantir que tasksArray é um array
      if (!Array.isArray(tasksArray)) {
        console.warn('⚠️ TaskService.getUserTasks: tasks não é um array, retornando array vazio:', tasksArray);
        return [];
      }
      
      // Log detalhado das tarefas
      console.log('✅ TaskService.getUserTasks - Sucesso:', {
        total: tasksArray.length,
        completed: tasksArray.filter(task => !!task.completedAt).length,
        pending: tasksArray.filter(task => !task.completedAt).length
      });
      
      return tasksArray;
    } catch (error: any) {
      console.error('❌ TaskService.getUserTasks - Erro detalhado:', {
        message: error.message,
        status: error.status,
        url: `${this.baseUrl}/user`,
        headers: error.headers,
        stack: error.stack
      });
      
      // Re-throw do erro com informações adicionais
      throw new Error(`Erro ao carregar tarefas: ${error.message || 'Erro desconhecido'}`);
    }
  }

  /**
   * Obtém uma tarefa específica por ID
   */
  static async getTaskById(id: string): Promise<TaskItem> {
    try {
      console.log('🔍 TaskService.getTaskById - Buscando tarefa:', id);
      const response = await apiClient.get<TaskItem>(`${this.baseUrl}/${id}`);
      console.log('✅ TaskService.getTaskById - Tarefa encontrada:', response);
      return response;
    } catch (error: any) {
      console.error('❌ TaskService.getTaskById - Erro:', { id, error: error.message });
      throw error;
    }
  }

  /**
   * Cria uma nova tarefa
   */
  static async createTask(data: CreateTaskRequest): Promise<{ id: string }> {
    try {
      console.log('➕ TaskService.createTask - Criando tarefa:', data);
      console.log('🔗 URL da requisição:', this.baseUrl);
      
      const response = await apiClient.post<{ id: string }>(this.baseUrl, data);
      console.log('✅ TaskService.createTask - Tarefa criada com sucesso:', response);
      
      // Verificar se recebemos um ID válido
      if (!response.id) {
        console.error('❌ TaskService.createTask - Resposta sem ID:', response);
        throw new Error('API não retornou ID da tarefa criada');
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ TaskService.createTask - Erro detalhado:', {
        data,
        message: error.message,
        status: error.status,
        response: error.response
      });
      throw error;
    }
  }

  /**
   * Atualiza uma tarefa existente
   */
  static async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskItem> {
    try {
      console.log('✏️ TaskService.updateTask - Atualizando tarefa:', { id, data });
      const response = await apiClient.put<TaskItem>(`${this.baseUrl}/${id}`, data);
      console.log('✅ TaskService.updateTask - Tarefa atualizada:', response);
      return response;
    } catch (error: any) {
      console.error('❌ TaskService.updateTask - Erro:', { id, data, error: error.message });
      throw error;
    }
  }

  /**
   * Marca uma tarefa como concluída
   */
  static async completeTask(id: string): Promise<void> {
    try {
      console.log('✅ TaskService.completeTask - Marcando como concluída:', id);
      await apiClient.put<void>(`${this.baseUrl}/${id}/complete`);
      console.log('✅ TaskService.completeTask - Sucesso');
    } catch (error: any) {
      console.error('❌ TaskService.completeTask - Erro:', { id, error: error.message });
      throw error;
    }
  }

  /**
   * Marca uma tarefa como não concluída
   */
  static async uncompleteTask(id: string): Promise<void> {
    try {
      console.log('🔄 TaskService.uncompleteTask - Desmarcando conclusão:', id);
      await apiClient.put<void>(`${this.baseUrl}/${id}/uncomplete`);
      console.log('✅ TaskService.uncompleteTask - Sucesso');
    } catch (error: any) {
      console.error('❌ TaskService.uncompleteTask - Erro:', { id, error: error.message });
      throw error;
    }
  }

  /**
   * Exclui uma tarefa
   */
  static async deleteTask(id: string): Promise<void> {
    try {
      console.log('🗑️ TaskService.deleteTask - Excluindo tarefa:', id);
      await apiClient.delete<void>(`${this.baseUrl}/${id}`);
      console.log('✅ TaskService.deleteTask - Tarefa excluída com sucesso');
    } catch (error: any) {
      console.error('❌ TaskService.deleteTask - Erro:', { id, error: error.message });
      throw error;
    }
  }

  // ==========================================
  // MÉTODOS AUXILIARES
  // ==========================================

  /**
   * Verifica se uma tarefa está vencida
   */
  static isTaskOverdue(task: TaskItem): boolean {
    if (!task.dueDate || task.completedAt) return false;
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    return dueDate < now;
  }

  /**
   * Obtém a prioridade da tarefa baseada na data de vencimento
   */
  static getTaskPriority(task: TaskItem): TaskPriority {
    if (!task.dueDate) return 'baixa';
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'alta'; // Vencida
    if (diffInDays <= 1) return 'alta'; // Vence hoje ou amanhã
    if (diffInDays <= 3) return 'média'; // Vence em até 3 dias
    
    return 'baixa'; // Vence em mais de 3 dias
  }

  /**
   * Filtra tarefas baseado em critérios
   */
  static filterTasks(tasks: TaskItem[], filter: TaskFilter): TaskItem[] {
    // Verificação de segurança: garantir que tasks é um array
    if (!Array.isArray(tasks)) {
      console.warn('TaskService.filterTasks: tasks não é um array:', tasks);
      return [];
    }
    
    let filteredTasks = [...tasks];

    // Filtro por status
    if (filter.status && filter.status !== 'todas') {
      switch (filter.status) {
        case 'ativas':
          filteredTasks = filteredTasks.filter(task => !task.completedAt);
          break;
        case 'concluidas':
          filteredTasks = filteredTasks.filter(task => !!task.completedAt);
          break;
        case 'vencidas':
          filteredTasks = filteredTasks.filter(task => 
            !task.completedAt && this.isTaskOverdue(task)
          );
          break;
        case 'hoje':
          const today = new Date();
          filteredTasks = filteredTasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate.toDateString() === today.toDateString();
          });
          break;
        case 'semana':
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          
          filteredTasks = filteredTasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate >= startOfWeek && dueDate <= endOfWeek;
          });
          break;
      }
    }

    // Filtro por prioridade
    if (filter.priority) {
      filteredTasks = filteredTasks.filter(task => 
        this.getTaskPriority(task) === filter.priority
      );
    }

    // Filtro por intervalo de datas
    if (filter.dateRange) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= filter.dateRange!.start && dueDate <= filter.dateRange!.end;
      });
    }

    // Filtro por tags (se implementado no futuro)
    if (filter.tags && filter.tags.length > 0) {
      // Implementar quando adicionar tags às tarefas
    }

    // Ordenação
    if (filter.sortBy) {
      filteredTasks.sort((a, b) => {
        let comparison = 0;
        
        switch (filter.sortBy) {
          case 'dueDate':
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            comparison = dateA - dateB;
            break;
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          case 'completedAt':
            const compA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
            const compB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
            comparison = compA - compB;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'priority':
            const priorityOrder = { 'alta': 3, 'média': 2, 'baixa': 1 };
            const prioA = priorityOrder[this.getTaskPriority(a)];
            const prioB = priorityOrder[this.getTaskPriority(b)];
            comparison = prioB - prioA; // Alta prioridade primeiro
            break;
        }

        return filter.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filteredTasks;
  }

  /**
   * Busca tarefas por termo
   */
  static searchTasks(tasks: TaskItem[], searchTerm: string): TaskItem[] {
    // Verificação de segurança: garantir que tasks é um array
    if (!Array.isArray(tasks)) {
      console.warn('TaskService.searchTasks: tasks não é um array:', tasks);
      return [];
    }
    
    if (!searchTerm.trim()) return tasks;

    const search = searchTerm.toLowerCase();
    
    return tasks.filter(task => 
      task.title.toLowerCase().includes(search) ||
      (task.description && task.description.toLowerCase().includes(search))
    );
  }

  /**
   * Calcula estatísticas das tarefas
   */
  static calculateStatistics(tasks: TaskItem[]): TaskStatistics {
    // Verificação de segurança: garantir que tasks é um array
    if (!Array.isArray(tasks)) {
      console.warn('TaskService.calculateStatistics: tasks não é um array:', tasks);
      tasks = [];
    }
    
    const total = tasks.length;
    const completed = tasks.filter(task => task.completedAt).length;
    const active = total - completed;
    const overdue = tasks.filter(task => !task.completedAt && this.isTaskOverdue(task)).length;
    
    // Contagem por prioridade
    const priorities = tasks.reduce((acc, task) => {
      const priority = this.getTaskPriority(task);
      switch (priority) {
        case 'alta':
          acc.high++;
          break;
        case 'média':
          acc.medium++;
          break;
        case 'baixa':
          acc.low++;
          break;
      }
      return acc;
    }, { high: 0, medium: 0, low: 0 });

    // Estatísticas da semana
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const thisWeekCreated = tasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      return createdDate >= startOfWeek;
    }).length;

    const thisWeekCompleted = tasks.filter(task => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate >= startOfWeek;
    }).length;

    return {
      total,
      completed,
      active,
      overdue,
      dueTodayCount: 0, // Será calculado no hook
      dueThisWeekCount: 0, // Será calculado no hook
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      averageCompletionTime: 0, // Será calculado no hook
      productivityScore: 0, // Será calculado no hook
      priority: priorities,
      thisWeek: {
        created: thisWeekCreated,
        completed: thisWeekCompleted,
      },
      trends: {
        completionTrend: 0,
        creationTrend: 0,
      }
    };
  }

  static formatDueDate(dueDate: string): string {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Amanhã';
    if (diffInDays === -1) return 'Ontem';
    if (diffInDays < -1) return `${Math.abs(diffInDays)} dias atrás`;
    if (diffInDays > 1 && diffInDays <= 7) return `Em ${diffInDays} dias`;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  static getTaskStatusBadge(task: TaskItem): {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color: string;
  } {
    if (task.completedAt) {
      return {
        text: 'Concluída',
        variant: 'default',
        color: 'text-green-600 bg-green-50 border-green-200'
      };
    }
    
    if (this.isTaskOverdue(task)) {
      return {
        text: 'Vencida',
        variant: 'destructive',
        color: 'text-red-600 bg-red-50 border-red-200'
      };
    }
    
    const priority = this.getTaskPriority(task);
    switch (priority) {
      case 'alta':
        return {
          text: 'Alta Prioridade',
          variant: 'destructive',
          color: 'text-orange-600 bg-orange-50 border-orange-200'
        };
      case 'média':
        return {
          text: 'Média Prioridade',
          variant: 'secondary',
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
        };
      default:
        return {
          text: 'Baixa Prioridade',
          variant: 'outline',
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        };
    }
  }

  static getProgressPercentage(tasks: TaskItem[]): number {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completedAt).length;
    return Math.round((completed / tasks.length) * 100);
  }

  static groupTasksByDate(tasks: TaskItem[]): Record<string, TaskItem[]> {
    // Verificação de segurança: garantir que tasks é um array
    if (!Array.isArray(tasks)) {
      console.warn('TaskService.groupTasksByDate: tasks não é um array:', tasks);
      return {};
    }
    
    const groups: Record<string, TaskItem[]> = {};
    
    // Filtrar tarefas com IDs válidos antes de agrupar
    const validTasks = tasks.filter(task => {
      if (!task.id) {
        console.warn('TaskService.groupTasksByDate: tarefa sem ID encontrada:', task);
        return false;
      }
      return true;
    });
    
    validTasks.forEach(task => {
      let key = 'Sem data';
      
      if (task.dueDate) {
        try {
          const dueDate = new Date(task.dueDate);
          
          // Verificar se a data é válida
          if (isNaN(dueDate.getTime())) {
            console.warn('TaskService.groupTasksByDate: data inválida encontrada:', task.dueDate);
            key = 'Sem data';
          } else {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            if (dueDate.toDateString() === today.toDateString()) {
              key = 'Hoje';
            } else if (dueDate.toDateString() === tomorrow.toDateString()) {
              key = 'Amanhã';
            } else if (dueDate < today) {
              key = 'Vencidas';
            } else {
              key = new Intl.DateTimeFormat('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long'
              }).format(dueDate);
            }
          }
        } catch (error) {
          console.warn('TaskService.groupTasksByDate: erro ao processar data:', task.dueDate, error);
          key = 'Sem data';
        }
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });
    
    // Log para debug
    console.log('📊 Tarefas agrupadas:', Object.keys(groups).map(key => `${key}: ${groups[key].length}`));
    
    return groups;
  }
}

export { TaskService as default }; 