import TourDetail from "@/components/pages/TourDetail";
import { abroadTours } from "@/data/tours";
import { tourMeta, tourJsonLd, JsonLd } from "@/app/lib/seo";

const BASE = "/tour-nuoc-ngoai";

export function generateStaticParams() {
  return abroadTours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tour = abroadTours.find((t) => t.slug === slug);
  return tourMeta(tour, BASE);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const tour = abroadTours.find((t) => t.slug === slug);
  return (
    <>
      {tour && <JsonLd data={tourJsonLd(tour, BASE)} />}
      <TourDetail basePath={BASE} slug={slug} />
    </>
  );
}
