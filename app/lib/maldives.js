// Combo Maldives: định dạng giá USD và tính giá tạm — y hệt backend
// (Modules/Maldives/app/Services/BaoGiaMaldives.php) để khách thấy đúng số
// nhân viên nhận trên đơn. Dùng đường dẫn tương đối để chạy được trong npm test.

// $2.631 — dấu chấm ngăn nghìn như cách viết giá ở Việt Nam
export function usd(n) {
  const so = Math.round(Number(n) || 0);
  return `$${so.toLocaleString("vi-VN")}`;
}

// 69200000 → "69,2 triệu"
export function trieuDong(n) {
  const so = Number(n) || 0;
  if (so <= 0) return "";
  const tr = so / 1_000_000;
  return `${tr.toLocaleString("vi-VN", { maximumFractionDigits: tr >= 100 ? 0 : 1 })} triệu`;
}

// Tỷ giá trong Cấu hình chung ("26.300", "26300") → 26300; chưa nhập → null
export function tyGia(settings) {
  const so = parseInt(String(settings?.maldives_ty_gia ?? "").replace(/\D/g, ""), 10);
  return so > 0 ? so : null;
}

// "≈ 69,2 triệu đồng" cho một số tiền USD (chưa có tỷ giá thì rỗng)
export function quyDoi(soUsd, tg) {
  return soUsd > 0 && tg ? `≈ ${trieuDong(soUsd * tg)} đồng` : "";
}

/**
 * Giá tạm tính. ngay: { prices: {room_type_id: usd} }; noiDi: { city, surchargeUsd }.
 * Phụ thu tính cho mỗi khách (người lớn + trẻ em). Phần chưa có số thì không
 * cộng, ghi vào chuaGom.
 */
export function baoGia({ childPercent, ngay, phongId, noiDi, nguoiLon = 1, treEm = 0, emBe = 0, tg = null }) {
  const chuaGom = [];
  const g = ngay && phongId != null ? Number(ngay.prices?.[phongId]) : NaN;
  const donGia = g > 0 ? Math.round(g) : null;

  const giaTreEm = donGia !== null && childPercent ? Math.round((donGia * childPercent) / 100) : null;
  if (treEm > 0 && giaTreEm === null && donGia !== null) chuaGom.push("giá trẻ em");

  let phuThu = 0;
  if (noiDi) {
    phuThu = Number.isFinite(noiDi.surchargeUsd) ? noiDi.surchargeUsd : null;
    if (phuThu === null) chuaGom.push(`phụ thu khởi hành từ ${noiDi.city}`);
  }
  if (emBe > 0) chuaGom.push("em bé dưới 2 tuổi");

  const tong = donGia === null ? null : nguoiLon * donGia + (giaTreEm !== null ? treEm * giaTreEm : 0) + (phuThu ?? 0) * (nguoiLon + treEm);

  return { donGia, giaTreEm, phuThu, tong, tongVnd: tong !== null && tg ? tong * tg : null, chuaGom };
}

// "2026-11-04" → "04/11/2026"
export const ngayVN = (iso) => (iso ? String(iso).slice(0, 10).split("-").reverse().join("/") : "");
