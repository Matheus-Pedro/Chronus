"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  Target, 
  Activity,
  TrendingUp,
  BookOpen,
  Users,
  Settings,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  ArrowRight,
  Star,
  Zap,
  Trophy,
  Flame,
  ChevronRight,
  ArrowLeft,
  Edit
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { useTasks } from '@/lib/hooks/use-tasks';
import { TaskService } from '@/lib/api/tasks';
import { useToast } from '@/lib/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const {
    tasks,
    loading,
    error,
    statistics,
    refreshTasks,
    completeTask,
    uncompleteTask,
    createTask,
    updateTask
  } = useTasks();

  // Estado para edição de tarefas
  const [editingTask, setEditingTask] = useState(null);

  // ==========================================
  // DADOS PROCESSADOS
  // ==========================================

  const dashboardData = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayTasks = tasks.filter(task => {
      if (!task.dueDate || task.completedAt) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString();
    });

    const upcomingTasks = tasks.filter(task => {
      if (!task.dueDate || task.completedAt) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate > today && dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    }).slice(0, 5);

    const overdueTasks = tasks.filter(task => 
      !task.completedAt && TaskService.isTaskOverdue(task)
    );

    const recentTasks = tasks
      .filter(task => task.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5);

    const highPriorityTasks = tasks.filter(task => 
      !task.completedAt && TaskService.getTaskPriority(task) === 'alta'
    ).slice(0, 5);

    return {
      todayTasks,
      upcomingTasks,
      overdueTasks,
      recentTasks,
      highPriorityTasks
    };
  }, [tasks]);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleQuickCreateTask = async () => {
    try {
      // Define uma data padrão para hoje + 1 dia
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0); // Meio-dia para evitar problemas de timezone
      
      await createTask({
        title: 'Nova tarefa rápida',
        description: 'Clique para editar...',
        dueDate: tomorrow.toISOString(), // Enviar data completa em UTC
      });
      toast({
        title: "Tarefa criada!",
        description: "Nova tarefa adicionada à sua lista.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar tarefa.",
        variant: "destructive",
      });
    }
  };

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        await uncompleteTask(taskId);
      } else {
        await completeTask(taskId);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status da tarefa.",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (id: string, data: any) => {
    try {
      await updateTask(id, data);
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
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Cabeçalho do Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Bem-vindo de volta, {user?.name || 'Usuário'}! 👋
          </h2>
          <p className="text-muted-foreground">
            Aqui está um resumo da sua produtividade hoje.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button onClick={handleQuickCreateTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Tarefa
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Tarefas */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.thisWeek.created} criadas esta semana
            </p>
          </CardContent>
        </Card>

        {/* Taxa de Conclusão */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completionRate}%</div>
            <Progress value={statistics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        {/* Score de Produtividade */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.productivityScore}%</div>
            <div className="flex items-center space-x-1 mt-2">
              {statistics.productivityScore >= 80 && (
                <>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-yellow-600">Excelente!</span>
                </>
              )}
              {statistics.productivityScore >= 60 && statistics.productivityScore < 80 && (
                <>
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-orange-600">Muito bem!</span>
                </>
              )}
              {statistics.productivityScore < 60 && (
                <>
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-blue-600">Continue!</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas Vencidas */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.overdue}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.overdue > 0 ? 'Precisam de atenção' : 'Tudo em dia!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Principal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tarefas de Hoje */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Tarefas de Hoje
              <Badge variant="secondary">{dashboardData.todayTasks.length}</Badge>
            </CardTitle>
            <CardDescription>
              Suas tarefas que vencem hoje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma tarefa para hoje!
                </p>
              </div>
            ) : (
              <>
                {dashboardData.todayTasks.slice(0, 4).map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={handleEditTask}
                    showDueDate={false}
                  />
                ))}
                {dashboardData.todayTasks.length > 4 && (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/dashboard/tasks">
                      Ver todas ({dashboardData.todayTasks.length - 4} mais)
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Tarefas Vencidas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Tarefas Vencidas
              <Badge variant={dashboardData.overdueTasks.length > 0 ? "destructive" : "secondary"}>
                {dashboardData.overdueTasks.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              {dashboardData.overdueTasks.length > 0 
                ? "Tarefas que precisam de atenção urgente"
                : "Nenhuma tarefa vencida no momento"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.overdueTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Parabéns! Você está em dia com suas tarefas.
                </p>
              </div>
            ) : (
              <>
                {dashboardData.overdueTasks.slice(0, 4).map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={handleEditTask}
                    variant="overdue"
                  />
                ))}
                {dashboardData.overdueTasks.length > 4 && (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/dashboard/tasks?filter=vencidas">
                      Ver todas ({dashboardData.overdueTasks.length - 4} mais)
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Tarefas Próximas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Próximas Tarefas
              <Badge variant="outline">{dashboardData.upcomingTasks.length}</Badge>
            </CardTitle>
            <CardDescription>
              Tarefas que vencem nos próximos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma tarefa próxima
                </p>
              </div>
            ) : (
              <>
                {dashboardData.upcomingTasks.slice(0, 4).map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={handleEditTask}
                  />
                ))}
                {dashboardData.upcomingTasks.length > 4 && (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/dashboard/tasks?filter=semana">
                      Ver todas ({dashboardData.upcomingTasks.length - 4} mais)
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Tarefas Recentes Concluídas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Recentemente Concluídas
            </CardTitle>
            <CardDescription>
              Suas conquistas recentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Conclua suas primeiras tarefas!
                </p>
              </div>
            ) : (
              dashboardData.recentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  variant="completed"
                  showCompletedDate
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Estatísticas Detalhadas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Análise de Produtividade
            </CardTitle>
            <CardDescription>
              Suas estatísticas desta semana
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progresso por Prioridade */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Distribuição por Prioridade</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm">Alta Prioridade</span>
                  </div>
                  <span className="text-sm font-medium">{statistics.priority.high}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-sm">Média Prioridade</span>
                  </div>
                  <span className="text-sm font-medium">{statistics.priority.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm">Baixa Prioridade</span>
                  </div>
                  <span className="text-sm font-medium">{statistics.priority.low}</span>
                </div>
              </div>
            </div>

            {/* Resumo da Semana */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.thisWeek.created}
                </div>
                <p className="text-xs text-muted-foreground">Criadas esta semana</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {statistics.thisWeek.completed}
                </div>
                <p className="text-xs text-muted-foreground">Concluídas esta semana</p>
              </div>
            </div>

            {/* Tempo Médio de Conclusão */}
            {statistics.averageCompletionTime > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tempo médio de conclusão</span>
                  <span className="text-sm font-medium">
                    {statistics.averageCompletionTime.toFixed(1)} dias
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/dashboard/tasks">
            <Target className="h-4 w-4 mr-2" />
            Ver Todas as Tarefas
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href="/dashboard/subscription">
            <Star className="h-4 w-4 mr-2" />
            Gerenciar Assinatura
          </Link>
        </Button>
        
        <Button variant="outline" disabled>
          <BookOpen className="h-4 w-4 mr-2" />
          Relatórios
          <Badge variant="secondary" className="ml-2">Em breve</Badge>
        </Button>
        
        <Button variant="outline" disabled>
          <Users className="h-4 w-4 mr-2" />
          Equipe
          <Badge variant="secondary" className="ml-2">Em breve</Badge>
        </Button>
      </div>

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
// COMPONENTE: ITEM DE TAREFA
// ==========================================

interface TaskItemProps {
  task: any;
  onToggle: (taskId: string, isCompleted: boolean) => void;
  onEdit: (task: any) => void;
  variant?: 'default' | 'overdue' | 'completed';
  showDueDate?: boolean;
  showCompletedDate?: boolean;
}

function TaskItem({ 
  task, 
  onToggle, 
  onEdit,
  variant = 'default', 
  showDueDate = true,
  showCompletedDate = false 
}: TaskItemProps) {
  const isCompleted = !!task.completedAt;
  const isOverdue = TaskService.isTaskOverdue(task);
  
  return (
    <div className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 mt-0.5"
        onClick={() => onToggle(task.id, isCompleted)}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <div className="h-4 w-4 border-2 border-muted-foreground rounded hover:border-primary" />
        )}
      </Button>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${
          isCompleted ? 'line-through text-muted-foreground' : ''
        } ${variant === 'overdue' ? 'text-red-700' : ''}`}>
          {task.title}
        </p>
        
        {task.description && (
          <p className={`text-xs text-muted-foreground mt-1 ${
            isCompleted ? 'line-through' : ''
          }`}>
            {task.description.length > 50 
              ? `${task.description.substring(0, 50)}...` 
              : task.description
            }
          </p>
        )}
        
        <div className="flex items-center gap-2 mt-1">
          {showDueDate && task.dueDate && (
            <span className={`text-xs ${
              isOverdue && !isCompleted ? 'text-red-600 font-medium' : 'text-muted-foreground'
            }`}>
              {TaskService.formatDueDate(task.dueDate)}
            </span>
          )}
          
          {showCompletedDate && task.completedAt && (
            <span className="text-xs text-green-600">
              Concluída {TaskService.formatDueDate(task.completedAt)}
            </span>
          )}
          
          {TaskService.getTaskPriority(task) === 'alta' && !isCompleted && (
            <Badge variant="destructive" className="text-xs">
              Alta
            </Badge>
          )}
        </div>
      </div>

      {/* Botão de Editar */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
        onClick={() => onEdit(task)}
        title="Editar tarefa"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
}

// ==========================================
// COMPONENTE: DIALOG DE EDIÇÃO
// ==========================================

interface TaskEditDialogProps {
  task: any;
  open: boolean;
  onClose: () => void;
  onUpdateTask: (id: string, data: any) => void;
}

function TaskEditDialog({ task, open, onClose, onUpdateTask }: TaskEditDialogProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
  });

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
// COMPONENTE: SKELETON
// ==========================================

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-96" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-start space-x-3">
                  <Skeleton className="h-4 w-4 mt-0.5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 