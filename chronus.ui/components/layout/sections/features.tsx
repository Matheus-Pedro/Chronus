import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Check",
    title: "Gestão de Tarefas",
    description:
      "Crie, edite e organize suas tarefas com facilidade. Defina prazos, prioridades e acompanhe o progresso em tempo real.",
  },
  {
    icon: "Calendar",
    title: "Planejamento Temporal",
    description:
      "Organize suas atividades com datas de vencimento inteligentes e visualize sua agenda de forma clara e eficiente.",
  },
  {
    icon: "Target",
    title: "Acompanhamento de Metas",
    description:
      "Defina objetivos e monitore seu progresso com relatórios detalhados e estatísticas personalizadas.",
  },
  {
    icon: "Layers",
    title: "Organização por Projetos",
    description:
      "Agrupe suas tarefas em projetos específicos para melhor organização e controle de suas atividades.",
  },
  {
    icon: "BarChart3",
    title: "Relatórios Avançados",
    description:
      "Analise sua produtividade com relatórios detalhados e insights sobre seu desempenho e padrões de trabalho.",
  },
  {
    icon: "Smartphone",
    title: "Acesso Multiplataforma",
    description:
      "Acesse suas tarefas em qualquer lugar, a qualquer hora. Interface responsiva que funciona perfeitamente em todos os dispositivos.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Funcionalidades
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Por que escolher o Chronus?
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Desenvolvido especificamente para maximizar sua produtividade e organização pessoal, 
        com recursos inteligentes que se adaptam ao seu fluxo de trabalho.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
