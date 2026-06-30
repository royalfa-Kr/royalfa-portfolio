import { investigatorsData } from "@/data/investigators";
import InvestigatorCard from "@/components/domain/InvestigatorCard";

export default function InvestigatorsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
          Custom <span className="text-accent-gold">Investigators.</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed">
          Mechanical concepts, lore, and playtesting notes for custom characters designed for Arkham Horror LCG. 
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {investigatorsData.map((investigator) => (
          <InvestigatorCard key={investigator.id} investigator={investigator} />
        ))}
      </div>
    </div>
  );
}