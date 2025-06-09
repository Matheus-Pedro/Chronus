"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  Target,
  Zap
} from "lucide-react";

export const TaskStats = () => {
  const stats = [
    {
      title: "Tarefas Totais",
      value: "42",
      change: "+12%",
      changeType: "positive" as const,
      icon: CheckSquare,
      description: "Em relação ao mês passado",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Concluídas Hoje",
      value: "8",
      change: "+3",
      changeType: "positive" as const,
      icon: Target,
      description: "Meta diária: 10 tarefas",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Em Andamento",
      value: "15",
      change: "-2",
      changeType: "negative" as const,
      icon: Clock,
      description: "Desde ontem",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      title: "Produtividade",
      value: "85%",
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Esta semana",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Prazo Hoje",
      value: "3",
      change: "Urgente",
      changeType: "warning" as const,
      icon: Calendar,
      description: "Requer atenção",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
    },
    {
      title: "Streak",
      value: "7 dias",
      change: "Record: 12",
      changeType: "neutral" as const,
      icon: Zap,
      description: "Dias consecutivos",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    },
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600 bg-green-50 dark:bg-green-950/30";
      case "negative":
        return "text-red-600 bg-red-50 dark:bg-red-950/30";
      case "warning":
        return "text-orange-600 bg-orange-50 dark:bg-orange-950/30";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-105">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getChangeColor(stat.changeType)}`}
                >
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </CardContent>
          
          {/* Gradient overlay para visual moderno */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none" />
        </Card>
      ))}
    </div>
  );
}; 