"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X, ChevronLeft, ChevronRight, Quote, Camera, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { customerPhotos } from "@/data/customerPhotos";

const chuCaiDau = (ten) => (ten || "?").trim().charAt(0).toUpperCase();

export default function Gallery({ photos = [] }) {
  // Ưu tiên ảnh thật từ API; nếu DB chưa có thì dùng data mẫu để trang không trống
  const list = photos.length ? photos : customerPhotos;

  const [activeIndex, setActiveIndex] = useState(null);

  const openAt = (i) => setActiveIndex(i);
  const close = () => setActiveIndex(null);
  const prev = () => setActiveIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setActiveIndex((i) => (i + 1) % list.length);

  const active = activeIndex !== null ? list[activeIndex] : null;

  return (
    <div>
      <PageHero
        eyebrow="Cộng đồng PSVTravel"
        title="Khoảnh khắc từ những chuyến đi thật"
        description="Hình ảnh do chính khách hàng của PSVTravel chụp lại và chia sẻ trong hành trình của mình — chân thực, không dàn dựng."
        crumbs={[{ label: "Khoảnh khắc du khách" }]}
      />

      <section className="bg-foam py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="mb-10 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-card">
              <Camera className="h-4 w-4 text-sunset-600" />
              <strong className="font-display text-base font-bold text-ocean-700">{list.length}</strong>
              khoảnh khắc được du khách chia sẻ
            </span>
            <span className="text-ink-subtle">— chạm vào ảnh để xem đầy đủ</span>
          </SectionReveal>

          {/* Lưới ảnh dạng masonry (columns) */}
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {list.map((p, i) => (
              <motion.button
                key={p.id ?? i}
                type="button"
                onClick={() => openAt(i)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                aria-label={`Xem ảnh của ${p.name}`}
                className="group relative block w-full overflow-hidden rounded-2xl bg-white text-left shadow-card"
              >
                <img
                  src={p.photo}
                  alt={p.caption}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-enter group-hover:scale-105"
                  style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "4/3" }}
                />
                {/* Lớp phủ luôn có nhẹ ở chân ảnh để chữ trắng đọc được, đậm dần khi rê chuột */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-950/60 via-deep-950/5 to-transparent transition-opacity duration-400 group-hover:from-deep-950/85" />

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="line-clamp-2 text-sm text-white opacity-0 transition-all duration-400 ease-enter group-hover:opacity-100">
                    {p.caption}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="h-7 w-7 rounded-full border-2 border-white/80 object-cover" />
                    ) : (
                      <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white/80 bg-gradient-to-br from-ocean-500 to-teal-500 text-[10px] font-bold text-white">
                        {chuCaiDau(p.name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{p.name}</p>
                      {p.trip && <p className="truncate text-xs text-white/75">{p.trip}</p>}
                    </div>
                  </div>
                </div>

                {p.rating ? (
                  <span className="absolute right-3 top-3 flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-1 shadow-sm backdrop-blur">
                    {Array.from({ length: p.rating }).map((_, r) => (
                      <Star key={r} className="h-3 w-3 fill-gold-500 text-gold-500" />
                    ))}
                  </span>
                ) : null}
              </motion.button>
            ))}
          </div>

          <SectionReveal className="relative mt-14 overflow-hidden rounded-3xl bg-deep-gradient p-8 text-center sm:p-10">
            <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-75" />
            <div className="relative">
              <Quote className="mx-auto h-8 w-8 text-gold-400" />
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                Vừa kết thúc chuyến đi cùng PSVTravel?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
                Gửi ảnh và cảm nhận của bạn để cùng xuất hiện trong trang khoảnh khắc du khách nhé!
              </p>
              <a href="mailto:hi@psvtravel.vn" className="btn-cta mt-7 !px-6 !py-3 text-sm">
                Chia sẻ khoảnh khắc của bạn <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Lightbox xem ảnh lớn */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-deep-950/92 p-4 backdrop-blur-sm sm:p-8"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:left-6"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:right-6"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Số thứ tự ảnh — cho biết đang ở đâu trong bộ sưu tập */}
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {activeIndex + 1} / {list.length}
            </span>

            <motion.div
              key={active.id ?? activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-deep sm:grid-cols-[1.3fr_1fr]"
            >
              <div className="max-h-[70dvh] overflow-hidden sm:max-h-[80dvh]">
                <img src={active.photo} alt={active.caption} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  {active.avatar ? (
                    <img src={active.avatar} alt={active.name} className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-ocean-500 to-teal-500 text-sm font-bold text-white">
                      {chuCaiDau(active.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-deep-900">{active.name}</p>
                    <p className="truncate text-xs text-ink-subtle">{active.trip}{active.date ? ` · ${active.date}` : ""}</p>
                  </div>
                </div>
                {active.rating ? (
                  <div className="mt-3 flex gap-0.5">
                    {Array.from({ length: active.rating }).map((_, r) => (
                      <Star key={r} className="h-4 w-4 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                ) : null}
                <Quote className="mt-4 h-6 w-6 text-sunset-300" />
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink">{active.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
