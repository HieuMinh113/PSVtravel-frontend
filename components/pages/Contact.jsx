"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/SocialIcons";

const offices = [
  { city: "TP. Hồ Chí Minh", address: "190 Pasteur, Quận 3, TP.HCM", phone: "028 7305 6789" },
  { city: "Hà Nội", address: "56 Trần Nhân Tông, Hai Bà Trưng, Hà Nội", phone: "024 3512 3388" },
  { city: "Cần Thơ", address: "12 Hòa Bình, Ninh Kiều, Cần Thơ", phone: "090 393 3788" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHero
        eyebrow="Liên hệ"
        title="Chúng tôi luôn sẵn sàng lắng nghe bạn"
        description="Có thắc mắc về tour, visa hay vé máy bay? Để lại lời nhắn, đội ngũ tư vấn viên sẽ phản hồi trong thời gian sớm nhất."
        crumbs={[{ label: "Liên hệ" }]}
      />

      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Thông tin liên hệ */}
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-500">Thông tin liên hệ</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900">Gặp gỡ đội ngũ PSVTravel</h2>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ocean-50">
                  <Phone className="h-5 w-5 text-ocean-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-deep-900">Hotline 24/7</p>
                  <p className="text-sm text-deep-800/60">1900 1177 (1.000đ/phút)</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ocean-50">
                  <Mail className="h-5 w-5 text-ocean-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-deep-900">Email hỗ trợ</p>
                  <p className="text-sm text-deep-800/60">hi@psvtravel.vn</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ocean-50">
                  <Clock className="h-5 w-5 text-ocean-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-deep-900">Giờ làm việc</p>
                  <p className="text-sm text-deep-800/60">Thứ 2 – Chủ nhật: 7:30 – 21:30</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-deep-900">Văn phòng đại diện</p>
              <div className="mt-3 space-y-3">
                {offices.map((o) => (
                  <div key={o.city} className="flex items-start gap-3 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" />
                    <p className="text-deep-800/70"><span className="font-semibold text-deep-900">{o.city}</span> — {o.address} · {o.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {[FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
                <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-ocean-50 text-ocean-700 transition-colors hover:bg-ocean-500 hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
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
                <CheckCircle2 className="h-14 w-14 text-ocean-500" />
                <h3 className="mt-4 font-display text-xl font-bold text-deep-900">Đã gửi thành công!</h3>
                <p className="mt-2 max-w-sm text-sm text-deep-800/60">
                  Cảm ơn bạn đã liên hệ. Đội ngũ tư vấn viên sẽ phản hồi trong vòng 15 phút làm việc.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-semibold text-ocean-600 hover:text-ocean-700">
                  Gửi lời nhắn khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display text-xl font-bold text-deep-900">Gửi lời nhắn cho chúng tôi</h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-deep-800/60">Họ và tên</label>
                    <input required placeholder="Nguyễn Văn A" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-deep-800/60">Số điện thoại</label>
                    <input required placeholder="09xx xxx xxx" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-deep-800/60">Email</label>
                  <input required type="email" placeholder="ban@email.com" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-deep-800/60">Chủ đề quan tâm</label>
                  <select className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm outline-none focus:border-ocean-400 focus:bg-white">
                    <option>Tư vấn tour trong nước</option>
                    <option>Tư vấn tour nước ngoài</option>
                    <option>Dịch vụ visa</option>
                    <option>Vé máy bay</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-deep-800/60">Lời nhắn</label>
                  <textarea required rows={4} placeholder="Nội dung bạn muốn trao đổi..." className="mt-1.5 w-full resize-none rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                </div>
                <button type="submit" className="btn-cta w-full !py-3.5">
                  Gửi lời nhắn <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </SectionReveal>
        </div>
      </section>

      {/* Bản đồ minh hoạ */}
      <section className="relative h-80 overflow-hidden bg-ocean-100">
        <iframe
          title="Bản đồ văn phòng"
          className="h-full w-full grayscale-[20%]"
          loading="lazy"
          src="https://www.google.com/maps?q=190+Pasteur,+Quan+3,+TP.HCM&output=embed"
        />
      </section>
    </div>
  );
}