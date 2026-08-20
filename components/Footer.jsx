"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  Phone, Mail, MapPin, Send, CheckCircle2, ArrowRight,
  BadgeCheck, Building2, FileSearch, CreditCard,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons";

export default function Footer({ settings = {} }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const hotline = settings.hotline || "1900 1177";
  const contactEmail = settings.email || "hi@psvtravel.vn";
  const address = settings.address || "190 Pasteur, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh";

  // ==== Khối pháp lý — lấy từ Cài đặt trong admin (nhóm "Pháp lý") ====
  // Cố ý KHÔNG đặt giá trị mặc định giả: dòng nào chưa nhập trong admin thì
  // đơn giản là không hiển thị. Ghi số giấy phép sai lên web thương mại
  // là vi phạm Luật Quảng cáo, và khách tra ra sai thì mất trắng niềm tin.
  const phapLy = [
    { label: "Tên pháp nhân", value: settings.legal_name },
    { label: "Giấy CN ĐKKD số", value: settings.business_registration, extra: settings.business_registration_place },
    { label: "Mã số thuế", value: settings.tax_code },
    { label: "Giấy phép lữ hành quốc tế số", value: settings.license_number, extra: settings.license_issuer },
    { label: "Người đại diện", value: settings.legal_representative },
  ].filter((d) => d.value);

  const chiNhanh = (settings.branch_addresses || "")
    .split("\n")
    .map((d) => d.trim())
    .filter(Boolean);

  const socials = [
    { Icon: FacebookIcon, href: settings.facebook },
    { Icon: InstagramIcon, href: settings.instagram },
    { Icon: YoutubeIcon, href: settings.youtube },
  ];

  const thanhToan = ["Chuyển khoản ngân hàng", "Thẻ VISA / MasterCard", "Tiền mặt tại văn phòng"];

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

            {/* Phương thức thanh toán — khách Việt tìm dòng này trước khi bấm đặt */}
            <div className="mt-6">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
                <CreditCard className="h-3.5 w-3.5" /> Thanh toán
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {thanhToan.map((t) => (
                  <span key={t} className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                    {t}
                  </span>
                ))}
              </div>
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
            <h4 className="font-display text-base font-semibold text-white/90">Hỗ trợ khách hàng</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li>
                <Link href="/tra-cuu-booking" className="flex items-center gap-1.5 font-semibold text-teal-400 transition-colors hover:text-teal-300">
                  <FileSearch className="h-3.5 w-3.5" /> Tra cứu đơn đặt tour
                </Link>
              </li>
              <li><Link href="/ve-chung-toi" className="transition-colors hover:text-teal-400">Về chúng tôi</Link></li>
              <li><Link href="/lien-he" className="transition-colors hover:text-teal-400">Liên hệ</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="transition-colors hover:text-teal-400">Chính sách bảo mật</Link></li>
            </ul>

            <h4 className="mt-6 font-display text-base font-semibold text-white/90">Liên hệ</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10"><Phone className="h-3.5 w-3.5 text-teal-400" /></span>
                <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="hover:text-teal-400">{hotline}</a> (24/7)
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10"><Mail className="h-3.5 w-3.5 text-teal-400" /></span>
                <a href={`mailto:${contactEmail}`} className="hover:text-teal-400">{contactEmail}</a>
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

            {chiNhanh.length > 0 && (
              <div className="mt-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
                  <Building2 className="h-3.5 w-3.5" /> Chi nhánh
                </p>
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-white/60">
                  {chiNhanh.map((cn) => (
                    <li key={cn}>{cn}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ===== KHỐI PHÁP LÝ =====
            Đây là thứ phân biệt một website lữ hành thật với một trang lừa đảo.
            Khách cẩn thận sẽ copy mã số thuế / số giấy phép đem đi tra —
            nên mọi con số ở đây phải khớp giấy tờ. */}
        {(phapLy.length > 0 || settings.moit_url) && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-400">
                  <BadgeCheck className="h-3.5 w-3.5" /> Thông tin pháp lý
                </p>
                <dl className="mt-3 space-y-1.5 text-xs leading-relaxed text-white/65">
                  {phapLy.map((d) => (
                    <div key={d.label} className="flex flex-wrap gap-x-1.5">
                      <dt className="text-white/45">{d.label}:</dt>
                      <dd className="font-medium text-white/85">
                        {d.value}
                        {d.extra && <span className="font-normal text-white/50"> — {d.extra}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Huy hiệu "Đã thông báo Bộ Công Thương" chỉ hiện khi đã có link xác nhận thật
                  ở online.gov.vn. Muốn dùng ảnh huy hiệu chính thức thì tải file PNG mà
                  online.gov.vn cấp về đặt vào /public rồi thay <span> bằng <Image>. */}
              {settings.moit_url && (
                <a
                  href={settings.moit_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex shrink-0 items-center gap-2.5 self-start rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 transition-colors hover:border-teal-400/50 hover:bg-white/10"
                >
                  <BadgeCheck className="h-7 w-7 shrink-0 text-teal-400" />
                  <span className="text-left text-[11px] leading-tight text-white/75">
                    Đã thông báo
                    <br />
                    <strong className="text-xs text-white">Bộ Công Thương</strong>
                  </span>
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/75 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.legal_name || settings.company_name || "PSVTravel"}. Bảo lưu mọi quyền.</p>
          <p className="text-white/55">
            {settings.license_number
              ? `Giấy phép lữ hành quốc tế số ${settings.license_number}`
              : "Kinh doanh dịch vụ lữ hành theo giấy phép do cơ quan quản lý du lịch cấp"}
          </p>
        </div>
      </div>
    </footer>
  );
}
