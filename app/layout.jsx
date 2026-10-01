import "./globals.css";
import localFont from "next/font/local";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, organizationJsonLd, websiteJsonLd, JsonLd } from "./lib/seo";
import MetaPixel from "@/components/MetaPixel";
import GoogleTag from "@/components/GoogleTag";

// PHÔNG CHỮ LƯU SẴN TRONG MÃ NGUỒN (app/fonts/), không tải từ Google lúc build.
//
// Trước đây dùng next/font/google: mỗi lần build, Next tải CSS + phông từ
// Google Fonts. Ngày 01/10/2026 Google trả về định dạng link mà Turbopack không
// đọc được → build trên VPS hỏng ("next/font/google queries have exactly one
// entry") dù mã không đổi gì. Lưu sẵn phông thì build không còn phụ thuộc
// mạng/Google, lần nào cũng như lần nào.
//
// Các tệp .woff2 được cắt từ bản gốc trên github.com/google/fonts (giấy phép
// OFL, kèm trong app/fonts/), chỉ giữ ký tự latin + latin-ext + tiếng Việt —
// đúng ba bộ chữ web cần, đã kiểm đủ mọi chữ có dấu. Be Vietnam Pro ~20KB mỗi
// độ đậm (trước là 3 tệp/độ đậm, cộng lại ~30KB).
//
// Font tiêu đề: Be Vietnam Pro — thiết kế riêng cho tiếng Việt, dấu không bết
// vào thân chữ ở cỡ nhỏ (thay Playfair Display trước đây). Chỉ các độ đậm thật
// sự dùng: 500/600/700. Preload để tiêu đề (phần tử LCP) có phông sớm.
const display = localFont({
  src: [
    { path: "./fonts/be-vietnam-pro-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/be-vietnam-pro-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/be-vietnam-pro-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

// Font nội dung: Roboto.
//
// display "optional": chỉ dùng Roboto nếu có sẵn lúc vẽ trang, không thì giữ
// phông hệ thống cho lượt xem đó — KHÔNG đổi phông giữa chừng (đổi giữa chừng
// làm dòng thông tin dưới tên tour nhảy 2 dòng ↔ 1 dòng, CLS 0,12).
// preload: false — không giành băng thông của tiêu đề; từ trang thứ hai Roboto
// đã nằm trong bộ nhớ đệm. (Android: phông hệ thống chính là Roboto.)
const body = localFont({
  src: [
    { path: "./fonts/roboto-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/roboto-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/roboto-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "optional",
  preload: false,
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Đặt tour du lịch trong nước & nước ngoài`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — Đặt tour du lịch trong nước & nước ngoài`,
    description: SITE_DESCRIPTION,
    images: [{ url: `${SITE_URL}/logo.png` }],
  },
  twitter: { card: "summary_large_image", images: [`${SITE_URL}/logo.png`] },
  // Biểu tượng tab lấy từ app/icon.png và app/apple-icon.png — Next tự sinh
  // thẻ <link> nên không khai báo icons ở đây nữa, tránh phải giữ hai chỗ khớp
  // nhau. Tài liệu Next 16 cũng khuyên dùng cách theo tệp thay vì khai báo tay.
  robots: { index: true, follow: true },
};

// Cấu hình viewport: cho phép nội dung dùng vùng an toàn trên iPhone tai thỏ,
// và đặt màu thanh trình duyệt trên Android/iOS theo màu thương hiệu.
export const viewport = {
  themeColor: "#0169A9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <MetaPixel />
        <GoogleTag />
      </body>
    </html>
  );
}