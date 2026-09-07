/** Ảnh danh mục / tour do admin upload nằm trên máy chủ Laravel. Next chỉ cho
 *  tải ảnh từ tên miền đã khai báo, nên lấy thẳng tên miền từ NEXT_PUBLIC_API_URL:
 *  đổi sang máy chủ thật lúc lên production là tự khớp, khỏi sửa file này.
 *  @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
let mayChuAnh = [];
try {
  const u = new URL(apiUrl);
  mayChuAnh = [{ protocol: u.protocol.replace(":", ""), hostname: u.hostname, port: u.port }];
} catch {
  mayChuAnh = [];
}

const nextConfig = {
  // Gỡ header "X-Powered-By: Next.js" — che bớt thông tin nền tảng,
  // theo khuyến nghị của bản kiểm tra SEO/bảo mật.
  poweredByHeader: false,

  // Content-Security-Policy ở chế độ CHỈ-BÁO-CÁO (report-only): trình duyệt
  // KHÔNG chặn gì, chỉ ghi cảnh báo vào console nếu có tài nguyên ngoài chính
  // sách. An toàn tuyệt đối cho trang đang chạy, đúng khuyến nghị "bắt đầu ở
  // report-only" của bản kiểm tra kỹ thuật. Nâng lên chế độ chặn thật cần thêm
  // nonce cho script Next — để làm sau khi đã theo dõi báo cáo một thời gian.
  async headers() {
    const csp = [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self' https:",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
  // Gói sẵn mọi thứ cần khi chạy vào .next/standalone để đóng ảnh Docker nhẹ.
  // Không ảnh hưởng gì lúc chạy `npm run dev` trên máy lập trình.
  output: "standalone",
  images: {
    // Next 16 chặn tối ưu ảnh từ IP nội bộ để phòng SSRF. Ở đây phải mở, cả
    // khi chạy thật:
    //
    //  - Máy lập trình: backend Laravel ở 127.0.0.1:8000
    //  - Máy chủ thật: api.psvtravel.com được đặt bí danh trỏ thẳng vào
    //    container nginx trong mạng Docker (172.x), vì VPS chặn kiểu gọi vòng
    //    ra Internet rồi quay về chính mình.
    //
    // Lớp bảo vệ thật nằm ở remotePatterns bên dưới: chỉ đúng những tên miền
    // liệt kê ở đó mới được tối ưu, không phải mọi địa chỉ nội bộ.
    dangerouslyAllowLocalIP: true,

    // Next 16 bắt buộc khai báo trước các mức chất lượng được phép dùng.
    // Mặc định chỉ có [75]; thêm 90 cho ảnh bìa tour và ảnh lớn cho nét.
    qualities: [75, 90],
    remotePatterns: [
      ...mayChuAnh,
      // Máy lập trình: tuỳ người mà .env ghi localhost hay 127.0.0.1
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};
export default nextConfig;
