import { notFound } from "next/navigation";
import MaldivesDetail from "@/components/pages/MaldivesDetail";
import { pageMeta, JsonLd, SITE_URL, ORG_ID, breadcrumbJsonLd, moTaDu } from "@/app/lib/seo";
import { getMaldivesCombo, getMaldivesSitemap, getSettings } from "@/app/lib/api";
import { saoChu, tyGia, usd } from "@/app/lib/maldives";

export const revalidate = 60;

export async function generateStaticParams() {
  const ds = await getMaldivesSitemap();
  return ds.map((c) => ({ slug: c.slug }));
}

// Mô tả Google: tóm tắt nhân viên viết; thiếu thì ghép từ dữ liệu thật của combo
function moTa(c) {
  const tuDong = [
    c.resort?.name && `Combo ${c.resort.name}${c.resort.stars ? ` ${saoChu(c.resort.stars)} sao` : ""} Maldives`,
    c.days && `${c.days} ngày ${c.nights ?? ""} đêm`.trim(),
    c.airline && `bay ${c.airline}`,
    c.transfer,
    c.giaTu && `giá từ ${usd(c.giaTu)}/khách`,
  ].filter(Boolean).join(", ");
  return moTaDu(c.summary || (tuDong ? `${tuDong}.` : ""), c.resort?.intro || "");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getMaldivesCombo(slug);
  if (!c) return pageMeta({ title: "Không tìm thấy combo", path: `/maldives/${slug}` });
  return pageMeta({ title: c.seoTitle || c.name, description: moTa(c), path: `/maldives/${c.slug}`, image: c.image || c.resort?.image || undefined });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const [combo, settings] = await Promise.all([getMaldivesCombo(slug), getSettings()]);
  if (!combo) notFound();
  const url = `${SITE_URL}/maldives/${combo.slug}`;

  const gia = combo.dates.filter((d) => d.status === "open").flatMap((d) => Object.values(d.prices).map(Number)).filter((g) => g > 0);
  const chuyenDi = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: combo.name,
    description: moTa(combo),
    url,
    image: [combo.image, combo.resort?.image, ...(combo.resort?.gallery ?? [])].filter(Boolean).slice(0, 5),
    provider: { "@id": ORG_ID },
    ...(combo.itinerary.length
      ? { itinerary: { "@type": "ItemList", itemListElement: combo.itinerary.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `Ngày ${d.day}: ${d.title}` })) } }
      : {}),
    ...(gia.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: Math.min(...gia),
            highPrice: Math.max(...gia),
            offerCount: gia.length,
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={chuyenDi} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: SITE_URL },
          { name: "Maldives", url: `${SITE_URL}/maldives` },
          { name: combo.name, url },
        ])}
      />
      <MaldivesDetail combo={combo} hotline={settings?.hotline || "0907 870 707"} tg={tyGia(settings)} />
    </>
  );
}
