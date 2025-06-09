"use client";

import { useThemeLoader } from "@/lib/hooks/use-theme-loader";

/**
 * Componente responsável por carregar e aplicar o tema personalizado
 * globalmente em toda a aplicação.
 * 
 * Este componente deve ser incluído no layout principal para garantir
 * que as configurações de cor sejam aplicadas em todas as páginas.
 */
export function ThemeLoader() {
  // Este hook carrega as configurações do localStorage e aplica o tema
  useThemeLoader();
  
  // Este componente não renderiza nada, apenas executa o hook
  return null;
} 