"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Lightbulb, 
  ExternalLink, 
  Star, 
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Timer,
  Zap,
  Code2,
  Palette,
  Users,
  BarChart3,
  Share2,
  Target,
  Brain,
  BookOpen,
  MessageSquare,
  Grid3x3,
  FolderOpen,
  Calendar,
  CheckSquare,
  Video,
  PlayCircle,
  Heart,
  Github,
  FileText,
  Kanban,
  RotateCcw,
  Image,
  Sparkles
} from "lucide-react";
import { TaskSuggestionsService, TaskSuggestion, SuggestionCategory } from "@/lib/services/task-suggestions.service";
import { CreateTaskRequest, TaskItem } from "@/lib/types/api";

// ==========================================
// INTERFACES
// ==========================================

interface TaskSuggestionsProps {
  task?: CreateTaskRequest | TaskItem;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  onSuggestionSelect?: (suggestion: TaskSuggestion) => void;
}

interface SuggestionCardProps {
  suggestion: TaskSuggestion;
  onSelect?: (suggestion: TaskSuggestion) => void;
  compact?: boolean;
}

// ==========================================
// MAPEAMENTO DE ÍCONES
// ==========================================

const iconMap: Record<string, any> = {
  Timer,
  Zap,
  Code2,
  Palette,
  Users,
  BarChart3,
  Share2,
  Target,
  Brain,
  BookOpen,
  MessageSquare,
  Grid3x3,
  FolderOpen,
  Calendar,
  CheckSquare,
  Video,
  PlayCircle,
  Heart,
  Github,
  FileText,
  Kanban,
  RotateCcw,
  Image,
  Sparkles,
  Star
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Star;
};

// ==========================================
// COMPONENTE: CARD DE SUGESTÃO
// ==========================================

