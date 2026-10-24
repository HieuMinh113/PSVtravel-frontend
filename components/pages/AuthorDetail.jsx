import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarDays, Eye, Globe2, Sparkles } from "lucide-react";
import { duocToiUu } from "@/app/lib/anh";

const chuDau = (t) => (t || "?").trim().charAt(0).toUpperCase();

// Ảnh tròn của tác giả; chưa có ảnh thì hiện chữ cái đầu. Đặt cạnh tên người
// thì để alt rỗng (trình đọc màn hình khỏi đọc tên hai lần).
export function AnhTacGia({ author, size = 96, className = "", alt = "" }) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-ocean-600 to-teal-500 ${className}`}
      style={{ width: size, height: size }}
    >
      {author.photo ? (
        <Image src={author.photo} alt={alt} fill sizes={`${size}px`} unoptimized={!duocToiUu(author.photo)} className="object-cover" />
      ) : (
        <span aria-hidden="true" className="flex h-full w-full items-center justify-center font-display font-bold text-white" style={{ fontSize: size * 0.4 }}>
          {chuDau(author.name)}
        </span>
      )}
    </span>
  );
}

// Khung "Về tác giả" cuối bài cẩm nang — người đọc (và Google) thấy bài do ai
// viết, kinh nghiệm gì, bấm sang trang tác giả xem các bài khác.
export function VeTacGia({ author }) {
  if (!author) return null;
  return (
    <aside aria-labelledby="ve-tac-gia" className="mt-14 rounded-3xl border border-ocean-100 bg-white p-6 shadow-card sm:p-7">
      <p id="ve-tac-gia" className="text-xs font-bold uppercase tracking-wider text-sunset-700">Về tác giả</p>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        <AnhTacGia author={author} size={80} />
        <div className="min-w-0">
          <Link href={`/tac-gia/${author.slug}`} className="font-display text-xl font-bold text-deep-900 transition-colors hover:text-ocean-700">
            {author.name}
          </Link>
          {author.position && <p className="mt-0.5 text-sm font-semibold text-ocean-700">{author.position}</p>}
          {(author.yearsExperience || author.expertise) && (
            <p className="mt-2 text-sm text-ink-muted">
              {[author.yearsExperience ? `${author.yearsExperience} năm kinh nghiệm` : null, author.expertise].filter(Boolean).join(" · ")}
            </p>
          )}
          {author.bio && <p className="mt-3 text-base leading-relaxed text-ink-muted">{author.bio}</p>}
          <Link
            href={`/tac-gia/${author.slug}`}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sunset-700 transition-colors hover:text-sunset-800"
          >
            Xem hồ sơ và các bài khác <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

// Trang tác giả /tac-gia/{slug} — component phía server: hồ sơ và danh sách bài
// nằm sẵn trong HTML. Chỉ hiện các ô admin đã điền, ô trống thì ẩn.
export default function AuthorDetail({ author }) {
  if (!author) return null;
  const doan = (author.profile || "").split(/\n{2,}|\r\n\r\n/).map((d) => d.trim()).filter(Boolean);

  return (
    <article>
      <section className="relative overflow-hidden bg-deep-gradient px-5 pb-14 pt-32 sm:px-8 sm:pt-40">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:190%_190%] animate-aurora opacity-80" />
        <div className="relative mx-auto max-w-4xl">
          <nav aria-label="Đường dẫn" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-white/75">
            <Link href="/" className="vung-bam transition-colors hover:text-gold-300">Trang chủ</Link>
            <span>/</span>
            <Link href="/cam-nang" className="vung-bam transition-colors hover:text-gold-300">Cẩm nang</Link>
            <span>/</span>
            <span className="text-white/90">{author.name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <AnhTacGia author={author} size={128} alt={`Ảnh ${author.name}`} className="ring-4 ring-white/25" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gold-300">Tác giả cẩm nang PSV Travel</p>
              <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-white sm:text-[2.6rem]">{author.name}</h1>
              {author.position && <p className="mt-2 text-lg text-white/90">{author.position}</p>}
            </div>
          </div>

          {(author.yearsExperience || author.expertise || author.countries.length > 0) && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">
              {author.yearsExperience && (
                <li className="flex items-center gap-2"><BriefcaseBusiness aria-hidden="true" className="h-4 w-4 text-gold-400" /> {author.yearsExperience} năm kinh nghiệm</li>
              )}
              {author.expertise && (
                <li className="flex items-center gap-2"><Sparkles aria-hidden="true" className="h-4 w-4 text-gold-400" /> {author.expertise}</li>
              )}
              {author.countries.length > 0 && (
                <li className="flex items-center gap-2"><Globe2 aria-hidden="true" className="h-4 w-4 text-gold-400" /> Đã đi: {author.countries.join(", ")}</li>
              )}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-foam py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {(doan.length > 0 || author.bio) && (
            <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-xl font-bold text-deep-900">Giới thiệu</h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-ink-muted">
                {(doan.length > 0 ? doan : [author.bio]).map((d, i) => <p key={i}>{d}</p>)}
              </div>
              {author.socialLinks.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {author.socialLinks.map((u) => (
                    <li key={u}>
                      <a
                        href={u}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="inline-flex min-h-[40px] items-center rounded-full border border-ocean-200 px-4 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50"
                      >
                        {tenTrang(u)}
                        <span className="sr-only"> (mở ở thẻ mới)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <h2 className="mt-12 font-display text-2xl font-bold text-deep-900">
            Bài viết của {author.name} <span className="text-base font-normal text-ink-subtle">({author.guides.length})</span>
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {author.guides.map((g) => (
              <li key={g.slug} className="card-surface group flex flex-col overflow-hidden">
                <Link href={`/cam-nang/${g.slug}`} className="flex flex-1 flex-col">
                  <div className="relative h-44 overflow-hidden">
                    {g.image ? (
                      <Image src={g.image} alt={g.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-700 ease-enter group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-ocean-100 to-teal-100" />
                    )}
                    {g.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ocean-700 shadow-sm">{g.category}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-deep-900 transition-colors group-hover:text-ocean-700">{g.title}</h3>
                    {g.excerpt && <p className="mt-2 line-clamp-2 flex-1 text-base text-ink-muted">{g.excerpt}</p>}
                    <div className="mt-4 flex items-center justify-between text-xs text-ink-subtle">
                      {g.date && <span className="flex items-center gap-1"><CalendarDays aria-hidden="true" className="h-3.5 w-3.5" /> {g.date}</span>}
                      <span className="flex items-center gap-1"><Eye aria-hidden="true" className="h-3.5 w-3.5" /> {g.views} lượt xem</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}

// "https://www.facebook.com/abc" → "Facebook"; trang lạ thì hiện tên miền
function tenTrang(u) {
  let host = "";
  try {
    host = new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
  const ten = { "facebook.com": "Facebook", "linkedin.com": "LinkedIn", "youtube.com": "YouTube", "tiktok.com": "TikTok", "instagram.com": "Instagram", "x.com": "X", "twitter.com": "X" };
  return ten[host] ?? host;
}
