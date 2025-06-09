import { TaskItem, CreateTaskRequest } from '@/lib/types/api';

// ==========================================
// INTERFACES E TIPOS
// ==========================================

export interface TaskSuggestion {
  id: string;
  type: 'tool' | 'methodology' | 'resource' | 'template';
  title: string;
  description: string;
  icon: string;
  category: string;
  useCase: string;
  confidence: number; // 0-100
  actionUrl?: string;
  tags: string[];
}

export interface SuggestionCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// ==========================================
// DADOS DE REFERÊNCIA
// ==========================================

const TOOL_PATTERNS = {
  // Desenvolvimento
  desenvolvimento: {
    keywords: ['código', 'programar', 'desenvolver', 'api', 'frontend', 'backend', 'bug', 'debug', 'deploy', 'git', 'github', 'javascript', 'typescript', 'react', 'node'],
    suggestions: [
      {
        id: 'vscode',
        type: 'tool' as const,
        title: 'Visual Studio Code',
        description: 'Editor de código poderoso com extensões para desenvolvimento web',
        icon: 'Code2',
        category: 'Desenvolvimento',
        useCase: 'Ideal para escrever e debugar código',
        confidence: 90,
        actionUrl: 'https://code.visualstudio.com/',
        tags: ['editor', 'código', 'extensões']
      },
      {
        id: 'github',
        type: 'tool' as const,
        title: 'GitHub',
        description: 'Plataforma para controle de versão e colaboração',
        icon: 'Github',
        category: 'Desenvolvimento',
        useCase: 'Para versionamento e colaboração em código',
        confidence: 85,
        actionUrl: 'https://github.com/',
        tags: ['git', 'versioning', 'colaboração']
      },
      {
        id: 'postman',
        type: 'tool' as const,
        title: 'Postman',
        description: 'Ferramenta para testar APIs e endpoints',
        icon: 'Zap',
        category: 'Desenvolvimento',
        useCase: 'Para testar e documentar APIs',
        confidence: 80,
        actionUrl: 'https://www.postman.com/',
        tags: ['api', 'testing', 'endpoints']
      }
    ]
  },

  // Design
  design: {
    keywords: ['design', 'ui', 'ux', 'interface', 'protótipo', 'mockup', 'logo', 'brand', 'visual', 'cores', 'tipografia', 'layout'],
    suggestions: [
      {
        id: 'figma',
        type: 'tool' as const,
        title: 'Figma',
        description: 'Ferramenta de design colaborativo para interfaces',
        icon: 'Palette',
        category: 'Design',
        useCase: 'Criar protótipos e designs de interface',
        confidence: 95,
        actionUrl: 'https://www.figma.com/',
        tags: ['design', 'protótipo', 'colaboração']
      },
      {
        id: 'adobe-xd',
        type: 'tool' as const,
        title: 'Adobe XD',
        description: 'Software de design para experiência do usuário',
        icon: 'Sparkles',
        category: 'Design',
        useCase: 'Design de interfaces e prototipagem',
        confidence: 85,
        actionUrl: 'https://www.adobe.com/products/xd.html',
        tags: ['ux', 'design', 'adobe']
      },
      {
        id: 'canva',
        type: 'tool' as const,
        title: 'Canva',
        description: 'Ferramenta online para criação de designs gráficos',
        icon: 'Image',
        category: 'Design',
        useCase: 'Criar gráficos, logos e materiais visuais',
        confidence: 75,
        actionUrl: 'https://www.canva.com/',
        tags: ['gráfico', 'templates', 'visual']
      }
    ]
  },

  // Gestão de Projetos
  gestao: {
    keywords: ['projeto', 'gestão', 'planejamento', 'cronograma', 'deadline', 'sprint', 'scrum', 'kanban', 'agile', 'reunião', 'equipe'],
    suggestions: [
      {
        id: 'notion',
        type: 'tool' as const,
        title: 'Notion',
        description: 'Workspace all-in-one para notas, tarefas e documentação',
        icon: 'FileText',
        category: 'Produtividade',
        useCase: 'Organizar informações e gerenciar projetos',
        confidence: 90,
        actionUrl: 'https://www.notion.so/',
        tags: ['workspace', 'organização', 'documentação']
      },
      {
        id: 'trello',
        type: 'tool' as const,
        title: 'Trello',
        description: 'Ferramenta visual de gestão de projetos estilo Kanban',
        icon: 'Kanban',
        category: 'Gestão',
        useCase: 'Organizar tarefas em boards visuais',
        confidence: 85,
        actionUrl: 'https://trello.com/',
        tags: ['kanban', 'visual', 'gestão']
      },
      {
        id: 'scrum-methodology',
        type: 'methodology' as const,
        title: 'Metodologia Scrum',
        description: 'Framework ágil para desenvolvimento iterativo',
        icon: 'RotateCcw',
        category: 'Metodologia',
        useCase: 'Para projetos que precisam de flexibilidade e iteração',
        confidence: 80,
        tags: ['agile', 'scrum', 'iterativo']
      }
    ]
  },

  // Marketing
  marketing: {
    keywords: ['marketing', 'campanha', 'social media', 'seo', 'content', 'conteúdo', 'analytics', 'ads', 'publicidade', 'branding'],
    suggestions: [
      {
        id: 'google-analytics',
        type: 'tool' as const,
        title: 'Google Analytics',
        description: 'Ferramenta de análise de tráfego web',
        icon: 'BarChart3',
        category: 'Analytics',
        useCase: 'Analisar performance de sites e campanhas',
        confidence: 95,
        actionUrl: 'https://analytics.google.com/',
        tags: ['analytics', 'web', 'métricas']
      },
      {
        id: 'hootsuite',
        type: 'tool' as const,
        title: 'Hootsuite',
        description: 'Plataforma de gestão de redes sociais',
        icon: 'Share2',
        category: 'Social Media',
        useCase: 'Gerenciar múltiplas redes sociais',
        confidence: 85,
        actionUrl: 'https://hootsuite.com/',
        tags: ['social', 'agendamento', 'gestão']
      },
      {
        id: 'content-strategy',
        type: 'methodology' as const,
        title: 'Estratégia de Conteúdo',
        description: 'Metodologia para criação de conteúdo relevante',
        icon: 'Target',
        category: 'Estratégia',
        useCase: 'Planejar e criar conteúdo que engaja',
        confidence: 75,
        tags: ['conteúdo', 'estratégia', 'engajamento']
      }
    ]
  },

  // Estudos e Pesquisa
  estudos: {
    keywords: ['estudo', 'pesquisa', 'aprender', 'curso', 'documentação', 'leitura', 'review', 'análise', 'artigo'],
    suggestions: [
      {
        id: 'pomodoro',
        type: 'methodology' as const,
        title: 'Técnica Pomodoro',
        description: 'Método de gestão de tempo com intervalos focados',
        icon: 'Timer',
        category: 'Produtividade',
        useCase: 'Manter foco durante estudos ou trabalho',
        confidence: 90,
        tags: ['foco', 'tempo', 'produtividade']
      },
      {
        id: 'obsidian',
        type: 'tool' as const,
        title: 'Obsidian',
        description: 'Ferramenta para criação de conhecimento conectado',
        icon: 'Brain',
        category: 'Conhecimento',
        useCase: 'Organizar notas e criar mapas mentais',
        confidence: 85,
        actionUrl: 'https://obsidian.md/',
        tags: ['notas', 'mapas mentais', 'conhecimento']
      },
      {
        id: 'feynman-technique',
        type: 'methodology' as const,
        title: 'Técnica Feynman',
        description: 'Método de aprendizado através da explicação simples',
        icon: 'MessageSquare',
        category: 'Aprendizado',
        useCase: 'Compreender conceitos complexos',
        confidence: 80,
        tags: ['aprendizado', 'compreensão', 'explicação']
      }
    ]
  },

  // Comunicação
  comunicacao: {
    keywords: ['reunião', 'meeting', 'apresentação', 'comunicar', 'feedback', 'report', 'relatório', 'email'],
    suggestions: [
      {
        id: 'zoom',
        type: 'tool' as const,
        title: 'Zoom',
        description: 'Plataforma para videoconferências e reuniões',
        icon: 'Video',
        category: 'Comunicação',
        useCase: 'Realizar reuniões virtuais',
        confidence: 95,
        actionUrl: 'https://zoom.us/',
        tags: ['video', 'reunião', 'remoto']
      },
      {
        id: 'loom',
        type: 'tool' as const,
        title: 'Loom',
        description: 'Ferramenta para gravação de tela e vídeos',
        icon: 'PlayCircle',
        category: 'Comunicação',
        useCase: 'Criar tutoriais e explicações em vídeo',
        confidence: 80,
        actionUrl: 'https://www.loom.com/',
        tags: ['gravação', 'tutorial', 'explicação']
      },
      {
        id: 'nonviolent-communication',
        type: 'methodology' as const,
        title: 'Comunicação Não-Violenta',
        description: 'Metodologia para comunicação empática e eficaz',
        icon: 'Heart',
        category: 'Comunicação',
        useCase: 'Melhorar relacionamentos e resolver conflitos',
        confidence: 75,
        tags: ['empatia', 'conflito', 'relacionamento']
      }
    ]
  }
};

