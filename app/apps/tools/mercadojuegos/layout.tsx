import type { ReactNode } from "react";
import { MercadoJuegosShell } from "@/components/mercadojuegos/layout/MercadoJuegosShell";

type MercadoJuegosLayoutProps = {
  children: ReactNode;
};

export default function MercadoJuegosLayout({
  children,
}: MercadoJuegosLayoutProps) {
  return <MercadoJuegosShell>{children}</MercadoJuegosShell>;
}