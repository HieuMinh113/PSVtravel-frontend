"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Poster quảng cáo bật lên khi mở web.
//
// - Hiện 1 lần mỗi phiên: tắt rồi thì trong phiên đó không hiện lại (dùng
//   sessionStorage, tự xoá khi khách đóng trình duyệt).
// - Khoá theo id poster: admin đăng poster MỚI thì khách vẫn thấy lại.
// - Hiện NGUYÊN tấm poster theo đúng tỉ lệ gốc (không cắt), tự thu vừa màn
//   hình — cao tối đa 85% màn hình — nên poster dọc nhiều chữ vẫn đọc đủ.
// - Bấm vào ảnh: đóng popup rồi đi tới link admin đặt (nếu có); link ngoài
//   mở tab mới.
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

    const t = setTimeout(() => setHien(true), 500);
    return () => clearTimeout(t);
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

  const coLink = poster.link && poster.link.trim() !== "";
  const linkNgoai = coLink && /^https?:\/\//i.test(poster.link);

  // Ảnh hiện nguyên tấm (không cắt), tự thu vừa màn hình
  const anhClass =
    "block h-auto max-h-[85vh] w-auto max-w-[92vw] rounded-2xl shadow-2xl sm:max-w-[26rem]";
  const Anh = (
    <>
      <img
        src={poster.image}
        alt={poster.title || "Khuyến mãi PSV Travel"}
        className={`hidden sm:block ${anhClass}`}
      />
      <img
        src={poster.image_mobile || poster.image}
        alt={poster.title || "Khuyến mãi PSV Travel"}
        className={`sm:hidden ${anhClass}`}
      />
    </>
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
            target={linkNgoai ? "_blank" : undefined}
            rel={linkNgoai ? "noopener noreferrer" : undefined}
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
