# Sistema de Personalização de Cores - Chronus UI

## 📋 Visão Geral

Implementação de um sistema intuitivo para personalização de cores do dashboard, permitindo que o usuário escolha cores primárias e tons de fundo de forma simples e visual.

## 🎯 Objetivos

- ✅ Interface intuitiva para seleção de cores
- ✅ Personalização em tempo real 
- ✅ Salvamento no cliente (localStorage)
- ✅ Suporte a diferentes tons de fundo
- ✅ Preview imediato das mudanças
- ✅ Fácil reset para configurações padrão

## 🏗️ Arquitetura

### Componentes Principais

```
chronus.ui/
├── lib/hooks/use-theme-config.ts           # Hook de gerenciamento
├── components/dashboard/theme-customizer.tsx # Interface de personalização  
├── app/dashboard/settings/page.tsx         # Página de configurações
└── docs/theme-customization-system.md     # Esta documentação
```

## 🎨 Cores Disponíveis

### Cores Primárias
- **Azul** (`blue`) - Padrão original
- **Vermelho** (`red`) - Para dashboards energéticos
- **Roxo** (`purple`) - Para estilo moderno
- **Amarelo** (`yellow`) - Para visual alegre
- **Verde** (`green`) - Para produtividade
- **Laranja** (`orange`) - Para criatividade
- **Rosa** (`pink`) - Para estilo único
- **Índigo** (`indigo`) - Para profissionalismo

### Tons de Fundo (Modo Escuro)
- **Neutro** - Preto/cinza padrão
- **Colorido** - Leve tom da cor principal
- **Quente** - Tons mais quentes
- **Frio** - Tons mais frios

## 🔧 Implementação Técnica

### 1. Hook `useThemeConfig`

```typescript
export function useThemeConfig() {
  // Gerencia estado da configuração
  const [config, setConfig] = useState<ThemeConfig>({
    primaryColor: "blue",
    backgroundTone: "neutral"
  });

  // Principais funcionalidades:
  // - updateConfig() - Atualiza e salva configuração
  // - applyTheme() - Aplica mudanças no CSS
  // - resetToDefault() - Volta ao padrão
  // - getColorInfo() - Informações sobre cores
}
```

**Características:**
- Salvamento automático no `localStorage`
- Aplicação dinâmica de variáveis CSS
- Detecção de modo escuro/claro
- Cálculo automático de cores derivadas

### 2. Componente `ThemeCustomizer`

```tsx
export function ThemeCustomizer() {
  // Interface intuitiva com:
  // - Preview em tempo real
  // - Seleção visual de cores
  // - Configuração de tons de fundo
  // - Botão de reset
  // - Dicas para o usuário
}
```

**Recursos da Interface:**
- 🎨 Preview com exemplos visuais
- 🖱️ Seleção por clique
- ✅ Indicação visual da seleção atual
- 🔄 Reset para configurações padrão
- 💡 Dicas de uso

### 3. Aplicação de Cores

O sistema modifica variáveis CSS dinamicamente:

```javascript
// Exemplo de aplicação de cor vermelha com tom colorido
root.style.setProperty("--primary", "0 84.2% 60.2%");        // Vermelho
root.style.setProperty("--background", "0 13% 5%");          // Fundo avermelhado
root.style.setProperty("--card", "0 13% 8%");               // Cards avermelhados
```

## 📱 Interface do Usuário

### Acesso
1. Dashboard → Sidebar → "Configurações"
2. Ou acesso direto: `/dashboard/settings`

### Seções da Interface

#### 1. Header
- Título e descrição
- Botão "Resetar" para voltar ao padrão

#### 2. Preview
- Visualização em tempo real
- Badges mostrando seleções atuais
- Exemplos de cores primária, card e secundária

#### 3. Seleção de Cor Principal
- Grid com 8 cores disponíveis
- Círculos coloridos para preview
- Nomes em português
- Indicação visual da seleção

#### 4. Seleção de Tom de Fundo
- 4 opções de tom
- Ícones representativos
- Descrições explicativas
- Melhor visualização no modo escuro

#### 5. Dicas
- Orientações sobre uso
- Explicação das funcionalidades
- Informações sobre salvamento

## 💾 Persistência

### Salvamento Automático
As configurações de tema são **automaticamente persistentes** no navegador, funcionando de forma similar ao sistema de tokens de autenticação.

