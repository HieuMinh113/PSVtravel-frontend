"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HeartHandshake, ShieldCheck, BadgeCheck, Users2, MapPinned, MapPin,
  X, ArrowRight, Images,
} from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import CountUp from "@/components/CountUp";
import TeamCarousel from "@/components/TeamCarousel";

const values = [
  {
    icon: HeartHandshake,
    title: "Tận tâm",
    desc: "Đặt trải nghiệm và sự hài lòng của khách hàng làm trọng tâm trong từng dịch vụ, từ tư vấn trước chuyến đi đến quá trình đồng hành trong hành trình.",
  },
  {
    icon: ShieldCheck,
    title: "Uy tín",
    desc: "Tư vấn rõ ràng, thông tin minh bạch và đề cao trách nhiệm trong từng sản phẩm, dịch vụ mà PSV Travel cung cấp.",
  },
  {
    icon: BadgeCheck,
    title: "Chất lượng",
    desc: "Không ngừng hoàn thiện chương trình tour, dịch vụ và quy trình phục vụ nhằm mang đến những trải nghiệm ngày càng tốt hơn cho khách hàng.",
  },
  {
    icon: Users2,
    title: "Đồng hành",
    desc: "Không chỉ cung cấp một chuyến đi, PSV Travel mong muốn trở thành người bạn đồng hành đáng tin cậy của khách hàng trước, trong và sau mỗi hành trình.",
  },
];

const milestones = [
  {
    year: "2017",
    title: "Thành lập PSV Travel",
    desc: "PSV Travel chính thức hoạt động trong lĩnh vực du lịch lữ hành, đặt nền móng cho hành trình phát triển và phục vụ khách hàng.",
  },
  {
    year: "2020",
    title: "Mở rộng sản phẩm du lịch",
    desc: "Không ngừng phát triển các chương trình tour trong nước và quốc tế, đồng thời mở rộng hệ thống dịch vụ phục vụ nhu cầu đa dạng của khách hàng.",
  },
  {
    year: "Phát triển bền vững",
    title: "Đa dạng hoá dịch vụ",
    desc: "Bên cạnh các chương trình tham quan, PSV Travel cung cấp thêm các dịch vụ visa, vé máy bay, xe du lịch, khách sạn, resort, Team Building và tour kết hợp tổ chức sự kiện.",
  },
  {
    year: "2026",
    title: "Hơn 10.000 khách hàng mỗi năm",
    desc: "Với hơn 300 tuyến tour và lượng khách hàng ngày càng mở rộng, PSV Travel tiếp tục tập trung nâng cao chất lượng dịch vụ và xây dựng những hành trình đáng nhớ.",
  },
];

const chuCaiDau = (ten) => (ten || "?").trim().charAt(0).toUpperCase();

// Bố cục bento kiểu tạp chí — giống trang "Khoảnh khắc du khách": ô nổi bật lớn
// xen ô cao, ô rộng cho nhịp thị giác. Chỉ áp span từ sm trở lên; điện thoại giữ
// lưới 2 cột đều để không rối.
function bentoSpan(i) {
  const m = i % 8;
  if (m === 0) return "sm:col-span-2 sm:row-span-2"; // ô nổi bật
  if (m === 3) return "sm:row-span-2"; // ô cao
  if (m === 5) return "lg:col-span-2"; // ô rộng
  return "";
}

