import Link from "next/link";
import { Clock, BadgeCheck, FileCheck2, Phone, ArrowRight, Wallet } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

// Trang chi tiết dịch vụ visa một quốc gia.
//
// Là server component (không "use client"): toàn bộ nội dung — tên nước, phí,
// thời gian, hồ sơ cần chuẩn bị, phần mô tả admin soạn — nằm sẵn trong HTML
// dựng sẵn, Google và cỗ máy AI đọc được ngay. Không có tương tác nào cần
// JavaScript nên không cần đẩy sang phía trình duyệt.
export default function VisaDetail({ visa, related = [], settings = {} }) {
  const hotline = settings.hotline || "0907 870 707";
  const soGoi = hotline.replace(/[^0-9+]/g, "");

  const chiSo = [
    { icon: Wallet, nhan: "Phí dịch vụ từ", giaTri: visa.price, mau: "text-sunset-700" },
    { icon: Clock, nhan: "Thời gian xử lý", giaTri: visa.time || "Liên hệ", mau: "text-deep-900" },
    visa.rate && { icon: BadgeCheck, nhan: "Tỷ lệ đậu", giaTri: visa.rate, mau: "text-teal-700" },
  ].filter(Boolean);

  return (
    <div>
      <PageHero
        eyebrow="Dịch vụ visa"
        title={`Visa ${visa.typeLabel} ${visa.name}`}
        description={`Hỗ trợ trọn gói hồ sơ xin visa ${visa.name}: tư vấn, chuẩn bị giấy tờ, đặt lịch và nộp hồ sơ. Tỷ lệ đậu cao, minh bạch chi phí.`}
        crumbs={[{ label: "Làm visa", to: "/lam-visa" }, { label: visa.name }]}
      />

      <section className="bg-foam py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Cột nội dung chính */}
          <div>
            {/* Ba chỉ số quan trọng nhất */}
            <SectionReveal className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {chiSo.map((c) => (
                <div key={c.nhan} className="card-surface flex items-center gap-3 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-600">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-ink-subtle">{c.nhan}</p>
                    <p className={`font-display text-lg font-bold ${c.mau}`}>{c.giaTri}</p>
                  </div>
                </div>
              ))}
            </SectionReveal>

            {/* Hồ sơ cần chuẩn bị */}
            {visa.documents.length > 0 && (
              <SectionReveal delay={0.05} className="mt-8 card-surface p-6 sm:p-8">
                <h2 className="flex items-center gap-2 font-display text-xl font-bold text-deep-900">
                  <FileCheck2 className="h-5 w-5 text-ocean-500" /> Hồ sơ cần chuẩn bị
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {visa.documents.map((d, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-ink-muted">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink-subtle">
                  Danh sách trên là hồ sơ cơ bản. Tuỳ trường hợp cụ thể, chuyên viên có thể hướng
                  dẫn bổ sung giấy tờ cho phù hợp.
                </p>
              </SectionReveal>
            )}

            {/* Phần mô tả admin soạn (văn bản định dạng) */}
            {visa.description?.trim() ? (
              <SectionReveal delay={0.1} className="mt-8 card-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-deep-900">
                  Thông tin chi tiết visa {visa.name}
                </h2>
                <div
                  className="prose-psv mt-4 text-ink-muted"
                  dangerouslySetInnerHTML={{ __html: visa.description }}
                />
              </SectionReveal>
            ) : (
              <SectionReveal delay={0.1} className="mt-8 card-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-deep-900">
                  Thông tin chi tiết visa {visa.name}
                </h2>
                <p className="mt-3 text-sm text-ink-muted">
                  Chuyên viên visa của PSV Travel sẽ tư vấn chi tiết loại visa, điều kiện và hồ sơ
                  phù hợp với trường hợp của bạn. Gọi <strong className="text-deep-900">{hotline}</strong>{" "}
                  để được hỗ trợ miễn phí.
                </p>
              </SectionReveal>
            )}
          </div>

          {/* Cột liên hệ — sticky trên desktop */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-surface overflow-hidden ring-1 ring-ocean-100">
              <div className="flex items-center gap-3 bg-gradient-to-r from-ocean-600 to-teal-600 px-6 py-5 text-white">
                {visa.flagImage ? (
                  <img
                    src={visa.flagImage}
                    alt={`Cờ ${visa.name}`}
                    className="h-9 w-12 rounded object-cover shadow-sm ring-1 ring-white/30"
                  />
                ) : (
                  <span className="text-3xl">🌐</span>
                )}
                <div>
                  <p className="font-display text-base font-bold">Visa {visa.name}</p>
                  <p className="text-xs text-white/85">{visa.typeLabel} · Hỗ trợ trọn gói hồ sơ</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-end justify-between border-b border-ocean-50 pb-4">
                  <span className="text-sm text-ink-subtle">Phí dịch vụ từ</span>
                  <span className="font-display text-2xl font-bold text-sunset-700">{visa.price}</span>
                </div>

                <a
                  href={`tel:${soGoi}`}
                  className="btn-cta mt-5 w-full !py-3.5"
                >
                  <Phone className="h-4 w-4" /> Gọi tư vấn {hotline}
                </a>
                <Link
                  href="/lien-he"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-ocean-200 px-5 py-3 text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-50"
                >
                  Gửi yêu cầu tư vấn <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="mt-4 text-center text-xs text-ink-subtle">
                  Tư vấn miễn phí — chuyên viên phản hồi trong 15 phút làm việc.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Các quốc gia khác */}
      {related.length > 0 && (
        <section className="bg-ocean-50/50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionReveal className="mb-6 font-display text-2xl font-bold text-deep-900">
              Dịch vụ visa quốc gia khác
            </SectionReveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/lam-visa/${c.slug}`}
                  className="card-surface group flex flex-col items-center gap-2 p-4 text-center transition-transform hover:-translate-y-1"
                >
                  {c.flagImage ? (
                    <img src={c.flagImage} alt={`Cờ ${c.name}`} className="h-8 w-11 rounded object-cover ring-1 ring-ocean-100" />
                  ) : (
                    <span className="text-2xl">🌐</span>
                  )}
                  <span className="text-sm font-semibold text-deep-900 group-hover:text-ocean-700">{c.name}</span>
                  {c.rate && <span className="text-xs text-teal-700">Đậu {c.rate}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
