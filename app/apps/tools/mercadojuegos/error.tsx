"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MercadoJuegosError({
  error,
  reset,
}: ErrorPageProps) {
  return (
    <div className="space-y-4 rounded-xl border border-red-400/20 bg-red-400/10 p-6">
      <h1 className="text-2xl font-semibold text-white">
        Ocurrió un error en MercadoJuegos
      </h1>
      <p className="text-sm text-white/75">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
      >
        Reintentar
      </button>
    </div>
  );
}