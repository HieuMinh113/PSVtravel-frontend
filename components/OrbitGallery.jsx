"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useTime, useTransform } from "framer-motion";

/**
 * Vòng ảnh chạy quanh khối nội dung ở đầu trang — điểm nhấn thương hiệu.
 *
 * Quỹ đạo là hình BẦU DỤC: trục ngang bám bề rộng màn hình để ôm trọn khối
 * chữ và ô tìm kiếm, trục dọc bám chiều cao để ảnh trên/dưới không bị cắt.
 *
 * Từng ảnh tự chạy dọc theo quỹ đạo, KHÔNG xoay cả khung.
 * Xoay cả khung là cách viết cũ và nó sai về hình học: phép xoay đưa mỗi điểm
 * đi theo đường TRÒN bán kính bằng khoảng cách của nó tới tâm — ảnh nằm ở mép
 * ngang (cách tâm 560px) sau một phần tư vòng sẽ nhảy lên cao 560px, vượt khỏi
 * khung nhìn và bị cắt mất. Chỉ đúng khi quỹ đạo là hình tròn.
 */
function AnhTrenQuyDao({ src, gocBanDau, radiusX, radiusY, cardSize, duration, dungYen }) {
  const time = useTime();

  const goc = useTransform(time, (t) =>
    dungYen ? gocBanDau : gocBanDau + (t / (duration * 1000)) * 360
  );

  const x = useTransform(goc, (g) => Math.cos((g * Math.PI) / 180) * radiusX);
  const y = useTransform(goc, (g) => Math.sin((g * Math.PI) / 180) * radiusY);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/80"
      style={{
        x,
        y,
        width: cardSize,
        height: cardSize,
        marginLeft: -cardSize / 2,
        marginTop: -cardSize / 2,
      }}
    >
      <Image src={src} alt="" draggable={false} fill sizes="200px" className="object-cover" />
    </motion.div>
  );
}

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
  const giamChuyenDong = useReducedMotion();

  const [{ radiusX, radiusY, cardSize }, setDims] = useState({
    radiusX: radiusLg,
    radiusY: Math.round(radiusLg * 0.72),
    cardSize: cardSizeLg,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // iPad dọc (768–1023px) dùng cỡ vừa, không dùng cỡ desktop — bán kính
      // desktop lớn hơn nửa màn hình nên ảnh hai bên văng hết ra ngoài.
      let radius, cardSize;
      if (w < 480) [radius, cardSize] = [radiusSm, cardSizeSm];
      else if (w < 1024) [radius, cardSize] = [radiusMd, cardSizeMd];
      else [radius, cardSize] = [radiusLg, cardSizeLg];

      // Trừ hao 96px chiều cao cho thanh điều hướng cố định phía trên
      const tranNgang = Math.floor(w / 2 - cardSize / 2 - 12);
      const tranDoc = Math.floor((h - 96) / 2 - cardSize / 2 - 12);

      setDims({
        radiusX: Math.max(Math.min(radius, tranNgang), 84),
        radiusY: Math.max(Math.min(Math.round(radius * 0.72), tranDoc), 70),
        cardSize,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  const angleStep = 360 / images.length;

  return (
    <div
      className="relative mx-auto"
      style={{
        width: radiusX * 2 + cardSize,
        height: radiusY * 2 + cardSize,
        maxWidth: "100%",
      }}
    >
      {/* Đường dẫn hướng mờ phía sau, cho thấy quỹ đạo */}
      {showRing && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-white/25"
          style={{ width: radiusX * 2, height: radiusY * 2 }}
        />
      )}

      {images.map((src, i) => (
        <AnhTrenQuyDao
          key={src + i}
          src={src}
          gocBanDau={angleStep * i}
          radiusX={radiusX}
          radiusY={radiusY}
          cardSize={cardSize}
          duration={duration}
          dungYen={Boolean(giamChuyenDong)}
        />
      ))}

      {/* Tâm vòng — tắt khi dùng làm nền bao quanh nội dung khác */}
      {showCenter && (
        <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-xl sm:h-24 sm:w-24">
          <span className="text-center font-display text-xs font-bold leading-tight text-ocean-700 sm:text-sm">
            PSV
            <br />
            Travel
          </span>
        </div>
      )}
    </div>
  );
}
