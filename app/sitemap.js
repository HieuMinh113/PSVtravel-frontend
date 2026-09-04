import { getTours, getGuides, getVisaSlugs } from "@/app/lib/api";
import { SITE_URL } from "./lib/seo";

// Sitemap dựng lại mỗi giờ để tour và bài viết mới sớm được Google ghi nhận
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  const staticPaths = [
    "", "/tour-trong-nuoc", "/tour-nuoc-ngoai", "/ve-may-bay",
    "/lam-visa", "/cam-nang", "/khoanh-khac-du-khach", "/ve-chung-toi", "/lien-he",
    // Các trang pháp lý bắt buộc — cần Google lập chỉ mục để chứng minh website
    // đã công khai đầy đủ theo quy định
    "/chinh-sach-bao-mat", "/dieu-khoan-su-dung", "/chinh-sach-thanh-toan", "/chinh-sach-huy-hoan",
  ];

  const staticEntries = staticPaths.map((p) => ({
    url: SITE_URL + p,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  // Lấy dữ liệu THẬT từ backend. Trước đây phần này đọc mảng tour mẫu viết cứng
  // trong data/tours.js — sitemap khai báo với Google những trang không tồn tại,
  // còn tour đang bán thật thì không bao giờ được gửi lên.
  //
  // BỌC try/catch cho từng lời gọi: getTours ném lỗi khi API trục trặc (batBuoc).
  // Không bọc thì chỉ một nhịp API chập chờn là CẢ sitemap văng lỗi 500, và
  // Google báo "Không thể tìm nạp" — mất luôn cả các trang tĩnh vốn không cần API.
  // Sitemap phải LUÔN trả về được: thà thiếu vài tour còn hơn không có sitemap.
  const anToan = async (goi) => {
    try {
      return await goi();
    } catch (e) {
      console.error("sitemap: bỏ qua một nguồn do lỗi API —", e?.message || e);
      return [];
    }
  };

  const [domestic, abroad, guides, visaSlugs] = await Promise.all([
    anToan(() => getTours({ type: "domestic" })),
    anToan(() => getTours({ type: "abroad" })),
    anToan(() => getGuides()),
    anToan(() => getVisaSlugs()),
  ]);

  const tourEntries = [
    ...domestic.map((t) => ({ base: "/tour-trong-nuoc", slug: t.slug })),
    ...abroad.map((t) => ({ base: "/tour-nuoc-ngoai", slug: t.slug })),
  ]
    .filter((x) => x.slug)
    .map(({ base, slug }) => ({
      url: `${SITE_URL}${base}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // Bài cẩm nang trước đây bị bỏ sót hoàn toàn khỏi sitemap
  const guideEntries = guides
    .filter((g) => g?.slug)
    .map((g) => ({
      url: `${SITE_URL}/cam-nang/${g.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  // Trang chi tiết dịch vụ visa từng quốc gia
  const visaEntries = (visaSlugs || [])
    .filter(Boolean)
    .map((slug) => ({
      url: `${SITE_URL}/lam-visa/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticEntries, ...tourEntries, ...guideEntries, ...visaEntries];
}
