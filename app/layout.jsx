import "./globals.css";
import { Playfair_Display, Roboto } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, organizationJsonLd, JsonLd } from "./lib/seo";

// Font tiêu đề: Playfair Display (editorial, sang) — có hỗ trợ tiếng Việt
const display = Playfair_Display({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Font nội dung: giữ Roboto
const body = Roboto({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
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
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
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
      </body>
    </html>
  );
}