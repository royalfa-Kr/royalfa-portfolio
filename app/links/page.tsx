import Link from "next/link";

export default function LinksPage() {
  const customLinks = [
    { 
      name: "Support my work on Ko-fi", 
      url: "https://ko-fi.com/TU_USUARIO_AQUI", 
      description: "Ayúdame a mantener las apps y crear más contenido."
    },
    { 
      name: "Kindle Author Page", 
      url: "https://amazon.com/author/TU_ENLACE", 
      description: "Mis antologías y relatos cortos publicados."
    },
    { 
      name: "Arkham Horror on Reddit", 
      url: "https://reddit.com/user/TU_USUARIO", 
      description: "Mis diseños e investigadores personalizados."
    },
    { 
      name: "GitHub Profile", 
      url: "https://github.com/TU_USUARIO", 
      description: "El código detrás de mis herramientas educativas."
    },
    { 
      name: "World Anvil", 
      url: "https://worldanvil.com/w/TU_MUNDO", 
      description: "El archivo de mi mundo fantástico (Migration in progress)."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center">
      {/* Avatar / Header */}
      <div className="w-24 h-24 bg-base-surface border border-accent-gold rounded-full mb-6 flex items-center justify-center text-3xl">
        {/* Aquí luego puedes poner un <img /> con tu logo o foto */}
        <span className="font-serif text-accent-gold">R</span>
      </div>
      
      <h1 className="text-3xl font-serif text-text-main mb-2">Royalfa</h1>
      <p className="text-sm text-text-muted mb-10 text-center">
        Stories, worlds, custom creations, and curious tools.
      </p>

      {/* Links de botones grandes */}
      <div className="w-full flex flex-col space-y-4">
        {customLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full bg-base-surface border border-base-border p-4 text-center rounded-sm hover:border-accent-gold hover:bg-accent-gold/5 transition-all duration-300 flex flex-col items-center justify-center"
          >
            <span className="font-serif text-lg text-text-main group-hover:text-accent-gold transition-colors">
              {link.name}
            </span>
            <span className="text-xs text-text-muted mt-1">
              {link.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}