// Dữ liệu visa dùng chung — trang /lam-visa và phần "Hướng dẫn visa" trong chi tiết
// tour nước ngoài cùng đọc từ đây để nhất quán, chỉ cần sửa 1 nơi.
export const visaCountries = [
  { name: "Hàn Quốc", flag: "🇰🇷", required: true, time: "5-7 ngày", price: "1.890.000đ", rate: "98%" },
  { name: "Nhật Bản", flag: "🇯🇵", required: true, time: "5-7 ngày", price: "1.590.000đ", rate: "97%" },
  { name: "Đài Loan", flag: "🇹🇼", required: true, time: "4-6 ngày", price: "1.290.000đ", rate: "99%" },
  { name: "Trung Quốc", flag: "🇨🇳", required: true, time: "5-8 ngày", price: "1.690.000đ", rate: "96%" },
  { name: "Mỹ", flag: "🇺🇸", required: true, time: "3-6 tuần", price: "2.990.000đ", rate: "82%" },
  { name: "Châu Âu (Schengen)", flag: "🇪🇺", required: true, time: "10-15 ngày", price: "2.490.000đ", rate: "93%" },
  { name: "Úc", flag: "🇦🇺", required: true, time: "2-4 tuần", price: "2.290.000đ", rate: "90%" },
  { name: "Canada", flag: "🇨🇦", required: true, time: "3-5 tuần", price: "2.590.000đ", rate: "88%" },
  // Công dân Việt Nam được miễn visa ngắn hạn — vẫn liệt kê để trang chi tiết tour
  // có thể hiển thị đúng thông tin thay vì bỏ sót.
  { name: "Thái Lan", flag: "🇹🇭", required: false, note: "Miễn visa tối đa 30 ngày cho công dân Việt Nam" },
  { name: "Singapore", flag: "🇸🇬", required: false, note: "Miễn visa tối đa 30 ngày cho công dân Việt Nam" },
];

export function getVisaInfo(countryName) {
  return visaCountries.find((c) => c.name === countryName) || null;
}