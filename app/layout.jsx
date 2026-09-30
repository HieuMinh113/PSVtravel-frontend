import "./globals.css";
import { Be_Vietnam_Pro, Roboto } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, organizationJsonLd, websiteJsonLd, JsonLd } from "./lib/seo";
import MetaPixel from "@/components/MetaPixel";
import GoogleTag from "@/components/GoogleTag";

// Font tiêu đề: Be Vietnam Pro — thiết kế riêng cho tiếng Việt.
//
// Trước đây dùng Playfair Display. Đó là serif báo chí nét mảnh, đẹp ở tiêu đề
// cỡ lớn nhưng xuống cỡ nhỏ (tên ngày trong lịch trình, tên thẻ tour, nhãn) thì
// dấu tiếng Việt bết vào thân chữ, rất khó đọc — tester ghi nhận ở nhiều chỗ.
// Be Vietnam Pro có dấu vẽ riêng, cân ở mọi cỡ chữ mà vẫn giữ nét hiện đại.
//
// Chỉ nạp các độ đậm THẬT SỰ dùng (500/600/700 — không có chỗ nào dùng 800) và
// chỉ preload bộ chữ latin + vietnamese (đủ mọi dấu tiếng Việt). Trước đây
// preload 15 file phông cùng lúc với mức ưu tiên cao, tranh băng thông với CSS
// trên mạng 4G chậm — PageSpeed tính cả vào thời gian hiện tiêu đề (LCP).
const display = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Font nội dung: giữ Roboto
//
// display "optional" thay cho "swap": trình duyệt chỉ dùng Roboto nếu tải kịp
// lúc vẽ trang (thường là kịp vì Next.js đã preload sẵn); không kịp thì giữ
// phông hệ thống cho lượt xem đó, KHÔNG đổi phông giữa chừng. Với "swap", chữ
// đổi phông khi trang đã hiện làm dòng chữ dài/ngắn đi, dòng thông tin dưới
// tên tour (sao · số ngày · nơi khởi hành) nhảy từ 2 dòng về 1 dòng → cả khối
// chữ trên ảnh bìa giật (CLS 0,12). Phông tiêu đề Be Vietnam Pro vẫn "swap"
// vì đó là nhận diện thương hiệu và không làm lệch dòng (đã đo).
//
// preload: false — với "optional", phông chỉ được dùng nếu có sẵn lúc vẽ trang;
// preload để giành lấy nó lại chiếm băng thông của những thứ quan trọng hơn.
// Lượt xem đầu dùng phông hệ thống (Android chính là Roboto), từ trang thứ hai
// Roboto đã nằm trong bộ nhớ đệm. Bỏ độ đậm 300 vì không chỗ nào dùng.
const body = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
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