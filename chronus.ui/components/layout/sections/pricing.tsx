import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const plans: PlanProps[] = [
  {
    title: "Free",
    popular: 0,
    price: 0,
    description:
      "Perfeito para começar a organizar suas tarefas pessoais com recursos básicos.",
    buttonText: "Começar Grátis",
    benefitList: [
      "Gestão básica de tarefas",
      "Até 50 tarefas por mês",
      "Relatórios básicos",
      "Suporte por email",
      "Acesso via web",
    ],
  },
  {
    title: "Pro",
    popular: 1,
    price: 19,
    description:
      "Ideal para profissionais que precisam de recursos avançados de produtividade.",
    buttonText: "Assinar Pro",
    benefitList: [
      "Tarefas ilimitadas",
      "Organização por projetos",
      "Relatórios avançados com analytics",
      "Suporte prioritário",
      "Acesso multiplataforma",
      "Integração com calendário",
    ],
  },
  {
    title: "Premium",
    popular: 0,
    price: 39,
    description:
      "Solução completa para equipes e usuários que exigem o máximo de funcionalidades.",
    buttonText: "Assinar Premium",
    benefitList: [
      "Todos os recursos do Pro",
      "Suporte premium 24/7",
      "Relatórios personalizados",
      "API de integração",
      "Backup automático",
      "Consultoria personalizada",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Planos
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Escolha o plano ideal para você
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        Começe gratuitamente e evolua conforme suas necessidades crescem. Todos os planos incluem suporte e atualizações.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">R${price}</span>
                  <span className="text-muted-foreground"> /mês</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlan?.YES ? "default" : "secondary"
                  }
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
