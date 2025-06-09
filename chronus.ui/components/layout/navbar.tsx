"use client";
import { Clock, Github, Menu, User, LogOut, Settings, UserCircle, Loader2 } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { ToggleTheme } from "./toogle-theme";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";

interface RouteProps {
  href: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
  href?: string;
}

const routeList: RouteProps[] = [
  {
    href: "/#benefits",
    label: "Benefícios",
  },
  {
    href: "/#pricing",
    label: "Planos",
  },
  {
    href: "/#contact",
    label: "Contato",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

const featureList: FeatureProps[] = [
  {
    title: "Dashboard Inteligente",
    description: "Acesse seu painel principal para gerenciar todas as suas tarefas em um só lugar.",
    href: "/dashboard",
  },
  {
    title: "Gestão de Tarefas",
    description: "Crie, organize e acompanhe suas tarefas com facilidade e eficiência.",
  },
  {
    title: "Relatórios Avançados",
    description:
      "Analise sua produtividade com insights detalhados e estatísticas personalizadas.",
  },
  {
    title: "Multiplataforma",
    description:
      "Acesse suas tarefas em qualquer dispositivo, a qualquer hora e lugar.",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para navegar para seções da página inicial
  const handleSectionNavigation = (href: string) => {
    if (pathname === '/') {
      // Se já estamos na página inicial, apenas rola para a seção
      const element = document.querySelector(href.replace('/', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Se não estamos na página inicial, navega para lá com a âncora
      router.push(href);
    }
    setIsOpen(false);
  };

  // Função para navegar para o início da página principal
  const handleLogoClick = () => {
    if (pathname === '/') {
      // Se já estamos na página inicial, rola para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Se não estamos na página inicial, navega para lá
      router.push('/');
    }
  };

  // Função para obter as iniciais do usuário
  const getUserInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return 'U';
    }
    
    return name
      .trim()
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Componente de menu do usuário autenticado (Desktop)
  const AuthenticatedUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={""} alt={user?.name || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Componente de botões para usuário não autenticado (Desktop)
  const UnauthenticatedButtons = () => (
    <>
      <Button asChild size="sm" variant="ghost">
        <Link href="/login">
          Entrar
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/register">
          Cadastrar
        </Link>
      </Button>
    </>
  );

  // Componente de loading
  const LoadingState = () => (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  );

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <button 
        onClick={handleLogoClick}
        className="font-bold text-lg flex items-center hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Clock className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white p-2" />
        Chronus
      </button>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <button 
                    onClick={() => {
                      handleLogoClick();
                      setIsOpen(false);
                    }}
                    className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <Clock className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white p-2" />
                    Chronus
                  </button>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => handleSectionNavigation(href)}
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    {label}
                  </Button>
                ))}
                
                {/* Menu móvel baseado no status de autenticação */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : isAuthenticated && user ? (
                  // Usuário autenticado - Mobile
                  <>
                    <div className="px-2 py-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getUserInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      variant="ghost"
                      className="justify-start text-base"
                    >
                      <Link href="/dashboard">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      variant="ghost"
                      className="justify-start text-base"
                    >
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      variant="ghost"
                      className="justify-start text-base text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  // Usuário não autenticado - Mobile
                  <>
                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      variant="ghost"
                      className="justify-start text-base"
                    >
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      variant="default"
                      className="justify-start text-base mt-2"
                    >
                      <Link href="/register">Cadastrar</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-card text-base">
              Funcionalidades
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[600px] grid-cols-2 gap-5 p-4">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-md p-6 flex items-center justify-center">
                  <Clock className="h-20 w-20 text-primary" />
                </div>
                <ul className="flex flex-col gap-2">
                  {featureList.map(({ title, description, href }) => (
                    <li key={title}>
                      {href ? (
                        <Link href={href} className="block rounded-md p-3 text-sm hover:bg-muted transition-colors">
                          <p className="mb-1 font-semibold leading-none text-foreground">
                            {title}
                          </p>
                          <p className="line-clamp-2 text-muted-foreground">
                            {description}
                          </p>
                        </Link>
                      ) : (
                        <div className="rounded-md p-3 text-sm hover:bg-muted">
                          <p className="mb-1 font-semibold leading-none text-foreground">
                            {title}
                          </p>
                          <p className="line-clamp-2 text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <button 
                  onClick={() => handleSectionNavigation(href)}
                  className="text-base px-2 hover:text-primary transition-colors cursor-pointer"
                >
                  {label}
                </button>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex items-center gap-2">
        <ToggleTheme />
        
        {/* Estados baseados na autenticação */}
        {isLoading ? (
          <LoadingState />
        ) : isAuthenticated && user ? (
          <AuthenticatedUserMenu />
        ) : (
          <UnauthenticatedButtons />
        )}
      </div>
    </header>
  );
};
