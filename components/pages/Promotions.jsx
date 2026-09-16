"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Tag, ArrowRight, Clock, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { formatVND } from "@/app/lib/seo";

function ngayVietNam(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function Promotions({ items = [] }) {
  return (
    <div>
      <PageHero
        eyebrow="Ưu đãi PSV Travel"
        title="Khuyến mãi & Ưu đãi mới nhất"
        description="Tổng hợp các chương trình giảm giá tour, vé máy bay và dịch vụ visa đang áp dụng. Số lượng có hạn — đặt sớm để giữ mức giá tốt nhất."
        crumbs={[{ label: "Khuyến mãi" }]}
      />

      <section className="bg-foam py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {items.length === 0 ? (
            <SectionReveal className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-card backdrop-blur">
              <Tag className="mx-auto h-10 w-10 text-ocean-300" />
              <p className="mt-4 text-ink-muted">
                Hiện chưa có chương trình khuyến mãi nào. Vui lòng quay lại sau nhé!
              </p>
              <Link href="/tour-trong-nuoc" className="btn-cta mt-6 !px-6 !py-3 text-sm">
                Xem tất cả tour <ArrowRight className="h-4 w-4" />
              </Link>
            </SectionReveal>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => {
                const inner = (
                  <>
                    <div className="relative aspect-[16/10] overflow-hidden bg-deep-900">
                      {p.image ? (
                        <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-deep-gradient" />
                      )}
                      {p.discount_label && (
                        <span className="absolute left-3 top-3 rounded-full bg-sunset-600 px-3 py-1 text-sm font-bold text-white shadow">
                          {p.discount_label}
                        </span>
                      )}
                      {p.badge && (
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-sunset-700 backdrop-blur">
                          <Sparkles className="h-3 w-3" /> {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg font-bold text-deep-900">{p.title}</h3>
                      {p.description && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{p.description}</p>}
                      <div className="mt-auto pt-4">
                        {(p.price || p.old_price) && (
                          <div className="flex flex-wrap items-baseline gap-2">
                            {p.old_price && <span className="text-sm text-ink-subtle line-through">{formatVND(p.old_price)}</span>}
                            {p.price ? <span className="font-display text-xl font-bold text-sunset-700">{formatVND(p.price)}</span> : null}
                          </div>
                        )}
                        {p.ends_at && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ocean-700">
                            <Clock className="h-3.5 w-3.5" /> Đến hết {ngayVietNam(p.ends_at)}
                          </p>
                        )}
                        {p.link_url && (
                          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 transition-colors group-hover:text-ocean-800">
                            Xem chi tiết <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                );

                const cls = "group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ocean-100 transition-shadow hover:shadow-deep";

                return (
                  <motion.div
                    key={p.id ?? i}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {p.link_url ? (
                      <Link href={p.link_url} className={cls}>{inner}</Link>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
