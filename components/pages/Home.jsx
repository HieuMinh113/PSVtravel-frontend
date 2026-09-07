"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck, Clock3, HeartHandshake, BadgePercent, ArrowRight,
  Plane, Sparkles, MapPinned, Building2, Headset,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import TourCard from "@/components/TourCard";
import Testimonials from "@/components/Testimonials";
import SectionReveal from "@/components/SectionReveal";
import CountUp from "@/components/CountUp";
import OrbitGallery from "@/components/OrbitGallery";
import TrustBar from "@/components/TrustBar";
import { formatVND } from "@/data/tours";

// Ảnh nền Hero dự phòng — CHỈ dùng khi chưa có tour nào sắp khởi hành.
// Bình thường Hero lấy ảnh từ chính các tour đang bán (xem heroImages bên dưới),
// nên nền tự đổi theo mùa và theo tour mới mà không phải sửa code.
const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?q=80&w=2000&auto=format&fit=crop";

// Mỗi ảnh nền hiển thị bao lâu trước khi chuyển sang ảnh kế (mili giây)
const HERO_DOI_ANH_MS = 6500;

// Ảnh vòng xoay DỰ PHÒNG — chỉ dùng khi admin chưa upload ảnh nào.
// Ảnh thật quản lý trong admin: Banner → Vị trí "Ảnh vòng xoay — Trang chủ".
const ORBIT_DU_PHONG = [
  "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=400&auto=format&fit=crop", // Phú Quốc
  "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=400&auto=format&fit=crop", // Sa Pa
  "https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?q=80&w=400&auto=format&fit=crop", // Hạ Long
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=400&auto=format&fit=crop", // Đà Nẵng
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=400&auto=format&fit=crop", // Hà Giang
  "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=400&auto=format&fit=crop", // Thái Lan
  "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=400&auto=format&fit=crop", // Hàn Quốc
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop", // Nhật Bản
  "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=400&auto=format&fit=crop", // Singapore
  "https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=400&auto=format&fit=crop", // Đài Loan
];


const whyUs = [
  { icon: ShieldCheck, title: "Cam kết minh bạch", desc: "Giá tour trọn gói, không phụ thu ẩn, huỷ/đổi lịch linh hoạt." },
  { icon: BadgePercent, title: "Giá tốt mỗi ngày", desc: "Giá trọn gói minh bạch, so sánh trực tiếp giữa các tuyến để bạn chọn được mức phù hợp." },
  { icon: HeartHandshake, title: "Hỗ trợ 24/7", desc: "Đội ngũ tư vấn viên đồng hành xuyên suốt hành trình của bạn." },
  { icon: Clock3, title: "Xác nhận tức thì", desc: "Đặt chỗ và nhận xác nhận tour chỉ trong vài phút." },
];

// Bằng chứng tin cậy đặt ngay dưới ô tìm kiếm — khách thấy lý do tin tưởng
// ngay màn hình đầu tiên mà không cần cuộn.
//
// Cố ý dùng danh tính pháp nhân thật thay cho các con số thành tích:
// khách cẩn thận copy mã số thuế đem tra được ngay, còn "4.8/5 từ 2.400 đánh giá"
// mà đếm trên trang chỉ có vài chục bài thì phản tác dụng.
const trustSignals = [
  // Ghi đúng tên pháp nhân như trên giấy chứng nhận đăng ký doanh nghiệp —
  // khách đem tra cứu là khớp từng chữ.
  { icon: Building2, text: "CÔNG TY CỔ PHẦN DU LỊCH P.S.V TRAVEL" },
  { icon: ShieldCheck, text: "MST 0314542363" },
  { icon: Headset, text: "Hotline 24/7: 0907 870 707" },
];

