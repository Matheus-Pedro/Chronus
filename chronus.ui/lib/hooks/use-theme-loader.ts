"use client";

import { useEffect } from "react";
import type { ThemeConfig, ThemeColor, BackgroundTone } from "./use-theme-config";

// ==========================================
// CONFIGURAÇÕES DE CORES (duplicada do use-theme-config)
// ==========================================

const COLOR_CONFIGS = {
  blue: {
    light: "217.2 91.2% 59.8%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "220 13% 5%",
      warm: "15 8% 4%",
      cool: "220 13% 3%"
    }
  },
  red: {
    light: "0 84.2% 60.2%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "0 13% 5%",
      warm: "0 8% 4%",
      cool: "340 13% 3%"
    }
  },
  purple: {
    light: "262.1 83.3% 57.8%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "280 13% 5%",
      warm: "300 8% 4%",
      cool: "280 13% 3%"
    }
  },
  yellow: {
    light: "47.9 95.8% 53.1%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "50 13% 5%",
      warm: "45 8% 4%",
      cool: "60 13% 3%"
    }
  },
  green: {
    light: "142.1 76.2% 36.3%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "140 13% 5%",
      warm: "120 8% 4%",
      cool: "160 13% 3%"
    }
  },
  orange: {
    light: "24.6 95% 53.1%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "25 13% 5%",
      warm: "20 8% 4%",
      cool: "30 13% 3%"
    }
  },
  pink: {
    light: "330 81% 60%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "330 13% 5%",
      warm: "340 8% 4%",
      cool: "320 13% 3%"
    }
  },
  indigo: {
    light: "239 84% 67%",
    backgroundDark: {
      neutral: "0 0% 3%",
      colored: "240 13% 5%",
      warm: "250 8% 4%",
      cool: "230 13% 3%"
    }
  }
};

// ==========================================
// FUNÇÃO PARA APLICAR TEMA
// ==========================================

function applyThemeGlobally(config: ThemeConfig) {
  console.log("🌍 [THEME-GLOBAL] Aplicando tema globalmente:", config);
  
  const colorConfig = COLOR_CONFIGS[config.primaryColor];
  if (!colorConfig) {
    console.error("❌ [THEME-GLOBAL] Configuração de cor não encontrada:", config.primaryColor);
    return;
  }
  
  const isDark = document.documentElement.classList.contains("dark");
  const root = document.documentElement;
  
  console.log("🌓 [THEME-GLOBAL] Estado do modo:", { isDark, ...config });
  
  // Cor primária (aplicada em ambos os modos)
  root.style.setProperty("--primary", colorConfig.light);
  console.log("🎯 [THEME-GLOBAL] Cor primária aplicada:", colorConfig.light);
  
  // Configurações específicas para cada modo
  if (isDark) {
    // Modo escuro - aplicar cores personalizadas
    const backgroundDark = colorConfig.backgroundDark[config.backgroundTone];
    if (backgroundDark) {
      root.style.setProperty("--background", backgroundDark);
      root.style.setProperty("--card", `${backgroundDark.split(" ")[0]} ${backgroundDark.split(" ")[1]} ${parseInt(backgroundDark.split(" ")[2]) + 3}%`);
      root.style.setProperty("--popover", backgroundDark);
      root.style.setProperty("--secondary", `${backgroundDark.split(" ")[0]} ${backgroundDark.split(" ")[1]} ${parseInt(backgroundDark.split(" ")[2]) + 9}%`);
      root.style.setProperty("--border", `${backgroundDark.split(" ")[0]} ${backgroundDark.split(" ")[1]} ${parseInt(backgroundDark.split(" ")[2]) + 12}%`);
      
      console.log("✅ [THEME-GLOBAL] Cores personalizadas aplicadas para modo escuro:", backgroundDark);
    } else {
      console.error("❌ [THEME-GLOBAL] Tom de fundo não encontrado:", config.backgroundTone);
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
    
    console.log("🧹 [THEME-GLOBAL] Variáveis personalizadas resetadas para modo claro");
  }
  
  console.log("🎉 [THEME-GLOBAL] Tema aplicado globalmente com sucesso!");
}

// ==========================================
// HOOK PARA CARREGAR TEMA GLOBALMENTE
// ==========================================

export function useThemeLoader() {
  useEffect(() => {
    console.log("🔄 [THEME-GLOBAL] Iniciando carregamento global de tema...");
    
    let config: ThemeConfig = {
      primaryColor: "blue",
      backgroundTone: "neutral"
    };
    
    try {
      const savedConfig = localStorage.getItem("chronus-theme-config");
      console.log("🔍 [THEME-GLOBAL] Valor do localStorage:", savedConfig);
      
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          console.log("✅ [THEME-GLOBAL] Configurações parseadas:", parsed);
          
          // Validar se a configuração tem os campos necessários
          if (parsed.primaryColor && parsed.backgroundTone) {
            config = parsed;
            console.log("🎯 [THEME-GLOBAL] Configurações carregadas do localStorage");
          } else {
            console.warn("⚠️ [THEME-GLOBAL] Configuração inválida, usando padrão");
          }
        } catch (parseError) {
          console.error("❌ [THEME-GLOBAL] Erro ao fazer parse da configuração:", parseError);
        }
      } else {
        console.log("ℹ️ [THEME-GLOBAL] Nenhuma configuração salva, usando padrão");
      }
    } catch (storageError) {
      console.error("❌ [THEME-GLOBAL] Erro ao acessar localStorage:", storageError);
    }
    
    // Aplicar tema imediatamente
    applyThemeGlobally(config);
    
    // Observar mudanças de modo escuro/claro
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const targetElement = mutation.target as HTMLElement;
          
          if (targetElement === document.documentElement) {
            console.log("🌓 [THEME-GLOBAL] Detectada mudança de modo escuro/claro, reaplicando tema...");
            
            // Timeout para evitar conflitos
            setTimeout(() => {
              applyThemeGlobally(config);
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
    
    // Observar mudanças no localStorage (mudanças de outras abas ou da página de configurações)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chronus-theme-config') {
        console.log("🔄 [THEME-GLOBAL] Detectada mudança no localStorage");
        
        if (e.newValue) {
          try {
            const newConfig = JSON.parse(e.newValue);
            console.log("🔄 [THEME-GLOBAL] Nova configuração do localStorage:", newConfig);
            config = newConfig;
            applyThemeGlobally(newConfig);
          } catch (error) {
            console.error("❌ [THEME-GLOBAL] Erro ao processar nova configuração:", error);
          }
        } else {
          // localStorage foi limpo, voltar ao padrão
          console.log("🔄 [THEME-GLOBAL] localStorage limpo, voltando ao padrão");
          config = { primaryColor: "blue", backgroundTone: "neutral" };
          applyThemeGlobally(config);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    console.log("🚀 [THEME-GLOBAL] Sistema de tema global inicializado");
    
    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      console.log("🧹 [THEME-GLOBAL] Cleanup realizado");
    };
  }, []);
} 