// Kho đánh giá dùng chung cho mọi tour — TourDetail sẽ chọn ra một tập con
// (dựa theo slug của tour) để mỗi tour hiển thị một tổ hợp đánh giá khác nhau,
// tránh việc phải soạn riêng review cho từng tour một.
export const reviewPool = [
  {
    name: "Nguyễn Thu Hà",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "3 tuần trước",
    comment: "Lịch trình hợp lý, hướng dẫn viên nhiệt tình chu đáo. Cả nhà mình đi 6 người ai cũng hài lòng, chắc chắn sẽ quay lại đặt tour tiếp theo.",
    photo: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Trần Minh Khoa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "1 tháng trước",
    comment: "Dịch vụ chuyên nghiệp từ khâu tư vấn đến khi kết thúc chuyến đi. Khách sạn đúng như cam kết, ăn uống ngon, không phát sinh chi phí ẩn.",
    photo: null,
  },
  {
    name: "Lê Thị Bích",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    date: "2 tháng trước",
    comment: "Giá tốt so với thị trường, chất lượng vượt mong đợi. Duy chỉ có ngày đầu hơi vội, các ngày sau rất thoải mái.",
    photo: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Phạm Đức Anh",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "2 tháng trước",
    comment: "Đây là lần thứ 3 mình đặt tour ở PSVTravel. Luôn yên tâm về chất lượng và sự minh bạch trong giá cả, tư vấn viên hỗ trợ nhiệt tình.",
    photo: null,
  },
  {
    name: "Võ Ngọc Lan",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "3 tháng trước",
    comment: "Ảnh chụp đẹp như concept, hướng dẫn viên chụp hình cực có tâm. Đồ ăn trong tour cũng rất ngon và hợp khẩu vị gia đình mình.",
    photo: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Đặng Gia Bảo",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    date: "3 tháng trước",
    comment: "Trải nghiệm tổng thể tốt, xe đưa đón đúng giờ, phòng khách sạn sạch sẽ. Sẽ giới thiệu thêm bạn bè đặt tour ở đây.",
    photo: null,
  },
  {
    name: "Hoàng Yến Nhi",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "4 tháng trước",
    comment: "Chuyến đi vượt mong đợi, đặc biệt là phần ẩm thực địa phương được sắp xếp rất chu đáo, món nào cũng ngon và đúng vị.",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Bùi Thanh Tùng",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "4 tháng trước",
    comment: "Rất hài lòng với thái độ phục vụ của hướng dẫn viên, luôn hỏi han và hỗ trợ khách kịp thời trong suốt hành trình.",
    photo: null,
  },
  {
    name: "Ngô Khánh Linh",
    avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    date: "5 tháng trước",
    comment: "Tour đáng tiền, lịch trình đầy đủ điểm tham quan nổi bật. Mong công ty cập nhật thêm thời gian tự do mua sắm.",
    photo: null,
  },
  {
    name: "Trịnh Quốc Huy",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    date: "5 tháng trước",
    comment: "Cảnh đẹp, đồ ăn ngon, giá cả hợp lý. Đặt tour qua hotline được tư vấn rất kỹ trước khi đi nên yên tâm hẳn.",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
  },
];

// Chọn ra `count` đánh giá theo slug của tour để mỗi tour có tổ hợp khác nhau
// nhưng luôn ổn định (không đổi mỗi lần render lại).
export function pickReviewsForTour(slug, count = 4) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) % reviewPool.length;
  const rotated = [...reviewPool.slice(hash), ...reviewPool.slice(0, hash)];
  return rotated.slice(0, count);
}