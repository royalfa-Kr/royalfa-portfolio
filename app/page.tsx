import Hero from "@/components/home/Hero";
import CurrentFocus from "@/components/home/CurrentFocus";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      
      {/* 1. SECCIÓN SUPERIOR: Hero + Panel de Novedades */}
      <section className="border-b border-base-border">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Columna Izquierda (Hero) - Ocupa 7 de 12 columnas */}
            <div className="lg:col-span-7">
              <Hero />
            </div>

            {/* Columna Derecha (Novedades) - Ocupa 5 de 12 columnas */}
            <div className="lg:col-span-5 w-full">
              <CurrentFocus />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Archivo Creativo (Tus tarjetas originales) */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-serif text-text-main mb-8">
          El Archivo <span className="text-accent-gold">Creativo</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ExploreCard title="Investigators" description="Custom character designs for Arkham Horror LCG." href="arkham/investigators" />
          <ExploreCard title="Books" description="Published anthologies and upcoming short stories." href="/books" />
          <ExploreCard title="Apps & Tools" description="Educational apps, interactive systems, and technical experiments." href="/apps" />
          <ExploreCard title="Worlds" description="Lore, maps, and artifacts from custom TTRPG settings." href="/worlds" />
        </div>
      </section>
    </main>
  );
}

function ExploreCard({ title, description, href }: { title: string, description: string, href: string }) {
  return (
    <Link href={href} className="group block p-6 bg-base-surface border border-base-border hover:border-accent-gold/50 transition-colors rounded-sm">
      <h3 className="text-xl text-text-main mb-2 group-hover:text-accent-gold transition-colors">{title}</h3>
      <p className="text-sm text-text-muted line-clamp-3">{description}</p>
    </Link>
  );
}