"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { duocToiUu } from "@/app/lib/anh";

// 9 ảnh = ảnh đầu (chiếm 2×2) + 8 ảnh nhỏ: lấp kín lưới 4 cột trên máy tính, 2 cột trên điện thoại
const HIEN_DAU = 9;

// Thư viện ảnh các đoàn PSV đã tổ chức (Admin → Trang Team Building →
// Khoảnh khắc thật). Lưới khảm: ảnh đầu to gấp đôi; bấm ảnh mở xem lớn,
// chuyển bằng mũi tên / phím ← →, Esc để đóng.
export default function ThuVienKhoanhKhac({ anh = [] }) {
  const [dangXem, setDangXem] = useState(null);
  const [hetAnh, setHetAnh] = useState(false);
  const ds = hetAnh ? anh : anh.slice(0, HIEN_DAU);

  const doi = useCallback((buoc) => setDangXem((i) => (i === null ? i : (i + buoc + anh.length) % anh.length)), [anh.length]);

  useEffect(() => {
    if (dangXem === null) return;
    const phim = (e) => {
      if (e.key === "Escape") setDangXem(null);
      if (e.key === "ArrowRight") doi(1);
      if (e.key === "ArrowLeft") doi(-1);
    };
    const cuon = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", phim);
    return () => {
      window.removeEventListener("keydown", phim);
      document.body.style.overflow = cuon;
    };
  }, [dangXem, doi]);

  if (!anh.length) return null;

  return (
    <>
      <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] md:grid-cols-4">
        {ds.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setDangXem(i)}
            aria-label={`Xem ảnh ${i + 1}`}
            className={`group relative overflow-hidden rounded-2xl bg-ocean-50 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
          >
            <Image
              src={src}
              alt={`Khoảnh khắc team building cùng PSV Travel ${i + 1}`}
              fill
              sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              unoptimized={!duocToiUu(src)}
              className="object-cover transition-transform duration-700 ease-enter group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {anh.length > HIEN_DAU && !hetAnh && (
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setHetAnh(true)} className="btn-cta !px-7 !py-3 text-sm">
            <Images className="h-4 w-4" aria-hidden="true" /> Xem tất cả {anh.length} ảnh
          </button>
        </div>
      )}

      <AnimatePresence>
        {dangXem !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh lớn"
            className="fixed inset-0 z-[120] flex items-center justify-center bg-deep-950/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDangXem(null)}
          >
            <div className="relative h-[78vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image
                src={anh[dangXem]}
                alt={`Khoảnh khắc team building cùng PSV Travel ${dangXem + 1}`}
                fill
                sizes="100vw"
                unoptimized={!duocToiUu(anh[dangXem])}
                className="object-contain"
              />
            </div>
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {dangXem + 1} / {anh.length}
            </p>
            <button type="button" onClick={() => setDangXem(null)} aria-label="Đóng" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
              <X className="h-5 w-5" />
            </button>
            {anh.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); doi(-1); }} aria-label="Ảnh trước" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); doi(1); }} aria-label="Ảnh sau" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
