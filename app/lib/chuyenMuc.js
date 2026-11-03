// Chuyên mục bài cẩm nang: admin lưu mã (kinh-nghiem…), website hiện tên tiếng
// Việt. Trước đây hiện thẳng mã "am-thuc", "kinh-nghiem" trên nút lọc và thẻ bài.
// Cùng danh sách với ô "Chuyên mục" trong form bài viết (admin, GuideForm.php).
export const CHUYEN_MUC = [
  ["kinh-nghiem", "Kinh nghiệm"],
  ["am-thuc", "Ẩm thực"],
  ["thu-tuc", "Thủ tục"],
  ["diem-den", "Điểm đến"],
  ["khac", "Khác"],
];

const TEN = Object.fromEntries(CHUYEN_MUC);
const THU_TU = Object.fromEntries(CHUYEN_MUC.map(([ma], i) => [ma, i]));

/** "am-thuc" → "Ẩm thực"; mã lạ → bỏ gạch nối, viết hoa chữ đầu */
export function tenChuyenMuc(ma) {
  if (!ma) return "";
  if (TEN[ma]) return TEN[ma];
  const chu = String(ma).replace(/-/g, " ").trim();
  return chu.charAt(0).toUpperCase() + chu.slice(1);
}

/** Các mã chuyên mục có trong danh sách bài, theo thứ tự cố định của admin */
export function cacChuyenMuc(dsBai) {
  const co = [...new Set(dsBai.map((g) => g?.category).filter(Boolean))];
  return co.sort((a, b) => (THU_TU[a] ?? 99) - (THU_TU[b] ?? 99) || a.localeCompare(b));
}
