# Documentação do Frontend - Chronus

## 📋 Visão Geral

O frontend do **Chronus** é uma aplicação web moderna desenvolvida com **Next.js 14**, **TypeScript**, **Tailwind CSS** e **shadcn/ui**. A aplicação serve como landing page e futura interface principal do sistema de gerenciamento de tarefas.

## 🏗️ Arquitetura e Tecnologias

### Stack Principal
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React
- **Tema**: Sistema de dark/light mode com next-themes

### Estrutura de Pastas
```
chronus.ui/
├── app/                     # App Router do Next.js
│   ├── layout.tsx           # Layout raiz da aplicação
│   ├── page.tsx             # Página principal (landing page)
│   └── globals.css          # Estilos globais
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes base do shadcn/ui
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── icon.tsx         # Componente customizado para ícones
│   │   └── ...
│   ├── layout/              # Componentes de layout
│   │   ├── navbar.tsx       # Barra de navegação
│   │   ├── theme-provider.tsx
│   │   ├── toogle-theme.tsx
│   │   └── sections/        # Seções da landing page
│   │       ├── hero.tsx
│   │       ├── features.tsx
│   │       ├── benefits.tsx
│   │       ├── pricing.tsx
│   │       ├── faq.tsx
│   │       └── footer.tsx
│   └── icons/               # Ícones customizados
├── lib/                     # Utilitários e configurações
│   └── utils.ts             # Funções utilitárias (cn, etc.)
├── public/                  # Assets estáticos
└── docs/                    # Documentação (esta pasta)
```

## 🎨 Design System

### Cores e Tema
O projeto utiliza um sistema de cores baseado em CSS variables, permitindo alternância automática entre tema claro e escuro:

- **Primary**: Azul vibrante para elementos principais
- **Secondary**: Tons neutros para elementos secundários
- **Muted**: Cores suaves para textos auxiliares
- **Background**: Adaptável ao tema (claro/escuro)

### Componentes Base (shadcn/ui)
- **Button**: Botões com múltiplas variantes
- **Card**: Containers para conteúdo
- **Badge**: Indicadores e labels
- **Sheet**: Menu lateral para mobile
- **Accordion**: FAQ e conteúdo expansível
- **NavigationMenu**: Menu de navegação

## 📱 Landing Page - Seções

### 1. **HeroSection** (`components/layout/sections/hero.tsx`)
- **Propósito**: Apresentação principal do Chronus
- **Características**:
  - Badge "Novo - Sistema de Gestão Inteligente"
  - Título com gradiente azul destacando "Chronus"
  - Descrição focada em gerenciamento de tarefas
  - CTAs: "Começar Agora" e "Ver Planos"
  - Imagem hero responsiva (light/dark mode)

### 2. **BenefitsSection** (`components/layout/sections/benefits.tsx`)
- **Propósito**: Mostrar os principais benefícios do Chronus
- **Benefícios destacados**:
  - ⏰ Economize Tempo
  - 📈 Aumente Produtividade
  - 🛡️ Nunca Perca Prazos
  - 🎯 Alcance Seus Objetivos

### 3. **FeaturesSection** (`components/layout/sections/features.tsx`)
- **Propósito**: Apresentar funcionalidades específicas
- **Funcionalidades**:
  - ✅ Gestão de Tarefas
  - 📅 Planejamento Temporal
  - 🎯 Acompanhamento de Metas
  - 📊 Organização por Projetos
  - 📈 Relatórios Avançados
  - 📱 Acesso Multiplataforma

### 4. **PricingSection** (`components/layout/sections/pricing.tsx`)
- **Propósito**: Mostrar planos de assinatura
- **Planos**:
  - **Free** (R$0/mês): Recursos básicos, 50 tarefas
  - **Pro** (R$19/mês): Tarefas ilimitadas, relatórios avançados ⭐
  - **Premium** (R$39/mês): Todos os recursos + suporte 24/7

