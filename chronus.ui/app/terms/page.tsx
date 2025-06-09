"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  UserCheck, 
  CreditCard,
  AlertTriangle,
  Mail,
  Calendar,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header com Botão de Voltar */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Termos de Serviço</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Chronus - Plataforma de Gestão de Tarefas
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                Última atualização: 02/01/2025
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Versão 1.0
              </Badge>
            </div>
          </div>
        </div>

        {/* Índice de Navegação */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Índice
            </CardTitle>
            <CardDescription>
              Navegue pelos termos de serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Link href="#aceitacao" className="block text-sm text-primary hover:underline">
                  1. Aceitação dos Termos
                </Link>
                <Link href="#descricao" className="block text-sm text-primary hover:underline">
                  2. Descrição do Serviço
                </Link>
                <Link href="#conta" className="block text-sm text-primary hover:underline">
                  3. Conta do Usuário
                </Link>
                <Link href="#uso" className="block text-sm text-primary hover:underline">
                  4. Uso Aceitável
                </Link>
                <Link href="#privacidade" className="block text-sm text-primary hover:underline">
                  5. Privacidade e Dados
                </Link>
              </div>
              <div className="space-y-2">
                <Link href="#pagamento" className="block text-sm text-primary hover:underline">
                  6. Assinaturas e Pagamentos
                </Link>
                <Link href="#propriedade" className="block text-sm text-primary hover:underline">
                  7. Propriedade Intelectual
                </Link>
                <Link href="#limitacoes" className="block text-sm text-primary hover:underline">
                  8. Limitações de Responsabilidade
                </Link>
                <Link href="#modificacoes" className="block text-sm text-primary hover:underline">
                  9. Modificações
                </Link>
                <Link href="#contato" className="block text-sm text-primary hover:underline">
                  10. Contato
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo dos Termos */}
        <div className="space-y-8">
          
          {/* 1. Aceitação dos Termos */}
          <Card id="aceitacao">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                1. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e usar o <strong>Chronus</strong>, você concorda em cumprir e estar sujeito aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso serviço.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Estes termos se aplicam a todos os usuários, incluindo visitantes, usuários registrados e assinantes de planos pagos.
              </p>
            </CardContent>
          </Card>

          {/* 2. Descrição do Serviço */}
          <Card id="descricao">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                2. Descrição do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                O <strong>Chronus</strong> é uma plataforma web de gestão de tarefas e produtividade que oferece:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Criação, organização e gerenciamento de tarefas</li>
                <li>Dashboard inteligente com estatísticas de produtividade</li>
                <li>Sistema de notificações e lembretes</li>
                <li>Relatórios e análises de desempenho</li>
                <li>Sincronização em tempo real entre dispositivos</li>
                <li>Recursos avançados para assinantes de planos pagos</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer momento, com aviso prévio quando possível.
              </p>
            </CardContent>
          </Card>

          {/* 3. Conta do Usuário */}
          <Card id="conta">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-600" />
                3. Conta do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">3.1 Registro</h4>
              <p className="text-muted-foreground leading-relaxed">
                Para usar determinados recursos do Chronus, você deve criar uma conta fornecendo informações precisas, atuais e completas. É sua responsabilidade manter a confidencialidade das credenciais de acesso.
              </p>
              
              <h4 className="font-semibold">3.2 Responsabilidades do Usuário</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Manter suas informações de conta atualizadas</li>
                <li>Proteger suas credenciais de acesso</li>
                <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                <li>Usar a conta exclusivamente para fins pessoais ou comerciais legítimos</li>
              </ul>

              <h4 className="font-semibold">3.3 Suspensão ou Encerramento</h4>
              <p className="text-muted-foreground leading-relaxed">
                Podemos suspender ou encerrar sua conta por violação destes termos, uso inadequado do serviço ou por motivos de segurança, mediante notificação quando aplicável.
              </p>
            </CardContent>
          </Card>

          {/* 4. Uso Aceitável */}
          <Card id="uso">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                4. Uso Aceitável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">4.1 Condutas Permitidas</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Usar o serviço para gestão pessoal ou profissional de tarefas</li>
                <li>Criar e organizar conteúdo próprio</li>
                <li>Compartilhar o serviço com outros usuários de forma adequada</li>
              </ul>

              <h4 className="font-semibold">4.2 Condutas Proibidas</h4>
              <p className="text-muted-foreground mb-2">É estritamente proibido:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Usar o serviço para atividades ilegais ou prejudiciais</li>
                <li>Tentar comprometer a segurança do sistema</li>
                <li>Criar múltiplas contas para contornar limitações</li>
                <li>Enviar spam, malware ou conteúdo malicioso</li>
                <li>Violar direitos de terceiros</li>
                <li>Fazer engenharia reversa do software</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5. Privacidade e Dados */}
          <Card id="privacidade">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                5. Privacidade e Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">5.1 Coleta de Dados</h4>
              <p className="text-muted-foreground leading-relaxed">
                Coletamos apenas os dados necessários para fornecer nossos serviços, incluindo informações de registro, dados de uso e preferências de configuração.
              </p>

              <h4 className="font-semibold">5.2 Uso dos Dados</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Fornecimento e melhoria do serviço</li>
                <li>Comunicação sobre o serviço</li>
                <li>Análises estatísticas agregadas e anônimas</li>
                <li>Cumprimento de obrigações legais</li>
              </ul>

              <h4 className="font-semibold">5.3 Proteção</h4>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Para informações detalhadas sobre como tratamos seus dados, consulte nossa 
                  <Link href="/privacy" className="text-blue-600 hover:underline ml-1">
                    Política de Privacidade
                  </Link>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Assinaturas e Pagamentos */}
          <Card id="pagamento">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                6. Assinaturas e Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">6.1 Planos Disponíveis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h5 className="font-medium">Free</h5>
                  <p className="text-sm text-muted-foreground">Recursos básicos gratuitos</p>
                </div>
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <h5 className="font-medium">Pro - R$ 19,90/mês</h5>
                  <p className="text-sm text-muted-foreground">Recursos avançados para profissionais</p>
                </div>
                <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                  <h5 className="font-medium">Premium - R$ 39,90/mês</h5>
                  <p className="text-sm text-muted-foreground">Funcionalidades completas para equipes</p>
                </div>
              </div>

              <h4 className="font-semibold">6.2 Faturamento</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Assinaturas são faturadas mensalmente de forma recorrente</li>
                <li>Pagamentos processados via Stripe com segurança</li>
                <li>Renovação automática até o cancelamento</li>
                <li>Preços em Reais (BRL) incluem impostos aplicáveis</li>
              </ul>

              <h4 className="font-semibold">6.3 Cancelamento e Reembolso</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Cancele a qualquer momento através do dashboard</li>
                <li>Acesso mantido até o final do período pago</li>
                <li>Reembolso integral em até 5 dias após o pagamento</li>
                <li>Sem taxas de cancelamento ou multas</li>
              </ul>
            </CardContent>
          </Card>

          {/* 7. Propriedade Intelectual */}
          <Card id="propriedade">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                7. Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">7.1 Propriedade do Chronus</h4>
              <p className="text-muted-foreground leading-relaxed">
                O Chronus, incluindo seu código-fonte, design, marca, logotipos e conteúdo, é protegido por direitos autorais e outras leis de propriedade intelectual. Todos os direitos são reservados.
              </p>

              <h4 className="font-semibold">7.2 Conteúdo do Usuário</h4>
              <p className="text-muted-foreground leading-relaxed">
                Você mantém todos os direitos sobre o conteúdo que cria no Chronus (suas tarefas, notas, etc.). Ao usar nosso serviço, você nos concede uma licença limitada para processar e armazenar seu conteúdo exclusivamente para fornecer o serviço.
              </p>

              <h4 className="font-semibold">7.3 Uso da Marca</h4>
              <p className="text-muted-foreground leading-relaxed">
                O nome "Chronus" e logotipos associados são marcas registradas. Não é permitido usar nossas marcas sem autorização prévia por escrito.
              </p>
            </CardContent>
          </Card>

          {/* 8. Limitações de Responsabilidade */}
          <Card id="limitacoes">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                8. Limitações de Responsabilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">8.1 Disponibilidade do Serviço</h4>
              <p className="text-muted-foreground leading-relaxed">
                Embora nos esforcemos para manter o serviço disponível 24/7, não garantimos operação ininterrupta. Manutenções programadas serão comunicadas previamente quando possível.
              </p>

              <h4 className="font-semibold">8.2 Limitação de Responsabilidade</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 leading-relaxed">
                  <strong>IMPORTANTE:</strong> Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais ou consequenciais, incluindo perda de dados, lucros cessantes ou interrupção de negócios, mesmo se informados sobre a possibilidade de tais danos.
                </p>
              </div>

              <h4 className="font-semibold">8.3 Backup e Recuperação</h4>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos backups regulares dos dados, mas recomendamos que você faça suas próprias cópias de segurança de informações críticas.
              </p>
            </CardContent>
          </Card>

          {/* 9. Modificações */}
          <Card id="modificacoes">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                9. Modificações dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações serão efetivas imediatamente após a publicação nesta página.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Mudanças significativas serão comunicadas por email aos usuários registrados com pelo menos 30 dias de antecedência. O uso continuado do serviço após as modificações constitui aceitação dos novos termos.
              </p>
            </CardContent>
          </Card>

          {/* 10. Contato */}
          <Card id="contato">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                10. Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Para dúvidas sobre estes termos ou sobre o serviço Chronus, entre em contato conosco:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Suporte Geral</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Email: <Link href="mailto:suporte@chronus.app" className="text-primary hover:underline">suporte@chronus.app</Link></p>
                    <p>Horário: Segunda a Sexta, 9h às 18h (BRT)</p>
                    <p>Tempo de resposta: Até 24h úteis</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Questões Legais</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Email: <Link href="mailto:legal@chronus.app" className="text-primary hover:underline">legal@chronus.app</Link></p>
                    <p>Para questões sobre privacidade, termos e conformidade</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Footer dos Termos */}
        <div className="text-center space-y-4">
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Aceitação dos Termos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ao usar o Chronus, você confirma que leu, compreendeu e concorda com estes Termos de Serviço.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/register">Criar Conta</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/privacy">Ver Política de Privacidade</Link>
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Última atualização: 02 de Janeiro de 2025 • Versão 1.0 • Chronus - Gestão de Tarefas
          </p>
        </div>
      </div>
    </div>
  );
} 