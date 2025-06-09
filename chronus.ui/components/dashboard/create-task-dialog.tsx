"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Calendar, 
  Flag, 
  User, 
  FolderOpen,
  Clock,
  Target,
  Lightbulb
} from "lucide-react";
import { InlineTaskSuggestions, TaskSuggestions } from "./task-suggestions";
import { TaskSuggestion } from "@/lib/services/task-suggestions.service";
import { Separator } from "@/components/ui/separator";

export const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    project: "",
    assignee: "",
    dueDate: "",
    estimatedHours: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para criar a task
    console.log("Nova task:", formData);
    setOpen(false);
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "",
      project: "",
      assignee: "",
      dueDate: "",
      estimatedHours: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSuggestionSelect = (suggestion: TaskSuggestion) => {
    console.log("Sugestão selecionada:", suggestion);
    // Você pode implementar lógica adicional aqui, como:
    // - Adicionar a sugestão como nota na descrição
    // - Mostrar um toast de confirmação
    // - Integrar com o sistema de ferramentas do usuário
  };

  const projects = [
    { value: "website", label: "Website Redesign", color: "bg-blue-500" },
    { value: "mobile", label: "Mobile App", color: "bg-green-500" },
    { value: "marketing", label: "Marketing Campaign", color: "bg-purple-500" },
    { value: "devops", label: "DevOps", color: "bg-orange-500" },
  ];

  const assignees = [
    { value: "joao", label: "João Silva" },
    { value: "maria", label: "Maria Santos" },
    { value: "pedro", label: "Pedro Costa" },
    { value: "ana", label: "Ana Oliveira" },
    { value: "carlos", label: "Carlos Lima" },
    { value: "lucas", label: "Lucas Ferreira" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";
      case "medium": return "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";
      case "low": return "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400";
      default: return "border-gray-300 bg-gray-50 text-gray-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 z-50">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Criar Nova Tarefa
          </DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar uma nova tarefa no Chronus.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título da Tarefa *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Implementar sistema de login"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
              className="text-sm"
            />
          </div>

          {/* Sugestões Inline */}
          {formData.title.length > 3 && (
            <div className="space-y-3">
              <Separator />
              <InlineTaskSuggestions
                title={formData.title}
                description={formData.description}
                maxSuggestions={2}
                onSuggestionSelect={handleSuggestionSelect}
              />
              <Separator />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes da tarefa, objetivos e critérios de aceitação..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="text-sm resize-none"
            />
          </div>

          {/* Row 1: Priority and Project */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Prioridade *
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor("high")}>
                        Alta
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor("medium")}>
                        Média
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor("low")}>
                        Baixa
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Projeto *
              </Label>
              <Select value={formData.project} onValueChange={(value) => handleInputChange("project", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.value} value={project.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${project.color}`} />
                        {project.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Assignee and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Responsável
              </Label>
              <Select value={formData.assignee} onValueChange={(value) => handleInputChange("assignee", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar responsável" />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee.value} value={assignee.value}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {assignee.label.split(" ").map(n => n[0]).join("").substring(0, 2)}
                          </span>
                        </div>
                        {assignee.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Prazo
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Estimated Hours */}
          <div className="space-y-2">
            <Label htmlFor="estimatedHours" className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Estimativa de Tempo (horas)
            </Label>
            <Input
              id="estimatedHours"
              type="number"
              placeholder="Ex: 8"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange("estimatedHours", e.target.value)}
              min="0.5"
              step="0.5"
              className="text-sm"
            />
          </div>

          {/* Sugestões Detalhadas */}
          {formData.title && formData.description && (
            <div className="space-y-3">
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Sugestões Inteligentes</span>
                </div>
                <TaskSuggestions
                  task={{
                    title: formData.title,
                    description: formData.description,
                    dueDate: formData.dueDate
                  }}
                  trigger={
                    <Button type="button" variant="outline" size="sm">
                      Ver Todas
                    </Button>
                  }
                  onSuggestionSelect={handleSuggestionSelect}
                />
              </div>
            </div>
          )}

          {/* Form Summary */}
          {(formData.title || formData.priority || formData.project) && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Resumo da Tarefa:</h4>
              <div className="space-y-1">
                {formData.title && (
                  <p className="text-sm">
                    <span className="font-medium">Título:</span> {formData.title}
                  </p>
                )}
                {formData.priority && (
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium">Prioridade:</span>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(formData.priority)}`}>
                      {formData.priority === "high" ? "Alta" : formData.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </p>
                )}
                {formData.project && (
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium">Projeto:</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${projects.find(p => p.value === formData.project)?.color}`} />
                      {projects.find(p => p.value === formData.project)?.label}
                    </div>
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.title || !formData.priority || !formData.project}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar Tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 