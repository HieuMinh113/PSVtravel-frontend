"use client";
import TourListPage from "./TourListPage";

export default function AbroadTours({ tours = [], orbitImages = [], danhMuc = [] }) {
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
      basePath="/tour-nuoc-ngoai"
      eyebrow="Tour nước ngoài"
      title="Những chân trời mới đang chờ đón"
      description="Thái Lan sôi động, Hàn Quốc lãng mạn, Nhật Bản tinh tế — chọn điểm đến, chúng tôi lo phần còn lại."
      danhMuc={danhMuc}
      orbitImages={anhVongXoay}
    />
  );
}
