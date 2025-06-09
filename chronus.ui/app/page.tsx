import { BenefitsSection } from "@/components/layout/sections/benefits";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { PricingSection } from "@/components/layout/sections/pricing";
import { FAQSection } from "@/components/layout/sections/faq";

export const metadata = {
  title: "Chronus - Gerenciamento de Tarefas Inteligente",
  description: "Organize sua vida com Chronus. Sistema completo de gerenciamento de tarefas com planos flexíveis para todos os seus projetos pessoais e profissionais.",
  openGraph: {
    type: "website",
    url: "https://chronus.app",
    title: "Chronus - Gerenciamento de Tarefas Inteligente",
    description: "Organize sua vida com Chronus. Sistema completo de gerenciamento de tarefas com planos flexíveis para todos os seus projetos pessoais e profissionais.",
    images: [
      {
        url: "/og-chronus.jpg",
        width: 1200,
        height: 630,
        alt: "Chronus - Gerenciamento de Tarefas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://chronus.app",
    title: "Chronus - Gerenciamento de Tarefas Inteligente",
    description: "Organize sua vida com Chronus. Sistema completo de gerenciamento de tarefas com planos flexíveis para todos os seus projetos pessoais e profissionais.",
    images: [
      "/og-chronus.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
