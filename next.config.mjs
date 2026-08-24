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
