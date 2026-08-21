"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Wallet, Headset, Plane, ArrowRight, Phone } from "lucide-react";
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

export default function Flights({ airlines: apiAirlines = [], deals: apiDeals = [], settings = {} }) {
  const hotline = settings.hotline || "0907 870 707";
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
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Ưu đãi hôm nay</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">Vé máy bay giá hời</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Giá tham khảo cho một chiều, đã gồm thuế phí. Liên hệ để nhận giá tốt nhất theo ngày bay của bạn.
            </p>
          </SectionReveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((d, i) => (
              <motion.div
                key={d.id ?? d.route}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="card-surface group overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  {d.image ? (
                    <>
                      <Image src={d.image} alt={d.route} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-enter group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-950/70 to-transparent" />
                    </>
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center bg-deep-gradient">
                      <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-70" />
                      {d.airlineLogo ? (
                        <img src={d.airlineLogo} alt={d.airlineName || d.route} className="relative max-h-10 max-w-[60%] object-contain" />
                      ) : (
                        <Plane className="relative h-8 w-8 text-white/90" />
                      )}
                    </div>
                  )}

                  {/* Tên chặng đặt đè lên ảnh — nhường chỗ bên dưới cho giá */}
                  <p className="absolute inset-x-3 bottom-2.5 truncate text-sm font-semibold text-white drop-shadow">
                    {d.route}
                  </p>
                </div>

                <div className="p-4">
                  {d.airlineName && <p className="text-xs text-ink-subtle">{d.airlineName}</p>}
                  <p className="mt-0.5 text-xs text-ink-subtle">Giá chỉ từ</p>
                  <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                    {d.oldPrice && <span className="text-xs text-ink-subtle line-through">{d.oldPrice}</span>}
                    <p className="font-display text-xl font-bold text-sunset-700">{d.price}</p>
                  </div>
                  <a
                    href={`tel:${hotline.replace(/[^0-9+]/g, "")}`}
                    className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full border border-ocean-200 text-xs font-semibold text-ocean-700 transition-colors group-hover:border-sunset-600 group-hover:bg-sunset-600 group-hover:text-white"
                  >
                    <Phone className="h-3.5 w-3.5" /> Đặt vé ngay
                  </a>
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
              <div key={a.code ?? a.name} className="group flex flex-col items-center gap-2">
                {a.logoImage ? (
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white p-2 shadow-card ring-1 ring-ocean-100 transition-transform duration-400 ease-enter group-hover:scale-110">
                    <img src={a.logoImage} alt={a.name} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl ${a.color || "bg-ocean-600"} font-display text-sm font-bold text-white shadow transition-transform duration-400 ease-enter group-hover:scale-110`}>
                    {a.logo || a.code}
                  </div>
                )}
                <span className="text-center text-xs text-ink-subtle">{a.name}</span>
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
              <SectionReveal key={p.title} delay={i * 0.1} className="group rounded-3xl bg-white p-6 text-center shadow-card transition-shadow duration-400 hover:shadow-card-hover">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ocean-50 transition-transform duration-400 ease-enter group-hover:scale-110">
                  <p.icon className="h-6 w-6 text-ocean-600" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-deep-900">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{p.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA cuối */}
      <section className="relative overflow-hidden bg-deep-gradient py-16 text-center text-white">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-75" />
        <div className="relative mx-auto max-w-2xl px-5">
          <Plane className="mx-auto h-10 w-10 text-gold-400 animate-bob" />
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Cần tìm chặng bay khác?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/85">
            Gọi hotline để nhân viên dò giá tốt nhất theo đúng ngày bay và ngân sách của bạn.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="btn-cta">
              <Phone className="h-4 w-4" /> Gọi ngay: {hotline}
            </a>
            <a href="/lien-he" className="btn-ghost">
              Gửi yêu cầu <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
