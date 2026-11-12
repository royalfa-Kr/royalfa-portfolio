import Link from "next/link";
import { mercadoJuegosSections } from "@/lib/mercadojuegos/constants";

export default function MercadoJuegosHomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-neutral-900 p-8">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Sprint 0 activo
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              MercadoJuegos
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-white/75 md:text-base">
              Base inicial de la app para compra, venta e intercambio de juegos
              de mesa. Esta versión contiene la estructura de rutas, layout y
              placeholders del proyecto.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {mercadoJuegosSections
          .filter((section) => section.href !== "/apps/mercadojuegos")
          .map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">
                  {section.label}
                </h2>
                <p className="text-sm text-white/70">{section.description}</p>
              </div>
            </Link>
          ))}
      </section>
    </div>
  );
}