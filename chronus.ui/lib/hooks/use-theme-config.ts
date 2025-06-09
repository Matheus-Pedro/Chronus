"use client";

import { useState, useEffect, useCallback } from "react";

// ==========================================
// TIPOS
// ==========================================

export type ThemeColor = 
  | "blue" 
  | "red" 
  | "purple" 
  | "yellow" 
  | "green" 
  | "orange" 
  | "pink" 
  | "indigo";

export type BackgroundTone = 
  | "neutral" 
  | "colored" 
  | "warm" 
  | "cool";

export interface ThemeConfig {
  primaryColor: ThemeColor;
  backgroundTone: BackgroundTone;
}

// ==========================================
// CONFIGURAÇÕES DE CORES
// ==========================================

const COLOR_CONFIGS = {
  blue: {
    light: "217.2 91.2% 59.8%",
    dark: "217.2 91.2% 59.8%",
    backgroundLight: "210 40% 96%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "220 13% 5%",
      warm: "15 8% 4%",
      cool: "220 13% 3%"
    }
  },
  red: {
    light: "0 84.2% 60.2%",
    dark: "0 84.2% 60.2%",
    backgroundLight: "0 40% 96%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "0 13% 5%",
      warm: "0 8% 4%",
      cool: "340 13% 3%"
    }
  },
  purple: {
    light: "262.1 83.3% 57.8%",
    dark: "262.1 83.3% 57.8%",
    backgroundLight: "300 40% 96%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "280 13% 5%",
      warm: "300 8% 4%",
      cool: "280 13% 3%"
    }
  },
  yellow: {
    light: "47.9 95.8% 53.1%",
    dark: "47.9 95.8% 53.1%",
    backgroundLight: "60 40% 96%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "50 13% 5%",
      warm: "45 8% 4%",
      cool: "60 13% 3%"
    }
  },
  green: {
    light: "142.1 76.2% 36.3%",
    dark: "142.1 76.2% 36.3%",
    backgroundLight: "120 40% 96%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "140 13% 5%",
      warm: "120 8% 4%",
      cool: "160 13% 3%"
    }
  },
  orange: {
    light: "24.6 95% 53.1%",
    dark: "24.6 95% 53.1%",
    backgroundLight: "30 40% 96%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "25 13% 5%",
      warm: "20 8% 4%",
      cool: "30 13% 3%"
    }
  },
  pink: {
    light: "330 81% 60%",
    dark: "330 81% 60%",
    backgroundLight: "330 40% 96%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "330 13% 5%",
      warm: "340 8% 4%",
      cool: "320 13% 3%"
    }
  },
  indigo: {
    light: "239 84% 67%",
    dark: "239 84% 67%",
    backgroundLight: "240 40% 96%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "240 13% 5%",
      warm: "250 8% 4%",
      cool: "230 13% 3%"
    }
  }
};

// ==========================================
// HOOK
// ==========================================