### 5. **FAQSection** (`components/layout/sections/faq.tsx`)
- **Propósito**: Responder dúvidas frequentes
- **Perguntas cobertas**:
  - Gratuidade do plano Free
  - Compatibilidade móvel
  - Migração entre planos
  - Segurança dos dados
  - Limites de tarefas

### 6. **FooterSection** (`components/layout/sections/footer.tsx`)
- **Propósito**: Links úteis e informações da empresa
- **Seções**:
  - Produto (Funcionalidades, Planos, Benefícios)
  - Plataformas (Web App, Mobile, API)
  - Suporte (Contato, FAQ, Documentação)
  - Legal (Privacidade, Termos, Cookies)

## 🧭 Navegação

### Navbar (`components/layout/navbar.tsx`)
- **Logo**: Ícone de relógio + "Chronus"
- **Menu Desktop**: Funcionalidades (dropdown), Benefícios, Planos, Contato, FAQ
- **Menu Mobile**: Sheet lateral com todos os links
- **CTAs**: Toggle de tema + "Começar Agora"

### Menu de Funcionalidades (Dropdown)
- **Gestão de Tarefas**: Criação e organização
- **Relatórios Avançados**: Analytics e insights
- **Multiplataforma**: Acesso universal

## 🔧 Sistema de Sugestões de Ferramentas

### **Visão Geral**
Sistema inteligente que analisa tarefas e sugere ferramentas, metodologias e recursos relevantes para aumentar a produtividade dos usuários.

### **Componentes Principais**

#### **TaskSuggestions** (`components/dashboard/task-suggestions.tsx`)
- **Propósito**: Modal principal com sugestões detalhadas
- **Funcionalidades**:
  - Análise inteligente de tarefas baseada em palavras-chave
  - Tabs para filtrar por categorias (Desenvolvimento, Design, Produtividade)
  - Cards informativos com ícones, badges de confiança e links externos
  - Sistema de scoring de relevância (0-100%)
- **Uso**: Integrado nos formulários de criação de tarefas

#### **InlineTaskSuggestions** (`components/dashboard/task-suggestions.tsx`)
- **Propósito**: Sugestões rápidas durante digitação
- **Funcionalidades**:
  - Aparece automaticamente após 3+ caracteres no título
  - Máximo 3 sugestões compactas
  - Atualização em tempo real
  - Botão para expandir para modal completo
- **Uso**: Formulários de criação de tarefas

#### **SuggestionsExplorer** (`components/dashboard/task-suggestions.tsx`)
- **Propósito**: Exploração de ferramentas por categoria
- **Funcionalidades**:
  - Grid de categorias (Desenvolvimento, Design, Gestão, etc.)
  - Navegação por cards coloridos
  - Sugestões populares destacadas
- **Uso**: Central de Ferramentas (`/dashboard/tools`)

### **Serviço de Sugestões** (`lib/services/task-suggestions.service.ts`)

#### **Algoritmo de Análise**
1. **Extração**: Combina título + descrição da tarefa
2. **Análise**: Compara com padrões de palavras-chave predefinidos
3. **Scoring**: Calcula relevância (0-100%) baseada em matches
4. **Filtragem**: Remove sugestões com confiança < 40%
5. **Ordenação**: Ordena por relevância decrescente

#### **Categorias Disponíveis**
- **🔹 Desenvolvimento**: VS Code, GitHub, Postman (keywords: código, api, frontend)
- **🔹 Design**: Figma, Adobe XD, Canva (keywords: design, ui, mockup)
- **🔹 Gestão**: Notion, Trello, Scrum (keywords: projeto, planejamento, kanban)
- **🔹 Marketing**: Google Analytics, Hootsuite (keywords: campanha, seo, analytics)
- **🔹 Estudos**: Técnica Pomodoro, Obsidian (keywords: estudo, aprender, pesquisa)
- **🔹 Comunicação**: Zoom, Loom (keywords: reunião, apresentação, feedback)

