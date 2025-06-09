"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeCustomizer } from "@/components/dashboard/theme-customizer";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  User, 
  Bell, 
  Shield, 
  Palette
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header com seta voltar */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Configurações</h1>
        </div>
        <p className="text-muted-foreground">
          Personalize sua experiência no Chronus
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto">
        <Card className="bg-primary text-primary-foreground border-primary">
          <CardContent className="p-4 min-w-fit">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="font-medium">Aparência</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="opacity-50 cursor-not-allowed">
          <CardContent className="p-4 min-w-fit">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Perfil</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="opacity-50 cursor-not-allowed">
          <CardContent className="p-4 min-w-fit">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="font-medium">Notificações</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="opacity-50 cursor-not-allowed">
          <CardContent className="p-4 min-w-fit">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Privacidade</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Theme Customization */}
        <section>
          <ThemeCustomizer />
        </section>

        {/* Coming Soon */}
        <Card className="bg-muted/30 border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="text-muted-foreground">🚀 Em breve</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground text-sm">
              Mais opções de configuração estarão disponíveis em atualizações futuras
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 