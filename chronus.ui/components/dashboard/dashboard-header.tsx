"use client";

import { Button } from "@/components/ui/button";
import { Clock, Menu, Grid3X3, List, Plus, Search, Bell, User } from "lucide-react";
import { ToggleTheme } from "@/components/layout/toogle-theme";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  viewMode: "grid" | "list" | "kanban";
  onViewModeChange: (mode: "grid" | "list" | "kanban") => void;
}

export const DashboardHeader = ({ onMenuClick, viewMode, onViewModeChange }: DashboardHeaderProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Logo (Mobile) */}
          <div className="flex items-center gap-2 lg:hidden">
            <Clock className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Chronus</span>
          </div>
          
          {/* Page Title */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas tarefas de forma eficiente</p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex items-center max-w-md w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar tarefas..." 
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Create Task Button */}
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Tarefa</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* Theme Toggle */}
          <ToggleTheme />

          {/* User Menu */}
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-5 w-5" />
            <span className="hidden md:inline">Usuário</span>
          </Button>
        </div>
      </div>
    </header>
  );
}; 