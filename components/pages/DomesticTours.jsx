"use client";
import TourListPage from "./TourListPage";
import { domesticTours } from "@/data/tours";
import { domesticRegions as regions } from "@/data/filters";

export default function DomesticTours() {
  // Chỉ có 6 tour trong nước thật, lặp lại cho đủ 10 ảnh — khớp mật độ vòng ảnh như Hero trang chủ
  const orbitImages = Array.from({ length: 10 }, (_, i) => domesticTours[i % domesticTours.length].image);

  return (
    <TourListPage
      tours={domesticTours}
      basePath="/tour-trong-nuoc"
      eyebrow="Tour trong nước"
      title="Khám phá Việt Nam từ Bắc chí Nam"
      description="Từ vịnh Hạ Long kỳ vĩ đến đảo Ngọc Phú Quốc rực nắng — mỗi vùng đất đều mang một câu chuyện riêng."
      regions={regions}
      orbitImages={orbitImages}
    />
  );
}