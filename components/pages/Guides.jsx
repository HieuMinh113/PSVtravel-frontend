"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Eye, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

export default function Guides({ guides: apiGuides = [] }) {
  // Chỉ hiện bài viết thật từ admin. Trước đây DB trống thì đổ ra 6 bài mẫu
  // với ảnh Unsplash — khách đọc tưởng bài thật, bấm vào lỗi 404, mà một trong
  // số ảnh đó nay đã bị xoá khỏi Unsplash nên trang báo lỗi ảnh.
  const list = apiGuides;
  const categories = ["Tất cả", ...Array.from(new Set(list.map((g) => g.category).filter(Boolean)))];

  const [category, setCategory] = useState("Tất cả");
  const filtered = category === "Tất cả" ? list : list.filter((g) => g.category === category);

  // Bài đầu danh sách được trình bày lớn hơn — tạo nhịp điệu thị giác,
  // tránh cảm giác lưới thẻ đều tăm tắp gây nhàm mắt.
  const baiNoiBat = filtered[0];
  const baiConLai = filtered.slice(1);

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
            {categories.map((c) => {
              const dangChon = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={dangChon}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-enter ${
                    dangChon
                      ? "bg-ocean-600 text-white shadow-[0_4px_14px_-4px_rgba(1,105,169,0.6)]"
                      : "bg-ocean-50 text-ocean-700 hover:bg-ocean-100"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </SectionReveal>

          <p className="mt-6 text-center text-sm text-ink-muted">
            <strong className="font-semibold text-ocean-700">{filtered.length}</strong> bài viết
            {category !== "Tất cả" && <> trong mục <strong className="font-semibold text-ink">{category}</strong></>}
          </p>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-ocean-200 bg-white py-20 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ocean-50">
                <BookOpen className="h-8 w-8 text-ocean-300" />
              </div>
              <p className="mt-5 font-display text-xl font-semibold text-deep-900">Chưa có bài viết trong mục này</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                Hãy quay lại sau, hoặc xem các bài viết khác trong cẩm nang.
              </p>
              <button onClick={() => setCategory("Tất cả")} className="btn-cta mt-7 !px-6 !py-3 text-sm">
                Xem tất cả bài viết
              </button>
            </div>
          ) : (
            <>
              {/* ===== BÀI NỔI BẬT — ảnh lớn nằm ngang ===== */}
              {baiNoiBat && (
                <SectionReveal className="mt-10">
                  <motion.article whileHover={{ y: -6 }} className="card-surface group overflow-hidden">
                    <Link href={`/cam-nang/${baiNoiBat.slug}`} className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="relative h-60 overflow-hidden lg:h-full lg:min-h-[320px]">
                        {baiNoiBat.image ? (
                          <Image
                            src={baiNoiBat.image}
                            alt={baiNoiBat.title}
                            fill
                            quality={90}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-enter group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-ocean-200 to-teal-200" />
                        )}
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-sunset-600 px-3 py-1 text-xs font-bold text-white shadow">
                          <Sparkles className="h-3.5 w-3.5" /> Mới nhất
                        </span>
                      </div>

                      <div className="flex flex-col justify-center p-6 sm:p-8">
                        {baiNoiBat.category && (
                          <span className="mb-3 self-start rounded-full bg-ocean-50 px-3 py-1 text-xs font-semibold text-ocean-700">
                            {baiNoiBat.category}
                          </span>
                        )}
                        <h2 className="font-display text-2xl font-bold leading-snug text-deep-900 transition-colors group-hover:text-ocean-700 sm:text-3xl">
                          {baiNoiBat.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-ink-muted">{baiNoiBat.excerpt}</p>

                        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-ink-subtle">
                          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {baiNoiBat.date}</span>
                          <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {baiNoiBat.readTime || `${baiNoiBat.views ?? 0} lượt xem`}</span>
                        </div>

                        <span className="mt-6 flex items-center gap-1.5 font-semibold text-sunset-700">
                          Đọc bài viết
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-enter group-hover:translate-x-1.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                </SectionReveal>
              )}

              {/* ===== CÁC BÀI CÒN LẠI ===== */}
              {baiConLai.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {baiConLai.map((g, i) => (
                    <motion.article
                      key={g.slug}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -6 }}
                      className="card-surface group flex flex-col overflow-hidden"
                    >
                      <Link href={`/cam-nang/${g.slug}`} className="flex flex-1 flex-col">
                        <div className="relative h-48 overflow-hidden">
                          {g.image ? (
                            <Image src={g.image} alt={g.title} fill sizes="(max-width: 640px) 100vw, 33vw" quality={90} className="object-cover transition-transform duration-700 ease-enter group-hover:scale-110" />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-ocean-100 to-teal-100" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-950/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          {g.category && (
                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ocean-700 shadow-sm backdrop-blur">
                              {g.category}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-deep-900 transition-colors group-hover:text-ocean-700">
                            {g.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-muted">{g.excerpt}</p>
                          <div className="mt-4 flex items-center justify-between border-t border-ocean-50 pt-3 text-xs text-ink-subtle">
                            <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {g.date}</span>
                            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {g.readTime || `${g.views ?? 0} lượt xem`}</span>
                          </div>
                          <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-sunset-700">
                            Đọc tiếp <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-enter group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
