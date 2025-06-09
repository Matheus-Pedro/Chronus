"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Home, 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  Settings, 
  X,
  FolderOpen,
  Star,
  Archive,
  CreditCard,
  BarChart3,
  Users,
  Bell
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useTasks } from "@/lib/hooks/use-tasks";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  statistics?: any;
}

export const DashboardSidebar = ({ isOpen, onClose, statistics }: DashboardSidebarProps) => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  // Calcular estatísticas reais das tarefas
  const todayTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    return task.dueDate && new Date(task.dueDate).toDateString() === today;
  });

  const completedTasks = tasks.filter(task => task.completedAt);
  const importantTasks = tasks.filter(task => !task.completedAt && task.dueDate);

  const navItems = [
    { 
      icon: Home, 
      label: "Visão Geral", 
      href: "/dashboard", 
      count: null, 
      active: true,
      available: true
    },
    { 
      icon: CheckSquare, 
      label: "Todas as Tarefas", 
      href: "/dashboard/tasks", 
      count: tasks.length, 
      active: false,
      available: true
    },
    { 
      icon: Calendar, 
      label: "Hoje", 
      href: "/dashboard/today", 
      count: todayTasks.length, 
      active: false,
      available: false,
      comingSoon: true
    },
    { 
      icon: Star, 
      label: "Importantes", 
      href: "/dashboard/important", 
      count: importantTasks.length, 
      active: false,
      available: false,
      comingSoon: true
    },
    { 
      icon: FolderOpen, 
      label: "Projetos", 
      href: "/dashboard/projects", 
      count: 0, 
      active: false,
      available: false,
      comingSoon: true
    },
    { 
      icon: Archive, 
      label: "Concluídas", 
      href: "/dashboard/completed", 
      count: completedTasks.length, 
      active: false,
      available: false,
      comingSoon: true
    },
    { 
      icon: BarChart3, 
      label: "Relatórios", 
      href: "/dashboard/reports", 
      count: null, 
      active: false,
      available: false,
      comingSoon: true
    },
    { 
      icon: CreditCard, 
      label: "Assinatura", 
      href: "/dashboard/subscription", 
      count: null, 
      active: false,
      available: true
    },
    { 
      icon: Settings, 
      label: "Configurações", 
      href: "/dashboard/settings", 
      count: null, 
      active: false,
      available: true
    },
  ];

  // Projetos simulados - será implementado futuramente
  const projects = [
    { name: "Implementar funcionalidades", color: "bg-blue-500", tasks: 8, available: false },
    { name: "Integração com API", color: "bg-green-500", tasks: 4, available: true },
    { name: "Interface do usuário", color: "bg-purple-500", tasks: 6, available: false },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Chronus</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.available ? (
                    <Link href={item.href}>
                      <Button
                        variant={item.active ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                        size="sm"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count !== null && item.count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {item.count}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 opacity-60 cursor-not-allowed"
                      size="sm"
                      disabled
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count !== null && item.count > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {item.count}
                        </Badge>
                      )}
                      {item.comingSoon && (
                        <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          Em breve
                        </Badge>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Projects Section */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground px-2">
                  Projetos
                </h3>
                <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                  Em breve
                </Badge>
              </div>
              <div className="space-y-2">
                {projects.map((project) => (
                  <Card 
                    key={project.name} 
                    className={`p-3 bg-muted/50 transition-colors ${
                      project.available 
                        ? 'hover:bg-muted/80 cursor-pointer' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${project.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.tasks} {project.available ? 'tarefas' : 'pendente'}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-border">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Produtividade</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-primary">
                        {statistics?.completionRate || '--'}%
                      </p>
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                        Real
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Esta semana</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="p-4">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <Settings className="h-4 w-4" />
              Configurações
              <Badge variant="outline" className="ml-auto text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                Em breve
              </Badge>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}; 