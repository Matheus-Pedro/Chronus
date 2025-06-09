import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Clock",
    title: "Economize Tempo",
    description:
      "Organize suas tarefas de forma inteligente e reduza o tempo gasto em planejamento. Foque no que realmente importa.",
  },
  {
    icon: "TrendingUp",
    title: "Aumente Produtividade",
    description:
      "Com relatórios detalhados e insights personalizados, identifique padrões e otimize sua rotina para máxima eficiência.",
  },
  {
    icon: "Shield",
    title: "Nunca Perca Prazos",
    description:
      "Sistema inteligente de lembretes e notificações garante que você nunca mais esqueça de uma tarefa importante.",
  },
  {
    icon: "Target",
    title: "Alcance Seus Objetivos",
    description:
      "Transforme grandes projetos em tarefas gerenciáveis e acompanhe seu progresso rumo ao sucesso.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Benefícios</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Seu caminho para o sucesso
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Descubra como o Chronus pode transformar sua rotina, aumentar sua produtividade 
            e te ajudar a alcançar seus objetivos de forma mais eficiente e organizada.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
