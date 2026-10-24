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

// ===== Tour / bài cẩm nang đổi đường dẫn =====
// Nhân viên đổi đường dẫn tour / bài đã đăng → backend tự ghi chuyển hướng.
// Chuyển ở proxy (trước bộ đệm trang): trang tour dựng sẵn (ISR) mà tự chuyển
// hướng thì Next lưu mã 308 nhưng MẤT địa chỉ đích — Google không theo được.
// Danh sách { cũ: mới } giữ trong bộ nhớ 60 giây; tải lỗi thì giữ bản cũ.

export const TIEN_TO_DOI_DUONG_DAN = ["/tour-nuoc-ngoai/", "/tour-trong-nuoc/", "/cam-nang/"];
const GIU_DANH_SACH_MS = 60_000;
let danhSachDoi = null;
let taiLuc = 0;
let dangTai = null;

async function taiDanhSachDoi() {
  try {
    const res = await fetch(`${API_URL}/link-cu/doi-duong-dan`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const ds = (await res.json())?.data;
      if (ds && typeof ds === "object") danhSachDoi = taoBang(ds);
    }
  } catch (e) {
    console.error("Không tải được danh sách đổi đường dẫn:", e?.cause?.code || e?.message);
  } finally {
    // Lần đầu tải lỗi: coi như chưa có ai đổi, khỏi bắt khách chờ lần nữa
    danhSachDoi ??= new Map();
    taiLuc = Date.now();
    dangTai = null;
  }
}

// Khoá so khớp: đường dẫn đã giải mã %xx, chữ thường, chuẩn Unicode NFC. Bài
// cũ từng có đường dẫn có dấu, có dấu cách ("/cam-nang/Tempura Nhật Bản: …") —
// trình duyệt gửi lên dạng %20%E1%BA…, còn bảng lưu nguyên chữ.
function khoa(duongDan) {
  let p = String(duongDan || "");
  try {
    p = decodeURIComponent(p);
  } catch {
    /* %xx hỏng: so nguyên chuỗi */
  }
  return p.normalize("NFC").toLowerCase().replace(/\/+$/, "");
}

const taoBang = (ds) => new Map(Object.entries(ds).map(([cu, moi]) => [khoa(cu), moi]));

/**
 * Đường dẫn mới của tour / bài vừa đổi đường dẫn, hoặc null. Lần đầu chờ tải
 * danh sách; sau đó dùng bản trong bộ nhớ, quá 60 giây thì tải lại ngầm.
 */
export async function traDoiDuongDan(duongDan) {
  const p = khoa(duongDan);
  if (!TIEN_TO_DOI_DUONG_DAN.some((t) => p.startsWith(t))) return null;
  if (Date.now() - taiLuc > GIU_DANH_SACH_MS) {
    dangTai ??= taiDanhSachDoi();
    if (!danhSachDoi) await dangTai;
  }
  const toi = danhSachDoi?.get(p);
  // Chỉ chuyển trong website, và không chuyển về chính nó
  return typeof toi === "string" && /^\/(?!\/)/.test(toi) && toi !== p ? toi : null;
}

// Cho npm test: nạp sẵn danh sách, khỏi gọi backend
export function _datDanhSachDoi(ds) {
  danhSachDoi = ds ? taoBang(ds) : null;
  taiLuc = ds ? Date.now() : 0;
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
