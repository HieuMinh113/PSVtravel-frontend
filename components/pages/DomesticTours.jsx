"use client";
import TourListPage from "./TourListPage";

// Chỉ còn lưới tour + bộ lọc. Tiêu đề (H1) và đoạn giới thiệu đã chuyển lên
// page.jsx để được render phía máy chủ — nếu để trong đây, chúng nằm sau ranh
// giới Suspense (do bộ lọc đọc ?category= trên URL) và biến mất khỏi HTML dựng
// sẵn, khiến Google và cỗ máy AI không thấy tiêu đề trang.
export default function DomesticTours({ tours = [], danhMuc = [] }) {
  return <TourListPage tours={tours} basePath="/tour-trong-nuoc" danhMuc={danhMuc} />;
}
