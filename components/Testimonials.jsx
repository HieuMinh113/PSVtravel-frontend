"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight, Images } from "lucide-react";
import SectionReveal from "./SectionReveal";

// Data mẫu — chỉ dùng làm fallback khi backend chưa có đánh giá nào được duyệt
const fallbackTestimonials = [
  {
    name: "Nguyễn Thu Hà",
    trip: "Tour Phú Quốc 3N2Đ",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    photo: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop",
    quote: "Lịch trình hợp lý, hướng dẫn viên nhiệt tình, cả nhà mình đi 6 người ai cũng hài lòng. Chắc chắn sẽ đặt tour tiếp theo tại đây.",
    rating: 5,
  },
  {
    name: "Trần Minh Khoa",
    trip: "Tour Nhật Bản 5N5Đ",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    photo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    quote: "Dịch vụ chuyên nghiệp từ khâu tư vấn visa đến khi kết thúc chuyến đi. Khách sạn đúng như cam kết, không phát sinh chi phí.",
    rating: 5,
  },
  {
    name: "Lê Thị Bích",
    trip: "Tour Sa Pa 4N3Đ",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    photo: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop",
    quote: "Giá tốt so với thị trường mà chất lượng vượt mong đợi. Đội ngũ chăm sóc khách hàng phản hồi rất nhanh.",
    rating: 5,
  },
  {
    name: "Phạm Đức Anh",
    trip: "Tour Hàn Quốc 4N4Đ",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    photo: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop",
    quote: "Đây là lần thứ 3 mình đặt tour ở PSVTravel. Luôn yên tâm về chất lượng và sự minh bạch trong giá cả.",
    rating: 4,
  },
  {
    name: "Võ Ngọc Lan",
    trip: "Tour Đà Nẵng - Hội An 5N4Đ",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    photo: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop",
    quote: "Ảnh chụp đẹp như concept, hướng dẫn viên chụp hình cực có tâm. Đồ ăn trong tour cũng rất ngon và hợp khẩu vị.",
    rating: 5,
  },
];

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
        <p className="mt-2 flex-1 text-sm leading-relaxed text-deep-800/80">&ldquo;{t.quote}&rdquo;</p>
        <div className="mt-4 border-t border-ocean-100 pt-3">
          <p className="text-sm font-semibold text-deep-900">{t.name}</p>
          {t.trip && <p className="text-xs text-deep-800/50">{t.trip}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ reviews = [] }) {
  // Ưu tiên đánh giá thật từ API; nếu chưa có thì dùng data mẫu để không trống
  const list = reviews.length ? reviews : fallbackTestimonials;
  const loop = [...list, ...list];

  return (
    <section className="overflow-hidden bg-ocean-50/60 py-20">
      <SectionReveal className="mx-auto max-w-3xl px-5 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-500">Khách hàng nói gì</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
          Hơn <span className="text-gradient-ocean">18.000 hành trình</span> đã được viết nên
        </h2>
        <p className="mt-3 text-deep-800/60">
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
