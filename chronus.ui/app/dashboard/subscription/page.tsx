"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  Users, 
  Calendar,
  BarChart3,
  Shield,
  Loader2,
  CreditCard,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  current?: boolean;
}

interface CheckoutResponse {
  url: string;
}

export default function SubscriptionPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      interval: 'monthly',
      features: [
        'Até 10 tarefas por mês',
        'Interface básica',
        'Suporte por email',
        'Sincronização limitada'
      ],
      current: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.90,
      interval: 'monthly',
      features: [
        'Tarefas ilimitadas',
        'Projetos e categorias',
        'Relatórios avançados',
        'Notificações inteligentes',
        'Suporte prioritário',
        'Integração com calendário'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 39.90,
      interval: 'monthly',
      features: [
        'Todos os recursos do Pro',
        'Equipes e colaboração',
        'Analytics avançado',
        'API personalizada',
        'Backup automático',
        'Suporte 24/7',
        'Integração com ferramentas'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      setError('Você precisa estar logado para assinar um plano');
      return;
    }

    if (planId === 'free') {
      setError('Você já está no plano gratuito');
      return;
    }

    try {
      setLoading(planId);
      setError(null);

      // Mapear planId string para SubscriptionType enum
      const planTypeMap: { [key: string]: number } = {
        'free': 1,     // SubscriptionType.Free = 1
        'pro': 2,      // SubscriptionType.Pro = 2
        'premium': 3   // SubscriptionType.Premium = 3
      };

      const subscriptionType = planTypeMap[planId];
      if (!subscriptionType) {
        setError('Plano inválido selecionado');
        return;
      }

      console.log('🔄 Criando checkout para:', { planId, subscriptionType, userId: user?.id });

      // Chamar API de checkout com o tipo correto
      const response = await apiClient.post<CheckoutResponse>('/api/subscription/checkout', {
        type: subscriptionType  // Enviar como número do enum
      });

      console.log('✅ Checkout Response:', response);

      // Se a API retornar uma URL de checkout, redirecionar
      if (response.url) {
        window.location.href = response.url;
      } else {
        setError('URL de checkout não recebida. Tente novamente.');
      }

    } catch (err: any) {
      console.error('❌ Checkout Error:', err);
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return Calendar;
      case 'pro': return Zap;
      case 'premium': return Crown;
      default: return CheckCircle;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para acessar os planos de assinatura.
            </p>
            <Button asChild>
              <a href="/login">Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Botão de Voltar */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Escolha seu plano no <span className="text-primary">Chronus</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Potencialize sua produtividade com recursos avançados de gerenciamento de tarefas
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="secondary">
            <CreditCard className="h-3 w-3 mr-1" />
            Integração Stripe Ativa
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const IconComponent = getPlanIcon(plan.id);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : plan.current 
                    ? 'border-green-500 bg-green-50/50' 
                    : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Mais Popular
                  </Badge>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white">
                    Plano Atual
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-muted-foreground">
                    /{plan.interval === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : plan.current ? "secondary" : "outline"}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || plan.current}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : plan.current ? (
                    'Plano Atual'
                  ) : plan.id === 'free' ? (
                    'Gratuito'
                  ) : (
                    `Assinar ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Compare os recursos
        </h2>
        
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">Colaboração</h3>
                <p className="text-sm text-muted-foreground">
                  Trabalhe em equipe com recursos de compartilhamento avançados
                </p>
                <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                  Em breve
                </Badge>
              </div>
              
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Relatórios detalhados sobre sua produtividade
                </p>
                <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                  Em breve
                </Badge>
              </div>
              
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold mb-2">Segurança</h3>
                <p className="text-sm text-muted-foreground">
                  Backup automático e sincronização segura
                </p>
                <Badge variant="outline" className="mt-2 bg-blue-500/10 text-blue-600 border-blue-500/20">
                  Ativo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Dúvidas Frequentes</h2>
        <div className="space-y-4 text-left">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-sm text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Há garantia de reembolso?</h3>
              <p className="text-sm text-muted-foreground">
                Oferecemos 5 dias de garantia. Se não ficar satisfeito, reembolsamos 100%.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Como funciona o pagamento?</h3>
              <p className="text-sm text-muted-foreground">
                Utilizamos o Stripe para processar pagamentos de forma segura. Cartão de crédito e débito.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 