```json
// localStorage key: "chronus-theme-config"
{
  "primaryColor": "red",
  "backgroundTone": "colored"
}
```

**Características:**
- ✅ **Salvamento instantâneo** - Cada mudança é salva imediatamente
- ✅ **Carregamento automático** - Configurações restauradas a cada acesso
- ✅ **Funcionamento offline** - Não depende de conexão com servidor
- ✅ **Independente de login** - Funciona sem autenticação
- ✅ **Sincronização entre abas** - Mudanças refletem em todas as abas

**Vantagens:**
- ✅ Não requer autenticação
- ✅ Funciona offline
- ✅ Carregamento instantâneo
- ✅ Sem impacto no servidor

**Limitações:**
- ❌ Configurações não sincronizam entre dispositivos
- ❌ Reset do navegador/dados apaga configurações

### 📚 Documentação Detalhada
Para informações técnicas completas sobre persistência, consulte: [`THEME_PERSISTENCE.md`](./THEME_PERSISTENCE.md)

## �� Configurações de Cores

### Estrutura HSL
Todas as cores usam formato HSL (Hue, Saturation, Lightness):

```typescript
const COLOR_CONFIGS = {
  red: {
    light: "0 84.2% 60.2%",      // Cor principal
    backgroundDark: {
      neutral: "0 0% 3%",        // Preto padrão
      colored: "0 13% 5%",       // Com tom avermelhado
      warm: "0 8% 4%",           // Tom quente
      cool: "340 13% 3%"         // Tom frio
    }
  }
  // ... outras cores
};
```

### Cálculo de Cores Derivadas
```javascript
// Card sempre 3% mais claro que o background
const cardColor = `${backgroundDark.split(" ")[0]} ${backgroundDark.split(" ")[1]} ${parseInt(backgroundDark.split(" ")[2]) + 3}%`;
```

## 🧪 Teste do Sistema

### Teste Manual
1. Acesse `/dashboard/settings`
2. Teste cada cor principal:
   - Clique em "Vermelho" → Observe mudanças imediatas
   - Clique em "Verde" → Verifique aplicação
   - Continue testando todas as cores
3. Teste tons de fundo (melhor no modo escuro):
   - Selecione "Colorido" → Veja tom sutil da cor
   - Teste "Quente" e "Frio"
4. Teste reset:
   - Clique "Resetar" → Deve voltar ao azul neutro
5. Teste persistência:
   - Configure vermelho + colorido
   - Recarregue a página → Deve manter configuração

### Verificação Técnica
```javascript
// Console do navegador
console.log(localStorage.getItem("chronus-theme-config"));
// Deve mostrar: {"primaryColor":"red","backgroundTone":"colored"}

// Verificar variáveis CSS aplicadas
console.log(getComputedStyle(document.documentElement).getPropertyValue('--primary'));
// Deve mostrar: 0 84.2% 60.2% (para vermelho)
```

## 🚀 Funcionalidades Futuras

### Melhorias Planejadas
- [ ] **Sincronização na Nuvem**: Salvar no perfil do usuário
- [ ] **Mais Cores**: Adicionar tons personalizados
- [ ] **Temas Predefinidos**: Conjuntos de cores harmoniosas
- [ ] **Modo Automático**: Mudança baseada no horário
- [ ] **Acessibilidade**: Verificação de contraste
- [ ] **Exportar/Importar**: Compartilhar configurações

### Extensões Possíveis
- **Fonte Personalizada**: Tamanho e família
- **Bordas**: Raio e espessura personalizáveis
- **Animações**: Velocidade e tipo
- **Layout**: Densidade de informações

## 📊 Monitoramento

### Métricas Sugeridas
- Taxa de personalização (% usuários que alteram cores)
- Cores mais populares
- Combinações de cor + tom mais usadas
- Taxa de reset (usuários que voltam ao padrão)

### Logs Implementados
```javascript
console.log("🎨 Tema aplicado:", {
  color: newConfig.primaryColor,
  tone: newConfig.backgroundTone,
  isDark: isDark,
  background: backgroundDark
});
```

## 🛠️ Manutenção

### Adicionando Nova Cor
1. **Adicionar no tipo:** `ThemeColor`
2. **Configurar cores:** `COLOR_CONFIGS`
3. **Adicionar ícone:** `COLOR_ICONS`
4. **Testar:** Todas as combinações de tom

### Adicionando Novo Tom
1. **Adicionar no tipo:** `BackgroundTone`