export default function Home({
  upcoming = [],
  banner = null,
  orbitImages = [],
  diemDen = [],
  goiYTrongNuoc = [],
  goiYNuocNgoai = [],
  reviews = [],
}) {
  // Ưu tiên ảnh do công ty tự upload trong admin; chưa có thì dùng ảnh dự phòng
  const anhVongXoay = orbitImages.length ? orbitImages : ORBIT_DU_PHONG;

  // Chưa tạo banner trong admin thì KHÔNG hiện khối này.
  // Trước đây có một banner mặc định viết cứng trong code ("giảm 25%…") —
  // một khuyến mãi không có thật vẫn hiện lên trang, nhân viên không tắt được
  // vì nó không nằm trong admin. Giờ có banner thì hiện, không có thì bỏ qua.
  const promo = banner;

  // Ảnh nền Hero lấy từ chính các tour sắp khởi hành — nền luôn phản ánh đúng
  // thứ đang bán. Lấy tối đa 4 ảnh để không tải quá nặng ở màn hình đầu.
  const heroImages = useMemo(() => {
    const tuTour = upcoming.map((t) => t.image).filter(Boolean);
    const khongTrung = [...new Set(tuTour)].slice(0, 4);
    return khongTrung.length ? khongTrung : [HERO_FALLBACK];
  }, [upcoming]);

  const [heroIndex, setHeroIndex] = useState(0);

  // Chuyển cảnh chậm giữa các ảnh. Người dùng bật giảm chuyển động thì giữ
  // nguyên một ảnh — không có gì nhấp nháy.
  useEffect(() => {
    if (heroImages.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroImages.length),
      HERO_DOI_ANH_MS
    );
    return () => clearInterval(id);
  }, [heroImages.length]);

  return (
    <div>
      {/* ===== HERO — bố cục co giãn, luôn vừa mọi màn hình =====
          Dùng flex dọc thay cho chiều cao ép cứng: phần chữ chiếm khoảng giữa,
          dải tour bám đáy TRONG luồng (không position absolute) nên không bao giờ
          bị đẩy ra ngoài tầm nhìn. min-h-svh dùng đơn vị viewport nhỏ nhất —
          an toàn với thanh địa chỉ trình duyệt trên điện thoại. */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-deep-gradient">
        {/* Ảnh nền lấy từ tour đang bán, chuyển cảnh chậm.
            Tất cả ảnh render sẵn và chỉ đổi độ mờ — không gắn/tháo phần tử liên tục
            nên không giật. Ảnh đầu đặt priority để giữ điểm LCP tốt. */}
        {heroImages.map((img, i) => (
          <Image
            key={img}
            src={img}
            alt=""
            aria-hidden
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1600ms] ease-in-out ${
              i === heroIndex ? "opacity-35" : "opacity-0"
            }`}
          />
        ))}

        {/* Nền Aurora: mesh gradient nhiều điểm dừng trôi chậm, có cặp bổ túc xanh–cam */}
        <div className="absolute inset-0 bg-aurora-deep bg-[length:180%_180%] animate-aurora opacity-80" />
        <div className="absolute inset-0 bg-duotone-glow opacity-60" />

        {/* Lưới chấm nhẹ tạo chiều sâu */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        {/* Vòng ảnh xoay — lớp .orbit-layer tự ẩn khi màn hình thấp hoặc hẹp
            (xem globals.css), tránh ảnh đè lên tiêu đề và thanh điều hướng */}
        <div className="orbit-layer pointer-events-none absolute inset-0 flex items-center justify-center">
          <OrbitGallery
            images={anhVongXoay}
            radiusLg={560}
            radiusMd={330}
            radiusSm={172}
            cardSizeLg={92}
            cardSizeMd={68}
            cardSizeSm={54}
            showCenter={false}
          />
        </div>

        {/* Lớp phủ tối giữa vòng ảnh và chữ — đảm bảo chữ luôn đọc rõ */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 640px 500px at center, rgba(4,15,31,0.86) 0%, rgba(4,15,31,0.6) 45%, rgba(4,15,31,0.18) 68%, transparent 80%)",
          }}
        />

        {/* KHỐI CHỮ — chiếm phần giữa, tự căn giữa theo chiều cao còn lại */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-5 pb-6 pt-[clamp(6rem,13vh,7.5rem)] sm:px-8">
          <div className="flex w-full max-w-3xl flex-col items-center text-center">
            {/* Nhãn ưu đãi màu ấm — bật hẳn khỏi nền xanh, mắt bắt được đầu tiên */}
            <motion.span
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full bg-sunset-600/95 px-4 py-1.5 text-[clamp(0.65rem,1.6vw,0.75rem)] font-bold uppercase tracking-[0.18em] text-white shadow-glow-warm backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              Ưu đãi hè 2026 — giảm đến 20%
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="mt-[clamp(1rem,3vh,1.5rem)] font-display text-[clamp(1.9rem,5.2vw,3.6rem)] font-bold leading-[1.1] text-white"
            >
              Đắm mình vào <span className="bg-gradient-to-r from-ocean-300 to-teal-300 bg-clip-text text-transparent">sắc xanh</span><br className="hidden sm:block" /> của những vùng đất mới
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.26 }}
              className="mt-[clamp(0.75rem,2vh,1.25rem)] max-w-xl text-[clamp(0.9rem,1.9vw,1.125rem)] text-white/85"
            >
              <strong className="font-semibold text-white">300+ tuyến tour</strong> trong nước và quốc tế,
              giá trọn gói minh bạch — đồng hành cùng hơn 10.000 lượt khách mỗi năm.
            </motion.p>

            <div className="mt-[clamp(1.25rem,3.5vh,2.25rem)] w-full">
              <SearchBar diemDenTrongNuoc={goiYTrongNuoc} diemDenNuocNgoai={goiYNuocNgoai} />
            </div>

            {/* Bằng chứng tin cậy — đặt ngay dưới ô tìm kiếm */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-[clamp(0.9rem,2.2vh,1.5rem)] flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            >
              {trustSignals.map((t) => (
                <span key={t.text} className="flex items-center gap-1.5 text-[clamp(0.7rem,1.6vw,0.875rem)] font-medium text-white/85">
                  <t.icon className="h-4 w-4 shrink-0 text-gold-400" />
                  {t.text}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ===== DẢI TOUR BÁM ĐÁY HERO =====
            Nằm TRONG luồng flex nên luôn hiển thị đủ, không bị cắt.
            Khách thấy ảnh + tên + giá tour thật ngay màn hình đầu tiên. */}
        {upcoming.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hero-tours relative z-10 w-full px-5 pb-[clamp(1rem,3vh,1.75rem)] sm:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mb-2.5 flex items-end justify-between">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/85">
                  <Clock3 className="h-3.5 w-3.5 text-gold-400" /> Sắp khởi hành
                </p>
                <Link href="/tour-trong-nuoc" className="group flex items-center gap-1.5 text-xs font-semibold text-white/85 transition-colors hover:text-gold-300">
                  Xem tất cả
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-enter group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.slice(0, 3).map((tour, i) => (
                  <Link
                    key={tour.slug}
                    href={`${tour.type === "domestic" ? "/tour-trong-nuoc" : "/tour-nuoc-ngoai"}/${tour.slug}`}
                    className={`glass-surface group flex items-center gap-3 rounded-2xl p-2.5 transition-all duration-300 ease-enter hover:-translate-y-1 hover:bg-white/25 ${
                      i === 0 ? "" : i === 1 ? "hidden sm:flex" : "hidden lg:flex"
                    }`}
                  >
                    <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={tour.image}
                        alt={tour.name}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-500 ease-enter group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{tour.name}</p>
                      <p className="mt-0.5 truncate text-xs text-white/70">
                        {tour.days}
                        {tour.startDate ? ` · ${tour.startDate}` : ""}
                      </p>
                      <p className="mt-1 font-display text-sm font-bold text-gold-300">{formatVND(tour.price)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-white/60 opacity-0 transition-all duration-300 ease-enter group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* ===== DẢI CAM KẾT — ngay dưới Hero, trả lời câu hỏi "có tin được không" ===== */}
      <TrustBar />

      {/* ===== BANNER KHUYẾN MÃI — chỉ hiện khi admin đã tạo banner ===== */}
      {promo && (
      <section className="bg-foam px-5 pt-10 sm:px-8">
        <SectionReveal className="mx-auto max-w-7xl">
          <div className="group relative overflow-hidden rounded-3xl shadow-deep">
            <motion.img
              src={promo.image}
              alt={promo.title || "Ưu đãi PSVTravel"}
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-[260px] w-full object-cover sm:h-[300px]"
            />
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
            <Link href="/tour-trong-nuoc" className="group flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
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
                  <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 50vw, 25vw" quality={90} className="object-cover transition-transform duration-700 ease-enter group-hover:scale-110" />
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

      <Testimonials reviews={reviews} />

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
    </div>
  );
}