#### **Métodos Principais**
```typescript
// Análise completa de tarefa
TaskSuggestionsService.getSuggestionsForTask(task)

// Sugestões rápidas por título
TaskSuggestionsService.getQuickSuggestions(title)

// Busca de ferramentas
TaskSuggestionsService.searchSuggestions(term)

// Ferramentas populares
TaskSuggestionsService.getPopularSuggestions()
```

### **Central de Ferramentas** (`app/dashboard/tools/page.tsx`)
- **Propósito**: Página dedicada para explorar ferramentas e metodologias
- **Seções**:
  - Busca em tempo real com resultados dinâmicos
  - Grid de ferramentas populares
  - Cards de ação rápida por categoria (Produtividade, Gestão, Aprendizado)
  - Explorador completo com filtros
- **Navegação**: Acessível via botão "Explorar Ferramentas" na página de tarefas

### **Integração com Formulários**
```typescript
// Sugestões inline durante digitação
{formData.title.length > 3 && (
  <InlineTaskSuggestions
    title={formData.title}
    description={formData.description}
    maxSuggestions={2}
    onSuggestionSelect={handleSuggestionSelect}
  />
)}

// Modal com todas as sugestões
<TaskSuggestions
  task={{ title, description, dueDate }}
  trigger={<Button>Ver Todas</Button>}
  onSuggestionSelect={handleSuggestionSelect}
/>
```

### **Design System**
- **Cores por Tipo**: Ferramenta (azul), Metodologia (roxo), Recurso (verde), Template (laranja)
- **Estados Visuais**: Loading, vazio, hover com elevação, badges de confiança
- **Responsividade**: Grid adaptativo, modal otimizado para mobile
- **Acessibilidade**: ARIA labels, navegação por teclado, contraste adequado

### **Casos de Uso Comuns**
1. **"Desenvolver API REST"** → Postman (95%), GitHub (85%), VS Code (90%)
2. **"Criar mockup de login"** → Figma (95%), Adobe XD (85%), Canva (75%)
3. **"Estudar React Hooks"** → Pomodoro (90%), Obsidian (85%), VS Code (80%)

### **Métricas e Analytics**
- Taxa de engajamento com sugestões
- Ferramentas mais acessadas por categoria
- Score médio de relevância das sugestões
- Padrões de uso por tipo de tarefa

## 📄 Páginas Legais

### **Termos de Serviço** (`app/terms/page.tsx`)
- **Propósito**: Documento legal completo com termos de uso
- **Estrutura**:
  - Índice interativo com navegação âncora
  - 10 seções principais (Aceitação, Serviço, Conta, etc.)
  - Informações específicas sobre planos e pagamentos
  - Conformidade com LGPD e regulamentações brasileiras
- **Design Features**:
  - Botão de voltar para navegação
  - Ícones coloridos por seção
  - Cards responsivos para melhor legibilidade
  - Footer com CTAs para registro e política de privacidade
- **Integração**: Linkado no formulário de registro e footer

### **Política de Privacidade** (`app/privacy/page.tsx`)
- **Propósito**: Conformidade completa com LGPD e transparência sobre dados
- **Estrutura**:
  - Índice interativo com 10 seções principais
  - Bases legais para tratamento de dados
  - Direitos dos titulares (8 direitos LGPD)
  - Medidas de segurança técnicas e organizacionais
- **Design Features**:
  - Cards coloridos por tipo de base legal
  - Grid 2x4 para direitos dos usuários
  - Alertas informativos sobre proteções
  - Contact DPO: `privacidade@chronus.app`
- **Conformidade**: LGPD, ANPD, dados no Brasil
- **Integração**: Linkado nos termos de serviço e footer

## 🚦 Status do Projeto

### ✅ Implementado
- Landing page completa
- Sistema de temas
- Responsividade
- Seções principais customizadas para Chronus
- Navegação funcional