function MomentCard({ m, i, onOpen }) {
  const nhan = m.caption || m.trip || m.name || "Khoảnh khắc cùng PSV Travel";
  return (
    <motion.button
      onClick={() => onOpen(m)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`Xem ảnh: ${nhan}`}
      className={`group relative overflow-hidden rounded-2xl bg-deep-900 text-left shadow-card outline-none focus-visible:ring-4 focus-visible:ring-ocean-400/50 ${bentoSpan(i)}`}
    >
      <Image
        src={m.photo}
        alt={nhan}
        fill
        quality={90}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-950/80 via-deep-950/10 to-transparent transition-opacity duration-500 group-hover:from-deep-950/90" />

      {m.photos && m.photos.length > 1 ? (
        <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full border border-white/20 bg-deep-950/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <Images className="h-3.5 w-3.5" aria-hidden="true" />
          {m.photos.length}
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 p-3.5">
        {m.caption && (
          <p className={`line-clamp-2 text-sm leading-snug text-white ${m.name ? "mb-2 max-h-0 opacity-0 transition-all duration-500 ease-out group-hover:max-h-20 group-hover:opacity-100" : "font-medium"}`}>
            {m.caption}
          </p>
        )}
        {m.name && (
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-white/80 bg-gradient-to-br from-ocean-500 to-teal-500 text-[10px] font-bold text-white">
              {chuCaiDau(m.name || m.trip)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">{m.name || m.trip || "Khoảnh khắc PSV"}</p>
              {m.trip && m.name && (
                <p className="flex items-center gap-1 truncate text-[11px] text-white/75">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{m.trip}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}

export default function AboutUs({ moments = [], team = [], aboutImages = [] }) {
  const [active, setActive] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0); // ảnh đang xem trong khoảnh khắc

  // Ảnh khối "Khoảnh khắc đáng nhớ": ưu tiên ảnh admin thêm ở "Hình ảnh Về chúng
  // tôi"; nếu chưa có thì dùng ảnh khách gửi (Khoảnh Khắc Du Khách) để không trống.
  const galleryItems = aboutImages.length > 0
    ? aboutImages.map((im) => ({
        id: `about-${im.id}`,
        photo: im.image,
        photos: [im.image],
        caption: im.caption || "",
        name: null,
        trip: null,
      }))
    : moments;

  // Mở khoảnh khắc và luôn bắt đầu từ ảnh chính.
  const openMoment = (m) => { setActive(m); setPhotoIndex(0); };
  const closeMoment = () => setActive(null);

  // Bộ ảnh (ảnh chính + ảnh phụ) của khoảnh khắc đang mở.
  const activePhotos = active ? (active.photos?.length ? active.photos : [active.photo]) : [];
  const activePhoto = activePhotos[photoIndex] ?? active?.photo;

  return (
    <div>
      <PageHero
        eyebrow="Về PSV Travel"
        title="Phát triển – Sẵn sàng – Vững vàng"
        description="PSV Travel là doanh nghiệp hoạt động trong lĩnh vực du lịch lữ hành, cung cấp các chương trình du lịch trong nước và quốc tế cùng nhiều dịch vụ hỗ trợ hành trình."
        crumbs={[{ label: "Về chúng tôi" }]}
      />

      {/* ===== CÂU CHUYỆN ===== */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Câu chuyện của PSV</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              Bắt đầu từ tình yêu <span className="text-gradient-ocean">xê dịch</span>
            </h2>
            <p className="mt-5 leading-relaxed text-ink-muted">
              PSV Travel là doanh nghiệp hoạt động trong lĩnh vực du lịch lữ hành, cung cấp các chương
              trình du lịch trong nước và quốc tế cùng nhiều dịch vụ hỗ trợ hành trình.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Được thành lập từ năm 2017, PSV Travel không ngừng hoàn thiện sản phẩm, nâng cao chất lượng
              dịch vụ và xây dựng đội ngũ chuyên nghiệp với mong muốn mang đến cho khách hàng những chuyến
              đi trọn vẹn, thuận tiện và đáng nhớ.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Với hơn 10.000 lượt khách mỗi năm và hơn 300 tuyến tour, PSV Travel luôn lấy sự hài lòng của
              khách hàng làm nền tảng cho sự phát triển lâu dài.
            </p>

            <div className="mx-auto mt-9 grid max-w-lg grid-cols-3 gap-4 sm:gap-6">
              {[
                { to: 9, suffix: " năm", label: "Hoạt động" },
                { to: 10000, suffix: "+", label: "Khách/năm" },
                { to: 300, suffix: "+", label: "Tuyến tour" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white px-2 py-4 text-center shadow-card sm:px-3">
                  {/* Cỡ chữ co theo bề ngang màn hình: để cứng text-2xl thì trên
                      máy 360px mỗi ô chỉ còn khoảng 72px, "10.000+" không vừa. */}
                  <p className="font-display text-[clamp(0.95rem,4.6vw,1.875rem)] font-bold leading-tight text-ocean-700">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ink-muted sm:text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ===== GIÁ TRỊ CỐT LÕI ===== */}
      <section className="relative overflow-hidden bg-deep-gradient py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-70" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Giá trị cốt lõi</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Điều làm nên PSV Travel</h2>
          </SectionReveal>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl bg-white/10 p-6 backdrop-blur-sm ring-1 ring-white/15 transition-transform duration-400 ease-enter hover:-translate-y-1.5">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-gold-300">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 font-display text-lg font-bold">{v.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{v.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HÀNH TRÌNH PHÁT TRIỂN ===== */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">Hành trình phát triển</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">Những cột mốc của PSV Travel</h2>
          </SectionReveal>

          <div className="relative mt-12">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-ocean-200 sm:left-1/2" />
            <div className="flex flex-col gap-8">
              {milestones.map((m, i) => (
                <SectionReveal key={m.title} delay={i * 0.08}>
                  <div className={`relative flex gap-5 sm:w-1/2 ${i % 2 ? "sm:ml-auto sm:pl-10" : "sm:pr-10 sm:text-right"}`}>
                    <span
                      className={`absolute top-1.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-600 text-white shadow-glow ${
                        i % 2 ? "left-0 sm:-left-5" : "left-0 sm:-right-5 sm:left-auto"
                      }`}
                    >
                      <MapPinned className="h-4 w-4" />
                    </span>
                    <div className="ml-14 sm:ml-0 sm:w-full">
                      <p className="font-display text-lg font-bold text-ocean-700">{m.year}</p>
                      <p className="mt-1 font-display text-base font-semibold text-deep-900">{m.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{m.desc}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CON NGƯỜI ===== */}
      <section className="bg-ocean-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">Con người PSV Travel</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              Đội ngũ đứng sau mỗi hành trình
            </h2>
            <p className="mt-5 leading-relaxed text-ink-muted">
              Đằng sau mỗi chuyến đi là sự tận tâm, chuyên môn và trách nhiệm của đội ngũ PSV Travel.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Chúng tôi tin rằng chất lượng của một hành trình không chỉ đến từ điểm đến hay lịch trình, mà
              còn đến từ cách khách hàng được tư vấn, hỗ trợ và chăm sóc trong suốt chuyến đi.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Với tinh thần nhiệt huyết – chuyên nghiệp – tận tâm, đội ngũ PSV Travel luôn chủ động lắng
              nghe nhu cầu của khách hàng, tư vấn giải pháp phù hợp và đồng hành để mỗi chuyến đi diễn ra
              thuận tiện, an tâm và trọn vẹn.
            </p>
          </SectionReveal>

          {/* Đội ngũ do admin thêm (Admin → Đội ngũ). Chưa có ai thì ẩn,
              chỉ giữ đoạn giới thiệu bằng chữ ở trên. */}
          {team.length > 0 && (
            <div className="mt-14">
              <TeamCarousel members={team} />
            </div>
          )}
        </div>
      </section>

      {/* ===== KHOẢNH KHẮC ĐÁNG NHỚ =====
          Ảnh lấy từ Admin → Khoảnh Khắc Du Khách. Chưa có ảnh thật thì ẩn cả
          khối — không dựng ảnh minh hoạ để khỏi hứa hẹn thứ không có. */}
      {galleryItems.length > 0 && (
        <section className="bg-foam py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionReveal className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Khoảnh khắc đáng nhớ</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
                Những hành trình được tạo nên từ sự đồng hành
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink-muted">
                Mỗi chuyến đi, mỗi chương trình và mỗi cuộc gặp gỡ đều góp phần tạo nên hành trình phát
                triển của PSV Travel. Từ những buổi khảo sát điểm đến, xây dựng chương trình tour, gặp gỡ
                đối tác đến những khoảnh khắc đồng hành cùng khách hàng, tất cả đều là những dấu ấn đáng
                nhớ trên hành trình của chúng tôi.
              </p>
            </SectionReveal>

            <div className="mt-12 grid auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {galleryItems.map((m, i) => (
                <MomentCard key={m.id ?? i} m={m} i={i} onOpen={openMoment} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CAM KẾT ===== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Cam kết của PSV Travel</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">Khách hàng là trên hết</h2>
            <p className="mt-5 leading-relaxed text-ink-muted">
              Với phương châm “Khách hàng là trên hết”, PSV Travel cam kết mang đến những sản phẩm và dịch
              vụ du lịch chất lượng, phù hợp với nhu cầu và ngân sách của từng khách hàng.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Chúng tôi không ngừng nâng cao chất lượng phục vụ, hoàn thiện sản phẩm và lắng nghe những
              phản hồi từ khách hàng để mỗi hành trình ngày càng tốt hơn.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              PSV Travel tin rằng sự hài lòng và tin tưởng của khách hàng chính là nền tảng quan trọng nhất
              cho sự phát triển lâu dài của doanh nghiệp.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ===== KÊU GỌI ===== */}
      <section className="relative overflow-hidden bg-deep-gradient py-16 sm:py-20">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-70" />
        <SectionReveal className="relative mx-auto max-w-3xl px-5 text-center text-white sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            Sẵn sàng cho hành trình tiếp theo?
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Hãy để PSV Travel đồng hành cùng bạn trong những chuyến đi đáng nhớ
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tour-trong-nuoc" className="btn-cta">
              Xem tour trong nước <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lien-he"
              className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </SectionReveal>
      </section>

      {/* Xem ảnh phóng to */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMoment}
            className="fixed inset-0 z-[100] grid place-items-center bg-deep-950/90 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white"
            >
              <button
                onClick={closeMoment}
                aria-label="Đóng"
                className="tap-44 absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-deep-900 shadow"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative bg-deep-950">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={activePhoto}
                    alt={active.caption || "Khoảnh khắc cùng PSV Travel"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="max-h-[68vh] w-full object-contain"
                  />
                </AnimatePresence>
                {activePhotos.length > 1 ? (
                  <span className="absolute left-3 top-3 rounded-full bg-deep-950/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {photoIndex + 1}/{activePhotos.length}
                  </span>
                ) : null}
              </div>

              {/* Dải ảnh nhỏ — bấm để đổi ảnh lớn */}
              {activePhotos.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto px-5 pt-4">
                  {activePhotos.map((src, gi) => (
                    <button
                      key={gi}
                      type="button"
                      onClick={() => setPhotoIndex(gi)}
                      aria-label={`Xem ảnh ${gi + 1}`}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        gi === photoIndex ? "border-ocean-500" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}

              {(active.caption || active.trip) && (
                <p className="p-5 text-center text-sm text-ink">{active.caption || active.trip}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
