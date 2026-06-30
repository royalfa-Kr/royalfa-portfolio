import { appsData } from "@/data/apps";

export default function AppsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
          Curious <span className="text-accent-gold">Tools & Applications.</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed">
          Aplicaciones interactivas, herramientas de apoyo educativo y prototipos técnicos desarrollados para resolver problemas específicos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appsData.map((app) => (
          <div key={app.id} className="bg-base-surface border border-base-border p-6 rounded-sm flex flex-col justify-between hover:border-accent-gold/30 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-serif text-text-main">{app.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-sm border ${
                  app.status === 'Published' ? 'border-green-900 text-green-500 bg-green-950/10' :
                  app.status === 'Prototype' ? 'border-blue-900 text-blue-400 bg-blue-950/10' :
                  'border-base-border text-text-muted'
                }`}>
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                {app.description}
              </p>
            </div>

            {/* Tags de tecnología */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-base-border/50">
              {app.tags.map((tag) => (
                <span key={tag} className="text-xs bg-base-dark text-text-muted px-2 py-1 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}