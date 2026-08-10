"use client";
import TourListPage from "./TourListPage";
import { abroadTours } from "@/data/tours";
import { abroadRegions as regions, matchByCountry } from "@/data/filters";

export default function AbroadTours() {
  // Chỉ có 6 tour nước ngoài thật, lặp lại cho đủ 10 ảnh — khớp mật độ vòng ảnh như Hero trang chủ
  const orbitImages = Array.from({ length: 10 }, (_, i) => abroadTours[i % abroadTours.length].image);

  return (
    <TourListPage
      tours={abroadTours}
      basePath="/tour-nuoc-ngoai"
      eyebrow="Tour nước ngoài"
      title="Những chân trời mới đang chờ đón"
      description="Thái Lan sôi động, Hàn Quốc lãng mạn, Nhật Bản tinh tế — chọn điểm đến, chúng tôi lo phần còn lại."
      regions={regions}
      orbitImages={orbitImages}
      matchFilter={matchByCountry}
    />
  );
}