"use client";
import TourListPage from "./TourListPage";

export default function AbroadTours({ tours = [], orbitImages = [] }) {
  // Ưu tiên ảnh công ty tự upload trong admin (Banner → vị trí "Ảnh vòng xoay").
  // Chưa upload thì lấy tạm ảnh bìa của chính các tour đang bán — vẫn là ảnh thật.
  // Danh sách quốc gia tự sinh từ tour thật đang bán. Trước đây viết cứng nên
  // bán tour Đài Loan mà nút lọc không có, còn nút "Mỹ", "Úc" thì bấm vào rỗng.
  const regions = [
    "Tất cả",
    ...[...new Set(tours.map((t) => t.country).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "vi")
    ),
  ];

  const matchByCountry = (tour, selected) => tour.country === selected;

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
      regions={regions}
      orbitImages={anhVongXoay}
      matchFilter={matchByCountry}
    />
  );
}