function SuggestionCard({ suggestion, onSelect, compact = false }: SuggestionCardProps) {
  const IconComponent = getIcon(suggestion.icon);
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(suggestion);
    }
    
    // Se tem URL, abrir em nova aba
    if (suggestion.actionUrl) {
      window.open(suggestion.actionUrl, '_blank');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tool': return 'bg-blue-500';
      case 'methodology': return 'bg-purple-500';
      case 'resource': return 'bg-green-500';
      case 'template': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tool': return 'Ferramenta';
      case 'methodology': return 'Metodologia';
      case 'resource': return 'Recurso';
      case 'template': return 'Template';
      default: return 'Sugestão';
    }
  };

  if (compact) {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-primary"
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{suggestion.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.confidence}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {suggestion.description}
                </p>
              </div>
            </div>
            {suggestion.actionUrl && (
              <ExternalLink className="h-3 w-3 text-muted-foreground ml-2 flex-shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {suggestion.title}
                {suggestion.actionUrl && (
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs text-white ${getTypeColor(suggestion.type)}`}
                >
                  {getTypeLabel(suggestion.type)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {suggestion.confidence}% relevância
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="text-sm mb-3">
          {suggestion.description}
        </CardDescription>
        
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">Caso de Uso:</p>
            <p className="text-sm text-muted-foreground">{suggestion.useCase}</p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {suggestion.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export function TaskSuggestions({ 
  task, 
  title, 
  description, 
  trigger, 
  onSuggestionSelect 
}: TaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [categories, setCategories] = useState<SuggestionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // Gerar sugestões baseadas na tarefa
  useEffect(() => {
    if (task) {
      setLoading(true);
      try {
        const taskSuggestions = TaskSuggestionsService.getSuggestionsForTask(task);
        setSuggestions(taskSuggestions);
      } catch (error) {
        console.error('Erro ao gerar sugestões:', error);
      } finally {
        setLoading(false);
      }
    } else if (title) {
      // Sugestões rápidas baseadas apenas no título
      const quickSuggestions = TaskSuggestionsService.getQuickSuggestions(title);
      setSuggestions(quickSuggestions);
    } else {
      // Sugestões populares como fallback
      const popularSuggestions = TaskSuggestionsService.getPopularSuggestions();
      setSuggestions(popularSuggestions);
    }
  }, [task, title, description]);

  // Carregar categorias
  useEffect(() => {
    const allCategories = TaskSuggestionsService.getCategories();
    setCategories(allCategories);
  }, []);

  // Filtrar sugestões por categoria
  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory);

  const renderSuggestionsContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold">Sugestões Inteligentes</h2>
        </div>
        <p className="text-muted-foreground">
          Ferramentas e metodologias recomendadas para sua tarefa
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="desenvolvimento">Dev</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="produtividade">Produtividade</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">Analisando sua tarefa...</p>
              </div>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Nenhuma sugestão encontrada</h3>
              <p className="text-muted-foreground">
                Tente adicionar mais detalhes à sua tarefa para obter sugestões mais específicas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onSelect={onSuggestionSelect}
                />
              ))}
            </div>
          )}

          {/* Estatísticas */}
          {filteredSuggestions.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">
                    {filteredSuggestions.length} sugestões encontradas
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Relevância média: {Math.round(
                    filteredSuggestions.reduce((acc, s) => acc + s.confidence, 0) / 
                    filteredSuggestions.length
                  )}%
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Se não há trigger customizado, usar o padrão
  if (!trigger) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Ver Sugestões
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Sugestões para sua tarefa</DialogTitle>
          </DialogHeader>
          {renderSuggestionsContent()}
        </DialogContent>
      </Dialog>
    );
  }

  // Com trigger customizado
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Sugestões para sua tarefa</DialogTitle>
        </DialogHeader>
        {renderSuggestionsContent()}
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// COMPONENTE: SUGESTÕES INLINE
// ==========================================

interface InlineTaskSuggestionsProps {
  title: string;
  description?: string;
  maxSuggestions?: number;
  onSuggestionSelect?: (suggestion: TaskSuggestion) => void;
}

export function InlineTaskSuggestions({ 
  title, 
  description = '', 
  maxSuggestions = 3,
  onSuggestionSelect 
}: InlineTaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);

  useEffect(() => {
    if (title.length > 3) {
      const quickSuggestions = TaskSuggestionsService.getQuickSuggestions(title);
      setSuggestions(quickSuggestions.slice(0, maxSuggestions));
    } else {
      setSuggestions([]);
    }
  }, [title, maxSuggestions]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium text-muted-foreground">
          Sugestões baseadas no título:
        </span>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onSelect={onSuggestionSelect}
            compact
          />
        ))}
      </div>
      
      <TaskSuggestions
        title={title}
        description={description}
        trigger={
          <Button variant="ghost" size="sm" className="w-full gap-2">
            <ChevronRight className="h-4 w-4" />
            Ver todas as sugestões ({suggestions.length}+)
          </Button>
        }
        onSuggestionSelect={onSuggestionSelect}
      />
    </div>
  );
}

// ==========================================
// COMPONENTE: PAINEL DE EXPLORAÇÃO
// ==========================================

export function SuggestionsExplorer() {
  const [categories, setCategories] = useState<SuggestionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);

  useEffect(() => {
    const allCategories = TaskSuggestionsService.getCategories();
    setCategories(allCategories);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const categorySuggestions = TaskSuggestionsService.getSuggestionsByCategory(selectedCategory);
      setSuggestions(categorySuggestions);
    } else {
      const popularSuggestions = TaskSuggestionsService.getPopularSuggestions();
      setSuggestions(popularSuggestions);
    }
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Explorar Ferramentas e Metodologias</h2>
        <p className="text-muted-foreground">
          Descubra recursos que podem ajudar em seus projetos
        </p>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant={selectedCategory === '' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('')}
          className="h-auto p-4 flex flex-col items-center gap-2"
        >
          <Star className="h-6 w-6" />
          <span className="text-sm">Populares</span>
        </Button>
        
        {categories.slice(0, 7).map((category) => {
          const IconComponent = getIcon(category.icon);
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.name)}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <IconComponent className="h-6 w-6" />
              <span className="text-sm">{category.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Sugestões */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      )}
    </div>
  );
} 