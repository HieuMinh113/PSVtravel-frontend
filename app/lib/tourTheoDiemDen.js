// Gom tour cho trang /diem-den/<slug>.
//
// Điểm đến (Hạ Long, Seoul…) gắn với một danh mục VÙNG (Miền Bắc, Đông Bắc Á…).
// Trước đây trang lấy 6 tour đầu của cả vùng và gọi là "Tour Vịnh Hạ Long đang
// mở" — tour Sa Pa, Hà Giang cũng lọt vào. Giờ tách hai nhóm:
//   - dungDiem: tour có tên điểm đến trong đường dẫn ("ha-noi-ha-long-sa-pa"
//     chứa "ha-long"), tìm trong MỌI tour đang bán, không chỉ trong vùng;
//   - cungKhuVuc: tour khác của vùng, tối đa `toiDaKhac`.
export const khongDau = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function tourTheoDiemDen(diemDen, { tatCa = [], cungVung = [] }, toiDaKhac = 6) {
  // Khớp theo slug điểm đến hoặc tên viết không dấu ("Vịnh Hạ Long" → "vinh-ha-long")
  const khoa = [...new Set([diemDen.slug, khongDau(diemDen.name)].filter((k) => k && k.length >= 3))];
  const khop = (t) => {
    const duongDan = `-${t.slug}-${khongDau(t.name)}-`;
    return khoa.some((k) => duongDan.includes(`-${k}-`));
  };

  const daCo = new Set();
  const dungDiem = [];
  for (const t of [...cungVung, ...tatCa]) {
    if (!t?.slug || daCo.has(t.slug) || !khop(t)) continue;
    daCo.add(t.slug);
    dungDiem.push(t);
  }
  const cungKhuVuc = cungVung.filter((t) => t?.slug && !daCo.has(t.slug)).slice(0, toiDaKhac);
  return { dungDiem, cungKhuVuc };
}