### 🔄 Em Desenvolvimento
- Dashboard principal (futuro)
- Autenticação
- Integração com API do backend

### 📋 Próximos Passos
1. Implementar dashboard de tarefas
2. Sistema de autenticação
3. Integração com Stripe para pagamentos
4. PWA (Progressive Web App)
5. Testes automatizados

## 📞 Suporte

Para dúvidas sobre o frontend:
1. Consulte esta documentação
2. Verifique os comentários no código
3. Consulte a documentação oficial do Next.js e shadcn/ui

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
cd chronus.ui
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse: `http://localhost:3000`

### Build de Produção
```bash
npm run build
npm run start
```

## 📱 Responsividade

### Breakpoints (Tailwind CSS)
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

### Design Responsivo
- **Mobile First**: Design pensado primeiro para mobile
- **Grid Adaptativo**: Layouts que se ajustam automaticamente
- **Menu Mobile**: Sheet lateral para navegação em telas pequenas
- **Tipografia Escalável**: Tamanhos de fonte que se ajustam por dispositivo

## 🎨 Customização

### Cores
Edite `globals.css` para personalizar o tema:

```css
:root {
  --primary: 262.1 83.3% 57.8%;
  --secondary: 220 14.3% 95.9%;
  /* ... outras variáveis */
}
```

### Componentes
Todos os componentes seguem o padrão shadcn/ui e podem ser customizados através do `tailwind.config.ts`.

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de ícone não encontrado**
   - Verifique se o nome do ícone existe no Lucide React
   - Use o componente Icon customizado que trata esses casos

2. **Problema de tema não persistindo**
   - Certifique-se que o ThemeProvider está envolvendo a aplicação
   - Verifique se não há problemas de hidratação

3. **Build falhando**
   - Execute `npm run type-check` para verificar erros de TypeScript
   - Verifique se todas as importações estão corretas

## 🚦 Status do Projeto

### ✅ Implementado
- Landing page completa
- Sistema de temas
- Responsividade
- Seções principais customizadas para Chronus
- Navegação funcional

### 🔄 Em Desenvolvimento
- Dashboard principal (futuro)
- Autenticação
- Integração com API do backend

### 📋 Próximos Passos
1. Implementar dashboard de tarefas
2. Sistema de autenticação
3. Integração com Stripe para pagamentos
4. PWA (Progressive Web App)
5. Testes automatizados

## 📞 Suporte

Para dúvidas sobre o frontend:
1. Consulte esta documentação
2. Verifique os comentários no código
3. Consulte a documentação oficial do Next.js e shadcn/ui

## 📄 Páginas Legais

### **Termos de Serviço** (`app/terms/page.tsx`)
- **Propósito**: Documento legal completo com termos de uso
- **Estrutura**:
  - Índice interativo com navegação âncora
  - 10 seções principais (Aceitação, Serviço, Conta, etc.)
  - Informações específicas sobre planos e pagamentos
  - Conformidade com LGPD e regulamentações brasileiras
- **Design Features**:
  - Botão de voltar para navegação
  - Ícones coloridos por seção
  - Cards responsivos para melhor legibilidade
  - Footer com CTAs para registro e política de privacidade
- **Integração**: Linkado no formulário de registro e footer

### **Política de Privacidade** (`app/privacy/page.tsx`)
- **Propósito**: Conformidade completa com LGPD e transparência sobre dados
- **Estrutura**:
  - Índice interativo com 10 seções principais
  - Bases legais para tratamento de dados
  - Direitos dos titulares (8 direitos LGPD)
  - Medidas de segurança técnicas e organizacionais
- **Design Features**:
  - Cards coloridos por tipo de base legal
  - Grid 2x4 para direitos dos usuários
  - Alertas informativos sobre proteções
  - Contact DPO: `privacidade@chronus.app`
- **Conformidade**: LGPD, ANPD, dados no Brasil
- **Integração**: Linkado nos termos de serviço e footer

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0 