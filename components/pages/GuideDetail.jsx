import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, User, ArrowLeft, ArrowRight } from "lucide-react";

// Trang chi tiết bài viết cẩm nang — component phía server (không cần "use client")
// để nội dung bài viết được render sẵn trong HTML, tốt cho SEO.
export default function GuideDetail({ guide }) {
  if (!guide) return null;

  return (
    <article>
      {/* Ảnh bìa + tiêu đề */}
      <section className="relative h-[52dvh] min-h-[380px] overflow-hidden">
        {guide.image ? (
          <Image src={guide.image} alt={guide.title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ocean-500 to-teal-500" />
        )}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep-950/80 via-deep-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-950/90 via-deep-950/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-5 pb-10 pt-24 sm:px-8">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/60">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <Link href="/cam-nang" className="hover:text-white">Cẩm nang</Link>
            <span>/</span>
            <span className="line-clamp-1 text-white/85">{guide.title}</span>
          </div>

          {guide.category && (
            <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ocean-700 shadow">
              {guide.category}
            </span>
          )}

          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            {guide.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/75">
            {guide.author && (
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {guide.author}</span>
            )}
            {guide.date && (
              <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {guide.date}</span>
            )}
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {guide.views ?? 0} lượt xem</span>
          </div>
        </div>
      </section>

      {/* Nội dung bài viết */}
      <section className="bg-foam py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {guide.excerpt && (
            <p className="border-l-4 border-ocean-400 bg-white/70 p-5 font-display text-lg leading-relaxed text-ink">
              {guide.excerpt}
            </p>
          )}

          {guide.content ? (
            <div
              className="prose-psv mt-8"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          ) : (
            <p className="mt-8 text-ink-muted">Nội dung bài viết đang được cập nhật.</p>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ocean-100 pt-8">
            <Link
              href="/cam-nang"
              className="flex items-center gap-2 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-50"
            >
              <ArrowLeft className="h-4 w-4" /> Xem thêm cẩm nang
            </Link>
            <Link href="/tour-trong-nuoc" className="btn-cta">
              Khám phá tour ngay <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
