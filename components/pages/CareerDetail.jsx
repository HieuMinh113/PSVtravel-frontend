import Link from "next/link";
import { Briefcase, MapPin, Clock, Wallet, Users, CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";

function ngayVietNam(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// Trang chi tiết tin tuyển dụng — server component (SEO).
export default function CareerDetail({ job }) {
  if (!job) return null;
  const j = job;

  const meta = [
    j.department && { icon: Briefcase, text: j.department },
    j.location && { icon: MapPin, text: j.location },
    j.employment_type && { icon: Clock, text: j.employment_type },
    j.salary_range && { icon: Wallet, text: j.salary_range },
    j.quantity && { icon: Users, text: `${j.quantity} người` },
    j.deadline && { icon: CalendarDays, text: `Hạn nộp: ${ngayVietNam(j.deadline)}` },
  ].filter(Boolean);

  return (
    <article>
      <section className="relative overflow-hidden bg-deep-gradient px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:190%_190%] animate-aurora opacity-80" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/75">
            <Link href="/" className="transition-colors hover:text-gold-300">Trang chủ</Link>
            <span>/</span>
            <Link href="/tuyen-dung" className="transition-colors hover:text-gold-300">Tuyển dụng</Link>
            <span>/</span>
            <span className="line-clamp-1 text-white/90">{j.title}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{j.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
            {meta.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <m.icon className="h-4 w-4 text-gold-300" /> {m.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foam py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-10">
            {j.description && (
              <div>
                <h2 className="font-display text-xl font-bold text-deep-900">Mô tả công việc</h2>
                <div className="prose-psv mt-4" dangerouslySetInnerHTML={{ __html: j.description }} />
              </div>
            )}
            {j.requirements && (
              <div>
                <h2 className="font-display text-xl font-bold text-deep-900">Yêu cầu ứng viên</h2>
                <div className="prose-psv mt-4" dangerouslySetInnerHTML={{ __html: j.requirements }} />
              </div>
            )}
            {j.benefits && (
              <div>
                <h2 className="font-display text-xl font-bold text-deep-900">Quyền lợi</h2>
                <div className="prose-psv mt-4" dangerouslySetInnerHTML={{ __html: j.benefits }} />
              </div>
            )}

            <Link
              href="/tuyen-dung"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50"
            >
              <ArrowLeft className="h-4 w-4" /> Xem vị trí khác
            </Link>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ocean-100">
              <h3 className="font-display text-lg font-bold text-deep-900">Ứng tuyển vị trí này</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Gửi hồ sơ (CV) của bạn cho chúng tôi. Đội ngũ nhân sự sẽ liên hệ trong thời gian sớm nhất.
              </p>
              <Link href="/lien-he" className="btn-cta mt-5 w-full !py-3 text-sm">
                Gửi hồ sơ ứng tuyển <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}
