import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "O Chronus é realmente gratuito?",
    answer: "Sim! O plano Free do Chronus é completamente gratuito e inclui recursos básicos de gerenciamento de tarefas para até 50 tarefas por mês.",
    value: "item-1",
  },
  {
    question: "Posso usar o Chronus no meu celular?",
    answer:
      "Absolutamente! O Chronus é totalmente responsivo e funciona perfeitamente em qualquer dispositivo - computador, tablet ou smartphone. Você pode acessar suas tarefas de qualquer lugar.",
    value: "item-2",
  },
  {
    question:
      "Como funciona a migração entre os planos?",
    answer:
      "Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e você só paga a diferença proporcional.",
    value: "item-3",
  },
  {
    question: "Meus dados estão seguros no Chronus?",
    answer: "Sim! Utilizamos criptografia de ponta e backup automático para garantir que suas informações estejam sempre seguras e acessíveis.",
    value: "item-4",
  },
  {
    question:
      "Existe limite de tarefas nos planos pagos?",
    answer: "Nos planos Pro e Premium você tem tarefas ilimitadas, além de recursos avançados como relatórios detalhados e organização por projetos.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          DÚVIDAS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Perguntas Frequentes
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
