import { headers } from "next/headers";

// Chuyển IP THẬT của khách sang backend khi route /api/* của Next gọi Laravel.
//
// Vì sao cần: form của khách đi trình duyệt → Next → Laravel. Không kèm IP thì
// Laravel chỉ thấy MỘT địa chỉ (container Next) cho MỌI khách, nên giới hạn tần
// suất bị tính chung cả website: "3 lượt/giờ" của form liên hệ thành 3 lượt/giờ
// cho TẤT CẢ khách cộng lại — lượt thứ 4 bị chặn, và kẻ xấu gửi 3 tin rác là
// khoá được form lấy khách của mọi người.
//
// Vì sao an toàn:
//  - Lấy X-Real-IP trước: nginx GHI ĐÈ header này bằng địa chỉ kết nối thật
//    ($remote_addr), khách không tự khai được.
//  - Laravel chỉ tin X-Forwarded-For khi request đến từ mạng Docker nội bộ
//    (TrustProxies) — ai gửi thẳng header giả vào api.psvtravel.com đều bị bỏ qua.
//  - Chỉ nhận chuỗi toàn ký tự của địa chỉ IP, chặn chèn dấu phẩy / xuống dòng.
const MAU_IP = /^[0-9a-fA-F:.]{2,45}$/;

export async function headerIpKhach() {
  try {
    const h = await headers();
    const ip = (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "").trim();
    return MAU_IP.test(ip) ? { "X-Forwarded-For": ip } : {};
  } catch {
    // Gọi ngoài phạm vi một request (vd. lúc build) thì không có IP để chuyển.
    return {};
  }
}
