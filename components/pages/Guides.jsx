"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Eye, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { guides as fallbackGuides } from "@/data/guides";

export default function Guides({ guides: apiGuides = [] }) {
  // Ưu tiên bài viết thật từ API; nếu DB trống thì dùng data mẫu
  const list = apiGuides.length ? apiGuides : fallbackGuides;
  const categories = ["Tất cả", ...Array.from(new Set(list.map((g) => g.category).filter(Boolean)))];

  const [category, setCategory] = useState("Tất cả");
  const filtered = category === "Tất cả" ? list : list.filter((g) => g.category === category);

  return (
    <div>
      <PageHero
        eyebrow="Cẩm nang du lịch"
        title="Kinh nghiệm & mẹo hay cho mỗi hành trình"
        description="Tổng hợp cẩm nang, mẹo vặt, ẩm thực và kinh nghiệm visa được chọn lọc từ đội ngũ hướng dẫn viên giàu kinh nghiệm."
        crumbs={[{ label: "Cẩm nang" }]}
      />

      <section className="bg-foam py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  category === c ? "bg-ocean-500 text-white" : "bg-ocean-50 text-ocean-700 hover:bg-ocean-100"
                }`}
              >
                {c}
              </button>
            ))}
          </SectionReveal>

          {filtered.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-ocean-200 bg-white py-16 text-center text-sm text-ink-muted">
              Chưa có bài viết trong mục này.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g, i) => (
                <motion.article
                  key={g.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="card-surface group flex flex-col overflow-hidden"
                >
                  <Link href={`/cam-nang/${g.slug}`} className="flex flex-1 flex-col">
                    <div className="relative h-48 overflow-hidden">
                      {g.image ? (
                        <Image src={g.image} alt={g.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-ocean-100 to-teal-100" />
                      )}
                      {g.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ocean-700 shadow">
                          {g.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg font-semibold leading-snug text-deep-900 transition-colors group-hover:text-ocean-600">
                        {g.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-muted">{g.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-ocean-100 pt-3 text-xs text-ink-subtle">
                        <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {g.date}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {g.readTime || `${g.views ?? 0} lượt xem`}</span>
                      </div>
                      <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-ocean-600">
                        Đọc tiếp <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
