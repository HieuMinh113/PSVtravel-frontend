// Bắn chuyển đổi Google Ads một cách an toàn (chỉ chạy phía trình duyệt, không
// lỗi nếu thẻ Google chưa tải xong hoặc bị chặn).
//
// Nhãn chuyển đổi (send_to) do Google Ads cấp cho từng "hành động chuyển đổi".
// Hiện dùng chung một nhãn cho việc "khách để lại liên hệ" (đặt tour + gửi form).
// Muốn tách riêng đặt tour / liên hệ thì tạo thêm hành động chuyển đổi trong
// Google Ads rồi đặt nhãn mới vào biến môi trường tương ứng.
export const CONVERSION_LIEN_HE =
  process.env.NEXT_PUBLIC_GADS_LEAD_LABEL || "AW-18441918600/3AalCIH4uIcdEIix5dlE";

// Google Analytics 4 (thuộc tính "PSV Travel", luồng web psvtravel.com). Mã đo
// lường không phải bí mật — ai xem mã nguồn trang cũng thấy.
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-FYJ4XK094T";

export function gtagConversion(sendTo, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: sendTo, ...params });
  }
}

/**
 * Sự kiện GA4. Thẻ Google nạp sau khi trang chạy xong (afterInteractive) nên sự
 * kiện bắn ngay lúc mở trang (xem tour) có thể đến trước thẻ: chờ tối đa ~6 giây
 * rồi mới bỏ. Bị trình chặn quảng cáo chặn thì thôi, không lỗi.
 */
export function gaEvent(ten, thamSo = {}, lanThu = 0) {
  if (typeof window === "undefined" || !GA4_ID) return;
  if (typeof window.gtag === "function") {
    window.gtag("event", ten, { send_to: GA4_ID, ...thamSo });
  } else if (lanThu < 20) {
    setTimeout(() => gaEvent(ten, thamSo, lanThu + 1), 300);
  }
}
