"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HeartHandshake, ShieldCheck, Sparkles, Users2, MapPinned,
  Quote, X, Mail, ArrowRight,
} from "lucide-react";
import { LinkedinIcon } from "@/components/SocialIcons";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import CountUp from "@/components/CountUp";

const values = [
  { icon: HeartHandshake, title: "Tận tâm", desc: "Đặt trải nghiệm của khách hàng lên hàng đầu trong từng chi tiết nhỏ nhất của hành trình." },
  { icon: ShieldCheck, title: "Uy tín", desc: "Minh bạch giá cả, cam kết đúng như những gì đã tư vấn — không phát sinh chi phí ẩn." },
  { icon: Sparkles, title: "Sáng tạo", desc: "Không ngừng làm mới lịch trình, tìm kiếm những trải nghiệm độc đáo cho mỗi chuyến đi." },
  { icon: Users2, title: "Đồng hành", desc: "Không chỉ bán tour — chúng tôi đồng hành cùng khách hàng trước, trong và sau chuyến đi." },
];

const milestones = [
  { year: "2014", title: "Thành lập PSVTravel", desc: "Khởi đầu với 5 thành viên và văn phòng nhỏ tại TP.HCM." },
  { year: "2018", title: "Mở rộng tour quốc tế", desc: "Ra mắt các tuyến tour Đông Bắc Á, Đông Nam Á đầu tiên." },
  { year: "2021", title: "Ra mắt nền tảng đặt tour trực tuyến", desc: "Số hoá toàn bộ quy trình đặt tour, thanh toán và chăm sóc khách hàng." },
  { year: "2026", title: "18.000+ khách hàng mỗi năm", desc: "Trở thành một trong những đơn vị lữ hành được tin chọn hàng đầu." },
];

