import { notFound, permanentRedirect } from "next/navigation";
import TrangMuaDip from "@/components/pages/TrangMuaDip";
import { pageMeta, faqJsonLd, JsonLd, SITE_URL, formatVND } from "@/app/lib/seo";
import { getSeasonPage } from "@/app/lib/api";
import { traLinkCu } from "@/app/lib/linkCu";

// Trang tour theo mùa / dịp ngay gốc website: /tour-tet, /tour-he, /tour-30-4…
// Nhân viên tạo trong admin (Nội dung → Trang theo mùa/dịp); tour có ngày khởi
// hành trong khoảng ngày của trang tự hiện. Đường dẫn bắt buộc "tour-…" (admin
// chặn).
//
// Địa chỉ một cấp khác lọt vào đây (không trùng trang nào) là link của website
// cũ: /nhat-ban, /cua-hang, bài viết cũ… → hỏi backend trang mới để chuyển
// hướng; không có thì 404. Link cũ nhiều cấp (/tour_nuoc_ngoai/…) xử lý ở proxy.js.
//
// Dựng mỗi lượt (revalidate = 0) chứ không lưu sẵn cả trang: tra link cũ không
// được lưu đệm (đếm lượt, nhân viên sửa có tác dụng ngay) — Next không cho trộn
// với trang lưu sẵn. Dữ liệu trang theo mùa vẫn lưu đệm 60 giây trong api.js nên
// dựng lại rất nhẹ; bot gõ bừa hàng nghìn địa chỉ cũng không đẻ ra tệp lưu sẵn.
export const revalidate = 0;

const laTrangMua = (s) => typeof s === "string" && s.startsWith("tour-");

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
  const p = laTrangMua(trang) ? await getSeasonPage(trang) : null;
  if (!p) {
    const cu = await traLinkCu(`/${trang}`);
    // Gọi trước mọi phần dựng trang nên ra mã 308 thật (Google coi như 301)
    if (cu?.ma === 301) permanentRedirect(cu.toi);
    notFound();
  }

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
