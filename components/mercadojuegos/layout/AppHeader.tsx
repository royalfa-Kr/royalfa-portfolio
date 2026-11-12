import Link from "next/link";
import { mercadoJuegosSections } from "@/lib/mercadojuegos/constants";

export function AppHeader() {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5">
        <div className="flex flex-col gap-2">
          <Link
            href="/apps/mercadojuegos"
            className="text-2xl font-bold tracking-tight text-white"
          >
            MercadoJuegos
          </Link>
          <p className="max-w-2xl text-sm text-white/70">
            Compra, venta e intercambio de juegos de mesa. Sprint 0: estructura
            base, navegación y placeholders.
          </p>
        </div>

        <nav className="flex flex-wrap gap-2">
          {mercadoJuegosSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {section.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}