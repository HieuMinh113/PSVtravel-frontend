"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight, Images } from "lucide-react";
import SectionReveal from "./SectionReveal";

function TestimonialCard({ t }) {
  const initial = (t.name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="card-surface mx-3 flex w-[300px] shrink-0 flex-col overflow-hidden sm:w-[340px]">
      {t.photo && (
        <div className="relative h-40 overflow-hidden">
          <Image src={t.photo} alt={t.trip || t.name} fill sizes="340px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-950/70 via-deep-950/0 to-transparent" />
          <span className="absolute right-3 top-3 flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-1 backdrop-blur">
            {Array.from({ length: t.rating || 0 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-teal-500 text-teal-500" />
            ))}
          </span>
          {t.avatar ? (
            <img
              src={t.avatar}
              alt={t.name}
              className="absolute -bottom-5 left-4 h-12 w-12 rounded-full border-4 border-white object-cover shadow"
            />
          ) : (
            <span className="absolute -bottom-5 left-4 grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-ocean-100 font-display text-sm font-bold text-ocean-700 shadow">
              {initial}
            </span>
          )}
        </div>
      )}

      <div className={`flex flex-1 flex-col p-5 ${t.photo ? "pt-8" : ""}`}>
        {!t.photo && (
          <div className="mb-2 flex gap-0.5">
            {Array.from({ length: t.rating || 0 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
            ))}
          </div>
        )}
        <Quote className="h-5 w-5 text-ocean-200" />
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
        <div className="mt-4 border-t border-ocean-100 pt-3">
          <p className="text-sm font-semibold text-deep-900">{t.name}</p>
          {t.trip && <p className="text-xs text-ink-subtle">{t.trip}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ reviews = [] }) {
  // Chỉ hiện đánh giá thật đã được duyệt trong admin.
  //
  // Trước đây chưa có đánh giá nào thì đổ ra 5 khách ảo kèm ảnh chân dung
  // Unsplash và lời khen do máy viết. Đây là chứng thực giả trên website bán
  // hàng thật — bỏ hẳn, chưa có đánh giá thì ẩn luôn cả khối.
  if (!reviews.length) return null;

  const loop = [...reviews, ...reviews];

  return (
    <section className="overflow-hidden bg-ocean-50/60 py-20">
      <SectionReveal className="mx-auto max-w-3xl px-5 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-500">Khách hàng nói gì</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
          Hơn <span className="text-gradient-ocean">18.000 hành trình</span> đã được viết nên
        </h2>
        <p className="mt-3 text-ink-muted">
          Những trải nghiệm thật từ khách hàng đã đồng hành cùng PSVTravel trên khắp mọi miền.
        </p>
      </SectionReveal>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ocean-50/60 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ocean-50/60 to-transparent sm:w-32" />
        <motion.div
          className="flex w-max py-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </motion.div>
      </div>

      <SectionReveal className="mt-12 flex justify-center">
        <Link
          href="/khoanh-khac-du-khach"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-ocean-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          <Images className="h-4 w-4" /> Xem thêm khoảnh khắc từ du khách <ArrowRight className="h-4 w-4" />
        </Link>
      </SectionReveal>
    </section>
  );
}
