# Persistência de Configurações de Tema - Chronus UI

## 📋 Visão Geral

A personalização de cores do Chronus é **automaticamente persistente** no navegador, funcionando de forma similar ao sistema de autenticação. As configurações são salvas localmente e restauradas a cada acesso.

## 🔄 Como Funciona

### Salvamento Automático
- ✅ **Instantâneo**: Cada mudança é salva imediatamente
- ✅ **Local**: Armazenado no `localStorage` do navegador
- ✅ **Não requer login**: Funciona independente da autenticação
- ✅ **Sem servidor**: Não há impacto na API

### Carregamento Automático
- 🚀 **Na inicialização**: Configurações são restauradas ao abrir o app
- 🔄 **Entre sessões**: Mantém personalização entre acessos
- 🌐 **Por domínio**: Cada site mantém suas próprias configurações

## 💾 Implementação Técnica

### Sistema Global de Tema

O sistema de persistência é dividido em duas partes:

#### 1. Hook Global (`useThemeLoader`)
```typescript
// chronus.ui/lib/hooks/use-theme-loader.ts
export function useThemeLoader() {
  // Carrega configurações do localStorage na inicialização
  // Aplica o tema globalmente em toda a aplicação
  // Observa mudanças de modo claro/escuro
  // Escuta mudanças no localStorage (sincronização entre abas)
}
```

#### 2. Hook de Configuração (`useThemeConfig`)
```typescript
// chronus.ui/lib/hooks/use-theme-config.ts  
export function useThemeConfig() {
  // Interface para a página de configurações
  // Funções para alterar configurações
  // Salva mudanças no localStorage
}
```

#### 3. Componente de Carregamento Global (`ThemeLoader`)
```typescript
// chronus.ui/components/theme-loader.tsx
export function ThemeLoader() {
  useThemeLoader(); // Executa o hook global
  return null; // Não renderiza nada
}
```

### Integração no Layout Principal
```typescript
// chronus.ui/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider>
          <ThemeLoader /> {/* ← Carrega tema globalmente */}
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Chave de Armazenamento
```javascript
// Mesma estrutura dos tokens de autenticação
const STORAGE_KEY = "chronus-theme-config";
```

### Estrutura dos Dados
```json
{
  "primaryColor": "red",
  "backgroundTone": "colored"
}
```

### Fluxo de Persistência

#### 1. Carregamento Global (em todas as páginas)
```typescript
useEffect(() => {
  // 1. Carrega configurações do localStorage
  const savedConfig = localStorage.getItem("chronus-theme-config");
  
  // 2. Aplica tema imediatamente
  applyThemeGlobally(config);
  
  // 3. Observa mudanças de modo claro/escuro
  // 4. Observa mudanças no localStorage (outras abas)
}, []);
```

#### 2. Salvamento (na página de configurações)
```typescript
const updateConfig = (newConfig: Partial<ThemeConfig>) => {
  const updatedConfig = { ...config, ...newConfig };
  setConfig(updatedConfig);
  
  // 💾 Salvamento automático no localStorage
  localStorage.setItem("chronus-theme-config", JSON.stringify(updatedConfig));
  
  // 🎨 Aplicação imediata do tema
  applyTheme(updatedConfig);
};
```

### Logs de Debug

O sistema agora usa dois prefixos nos logs:

- `[THEME-GLOBAL]`: Sistema global (funciona em todas as páginas)
- `[THEME]`: Interface de configuração (só na página de settings)

```javascript
// Exemplo de logs que você verá:
🔄 [THEME-GLOBAL] Iniciando carregamento global de tema...
🔍 [THEME-GLOBAL] Valor do localStorage: {"primaryColor":"purple","backgroundTone":"colored"}
✅ [THEME-GLOBAL] Configurações parseadas: {primaryColor: "purple", backgroundTone: "colored"}
🎯 [THEME-GLOBAL] Configurações carregadas do localStorage
🌍 [THEME-GLOBAL] Aplicando tema globalmente: {primaryColor: "purple", backgroundTone: "colored"}
🎉 [THEME-GLOBAL] Tema aplicado globalmente com sucesso!
```

## 🧪 Testes de Persistência

### Teste Manual Completo

#### 1. Configurar Personalização
```
1. Acesse /dashboard/settings
2. Selecione cor "Vermelho"
3. Selecione tom "Colorido"
4. Observe as mudanças aplicadas
```

#### 2. Verificar Salvamento
```javascript
// No console do navegador
console.log(localStorage.getItem("chronus-theme-config"));
// Resultado esperado: {"primaryColor":"red","backgroundTone":"colored"}
```

#### 3. Testar Persistência
```
1. Recarregue a página (F5)
2. Verifique se as cores se mantiveram
3. Feche e abra o navegador
4. Acesse novamente - cores devem estar iguais
```

#### 4. Testar Reset
```
1. Clique no botão "Resetar"
2. Verifique se voltou ao padrão (azul neutro)
3. Recarregue a página
4. Confirme que o reset foi mantido
```

### Verificações Técnicas

#### Console do Navegador
```javascript
// 1. Verificar se dados estão salvos
console.log('💾 Configuração salva:', localStorage.getItem("chronus-theme-config"));

