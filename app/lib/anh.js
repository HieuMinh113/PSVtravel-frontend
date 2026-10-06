// Ảnh do admin upload có thể rất nặng: PageSpeed đo được banner PNG 2,6MB và
// poster popup 1,1MB tải nguyên bản gốc xuống điện thoại. Đi qua bộ tối ưu ảnh
// của Next (<Image>) thì ảnh được đổi sang WebP và thu nhỏ đúng cỡ màn hình —
// thường nhẹ đi 10–20 lần.
//
// Nhưng Next chỉ tối ưu ảnh từ tên miền đã khai báo trong next.config.mjs
// (remotePatterns); ảnh từ nơi khác (admin dán link ngoài) mà đưa vào <Image>
// thì trang báo lỗi. Hàm này cho biết ảnh có tối ưu được không — không được
// thì dùng <Image unoptimized>, vẫn hiện ảnh gốc như trước, không bao giờ vỡ.
//
// Danh sách phải khớp remotePatterns trong next.config.mjs.
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

let hostApi = "";
try {
  hostApi = new URL(API).host;
} catch {
  hostApi = "";
}

const HOST_TOI_UU = new Set(
  [
    hostApi,
    "localhost:8000",
    "127.0.0.1:8000",
    "images.unsplash.com",
    "plus.unsplash.com",
    "picsum.photos",
    "i.ytimg.com",
  ].filter(Boolean)
);

export function duocToiUu(src) {
  if (!src || typeof src !== "string") return false;
  if (src.startsWith("/")) return true;
  try {
    return HOST_TOI_UU.has(new URL(src).host);
  } catch {
    return false;
  }
}
