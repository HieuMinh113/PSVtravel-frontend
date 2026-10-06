"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Meta Pixel (Facebook Pixel) — dùng để chạy quảng cáo Facebook/Instagram và đo
// chuyển đổi. ID lấy từ biến môi trường NEXT_PUBLIC_FB_PIXEL_ID, không đặt thì
// dùng ID mặc định của PSV Travel. Pixel ID không phải bí mật (ai xem mã nguồn
// trang cũng thấy), nên để mặc định cho chạy được ngay.
const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "2052288065407844";

// Bắn lại sự kiện PageView mỗi khi đổi trang. Website chạy kiểu SPA (Next App
// Router) — chuyển trang KHÔNG tải lại toàn bộ, nên đoạn mã gốc của Facebook chỉ
// đếm được lượt xem trang đầu tiên. Nghe theo đổi đường dẫn để đếm đủ mọi trang.
function TheoDoiChuyenTrang() {
  const pathname = usePathname();
  const lanDau = useRef(true);

  useEffect(() => {
    // Lần đầu đã có PageView do đoạn mã init bắn rồi — bỏ qua để khỏi đếm trùng.
    if (lanDau.current) {
      lanDau.current = false;
      return;
    }
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}

export default function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>

      {/* Dự phòng cho trình duyệt tắt JavaScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      <TheoDoiChuyenTrang />
    </>
  );
}