const GENERAL_SUGGESTIONS = [
  {
    id: 'eisenhower-matrix',
    type: 'methodology' as const,
    title: 'Matriz de Eisenhower',
    description: 'Método para priorizar tarefas por urgência e importância',
    icon: 'Grid3x3',
    category: 'Priorização',
    useCase: 'Quando você tem muitas tarefas e precisa priorizá-las',
    confidence: 85,
    tags: ['priorização', 'organização', 'decisão']
  },
  {
    id: 'getting-things-done',
    type: 'methodology' as const,
    title: 'Getting Things Done (GTD)',
    description: 'Sistema completo de organização pessoal',
    icon: 'CheckSquare',
    category: 'Organização',
    useCase: 'Para organizar todas as suas tarefas e projetos',
    confidence: 80,
    tags: ['organização', 'sistema', 'produtividade']
  },
  {
    id: 'smart-goals',
    type: 'template' as const,
    title: 'Metas SMART',
    description: 'Template para criar metas específicas, mensuráveis e alcançáveis',
    icon: 'Target',
    category: 'Planejamento',
    useCase: 'Para definir objetivos claros e alcançáveis',
    confidence: 75,
    tags: ['metas', 'objetivos', 'planejamento']
  }
];

// ==========================================
// SERVIÇO DE SUGESTÕES
// ==========================================

