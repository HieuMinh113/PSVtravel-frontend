import { notFound } from "next/navigation";
import TourDetail from "@/components/pages/TourDetail";
import { tourMeta, tourJsonLd, JsonLd } from "@/app/lib/seo";
import { getTours, getTourBySlug, getSettings, getVisaCountries } from "@/app/lib/api";

const BASE = "/tour-nuoc-ngoai";
export const revalidate = 60;

export async function generateStaticParams() {
  const tours = await getTours({ type: "abroad" });
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
  if (!tour || tour.type !== "abroad") notFound();

  // Chỉ lấy đúng số tour cần cho khối "Tour liên quan" thay vì tải cả 50 tour
  // rồi vứt đi 47 cái. Lấy dư vài tour để sau khi loại chính nó ra vẫn đủ 3.
  const [all, settings, visaList] = await Promise.all([
    getTours({ type: "abroad", perPage: 8 }),
    getSettings(),
    // Thông tin visa thật từ admin, dùng cho khối Hướng dẫn visa
    getVisaCountries(),
  ]);
  const related = all
    .filter((t) => t.slug !== tour.slug && t.region === tour.region)
    .slice(0, 3);

  // Danh mục cho thanh lọc đi tắt, lấy từ chính các tour vừa tải
  const regions = [...new Set(all.map((t) => t.country).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "vi")
  );

  return (
    <>
      <JsonLd data={tourJsonLd(tour, BASE)} />
      <TourDetail basePath={BASE} tour={tour} related={related} regions={regions} visaList={visaList} settings={settings} />
    </>
  );
}