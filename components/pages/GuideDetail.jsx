import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, User, ArrowLeft, ArrowRight, Quote } from "lucide-react";
import GhiNhanLuotXem from "@/components/GhiNhanLuotXem";

// Trang chi tiết bài viết cẩm nang — component phía server (không cần "use client")
// để nội dung bài viết được render sẵn trong HTML, tốt cho SEO.
export default function GuideDetail({ guide }) {
  if (!guide) return null;

  return (
    <>
      {/* Không hiển thị gì — chỉ báo cho máy chủ biết bài vừa được mở */}
      <GhiNhanLuotXem slug={guide.slug} />

      <article>
      {/* Ảnh bìa + tiêu đề */}
      <section className="relative h-[52dvh] min-h-[380px] overflow-hidden">
        {guide.image ? (
          <Image src={guide.image} alt={guide.title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-deep-gradient" />
        )}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep-950/80 via-deep-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-950/92 via-deep-950/35 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-5 pb-10 pt-24 sm:px-8">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/75">
            <Link href="/" className="transition-colors hover:text-gold-300">Trang chủ</Link>
            <span>/</span>
            <Link href="/cam-nang" className="transition-colors hover:text-gold-300">Cẩm nang</Link>
            <span>/</span>
            <span className="line-clamp-1 text-white/90">{guide.title}</span>
          </div>

          {guide.category && (
            <span className="inline-block rounded-full bg-sunset-600 px-3.5 py-1 text-xs font-bold text-white shadow">
              {guide.category}
            </span>
          )}

          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-[1.15] text-white sm:text-[2.6rem]">
            {guide.title}
          </h1>

          {/* Gạch nhấn ngắn — chốt khối tiêu đề, đồng bộ với PageHero các trang khác */}
          <span className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-gold-400 to-sunset-500" />

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
            {guide.author && (
              <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-gold-400" /> {guide.author}</span>
            )}
            {guide.date && (
              <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-gold-400" /> {guide.date}</span>
            )}
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-gold-400" /> {guide.views ?? 0} lượt xem</span>
          </div>
        </div>
      </section>

      {/* Nội dung bài viết */}
      <section className="bg-foam py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {guide.excerpt && (
            <div className="relative rounded-2xl border-l-4 border-sunset-500 bg-white p-6 shadow-card">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-sunset-100" />
              <p className="relative font-display text-lg leading-relaxed text-deep-900">
                {guide.excerpt}
              </p>
            </div>
          )}

          {guide.content ? (
            <div
              className="prose-psv mt-10"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          ) : (
            <p className="mt-10 text-ink-muted">Nội dung bài viết đang được cập nhật.</p>
          )}

          {/* Khối kêu gọi cuối bài — người vừa đọc xong cẩm nang là lúc dễ chuyển
              sang xem tour nhất, nên đặt lời mời ở đây thay vì chỉ 2 nút trơn */}
          <div className="relative mt-14 overflow-hidden rounded-3xl bg-deep-gradient p-7 text-center sm:p-9">
            <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-75" />
            <div className="relative">
              <h2 className="font-display text-2xl font-bold text-white">
                Sẵn sàng biến kinh nghiệm này thành chuyến đi?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
                Đội ngũ PSVTravel sẽ giúp bạn chọn hành trình phù hợp nhất với thời gian và ngân sách.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/tour-trong-nuoc" className="btn-cta !px-6 !py-3 text-sm">
                  Khám phá tour ngay <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/lien-he" className="btn-ghost !px-6 !py-3 text-sm">
                  Nhận tư vấn miễn phí
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center border-t border-ocean-100 pt-8">
            <Link
              href="/cam-nang"
              className="flex min-h-[44px] items-center gap-2 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50"
            >
              <ArrowLeft className="h-4 w-4" /> Xem thêm cẩm nang
            </Link>
          </div>
        </div>
      </section>
    </article>
    </>
  );
}
