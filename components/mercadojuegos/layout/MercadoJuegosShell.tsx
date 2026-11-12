import type { ReactNode } from "react";
import { AppHeader } from "@/components/mercadojuegos/layout/AppHeader";

type MercadoJuegosShellProps = {
  children: ReactNode;
};

export function MercadoJuegosShell({ children }: MercadoJuegosShellProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}