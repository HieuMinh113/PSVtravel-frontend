// Khách đến website từ đâu (TikTok, Google, ChatGPT…) — nhớ 30 ngày rồi gửi kèm
// đơn đặt tour, tin liên hệ, yêu cầu team building. Máy chủ tự phân loại kênh
// (App\Services\NguonKhach), ở đây chỉ gom dữ liệu thô: mã chiến dịch utm_*,
// tên miền trang giới thiệu, dấu quảng cáo gclid / fbclid / ttclid.
//
// Nhớ lượt vào GẦN NHẤT có nguồn: khách xem clip TikTok hôm nay, 3 hôm sau gõ
// thẳng địa chỉ vào đặt — đơn vẫn tính cho clip đó. Lượt vào thẳng không ghi đè.
// Không lưu gì về cá nhân khách.
const KHOA = "psv_nguon";
const HAN = 30 * 24 * 60 * 60 * 1000;
const UTM = ["source", "medium", "campaign", "content", "term"];

/** Nguồn của lượt vào này, null nếu vào thẳng / chuyển trang nội bộ. Hàm thuần để test. */
export function docNguon({ search = "", referrer = "", host = "", path = "/", now = Date.now() }) {
  const q = new URLSearchParams(search);
  const nguon = {};
  for (const k of UTM) {
    const v = q.get(`utm_${k}`);
    if (v) nguon[k] = v.slice(0, 150);
  }
  for (const k of ["gclid", "fbclid", "ttclid"]) if (q.get(k)) nguon[k] = 1;

  let tenMien = "";
  try {
    tenMien = referrer ? new URL(referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    tenMien = "";
  }
  const cungTrang = (a, b) => a && b && a.replace(/^www\./, "") === b.replace(/^www\./, "");
  if (tenMien && !cungTrang(tenMien, host)) nguon.referrer = tenMien;

  if (!Object.keys(nguon).length) return null;
  return { ...nguon, landing: path.slice(0, 150), at: now };
}

export function ghiNhanNguon() {
  try {
    const n = docNguon({
      search: window.location.search,
      referrer: document.referrer,
      host: window.location.hostname,
      path: window.location.pathname,
    });
    if (n) localStorage.setItem(KHOA, JSON.stringify(n));
  } catch {
    /* trình duyệt chặn lưu trữ — đơn sẽ ghi "không rõ" */
  }
}

/** Gửi kèm đơn / form. Không có nguồn còn hạn = vào thẳng. */
export function layNguon() {
  try {
    const n = JSON.parse(localStorage.getItem(KHOA) || "null");
    if (n && Date.now() - Number(n.at) < HAN) {
      const { at, ...conLai } = n; // bỏ mốc thời gian, máy chủ không cần
      return conLai;
    }
  } catch {
    /* bỏ qua */
  }
  return { landing: typeof window !== "undefined" ? window.location.pathname : "/" };
}
