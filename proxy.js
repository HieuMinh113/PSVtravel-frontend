import { NextResponse } from "next/server";
import { phanLoaiLinkCu, traLinkCu, TRANG_DA_GO } from "./app/lib/linkCu";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://psvtravel.com";

// Link của website WordPress cũ có tiền tố riêng (/tour_nuoc_ngoai/…, /tour/…,
// /wp-content/…) — không trùng trang nào của website mới nên chặn ở đây, trước
// khi Next dựng trang. Link một cấp (/nhat-ban, /cua-hang, bài viết cũ) do
// app/(site)/[trang] xử lý khi không có trang thật trùng tên.
export async function proxy(request) {
  const duongDan = request.nextUrl.pathname;
  let kq = phanLoaiLinkCu(duongDan);
  if (kq?.hoi) kq = await traLinkCu(duongDan);

  // Proxy bắt buộc địa chỉ đầy đủ. Dùng tên miền chuẩn thay vì request.url: sau
  // nginx, Next chỉ thấy http:// nên sẽ chuyển thêm một vòng http → https
  if (kq?.ma === 301) return NextResponse.redirect(new URL(kq.toi, SITE_URL), 301);
  if (kq?.ma === 410) {
    return new NextResponse(request.method === "HEAD" ? null : TRANG_DA_GO, {
      status: 410,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  }
  return NextResponse.next();
}

// Phải là hằng số (Next đọc lúc build). Thêm tiền tố mới thì thêm CẢ ở
// app/lib/linkCu.js.
export const config = {
  matcher: [
    "/tour_nuoc_ngoai/:path+",
    "/tour_trong_nuoc/:path+",
    "/tour/:path+",
    "/product/:path+",
    "/san-pham/:path+",
    "/product-category/:path+",
    "/danh-muc-san-pham/:path+",
    "/danh-muc/:path+",
    "/category/:path+",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-admin/:path*",
    "/wp-json/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
    "/feed",
    "/:slug/feed",
    "/sitemap_index.xml",
    "/sitemap.xml.gz",
    "/wp-sitemap.xml",
    "/(.+-sitemap\\d*\\.xml)",
  ],
};
