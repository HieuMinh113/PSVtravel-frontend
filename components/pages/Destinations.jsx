"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

export default function Destinations({ items = [] }) {
  return (
    <div>
      <PageHero
        eyebrow="Khám phá cùng PSV Travel"
        title="Điểm đến nổi bật"
        description="Mỗi vùng đất là một câu chuyện. Chọn điểm đến bạn yêu thích để xem giới thiệu chi tiết và các tour đang mở."
        crumbs={[{ label: "Điểm đến" }]}
      />

      <section className="bg-foam py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {items.length === 0 ? (
            <SectionReveal className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-card backdrop-blur">
              <Compass className="mx-auto h-10 w-10 text-ocean-300" />
              <p className="mt-4 text-ink-muted">Danh sách điểm đến đang được cập nhật.</p>
            </SectionReveal>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((d, i) => (
                <motion.div
                  key={d.slug ?? i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/diem-den/${d.slug}`}
                    className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl shadow-card"
                  >
                    {d.image ? (
                      <img src={d.image} alt={d.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-deep-gradient" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-950/90 via-deep-950/25 to-transparent" />
                    <div className="relative p-5">
                      {d.region && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-300">
                          <MapPin className="h-3.5 w-3.5" /> {d.region}
                        </span>
                      )}
                      <h3 className="mt-1 font-display text-2xl font-bold text-white">{d.name}</h3>
                      {d.summary && <p className="mt-1.5 line-clamp-2 text-sm text-white/80">{d.summary}</p>}
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                        Khám phá ngay <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
