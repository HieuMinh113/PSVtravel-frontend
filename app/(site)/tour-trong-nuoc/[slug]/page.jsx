import TourDetail from "@/components/pages/TourDetail";
import { domesticTours } from "@/data/tours";
import { tourMeta, tourJsonLd, JsonLd } from "@/app/lib/seo";

const BASE = "/tour-trong-nuoc";

export function generateStaticParams() {
  return domesticTours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tour = domesticTours.find((t) => t.slug === slug);
  return tourMeta(tour, BASE);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const tour = domesticTours.find((t) => t.slug === slug);
  return (
    <>
      {tour && <JsonLd data={tourJsonLd(tour, BASE)} />}
      <TourDetail basePath={BASE} slug={slug} />
    </>
  );
}
