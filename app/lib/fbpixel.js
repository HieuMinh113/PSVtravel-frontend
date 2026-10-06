// Bắn sự kiện chuẩn của Meta Pixel một cách an toàn: chỉ chạy phía trình duyệt,
// và không gây lỗi nếu Pixel chưa tải xong hoặc bị trình chặn quảng cáo chặn.
//
// Dùng cho 2 sự kiện chính:
//   - "Lead"    : khách để lại liên hệ (đặt tour thành công, gửi form liên hệ)
//   - "Contact" : khách chủ động liên hệ (gọi hotline, nhắn Zalo)
// Facebook học từ những người này để nhắm quảng cáo tới đúng khách tiềm năng.
export function fbTrack(event, params) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq("track", event, params);
    } else {
      window.fbq("track", event);
    }
  }
}
