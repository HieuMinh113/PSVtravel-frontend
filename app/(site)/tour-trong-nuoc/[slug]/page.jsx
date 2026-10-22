import { notFound } from "next/navigation";
import TourDetail from "@/components/pages/TourDetail";
import { tourMeta, tourJsonLd, tourProductJsonLd, tourVideoJsonLd, breadcrumbJsonLd, faqJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { tourFaqs } from "@/app/lib/tourFaqs";
import { tourLienQuan } from "@/app/lib/tourLienQuan";
import { getTours, getTourBySlug, getSettings, getVisaCountries, getCategories } from "@/app/lib/api";

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

  // Danh mục đầu tiên của tour = cấp "điểm đến" (breadcrumb, tour liên quan)
  const dm = tour.categories?.[0] ?? null;

  // Chỉ lấy đúng số tour cần cho khối "Tour liên quan" thay vì tải cả 50 tour
  // rồi vứt đi 47 cái. Lấy dư vài tour để sau khi loại chính nó ra vẫn đủ 3.
  const [cungDanhMuc, all, settings, visaList, danhMuc] = await Promise.all([
    dm ? getTours({ category: dm.slug, perPage: 8 }) : [],
    getTours({ type: "domestic", perPage: 8 }),
    getSettings(),
    // Thông tin visa thật từ admin, dùng cho khối Hướng dẫn visa
    getVisaCountries(),
    // Thanh lọc đi tắt dùng đúng Danh Mục Tour trong admin
    getCategories("domestic"),
  ]);
  const related = tourLienQuan(tour, dm, [...cungDanhMuc, ...all]);

  return (
    <>
      <JsonLd data={tourJsonLd(tour, BASE)} />
      <JsonLd data={tourProductJsonLd(tour, BASE)} />
      <JsonLd data={tourVideoJsonLd(tour, BASE)} />
      <JsonLd data={faqJsonLd(tourFaqs(tour))} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: SITE_URL },
          { name: "Tour trong nước", url: `${SITE_URL}${BASE}` },
          ...(dm ? [{ name: dm.name, url: `${SITE_URL}${BASE}?category=${encodeURIComponent(dm.slug)}` }] : []),
          { name: tour.name, url: `${SITE_URL}${BASE}/${tour.slug}` },
        ])}
      />
      <TourDetail basePath={BASE} tour={tour} related={related} danhMuc={danhMuc} visaList={visaList} settings={settings} />
    </>
  );
}