export function useThemeConfig() {
  const [config, setConfig] = useState<ThemeConfig>({
    primaryColor: "blue",
    backgroundTone: "neutral"
  });
  
  const [isInitialized, setIsInitialized] = useState(false);

  // ==========================================
  // CARREGAMENTO INICIAL
  // ==========================================

  useEffect(() => {
    console.log("🔄 [THEME] Iniciando carregamento de configurações...");
    
    try {
      const savedConfig = localStorage.getItem("chronus-theme-config");
      console.log("🔍 [THEME] Valor do localStorage:", savedConfig);
      
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          console.log("✅ [THEME] Configurações parseadas:", parsed);
          
          // Validar se a configuração tem os campos necessários
          if (parsed.primaryColor && parsed.backgroundTone) {
            setConfig(parsed);
            console.log("🎯 [THEME] Configurações aplicadas ao estado");
          } else {
            console.warn("⚠️ [THEME] Configuração inválida, usando padrão");
          }
        } catch (parseError) {
          console.error("❌ [THEME] Erro ao fazer parse da configuração:", parseError);
        }
      } else {
        console.log("ℹ️ [THEME] Nenhuma configuração salva, usando padrão");
      }
    } catch (storageError) {
      console.error("❌ [THEME] Erro ao acessar localStorage:", storageError);
    }
    
    // Marcar como inicializado para permitir aplicação do tema
    console.log("🏁 [THEME] Marcando como inicializado");
    setIsInitialized(true);
  }, []);

  // ==========================================
  // APLICAR TEMA
  // ==========================================

  const applyTheme = useCallback((newConfig: ThemeConfig) => {
    if (!isInitialized) {
      console.log("⏳ [THEME] Aguardando inicialização para aplicar tema...");
      return;
    }
    
    console.log("🎨 [THEME] Iniciando aplicação do tema:", newConfig);
    
    const colorConfig = COLOR_CONFIGS[newConfig.primaryColor];
    if (!colorConfig) {
      console.error("❌ [THEME] Configuração de cor não encontrada:", newConfig.primaryColor);
      return;
    }
    
    const isDark = document.documentElement.classList.contains("dark");
    const root = document.documentElement;
    
    console.log("🌓 [THEME] Estado do modo:", { isDark, primaryColor: newConfig.primaryColor, backgroundTone: newConfig.backgroundTone });
    
    // Cor primária (aplicada em ambos os modos)
    root.style.setProperty("--primary", colorConfig.light);
    console.log("🎯 [THEME] Cor primária aplicada:", colorConfig.light);
    
    // Configurações específicas para cada modo
    if (isDark) {
      // Modo escuro - aplicar cores personalizadas
      const backgroundDark = colorConfig.backgroundDark[newConfig.backgroundTone];
      if (backgroundDark) {
        root.style.setProperty("--background", backgroundDark);
        root.style.setProperty("--card", `${backgroundDark.split(" ")[0]} ${backgroundDark.split(" ")[1]} ${parseInt(backgroundDark.split(" ")[2]) + 3}%`);
        root.style.setProperty("--popover", backgroundDark);
        root.style.setProperty("--secondary", `${backgroundDark.split(" ")[0]} ${backgroundDark.split(" ")[1]} ${parseInt(backgroundDark.split(" ")[2]) + 9}%`);
        root.style.setProperty("--border", `${backgroundDark.split(" ")[0]} ${backgroundDark.split(" ")[1]} ${parseInt(backgroundDark.split(" ")[2]) + 12}%`);
        
        console.log("✅ [THEME] Cores personalizadas aplicadas para modo escuro:", backgroundDark);
      } else {
        console.error("❌ [THEME] Tom de fundo não encontrado:", newConfig.backgroundTone);
      }
    } else {
      // Modo claro - resetar TODAS as variáveis personalizadas
      const customVariables = [
        "--background",
        "--card", 
        "--popover",
        "--secondary",
        "--border",
        "--muted",
        "--accent",
        "--input"
      ];
      
      customVariables.forEach(variable => {
        root.style.removeProperty(variable);
      });
      
      console.log("🧹 [THEME] Variáveis personalizadas resetadas para modo claro");
    }
    
    console.log("🎉 [THEME] Tema aplicado com sucesso!");
  }, [isInitialized]);

  // ==========================================
  // APLICAR TEMA NO CARREGAMENTO E MUDANÇAS
  // ==========================================

  useEffect(() => {
    if (isInitialized) {
      console.log("🚀 [THEME] Aplicando tema após inicialização/mudança de config:", config);
      applyTheme(config);
    } else {
      console.log("⏸️ [THEME] Ainda não inicializado, aguardando...");
    }
  }, [config, applyTheme, isInitialized]);

  // ==========================================
  // OBSERVAR MUDANÇAS DE TEMA (ESCURO/CLARO)
  // ==========================================

  useEffect(() => {
    if (!isInitialized) return;
    
    let isApplying = false; // Flag para evitar loops infinitos
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class' && !isApplying) {
          // Verificar se realmente mudou entre dark/light
          const targetElement = mutation.target as HTMLElement;
          
          // Só reaplicar se realmente mudou o modo dark/light
          if (targetElement === document.documentElement) {
            console.log("🌓 Detectada mudança de modo escuro/claro, reaplicando tema...");
            isApplying = true;
            
            // Timeout para evitar conflitos
            setTimeout(() => {
              applyTheme(config);
              isApplying = false;
            }, 10);
          }
        }
      });
    });

    // Observar mudanças na classe do elemento html
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [config, applyTheme, isInitialized]);

  // ==========================================
  // ATUALIZAR CONFIGURAÇÃO
  // ==========================================

  const updateConfig = useCallback((newConfig: Partial<ThemeConfig>) => {
    console.log("🔧 [THEME] Atualizando configuração:", newConfig);
    
    const updatedConfig = { ...config, ...newConfig };
    console.log("📝 [THEME] Nova configuração completa:", updatedConfig);
    
    // Atualizar estado
    setConfig(updatedConfig);
    
    // Salvar no localStorage
    try {
      const configString = JSON.stringify(updatedConfig);
      localStorage.setItem("chronus-theme-config", configString);
      console.log("💾 [THEME] Configuração salva no localStorage:", configString);
      
      // Verificar se foi salvo corretamente
      const verification = localStorage.getItem("chronus-theme-config");
      if (verification === configString) {
        console.log("✅ [THEME] Verificação de salvamento bem-sucedida");
      } else {
        console.error("❌ [THEME] Falha na verificação de salvamento");
      }
    } catch (saveError) {
      console.error("❌ [THEME] Erro ao salvar no localStorage:", saveError);
    }
    
    // Aplicar tema
    applyTheme(updatedConfig);
  }, [config, applyTheme]);

  // ==========================================
  // RESETAR PARA PADRÃO
  // ==========================================

  const resetToDefault = useCallback(() => {
    const defaultConfig: ThemeConfig = {
      primaryColor: "blue",
      backgroundTone: "neutral"
    };
    
    setConfig(defaultConfig);
    localStorage.removeItem("chronus-theme-config");
    applyTheme(defaultConfig);
  }, [applyTheme]);

  // ==========================================
  // INFORMAÇÕES SOBRE AS CORES
  // ==========================================

  const getColorInfo = (color: ThemeColor) => ({
    name: {
      blue: "Azul",
      red: "Vermelho", 
      purple: "Roxo",
      yellow: "Amarelo",
      green: "Verde",
      orange: "Laranja",
      pink: "Rosa",
      indigo: "Índigo"
    }[color],
    preview: COLOR_CONFIGS[color].light
  });

  const getToneInfo = (tone: BackgroundTone) => ({
    name: {
      neutral: "Neutro",
      colored: "Colorido",
      warm: "Quente", 
      cool: "Frio"
    }[tone],
    description: {
      neutral: "Fundo preto/cinza padrão",
      colored: "Fundo com leve tom da cor principal",
      warm: "Fundo com tons mais quentes",
      cool: "Fundo com tons mais frios"
    }[tone]
  });

  return {
    config,
    updateConfig,
    resetToDefault,
    getColorInfo,
    getToneInfo,
    availableColors: Object.keys(COLOR_CONFIGS) as ThemeColor[],
    availableTones: ["neutral", "colored", "warm", "cool"] as BackgroundTone[]
  };
} 