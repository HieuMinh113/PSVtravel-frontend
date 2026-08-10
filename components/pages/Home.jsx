"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck, Clock3, HeartHandshake, BadgePercent, ArrowRight,
  Plane, Sparkles, MapPinned, ChevronDown,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import TourCard from "@/components/TourCard";
import Testimonials from "@/components/Testimonials";
import SectionReveal from "@/components/SectionReveal";
import CountUp from "@/components/CountUp";
import OrbitGallery from "@/components/OrbitGallery";

// Ảnh điểm đến thật, lấy lại từ dữ liệu tour có sẵn để đảm bảo luôn tải được
const orbitImages = [
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
import { domesticTours, abroadTours } from "@/data/tours";

const destinations = [
  { name: "Phú Quốc", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop", count: "24 tour" },
  { name: "Đà Nẵng", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop", count: "31 tour" },
  { name: "Sa Pa", image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop", count: "18 tour" },
  { name: "Thái Lan", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop", count: "15 tour" },
  { name: "Hàn Quốc", image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop", count: "22 tour" },
  { name: "Nhật Bản", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop", count: "12 tour" },
];

const whyUs = [
  { icon: ShieldCheck, title: "Cam kết minh bạch", desc: "Giá tour trọn gói, không phụ thu ẩn, huỷ/đổi lịch linh hoạt." },
  { icon: BadgePercent, title: "Giá tốt mỗi ngày", desc: "So sánh giá trực tiếp với hơn 200 đối tác lữ hành trên toàn quốc." },
  { icon: HeartHandshake, title: "Hỗ trợ 24/7", desc: "Đội ngũ tư vấn viên đồng hành xuyên suốt hành trình của bạn." },
  { icon: Clock3, title: "Xác nhận tức thì", desc: "Đặt chỗ và nhận xác nhận tour chỉ trong vài phút." },
];

// Ghép & sắp xếp theo ngày khởi hành gần nhất để mô phỏng "tour sát ngày"
const upcoming = [...domesticTours, ...abroadTours]
  .slice()
  .sort((a, b) => new Date(a.startDate.split("/").reverse().join("-")) - new Date(b.startDate.split("/").reverse().join("-")))
  .slice(0, 6);

export default function Home() {
  return (
    <div>
      {/* ===== HERO — vòng ảnh xoay bao quanh khối tiêu đề + tìm kiếm ===== */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-deep-gradient py-28">
        {/* Quầng sáng đôi màu chủ đạo */}
        <div className="absolute inset-0 bg-duotone-glow" />

        {/* Lưới chấm nhẹ tạo chiều sâu, không phải ảnh chụp */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        {/* Vòng ảnh xoay bao quanh toàn bộ khối nội dung — điểm nhấn chính của Hero */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <OrbitGallery
            images={orbitImages}
            radiusLg={430}
            radiusMd={320}
            radiusSm={175}
            cardSizeLg={104}
            cardSizeMd={82}
            cardSizeSm={52}
            showCenter={false}
          />
        </div>

        {/* Lớp phủ tối giữa vòng ảnh và chữ — đảm bảo chữ luôn đọc rõ dù ảnh phía sau sáng */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 620px 480px at center, rgba(4,15,31,0.8) 0%, rgba(4,15,31,0.55) 45%, rgba(4,15,31,0.15) 68%, transparent 80%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
          <motion.span
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            Ưu đãi hè 2026 — giảm đến 20%
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-6xl"
          >
            Đắm mình vào <span className="bg-gradient-to-r from-ocean-300 to-teal-300 bg-clip-text text-transparent">sắc xanh</span><br className="hidden sm:block" /> của những vùng đất mới
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 max-w-xl text-base text-white/75 sm:text-lg"
          >
            Từ những bãi biển Việt Nam trong vắt đến chân trời Á – Âu xa xôi.
            PSVTravel đồng hành cùng hơn 18.000 hành trình mỗi năm.
          </motion.p>

          <div className="mt-10 w-full">
            <SearchBar />
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 mt-10 flex flex-col items-center gap-1 text-xs font-semibold text-white/70"
        >
          Cuộn xuống để khám phá thêm
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ===== BANNER KHUYẾN MÃI ===== */}
      <section className="bg-foam px-5 pt-10 sm:px-8">
        <SectionReveal className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl shadow-deep">
            <motion.img
              src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1600&auto=format&fit=crop"
              alt="Ưu đãi mùa hè PSVTravel"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-[260px] w-full object-cover sm:h-[300px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-950/85 via-deep-950/55 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-6 sm:px-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-deep-950">
                Ưu đãi có hạn
              </span>
              <h2 className="max-w-md font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                Săn vé Đông Nam Á — giảm đến 25% cho 100 khách đặt sớm
              </h2>
              <p className="max-w-sm text-sm text-white/75">
                Áp dụng cho tour Thái Lan, Singapore, Đài Loan khởi hành trước 30/09/2026.
              </p>
              <Link
                href="/tour-nuoc-ngoai"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ocean-700 transition-transform hover:-translate-y-0.5"
              >
                Xem ưu đãi ngay <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ===== TOUR SÁT NGÀY KHỞI HÀNH ===== */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-teal-500">
                <Clock3 className="h-3.5 w-3.5" /> Sắp khởi hành
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
                Tour sát ngày — <span className="text-gradient-ocean">đặt ngay kẻo lỡ</span>
              </h2>
            </div>
            <Link href="/tour-trong-nuoc" className="flex items-center gap-1 text-sm font-semibold text-ocean-600 hover:text-ocean-700">
              Xem tất cả tour <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionReveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((tour, i) => (
              <TourCard
                key={tour.slug}
                tour={tour}
                index={i}
                basePath={domesticTours.includes(tour) ? "/tour-trong-nuoc" : "/tour-nuoc-ngoai"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ĐIỂM ĐẾN NỔI BẬT ===== */}
      <section className="bg-ocean-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-teal-500">
              <MapPinned className="h-3.5 w-3.5" /> Điểm đến nổi bật
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              Bạn muốn <span className="text-gradient-ocean">khám phá</span> nơi nào?
            </h2>
          </SectionReveal>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {destinations.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-md"
              >
                <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-950/85 via-deep-950/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-display text-sm font-bold text-white sm:text-base">{d.name}</p>
                  <p className="text-[11px] text-white/70">{d.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VÌ SAO CHỌN CHÚNG TÔI ===== */}
      <section className="relative overflow-hidden bg-deep-gradient py-20 text-white">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-ocean-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-400">Vì sao chọn chúng tôi</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Đồng hành đáng tin cậy cho mọi hành trình
            </h2>
          </SectionReveal>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <SectionReveal key={w.title} delay={i * 0.1} className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur">
                  <w.icon className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-white/60">{w.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SỐ LIỆU ===== */}
      <section className="bg-foam py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 sm:grid-cols-4 sm:px-8">
          {[
            { to: 18400, suffix: "+", label: "Khách hàng mỗi năm" },
            { to: 320, suffix: "+", label: "Tuyến tour trong & ngoài nước" },
            { to: 12, suffix: " năm", label: "Kinh nghiệm vận hành" },
            { to: 98, suffix: "%", label: "Khách hàng hài lòng" },
          ].map((s, i) => (
            <SectionReveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-3xl font-bold text-ocean-700 sm:text-4xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs text-deep-800/55 sm:text-sm">{s.label}</p>
            </SectionReveal>

          ))}
        </div>
      </section>

      <Testimonials />

      {/* ===== CTA CUỐI TRANG ===== */}
      <section className="relative overflow-hidden bg-horizon py-20">
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <SectionReveal>
            <Plane className="mx-auto h-10 w-10 text-deep-900/70 animate-bob" />
            <h2 className="mt-4 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              Sẵn sàng cho chuyến đi tiếp theo?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-deep-900/70">
              Để lại thông tin, đội ngũ tư vấn viên của chúng tôi sẽ liên hệ trong vòng 15 phút.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/tour-trong-nuoc" className="btn-cta">
                Khám phá tour ngay <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/lien-he" className="rounded-full border-2 border-white/50 bg-white/30 px-7 py-3.5 font-semibold text-deep-900 backdrop-blur-md transition-colors hover:bg-white/50">
                Liên hệ tư vấn
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}