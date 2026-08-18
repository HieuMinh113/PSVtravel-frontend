"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons";

export default function Footer({ settings = {} }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const hotline = settings.hotline || "1900 1177";
  const contactEmail = settings.email || "hi@psvtravel.vn";
  const address = settings.address || "190 Pasteur, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh";

  const socials = [
    { Icon: FacebookIcon, href: settings.facebook },
    { Icon: InstagramIcon, href: settings.instagram },
    { Icon: YoutubeIcon, href: settings.youtube },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden bg-deep-gradient text-white">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-ocean-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

      {/* Dải đăng ký nhận ưu đãi — nổi lên trên nền footer, tạo điểm nhấn */}
      <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-gradient-to-r from-ocean-500 to-teal-500 p-6 shadow-glow sm:flex-row sm:p-8">
          <div className="text-center sm:text-left">
            <p className="font-display text-lg font-bold sm:text-xl">Đừng bỏ lỡ ưu đãi mới nhất</p>
            <p className="mt-1 text-sm text-white/80">Nhận thông tin khuyến mãi tour hè, vé máy bay giá tốt mỗi tuần.</p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur">
              <CheckCircle2 className="h-4 w-4" /> Đã đăng ký thành công!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn"
                className="w-full rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/60 outline-none backdrop-blur focus:border-white/60"
              />
              <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ocean-700 transition-transform hover:scale-105" aria-label="Đăng ký">
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="PSVTravel" width={900} height={349} className="h-11 w-auto object-contain" />
              <span className="font-display text-xl font-bold">
                PSV<span className="text-teal-400">Travel</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              Đồng hành cùng bạn trên mọi hành trình — từ những bãi biển Việt Nam trong xanh
              đến những vùng đất mới lạ khắp thế giới.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href || "#"}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-teal-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-white/90">Khám phá</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li><Link href="/tour-trong-nuoc" className="transition-colors hover:text-teal-400">Tour trong nước</Link></li>
              <li><Link href="/tour-nuoc-ngoai" className="transition-colors hover:text-teal-400">Tour nước ngoài</Link></li>
              <li><Link href="/ve-may-bay" className="transition-colors hover:text-teal-400">Vé máy bay</Link></li>
              <li><Link href="/lam-visa" className="transition-colors hover:text-teal-400">Làm visa</Link></li>
              <li><Link href="/cam-nang" className="transition-colors hover:text-teal-400">Cẩm nang du lịch</Link></li>
              <li><Link href="/khoanh-khac-du-khach" className="transition-colors hover:text-teal-400">Khoảnh khắc du khách</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-white/90">Công ty</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li><Link href="/ve-chung-toi" className="transition-colors hover:text-teal-400">Về chúng tôi</Link></li>
              <li><Link href="/lien-he" className="transition-colors hover:text-teal-400">Liên hệ</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="transition-colors hover:text-teal-400">Chính sách bảo mật</Link></li>
              <li><a href="#" className="transition-colors hover:text-teal-400">Tuyển dụng</a></li>
            </ul>

            <h4 className="mt-6 font-display text-base font-semibold text-white/90">Liên hệ</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10"><Phone className="h-3.5 w-3.5 text-teal-400" /></span>
                {hotline} (24/7)
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10"><Mail className="h-3.5 w-3.5 text-teal-400" /></span>
                {contactEmail}
              </li>
            </ul>
          </div>

          {/* Bản đồ văn phòng thật */}
          <div>
            <h4 className="font-display text-base font-semibold text-white/90">Văn phòng chính</h4>
            <p className="mt-3 flex items-start gap-2.5 text-sm text-white/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
              {address}
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d295.5717490899699!2d106.72970614717165!3d10.743722563232383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbcd98d0b27b3a57%3A0xfb2c9ac902c59146!2zQ8OUTkcgVFkgQ-G7lCBQSOG6pk4gRFUgTOG7ikNIIFAuUy5WIFRSQVZFTA!5e0!3m2!1svi!2s!4v1784579444253!5m2!1svi!2s"
                width="100%"
                height="160"
                style={{ border: 0, display: "block", filter: "grayscale(15%) contrast(1.05)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Bản đồ văn phòng PSVTravel"
              />
            </div>
            <a
              href="https://www.google.com/maps?q=190+Pasteur,+Quan+3,+TP.HCM"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
            >
              Chỉ đường trên Google Maps <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/75 sm:flex-row">
          <p>© 2026 {settings.company_name || "PSVTravel"}. Bảo lưu mọi quyền.</p>
          <p>Giấy phép kinh doanh lữ hành quốc tế số 79-234/2026/TCDL-GP LHQT</p>
        </div>
      </div>
    </footer>
  );
}
