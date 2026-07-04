import Link from 'next/link';
import { Calendar, Video, MapPin } from 'lucide-react';
import { currentFocusData } from '@/data/now'; 
import { getAdminData } from '@/app/royAdmin/actions'; // <-- Importamos nuestra conexión a la base de datos

// Agregamos 'async' porque ahora se conecta a internet para traer tu clase
export default async function CurrentFocus() {
  
  // 1. Traemos tu próxima clase en tiempo real desde Upstash
  const upcomingClass = await getAdminData();

  // 2. Filtramos tus proyectos como siempre
  const visibleFocus = currentFocusData
    .filter(item => item.priority > 0)
    .sort((a, b) => b.priority - a.priority);

  return (
    <div className="bg-base-surface/40 border border-base-border p-6 md:p-8 rounded-sm h-full flex flex-col">
      
      {/* TARJETA DE PRÓXIMA CLASE (Viene directo de tu celular/base de datos) */}
      {upcomingClass.isActive && (
        <div className="mb-8 p-4 border border-accent-gold/30 bg-accent-gold/5 rounded-sm flex items-start gap-4">
          <div className="bg-base-dark p-2 border border-accent-gold/20 rounded-sm text-accent-gold shrink-0 mt-1">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-accent-gold text-[10px] font-bold uppercase tracking-widest">
                Próxima Sesión
              </h4>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-base-dark border border-accent-gold/20 text-accent-gold rounded-sm text-[10px] uppercase tracking-wider">
                {upcomingClass.modality?.toLowerCase() === 'en línea' ? <Video size={10} /> : <MapPin size={10} />}
                {upcomingClass.modality || 'Por definir'}
              </span>
            </div>
            
            <p className="text-text-main font-semibold text-sm leading-tight">
              {upcomingClass.subject}: {upcomingClass.topic}
            </p>
            <p className="text-text-muted text-xs mt-1">
              {upcomingClass.date} • {upcomingClass.time}
            </p>
          </div>
        </div>
      )}

      {/* TÍTULO Y SUBTÍTULO */}
      <div className="mb-6">
        <h2 className="text-xl font-serif text-text-main mb-2 flex items-center gap-2">
          <span className="text-accent-gold">■</span> En el radar
        </h2>
        <p className="text-sm text-text-muted font-serif italic">
          Lo que estoy construyendo, enseñando y moviendo ahora.
        </p>
      </div>
      
      {/* LISTA DE PROYECTOS */}
      <div className="flex flex-col gap-6 flex-grow">
        {visibleFocus.map((item) => (
          <div key={item.id} className="group border-l-2 border-base-border pl-4 hover:border-accent-gold transition-colors">
            <h3 className="text-sm uppercase tracking-wider text-text-main font-semibold mb-2 group-hover:text-accent-gold transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-3 line-clamp-3">
              {item.description}
            </p>
            
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