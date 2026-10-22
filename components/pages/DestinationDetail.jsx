import Image from "next/image";
import Link from "next/link";
import { locHtml } from "@/app/lib/sanitize";
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import TourCard from "@/components/TourCard";
import { duocToiUu } from "@/app/lib/anh";

// Trang chi tiết điểm đến — server component (SEO). Hiển thị giới thiệu + tour liên quan.
export default function DestinationDetail({ destination, tours = [], toursKhac = [] }) {
  if (!destination) return null;
  const d = destination;

  return (
    <article>
      {/* Hero */}
      <section className="relative h-[48dvh] min-h-[340px] overflow-hidden">
        {d.image ? (
          <Image src={d.image} alt={d.name} fill preload sizes="100vw" unoptimized={!duocToiUu(d.image)} className="object-cover" />
        ) : (
          <div className="h-full w-full bg-deep-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-950/92 via-deep-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-5 pb-10 pt-24 sm:px-8">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/75">
            <Link href="/" className="vung-bam transition-colors hover:text-gold-300">Trang chủ</Link>
            <span>/</span>
            <Link href="/diem-den" className="vung-bam transition-colors hover:text-gold-300">Điểm đến</Link>
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

      {/* Tour đúng điểm đến, rồi tour khác cùng vùng — hai nhóm tách bạch để
          tiêu đề "Tour {tên điểm}" không gom nhầm tour nơi khác */}
      {[
        { ds: tours, tieuDe: `Tour ${d.name} đang mở` },
        { ds: toursKhac, tieuDe: tours.length ? "Tour khác cùng khu vực" : `Tour cùng khu vực${d.region ? ` ${d.region}` : ""}` },
      ]
        .filter((nhom) => nhom.ds.length > 0)
        .map((nhom, n) => (
          <section key={nhom.tieuDe} className={`${n === 0 ? "bg-ocean-50/50" : "bg-foam"} py-14 sm:py-20`}>
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="mb-10 text-center">
                <h2 className="font-display text-3xl font-bold text-deep-900 sm:text-4xl">{nhom.tieuDe}</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {nhom.ds.map((t, i) => (
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
        ))}

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
