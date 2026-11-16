import { notFound } from "next/navigation";
import DestinationDetail from "@/components/pages/DestinationDetail";
import { pageMeta, breadcrumbJsonLd, JsonLd, SITE_URL, moTaDu } from "@/app/lib/seo";
import { getDestinationBySlug, getDestinationSlugs, getTours } from "@/app/lib/api";
import { tourTheoDiemDen } from "@/app/lib/tourTheoDiemDen";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) return pageMeta({ title: "Không tìm thấy điểm đến", path: `/diem-den/${slug}` });
  return pageMeta({
    // "Bali | PSV Travel" quá ngắn, thiếu từ khoá người ta gõ ("du lịch Bali", "tour Bali")
    title: `Du lịch ${d.name} – tour ${d.name} trọn gói`,
    description: moTaDu(d.summary, d.description) || `Khám phá ${d.name} cùng PSV Travel — giới thiệu chi tiết và tour đang mở.`,
    path: `/diem-den/${d.slug}`,
    image: d.image,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) notFound();

  // Tour đúng điểm đến (tìm trong mọi tour đang bán) + tour khác cùng vùng (danh
  // mục admin gắn cho điểm đến). Hai danh sách 50 tour dùng chung bộ đệm với
  // trang danh sách tour nên không tốn thêm lượt gọi API.
  const [cungVung, trongNuoc, nuocNgoai] = await Promise.all([
    d.category_slug ? getTours({ category: d.category_slug }) : [],
    getTours({ type: "domestic" }),
    getTours({ type: "abroad" }),
  ]);
  const { dungDiem, cungKhuVuc } = tourTheoDiemDen(d, { tatCa: [...trongNuoc, ...nuocNgoai], cungVung });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: SITE_URL },
          { name: "Điểm đến", url: `${SITE_URL}/diem-den` },
          { name: d.name, url: `${SITE_URL}/diem-den/${slug}` },
        ])}
      />
      {/* Tour đang mở tại điểm đến — cho Google / AI biết trang này dẫn tới tour nào */}
      {dungDiem.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Tour ${d.name}`,
            itemListElement: dungDiem.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/${t.type === "abroad" ? "tour-nuoc-ngoai" : "tour-trong-nuoc"}/${t.slug}`,
              name: t.name,
            })),
          }}
        />
      )}
      <DestinationDetail destination={d} tours={dungDiem} toursKhac={cungKhuVuc} />
    </>
  );
}
