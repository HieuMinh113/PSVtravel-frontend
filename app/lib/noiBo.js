// Khoá nội bộ khi MÁY CHỦ Next gọi API để dựng trang.
//
// Mọi lời gọi dựng trang đều đi ra từ một IP (container Next), nên trước đây
// nginx (30 lượt/giây/IP) và Laravel (600 lượt/phút/IP) tính chung một suất:
// bot quét 56 trang đã làm 36% lời gọi bị chặn 503 → trang tour không cập nhật
// giá / chỗ. Gửi kèm khoá này thì hai bên không tính (xem đầu
// docker/nginx/prod.conf.template ở repo backend).
//
// Khoá nằm trong biến PSV_NOI_BO lúc container chạy — KHÔNG có tiền tố
// NEXT_PUBLIC_ nên Next không bao giờ nhúng vào mã gửi xuống trình duyệt; thêm
// điều kiện "không phải trình duyệt" cho chắc (api.js có hàm chạy cả hai phía).
export function headerNoiBo() {
  if (typeof window !== "undefined") return {};
  const khoa = process.env.PSV_NOI_BO;

  return typeof khoa === "string" && khoa.length >= 32 ? { "X-Psv-Noi-Bo": khoa } : {};
}
