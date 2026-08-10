// Danh mục lọc dùng chung — trang danh sách tour (TourListPage) và thanh tìm kiếm
// trong trang chi tiết tour (TourDetail) cùng đọc từ đây để luôn đồng bộ.
export const domesticRegions = ["Tất cả", "Miền Bắc", "Miền Trung", "Miền Nam"];

export const abroadRegions = [
  "Tất cả", "Thái Lan", "Singapore", "Nhật Bản", "Hàn Quốc", "Tour lạ", "Mỹ", "Úc",
];

// Các quốc gia phổ biến đã có nhãn riêng; "Tour lạ" gom các điểm đến còn lại
// (Trung Quốc, Đài Loan...) — những tuyến ít người đi hơn nhưng độc đáo.
const mainCountries = ["Thái Lan", "Singapore", "Nhật Bản", "Hàn Quốc"];
export const matchByCountry = (tour, selected) => {
  if (selected === "Tour lạ") return !mainCountries.includes(tour.country);
  return tour.country === selected;
};