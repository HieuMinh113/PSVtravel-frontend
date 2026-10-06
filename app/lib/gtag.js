// Bắn chuyển đổi Google Ads một cách an toàn (chỉ chạy phía trình duyệt, không
// lỗi nếu thẻ Google chưa tải xong hoặc bị chặn).
//
// Nhãn chuyển đổi (send_to) do Google Ads cấp cho từng "hành động chuyển đổi".
// Hiện dùng chung một nhãn cho việc "khách để lại liên hệ" (đặt tour + gửi form).
// Muốn tách riêng đặt tour / liên hệ thì tạo thêm hành động chuyển đổi trong
// Google Ads rồi đặt nhãn mới vào biến môi trường tương ứng.
export const CONVERSION_LIEN_HE =
  process.env.NEXT_PUBLIC_GADS_LEAD_LABEL || "AW-18441918600/3AalCIH4uIcdEIix5dlE";

export function gtagConversion(sendTo, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: sendTo, ...params });
  }
}
