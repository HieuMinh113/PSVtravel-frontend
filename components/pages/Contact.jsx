"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle, Building2,
  Loader2, AlertCircle,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/SocialIcons";


export default function Contact({ settings = {} }) {
  const [submitted, setSubmitted] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Tư vấn tour trong nước",
    message: "",
    website: "", // ô bẫy chống bot, người thật không nhìn thấy
  });

  const doiO = (ten) => (e) => setForm((f) => ({ ...f, [ten]: e.target.value }));

  const hotline = settings.hotline || "0907 870 707";

  // Danh sách văn phòng lấy từ Cài đặt trong admin.
  //
  // Trước đây viết cứng ba văn phòng ở TP.HCM, Hà Nội và Cần Thơ — công ty chỉ
  // có một trụ sở, và địa chỉ ghi ở đây còn sai luôn so với giấy tờ. Khách gọi
  // vào số không có thật hoặc tìm tới địa chỉ không tồn tại là mất khách ngay.
  //
  // Trụ sở chính lấy từ ô "Địa chỉ", chi nhánh lấy từ ô "Địa chỉ chi nhánh"
  // (mỗi dòng một chi nhánh, có thể ghi kèm số điện thoại sau dấu gạch đứng).
  const vanPhong = [
    {
      city: "Trụ sở chính",
      address:
        settings.address || "529 Huỳnh Tấn Phát, Phường Tân Thuận, Quận 7, TP. Hồ Chí Minh",
      phone: hotline,
    },
    ...(settings.branch_addresses || "")
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean)
      .map((dong, i) => {
        // Cho phép ghi "Tên chi nhánh | Địa chỉ | Số điện thoại"
        const phan = dong.split("|").map((x) => x.trim());
        return {
          city: phan.length > 1 ? phan[0] : `Chi nhánh ${i + 1}`,
          address: phan.length > 1 ? phan[1] : dong,
          phone: phan[2] || hotline,
        };
      }),
  ];
  const contactEmail = settings.email || "hi@psvtravel.com";
  const workingHours = settings.working_hours || "Thứ 2 – Chủ nhật: 7:30 – 21:30";

  const socials = [
    { Icon: FacebookIcon, href: settings.facebook, label: "Facebook" },
    { Icon: InstagramIcon, href: settings.instagram, label: "Instagram" },
    { Icon: YoutubeIcon, href: settings.youtube, label: "YouTube" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dangGui) return;

    setDangGui(true);
    setLoi("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          setLoi("Bạn đã gửi nhiều lời nhắn liên tiếp. Vui lòng gọi hotline để được hỗ trợ ngay.");
          return;
        }
        // Laravel trả lỗi theo từng ô trong `errors` — gom lại thành một dòng
        const chiTiet = data?.errors ? Object.values(data.errors).flat().join(" ") : null;
        setLoi(chiTiet || data?.message || "Gửi lời nhắn thất bại. Vui lòng thử lại.");
        return;
      }

      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", subject: "Tư vấn tour trong nước", message: "", website: "" });
    } catch {
      setLoi("Không kết nối được máy chủ. Vui lòng gọi hotline giúp chúng tôi.");
    } finally {
      setDangGui(false);
    }
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
                {vanPhong.map((o) => (
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
                <form onSubmit={handleSubmit} className="relative space-y-5">
                  <div>
                    <h3 className="font-display text-xl font-bold text-deep-900">Gửi lời nhắn cho chúng tôi</h3>
                    <p className="mt-1 text-sm text-ink-muted">Chúng tôi phản hồi trong vòng 15 phút làm việc.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Họ và tên</label>
                      <input required value={form.name} onChange={doiO("name")} placeholder="Nguyễn Văn A" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Số điện thoại</label>
                      <input required type="tel" inputMode="tel" value={form.phone} onChange={doiO("phone")} placeholder="09xx xxx xxx" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Email <span className="font-normal text-ink-subtle">(không bắt buộc)</span></label>
                    <input type="email" value={form.email} onChange={doiO("email")} placeholder="ban@email.com" className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Chủ đề quan tâm</label>
                    <select value={form.subject} onChange={doiO("subject")} className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white">
                      <option>Tư vấn tour trong nước</option>
                      <option>Tư vấn tour nước ngoài</option>
                      <option>Dịch vụ visa</option>
                      <option>Vé máy bay</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Lời nhắn</label>
                    <textarea required rows={4} minLength={10} maxLength={2000} value={form.message} onChange={doiO("message")} placeholder="Nội dung bạn muốn trao đổi..." className="mt-1.5 w-full resize-none rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
                  </div>
                  {/* Ô bẫy chống bot: ẩn khỏi mắt người và khỏi trình đọc màn hình.
                      Bot điền hết mọi ô sẽ tự lộ ra và bị backend từ chối. */}
                  <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Đừng điền ô này</label>
                    <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={doiO("website")} />
                  </div>

                  {loi && (
                    <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{loi}</span>
                    </div>
                  )}

                  <button type="submit" disabled={dangGui} className="btn-cta w-full !py-3.5 disabled:opacity-60">
                    {dangGui ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Đang gửi...</>
                    ) : (
                      <>Gửi lời nhắn <Send className="h-4 w-4" /></>
                    )}
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
          src={`https://www.google.com/maps?q=${encodeURIComponent(vanPhong[0].address)}&output=embed`}
        />
      </section>
    </div>
  );
}
