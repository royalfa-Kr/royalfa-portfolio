import { Investigator } from "@/types";
import Link from "next/link";

export default function InvestigatorCard({ investigator }: { investigator: Investigator }) {
  return (
    <div className="flex flex-col bg-base-surface border border-base-border rounded-sm overflow-hidden hover:border-accent-gold/50 transition-colors h-full">
      {/* Espacio para la imagen (placeholder por ahora) */}
      <div className="h-48 bg-base-dark flex items-center justify-center border-b border-base-border">
        {investigator.imagePath ? (
           /* Aquí irá la imagen real después */
           <span className="text-text-muted text-sm">Image Loaded</span>
        ) : (
          <span className="font-serif text-accent-gold/30 text-2xl">{investigator.name}</span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif text-text-main">{investigator.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-sm border ${
            investigator.status === 'Published' ? 'border-green-900 text-green-500' :
            investigator.status === 'Playtesting' ? 'border-accent-gold/50 text-accent-gold' :
            'border-base-border text-text-muted'
          }`}>
            {investigator.status}
          </span>
        </div>
        
        <p className="text-sm font-semibold text-text-muted mb-4 tracking-wider uppercase">
          {investigator.classType} • {investigator.subtitle}
        </p>
        
        <p className="text-sm text-text-muted mb-6 flex-grow">
          {investigator.description}
        </p>

        {investigator.redditLink && (
          <Link 
            href={investigator.redditLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-auto text-sm text-accent-gold hover:text-accent-goldHover transition-colors border-b border-transparent hover:border-accent-goldHover pb-1 w-max"
          >
            View on Reddit →
          </Link>
        )}
      </div>
    </div>
  );
}