// 2. Verificar se variáveis CSS foram aplicadas
const root = document.documentElement;
console.log('🎨 Cor primária aplicada:', getComputedStyle(root).getPropertyValue('--primary'));
console.log('🌑 Cor de fundo aplicada:', getComputedStyle(root).getPropertyValue('--background'));

// 3. Verificar informações do tema
console.log('📊 Estado atual do tema:', {
  isDark: document.documentElement.classList.contains('dark'),
  storage: localStorage.getItem("chronus-theme-config"),
  cssVars: {
    primary: getComputedStyle(root).getPropertyValue('--primary'),
    background: getComputedStyle(root).getPropertyValue('--background'),
    card: getComputedStyle(root).getPropertyValue('--card')
  }
});
```

#### DevTools - Application/Storage
```
1. Abra DevTools (F12)
2. Vá em Application → Local Storage
3. Selecione o domínio (localhost:3000)
4. Procure pela chave "chronus-theme-config"
5. Verifique o valor JSON salvo
```

## 🔍 Comparação com Sistema de Tokens

| Aspecto | Tokens de Auth | Configurações de Tema |
|---------|---------------|----------------------|
| **Chave** | `chronus_access_token` | `chronus-theme-config` |
| **Dados** | JWT + User Info | Cor + Tom de Fundo |
| **Formato** | String JWT + JSON | JSON simples |
| **Expiração** | Sim (baseada no JWT) | Não (permanente) |
| **Sincronização** | Via API | Apenas local |
| **Dependência** | Requer autenticação | Independente |

## 🛡️ Robustez e Tratamento de Erros

### Cenários Cobertos

#### 1. Dados Corrompidos
```typescript
try {
  const parsed = JSON.parse(savedConfig);
  setConfig(parsed);
} catch (error) {
  console.warn("Erro ao carregar configuração de tema:", error);
  // Mantém configuração padrão automaticamente
}
```

#### 2. localStorage Indisponível
```typescript
// Hook verifica automaticamente se window está disponível
if (typeof window === 'undefined') return null;
```

#### 3. Configuração Inválida
```typescript
// Se alguma propriedade estiver faltando, usa padrão
const updatedConfig = { 
  primaryColor: "blue",    // Fallback
  backgroundTone: "neutral", // Fallback
  ...config, 
  ...newConfig 
};
```

## 🚀 Recursos Avançados

### Sincronização entre Abas
- As configurações são automaticamente sincronizadas entre abas
- Mudança em uma aba reflete em todas as outras
- Implementado via `storage` event listener

### Detecção de Mudança de Modo (Claro/Escuro)
```typescript
useEffect(() => {
  const observer = new MutationObserver((mutations) => {
    // Detecta mudança entre modo claro/escuro
    // Reaplica automaticamente as configurações
    applyTheme(config);
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
}, [config]);
```

## 📊 Estatísticas de Uso

### Como Monitorar
```javascript
// Verificar se usuários estão personalizando
const hasCustomization = () => {
  const config = localStorage.getItem("chronus-theme-config");
  if (!config) return false;
  
  const parsed = JSON.parse(config);
  return parsed.primaryColor !== "blue" || parsed.backgroundTone !== "neutral";
};

console.log('🎨 Usuário personalizou tema:', hasCustomization());
```

### Métricas Úteis
- **Taxa de personalização**: % de usuários que alteram as cores padrão
- **Cor mais popular**: Qual cor primária é mais usada
- **Uso de tons**: Quantos usuários exploram tons de fundo
- **Taxa de reset**: Quantos usuários voltam ao padrão

## 🔧 Manutenção e Debug

### ⚠️ Troubleshooting - Problema: "Cores voltam ao padrão após reload"

Se as cores voltam ao padrão após recarregar a página, siga estes passos:

#### 1. Verificar se as configurações estão sendo salvas
```javascript
// No console do navegador, após alterar uma cor
console.log(localStorage.getItem("chronus-theme-config"));
// Deve mostrar algo como: {"primaryColor":"red","backgroundTone":"colored"}
```

#### 2. Verificar os logs de carregamento
```javascript
// Abra DevTools → Console
// Recarregue a página e procure por logs com [THEME]
// Deve aparecer algo como:
// 🔄 [THEME] Iniciando carregamento de configurações...
// ✅ [THEME] Configurações parseadas: {primaryColor: "red", backgroundTone: "colored"}
// 🚀 [THEME] Aplicando tema após inicialização/mudança de config
```

#### 3. Script de teste rápido
```javascript
// Cole no console e execute:
fetch('/test-persistence-simple.js')
  .then(r => r.text())
  .then(script => eval(script));
```

#### 4. Possíveis causas e soluções

**Causa: localStorage bloqueado pelo navegador**
```javascript
// Testar se localStorage está funcionando
try {
  localStorage.setItem('teste', 'ok');
  localStorage.removeItem('teste');
  console.log('✅ localStorage funcionando');
} catch (error) {
  console.log('❌ localStorage bloqueado:', error);
}
```

**Causa: Modo privado/incógnito**
- localStorage pode estar desabilitado
- Use em modo normal do navegador

**Causa: Conflito de tema claro/escuro**
- As cores só aparecem no modo escuro para tons de fundo
- Teste alternando entre modo claro e escuro

**Causa: Cache do navegador**
```javascript
// Forçar reload completo
location.reload(true);
// Ou usar Ctrl+Shift+R
```

### Limpar Dados Locais
```javascript
// Para reset completo durante desenvolvimento
localStorage.removeItem("chronus-theme-config");
location.reload();
```

### Script de Diagnóstico
```javascript
// Execute no console para diagnóstico completo
function diagnosticTheme() {
  console.log('🔍 Diagnóstico do Sistema de Tema');
  console.log('================================');
  
  const storage = localStorage.getItem("chronus-theme-config");
  const isDark = document.documentElement.classList.contains('dark');
  const root = document.documentElement;
  
  console.log('💾 Storage:', storage);
  console.log('🌓 Modo escuro:', isDark);
  console.log('🎨 CSS Vars:', {
    primary: getComputedStyle(root).getPropertyValue('--primary'),
    background: getComputedStyle(root).getPropertyValue('--background'),
    card: getComputedStyle(root).getPropertyValue('--card')
  });
  
  if (storage) {
    try {
      const config = JSON.parse(storage);
      console.log('✅ Configuração válida:', config);
    } catch (error) {
      console.log('❌ Configuração corrompida:', error);
    }
  } else {
    console.log('ℹ️ Usando configuração padrão');
  }
}

// Executar diagnóstico
diagnosticTheme();
```

## 🎯 Melhores Práticas

### Para Desenvolvedores
1. **Sempre verificar localStorage** antes de aplicar configurações padrão
2. **Tratar erros graciosamente** - nunca quebrar a aplicação por erro de tema
3. **Manter compatibilidade** - novos campos devem ter valores padrão
4. **Testar em diferentes navegadores** - localStorage pode ter comportamentos diferentes

### Para Usuários
1. **Experimentar livremente** - todas as mudanças são salvas automaticamente
2. **Usar reset quando necessário** - botão sempre disponível para voltar ao padrão
3. **Testar em modo escuro** - tons de fundo funcionam melhor no dark mode
4. **Considerar acessibilidade** - algumas combinações podem afetar legibilidade

---

**💡 Resumo**: O sistema de persistência de tema funciona de forma transparente e robusta, garantindo que as personalizações do usuário sejam mantidas entre sessões, similar ao sistema de autenticação, mas sem dependências externas. 