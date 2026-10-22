import { notFound } from "next/navigation";
import TrangMuaDip from "@/components/pages/TrangMuaDip";
import { pageMeta, faqJsonLd, JsonLd, SITE_URL, formatVND } from "@/app/lib/seo";
import { getSeasonPage, getSeasonPages } from "@/app/lib/api";

// Trang tour theo mùa / dịp ngay gốc website: /tour-tet, /tour-he, /tour-30-4…
// Nhân viên tạo trong admin (Nội dung → Trang theo mùa/dịp); tour có ngày khởi
// hành trong khoảng ngày của trang tự hiện. Đường dẫn bắt buộc "tour-…" (admin
// chặn) nên mọi địa chỉ khác lọt vào đây đều trả 404 ngay, không gọi API.
export const revalidate = 60;

const laTrangMua = (s) => typeof s === "string" && s.startsWith("tour-");

export async function generateStaticParams() {
  const ds = await getSeasonPages();
  return ds.map((p) => ({ trang: p.slug }));
}

const ngay = (iso, coNam = true) => {
  const [y, m, d] = String(iso || "").slice(0, 10).split("-");
  return coNam ? `${d}/${m}/${y}` : `${d}/${m}`;
};

function moTa(p) {
  if (p.seo_description) return p.seo_description;
  const khoang = `từ ${ngay(p.start_from, false)} đến ${ngay(p.start_to)}`;
  const gia = p.tours.map((t) => Number(t.price)).filter((n) => n > 0);
  return p.tours.length
    ? `${p.name}: ${p.tours.length} tour khởi hành ${khoang}${gia.length ? `, giá từ ${formatVND(Math.min(...gia))}/khách` : ""}. Đặt sớm giữ chỗ cùng PSV Travel.`
    : `${p.name} cùng PSV Travel — lịch khởi hành ${khoang}. Gọi hotline để được tư vấn và giữ chỗ sớm.`;
}

export async function generateMetadata({ params }) {
  const { trang } = await params;
  const p = laTrangMua(trang) ? await getSeasonPage(trang) : null;
  if (!p) return pageMeta({ title: "Không tìm thấy trang", path: `/${trang}` });
  return pageMeta({ title: p.seo_title || p.name, description: moTa(p), path: `/${p.slug}`, image: p.cover_image || undefined });
}

export default async function Page({ params }) {
  const { trang } = await params;
  if (!laTrangMua(trang)) notFound();
  const p = await getSeasonPage(trang);
  if (!p) notFound();

  // Danh sách tour của trang cho Google / AI (breadcrumb do PageHero tự gửi)
  const dsTour = p.tours.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: p.name,
        itemListElement: p.tours.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/${t.type === "abroad" ? "tour-nuoc-ngoai" : "tour-trong-nuoc"}/${t.slug}`,
          name: t.name,
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={dsTour} />
      <JsonLd data={faqJsonLd(p.faqs)} />
      <TrangMuaDip trang={p} khoangNgay={`${ngay(p.start_from)} – ${ngay(p.start_to)}`} />
    </>
  );
}
