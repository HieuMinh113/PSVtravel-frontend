import Link from "next/link";
import { CalendarDays, ChevronDown, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import TourCard from "@/components/TourCard";
import SectionReveal from "@/components/SectionReveal";

// Trang tour theo mùa / dịp (/tour-tet, /tour-he…). Server component: giới
// thiệu, tour khởi hành trong dịp, hỏi đáp — đều có sẵn trong HTML cho Google.
// Hỏi đáp dùng <details> gốc của trình duyệt: mở / đóng không cần JavaScript.
export default function TrangMuaDip({ trang, khoangNgay }) {
  const p = trang;
  const tours = p.tours || [];

  return (
    <>
      <PageHero
        eyebrow="Tour theo mùa · dịp lễ"
        title={p.name}
        description={`Khởi hành ${khoangNgay}${tours.length ? ` · ${tours.length} tour đang nhận khách` : ""}`}
        crumbs={[{ label: p.name }]}
        backgroundImages={p.cover_image ? [p.cover_image] : undefined}
      />

      {p.intro && (
        <section className="bg-foam pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <p className="whitespace-pre-line text-lg leading-relaxed text-ink">{p.intro}</p>
          </div>
        </section>
      )}

      <section className="bg-foam py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="mb-8 flex items-center gap-2 font-display text-2xl font-bold text-deep-900 sm:text-3xl">
            <CalendarDays className="h-7 w-7 text-ocean-600" aria-hidden="true" />
            <h2>Tour khởi hành {khoangNgay}</h2>
          </SectionReveal>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((t, i) => (
                <TourCard
                  key={t.slug}
                  tour={t}
                  index={i}
                  basePath={t.type === "abroad" ? "/tour-nuoc-ngoai" : "/tour-trong-nuoc"}
                />
              ))}
            </div>
          ) : (
            // Chưa có tour mở bán cho dịp này: vẫn giữ trang (link quảng cáo, Google)
            // và mời khách để lại liên hệ thay vì trang trống
            <div className="card-surface mx-auto max-w-2xl p-8 text-center">
              <p className="text-lg font-semibold text-deep-900">Lịch tour dịp này đang được cập nhật.</p>
              <p className="mt-2 text-ink-muted">
                Gọi hotline hoặc gửi yêu cầu để tư vấn viên báo lịch và giữ chỗ sớm cho bạn.
              </p>
              <Link href="/lien-he" className="btn-cta mt-5 inline-flex !px-6 !py-3 text-sm">
                <Phone className="h-4 w-4" /> Gửi yêu cầu tư vấn
              </Link>
            </div>
          )}
        </div>
      </section>

      {p.faqs?.length > 0 && (
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="font-display text-2xl font-bold text-deep-900 sm:text-3xl">Câu hỏi thường gặp</h2>
            <div className="mt-6 space-y-3">
              {p.faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl bg-ocean-50/60 px-5 py-4 open:bg-ocean-50">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-deep-900 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-ocean-600 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
