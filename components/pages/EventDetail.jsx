import Link from "next/link";
import { Users, Clock, MapPin, Wallet, CheckCircle2, ArrowLeft, PartyPopper, Star, CalendarDays } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import TeamBuildingForm from "@/components/TeamBuildingForm";
import EventReviewForm from "@/components/EventReviewForm";

const DOI_TUONG = { "gia-dinh": "Gia đình", "doanh-nghiep": "Doanh nghiệp", "ca-nhan": "Cá nhân" };

// Dải 5 sao theo điểm (làm tròn nửa sao thành đầy để đơn giản, dễ đọc)
function Sao({ diem = 0, size = "h-4 w-4" }) {
  const n = Math.round(diem);
  return (
    <span className="inline-flex" aria-label={`${diem} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= n ? "fill-sunset-400 text-sunset-400" : "text-ocean-200"}`} />
      ))}
    </span>
  );
}

export default function EventDetail({ event, related = [], settings = {}, reviews = { items: [], rating: null, reviewCount: 0 } }) {
  const hotline = settings.hotline || "0907 870 707";
  const doiTuong = Array.isArray(event.audience) ? event.audience : [];

  const chiSo = [
    event.groupSize && { icon: Users, nhan: "Số người phù hợp", giaTri: event.groupSize },
    event.duration && { icon: Clock, nhan: "Thời lượng", giaTri: event.duration },
    event.location && { icon: MapPin, nhan: "Địa điểm gợi ý", giaTri: event.location },
  ].filter(Boolean);

  // Hình ảnh thực tế: ưu tiên thư viện admin thêm; trống thì tự gom ảnh các ngày.
  const anhCacNgay = event.itinerary.flatMap((d) => d.images || []);
  const anhThucTe = (event.gallery.length ? event.gallery : anhCacNgay).slice(0, 9);

  return (
    <div>
      <PageHero
        eyebrow="Team Building & Sự kiện"
        title={event.title}
        description={event.summary || "Gói tổ chức sự kiện trọn gói cho doanh nghiệp."}
        crumbs={[{ label: "Team Building", to: "/team-building" }, { label: event.title }]}
      />

      <section className="bg-foam py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Cột nội dung chính */}
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {doiTuong.map((a) => (
                <span key={a} className="rounded-full bg-ocean-50 px-3 py-1 text-xs font-semibold text-ocean-700 ring-1 ring-ocean-100">
                  Phù hợp: {DOI_TUONG[a] || a}
                </span>
              ))}
              {reviews.reviewCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
                  <Sao diem={reviews.rating || 0} />
                  <span className="font-semibold text-deep-900">{reviews.rating}</span>
                  <span className="text-ink-subtle">({reviews.reviewCount} đánh giá)</span>
                </span>
              )}
            </div>

            {event.image && (
              <SectionReveal className="overflow-hidden rounded-2xl">
                <img src={event.image} alt={event.title} className="w-full object-cover" />
              </SectionReveal>
            )}

            {chiSo.length > 0 && (
              <SectionReveal className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {chiSo.map((c) => (
                  <div key={c.nhan} className="card-surface flex items-center gap-3 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-600">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-ink-subtle">{c.nhan}</p>
                      <p className="font-display text-base font-bold text-deep-900">{c.giaTri}</p>
                    </div>
                  </div>
                ))}
              </SectionReveal>
            )}

            {/* Gói này sẽ có gì */}
            {event.includes.length > 0 && (
              <SectionReveal delay={0.05} className="mt-8 card-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-deep-900">Gói này sẽ có gì</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {event.includes.map((d, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-ink-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </SectionReveal>
            )}

            {/* Chương trình theo ngày */}
            {event.itinerary.length > 0 && (
              <SectionReveal delay={0.05} className="mt-8">
                <h2 className="font-display text-xl font-bold text-deep-900">Chương trình chi tiết</h2>
                <div className="mt-4 space-y-4">
                  {event.itinerary.map((ngay, i) => (
                    <div key={i} className="card-surface p-6">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ocean-600 text-white">
                          <CalendarDays className="h-5 w-5" />
                        </span>
                        <h3 className="font-display text-base font-bold text-deep-900">
                          {ngay.title || `Ngày ${i + 1}`}
                        </h3>
                      </div>
                      {ngay.description && (
                        <p className="mt-3 whitespace-pre-line text-sm text-ink-muted">{ngay.description}</p>
                      )}
                      {ngay.images?.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {ngay.images.map((src, k) => (
                            <div key={k} className="overflow-hidden rounded-xl bg-ocean-100">
                              <img src={src} alt={`${ngay.title || `Ngày ${i + 1}`} ${k + 1}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SectionReveal>
            )}

            {/* Mô tả chi tiết */}
            {event.description?.trim() && (
              <SectionReveal delay={0.1} className="mt-8 card-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-deep-900">Giới thiệu chi tiết</h2>
                <div className="prose-psv mt-4 text-ink-muted" dangerouslySetInnerHTML={{ __html: event.description }} />
              </SectionReveal>
            )}

            {/* Hình ảnh thực tế — tự lấy ảnh các ngày nếu admin chưa thêm thư viện */}
            {anhThucTe.length > 0 && (
              <SectionReveal delay={0.1} className="mt-8">
                <h2 className="font-display text-xl font-bold text-deep-900">Hình ảnh thực tế</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {anhThucTe.map((src, i) => (
                    <div key={i} className="overflow-hidden rounded-xl bg-ocean-100">
                      <img src={src} alt={`${event.title} ${i + 1}`} className="aspect-square w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </SectionReveal>
            )}
          </div>

          {/* Cột form — sticky trên desktop */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4 card-surface flex items-center justify-between p-5">
              <div className="flex items-center gap-2 text-sm text-ink-subtle">
                <Wallet className="h-4 w-4 text-sunset-600" /> Chi phí
              </div>
              <span className="font-display text-lg font-bold text-sunset-700">{event.priceNote || "Liên hệ báo giá"}</span>
            </div>
            <TeamBuildingForm goi={event.title} hotline={hotline} />
          </aside>
        </div>
      </section>

      {/* Đánh giá của khách */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-deep-900">Đánh giá của khách</h2>
              {reviews.reviewCount > 0 ? (
                <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-muted">
                  <Sao diem={reviews.rating || 0} />
                  <span className="font-semibold text-deep-900">{reviews.rating}/5</span>
                  <span className="text-ink-subtle">· {reviews.reviewCount} đánh giá</span>
                </p>
              ) : (
                <p className="mt-1.5 text-sm text-ink-muted">Chưa có đánh giá — hãy là người đầu tiên chia sẻ trải nghiệm.</p>
              )}
            </div>
          </SectionReveal>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* Danh sách đánh giá */}
            <div className="space-y-4">
              {reviews.items.length > 0 ? (
                reviews.items.map((r) => (
                  <div key={r.id} className="card-surface p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-deep-900">{r.customer_name}</p>
                      <Sao diem={r.rating} />
                    </div>
                    {r.created_at && (
                      <p className="mt-0.5 text-xs text-ink-subtle">{r.created_at.split("-").reverse().join("/")}</p>
                    )}
                    {r.content && <p className="mt-2.5 text-sm text-ink-muted">{r.content}</p>}
                    {r.admin_reply && (
                      <div className="mt-3 rounded-xl bg-ocean-50/60 p-3 text-sm text-ink-muted">
                        <span className="font-semibold text-ocean-700">PSV Travel phản hồi:</span> {r.admin_reply}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="card-surface p-6 text-sm text-ink-muted">
                  Chưa có đánh giá nào được duyệt cho gói này.
                </div>
              )}
            </div>

            {/* Form gửi đánh giá */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <EventReviewForm slug={event.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* Gói khác */}
      {related.length > 0 && (
        <section className="bg-ocean-50/50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionReveal className="mb-6 font-display text-2xl font-bold text-deep-900">Gói sự kiện khác</SectionReveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <Link
                  key={e.slug}
                  href={`/team-building/${e.slug}`}
                  className="card-surface group flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-ocean-100">
                    {e.image ? (
                      <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ocean-300"><PartyPopper className="h-10 w-10" /></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-bold text-deep-900 group-hover:text-ocean-700">{e.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-sunset-700">{e.priceNote || "Liên hệ báo giá"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
        <Link href="/team-building" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
          <ArrowLeft className="h-4 w-4" /> Xem tất cả gói team building
        </Link>
      </div>
    </div>
  );
}
