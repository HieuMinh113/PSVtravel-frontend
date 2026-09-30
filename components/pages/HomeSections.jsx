"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck, Clock3, HeartHandshake, BadgePercent, ArrowRight,
  Plane, MapPinned, Tag, Newspaper, Handshake, Clock, CalendarDays,
} from "lucide-react";
import TourCard from "@/components/TourCard";
import SectionReveal from "@/components/SectionReveal";
import CountUp from "@/components/CountUp";
import TrustBar from "@/components/TrustBar";
import Newsletter from "@/components/Newsletter";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { formatVND } from "@/data/tours";
import { duocToiUu } from "@/app/lib/anh";

// Các khối BÊN DƯỚI màn hình đầu của trang chủ, tách khỏi Home.jsx để được
// "đánh thức" dần khi khách cuộn tới (xem components/HydrateKhiThay.jsx),
// thay vì đánh thức cả trang một lượt lúc vừa mở — nguyên nhân máy bị đơ gần
// 1 giây trên điện thoại. Nội dung, giao diện giữ nguyên như cũ.

const whyUs = [
  { icon: ShieldCheck, title: "Cam kết minh bạch", desc: "Giá tour trọn gói, không phụ thu ẩn, huỷ/đổi lịch linh hoạt." },
  { icon: BadgePercent, title: "Giá tốt mỗi ngày", desc: "Giá trọn gói minh bạch, so sánh trực tiếp giữa các tuyến để bạn chọn được mức phù hợp." },
  { icon: HeartHandshake, title: "Hỗ trợ 24/7", desc: "Đội ngũ tư vấn viên đồng hành xuyên suốt hành trình của bạn." },
  { icon: Clock3, title: "Xác nhận tức thì", desc: "Đặt chỗ và nhận xác nhận tour chỉ trong vài phút." },
];

