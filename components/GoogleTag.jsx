"use client";

import Script from "next/script";
import { GA4_ID } from "@/app/lib/gtag";

// Thẻ Google (gtag.js) dùng chung cho Google Ads (chuyển đổi, tiếp thị lại) và
// Google Analytics 4. Mã Ads lấy từ NEXT_PUBLIC_GOOGLE_ADS_ID, mã GA4 ở
// app/lib/gtag.js — đều có mặc định của PSV Travel, không phải bí mật.
//
// Lượt xem trang khi chuyển trang trong web (Next đổi trang không tải lại) do
// GA4 tự đếm: "Đo lường nâng cao → Lượt xem trang → thay đổi trang dựa trên sự
// kiện lịch sử trình duyệt" (bật sẵn). Không bắn page_view tay để khỏi đếm đôi.
const GA_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18441918600";

export default function GoogleTag() {
  const dauTien = GA4_ID || GA_ADS_ID;
  if (!dauTien) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${dauTien}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${GA4_ID ? `gtag('config', '${GA4_ID}');\n` : ""}${GA_ADS_ID ? `gtag('config', '${GA_ADS_ID}');` : ""}`}
      </Script>
    </>
  );
}
