"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Poster quảng cáo bật lên khi mở web.
//
// - Hiện 1 lần mỗi phiên: tắt rồi thì trong phiên đó không hiện lại (dùng
//   sessionStorage, tự xoá khi khách đóng trình duyệt).
// - Khoá theo id poster: admin đăng poster MỚI thì khách vẫn thấy lại, dù đã
//   tắt poster cũ.
// - Bấm vào ảnh đi tới link admin đặt (nếu có); link ngoài mở tab mới.
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

    // Chờ một nhịp cho trang ổn định rồi mới bật, đỡ giật
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

  const Anh = (
    <>
      {/* Ảnh máy tính / điện thoại — API tự trả image_mobile (mặc định = image) */}
      <img
        src={poster.image}
        alt={poster.title || "Khuyến mãi PSV Travel"}
        className="hidden max-h-[80vh] w-full object-contain sm:block"
      />
      <img
        src={poster.image_mobile || poster.image}
        alt={poster.title || "Khuyến mãi PSV Travel"}
        className="max-h-[80vh] w-full object-contain sm:hidden"
      />
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Thông báo khuyến mãi"
      onClick={dong}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl motion-safe:animate-[popup_.28s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút tắt */}
        <button
          type="button"
          onClick={dong}
          aria-label="Đóng"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/70"
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
