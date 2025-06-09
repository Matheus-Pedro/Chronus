"use client";

import { useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { TaskStats } from "./task-stats";
import { TaskFilters } from "./task-filters";
import { TaskGrid } from "./task-grid";
import { TaskList } from "./task-list";
import { CreateTaskDialog } from "./create-task-dialog";
import { CreateTaskSimple } from "./create-task-simple";
import { useAuth } from "@/lib/hooks/use-auth";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Loader2 } from "lucide-react";
import { ToastProvider } from "../ui/toast-provider";

export function TaskDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    statistics, 
    refreshTasks,
    createTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    filterTasks,
    searchTasks
  } = useTasks();

  const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    status: "todas" as "todas" | "ativas" | "concluidas" | "vencidas",
    priority: undefined as "alta" | "média" | "baixa" | undefined,
    sortBy: "dueDate" as "dueDate" | "createdAt" | "title",
    sortOrder: "asc" as "asc" | "desc",
  });

  // Mostrar loading enquanto autentica
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se não autenticado (será tratado pelo hook)
  if (!isAuthenticated) {
    return null;
  }

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask({
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
      });
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        await uncompleteTask(taskId);
      } else {
        await completeTask(taskId);
      }
    } catch (error) {
      console.error("Erro ao alterar status da tarefa:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        statistics={statistics}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <DashboardHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="p-6 space-y-6">
          {/* Stats */}
          <TaskStats />

          {/* Filters */}
          <TaskFilters />

          {/* Error State */}
          {tasksError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive text-sm">{tasksError}</p>
              <button 
                onClick={refreshTasks}
                className="text-destructive hover:underline text-sm mt-2"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Tasks */}
          {viewMode === "grid" ? (
            <TaskGrid 
              searchTerm={searchTerm}
              activeFilters={activeFilters}
            />
          ) : (
            <TaskList 
              searchTerm={searchTerm}
              activeFilters={activeFilters}
            />
          )}
        </main>
      </div>

      {/* Create Task FAB */}
      <CreateTaskSimple />
      
      {/* Toast Provider */}
      <ToastProvider />
    </div>
  );
} 