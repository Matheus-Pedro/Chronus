"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Palette, 
  RotateCcw, 
  Check,
  Monitor,
  Sun,
  Moon,
  Thermometer,
  Snowflake
} from "lucide-react";
import { useThemeConfig, type ThemeColor, type BackgroundTone } from "@/lib/hooks/use-theme-config";

// ==========================================
// ÍCONES PARA CORES
// ==========================================

const COLOR_ICONS = {
  blue: "🔵",
  red: "🔴", 
  purple: "🟣",
  yellow: "🟡",
  green: "🟢",
  orange: "🟠",
  pink: "🩷",
  indigo: "🟦"
};

const TONE_ICONS = {
  neutral: Monitor,
  colored: Palette,
  warm: Thermometer,
  cool: Snowflake
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export function ThemeCustomizer() {
  const { 
    config, 
    updateConfig, 
    resetToDefault, 
    getColorInfo, 
    getToneInfo, 
    availableColors, 
    availableTones 
  } = useThemeConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personalização de Cores</h2>
          <p className="text-muted-foreground">
            Customize a aparência do dashboard conforme seu gosto
          </p>
        </div>
        <Button 
          onClick={resetToDefault} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Resetar
        </Button>
      </div>

      {/* Preview */}
      <Card className="border-2 border-dashed">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Preview</CardTitle>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="gap-1">
              {COLOR_ICONS[config.primaryColor]} {getColorInfo(config.primaryColor).name}
            </Badge>
            <Badge variant="outline" className="gap-1">
              {TONE_ICONS[config.backgroundTone] && 
                React.createElement(TONE_ICONS[config.backgroundTone], { className: "h-3 w-3" })
              } {getToneInfo(config.backgroundTone).name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary h-12 rounded-md flex items-center justify-center text-primary-foreground text-sm font-medium">
              Primária
            </div>
            <div className="bg-card border h-12 rounded-md flex items-center justify-center text-card-foreground text-sm">
              Card
            </div>
            <div className="bg-secondary h-12 rounded-md flex items-center justify-center text-secondary-foreground text-sm">
              Secundária
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cores Primárias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Cor Principal
            </CardTitle>
            <CardDescription>
              Escolha a cor principal que aparecerá nos botões, links e elementos destacados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {availableColors.map((color) => {
                const colorInfo = getColorInfo(color);
                const isSelected = config.primaryColor === color;
                
                return (
                  <Button
                    key={color}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-12 gap-3 justify-start ${isSelected ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    onClick={() => updateConfig({ primaryColor: color })}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: `hsl(${colorInfo.preview})` }}
                    />
                    <span>{colorInfo.name}</span>
                    {isSelected && <Check className="h-4 w-4 ml-auto" />}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tom do Fundo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Tom do Fundo
            </CardTitle>
            <CardDescription>
              Ajuste o tom do fundo no modo escuro (funciona melhor no tema escuro)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableTones.map((tone) => {
                const toneInfo = getToneInfo(tone);
                const isSelected = config.backgroundTone === tone;
                const IconComponent = TONE_ICONS[tone];
                
                return (
                  <Button
                    key={tone}
                    variant={isSelected ? "default" : "ghost"}
                    className={`w-full h-auto p-4 justify-start ${isSelected ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    onClick={() => updateConfig({ backgroundTone: tone })}
                  >
                    <div className="flex items-start gap-3 text-left">
                      <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{toneInfo.name}</span>
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {toneInfo.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dicas */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">💡 Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">💾 Salvamento Automático</p>
              <p className="text-muted-foreground">Suas configurações são salvas automaticamente no navegador, assim como seu login</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">🔄 Persistência Entre Sessões</p>
              <p className="text-muted-foreground">Suas cores personalizadas são mantidas mesmo após fechar e reabrir o navegador</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">🌓 Adaptação Inteligente</p>
              <p className="text-muted-foreground">Tons de fundo se aplicam automaticamente no modo escuro, cores principais funcionam em ambos os modos</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">🔄 Reset Disponível</p>
              <p className="text-muted-foreground">Use o botão &quot;Resetar&quot; para voltar às configurações padrão a qualquer momento</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">🌐 Funcionamento Offline</p>
              <p className="text-muted-foreground">Suas personalizações não dependem de conexão com a internet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 