"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Wallet, Headset, Plane } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

// Data mẫu — chỉ dùng làm fallback khi DB chưa có
const fallbackAirlines = [
  { name: "Vietnam Airlines", logo: "VN", color: "bg-amber-500" },
  { name: "Vietjet Air", logo: "VJ", color: "bg-rose-500" },
  { name: "Bamboo Airways", logo: "QH", color: "bg-emerald-600" },
  { name: "Korean Air", logo: "KE", color: "bg-sky-600" },
  { name: "China Southern", logo: "CZ", color: "bg-indigo-600" },
  { name: "AirAsia", logo: "AK", color: "bg-red-600" },
];

const fallbackDeals = [
  { route: "TP.HCM → Phú Quốc", price: "590.000đ", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop" },
  { route: "Hà Nội → Đà Nẵng", price: "690.000đ", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop" },
  { route: "TP.HCM → Bangkok", price: "1.290.000đ", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop" },
  { route: "TP.HCM → Seoul", price: "4.590.000đ", image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop" },
];

const perks = [
  { icon: Wallet, title: "Giá vé cạnh tranh", desc: "So sánh giá từ 20+ hãng hàng không trong một lần tìm kiếm." },
  { icon: BadgeCheck, title: "Xuất vé tức thì", desc: "Nhận email xác nhận và mã đặt chỗ ngay sau khi thanh toán." },
  { icon: Headset, title: "Hỗ trợ đổi/huỷ vé", desc: "Đội ngũ chăm sóc khách hàng hỗ trợ xử lý phát sinh 24/7." },
];

export default function Flights({ airlines: apiAirlines = [], deals: apiDeals = [] }) {
  const airlines = apiAirlines.length ? apiAirlines : fallbackAirlines;
  const deals = apiDeals.length ? apiDeals : fallbackDeals;

  return (
    <div>
      <PageHero
        eyebrow="Vé máy bay"
        title="Săn vé máy bay giá tốt mỗi ngày"
        description="Tìm và so sánh vé máy bay nội địa, quốc tế từ các hãng hàng không uy tín, đặt vé chỉ trong 2 phút."
        crumbs={[{ label: "Vé máy bay" }]}
      />

      {/* Ưu đãi vé hot */}
      <section className="bg-foam pb-16 pt-14 sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-500">Ưu đãi hôm nay</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">Vé máy bay giá hời</h2>
          </SectionReveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((d, i) => (
              <motion.div
                key={d.id ?? d.route}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="card-surface overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  {d.image ? (
                    <>
                      <Image src={d.image} alt={d.route} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-950/60 to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ocean-500 to-teal-500">
                      {d.airlineLogo ? (
                        <img src={d.airlineLogo} alt={d.airlineName || d.route} className="max-h-10 max-w-[60%] object-contain" />
                      ) : (
                        <Plane className="h-8 w-8 text-white/90" />
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-deep-900">{d.route}</p>
                  {d.airlineName && <p className="text-xs text-ink-subtle">{d.airlineName}</p>}
                  <p className="mt-1 text-xs text-ink-subtle">Giá chỉ từ</p>
                  <div className="flex items-baseline gap-2">
                    {d.oldPrice && <span className="text-xs text-ink-subtle line-through">{d.oldPrice}</span>}
                    <p className="font-display text-lg font-bold text-ocean-700">{d.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hãng hàng không đối tác */}
      <section className="bg-ocean-50/50 py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-subtle">
            Đối tác hàng không
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {airlines.map((a) => (
              <div key={a.code ?? a.name} className="flex flex-col items-center gap-2">
                {a.logoImage ? (
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white p-2 shadow ring-1 ring-ocean-100">
                    <img src={a.logoImage} alt={a.name} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl ${a.color || "bg-ocean-500"} font-display text-sm font-bold text-white shadow`}>
                    {a.logo || a.code}
                  </div>
                )}
                <span className="text-center text-xs text-ink-muted">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lợi ích */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {perks.map((p, i) => (
              <SectionReveal key={p.title} delay={i * 0.1} className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ocean-50">
                  <p.icon className="h-6 w-6 text-ocean-600" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-deep-900">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{p.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
