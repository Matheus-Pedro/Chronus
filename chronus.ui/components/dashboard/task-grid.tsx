"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  User,
  Flag,
  CheckCircle2,
  Circle,
  Star
} from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  project: string;
  assignee: string;
  isStarred: boolean;
  completedSubtasks: number;
  totalSubtasks: number;
}

export const TaskGrid = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Redesign da Homepage",
      description: "Criar novo layout responsivo para a página inicial com foco em conversão",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-12-15",
      project: "Website Redesign",
      assignee: "João Silva",
      isStarred: true,
      completedSubtasks: 3,
      totalSubtasks: 5,
    },
    {
      id: "2",
      title: "Implementar Dashboard",
      description: "Desenvolver dashboard para gerenciamento de tarefas com métricas avançadas",
      priority: "high",
      status: "pending",
      dueDate: "2024-12-20",
      project: "Mobile App",
      assignee: "Maria Santos",
      isStarred: false,
      completedSubtasks: 1,
      totalSubtasks: 8,
    },
    {
      id: "3",
      title: "Testes de Performance",
      description: "Executar testes de carga e otimizar performance da aplicação",
      priority: "medium",
      status: "pending",
      dueDate: "2024-12-18",
      project: "Website Redesign",
      assignee: "Pedro Costa",
      isStarred: false,
      completedSubtasks: 0,
      totalSubtasks: 3,
    },
    {
      id: "4",
      title: "Documentação da API",
      description: "Criar documentação completa da API REST para desenvolvedores",
      priority: "low",
      status: "completed",
      dueDate: "2024-12-12",
      project: "Mobile App",
      assignee: "Ana Oliveira",
      isStarred: true,
      completedSubtasks: 4,
      totalSubtasks: 4,
    },
    {
      id: "5",
      title: "Campanha de Marketing",
      description: "Desenvolver estratégia de marketing digital para o novo produto",
      priority: "medium",
      status: "in-progress",
      dueDate: "2024-12-25",
      project: "Marketing",
      assignee: "Carlos Lima",
      isStarred: false,
      completedSubtasks: 2,
      totalSubtasks: 6,
    },
    {
      id: "6",
      title: "Setup de CI/CD",
      description: "Configurar pipeline de integração e deploy contínuo",
      priority: "high",
      status: "pending",
      dueDate: "2024-12-16",
      project: "DevOps",
      assignee: "Lucas Ferreira",
      isStarred: false,
      completedSubtasks: 0,
      totalSubtasks: 5,
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 dark:bg-red-950/30";
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30";
      case "low": return "text-green-600 bg-green-50 dark:bg-green-950/30";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in-progress": return "text-blue-600";
      case "pending": return "text-gray-600";
      default: return "text-muted-foreground";
    }
  };

  const getProjectColor = (project: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500"
    ];
    return colors[Math.abs(project.length) % colors.length];
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === "completed" ? "pending" : "completed",
            completedSubtasks: task.status === "completed" ? 0 : task.totalSubtasks
          }
        : task
    ));
  };

  const toggleStar = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isStarred: !task.isStarred } : task
    ));
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className={`group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${
            task.status === "completed" 
              ? "border-l-green-500 bg-green-50/20 dark:bg-green-950/10" 
              : task.priority === "high" 
                ? "border-l-red-500" 
                : task.priority === "medium"
                  ? "border-l-yellow-500"
                  : "border-l-gray-300"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => toggleTaskStatus(task.id)}
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  )}
                </Button>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm leading-tight ${
                    task.status === "completed" ? "line-through text-muted-foreground" : ""
                  }`}>
                    {task.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleStar(task.id)}
                >
                  <Star className={`h-4 w-4 ${task.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>

            {/* Progress Bar */}
            {task.totalSubtasks > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progresso</span>
                  <span>{task.completedSubtasks}/{task.totalSubtasks}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(task.completedSubtasks / task.totalSubtasks) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-2">
              {/* Priority and Status */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
                  {task.status === "completed" ? "Concluída" : 
                   task.status === "in-progress" ? "Em Andamento" : "Pendente"}
                </Badge>
              </div>

              {/* Project */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`w-3 h-3 rounded-full ${getProjectColor(task.project)}`} />
                <span className="truncate">{task.project}</span>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className={`${isOverdue(task.dueDate) ? "text-red-600" : "text-muted-foreground"}`}>
                  {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                </span>
                {isOverdue(task.dueDate) && (
                  <Badge variant="destructive" className="text-xs">
                    Atrasada
                  </Badge>
                )}
              </div>

              {/* Assignee */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="truncate">{task.assignee}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 