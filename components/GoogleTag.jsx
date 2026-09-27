"use client";

import Script from "next/script";

// Thẻ Google cơ sở (gtag.js) cho Google Ads — bật theo dõi chuyển đổi và tiếp
// thị lại (remarketing). ID lấy từ NEXT_PUBLIC_GOOGLE_ADS_ID, mặc định dùng ID
// của PSV Travel. ID này không phải bí mật (ai xem mã nguồn trang cũng thấy).
const GA_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18441918600";

export default function GoogleTag() {
  if (!GA_ADS_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ADS_ID}');`}
      </Script>
    </>
  );
}
