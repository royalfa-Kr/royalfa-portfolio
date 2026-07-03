"use client";
import Link from 'next/link';
import { currentFocusData } from '@/data/now';

export default function CurrentFocus() {
  // Aquí ocurre la magia: Filtramos los > 0 y ordenamos de mayor a menor
  const visibleFocus = currentFocusData
    .filter(item => item.priority > 0)
    .sort((a, b) => b.priority - a.priority);

  return (
    <div className="bg-base-surface/40 border border-base-border p-6 md:p-8 rounded-sm h-full">
      <h2 className="text-xl font-serif text-text-main mb-6 flex items-center gap-2">
        <span className="text-accent-gold">■</span> En el radar
      </h2>
      
      <div className="flex flex-col gap-6">
        {visibleFocus.map((item) => (
          <div key={item.id} className="group border-l-2 border-base-border pl-4 hover:border-accent-gold transition-colors">
            <h3 className="text-sm uppercase tracking-wider text-text-main font-semibold mb-2 group-hover:text-accent-gold transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-3 line-clamp-3">
              {item.description}
            </p>
            
            {/* Renderizado condicional del enlace que arreglamos antes */}
            {item.href ? (
              <Link href={item.href} className="inline-flex items-center text-xs font-semibold text-accent-gold group-hover:text-accent-goldHover transition-colors">
                {item.linkText} <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-text-muted italic">
                {item.linkText || "Próximamente..."}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}