"use client";
import TourListPage from "./TourListPage";
import { domesticRegions as regions } from "@/data/filters";

export default function DomesticTours({ tours = [], orbitImages = [] }) {
  // Ưu tiên ảnh công ty tự upload trong admin (Banner → vị trí "Ảnh vòng xoay").
  // Chưa upload thì lấy tạm ảnh bìa của chính các tour đang bán — vẫn là ảnh thật.
  const anhVongXoay = orbitImages.length
    ? orbitImages
    : tours.length
    ? Array.from({ length: 10 }, (_, i) => tours[i % tours.length].image)
    : [];

  return (
    <TourListPage
      tours={tours}
      basePath="/tour-trong-nuoc"
      eyebrow="Tour trong nước"
      title="Khám phá Việt Nam từ Bắc chí Nam"
      description="Từ vịnh Hạ Long kỳ vĩ đến đảo Ngọc Phú Quốc rực nắng — mỗi vùng đất đều mang một câu chuyện riêng."
      regions={regions}
      orbitImages={anhVongXoay}
    />
  );
}