// Dải cam kết + banner khuyến mãi + tour sát ngày khởi hành
export function KhoiTourSapKhoiHanh({ promo = null, upcoming = [] }) {
  return (
    <>
      {/* ===== DẢI CAM KẾT — ngay dưới Hero, trả lời câu hỏi "có tin được không" ===== */}
      <TrustBar />

      {/* ===== BANNER KHUYẾN MÃI — chỉ hiện khi admin đã tạo banner ===== */}
      {promo && (
      <section className="bg-foam px-5 pt-10 sm:px-8">
        <SectionReveal className="mx-auto max-w-7xl">
          <div className="group relative overflow-hidden rounded-3xl shadow-deep">
            {/* Qua bộ tối ưu ảnh của Next: banner gốc admin upload có thể là PNG
                vài MB, giờ được đổi sang WebP đúng cỡ màn hình và chỉ tải khi
                khách cuộn gần tới. */}
            <div className="relative h-[260px] w-full sm:h-[300px]">
              <motion.div
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={promo.image}
                  alt={promo.title || "Ưu đãi PSVTravel"}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  unoptimized={!duocToiUu(promo.image)}
                  className="object-cover"
                />
              </motion.div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-deep-950/90 via-deep-950/60 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-6 sm:px-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-deep-950">
                Ưu đãi có hạn
              </span>
              <h2 className="max-w-md font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                {promo.title}
              </h2>
              {promo.subtitle && (
                <p className="max-w-sm text-sm text-white/85">{promo.subtitle}</p>
              )}
              <Link
                href={promo.link || "/tour-nuoc-ngoai"}
                className="btn-cta mt-2 !px-6 !py-3 text-sm"
              >
                Xem ưu đãi ngay <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </SectionReveal>
      </section>
      )}

      {/* ===== TOUR SÁT NGÀY KHỞI HÀNH ===== */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">
                <Clock3 className="h-3.5 w-3.5" /> Sắp khởi hành
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
                Tour sát ngày — <span className="text-gradient-warm">đặt ngay kẻo lỡ</span>
              </h2>
            </div>
            <Link href="/tour-trong-nuoc" className="vung-bam group flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
              Xem tất cả tour
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-enter group-hover:translate-x-1" />
            </Link>
          </SectionReveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((tour, i) => (
              <TourCard
                key={tour.slug}
                tour={tour}
                index={i}
                basePath={tour.type === "domestic" ? "/tour-trong-nuoc" : "/tour-nuoc-ngoai"}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Ưu đãi hôm nay + điểm đến nổi bật
export function KhoiUuDaiDiemDen({ promotions = [], diemDen = [] }) {
  return (
    <>
      {/* ===== ƯU ĐÃI HÔM NAY — do admin thêm trong Khuyến mãi ===== */}
      {promotions.length > 0 && (
        <section className="bg-foam pb-4 pt-6 sm:pb-8">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionReveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">
                  <Tag className="h-3.5 w-3.5" /> Ưu đãi hôm nay
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
                  Đừng bỏ lỡ những <span className="text-gradient-ocean">deal hời</span>
                </h2>
              </div>
              <Link href="/khuyen-mai" className="vung-bam hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800 sm:inline-flex">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Link>
            </SectionReveal>

            {/* Băng chuyền ngang — kéo/lướt để xem thêm */}
            <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {promotions.slice(0, 10).map((p, i) => {
                const inner = (
                  <>
                    <div className="relative aspect-[16/10] overflow-hidden bg-deep-900">
                      {p.image ? (
                        <Image src={p.image} alt={p.title} fill sizes="300px" unoptimized={!duocToiUu(p.image)} className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-deep-gradient" />
                      )}
                      {p.discount_label && (
                        <span className="absolute left-3 top-3 rounded-full bg-sunset-600 px-3 py-1 text-sm font-bold text-white shadow">{p.discount_label}</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-base font-bold text-deep-900 line-clamp-2">{p.title}</h3>
                      <div className="mt-auto pt-3">
                        {(p.price || p.old_price) && (
                          <div className="flex flex-wrap items-baseline gap-2">
                            {p.old_price && <span className="text-xs text-ink-subtle line-through">{formatVND(p.old_price)}</span>}
                            {p.price ? <span className="font-display text-lg font-bold text-sunset-700">{formatVND(p.price)}</span> : null}
                          </div>
                        )}
                        {p.ends_at && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-ocean-700">
                            <Clock className="h-3.5 w-3.5" /> Đến hết {p.ends_at.split("-").reverse().join("/")}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                );
                const cls = "group flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ocean-100 transition-shadow hover:shadow-deep sm:w-[300px]";
                return p.link_url ? (
                  <Link key={p.id ?? i} href={p.link_url} className={cls}>{inner}</Link>
                ) : (
                  <div key={p.id ?? i} className={cls}>{inner}</div>
                );
              })}
            </div>
            <Link href="/khuyen-mai" className="vung-bam mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800 sm:hidden">
              Xem tất cả ưu đãi <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ===== ĐIỂM ĐẾN NỔI BẬT — lấy từ Danh mục tour trong admin ===== */}
      {diemDen.length > 0 && (
      <section className="bg-ocean-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-teal-700">
              <MapPinned className="h-3.5 w-3.5" /> Điểm đến nổi bật
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              Bạn muốn <span className="text-gradient-ocean">khám phá</span> nơi nào?
            </h2>
          </SectionReveal>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {diemDen.map((d, i) => (
              <motion.div
                key={d.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card"
              >
                {/* Bấm vào đi thẳng sang trang danh sách đã lọc theo điểm đến đó */}
                <Link
                  href={`${d.type === "abroad" ? "/tour-nuoc-ngoai" : "/tour-trong-nuoc"}?category=${encodeURIComponent(d.slug)}&scroll=1`}
                  className="absolute inset-0 z-10"
                  aria-label={`Xem tour ${d.name}`}
                />
                {d.image ? (
                  <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-enter group-hover:scale-110" />
                ) : (
                  // Danh mục chưa có ảnh thì để nền thương hiệu, không để ô trắng
                  <div className="h-full w-full bg-deep-gradient" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-950/90 via-deep-950/15 to-transparent" />

                {/* Vạch nhấn màu ấm trượt lên khi rê chuột — tín hiệu "chọn được" */}
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-sunset-500 transition-transform duration-400 ease-enter group-hover:scale-x-100" />

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-display text-sm font-bold text-white sm:text-base">{d.name}</p>
                  <p className="text-xs text-white/80">
                    {d.tourCount > 0 ? `${d.tourCount} tour` : "Sắp có tour"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}
    </>
  );
}

// Vì sao chọn chúng tôi + video giới thiệu + số liệu
export function KhoiViSaoChonVideo({ videoTrangChu = null, tieuDeVideo = null }) {
  return (
    <>
      {/* ===== VÌ SAO CHỌN CHÚNG TÔI ===== */}
      <section className="relative overflow-hidden bg-deep-gradient py-20 text-white">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-60" />
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-ocean-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Vì sao chọn chúng tôi</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Đồng hành đáng tin cậy cho mọi hành trình
            </h2>
          </SectionReveal>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <SectionReveal key={w.title} delay={i * 0.1} className="group text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur transition-all duration-400 ease-enter group-hover:scale-110 group-hover:bg-white/20">
                  <w.icon className="h-6 w-6 text-teal-300" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-white/75">{w.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VIDEO GIỚI THIỆU — admin dán link YouTube trong Cài đặt; trống thì ẩn ===== */}
      {videoTrangChu && (
        <section className="bg-foam pt-16 sm:pt-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <SectionReveal className="mx-auto mb-8 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Video giới thiệu</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
                {tieuDeVideo || "Hành trình cùng PSV Travel"}
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <YouTubeEmbed videoId={videoTrangChu} title={tieuDeVideo || "Video giới thiệu PSV Travel"} />
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ===== SỐ LIỆU ===== */}
      <section className="bg-foam py-14">
        {/* Chỉ ba con số, đều là số liệu công ty cung cấp. Trước đây còn ô
            "98% khách hàng hài lòng" — con số không ai đo được và không có
            nguồn, nên bỏ thay vì bịa tiếp. */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-5 sm:grid-cols-3 sm:px-8">
          {[
            { to: 10000, suffix: "+", label: "Lượt khách mỗi năm" },
            { to: 300, suffix: "+", label: "Tuyến tour trong & ngoài nước" },
            { to: 9, suffix: " năm", label: "Hoạt động trong ngành" },
          ].map((s, i) => (
            <SectionReveal key={s.label} delay={i * 0.08} className="rounded-2xl bg-white px-4 py-6 text-center shadow-card">
              {/* Cỡ chữ co theo bề ngang: ô hai cột trên điện thoại chỉ rộng
                  khoảng 118px, số dài như 18.400+ ở cỡ cứng sẽ tràn ra ngoài. */}
              <p className="font-display text-[clamp(1.35rem,6vw,2.25rem)] font-bold leading-tight text-ocean-700">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 text-xs text-ink-muted sm:text-sm">{s.label}</p>
            </SectionReveal>
          ))}
        </div>
      </section>
    </>
  );
}

// Cẩm nang mới nhất + đối tác & đăng ký nhận ưu đãi + lời mời cuối trang
export function KhoiCuoiTrang({ latestGuides = [], partners = [] }) {
  return (
    <>
      {/* ===== CẨM NANG MỚI NHẤT ===== */}
      {latestGuides.length > 0 && (
        <section className="bg-foam py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionReveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-teal-700">
                  <Newspaper className="h-3.5 w-3.5" /> Cẩm nang du lịch
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
                  Kinh nghiệm cho chuyến đi trọn vẹn
                </h2>
              </div>
              <Link href="/cam-nang" className="vung-bam hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800 sm:inline-flex">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Link>
            </SectionReveal>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestGuides.slice(0, 4).map((g, i) => (
                <motion.div
                  key={g.slug ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/cam-nang/${g.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ocean-100 transition-shadow hover:shadow-deep">
                    <div className="relative aspect-[16/10] overflow-hidden bg-deep-900">
                      {g.image ? (
                        <Image src={g.image} alt={g.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized={!duocToiUu(g.image)} className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-deep-gradient" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      {g.date && (
                        <span className="flex items-center gap-1 text-xs text-ink-subtle">
                          <CalendarDays className="h-3.5 w-3.5" /> {g.date}
                        </span>
                      )}
                      <h3 className="mt-1.5 font-display text-base font-bold text-deep-900 line-clamp-2 transition-colors group-hover:text-ocean-700">{g.title}</h3>
                      {g.excerpt && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{g.excerpt}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== ĐỐI TÁC + ĐĂNG KÝ NHẬN ƯU ĐÃI ===== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {partners.length > 0 && (
            <SectionReveal className="mb-16">
              <p className="flex items-center justify-center gap-1.5 text-center text-xs font-bold uppercase tracking-[0.25em] text-ink-subtle">
                <Handshake className="h-3.5 w-3.5" /> Đối tác đồng hành
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
                {partners.map((pa, i) => {
                  const img = <img src={pa.logo} alt={pa.name} title={pa.name} loading="lazy" className="h-10 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-12" />;
                  return pa.link_url ? (
                    <a key={pa.id ?? i} href={pa.link_url} target="_blank" rel="noopener noreferrer">{img}</a>
                  ) : (
                    <span key={pa.id ?? i}>{img}</span>
                  );
                })}
              </div>
            </SectionReveal>
          )}

          <SectionReveal className="relative overflow-hidden rounded-3xl bg-deep-gradient p-8 text-center sm:p-12">
            <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-75" />
            <div className="relative mx-auto max-w-xl">
              <BadgePercent className="mx-auto h-9 w-9 text-gold-400" />
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Nhận ưu đãi sớm nhất</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
                Đăng ký email để không bỏ lỡ các chương trình khuyến mãi tour, vé máy bay và visa mới nhất.
              </p>
              <div className="mx-auto mt-6 max-w-md">
                <Newsletter source="trang-chu" />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ===== CTA CUỐI TRANG ===== */}
      <section className="relative overflow-hidden bg-deep-gradient py-20">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <SectionReveal>
            <Plane className="mx-auto h-10 w-10 text-gold-400 animate-bob" />
            <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Sẵn sàng cho chuyến đi tiếp theo?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">
              Để lại thông tin, đội ngũ tư vấn viên của chúng tôi sẽ liên hệ trong vòng 15 phút.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/tour-trong-nuoc" className="btn-cta">
                Khám phá tour ngay <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/lien-he" className="btn-ghost">
                Liên hệ tư vấn
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
