"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Chuyển thể từ ý tưởng "ArcGalleryHero" (bản gốc dùng TypeScript + shadcn) sang
// React JSX thuần + Tailwind + Framer Motion cho đúng stack hiện tại của dự án
// (không cài TypeScript/shadcn vì không cần thiết cho một component đơn lẻ).
// Khác với bản gốc (dàn ảnh đứng yên theo hình cung), ở đây toàn bộ vòng ảnh
// tự xoay liên tục quanh tâm — đúng yêu cầu "chạy vòng vòng".
export default function OrbitGallery({
  images,
  radiusLg = 210,
  radiusMd = 160,
  radiusSm = 108,
  cardSizeLg = 92,
  cardSizeMd = 76,
  cardSizeSm = 56,
  duration = 50,
  showCenter = true,
  showRing = true,
}) {
  const [{ radius, cardSize }, setDims] = useState({ radius: radiusLg, cardSize: cardSizeLg });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setDims({ radius: radiusSm, cardSize: cardSizeSm });
      else if (w < 768) setDims({ radius: radiusMd, cardSize: cardSizeMd });
      else setDims({ radius: radiusLg, cardSize: cardSizeLg });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  const angleStep = 360 / images.length;

  return (
    <div
      className="relative mx-auto"
      style={{ width: radius * 2 + cardSize, height: radius * 2 + cardSize, maxWidth: "100%" }}
    >
      {/* Vòng tròn dẫn hướng mờ phía sau, tạo cảm giác quỹ đạo */}
      {showRing && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/25"
          style={{ width: radius * 2, height: radius * 2 }}
        />
      )}

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        {images.map((src, i) => {
          const angle = angleStep * i;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <motion.div
              key={i}
              // Mỗi ảnh tự xoay ngược lại đúng bằng tốc độ vòng ngoài để luôn thẳng đứng,
              // không bị lộn ngược khi cả vòng quay quanh tâm.
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration, ease: "linear" }}
              className="absolute overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/80"
              style={{
                width: cardSize,
                height: cardSize,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Image
                src={src}
                alt=""
                draggable={false}
                fill
                sizes="200px"
                className="object-cover"
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tâm vòng — điểm nhấn tĩnh giữa các ảnh đang xoay (tắt khi dùng làm nền bao quanh nội dung khác) */}
      {showCenter && (
        <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-xl sm:h-24 sm:w-24">
          <span className="text-center font-display text-xs font-bold leading-tight text-ocean-700 sm:text-sm">
            320+<br />tuyến tour
          </span>
        </div>
      )}
    </div>
  );
}