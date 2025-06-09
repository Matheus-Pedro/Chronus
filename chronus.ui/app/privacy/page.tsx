"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  Database, 
  Users,
  Lock,
  Cookie,
  Mail,
  Calendar,
  Clock,
  UserCheck,
  CreditCard,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Política de Privacidade</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Chronus - Como protegemos seus dados pessoais
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
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Conforme LGPD
              </Badge>
            </div>
          </div>
        </div>

        {/* Índice de Navegação */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Índice
            </CardTitle>
            <CardDescription>
              Navegue pela nossa política de privacidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Link href="#introducao" className="block text-sm text-primary hover:underline">
                  1. Introdução
                </Link>
                <Link href="#dados-coletados" className="block text-sm text-primary hover:underline">
                  2. Dados que Coletamos
                </Link>
                <Link href="#finalidades" className="block text-sm text-primary hover:underline">
                  3. Como Usamos seus Dados
                </Link>
                <Link href="#base-legal" className="block text-sm text-primary hover:underline">
                  4. Base Legal
                </Link>
                <Link href="#compartilhamento" className="block text-sm text-primary hover:underline">
                  5. Compartilhamento de Dados
                </Link>
              </div>
              <div className="space-y-2">
                <Link href="#seguranca" className="block text-sm text-primary hover:underline">
                  6. Segurança dos Dados
                </Link>
                <Link href="#direitos" className="block text-sm text-primary hover:underline">
                  7. Seus Direitos
                </Link>
                <Link href="#cookies" className="block text-sm text-primary hover:underline">
                  8. Cookies e Tecnologias
                </Link>
                <Link href="#retencao" className="block text-sm text-primary hover:underline">
                  9. Retenção de Dados
                </Link>
                <Link href="#contato" className="block text-sm text-primary hover:underline">
                  10. Contato
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo da Política */}
        <div className="space-y-8">
          
          {/* 1. Introdução */}
          <Card id="introducao">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                1. Introdução
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                O <strong>Chronus</strong> respeita sua privacidade e está comprometido em proteger seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)</strong> e outras regulamentações aplicáveis.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ao usar nossos serviços, você concorda com as práticas descritas nesta política. Se você tiver dúvidas ou não concordar com qualquer parte desta política, entre em contato conosco antes de continuar usando o Chronus.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Recomendamos que você leia esta política junto com nossos 
                  <Link href="/terms" className="text-blue-600 hover:underline ml-1">
                    Termos de Serviço
                  </Link> para uma compreensão completa de nossos compromissos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Dados que Coletamos */}
          <Card id="dados-coletados">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                2. Dados que Coletamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">2.1 Dados Fornecidos por Você</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Informações de Registro:</strong> Nome, e-mail e senha</li>
                <li><strong>Conteúdo das Tarefas:</strong> Títulos, descrições e datas de vencimento</li>
                <li><strong>Preferências:</strong> Configurações de tema e notificações</li>
                <li><strong>Comunicações:</strong> Mensagens enviadas para nosso suporte</li>
              </ul>

              <h4 className="font-semibold">2.2 Dados Coletados Automaticamente</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Dados de Uso:</strong> Como você interage com a plataforma</li>
                <li><strong>Informações Técnicas:</strong> Endereço IP, navegador, dispositivo</li>
                <li><strong>Dados de Performance:</strong> Tempo de carregamento e erros</li>
                <li><strong>Estatísticas:</strong> Métricas de produtividade agregadas</li>
              </ul>

              <h4 className="font-semibold">2.3 Dados de Terceiros</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Pagamentos:</strong> Informações de transação via Stripe (não armazenamos dados de cartão)</li>
                <li><strong>Analytics:</strong> Dados de uso agregados e anônimos</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. Como Usamos seus Dados */}
          <Card id="finalidades">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                3. Como Usamos seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">3.1 Fornecimento do Serviço</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Criar e manter sua conta</li>
                <li>Sincronizar suas tarefas entre dispositivos</li>
                <li>Gerar relatórios de produtividade</li>
                <li>Fornecer suporte técnico</li>
              </ul>

              <h4 className="font-semibold">3.2 Melhoria do Serviço</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Análise de uso para melhorar funcionalidades</li>
                <li>Desenvolvimento de novos recursos</li>
                <li>Otimização de performance</li>
                <li>Correção de bugs e problemas</li>
              </ul>

              <h4 className="font-semibold">3.3 Comunicação</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Notificações sobre o serviço</li>
                <li>Atualizações importantes</li>
                <li>Resposta a solicitações de suporte</li>
                <li>Comunicações de marketing (com consentimento)</li>
              </ul>

              <h4 className="font-semibold">3.4 Cumprimento Legal</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Atendimento a requisições legais</li>
                <li>Proteção de direitos e segurança</li>
                <li>Prevenção de fraudes</li>
              </ul>
            </CardContent>
          </Card>

          {/* 4. Base Legal */}
          <Card id="base-legal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-orange-600" />
                4. Base Legal para Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Processamos seus dados pessoais com base nas seguintes bases legais da LGPD:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-medium">Execução de Contrato</h5>
                  <p className="text-sm text-muted-foreground">
                    Para fornecer os serviços contratados, como gestão de tarefas e sincronização.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-medium">Consentimento</h5>
                  <p className="text-sm text-muted-foreground">
                    Para comunicações de marketing e cookies não essenciais.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h5 className="font-medium">Legítimo Interesse</h5>
                  <p className="text-sm text-muted-foreground">
                    Para melhoria do serviço, segurança e prevenção de fraudes.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h5 className="font-medium">Cumprimento Legal</h5>
                  <p className="text-sm text-muted-foreground">
                    Para atender obrigações legais e regulamentares.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Compartilhamento de Dados */}
          <Card id="compartilhamento">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                5. Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Não vendemos seus dados pessoais.</strong> Compartilhamos informações apenas nas seguintes situações:
              </p>

              <h4 className="font-semibold">5.1 Prestadores de Serviço</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <h5 className="font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Stripe
                  </h5>
                  <p className="text-sm text-muted-foreground mt-2">
                    Processamento seguro de pagamentos para assinaturas
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                  <h5 className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Hospedagem
                  </h5>
                  <p className="text-sm text-muted-foreground mt-2">
                    Infraestrutura de nuvem para armazenamento e processamento
                  </p>
                </div>
              </div>

              <h4 className="font-semibold">5.2 Situações Legais</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Cumprimento de ordem judicial ou requisição legal</li>
                <li>Proteção de direitos, propriedade ou segurança</li>
                <li>Investigação de atividades fraudulentas</li>
                <li>Fusões, aquisições ou transferência de ativos</li>
              </ul>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Proteções:</strong> Todos os parceiros assinam acordos de proteção de dados e seguem padrões de segurança rigorosos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Segurança dos Dados */}
          <Card id="seguranca">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                6. Segurança dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
              </p>

              <h4 className="font-semibold">6.1 Medidas Técnicas</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Criptografia:</strong> HTTPS/TLS para transmissão de dados</li>
                <li><strong>Autenticação:</strong> Tokens JWT seguros</li>
                <li><strong>Armazenamento:</strong> Dados criptografados em repouso</li>
                <li><strong>Backup:</strong> Backups regulares e seguros</li>
                <li><strong>Monitoramento:</strong> Detecção de atividades suspeitas</li>
              </ul>

              <h4 className="font-semibold">6.2 Medidas Organizacionais</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Acesso Limitado:</strong> Princípio do menor privilégio</li>
                <li><strong>Treinamento:</strong> Equipe treinada em segurança</li>
                <li><strong>Auditoria:</strong> Revisões regulares de segurança</li>
                <li><strong>Política de Senhas:</strong> Requisitos robustos</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Nenhum sistema é 100% seguro. Notificaremos você sobre qualquer violação que possa afetar seus dados pessoais.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7. Seus Direitos */}
          <Card id="direitos">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                7. Seus Direitos (LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Como titular de dados pessoais, você tem os seguintes direitos garantidos pela LGPD:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium">Acesso</h5>
                    <p className="text-sm text-muted-foreground">
                      Confirmar se processamos seus dados e acessá-los
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium">Correção</h5>
                    <p className="text-sm text-muted-foreground">
                      Corrigir dados incompletos ou incorretos
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-medium">Exclusão</h5>
                    <p className="text-sm text-muted-foreground">
                      Solicitar a eliminação de dados desnecessários
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-medium">Portabilidade</h5>
                    <p className="text-sm text-muted-foreground">
                      Receber seus dados em formato estruturado
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-medium">Oposição</h5>
                    <p className="text-sm text-muted-foreground">
                      Opor-se ao tratamento de seus dados
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h5 className="font-medium">Limitação</h5>
                    <p className="text-sm text-muted-foreground">
                      Solicitar limitação do tratamento
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h5 className="font-medium">Informação</h5>
                    <p className="text-sm text-muted-foreground">
                      Conhecer entidades com quem compartilhamos dados
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h5 className="font-medium">Revogação</h5>
                    <p className="text-sm text-muted-foreground">
                      Revogar consentimento a qualquer momento
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Como exercer:</strong> Entre em contato através do email 
                  <Link href="mailto:privacidade@chronus.app" className="text-blue-600 hover:underline ml-1">
                    privacidade@chronus.app
                  </Link> ou pelo formulário no final desta página.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. Cookies e Tecnologias */}
          <Card id="cookies">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-orange-600" />
                8. Cookies e Tecnologias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência:
              </p>

              <h4 className="font-semibold">8.1 Tipos de Cookies</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-green-600">Cookies Essenciais</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Necessários para o funcionamento básico da plataforma (autenticação, sessão)
                  </p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-blue-600">Cookies de Preferência</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Armazenam suas configurações (tema, idioma)
                  </p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-purple-600">Cookies de Analytics</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Coletam informações sobre uso para melhorias (requer consentimento)
                  </p>
                </div>
              </div>

              <h4 className="font-semibold">8.2 Gerenciamento</h4>
              <p className="text-muted-foreground leading-relaxed">
                Você pode controlar cookies através das configurações do seu navegador. Note que desabilitar cookies essenciais pode afetar o funcionamento da plataforma.
              </p>
            </CardContent>
          </Card>

          {/* 9. Retenção de Dados */}
          <Card id="retencao">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-teal-600" />
                9. Retenção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Mantemos seus dados apenas pelo tempo necessário para as finalidades descritas:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Dados da Conta</h5>
                    <p className="text-sm text-muted-foreground">
                      Enquanto sua conta estiver ativa + 90 dias
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Tarefas e Conteúdo</h5>
                    <p className="text-sm text-muted-foreground">
                      Até exclusão da conta + período de backup
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Dados de Pagamento</h5>
                    <p className="text-sm text-muted-foreground">
                      Conforme requerido por lei (até 5 anos)
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Logs de Acesso</h5>
                    <p className="text-sm text-muted-foreground">
                      90 dias para segurança e diagnóstico
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Exclusão de Conta:</strong> Ao excluir sua conta, iniciamos o processo de remoção de dados. Alguns dados podem ser mantidos por obrigações legais.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 10. Contato */}
          <Card id="contato">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                10. Contato e Exercício de Direitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Encarregado de Dados (DPO)</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Email: <Link href="mailto:privacidade@chronus.app" className="text-primary hover:underline">privacidade@chronus.app</Link></p>
                    <p>Tempo de resposta: Até 15 dias úteis</p>
                    <p>Horário: Segunda a Sexta, 9h às 18h (BRT)</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Autoridade Nacional (ANPD)</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Caso não seja atendido adequadamente</p>
                    <p>Site: <Link href="https://www.gov.br/anpd" className="text-primary hover:underline" target="_blank">gov.br/anpd</Link></p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-2">Formulário de Solicitação</h5>
                <p className="text-sm text-green-700 mb-3">
                  Para exercer seus direitos, forneça as seguintes informações:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Nome completo e e-mail da conta</li>
                  <li>• Direito que deseja exercer</li>
                  <li>• Descrição detalhada da solicitação</li>
                  <li>• Documento de identificação (se necessário)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Footer da Política */}
        <div className="text-center space-y-4">
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Transparência e Proteção</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Estamos comprometidos em proteger sua privacidade e garantir total transparência sobre o uso de seus dados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/register">Criar Conta Segura</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/terms">Ver Termos de Serviço</Link>
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Última atualização: 02 de Janeiro de 2025 • Versão 1.0 • Chronus - Gestão de Tarefas • Conforme LGPD
          </p>
        </div>
      </div>
    </div>
  );
} 