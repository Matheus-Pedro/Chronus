"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  SuggestionsExplorer, 
  TaskSuggestions 
} from "@/components/dashboard/task-suggestions";
import { TaskSuggestionsService, TaskSuggestion } from "@/lib/services/task-suggestions.service";
import { 
  Search, 
  Filter, 
  Star, 
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Zap,
  Target,
  BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";

export default function ToolsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TaskSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length > 2) {
      setIsSearching(true);
      try {
        const results = TaskSuggestionsService.searchSuggestions(term);
        setSearchResults(results);
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSuggestionSelect = (suggestion: TaskSuggestion) => {
    toast({
      title: "Ferramenta selecionada!",
      description: `${suggestion.title} - Aberto em nova aba`,
    });
  };

  const popularSuggestions = TaskSuggestionsService.getPopularSuggestions();
  const categories = TaskSuggestionsService.getCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header com Navegação */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Lightbulb className="h-8 w-8 text-amber-500" />
              <h1 className="text-4xl font-bold">Central de Ferramentas</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra ferramentas, metodologias e recursos que podem potencializar sua produtividade
            </p>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="mb-8">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ferramentas, metodologias..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Resultados da Busca */}
        {searchTerm.length > 2 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Resultados da Busca
                </CardTitle>
                <CardDescription>
                  {isSearching ? 'Buscando...' : `${searchResults.length} resultados encontrados`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum resultado encontrado para "{searchTerm}"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((suggestion) => (
                      <Card key={suggestion.id} className="cursor-pointer hover:shadow-md transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Star className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                              <Badge variant="outline" className="text-xs mt-1">
                                {suggestion.category}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-muted-foreground mb-2">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {suggestion.confidence}% relevante
                            </Badge>
                            {suggestion.actionUrl && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  window.open(suggestion.actionUrl, '_blank');
                                  handleSuggestionSelect(suggestion);
                                }}
                              >
                                Abrir
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Ferramentas Populares */}
        {searchTerm.length <= 2 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Ferramentas Populares
                </CardTitle>
                <CardDescription>
                  As ferramentas mais recomendadas pela comunidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularSuggestions.slice(0, 6).map((suggestion) => (
                    <Card key={suggestion.id} className="cursor-pointer hover:shadow-md transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-orange-100">
                            <Star className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              {suggestion.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground mb-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                          {suggestion.actionUrl && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                window.open(suggestion.actionUrl, '_blank');
                                handleSuggestionSelect(suggestion);
                              }}
                            >
                              Abrir
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cards de Ação Rápida */}
        {searchTerm.length <= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-blue-200 bg-blue-50/50">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-blue-800">Produtividade</CardTitle>
                <CardDescription className="text-blue-600">
                  Técnicas e ferramentas para ser mais eficiente
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <TaskSuggestions
                  trigger={
                    <Button variant="outline" className="w-full">
                      Explorar
                    </Button>
                  }
                  onSuggestionSelect={handleSuggestionSelect}
                />
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-purple-200 bg-purple-50/50">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg text-purple-800">Gestão de Projetos</CardTitle>
                <CardDescription className="text-purple-600">
                  Organize e gerencie seus projetos
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <TaskSuggestions
                  title="gestão projeto planejamento"
                  trigger={
                    <Button variant="outline" className="w-full">
                      Explorar
                    </Button>
                  }
                  onSuggestionSelect={handleSuggestionSelect}
                />
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-green-200 bg-green-50/50">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg text-green-800">Aprendizado</CardTitle>
                <CardDescription className="text-green-600">
                  Metodologias para estudar e aprender
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <TaskSuggestions
                  title="estudo aprendizado curso"
                  trigger={
                    <Button variant="outline" className="w-full">
                      Explorar
                    </Button>
                  }
                  onSuggestionSelect={handleSuggestionSelect}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Explorador Completo */}
        {searchTerm.length <= 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Explorar por Categoria
              </CardTitle>
              <CardDescription>
                Navegue por todas as ferramentas e metodologias disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuggestionsExplorer />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 