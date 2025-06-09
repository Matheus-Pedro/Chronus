import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex font-bold items-center">
              <Clock className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary p-2" />

              <h3 className="text-2xl">Chronus</h3>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs">
              Organize sua vida de forma inteligente com o melhor sistema de gerenciamento de tarefas.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Produto</h3>
            <div>
              <Link href="#features" className="opacity-60 hover:opacity-100">
                Funcionalidades
              </Link>
            </div>

            <div>
              <Link href="#pricing" className="opacity-60 hover:opacity-100">
                Planos
              </Link>
            </div>

            <div>
              <Link href="#benefits" className="opacity-60 hover:opacity-100">
                Benefícios
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Plataformas</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Web App
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Mobile (em breve)
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                API
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Suporte</h3>
            <div>
              <Link href="#contact" className="opacity-60 hover:opacity-100">
                Contato
              </Link>
            </div>

            <div>
              <Link href="#faq" className="opacity-60 hover:opacity-100">
                FAQ
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Documentação
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Legal</h3>
            <div>
              <Link href="/privacy" className="opacity-60 hover:opacity-100">
                Privacidade
              </Link>
            </div>

            <div>
              <Link href="/terms" className="opacity-60 hover:opacity-100">
                Termos de Uso
              </Link>
            </div>

            <div>
              <Link href="/cookies" className="opacity-60 hover:opacity-100">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; 2024 Chronus - Sistema de Gerenciamento de Tarefas
            <span className="text-muted-foreground ml-1">
              - Desenvolvido com ❤️ para organizar sua vida
            </span>
          </h3>
        </section>
      </div>
    </footer>
  );
};
