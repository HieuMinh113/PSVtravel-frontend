import Link from "next/link";
import { Users, Clock, MapPin, ArrowRight, CheckCircle2, Sparkles, PartyPopper, ShieldCheck } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import TeamBuildingForm from "@/components/TeamBuildingForm";

// Trang giới thiệu dịch vụ tổ chức sự kiện / team building + form nhận yêu cầu.
// Server component: các gói và phần giới thiệu nằm sẵn trong HTML dựng sẵn để
// Google đọc được; chỉ form là phần tương tác (client) tách riêng.
export default function TeamBuilding({ events = [], settings = {} }) {
  const hotline = settings.hotline || "0907 870 707";

  const camKet = [
    { icon: Sparkles, title: "Kịch bản riêng", desc: "Thiết kế chương trình theo văn hoá và mục tiêu của doanh nghiệp bạn." },
    { icon: PartyPopper, title: "Ê-kíp trọn gói", desc: "MC, trò chơi, âm thanh, sân khấu, hậu cần — một đầu mối lo tất cả." },
    { icon: ShieldCheck, title: "An toàn & minh bạch", desc: "Bảo hiểm đầy đủ, báo giá rõ ràng, không phát sinh bất ngờ." },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Tổ chức sự kiện"
        title="Team Building & Sự kiện doanh nghiệp"
        description="PSV Travel tổ chức trọn gói team building, gala dinner, company trip và sự kiện doanh nghiệp — từ kịch bản, hậu cần đến hình ảnh, cho đoàn từ vài chục đến vài trăm khách."
        crumbs={[{ label: "Team Building" }]}
      />

      {/* Cam kết */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {camKet.map((c, i) => (
              <SectionReveal key={c.title} delay={i * 0.08} className="card-surface flex items-start gap-4 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ocean-50 text-ocean-600">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-deep-900">{c.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{c.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Danh sách gói */}
      {events.length > 0 && (
        <section className="bg-foam py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionReveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Gói gợi ý</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-deep-900">Chọn gói phù hợp với đoàn của bạn</h2>
              <p className="mt-2 max-w-2xl text-ink-muted">Mỗi gói đều có thể tùy chỉnh theo số lượng khách, ngân sách và điểm đến bạn mong muốn.</p>
            </SectionReveal>

            <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <SectionReveal key={e.slug} delay={i * 0.06}>
                  <Link
                    href={`/team-building/${e.slug}`}
                    className="card-surface group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-ocean-100">
                      {e.image ? (
                        <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ocean-300">
                          <PartyPopper className="h-12 w-12" />
                        </div>
                      )}
                      {e.featured && (
                        <span className="absolute left-3 top-3 rounded-full bg-sunset-500 px-3 py-1 text-xs font-bold text-white shadow">Nổi bật</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg font-bold text-deep-900 group-hover:text-ocean-700">{e.title}</h3>
                      {e.summary && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{e.summary}</p>}

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-subtle">
                        {e.groupSize && <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5 text-ocean-500" /> {e.groupSize}</span>}
                        {e.duration && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-ocean-500" /> {e.duration}</span>}
                        {e.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-ocean-500" /> {e.location}</span>}
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-4">
                        <span className="font-display text-base font-bold text-sunset-700">{e.priceNote || "Liên hệ báo giá"}</span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-ocean-700">
                          Xem chi tiết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form nhận yêu cầu */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset-600">Bắt đầu</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-deep-900">Gửi yêu cầu tổ chức</h2>
            <p className="mt-3 text-ink-muted">
              Cho chúng tôi biết quy mô đoàn, thời gian và ngân sách dự kiến. Bộ phận sự kiện sẽ tư vấn kịch bản và gửi báo giá phù hợp nhất.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Tư vấn miễn phí, không ràng buộc",
                "Báo giá minh bạch trong 24 giờ làm việc",
                "Nhận tổ chức trên toàn quốc",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <TeamBuildingForm hotline={hotline} />
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
