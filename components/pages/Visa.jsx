"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileCheck2, Clock, ShieldCheck, ArrowRight, ChevronDown, Phone, BadgeCheck, Globe2,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { visaCountries } from "@/data/visa";

const steps = [
  { title: "Tư vấn hồ sơ", desc: "Chuyên viên visa đánh giá hồ sơ và tư vấn loại visa phù hợp." },
  { title: "Chuẩn bị giấy tờ", desc: "Hướng dẫn chi tiết danh sách giấy tờ cần thiết, hỗ trợ dịch thuật công chứng." },
  { title: "Nộp hồ sơ", desc: "Đại diện nộp hồ sơ tại Lãnh sự quán / Trung tâm tiếp nhận visa." },
  { title: "Nhận kết quả", desc: "Theo dõi tiến trình và bàn giao passport tận nơi khi có kết quả." },
];

const faqs = [
  { q: "Thời gian xử lý visa mất bao lâu?", a: "Tuỳ quốc gia, thời gian xử lý dao động từ 4 ngày (Đài Loan) đến 6 tuần (Mỹ, Canada). Chúng tôi sẽ thông báo thời gian cụ thể sau khi đánh giá hồ sơ." },
  { q: "Nếu hồ sơ bị từ chối thì sao?", a: "Chúng tôi hỗ trợ phân tích lý do từ chối và tư vấn phương án nộp lại. Phí dịch vụ được hoàn một phần theo chính sách công ty." },
  { q: "Có cần chứng minh tài chính không?", a: "Hầu hết các nước yêu cầu sao kê ngân hàng, sổ tiết kiệm hoặc giấy tờ chứng minh thu nhập. Đội ngũ tư vấn sẽ hướng dẫn cụ thể theo từng trường hợp." },
  { q: "Có thể làm visa gấp không?", a: "Một số quốc gia hỗ trợ dịch vụ visa nhanh (khẩn) với phụ phí. Vui lòng liên hệ hotline để được tư vấn trường hợp cụ thể." },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ocean-100 bg-white transition-shadow duration-300 hover:shadow-card">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <span className="font-display text-base font-semibold text-deep-900">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ocean-50"
        >
          <ChevronDown className="h-4 w-4 text-ocean-600" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-sm leading-relaxed text-ink-muted">{item.a}</p>
      </motion.div>
    </div>
  );
}

export default function Visa({ countries: apiCountries = [] }) {
  const [openFaq, setOpenFaq] = useState(0);

  // Ưu tiên dữ liệu từ API; nếu DB trống thì dùng data mẫu (chỉ nước cần visa)
  const countries = apiCountries.length
    ? apiCountries
    : visaCountries.filter((c) => c.required);

  return (
    <div>
      <PageHero
        eyebrow="Dịch vụ visa"
        title="Làm visa nhanh chóng, tỷ lệ đậu cao"
        description="Hỗ trợ trọn gói từ tư vấn hồ sơ đến nộp và nhận kết quả — tiết kiệm thời gian, tăng tỷ lệ thành công."
        crumbs={[{ label: "Làm visa" }]}
      />

      {/* Bảng giá theo quốc gia */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Dịch vụ nổi bật</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              Visa các quốc gia phổ biến
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Phí dịch vụ minh bạch, không phát sinh. Tỷ lệ đậu được thống kê từ hồ sơ thực tế của khách hàng PSVTravel.
            </p>
          </SectionReveal>

          {countries.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-ocean-200 bg-white py-16 text-center">
              <Globe2 className="mx-auto h-10 w-10 text-ocean-300" />
              <p className="mt-4 font-display text-lg font-semibold text-deep-900">Đang cập nhật danh sách quốc gia</p>
              <a href="tel:19001177" className="btn-cta mt-6 !px-6 !py-3 text-sm">
                <Phone className="h-4 w-4" /> Gọi tư vấn ngay
              </a>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {countries.map((c, i) => (
                <motion.div
                  key={c.slug ?? c.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="card-surface group relative overflow-hidden p-5"
                >
                  {/* Vạch nhấn trượt lên khi rê chuột — tín hiệu thẻ tương tác được */}
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-ocean-500 to-teal-500 transition-transform duration-400 ease-enter group-hover:scale-x-100" />

                  <div className="flex items-center gap-3">
                    {c.flagImage ? (
                      <img src={c.flagImage} alt={c.name} className="h-9 w-12 rounded object-cover shadow-sm ring-1 ring-ocean-100" />
                    ) : (
                      <span className="text-3xl">{c.flag || "🌐"}</span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-display text-base font-semibold text-deep-900">{c.name}</p>
                      {c.rate && (
                        <p className="flex items-center gap-1 text-xs font-medium text-teal-700">
                          <BadgeCheck className="h-3.5 w-3.5" /> Tỷ lệ đậu {c.rate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-ocean-50 pt-3">
                    <span className="flex items-center gap-1 text-xs text-ink-subtle">
                      <Clock className="h-3.5 w-3.5 text-ocean-500" /> {c.time || "—"}
                    </span>
                    <div className="text-right">
                      <p className="text-[0.7rem] text-ink-subtle">Phí từ</p>
                      <p className="font-display text-base font-bold text-sunset-700">{c.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quy trình */}
      <section className="bg-ocean-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">Quy trình</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              4 bước đơn giản, minh bạch
            </h2>
          </SectionReveal>

          <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Đường nối các bước — chuyển màu dần để mắt đi theo đúng thứ tự */}
            <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-ocean-200 via-teal-300 to-gold-300 lg:block" />
            {steps.map((s, i) => (
              <SectionReveal key={s.title} delay={i * 0.1} className="group relative text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-4 border-ocean-50 bg-ocean-600 font-display text-lg font-bold text-white shadow-md transition-transform duration-400 ease-enter group-hover:scale-110">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-deep-900">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionReveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">Giải đáp</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900">Câu hỏi thường gặp</h2>
          </SectionReveal>

          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <FaqItem key={f.q} item={f} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-deep-gradient py-16 text-center text-white">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-75" />
        <div className="relative mx-auto max-w-2xl px-5">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur">
            <FileCheck2 className="h-7 w-7 text-gold-400" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Cần tư vấn hồ sơ visa của bạn?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/85">
            Gửi thông tin để chuyên viên visa liên hệ tư vấn miễn phí trong 15 phút.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a href="tel:19001177" className="btn-cta">
              <Phone className="h-4 w-4" /> Gọi tư vấn miễn phí
            </a>
            <a href="/lien-he" className="btn-ghost">
              Gửi yêu cầu qua form <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <ShieldCheck className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 text-white/5" />
      </section>
    </div>
  );
}
