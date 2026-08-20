"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import OrbitGallery from "./OrbitGallery";

// Banner dùng chung cho các trang con — nền gradient xanh biển pha xanh ngọc,
// không dùng ảnh chụp tĩnh và không dùng hình sóng, chỉ dùng ánh sáng + hoạ tiết chấm.
// Nếu truyền `orbitImages`, banner sẽ có thêm vòng ảnh xoay bao quanh khối chữ —
// dùng đúng kích thước như Hero trang chủ (radius 430) để đồng bộ toàn site.
export default function PageHero({ eyebrow, title, description, crumbs = [], orbitImages }) {
  const hasOrbit = orbitImages && orbitImages.length > 0;

  return (
    <section
      className={`relative overflow-hidden bg-deep-gradient px-5 sm:px-8 ${
        hasOrbit
          ? "flex min-h-[100dvh] flex-col items-center justify-center py-28"
          : "pb-20 pt-32 sm:pt-40"
      }`}
    >
      {/* Nền Aurora: mesh gradient nhiều điểm dừng trôi rất chậm, có cả sắc ấm —
          cho chiều sâu thay vì một mảng xanh phẳng. Chỉ đổi background-position
          nên không gây reflow. */}
      <div className="absolute inset-0 bg-aurora-deep bg-[length:190%_190%] animate-aurora opacity-80" />
      <div className="absolute inset-0 bg-duotone-glow opacity-70" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {hasOrbit ? (
        <>
          {/* Vòng ảnh xoay bao quanh khối chữ — cùng kích thước với Hero trang chủ */}
          <div className="orbit-layer pointer-events-none absolute inset-0 flex items-center justify-center">
            <OrbitGallery
              images={orbitImages}
              radiusLg={470}
              radiusMd={330}
              radiusSm={172}
              cardSizeLg={96}
              cardSizeMd={68}
              cardSizeSm={54}
              showCenter={false}
            />
          </div>
          {/* Lớp phủ tối giữa vòng ảnh và chữ — giữ chữ luôn đọc rõ */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 620px 480px at center, rgba(4,15,31,0.8) 0%, rgba(4,15,31,0.55) 45%, rgba(4,15,31,0.15) 68%, transparent 80%)",
            }}
          />
        </>
      ) : (
        <>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-ocean-400/35 blur-[110px]"
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="pointer-events-none absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-teal-400/15 blur-[90px]"
          />
          {/* Quầng ấm nhỏ ở góc — điểm bổ túc cho dải xanh, tránh nền một tông */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
            className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-sunset-500/12 blur-[100px]"
          />
        </>
      )}

      <div className={`relative z-10 mx-auto text-center ${hasOrbit ? "max-w-3xl" : "max-w-5xl"}`}>
        {crumbs.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/80">
            <Link href="/" className="transition-colors hover:text-gold-300">Trang chủ</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-white/50" />
                {c.to ? (
                  <Link href={c.to} className="transition-colors hover:text-gold-300">{c.label}</Link>
                ) : (
                  <span className="font-medium text-white">{c.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-4 font-display font-bold leading-[1.12] text-white ${
            hasOrbit ? "text-4xl sm:text-6xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {title}
        </motion.h1>

        {/* Gạch nhấn ngắn dưới tiêu đề — chốt lại khối chữ, đồng thời đưa
            màu thương hiệu vào đúng tâm điểm thị giác */}
        <motion.span
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 block h-1 w-20 origin-center rounded-full bg-gradient-to-r from-gold-400 via-sunset-500 to-teal-400"
        />

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-white/85"
          >
            {description}
          </motion.p>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-foam" />
    </section>
  );
}
