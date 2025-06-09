"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Filter, 
  Calendar, 
  Tag, 
  User, 
  SortAsc,
  X
} from "lucide-react";
import { useState } from "react";

export const TaskFilters = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterCategories = [
    {
      label: "Status",
      icon: Filter,
      options: [
        { value: "pending", label: "Pendente", count: 15 },
        { value: "in-progress", label: "Em Andamento", count: 8 },
        { value: "completed", label: "Concluída", count: 12 },
        { value: "overdue", label: "Atrasada", count: 3 },
      ]
    },
    {
      label: "Prioridade",
      icon: Tag,
      options: [
        { value: "high", label: "Alta", count: 5 },
        { value: "medium", label: "Média", count: 12 },
        { value: "low", label: "Baixa", count: 8 },
      ]
    },
    {
      label: "Prazo",
      icon: Calendar,
      options: [
        { value: "today", label: "Hoje", count: 3 },
        { value: "week", label: "Esta Semana", count: 8 },
        { value: "month", label: "Este Mês", count: 15 },
        { value: "overdue", label: "Vencidas", count: 2 },
      ]
    },
    {
      label: "Projeto",
      icon: User,
      options: [
        { value: "website", label: "Website Redesign", count: 8 },
        { value: "mobile", label: "Mobile App", count: 12 },
        { value: "marketing", label: "Marketing", count: 6 },
      ]
    }
  ];

  const toggleFilter = (value: string) => {
    setActiveFilters(prev => 
      prev.includes(value) 
        ? prev.filter(f => f !== value)
        : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Filtros</h3>
              {activeFilters.length > 0 && (
                <Badge variant="secondary">
                  {activeFilters.length} ativos
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFilters.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2">
                <SortAsc className="h-4 w-4" />
                Ordenar
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => {
                const filterOption = filterCategories
                  .flatMap(cat => cat.options)
                  .find(opt => opt.value === filter);
                
                return filterOption ? (
                  <Badge 
                    key={filter} 
                    variant="default" 
                    className="gap-1 cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filterOption.label}
                    <X className="h-3 w-3" />
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          {/* Filter Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filterCategories.map((category) => (
              <div key={category.label} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </div>
                <div className="space-y-1">
                  {category.options.map((option) => (
                    <Button
                      key={option.value}
                      variant={activeFilters.includes(option.value) ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-between text-left font-normal"
                      onClick={() => toggleFilter(option.value)}
                    >
                      <span>{option.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {option.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Filters */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              Filtros Rápidos
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Minhas Tarefas", value: "my-tasks" },
                { label: "Urgentes", value: "urgent" },
                { label: "Sem Prazo", value: "no-deadline" },
                { label: "Recentes", value: "recent" },
              ].map((quickFilter) => (
                <Button
                  key={quickFilter.value}
                  variant={activeFilters.includes(quickFilter.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(quickFilter.value)}
                >
                  {quickFilter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 