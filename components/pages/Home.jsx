"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { isAutumnSeason } from "@/app/lib/season";
import {
  ShieldCheck, Clock3, ArrowRight, Sparkles, Building2, Headset,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import OrbitGallery from "@/components/OrbitGallery";
import hydrateKhiThay from "@/components/HydrateKhiThay";
import { formatVND } from "@/data/tours";

// Khối bên dưới màn hình đầu — đánh thức khi cuộn gần tới (xem HydrateKhiThay)
const napKhoi = (ten) => () => import("./HomeSections").then((m) => ({ default: m[ten] }));
// Khối này nằm sát mép dưới Hero (Hero cao đúng một màn hình) nên dùng khoảng
// cách âm: phải cuộn vào hẳn vài chục px mới đánh thức, không thì nó luôn bị
// đánh thức ngay lúc mở trang — mà đây là khối nặng nhất (các thẻ tour).
const KhoiTourSapKhoiHanh = hydrateKhiThay(napKhoi("KhoiTourSapKhoiHanh"), { khoangCach: "-24px" });
const KhoiUuDaiDiemDen = hydrateKhiThay(napKhoi("KhoiUuDaiDiemDen"));
const KhoiViSaoChonVideo = hydrateKhiThay(napKhoi("KhoiViSaoChonVideo"));
const KhoiDanhGia = hydrateKhiThay(() => import("@/components/Testimonials"));
const KhoiCuoiTrang = hydrateKhiThay(napKhoi("KhoiCuoiTrang"));

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
  initialAutumn = false,
  upcoming = [],
  banner = null,
  orbitImages = [],
  anhBiaTour = [],
  tenAnhTour = {},
  diemDen = [],
  goiYTrongNuoc = [],
  goiYNuocNgoai = [],
  reviews = [],
  promotions = [],
  latestGuides = [],
  partners = [],
  videoTrangChu = null,
  tieuDeVideo = null,
}) {
  const [autumn, setAutumn] = useState(initialAutumn);
  useEffect(() => {
    const refresh = () => setAutumn(isAutumnSeason());
    refresh();
    const timer = setInterval(refresh, 60_000);
    return () => clearInterval(timer);
  }, []);

  // Vòng xoay dùng HÌNH BÌA CÁC TOUR thật đang bán — ảnh của công ty, đổi theo
  // tour mới mà không phải sửa code. Ưu tiên ảnh admin đặt riêng (Banner →
  // vòng xoay) nếu có; chưa có tour nào thì mới rơi về ảnh dự phòng Unsplash.
  // Giới hạn 10 hình: vòng chia đều 360°/số ảnh, nhiều quá thì chật và rối.
  const anhVongXoay = (
    orbitImages.length
      ? orbitImages
      : anhBiaTour.length
        ? anhBiaTour
        : ORBIT_DU_PHONG
  )
    .slice(0, 10)
    .map((src) => ({ src, alt: tenAnhTour[src] }));

  // Chưa tạo banner trong admin thì KHÔNG hiện khối này.
  // Trước đây có một banner mặc định viết cứng trong code ("giảm 25%…") —
  // một khuyến mãi không có thật vẫn hiện lên trang, nhân viên không tắt được
  // vì nó không nằm trong admin. Giờ có banner thì hiện, không có thì bỏ qua.
  const promo = banner;

  // Ảnh nền Hero lấy từ chính các tour sắp khởi hành — nền luôn phản ánh đúng
  // thứ đang bán. Lấy tối đa 4 ảnh để không tải quá nặng ở màn hình đầu.
  const heroImages = useMemo(() => {
    const tuTour = upcoming.map((t) => t.image).filter(Boolean);
    // Chưa có tour sắp khởi hành thì lấy hình bìa các tour khác (ảnh thật của
    // công ty), Unsplash chỉ là chốt chặn cuối khi cả hai đều trống.
    const nguon = tuTour.length ? tuTour : anhBiaTour;
    const khongTrung = [...new Set(nguon)].slice(0, 4);
    return khongTrung.length ? khongTrung : [HERO_FALLBACK];
  }, [upcoming, anhBiaTour]);

  const [heroIndex, setHeroIndex] = useState(0);

  // Lúc mở trang CHỈ tải ảnh nền đầu tiên. Các ảnh sau nằm chồng lên nhau ở
  // độ mờ 0 nhưng vẫn "trong màn hình" nên trình duyệt tải hết cả 4 ngay từ
  // đầu (~200KB), tranh băng thông với tiêu đề/phông chữ trên 4G. Đợi trang
  // tải xong thêm một nhịp mới gắn các ảnh còn lại và bắt đầu chuyển cảnh.
  const [taiAnhSau, setTaiAnhSau] = useState(false);
  useEffect(() => {
    let hen;
    const batDau = () => {
      hen = setTimeout(() => setTaiAnhSau(true), 2500);
    };
    if (document.readyState === "complete") batDau();
    else window.addEventListener("load", batDau, { once: true });
    return () => {
      window.removeEventListener("load", batDau);
      clearTimeout(hen);
    };
  }, []);

  // Chuyển cảnh chậm giữa các ảnh. Người dùng bật giảm chuyển động thì giữ
  // nguyên một ảnh — không có gì nhấp nháy.
  useEffect(() => {
    if (autumn || !taiAnhSau || heroImages.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroImages.length),
      HERO_DOI_ANH_MS
    );
    return () => clearInterval(id);
  }, [autumn, taiAnhSau, heroImages.length]);

  return (
    <MotionConfig reducedMotion="user">
    <div className={autumn ? "autumn-home" : undefined}>
      {/* ===== HERO — bố cục co giãn, luôn vừa mọi màn hình =====
          Dùng flex dọc thay cho chiều cao ép cứng: phần chữ chiếm khoảng giữa,
          dải tour bám đáy TRONG luồng (không position absolute) nên không bao giờ
          bị đẩy ra ngoài tầm nhìn. min-h-svh dùng đơn vị viewport nhỏ nhất —
          an toàn với thanh địa chỉ trình duyệt trên điện thoại. */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-deep-gradient">
        {/* Ảnh nền lấy từ tour đang bán, chuyển cảnh chậm.
            Tất cả ảnh render sẵn và chỉ đổi độ mờ — không gắn/tháo phần tử liên tục
            nên không giật. Ảnh đầu đặt priority để giữ điểm LCP tốt. */}
        {heroImages.slice(0, autumn ? 1 : taiAnhSau ? heroImages.length : 1).map((img, i) => (
          <Image
            key={img}
            src={img}
            // Ảnh nền trang trí (aria-hidden) nhưng vẫn ghi tên tour vào alt:
            // công cụ SEO tính alt rỗng là "thiếu alt", Google Hình ảnh cũng đọc.
            alt={tenAnhTour[img] || "Tour du lịch cùng PSV Travel"}
            aria-hidden
            fill
            priority={i === 0}
            sizes="100vw"
            // Nền chỉ hiện mờ 35% dưới lớp phủ tối → nén mạnh hơn không thấy khác
            quality={50}
            className={`object-cover transition-opacity duration-[1600ms] ease-in-out ${
              autumn ? "opacity-100" : i === heroIndex ? "opacity-35" : "opacity-0"
            }`}
          />
        ))}

        {/* Nền Aurora: mesh gradient nhiều điểm dừng trôi chậm, có cặp bổ túc xanh–cam */}
        {!autumn && <>
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

        </>}
        {autumn && <div aria-hidden="true" className="autumn-photo-overlay absolute inset-0" />}

        {/* Vòng ảnh tour là dấu ấn của PSV Travel, hiện ở cả giao diện tháng 10. */}
        <div aria-hidden="true" className="orbit-layer pointer-events-none absolute inset-0 flex items-center justify-center">
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
        {!autumn && <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 640px 500px at center, rgba(4,15,31,0.86) 0%, rgba(4,15,31,0.6) 45%, rgba(4,15,31,0.18) 68%, transparent 80%)",
          }}
        />}

        {/* KHỐI CHỮ — chiếm phần giữa, tự căn giữa theo chiều cao còn lại */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-5 pb-6 pt-[clamp(6rem,13vh,7.5rem)] sm:px-8">
          <div className="flex w-full max-w-3xl flex-col items-center text-center">
            {/* Nhãn thông điệp màu ấm — bật hẳn khỏi nền xanh, mắt bắt được đầu tiên */}
            <motion.span
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: autumn ? 0.35 : 0.7 }}
              className="inline-flex items-center gap-2 rounded-full bg-sunset-700/95 px-4 py-1.5 text-[clamp(0.65rem,1.6vw,0.75rem)] font-bold uppercase tracking-[0.18em] text-white shadow-glow-warm backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              {autumn ? "THÁNG 10 – CHẠM SẮC THU" : "HÀNH TRÌNH MỚI – TRẢI NGHIỆM MỚI"}
            </motion.span>

            <motion.h1
              initial={{ y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: autumn ? 0.35 : 0.8, delay: 0.12 }}
              className="mt-[clamp(1rem,3vh,1.5rem)] font-display text-[clamp(1.9rem,5.2vw,3.6rem)] font-bold leading-[1.1] text-white"
            >
              Chạm thế giới<br />
              <span className="bg-gradient-to-r from-ocean-300 to-teal-300 bg-clip-text text-transparent">Trọn từng hành trình</span>
            </motion.h1>

            <motion.p
              initial={{ y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: autumn ? 0.35 : 0.8, delay: 0.26 }}
              className="mt-[clamp(0.75rem,2vh,1.25rem)] max-w-xl text-[clamp(0.9rem,1.9vw,1.125rem)] text-white/85"
            >
              {autumn ? "Theo nắng vàng, tìm miền mới — khám phá những hành trình đáng nhớ cùng PSV Travel." : <><strong className="font-semibold text-white">300+ tuyến tour</strong> trong nước và quốc tế,
              giá trọn gói minh bạch — đồng hành cùng hơn 10.000 lượt khách mỗi năm.</>}
            </motion.p>

            <div className="mt-[clamp(1.25rem,3.5vh,2.25rem)] w-full">
              <SearchBar diemDenTrongNuoc={goiYTrongNuoc} diemDenNuocNgoai={goiYNuocNgoai} />
            </div>

            {/* Bằng chứng tin cậy — đặt ngay dưới ô tìm kiếm */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: autumn ? 0.35 : 0.8, delay: 0.5 }}
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
            transition={{ duration: autumn ? 0.4 : 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hero-tours relative z-10 w-full px-5 pb-[clamp(1rem,3vh,1.75rem)] sm:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mb-2.5 flex items-end justify-between">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/85">
                  <Clock3 className="h-3.5 w-3.5 text-gold-400" /> Sắp khởi hành
                </p>
                <Link href="/tour-trong-nuoc" aria-label="Xem tất cả tour" className="vung-bam group flex items-center gap-1.5 text-xs font-semibold text-white/85 transition-colors hover:text-gold-300">
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

      {/* Các khối bên dưới màn hình đầu: HTML có đủ ngay từ máy chủ, còn
          JavaScript chỉ "đánh thức" từng khối khi khách cuộn gần tới — lúc mở
          trang máy không phải gánh cả trang một lượt. Xem HydrateKhiThay.jsx. */}
      <KhoiTourSapKhoiHanh promo={promo} upcoming={upcoming} />
      <KhoiUuDaiDiemDen promotions={promotions} diemDen={diemDen} />
      <KhoiViSaoChonVideo videoTrangChu={videoTrangChu} tieuDeVideo={tieuDeVideo} />
      <KhoiDanhGia reviews={reviews} />
      <KhoiCuoiTrang latestGuides={latestGuides} partners={partners} />
    </div>
    </MotionConfig>
  );
}
