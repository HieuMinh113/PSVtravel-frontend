"use client";
import { useEffect, useState } from "react";
import { getImageProps } from "next/image";
import { X } from "lucide-react";
import { duocToiUu } from "@/app/lib/anh";

// Poster quảng cáo bật lên khi mở web.
//
// - Hiện 1 lần mỗi phiên: tắt rồi thì trong phiên đó không hiện lại (dùng
//   sessionStorage, tự xoá khi khách đóng trình duyệt).
// - Khoá theo id poster: admin đăng poster MỚI thì khách vẫn thấy lại.
// - Hiện NGUYÊN tấm poster theo đúng tỉ lệ gốc (không cắt), tự thu vừa màn
//   hình — cao tối đa 85% màn hình — nên poster dọc nhiều chữ vẫn đọc đủ.
// - Bấm vào ảnh: đóng popup rồi đi tới link admin đặt (nếu có); link ngoài
//   mở tab mới.
// - CHỈ HIỆN SAU KHI KHÁCH BẮT ĐẦU TƯƠNG TÁC (cuộn, chạm, bấm phím), không bật
//   ngay khi vừa mở trang. Hai lý do, đều đo được:
//     1. Google chấm tốc độ theo "phần tử lớn nhất hiện lên". Poster bật ngay
//        thì chính nó thành phần tử lớn nhất → PageSpeed báo LCP 19,6 giây.
//        Sau lượt tương tác đầu, Google ngừng đo nên poster không bị tính.
//     2. Google hạ hạng trang di động có popup che nội dung ngay khi khách từ
//        kết quả tìm kiếm bấm vào ("intrusive interstitials").
// - Ảnh qua bộ tối ưu của Next (WebP, đúng cỡ màn hình) và chỉ tải MỘT ảnh
//   đúng thiết bị — trước đây tải cả bản máy tính lẫn bản điện thoại (2 × 1,1MB).
const SU_KIEN_TUONG_TAC = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"];
const KHOA = "psv_popup_da_tat";

export default function PromoPopup({ poster }) {
  const [hien, setHien] = useState(false);

  useEffect(() => {
    if (!poster?.image) return;
    let daTat = null;
    try {
      daTat = sessionStorage.getItem(KHOA);
    } catch {
      /* trình duyệt chặn storage — cứ hiện bình thường */
    }
    if (daTat === String(poster.id)) return;

    let hen = null;
    const khiTuongTac = () => {
      boNghe();
      // Chờ một nhịp để không che ngay lúc khách vừa chạm vào thứ họ muốn xem
      hen = setTimeout(() => setHien(true), 1200);
    };
    const boNghe = () =>
      SU_KIEN_TUONG_TAC.forEach((ev) => window.removeEventListener(ev, khiTuongTac));
    SU_KIEN_TUONG_TAC.forEach((ev) =>
      window.addEventListener(ev, khiTuongTac, { once: true, passive: true })
    );
    return () => {
      boNghe();
      clearTimeout(hen);
    };
  }, [poster]);

  useEffect(() => {
    if (!hien) return;
    const onKey = (e) => {
      if (e.key === "Escape") dong();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hien]);

  const dong = () => {
    setHien(false);
    try {
      sessionStorage.setItem(KHOA, String(poster.id));
    } catch {
      /* bỏ qua nếu storage bị chặn */
    }
  };

  if (!poster?.image || !hien) return null;

  // Bấm vào poster: chuyển thẳng trong TAB HIỆN TẠI (không mở tab mới) rồi
  // đóng poster. onClick={dong} lưu "đã tắt" trước khi trang điều hướng đi.
  const coLink = poster.link && poster.link.trim() !== "";

  // Ảnh hiện nguyên tấm (không cắt), tự thu vừa màn hình
  const anhClass =
    "block h-auto max-h-[85vh] w-auto max-w-[92vw] rounded-2xl shadow-2xl sm:max-w-[26rem]";
  // <picture>: trình duyệt chỉ tải đúng một ảnh theo cỡ màn hình.
  //
  // Dùng srcset theo mật độ điểm ảnh (1x/2x), KHÔNG dùng "sizes": ảnh poster
  // hiện theo kích thước tự nhiên (w-auto h-auto, giới hạn bởi max-w/max-h) để
  // giữ đúng tỉ lệ poster. Với "sizes", trình duyệt tính kích thước tự nhiên
  // theo bề rộng bản được yêu cầu (1080px) chứ không theo ảnh thật (800px) nên
  // poster bị thu nhỏ còn ~2/3. width/height chỉ là tỉ lệ tạm 4:5 trước khi
  // ảnh về; 450px ≈ bề ngang tối đa popup nên bản 2x vẫn nét trên điện thoại.
  const alt = poster.title || "Khuyến mãi PSV Travel";
  const anhMay = poster.image;
  const anhDt = poster.image_mobile || poster.image;
  const chung = { alt, width: 450, height: 563, loading: "eager" };
  const { props: pMay } = getImageProps({ ...chung, src: anhMay, unoptimized: !duocToiUu(anhMay) });
  const { props: pDt } = getImageProps({ ...chung, src: anhDt, unoptimized: !duocToiUu(anhDt) });
  const Anh = (
    <picture>
      <source media="(min-width: 640px)" srcSet={pMay.srcSet || pMay.src} />
      <img {...pDt} alt={alt} className={anhClass} />
    </picture>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Thông báo khuyến mãi"
      onClick={dong}
    >
      <div
        className="relative motion-safe:animate-[popup_.28s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút tắt — chip tròn trắng ở góc trong ảnh, luôn rõ và không tràn */}
        <button
          type="button"
          onClick={dong}
          aria-label="Đóng"
          className="absolute right-2.5 top-2.5 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-deep-900 shadow-lg ring-1 ring-black/5 transition-colors hover:bg-white hover:text-ocean-700 sm:h-10 sm:w-10"
        >
          <X className="h-5 w-5" />
        </button>

        {coLink ? (
          <a
            href={poster.link}
            onClick={dong}
            className="block"
          >
            {Anh}
          </a>
        ) : (
          Anh
        )}
      </div>

      <style>{`@keyframes popup{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
