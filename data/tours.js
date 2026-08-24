// Toàn bộ tour giờ lấy từ API (admin nhập). File này chỉ còn giữ hàm định dạng
// tiền để các thẻ tour dùng chung.
//
// Trước đây file này chứa 8 tour mẫu kèm ảnh Unsplash. Khi CSDL trống, web đổ
// ra tour ảo — khách bấm vào đặt tour không tồn tại. Đã bỏ hẳn.
export const formatVND = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
