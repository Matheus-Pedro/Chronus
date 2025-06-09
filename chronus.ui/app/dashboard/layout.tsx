import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - Chronus",
  description: "Gerencie suas tarefas de forma inteligente e eficiente",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 