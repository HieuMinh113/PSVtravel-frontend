"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { fbTrack } from "@/app/lib/fbpixel";
import { MessengerIcon } from "@/components/SocialIcons";

// Nút liên hệ nổi — giúp khách chốt tour nhanh qua gọi điện / Zalo / Messenger,
// kênh chuyển đổi rất quan trọng với thị trường du lịch Việt Nam.

// Ô "Messenger" trong Cài đặt: link m.me/…, messenger.com, facebook.com, hoặc chỉ
// tên / số trang Facebook. Khác những dạng đó thì ẩn nút — không dựng link lạ.
function linkMessenger(raw) {
  const v = String(raw || "").trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      return /(^|\.)(m\.me|messenger\.com|facebook\.com)$/i.test(u.hostname) ? u.href : null;
    } catch {
      return null;
    }
  }
  const ten = v.replace(/^@/, "");
  return /^[A-Za-z0-9._-]{3,}$/.test(ten) ? `https://m.me/${ten}` : null;
}
export default function FloatingContact({ settings = {} }) {
  const hotline = settings.hotline || "0907 870 707";
  const telHref = `tel:${hotline.replace(/[^0-9]/g, "")}`;

  const zaloRaw = settings.zalo;
  // Chưa cấu hình Zalo thì KHÔNG dựng link tới zalo.me/ trống (link hỏng,
  // báo cáo Local SEO bắt được). Trả null để ẩn nút Zalo cho tới khi admin nhập.
  const zaloHref = zaloRaw
    ? (zaloRaw.startsWith("http") ? zaloRaw : `https://zalo.me/${zaloRaw.replace(/[^0-9]/g, "")}`)
    : null;

  const messengerHref = linkMessenger(settings.messenger);

  // Cất nút đi khi khách đang cuộn xuống đọc — nút tròn đè lên nút "Xem chi
  // tiết" và chữ ở mép phải. Cuộn lên hoặc dừng tay chưa tới một giây là hiện lại.
  const [an, setAn] = useState(false);
  useEffect(() => {
    let truoc = window.scrollY;
    let hen;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > truoc + 6 && y > 300) setAn(true);
      else if (y < truoc - 6) setAn(false);
      truoc = y;
      clearTimeout(hen);
      hen = setTimeout(() => setAn(false), 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(hen);
    };
  }, []);

  return (
    <div data-lien-he-noi data-an={an ? "1" : undefined} className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:right-6">
      {/* Messenger — chỉ hiện khi admin đã nhập ô "Messenger" trong Cài đặt */}
      {messengerHref && (
      <motion.a
        href={messengerHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => fbTrack("Contact", { method: "messenger" })}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        whileHover={{ scale: 1.08 }}
        className="group relative grid h-11 w-11 place-items-center rounded-full bg-white text-ocean-700 shadow-deep ring-1 ring-ocean-100 sm:h-14 sm:w-14"
        aria-label="Nhắn tin qua Messenger"
      >
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-deep-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Chat Messenger
        </span>
        <MessengerIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.a>
      )}

      {/* Zalo — chỉ hiện khi admin đã cấu hình, tránh nút dẫn tới link hỏng */}
      {zaloHref && (
      <motion.a
        href={zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => fbTrack("Contact", { method: "zalo" })}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.08 }}
        className="group relative grid h-11 w-11 place-items-center rounded-full bg-white text-ocean-700 shadow-deep ring-1 ring-ocean-100 sm:h-14 sm:w-14"
        aria-label="Nhắn tin qua Zalo"
      >
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-deep-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Chat Zalo
        </span>
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.a>
      )}

      {/* Hotline — có vòng lan toả (ripple) để thu hút chú ý */}
      <motion.a
        href={telHref}
        onClick={() => fbTrack("Contact", { method: "hotline" })}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        whileHover={{ scale: 1.08 }}
        className="group relative grid h-12 w-12 place-items-center rounded-full bg-ocean-700 text-white shadow-lg sm:h-16 sm:w-16"
        aria-label={`Gọi hotline ${hotline}`}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-ocean-400 animate-ripple" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-deep-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Hotline {hotline}
        </span>
        <Phone className="h-5 w-5 sm:h-7 sm:w-7" />
      </motion.a>
    </div>
  );
}
