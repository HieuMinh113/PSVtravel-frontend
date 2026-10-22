import {
  CheckCircle2, Sparkles, PartyPopper, ShieldCheck, Bus, Users, Wine, Presentation, FileDown, ChevronDown,
  MessagesSquare, PenLine, ClipboardList, FileSignature, Camera, Award, CalendarCheck, MapPinned,
} from "lucide-react";
import Link from "next/link";
import { CONG_TY, NAM_THANH_LAP, soNamHoatDong } from "@/app/lib/seo";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import TeamBuildingForm from "@/components/TeamBuildingForm";
import TeamBuildingGrid from "@/components/TeamBuildingGrid";

// Hồ sơ năng lực 1 trang cho doanh nghiệp (tạo từ tai-lieu/ho-so-nang-luc/, xem README ở đó)
export const HO_SO_NANG_LUC = "/ho-so-nang-luc-psv-travel.pdf";

// Trang giới thiệu dịch vụ tổ chức sự kiện / team building + form nhận yêu cầu.
// Server component: các gói và phần giới thiệu nằm sẵn trong HTML dựng sẵn để
// Google đọc được; chỉ form là phần tương tác (client) tách riêng.
//
// Chỉ ghi điều website đã cam kết ở nơi khác (năm hoạt động, lượt khách, giấy
// phép, báo giá 24 giờ). Hỏi đáp lấy từ admin (Câu hỏi thường gặp → nhóm
// "Doanh nghiệp / Team building"): hoá đơn, cọc, quy mô đoàn do người phụ trách
// điền đúng thực tế — chưa bật câu nào thì khối hỏi đáp tự ẩn.
export default function TeamBuilding({ events = [], settings = {}, faqs = [] }) {
  const hotline = settings.hotline || "0907 870 707";

  const dichVu = [
    { icon: Bus, title: "Du lịch công ty", desc: "Company trip trong nước và nước ngoài: xe, vé máy bay, khách sạn, ăn uống, hướng dẫn viên." },
    { icon: Users, title: "Team building", desc: "Trò chơi gắn kết theo chủ đề, trên bãi biển, khu nghỉ dưỡng hoặc ngay tại công ty." },
    { icon: Wine, title: "Gala dinner & tiệc cuối năm", desc: "Kịch bản, sân khấu, âm thanh ánh sáng, MC và tiết mục cho đêm gala, year end party." },
    { icon: Presentation, title: "Hội nghị & sự kiện", desc: "Hội nghị khách hàng, khen thưởng đại lý, kết hợp hội nghị với chuyến đi." },
  ];

  const soLieu = [
    { icon: CalendarCheck, so: `${soNamHoatDong()} năm`, nhan: `hoạt động từ năm ${NAM_THANH_LAP}` },
    { icon: Users, so: "10.000+", nhan: "lượt khách mỗi năm" },
    { icon: Award, so: "Lữ hành quốc tế", nhan: `giấy phép số ${CONG_TY.giayPhep}` },
    { icon: MapPinned, so: "Toàn quốc", nhan: "nhận tổ chức khắp các tỉnh thành" },
  ];

  const quyTrinh = [
    { icon: MessagesSquare, title: "Gửi yêu cầu", desc: "Qua form bên dưới hoặc hotline: số khách, thời gian, điểm đến, ngân sách dự kiến." },
    { icon: PenLine, title: "Tư vấn & kịch bản", desc: "Bộ phận sự kiện trao đổi mục tiêu chuyến đi, đề xuất lịch trình và kịch bản riêng." },
    { icon: ClipboardList, title: "Báo giá chi tiết", desc: "Báo giá minh bạch từng hạng mục trong 24 giờ làm việc." },
    { icon: FileSignature, title: "Ký hợp đồng & chuẩn bị", desc: "Chốt chương trình, ký hợp đồng; PSV lo trọn hậu cần, vé, phòng, ê-kíp." },
    { icon: Camera, title: "Tổ chức & hình ảnh", desc: "Ê-kíp đi cùng đoàn suốt chương trình, gửi hình ảnh sau chuyến đi." },
  ];

  const camKet = [
    { icon: Sparkles, title: "Kịch bản riêng", desc: "Thiết kế chương trình theo văn hoá và mục tiêu của doanh nghiệp bạn." },
    { icon: PartyPopper, title: "Ê-kíp trọn gói", desc: "MC, trò chơi, âm thanh, sân khấu, hậu cần — một đầu mối lo tất cả." },
    { icon: ShieldCheck, title: "An toàn & minh bạch", desc: "Bảo hiểm đầy đủ, báo giá rõ ràng, không phát sinh bất ngờ." },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Tổ chức sự kiện"
        title="Team Building & Du lịch công ty"
        description="PSV Travel tổ chức trọn gói du lịch công ty (company trip), team building, gala dinner và sự kiện doanh nghiệp — từ kịch bản, hậu cần đến hình ảnh, cho đoàn từ vài chục đến vài trăm khách."
        crumbs={[{ label: "Team Building" }]}
      />

      {/* Cam kết */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {camKet.map((c, i) => (
              <SectionReveal key={c.title} delay={i * 0.08} className="card-surface flex items-start gap-4 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ocean-50 text-ocean-700">
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

      {/* Dịch vụ cho doanh nghiệp */}
      <section className="bg-foam py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <h2 className="font-display text-3xl font-bold text-deep-900">Dịch vụ cho doanh nghiệp</h2>
            <p className="mt-2 max-w-2xl text-ink-muted">Một đầu mối cho cả chuyến đi: từ di chuyển, lưu trú đến chương trình gắn kết và đêm gala.</p>
          </SectionReveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dichVu.map((d, i) => (
              <SectionReveal key={d.title} delay={i * 0.06} className="card-surface p-5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocean-50 text-ocean-700">
                  <d.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-deep-900">{d.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{d.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vì sao chọn PSV — chỉ số liệu website đã công bố */}
      <section className="bg-deep-gradient py-12 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 sm:px-8 lg:grid-cols-4">
          {soLieu.map((d) => (
            <div key={d.nhan} className="flex items-start gap-3">
              <d.icon className="mt-1 h-6 w-6 shrink-0 text-gold-300" aria-hidden="true" />
              <div>
                <p className="font-display text-xl font-bold sm:text-2xl">{d.so}</p>
                <p className="text-sm text-white/80">{d.nhan}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quy trình */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <h2 className="font-display text-3xl font-bold text-deep-900">Quy trình tổ chức 5 bước</h2>
          </SectionReveal>
          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {quyTrinh.map((b, i) => (
              <li key={b.title} className="card-surface relative p-5">
                <span className="absolute right-4 top-4 font-display text-3xl font-bold text-ocean-100">{i + 1}</span>
                <b.icon className="h-6 w-6 text-ocean-700" aria-hidden="true" />
                <h3 className="mt-3 font-display text-base font-bold text-deep-900">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{b.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Danh sách gói */}
      {events.length > 0 && (
        <section className="bg-foam py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionReveal>
              <h2 className="font-display text-3xl font-bold text-deep-900">Chọn gói phù hợp với đoàn của bạn</h2>
              <p className="mt-2 max-w-2xl text-ink-muted">Mỗi gói đều có thể tùy chỉnh theo số lượng khách, ngân sách và điểm đến bạn mong muốn.</p>
            </SectionReveal>

            <TeamBuildingGrid events={events} />
          </div>
        </section>
      )}

      {/* Hỏi đáp doanh nghiệp — chỉ câu nhân viên đã điền và bật trong admin */}
      {faqs.length > 0 && (
        <section className="bg-foam py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="font-display text-3xl font-bold text-deep-900">Câu hỏi doanh nghiệp hay hỏi</h2>
            <div className="mt-6 space-y-3">
              {faqs.map((f) => (
                <details key={f.id ?? f.question} className="group rounded-2xl bg-white px-5 py-4 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-deep-900 [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-ocean-600 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form nhận yêu cầu */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          <SectionReveal>
            <h2 className="font-display text-3xl font-bold text-deep-900">Gửi yêu cầu tổ chức</h2>
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
            {/* Hồ sơ 1 trang để khách chuyển cho sếp / phòng nhân sự duyệt */}
            <Link
              href={HO_SO_NANG_LUC}
              prefetch={false}
              target="_blank"
              className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50"
            >
              <FileDown className="h-4 w-4" aria-hidden="true" /> Tải hồ sơ năng lực (PDF)
            </Link>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <TeamBuildingForm hotline={hotline} />
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
