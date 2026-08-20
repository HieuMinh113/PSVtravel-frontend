"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle, Building2,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/SocialIcons";

const offices = [
  { city: "TP. Hồ Chí Minh", address: "190 Pasteur, Quận 3, TP.HCM", phone: "028 7305 6789" },
  { city: "Hà Nội", address: "56 Trần Nhân Tông, Hai Bà Trưng, Hà Nội", phone: "024 3512 3388" },
  { city: "Cần Thơ", address: "12 Hòa Bình, Ninh Kiều, Cần Thơ", phone: "090 393 3788" },
];

export default function Contact({ settings = {} }) {
  const [submitted, setSubmitted] = useState(false);

  const hotline = settings.hotline || "1900 1177";
  const contactEmail = settings.email || "hi@psvtravel.vn";
  const workingHours = settings.working_hours || "Thứ 2 – Chủ nhật: 7:30 – 21:30";

  const socials = [
    { Icon: FacebookIcon, href: settings.facebook, label: "Facebook" },
    { Icon: InstagramIcon, href: settings.instagram, label: "Instagram" },
    { Icon: YoutubeIcon, href: settings.youtube, label: "YouTube" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Ba kênh liên hệ chính — trình bày thành thẻ bấm được thay vì dòng chữ tĩnh,
  // để khách chạm một lần là gọi/gửi mail được ngay trên điện thoại.
  const kenhLienHe = [
    {
      icon: Phone,
      label: "Hotline 24/7",
      value: hotline,
      href: `tel:${hotline.replace(/[^0-9]/g, "")}`,
      mau: "from-sunset-500 to-sunset-600",
    },
    {
      icon: Mail,
      label: "Email hỗ trợ",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      mau: "from-ocean-500 to-ocean-600",
    },
    {
      icon: Clock,
      label: "Giờ làm việc",
      value: workingHours,
      href: null,
      mau: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Liên hệ"
        title="Chúng tôi luôn sẵn sàng lắng nghe bạn"
        description="Có thắc mắc về tour, visa hay vé máy bay? Để lại lời nhắn, đội ngũ tư vấn viên sẽ phản hồi trong thời gian sớm nhất."
        crumbs={[{ label: "Liên hệ" }]}
      />

      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Ba kênh liên hệ nhanh */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {kenhLienHe.map((k, i) => {
              const Boc = k.href ? "a" : "div";
              return (
                <SectionReveal key={k.label} delay={i * 0.08}>
                  <Boc
                    {...(k.href ? { href: k.href } : {})}
                    className={`card-surface group flex h-full items-start gap-4 p-5 ${k.href ? "cursor-pointer" : ""}`}
                  >
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${k.mau} text-white shadow transition-transform duration-400 ease-enter group-hover:scale-110`}>
                      <k.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">{k.label}</p>
                      <p className="mt-1 font-display text-base font-bold text-deep-900">{k.value}</p>
                    </div>
                  </Boc>
                </SectionReveal>
              );
            })}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
            {/* Văn phòng + mạng xã hội */}
            <SectionReveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Hệ thống văn phòng</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-deep-900">Ghé thăm chúng tôi</h2>

              <div className="mt-7 space-y-3">
                {offices.map((o) => (
                  <div key={o.city} className="card-surface group flex items-start gap-4 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-700 transition-colors group-hover:bg-ocean-100">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-deep-900">{o.city}</p>
                      <p className="mt-0.5 flex items-start gap-1.5 text-sm text-ink-muted">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ocean-500" />
                        {o.address}
                      </p>
                      <a
                        href={`tel:${o.phone.replace(/[^0-9]/g, "")}`}
                        className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 transition-colors hover:text-sunset-700"
                      >
                        <Phone className="h-3.5 w-3.5" /> {o.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-deep-900">Kết nối với chúng tôi</p>
                <div className="mt-3 flex gap-3">
                  {socials.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href || "#"}
                      target={href ? "_blank" : undefined}
                      rel={href ? "noopener noreferrer" : undefined}
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full bg-white text-ocean-700 shadow-card transition-all duration-300 ease-enter hover:-translate-y-1 hover:bg-ocean-600 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                  <a
                    href={settings.zalo ? (settings.zalo.startsWith("http") ? settings.zalo : `https://zalo.me/${settings.zalo.replace(/[^0-9]/g, "")}`) : "https://zalo.me/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zalo"
                    className="grid h-11 w-11 place-items-center rounded-full bg-white text-ocean-700 shadow-card transition-all duration-300 ease-enter hover:-translate-y-1 hover:bg-ocean-600 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </SectionReveal>

            {/* Form liên hệ */}
            <SectionReveal delay={0.1} className="card-surface p-6 sm:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center py-16 text-center"
                >
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-50">
                    <CheckCircle2 className="h-11 w-11 text-teal-600" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-deep-900">Đã gửi thành công!</h3>
                  <p className="mt-2 max-w-sm text-sm text-ink-muted">
                    Cảm ơn bạn đã liên hệ. Đội ngũ tư vấn viên sẽ phản hồi trong vòng 15 phút làm việc.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
                    Gửi lời nhắn khác
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-display text-xl font-bold text-deep-900">Gửi lời nhắn cho chúng tôi</h3>
                    <p className="mt-1 text-sm text-ink-muted">Chúng tôi phản hồi trong vòng 15 phút làm việc.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Họ và tên</label>
                      <input required placeholder="Nguyễn Văn A" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Số điện thoại</label>
                      <input required placeholder="09xx xxx xxx" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Email</label>
                    <input required type="email" placeholder="ban@email.com" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Chủ đề quan tâm</label>
                    <select className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white">
                      <option>Tư vấn tour trong nước</option>
                      <option>Tư vấn tour nước ngoài</option>
                      <option>Dịch vụ visa</option>
                      <option>Vé máy bay</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Lời nhắn</label>
                    <textarea required rows={4} placeholder="Nội dung bạn muốn trao đổi..." className="mt-1.5 w-full resize-none rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
                  </div>
                  <button type="submit" className="btn-cta w-full !py-3.5">
                    Gửi lời nhắn <Send className="h-4 w-4" />
                  </button>
                  <p className="text-center text-xs text-ink-subtle">
                    Hoặc gọi trực tiếp <a href={`tel:${hotline.replace(/[^0-9]/g, "")}`} className="font-semibold text-sunset-700 hover:underline">{hotline}</a> để được hỗ trợ ngay.
                  </p>
                </form>
              )}
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Bản đồ minh hoạ */}
      <section className="relative h-80 overflow-hidden bg-ocean-100">
        <iframe
          title="Bản đồ văn phòng"
          className="h-full w-full grayscale-[15%]"
          loading="lazy"
          src="https://www.google.com/maps?q=190+Pasteur,+Quan+3,+TP.HCM&output=embed"
        />
      </section>
    </div>
  );
}
