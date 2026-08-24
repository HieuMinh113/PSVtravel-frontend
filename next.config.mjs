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
  images: {
    // Next 16 chặn tối ưu ảnh từ IP nội bộ (127.0.0.1, 172.x...) để phòng SSRF.
    // Trên máy lập trình, backend Laravel chạy ở 127.0.0.1:8000 nên ảnh admin
    // upload bị chặn hết. Chỉ mở khi chạy dev; lên production backend là tên
    // miền thật nên vẫn giữ nguyên lớp bảo vệ.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
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
