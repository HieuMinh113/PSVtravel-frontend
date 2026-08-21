import { notFound } from "next/navigation";
import TourDetail from "@/components/pages/TourDetail";
import { tourMeta, tourJsonLd, JsonLd } from "@/app/lib/seo";
import { getTours, getTourBySlug, getSettings } from "@/app/lib/api";

const BASE = "/tour-trong-nuoc";
export const revalidate = 60;

export async function generateStaticParams() {
  const tours = await getTours({ type: "domestic" });
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  return tourMeta(tour, BASE);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour || tour.type !== "domestic") notFound();

  // Chỉ lấy đúng số tour cần cho khối "Tour liên quan" thay vì tải cả 50 tour
  // rồi vứt đi 47 cái. Lấy dư vài tour để sau khi loại chính nó ra vẫn đủ 3.
  const [all, settings] = await Promise.all([
    getTours({ type: "domestic", perPage: 8 }),
    getSettings(),
  ]);
  const related = all
    .filter((t) => t.slug !== tour.slug && t.region === tour.region)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={tourJsonLd(tour, BASE)} />
      <TourDetail basePath={BASE} tour={tour} related={related} settings={settings} />
    </>
  );
}