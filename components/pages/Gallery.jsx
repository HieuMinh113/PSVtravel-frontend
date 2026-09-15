"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Star, X, ChevronLeft, ChevronRight, Quote, Camera, ArrowRight, Images, ShieldCheck, MapPin,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

const chuCaiDau = (ten) => (ten || "?").trim().charAt(0).toUpperCase();

// Bố cục bento kiểu tạp chí: một vài ô lớn xen ô nhỏ cho nhịp thị giác, ô nào
// cũng crop gọn (object-cover) nên ảnh dọc/ngang đều đẹp. Chỉ áp span từ sm trở
// lên — trên điện thoại giữ lưới 2 cột đều để không rối.
function bentoSpan(i) {
  const m = i % 8;
  if (m === 0) return "sm:col-span-2 sm:row-span-2"; // ô nổi bật
  if (m === 3) return "sm:row-span-2"; // ô cao
  if (m === 5) return "lg:col-span-2"; // ô rộng
  return "";
}

export default function Gallery({ photos = [], settings = {} }) {
  const email = settings.email || "hi@psvtravel.com";
  // Chỉ hiện ảnh thật khách gửi. Ảnh mẫu kèm lời khen do máy tự dựng là chứng
  // thực giả — trang này nói "chân thực, không dàn dựng" nên càng không được có.
  const list = photos;
  const soAnh = list.reduce((t, p) => t + (p.photos?.length || 1), 0);

  const [activeIndex, setActiveIndex] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0); // ảnh đang xem trong khoảnh khắc

  const openAt = (i) => { setActiveIndex(i); setPhotoIndex(0); };
  const close = () => setActiveIndex(null);
  const prev = () => { setActiveIndex((i) => (i - 1 + list.length) % list.length); setPhotoIndex(0); };
  const next = () => { setActiveIndex((i) => (i + 1) % list.length); setPhotoIndex(0); };

  const active = activeIndex !== null ? list[activeIndex] : null;
  const activePhotos = active ? (active.photos?.length ? active.photos : [active.photo]) : [];
  const activePhoto = activePhotos[photoIndex] ?? active?.photo;

  return (
    <div>
      <PageHero
        eyebrow="Cộng đồng PSVTravel"
        title="Khoảnh khắc từ những chuyến đi thật"
        description="Hình ảnh do chính khách hàng của PSVTravel chụp lại và chia sẻ trong hành trình của mình — chân thực, không dàn dựng."
        crumbs={[{ label: "Khoảnh khắc du khách" }]}
      />

      <section className="relative overflow-hidden bg-foam py-14 sm:py-20">
        {/* Nền mesh rất nhạt cho chiều sâu — chỉ đổi vị trí nên không gây reflow */}
        <div className="pointer-events-none absolute inset-0 bg-duotone-glow opacity-60" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {/* Dải thống kê — chip kính mờ, chứng minh xã hội */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm text-ink-muted shadow-card backdrop-blur">
              <Camera className="h-4 w-4 text-ocean-600" />
              <strong className="font-display text-base font-bold text-ocean-700">{list.length}</strong>
              khoảnh khắc
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm text-ink-muted shadow-card backdrop-blur">
              <Images className="h-4 w-4 text-teal-600" />
              <strong className="font-display text-base font-bold text-teal-700">{soAnh}</strong>
              tấm ảnh
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm text-ink-muted shadow-card backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-sunset-600" />
              100% ảnh thật từ khách
            </span>
          </div>

          {list.length === 0 ? (
            <SectionReveal className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-card backdrop-blur">
              <Camera className="mx-auto h-10 w-10 text-ocean-300" />
              <p className="mt-4 text-ink-muted">
                Chưa có khoảnh khắc nào được chia sẻ. Hãy là người đầu tiên gửi ảnh chuyến đi của bạn!
              </p>
            </SectionReveal>
          ) : (
            /* Lưới bento */
            <div className="grid auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {list.map((p, i) => (
                <motion.button
                  key={p.id ?? i}
                  type="button"
                  onClick={() => openAt(i)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  aria-label={`Xem ảnh của ${p.name || "khách hàng"}`}
                  className={`group relative overflow-hidden rounded-2xl bg-deep-900 text-left shadow-card outline-none focus-visible:ring-4 focus-visible:ring-ocean-400/50 ${bentoSpan(i)}`}
                >
                  <img
                    src={p.photo}
                    alt={p.caption || `Khoảnh khắc của ${p.name || "khách hàng"}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                  {/* Lớp phủ đáy để chữ trắng luôn đọc được, đậm dần khi rê chuột */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-950/75 via-deep-950/10 to-transparent transition-opacity duration-500 group-hover:from-deep-950/90" />

                  {/* Huy hiệu số ảnh — mẫu "+n" */}
                  {p.photos && p.photos.length > 1 ? (
                    <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full border border-white/20 bg-deep-950/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                      <Images className="h-3.5 w-3.5" aria-hidden="true" />
                      {p.photos.length}
                    </span>
                  ) : null}

                  {p.rating ? (
                    <span className="absolute right-2.5 top-2.5 flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-1 shadow-sm backdrop-blur">
                      {Array.from({ length: p.rating }).map((_, r) => (
                        <Star key={r} className="h-3 w-3 fill-gold-500 text-gold-500" aria-hidden="true" />
                      ))}
                    </span>
                  ) : null}

                  {/* Chân ảnh: chú thích hiện khi hover + tên khách luôn thấy */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    {p.caption && (
                      <p className="mb-2 line-clamp-2 max-h-0 text-sm leading-snug text-white opacity-0 transition-all duration-500 ease-out group-hover:max-h-20 group-hover:opacity-100">
                        {p.caption}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      {p.avatar ? (
                        <img src={p.avatar} alt="" className="h-7 w-7 rounded-full border-2 border-white/80 object-cover" />
                      ) : (
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-white/80 bg-gradient-to-br from-ocean-500 to-teal-500 text-[10px] font-bold text-white">
                          {chuCaiDau(p.name)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">{p.name || "Khách hàng PSV"}</p>
                        {p.trip && (
                          <p className="flex items-center gap-1 truncate text-[11px] text-white/75">
                            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">{p.trip}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Kêu gọi gửi ảnh */}
          <SectionReveal className="relative mt-14 overflow-hidden rounded-3xl bg-deep-gradient p-8 text-center sm:p-10">
            <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-75" />
            <div className="relative">
              <Quote className="mx-auto h-8 w-8 text-gold-400" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                Vừa kết thúc chuyến đi cùng PSVTravel?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
                Gửi ảnh và cảm nhận của bạn để cùng xuất hiện trong trang khoảnh khắc du khách nhé!
              </p>
              <a href={`mailto:${email}`} className="btn-cta mt-7 !px-6 !py-3 text-sm">
                Chia sẻ khoảnh khắc của bạn <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>

            {list.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/40 sm:left-6"
                  aria-label="Khoảnh khắc trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/40 sm:right-6"
                  aria-label="Khoảnh khắc sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Số thứ tự khoảnh khắc trong bộ sưu tập */}
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
              className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-deep sm:grid-cols-[1.35fr_1fr]"
            >
              <div className="relative max-h-[50dvh] overflow-hidden bg-deep-950 sm:max-h-[82dvh]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={activePhoto}
                    alt={active.caption || "Khoảnh khắc cùng PSV Travel"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                {activePhotos.length > 1 ? (
                  <span className="absolute left-3 top-3 rounded-full bg-deep-950/65 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {photoIndex + 1}/{activePhotos.length}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  {active.avatar ? (
                    <img src={active.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-ocean-500 to-teal-500 text-sm font-bold text-white">
                      {chuCaiDau(active.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-deep-900">{active.name || "Khách hàng PSV"}</p>
                    {active.trip && (
                      <p className="flex items-center gap-1 truncate text-xs text-ink-subtle">
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {active.trip}{active.date ? ` · ${active.date}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {active.rating ? (
                  <div className="mt-3 flex gap-0.5">
                    {Array.from({ length: active.rating }).map((_, r) => (
                      <Star key={r} className="h-4 w-4 fill-gold-500 text-gold-500" aria-hidden="true" />
                    ))}
                  </div>
                ) : null}

                {active.caption && (
                  <>
                    <Quote className="mt-4 h-6 w-6 text-sunset-300" aria-hidden="true" />
                    <p className="mt-2 text-sm leading-relaxed text-ink">{active.caption}</p>
                  </>
                )}

                {/* Dải ảnh nhỏ — bấm để đổi ảnh lớn */}
                {activePhotos.length > 1 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activePhotos.map((src, gi) => (
                      <button
                        key={gi}
                        type="button"
                        onClick={() => setPhotoIndex(gi)}
                        aria-label={`Xem ảnh ${gi + 1}`}
                        aria-current={gi === photoIndex}
                        className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 outline-none transition focus-visible:ring-4 focus-visible:ring-ocean-400/50 ${
                          gi === photoIndex ? "border-ocean-500" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="flex-1" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
