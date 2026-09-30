"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import { laMaVideoHopLe, linkNhung, anhThuNho } from "@/app/lib/youtube";

// Khung video YouTube kiểu "bấm mới tải".
//
// Nhúng iframe YouTube thẳng vào trang bắt trình duyệt tải ~1MB script của
// YouTube ngay khi mở trang — trang chậm hẳn, điểm tốc độ (LCP) tụt. Ở đây ban
// đầu chỉ hiện ẢNH THU NHỎ + nút phát (vài chục KB); khách bấm mới thay bằng
// trình phát thật và tự chạy luôn.
export default function YouTubeEmbed({ videoId, title = "Video", className = "", tronGoc = "rounded-3xl" }) {
  const [dangPhat, setDangPhat] = useState(false);
  if (!laMaVideoHopLe(videoId)) return null;

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-deep-950 shadow-card ${tronGoc} ${className}`}>
      {dangPhat ? (
        <iframe
          src={linkNhung(videoId, { tuPhat: true })}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setDangPhat(true)}
          aria-label={`Phát video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <img
            src={anhThuNho(videoId)}
            alt={title}
            loading="lazy"
            // Mạng chặn ảnh YouTube thì ẩn ảnh đi, chỉ còn nền tối + nút phát
            // (thay vì hiện biểu tượng ảnh vỡ và dòng chữ alt).
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-deep-950/60 via-deep-950/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sunset-600 text-white shadow-lg ring-4 ring-white/30 transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
            <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
          </span>
        </button>
      )}
    </div>
  );
}
