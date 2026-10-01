import { SITE_URL } from "./lib/seo";
export default function robots() {
  return {
    // /qr/: link ngắn trong mã QR in trên tờ rơi — chỉ để chuyển tiếp tới trang
    // tour và đếm lượt quét, không phải trang có nội dung cho máy tìm kiếm.
    rules: { userAgent: "*", allow: "/", disallow: ["/dang-nhap", "/qr/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
