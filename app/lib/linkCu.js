// Link của website WordPress cũ (psvtravel.com.vn chuyển sang psvtravel.com GIỮ
// NGUYÊN đường dẫn): Google, khách cầm link cũ vào /tour_nuoc_ngoai/…,
// /wp-content/uploads/…, /nhat-ban… rồi gặp 404. Tệp này chọn cách xử lý;
// trang đích do backend khớp (GET /link-cu, bảng "Chuyển hướng link cũ" trong
// admin). Dùng đường dẫn tương đối (không @/) để chạy được trong npm test.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Tiền tố trang tour / danh mục của web cũ — cần hỏi backend
const TIEN_TO_HOI = ["tour_nuoc_ngoai", "tour_trong_nuoc", "tour", "product", "san-pham", "product-category", "danh-muc-san-pham", "danh-muc", "category"];

// Tệp / trang hệ thống WordPress: trả 410 luôn, không hỏi backend (rất nhiều ảnh)
const TIEN_TO_DA_GO = ["wp-content", "wp-includes", "wp-admin", "wp-json"];

const SITEMAP_CU = /^\/(sitemap_index\.xml|sitemap\.xml\.gz|wp-sitemap\.xml|.+-sitemap\d*\.xml)$/;

/**
 * Xử lý link cũ không cần hỏi backend.
 * @returns {{ ma: 301, toi: string } | { ma: 410 } | { hoi: true } | null}
 *   null = không phải link cũ, để website xử lý như thường
 */
export function phanLoaiLinkCu(duongDan) {
  const p = String(duongDan || "").toLowerCase().replace(/\/+$/, "");
  if (SITEMAP_CU.test(p)) return { ma: 301, toi: "/sitemap.xml" };

  const doan = p.split("/").filter(Boolean);
  if (!doan.length) return null;
  if (TIEN_TO_DA_GO.includes(doan[0]) || ["wp-login.php", "xmlrpc.php", "feed"].includes(doan[0]) || doan.at(-1) === "feed") {
    return { ma: 410 };
  }
  if (doan.length >= 2 && TIEN_TO_HOI.includes(doan[0])) return { hoi: true };
  return null;
}

/**
 * Hỏi backend trang mới của một link cũ: { ma: 301, toi } | { ma: 410 } | { ma: 404 }.
 * Không lưu đệm: mỗi lượt được đếm trong admin, nhân viên sửa là có tác dụng ngay.
 * API lỗi / chậm thì null — website trả 404 như trước, không treo trang.
 */
export async function traLinkCu(duongDan) {
  try {
    const res = await fetch(`${API_URL}/link-cu?path=${encodeURIComponent(duongDan)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const kq = await res.json();
    // Chỉ chuyển trong website: đường dẫn bắt đầu bằng một dấu "/"
    if (kq?.ma === 301) return typeof kq.toi === "string" && /^\/(?!\/)/.test(kq.toi) ? kq : null;
    return kq?.ma === 410 || kq?.ma === 404 ? { ma: kq.ma } : null;
  } catch (e) {
    console.error(`Không tra được link cũ ${duongDan}:`, e?.cause?.code || e?.message);
    return null;
  }
}

// Trang báo "đã gỡ" (410) gọn nhẹ: Google bỏ link khỏi kết quả sớm hơn 404,
// khách vẫn có lối đi tiếp.
export const TRANG_DA_GO = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Trang đã gỡ | PSV Travel</title>
<style>body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:#f4f8fb;color:#1e2b37;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}
main{max-width:520px;background:#fff;border-radius:16px;padding:32px 24px;box-shadow:0 4px 24px rgba(1,60,101,.08);text-align:center}
img{height:56px}h1{font-size:22px;color:#013c65;margin:20px 0 8px}p{color:#4b5b6a;line-height:1.6;margin:0 0 20px}
nav{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}a{display:inline-block;padding:10px 16px;border-radius:999px;background:#0169a9;color:#fff;text-decoration:none;font-weight:600}
a.phu{background:#eaf4fb;color:#0169a9}</style></head>
<body><main><img src="/logo.png" alt="PSV Travel"><h1>Trang này thuộc website cũ và đã gỡ</h1>
<p>Tour hoặc bài viết này không còn. Mời bạn xem các tour đang mở bán, hoặc gọi hotline <b>0907 870 707</b> để được tư vấn.</p>
<nav><a href="/tour-nuoc-ngoai">Tour nước ngoài</a><a href="/tour-trong-nuoc">Tour trong nước</a><a class="phu" href="/">Trang chủ</a></nav></main></body></html>`;
