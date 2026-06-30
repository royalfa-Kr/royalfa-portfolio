import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      {/* Hero Section */}
      <section className="max-w-3xl mb-24">
        <h1 className="text-5xl md:text-7xl font-serif text-text-main mb-6 leading-tight">
          Welcome to the <br />
          <span className="text-accent-gold">Digital Archive.</span>
        </h1>
        <p className="text-xl md:text-2xl text-text-muted font-light mb-8">
          Stories, worlds, custom creations, and curious tools.
        </p>
        <p className="text-base text-text-muted leading-relaxed max-w-2xl">
          A creative archive of stories, custom investigators, fantastic worlds, and interactive tools. 
          From tailored educational applications and digital utilities to dark fantasy 
          campaigns, custom tabletop investigators, and published anthologies.
          Royalfa gathers the projects I build, write, and explore.
        </p>
      </section>

      {/* Quick Explore Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ExploreCard 
          title="Investigators" 
          description="Custom character designs for Arkham Horror LCG."
          href="/investigators"
        />
        <ExploreCard 
          title="Books" 
          description="Published anthologies and upcoming short stories."
          href="/books"
        />
        <ExploreCard 
          title="Apps & Curious Tools" 
          description="Educational apps, interactive systems, and technical experiments."
          href="/apps"
        />
        <ExploreCard 
          title="Worlds" 
          description="Lore, maps, and artifacts from custom TTRPG settings."
          href="/worlds"
        />
      </section>
    </div>
  );
}

// Sub-componente local solo para la Home (luego extraeremos Cards más complejas)
function ExploreCard({ title, description, href }: { title: string, description: string, href: string }) {
  return (
    <Link 
      href={href}
      className="group block p-6 bg-base-surface border border-base-border hover:border-accent-gold/50 transition-colors rounded-sm"
    >
      <h3 className="text-xl text-text-main mb-2 group-hover:text-accent-gold transition-colors">
        {title}
      </h3>
      <p className="text-sm text-text-muted line-clamp-3">
        {description}
      </p>
    </Link>
  );
}