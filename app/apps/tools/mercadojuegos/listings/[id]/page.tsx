import { SectionPlaceholder } from "@/components/mercadojuegos/shared/SectionPlaceholder";

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MercadoJuegosListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;

  return (
    <SectionPlaceholder
      title={`Detalle de publicación: ${id}`}
      description="Aquí se mostrará la información completa de una publicación específica."
    />
  );
}