const team = [
  { name: "Nguyễn Anh Vũ", role: "Nhà sáng lập & CEO", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop" },
  { name: "Trần Bảo Trân", role: "Giám đốc Vận hành", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500&auto=format&fit=crop" },
  { name: "Lê Minh Quân", role: "Trưởng phòng Kinh doanh", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop" },
  { name: "Phạm Thuý Vy", role: "Trưởng phòng Chăm sóc khách hàng", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop" },
  { name: "Đỗ Hoàng Nam", role: "Trưởng phòng Sản phẩm Tour", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=500&auto=format&fit=crop" },
  { name: "Vũ Khánh Linh", role: "Trưởng phòng Marketing", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=500&auto=format&fit=crop" },
];

const moments = [
  { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop", caption: "Văn phòng làm việc tại TP.HCM" },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop", caption: "Team building thường niên 2025" },
  { src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop", caption: "Buổi họp lên kế hoạch tour mới" },
  { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop", caption: "Lễ vinh danh nhân viên xuất sắc" },
  { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1000&auto=format&fit=crop", caption: "Cùng nhau ăn mừng cột mốc 15.000 khách hàng" },
  { src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop", caption: "Khảo sát thực tế tuyến tour Đà Lạt" },
];

function MomentCard({ m, i, onOpen }) {
  return (
    <motion.button
      onClick={() => onOpen(m)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      aria-label={m.caption}
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl text-left shadow-card"
    >
      <Image src={m.src} alt={m.caption} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-enter group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-950/85 via-deep-950/10 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-sunset-500 transition-transform duration-400 ease-enter group-hover:scale-x-100" />
      <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-medium text-white">{m.caption}</p>
    </motion.button>
  );
}

export default function AboutUs() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <PageHero
        eyebrow="Về PSVTravel"
        title="Đồng hành cùng bạn trên mọi hành trình"
        description="Từ một văn phòng nhỏ năm 2014, PSVTravel đã trở thành người bạn đồng hành tin cậy của hơn 18.000 lượt khách mỗi năm."
        crumbs={[{ label: "Về chúng tôi" }]}
      />

      {/* Câu chuyện công ty */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Câu chuyện của chúng tôi</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              Bắt đầu từ tình yêu <span className="text-gradient-ocean">xê dịch</span>
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              PSVTravel được thành lập năm 2014 bởi một nhóm bạn trẻ có chung niềm đam mê khám phá.
              Từ những chuyến đi tự túc đầu tiên, chúng tôi nhận ra mong muốn được chia sẻ trải nghiệm ấy
              đến với nhiều người hơn — không chỉ là đưa khách đến một điểm đến, mà là mang đến một câu
              chuyện đáng nhớ.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Hơn một thập kỷ sau, PSVTravel tự hào là đơn vị lữ hành được hàng chục nghìn khách hàng tin
              chọn mỗi năm, với mạng lưới hơn 320 tuyến tour trong nước và quốc tế, đội ngũ hướng dẫn viên
              giàu kinh nghiệm và hệ thống đặt tour trực tuyến hiện đại.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
              {[
                { to: 12, suffix: " năm", label: "Hoạt động" },
                { to: 18400, suffix: "+", label: "Khách/năm" },
                { to: 60, suffix: "+", label: "Nhân sự" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white px-2 py-4 text-center shadow-card sm:px-3">
                  {/* Cỡ chữ co theo bề ngang màn hình. Để cứng text-2xl thì trên
                      máy 360px mỗi ô chỉ còn khoảng 72px, "18.400+" không thể vừa
                      — hoặc dấu + rớt xuống dòng, hoặc số tràn khỏi ô. */}
                  <p className="font-display text-[clamp(0.95rem,4.6vw,1.875rem)] font-bold leading-tight text-ocean-700">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ink-muted sm:text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=700&auto=format&fit=crop" alt="Văn phòng PSVTravel" className="col-span-2 h-56 w-full rounded-2xl object-cover shadow-card" />
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=500&auto=format&fit=crop" alt="Đội ngũ PSVTravel" className="h-40 w-full rounded-2xl object-cover shadow-card" />
              <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=500&auto=format&fit=crop" alt="Họp nhóm PSVTravel" className="h-40 w-full rounded-2xl object-cover shadow-card" />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-gold-400/25 blur-2xl" />
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sunset-400/20 blur-2xl" />
          </SectionReveal>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="relative overflow-hidden bg-deep-gradient py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-70" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Giá trị cốt lõi</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Điều làm nên PSVTravel</h2>
          </SectionReveal>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 0.1} className="group text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur transition-all duration-400 ease-enter group-hover:scale-110 group-hover:bg-white/20">
                  <v.icon className="h-6 w-6 text-teal-300" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-white/75">{v.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hành trình phát triển */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">Cột mốc</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">Hành trình phát triển</h2>
          </SectionReveal>

          <div className="relative mt-14">
            {/* Trục thời gian chuyển màu dần — mắt đi theo đúng chiều thời gian */}
            <div className="absolute left-[15px] top-0 h-full w-0.5 bg-gradient-to-b from-ocean-200 via-teal-300 to-gold-400 sm:left-1/2" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <SectionReveal
                  key={m.year}
                  delay={i * 0.08}
                  className={`relative flex flex-col gap-2 pl-10 sm:w-1/2 sm:pl-0 ${
                    i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
                  }`}
                >
                  {/* Badge luôn canh giữa đúng trên đường timeline, không phụ thuộc trái/phải để tránh lỗi đè chữ */}
                  <span className="absolute left-[15px] top-1 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-ocean-600 text-white ring-4 ring-foam sm:left-1/2">
                    <MapPinned className="h-3.5 w-3.5" />
                  </span>
                  <p className="font-display text-2xl font-bold text-gradient-warm">{m.year}</p>
                  <p className="font-display text-base font-semibold text-deep-900">{m.title}</p>
                  <p className="text-sm text-ink-muted">{m.desc}</p>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Đội ngũ */}
      <section className="bg-ocean-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">Con người PSVTravel</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">Đội ngũ đứng sau mỗi hành trình</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Những con người tận tâm, giàu kinh nghiệm — luôn sẵn sàng biến chuyến đi của bạn thành kỷ niệm khó quên.
            </p>
          </SectionReveal>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {team.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group text-center"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card">
                  <Image src={t.photo} alt={t.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 ease-enter group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-deep-950/70 to-transparent pb-3 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-ocean-700">
                      <LinkedinIcon className="h-4 w-4" />
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-ocean-700">
                      <Mail className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-deep-900">{t.name}</p>
                <p className="text-xs text-ink-subtle">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Khoảnh khắc đáng nhớ */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Hậu trường</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">Khoảnh khắc đáng nhớ</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Những khoảnh khắc gắn kết đội ngũ PSVTravel — từ văn phòng đến từng chuyến khảo sát tour thực tế.
            </p>
          </SectionReveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {moments.map((m, i) => (
              <MomentCard key={m.caption} m={m} i={i} onOpen={setActive} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-deep-950/92 p-6 backdrop-blur-sm"
          >
            <button onClick={() => setActive(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25" aria-label="Đóng">
              <X className="h-5 w-5" />
            </button>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="max-w-2xl">
              <img src={active.src} alt={active.caption} className="max-h-[75dvh] w-full rounded-2xl object-contain shadow-deep" />
              <p className="mt-4 text-center text-sm text-white/85">{active.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trích dẫn + CTA */}
      <section className="relative overflow-hidden bg-deep-gradient py-16 sm:py-20">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-75" />
        <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
          <SectionReveal>
            <Quote className="mx-auto h-9 w-9 text-gold-400" />
            <p className="mt-4 font-display text-xl font-semibold leading-relaxed text-white sm:text-2xl">
              &ldquo;Chúng tôi không chỉ bán những chuyến đi — chúng tôi trao đi những kỷ niệm.&rdquo;
            </p>
            <p className="mt-3 text-sm font-medium text-white/75">Nguyễn Anh Vũ — Nhà sáng lập PSVTravel</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/tour-trong-nuoc" className="btn-cta">
                Khám phá tour ngay <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/lien-he" className="btn-ghost">
                Liên hệ hợp tác
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