export class TaskSuggestionsService {
  /**
   * Analisa uma tarefa e retorna sugestões relevantes
   */
  static getSuggestionsForTask(task: CreateTaskRequest | TaskItem): TaskSuggestion[] {
    const text = `${task.title} ${task.description}`.toLowerCase();
    const suggestions: TaskSuggestion[] = [];
    
    // Análise por categoria
    Object.entries(TOOL_PATTERNS).forEach(([category, data]) => {
      const matchCount = data.keywords.filter(keyword => 
        text.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        // Adicionar sugestões da categoria com confiança baseada no match
        data.suggestions.forEach(suggestion => {
          const confidence = Math.min(
            suggestion.confidence,
            suggestion.confidence * (matchCount / data.keywords.length)
          );
          
          if (confidence > 40) { // Só sugerir se confiança > 40%
            suggestions.push({
              ...suggestion,
              confidence: Math.round(confidence)
            });
          }
        });
      }
    });
    
    // Adicionar sugestões gerais com confiança menor
    GENERAL_SUGGESTIONS.forEach(suggestion => {
      suggestions.push({
        ...suggestion,
        confidence: Math.round(suggestion.confidence * 0.6) // Reduzir confiança
      });
    });
    
    // Ordenar por confiança e remover duplicatas
    return suggestions
      .filter((suggestion, index, array) => 
        array.findIndex(s => s.id === suggestion.id) === index
      )
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6); // Máximo 6 sugestões
  }
  
  /**
   * Analisa apenas o título da tarefa para sugestões rápidas
   */
  static getQuickSuggestions(title: string): TaskSuggestion[] {
    const text = title.toLowerCase();
    const suggestions: TaskSuggestion[] = [];
    
    // Busca rápida apenas nos títulos
    Object.values(TOOL_PATTERNS).forEach(data => {
      const relevantSuggestions = data.suggestions.filter(suggestion => {
        const keywords = data.keywords.concat(suggestion.tags);
        return keywords.some(keyword => text.includes(keyword.toLowerCase()));
      });
      
      suggestions.push(...relevantSuggestions);
    });
    
    return suggestions
      .filter((suggestion, index, array) => 
        array.findIndex(s => s.id === suggestion.id) === index
      )
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Máximo 3 sugestões rápidas
  }
  
  /**
   * Retorna sugestões por categoria
   */
  static getSuggestionsByCategory(category: string): TaskSuggestion[] {
    const categoryData = Object.values(TOOL_PATTERNS).find(data => 
      data.suggestions.some(s => s.category.toLowerCase() === category.toLowerCase())
    );
    
    if (categoryData) {
      return categoryData.suggestions.filter(s => 
        s.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return [];
  }
  
  /**
   * Retorna todas as categorias disponíveis
   */
  static getCategories(): SuggestionCategory[] {
    const categories = new Set<string>();
    
    Object.values(TOOL_PATTERNS).forEach(data => {
      data.suggestions.forEach(suggestion => {
        categories.add(suggestion.category);
      });
    });
    
    GENERAL_SUGGESTIONS.forEach(suggestion => {
      categories.add(suggestion.category);
    });
    
    return Array.from(categories).map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      icon: this.getCategoryIcon(category),
      description: this.getCategoryDescription(category)
    }));
  }
  
  /**
   * Busca sugestões por termo
   */
  static searchSuggestions(searchTerm: string): TaskSuggestion[] {
    const term = searchTerm.toLowerCase();
    const allSuggestions: TaskSuggestion[] = [];
    
    // Coletar todas as sugestões
    Object.values(TOOL_PATTERNS).forEach(data => {
      allSuggestions.push(...data.suggestions);
    });
    allSuggestions.push(...GENERAL_SUGGESTIONS);
    
    // Filtrar por termo de busca
    return allSuggestions.filter(suggestion => 
      suggestion.title.toLowerCase().includes(term) ||
      suggestion.description.toLowerCase().includes(term) ||
      suggestion.tags.some(tag => tag.toLowerCase().includes(term)) ||
      suggestion.category.toLowerCase().includes(term)
    );
  }
  
  /**
   * Retorna sugestões mais populares
   */
  static getPopularSuggestions(): TaskSuggestion[] {
    const popular = [
      'figma', 'vscode', 'notion', 'google-analytics', 
      'pomodoro', 'eisenhower-matrix', 'zoom'
    ];
    
    const allSuggestions: TaskSuggestion[] = [];
    Object.values(TOOL_PATTERNS).forEach(data => {
      allSuggestions.push(...data.suggestions);
    });
    allSuggestions.push(...GENERAL_SUGGESTIONS);
    
    return allSuggestions.filter(suggestion => 
      popular.includes(suggestion.id)
    );
  }
  
  /**
   * Helpers privados
   */
  private static getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'Desenvolvimento': 'Code2',
      'Design': 'Palette',
      'Produtividade': 'Zap',
      'Gestão': 'Users',
      'Analytics': 'BarChart3',
      'Social Media': 'Share2',
      'Estratégia': 'Target',
      'Conhecimento': 'Brain',
      'Aprendizado': 'BookOpen',
      'Comunicação': 'MessageSquare',
      'Priorização': 'Grid3x3',
      'Organização': 'FolderOpen',
      'Planejamento': 'Calendar'
    };
    
    return iconMap[category] || 'Star';
  }
  
  private static getCategoryDescription(category: string): string {
    const descriptionMap: Record<string, string> = {
      'Desenvolvimento': 'Ferramentas para programação e desenvolvimento',
      'Design': 'Recursos para criação visual e UX/UI',
      'Produtividade': 'Métodos e ferramentas para ser mais eficiente',
      'Gestão': 'Ferramentas para gerenciar projetos e equipes',
      'Analytics': 'Análise de dados e métricas',
      'Social Media': 'Gestão de redes sociais e marketing',
      'Estratégia': 'Metodologias de planejamento estratégico',
      'Conhecimento': 'Organização e gestão do conhecimento',
      'Aprendizado': 'Técnicas de estudo e aprendizado',
      'Comunicação': 'Ferramentas e métodos de comunicação',
      'Priorização': 'Técnicas para definir prioridades',
      'Organização': 'Sistemas de organização pessoal',
      'Planejamento': 'Métodos de planejamento e definição de metas'
    };
    
    return descriptionMap[category] || 'Recursos úteis para suas tarefas';
  }
} 