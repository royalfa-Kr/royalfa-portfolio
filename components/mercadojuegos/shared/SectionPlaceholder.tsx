type SectionPlaceholderProps = {
  title: string;
  description: string;
  status?: string;
};

export function SectionPlaceholder({
  title,
  description,
  status = "Pendiente de implementación",
}: SectionPlaceholderProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
          {status}
        </span>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-white/70">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}