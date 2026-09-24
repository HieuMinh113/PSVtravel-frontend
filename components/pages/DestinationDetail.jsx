import Link from "next/link";
import { locHtml } from "@/app/lib/sanitize";
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import TourCard from "@/components/TourCard";

// Trang chi tiết điểm đến — server component (SEO). Hiển thị giới thiệu + tour liên quan.
export default function DestinationDetail({ destination, tours = [] }) {
  if (!destination) return null;
  const d = destination;

  return (
    <article>
      {/* Hero */}
      <section className="relative h-[48dvh] min-h-[340px] overflow-hidden">
        {d.image ? (
          <img src={d.image} alt={d.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-deep-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-950/92 via-deep-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-5 pb-10 pt-24 sm:px-8">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/75">
            <Link href="/" className="transition-colors hover:text-gold-300">Trang chủ</Link>
            <span>/</span>
            <Link href="/diem-den" className="transition-colors hover:text-gold-300">Điểm đến</Link>
            <span>/</span>
            <span className="text-white/90">{d.name}</span>
          </div>
          {d.region && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-200">
              <MapPin className="h-4 w-4" /> {d.region}
            </span>
          )}
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">{d.name}</h1>
          <span className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-gold-400 to-sunset-500" />
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="bg-foam py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {d.summary && (
            <p className="font-display text-lg leading-relaxed text-deep-900">{d.summary}</p>
          )}
          {d.description ? (
            <div className="prose-psv mt-8" dangerouslySetInnerHTML={{ __html: locHtml(d.description) }} />
          ) : null}
        </div>
      </section>

      {/* Tour liên quan */}
      {tours.length > 0 && (
        <section className="bg-ocean-50/50 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Hành trình gợi ý</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
                Tour {d.name} đang mở
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((t, i) => (
                <TourCard
                  key={t.slug ?? i}
                  tour={t}
                  basePath={t.type === "abroad" ? "/tour-nuoc-ngoai" : "/tour-trong-nuoc"}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-foam pb-16">
        <div className="mx-auto flex max-w-3xl justify-center px-5 sm:px-8">
          <Link
            href="/diem-den"
            className="flex min-h-[44px] items-center gap-2 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50"
          >
            <ArrowLeft className="h-4 w-4" /> Xem thêm điểm đến
          </Link>
        </div>
      </section>
    </article>
  );
}
