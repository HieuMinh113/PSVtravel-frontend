"use client";
import TourListPage from "./TourListPage";

// Xem ghi chú ở DomesticTours: hero + giới thiệu render ở page.jsx phía máy chủ.
export default function AbroadTours({ tours = [], danhMuc = [] }) {
  return <TourListPage tours={tours} basePath="/tour-nuoc-ngoai" danhMuc={danhMuc} />;
}
