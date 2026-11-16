import { getTourSitemap, getGuideSitemap, getVisaSlugs, getEventSlugs, getDestinationSlugs, getJobSlugs, getSeasonPages, getAuthors, getMaldivesSitemap } from "@/app/lib/api";
import { SITE_URL } from "./lib/seo";

// Sitemap dựng lại mỗi giờ để tour và bài viết mới sớm được Google ghi nhận
export const revalidate = 3600;

export default async function sitemap() {
  // lastmod chỉ ghi khi biết ngày cập nhật THẬT. Google bỏ qua lastmod của cả
  // sitemap nếu thấy nó không đúng — trước đây trang tĩnh, điểm đến, visa… luôn
  // ghi "lúc dựng sitemap" nên mỗi giờ đều như vừa sửa. Không biết thì bỏ trống.
  const ngay = (v) => {
    if (!v) return undefined;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d;
  };
  // Trang danh sách: ngày của mục mới sửa gần nhất trong danh sách đó
  const moiNhat = (...ds) => {
    const t = ds.flat().filter(Boolean).map((d) => d.getTime());
    return t.length ? new Date(Math.max(...t)) : undefined;
  };

  const staticPaths = [
    "", "/tour-trong-nuoc", "/tour-nuoc-ngoai", "/maldives", "/ve-may-bay",
    "/lam-visa", "/team-building", "/cam-nang", "/khoanh-khac-du-khach", "/ve-chung-toi", "/lien-he",
    "/khuyen-mai", "/diem-den", "/cau-hoi-thuong-gap", "/tuyen-dung",
    // Các trang pháp lý bắt buộc — cần Google lập chỉ mục để chứng minh website
    // đã công khai đầy đủ theo quy định
    "/chinh-sach-bao-mat", "/dieu-khoan-su-dung", "/chinh-sach-thanh-toan", "/chinh-sach-huy-hoan",
  ];

  // Lấy dữ liệu THẬT từ backend. Trước đây phần này đọc mảng tour mẫu viết cứng
  // trong data/tours.js — sitemap khai báo với Google những trang không tồn tại,
  // còn tour đang bán thật thì không bao giờ được gửi lên.
  //
  // BỌC try/catch cho từng lời gọi: getTourSitemap ném lỗi khi API trục trặc (batBuoc).
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

  // Tour: lấy từ API riêng cho sitemap — danh sách tour thường chỉ trả tối đa 50
  // tour mỗi loại và bỏ tour tạm ẩn vì hết hạn visa, sitemap sẽ sót tour.
  const [tours, guides, visaSlugs, eventSlugs, destSlugs, jobSlugs, seasonPages, authors, maldives] = await Promise.all([
    anToan(() => getTourSitemap()),
    anToan(() => getGuideSitemap()),
    anToan(() => getVisaSlugs()),
    anToan(() => getEventSlugs()),
    anToan(() => getDestinationSlugs()),
    anToan(() => getJobSlugs()),
    anToan(() => getSeasonPages()),
    anToan(() => getAuthors()),
    anToan(() => getMaldivesSitemap()),
  ]);

  const ngayTour = (loai) => tours.filter((t) => (t.type === "abroad") === (loai === "abroad")).map((t) => ngay(t.updated_at));
  const ngayDanhSach = {
    "/tour-trong-nuoc": moiNhat(ngayTour("domestic")),
    "/tour-nuoc-ngoai": moiNhat(ngayTour("abroad")),
    "/cam-nang": moiNhat(guides.map((g) => ngay(g.updated_at))),
    "/maldives": moiNhat(maldives.map((c) => ngay(c.updated_at))),
  };
  ngayDanhSach[""] = moiNhat(Object.values(ngayDanhSach));

  const staticEntries = staticPaths.map((p) => ({
    url: SITE_URL + p,
    lastModified: ngayDanhSach[p],
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  const tourEntries = tours
    .map((t) => ({ base: t.type === "abroad" ? "/tour-nuoc-ngoai" : "/tour-trong-nuoc", slug: t.slug, updatedAt: t.updated_at }))
    .filter((x) => x.slug)
    .map(({ base, slug, updatedAt }) => ({
      url: `${SITE_URL}${base}/${slug}`,
      lastModified: ngay(updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // Bài cẩm nang trước đây bị bỏ sót hoàn toàn khỏi sitemap; sau đó chỉ có 30 bài
  // mới nhất (API danh sách chia trang) — giờ lấy đủ mọi bài từ API riêng
  const guideEntries = guides
    .filter((g) => g?.slug)
    .map((g) => ({
      url: `${SITE_URL}/cam-nang/${g.slug}`,
      lastModified: ngay(g.updated_at),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  // Trang chi tiết dịch vụ visa từng quốc gia
  const visaEntries = (visaSlugs || [])
    .filter(Boolean)
    .map((slug) => ({
      url: `${SITE_URL}/lam-visa/${slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  // Trang chi tiết gói sự kiện / team building
  const eventEntries = (eventSlugs || [])
    .filter(Boolean)
    .map((slug) => ({
      url: `${SITE_URL}/team-building/${slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  // Trang chi tiết điểm đến
  const destEntries = (destSlugs || [])
    .filter(Boolean)
    .map((slug) => ({
      url: `${SITE_URL}/diem-den/${slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  // Trang chi tiết tin tuyển dụng
  const jobEntries = (jobSlugs || [])
    .filter(Boolean)
    .map((slug) => ({
      url: `${SITE_URL}/tuyen-dung/${slug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  // Trang tour theo mùa / dịp (/tour-tet…): đổi theo lịch khởi hành nên quét thường xuyên
  const seasonEntries = seasonPages.map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    lastModified: ngay(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Trang tác giả cẩm nang (chỉ người đã có bài đăng)
  const authorEntries = authors.map((a) => ({
    url: `${SITE_URL}/tac-gia/${a.slug}`,
    lastModified: ngay(a.updated_at),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Combo Maldives
  const maldivesEntries = maldives.map((c) => ({
    url: `${SITE_URL}/maldives/${c.slug}`,
    lastModified: ngay(c.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...tourEntries, ...maldivesEntries, ...seasonEntries, ...guideEntries, ...authorEntries, ...visaEntries, ...eventEntries, ...destEntries, ...jobEntries];
}
