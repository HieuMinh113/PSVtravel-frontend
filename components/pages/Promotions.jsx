import Link from "next/link";
import Image from "next/image";
import { duocToiUu } from "@/app/lib/anh";
import { Tag, ArrowRight, Clock, Sparkles, Ticket, QrCode, BadgeCheck, ShieldCheck, Phone, ChevronRight, Plane, Palmtree, Stamp } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import TourCard from "@/components/TourCard";
import KiemTraVoucher from "@/components/voucher/KiemTraVoucher";
import { formatVND, breadcrumbJsonLd, faqJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { ngayVN } from "@/app/lib/voucher";

const BUOC = [
  { icon: Ticket, tieuDe: "Tìm mã trên voucher", moTa: "Mã in ngay dưới mã QR, dạng PSV-XXXX-XXXX." },
  { icon: QrCode, tieuDe: "Kiểm tra tại đây", moTa: "Gõ mã hoặc bấm Quét mã: biết ngay còn dùng được không, mệnh giá, hạn dùng." },
  { icon: BadgeCheck, tieuDe: "Dùng khi đặt dịch vụ", moTa: "Đưa voucher cho nhân viên PSV Travel — nhân viên quét mã xác nhận và trừ mệnh giá vào đơn." },
];

export function cauHoi(hotline) {
  return [
    { q: "Kiểm tra voucher PSV Travel ở đâu?", a: "Ngay trên trang này: gõ mã in dưới mã QR hoặc bấm “Quét mã”. Quét QR trên voucher bằng camera điện thoại cũng mở thẳng trang kết quả." },
    { q: "Mỗi voucher dùng được mấy lần?", a: "Một lần. Sau khi nhân viên xác nhận, kiểm tra lại mã sẽ thấy “Đã sử dụng” kèm ngày dùng." },
    { q: "Voucher có ghi tên người dùng không?", a: "Không — ai cầm voucher cũng dùng được. Hãy giữ voucher cẩn thận và không đăng ảnh mã lên mạng." },
    { q: "Voucher áp dụng cho dịch vụ nào, có đổi ra tiền mặt không?", a: "Theo điều kiện in trên voucher của từng chương trình. Kết quả kiểm tra ở đầu trang cũng hiện phần “Áp dụng” và “Điều kiện”." },
    { q: "Voucher hết hạn còn dùng được không?", a: "Voucher dùng được đến hết ngày hết hạn in trên voucher; sau ngày đó kiểm tra sẽ báo “Đã hết hạn”." },
    { q: "Bị mất voucher thì làm sao?", a: `Gọi hotline ${hotline} để được hỗ trợ. Nếu còn ảnh chụp mã, nhân viên có thể huỷ mã đó để người khác không dùng được.` },
  ];
}

function TheUuDai({ p }) {
  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-deep-900">
        {p.image ? (
          <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={!duocToiUu(p.image)} className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-deep-gradient" />
        )}
        {p.discount_label && (
          <span className="absolute left-3 top-3 rounded-full bg-sunset-700 px-3 py-1 text-sm font-bold text-white shadow">{p.discount_label}</span>
        )}
        {p.badge && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-sunset-700">
            <Sparkles className="h-3 w-3" /> {p.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-deep-900">{p.title}</h3>
        {p.description && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{p.description}</p>}
        <div className="mt-auto pt-4">
          {(p.price || p.old_price) && (
            <div className="flex flex-wrap items-baseline gap-2">
              {p.old_price && <span className="text-sm text-ink-subtle line-through">{formatVND(p.old_price)}</span>}
              {p.price ? <span className="font-display text-xl font-bold text-sunset-700">{formatVND(p.price)}</span> : null}
            </div>
          )}
          {p.ends_at && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ocean-700">
              <Clock className="h-3.5 w-3.5" /> Đến hết {ngayVN(p.ends_at)}
            </p>
          )}
          {p.link_url && (
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 transition-colors group-hover:text-ocean-800">
              Xem chi tiết <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </>
  );
  const cls = "group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ocean-100 transition-shadow hover:shadow-deep";

  return p.link_url ? <Link href={p.link_url} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>;
}

const LOI_TAT = [
  { to: "/tour-trong-nuoc", nhan: "Tour trong nước", moTa: "Biển đảo, Tây Bắc, miền Tây", icon: Palmtree },
  { to: "/tour-nuoc-ngoai", nhan: "Tour nước ngoài", moTa: "Châu Á, châu Âu, Úc, Mỹ", icon: Plane },
  { to: "/lam-visa", nhan: "Dịch vụ visa", moTa: "Hồ sơ trọn gói theo từng nước", icon: Stamp },
];

// Trang "Voucher & ưu đãi" (/khuyen-mai): ô kiểm tra voucher ngay đầu trang,
// các bước dùng voucher, ưu đãi đang chạy (admin thêm ở Marketing → Ưu đãi);
// chưa có ưu đãi thì hiện tour giá tốt để trang không trống.
export default function Promotions({ items = [], tours = [], hotline = "0907 870 707" }) {
  const tourGiam = tours.filter((t) => t.oldPrice && t.price && t.oldPrice > t.price);
  const tourHien = (tourGiam.length >= 3 ? tourGiam : tours).slice(0, 4);
  const faq = cauHoi(hotline);

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", url: SITE_URL }, { name: "Voucher & ưu đãi" }])} />
      <JsonLd data={faqJsonLd(faq)} />

      {/* ===== Đầu trang: giới thiệu + ô kiểm tra voucher ===== */}
      <section className="relative overflow-hidden bg-deep-gradient px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:190%_190%] animate-aurora opacity-80" />
        <div className="absolute inset-0 bg-duotone-glow opacity-70" />
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-sunset-500/15 blur-[100px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="text-center lg:text-left">
            <nav aria-label="Đường dẫn" className="mb-4 flex items-center justify-center gap-1.5 text-xs text-white/80 lg:justify-start">
              <Link href="/" className="vung-bam transition-colors hover:text-gold-300">Trang chủ</Link>
              <ChevronRight className="h-3 w-3 text-white/50" />
              <span className="font-medium text-white">Voucher &amp; ưu đãi</span>
            </nav>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> Ưu đãi PSV Travel
            </span>
            <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.12] text-white sm:text-5xl">
              Voucher &amp; <span className="text-gold-300">ưu đãi</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg lg:mx-0">
              Kiểm tra voucher bạn đang giữ còn dùng được không, và xem các chương trình giảm giá tour, visa đang áp dụng.
            </p>
            <ul className="mx-auto mt-6 grid max-w-xl gap-2.5 text-left text-sm text-white/90 sm:grid-cols-2 lg:mx-0">
              <li className="flex items-center gap-2"><QrCode className="h-4 w-4 shrink-0 text-teal-300" /> Quét QR hoặc gõ mã — có kết quả ngay</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-teal-300" /> Mỗi mã chỉ dùng một lần</li>
              <li className="flex items-center gap-2"><Tag className="h-4 w-4 shrink-0 text-teal-300" /> {items.length ? `${items.length} ưu đãi đang áp dụng` : "Ưu đãi tour, visa cập nhật trên trang"}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-teal-300" /> Hỗ trợ: <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="font-semibold underline-offset-2 hover:underline">{hotline}</a></li>
            </ul>
          </div>

          <div id="kiem-tra" className="scroll-mt-28 rounded-3xl bg-white p-5 shadow-deep sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-700">
                <Ticket className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-deep-900 sm:text-2xl">Kiểm tra voucher</h2>
                <p className="text-sm text-ink-muted">Xem voucher còn dùng được, mệnh giá và hạn sử dụng.</p>
              </div>
            </div>
            <div className="mt-5">
              <KiemTraVoucher />
            </div>
            <p className="mt-4 border-t border-ocean-100 pt-3 text-xs text-ink-muted">
              Voucher không ghi tên — ai cầm cũng dùng được. Giữ voucher cẩn thận như tiền mặt.
            </p>
          </div>
        </div>
      </section>

      {/* ===== 3 bước dùng voucher ===== */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <h2 className="text-center font-display text-2xl font-bold text-deep-900 sm:text-3xl">Dùng voucher trong 3 bước</h2>
          </SectionReveal>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {BUOC.map((b, i) => (
              <li key={b.tieuDe} className="relative rounded-3xl bg-foam p-6 ring-1 ring-ocean-100">
                <span className="absolute right-5 top-4 font-display text-4xl font-bold text-ocean-100">{i + 1}</span>
                <b.icon className="h-8 w-8 text-ocean-700" />
                <h3 className="mt-3 font-display text-lg font-bold text-deep-900">{b.tieuDe}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{b.moTa}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Ưu đãi đang áp dụng ===== */}
      <section className="bg-foam py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl font-bold text-deep-900 sm:text-3xl">
                {items.length ? <>Ưu đãi <span className="text-ocean-700">đang áp dụng</span></> : <>Tour <span className="text-ocean-700">giá tốt</span> đang mở bán</>}
              </h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                {items.length ? "Số lượng có hạn — đặt sớm để giữ mức giá tốt." : "Chương trình ưu đãi mới sẽ hiện tại đây. Trong lúc chờ, tham khảo các tour đang mở bán."}
              </p>
            </div>
            <Link href="/tour-nuoc-ngoai" className="vung-bam inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
              Xem tất cả tour <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionReveal>

          {items.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => <TheUuDai key={p.id ?? i} p={p} />)}
            </div>
          ) : tourHien.length > 0 ? (
            <div className={`mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 ${tourHien.length === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>
              {tourHien.map((tour, i) => (
                <TourCard key={tour.slug} tour={tour} index={i} basePath={tour.type === "domestic" ? "/tour-trong-nuoc" : "/tour-nuoc-ngoai"} />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {LOI_TAT.map((l) => (
                <Link key={l.to} href={l.to} className="group flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-ocean-100 transition-shadow hover:shadow-deep">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-700"><l.icon className="h-6 w-6" /></span>
                  <span>
                    <span className="block font-display text-lg font-bold text-deep-900">{l.nhan}</span>
                    <span className="block text-sm text-ink-muted">{l.moTa}</span>
                  </span>
                  <ArrowRight className="ml-auto h-5 w-5 text-ocean-700 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Mã nằm ở đâu + hỏi đáp ===== */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            {/* Voucher mẫu: chỉ chỗ in mã QR + mã chữ để khách biết tìm ở đâu */}
            <div className="rounded-3xl bg-foam p-5 ring-1 ring-ocean-100 sm:p-6">
              <h2 className="font-display text-xl font-bold text-deep-900">Mã nằm ở đâu trên voucher?</h2>
              <div className="relative mt-4 aspect-[155/100] overflow-hidden rounded-2xl bg-gradient-to-br from-ocean-600 via-ocean-500 to-teal-500 shadow-card" aria-hidden="true">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                <p className="absolute left-[7%] top-[12%] font-display text-[clamp(1.2rem,5vw,2rem)] font-bold tracking-wide text-white">VOUCHER</p>
                <p className="absolute left-[7%] top-[36%] text-[clamp(0.7rem,2.6vw,0.95rem)] font-semibold text-white/90">PSV Travel</p>
                <div className="absolute bottom-[7%] right-[5%] flex w-[22%] flex-col items-center rounded-lg bg-white p-[2%] shadow-lg ring-4 ring-gold-300/80">
                  <QrCode className="h-auto w-full text-deep-900" strokeWidth={1.6} />
                  <span className="mt-0.5 font-mono text-[clamp(0.4rem,1.3vw,0.6rem)] font-bold text-deep-900">PSV-XXXX-XXXX</span>
                </div>
                <span className="absolute bottom-[38%] right-[29%] rounded-full bg-gold-300 px-2.5 py-1 text-[clamp(0.6rem,2vw,0.75rem)] font-bold text-deep-900 shadow">Quét QR hoặc gõ mã này →</span>
              </div>
              <p className="mt-3 text-sm text-ink-muted">Ô trắng có mã QR và mã chữ thường ở một góc voucher (vị trí tuỳ mẫu). Mỗi mã khác nhau, dùng một lần.</p>
              <a href="#kiem-tra" className="vung-bam mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
                Kiểm tra mã ngay <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-foam p-5 ring-1 ring-ocean-100">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sunset-700 shadow-card"><Phone className="h-6 w-6" /></span>
              <div>
                <p className="text-sm text-ink-muted">Cần hỗ trợ về voucher?</p>
                <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="font-display text-xl font-bold text-deep-900 hover:text-ocean-700">{hotline}</a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-deep-900 sm:text-3xl">Câu hỏi về voucher</h2>
            <div className="mt-5 divide-y divide-ocean-100 rounded-3xl bg-foam px-5 ring-1 ring-ocean-100 sm:px-6">
              {faq.map((f) => (
                <details key={f.q} className="group py-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="vung-bam flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-deep-900">
                    {f.q}
                    <ChevronRight className="h-4 w-4 shrink-0 text-ocean-700 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-sm text-ink-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
