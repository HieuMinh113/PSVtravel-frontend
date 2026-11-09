import {
  CheckCircle2, Sparkles, PartyPopper, ShieldCheck, Bus, Users, Wine, Presentation, FileDown, ChevronDown, ChevronRight,
  MessagesSquare, PenLine, ClipboardList, FileSignature, Camera, Waves, Hotel, Wand2, Phone, PlayCircle, ArrowRight, Star, Quote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CONG_TY, NAM_THANH_LAP, soNamHoatDong, breadcrumbJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { duocToiUu } from "@/app/lib/anh";
import SectionReveal from "@/components/SectionReveal";
import TeamBuildingForm from "@/components/TeamBuildingForm";
import TeamBuildingGrid from "@/components/TeamBuildingGrid";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ThuVienKhoanhKhac from "@/components/teambuilding/ThuVienKhoanhKhac";
import ThanhBaoGiaDiDong from "@/components/teambuilding/ThanhBaoGiaDiDong";

// Hồ sơ năng lực 1 trang cho doanh nghiệp (tạo từ tai-lieu/ho-so-nang-luc/, xem README ở đó)
export const HO_SO_NANG_LUC = "/ho-so-nang-luc-psv-travel.pdf";

// Trang giới thiệu dịch vụ tổ chức team building / du lịch công ty, bố cục
// giống trang Về chúng tôi: ảnh thật, câu chuyện, số liệu, khoảnh khắc, khách
// hàng, đánh giá — rồi mới tới gói tham khảo và form báo giá.
//
// Nội dung lấy từ Admin → Nội dung website → Trang Team Building (`noiDung`).
// Ô để trống thì dùng chữ / số mặc định bên dưới — chỉ những điều website đã
// công bố ở nơi khác; khối không có dữ liệu (khoảnh khắc, logo, đánh giá, video)
// tự ẩn. Server component: mọi chữ nằm sẵn trong HTML cho Google đọc; chỉ thư
// viện ảnh, form và thanh báo giá trên điện thoại là phần tương tác.

const LOAI_HINH_MAC_DINH = [
  { icon: Waves, ten: "Team building bãi biển", mo_ta: "Trò chơi vận động, thử thách đồng đội trên bãi biển, kết hợp nghỉ dưỡng cuối tuần." },
  { icon: Hotel, ten: "Team building trong nhà & khu nghỉ dưỡng", mo_ta: "Tại hội trường, resort hoặc ngay tại công ty — chủ động thời tiết, lịch làm việc." },
  { icon: Bus, ten: "Du lịch công ty", mo_ta: "Company trip trong nước và nước ngoài: xe, vé máy bay, khách sạn, ăn uống, hướng dẫn viên." },
  { icon: Wine, ten: "Gala dinner & tiệc cuối năm", mo_ta: "Kịch bản, sân khấu, âm thanh ánh sáng, MC và tiết mục cho đêm gala, year end party." },
  { icon: Presentation, ten: "Hội nghị & khen thưởng", mo_ta: "Hội nghị khách hàng, khen thưởng đại lý, kết hợp hội nghị với chuyến đi." },
  { icon: Wand2, ten: "Chương trình theo yêu cầu", mo_ta: "Kết hợp nhiều hoạt động theo mục tiêu, ngân sách và văn hoá riêng của doanh nghiệp." },
];

const CAM_KET = [
  { icon: Sparkles, title: "Kịch bản riêng", desc: "Thiết kế chương trình theo văn hoá và mục tiêu của doanh nghiệp bạn." },
  { icon: PartyPopper, title: "Ê-kíp trọn gói", desc: "MC, trò chơi, âm thanh, sân khấu, hậu cần — một đầu mối lo tất cả." },
  { icon: ShieldCheck, title: "An toàn & minh bạch", desc: "Bảo hiểm đầy đủ, báo giá rõ ràng, không phát sinh bất ngờ." },
];

const QUY_TRINH = [
  { icon: MessagesSquare, title: "Gửi yêu cầu", desc: "Qua form bên dưới hoặc hotline: số khách, thời gian, điểm đến, ngân sách dự kiến." },
  { icon: PenLine, title: "Tư vấn & kịch bản", desc: "Bộ phận sự kiện trao đổi mục tiêu chuyến đi, đề xuất lịch trình và kịch bản riêng." },
  { icon: ClipboardList, title: "Báo giá chi tiết", desc: "Báo giá minh bạch từng hạng mục trong 24 giờ làm việc." },
  { icon: FileSignature, title: "Ký hợp đồng & chuẩn bị", desc: "Chốt chương trình, ký hợp đồng; PSV lo trọn hậu cần, vé, phòng, ê-kíp." },
  { icon: Camera, title: "Tổ chức & hình ảnh", desc: "Ê-kíp đi cùng đoàn suốt chương trình, gửi hình ảnh sau chuyến đi." },
];

// Lớp Tailwind phải viết đủ chữ (không ghép chuỗi) để bản build giữ lại
const COT_SO_LIEU = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

function Anh({ src, alt, sizes, className = "object-cover", priority = false }) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={!duocToiUu(src)} className={className} />;
}

function TieuDeKhoi({ nhan, tieuDe, moTa, giua = false, toi = false }) {
  return (
    <SectionReveal className={giua ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {nhan && <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${toi ? "text-gold-300" : "text-sunset-700"}`}>{nhan}</p>}
      <h2 className={`mt-2 font-display text-3xl font-bold sm:text-4xl ${toi ? "text-white" : "text-deep-900"}`}>{tieuDe}</h2>
      {moTa && <p className={`mt-3 ${toi ? "text-white/80" : "text-ink-muted"}`}>{moTa}</p>}
    </SectionReveal>
  );
}

export default function TeamBuilding({ events = [], settings = {}, faqs = [], noiDung = null }) {
  const hotline = settings.hotline || "0907 870 707";
  const soGoi = hotline.replace(/[^0-9+]/g, "");
  const nd = noiDung || {};
  const hero = nd.hero || {};
  const gt = nd.gioi_thieu || {};
  const khoanhKhac = nd.khoanh_khac || [];
  const khachHang = nd.khach_hang || [];
  const danhGia = nd.danh_gia || [];
  const anhGoi = events.find((e) => e.image)?.image || null;

  const anhHero = hero.anh || anhGoi || khoanhKhac[0] || null;
  const anhGioiThieu = gt.anh || khoanhKhac[0] || anhGoi || null;
  const doanGioiThieu = (gt.noi_dung || "")
    .split(/\n+/)
    .map((d) => d.trim())
    .filter(Boolean);

  const soLieu = nd.so_lieu?.length
    ? nd.so_lieu
    : [
        { so: `${soNamHoatDong()} năm`, nhan: `hoạt động từ năm ${NAM_THANH_LAP}` },
        { so: "10.000+", nhan: "lượt khách mỗi năm" },
        { so: "Lữ hành quốc tế", nhan: `giấy phép số ${CONG_TY.giayPhep}` },
        { so: "Toàn quốc", nhan: "nhận tổ chức khắp các tỉnh thành" },
      ];
  const loaiHinh = nd.loai_hinh?.length ? nd.loai_hinh : LOAI_HINH_MAC_DINH;

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", url: SITE_URL }, { name: "Team Building" }])} />

      {/* ===== ĐẦU TRANG — ảnh đoàn thật toàn màn hình ===== */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-deep-gradient pb-28 pt-32 sm:min-h-[88svh] sm:items-center">
        {anhHero && <Anh src={anhHero} alt="Đoàn doanh nghiệp tham gia team building cùng PSV Travel" sizes="100vw" priority className="-z-10 object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep-950/90 via-deep-950/55 to-deep-950/25" />
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <nav aria-label="Đường dẫn" className="mb-5 flex items-center gap-1.5 text-xs text-white/80">
            <Link href="/" className="vung-bam transition-colors hover:text-gold-300">Trang chủ</Link>
            <ChevronRight className="h-3 w-3 text-white/50" aria-hidden="true" />
            <span className="font-medium text-white">Team Building</span>
          </nav>
          <p className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300 backdrop-blur">
            Tổ chức sự kiện doanh nghiệp
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] text-white sm:text-6xl">
            {hero.tieu_de || "Team Building & Du lịch công ty trọn gói"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {hero.mo_ta ||
              "PSV Travel tổ chức trọn gói du lịch công ty (company trip), team building, gala dinner và sự kiện doanh nghiệp — từ kịch bản, hậu cần đến hình ảnh, cho đoàn từ vài chục đến vài trăm khách."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#bao-gia" className="btn-cta">
              Nhận báo giá trong 24 giờ <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={`tel:${soGoi}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> {hotline}
            </a>
            {hero.video_id && (
              <a href="#video" className="inline-flex min-h-[44px] items-center gap-2 px-2 py-3 font-semibold text-white/90 transition-colors hover:text-gold-300">
                <PlayCircle className="h-6 w-6" aria-hidden="true" /> Xem video
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ===== SỐ LIỆU — chỉ số đã công bố hoặc Marketing nhập ===== */}
      <section className="relative z-10 -mt-14 px-5 sm:px-8">
        <div className={`mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl bg-ocean-100 shadow-card ${COT_SO_LIEU[Math.min(soLieu.length, 4)]}`}>
          {soLieu.map((s) => (
            <div key={s.so + s.nhan} className="bg-white px-4 py-5 text-center sm:py-7">
              <p className="font-display text-[clamp(1.05rem,4.4vw,1.9rem)] font-bold leading-tight text-ocean-700">{s.so}</p>
              <p className="mt-1 text-xs leading-snug text-ink-muted sm:text-sm">{s.nhan}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VÌ SAO DOANH NGHIỆP CHỌN PSV ===== */}
      <section className="bg-white py-16 sm:py-24">
        <div className={`mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:gap-16 ${anhGioiThieu ? "lg:grid-cols-2" : "max-w-3xl"}`}>
          {anhGioiThieu && (
            <SectionReveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-card">
              <Anh src={anhGioiThieu} alt="PSV Travel tổ chức chương trình cho doanh nghiệp" sizes="(max-width: 1024px) 100vw, 50vw" />
            </SectionReveal>
          )}
          <SectionReveal delay={0.08}>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sunset-700">Vì sao doanh nghiệp chọn PSV</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-deep-900 sm:text-4xl">
              {gt.tieu_de || "Một đầu mối cho cả chuyến đi của công ty bạn"}
            </h2>
            {doanGioiThieu.length ? (
              doanGioiThieu.map((d, i) => (
                <p key={i} className="mt-4 leading-relaxed text-ink-muted">{d}</p>
              ))
            ) : (
              <>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  PSV Travel tổ chức trọn gói du lịch công ty, team building, gala dinner và sự kiện doanh nghiệp — từ di chuyển,
                  lưu trú đến chương trình gắn kết và đêm gala.
                </p>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Hoạt động từ năm {NAM_THANH_LAP} với giấy phép lữ hành quốc tế, chúng tôi nhận tổ chức trên toàn quốc, báo giá minh
                  bạch từng hạng mục trong 24 giờ làm việc.
                </p>
              </>
            )}
            <ul className="mt-7 space-y-4">
              {CAM_KET.map((c) => (
                <li key={c.title} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ocean-50 text-ocean-700">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-deep-900">{c.title}</span>
                    <span className="block text-sm text-ink-muted">{c.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </section>

      {/* ===== LOẠI HÌNH CHƯƠNG TRÌNH ===== */}
      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <TieuDeKhoi nhan="Chúng tôi tổ chức" tieuDe="Chương trình cho mọi mục tiêu của doanh nghiệp" moTa="Từ một ngày gắn kết đến chuyến đi nhiều ngày kết hợp hội nghị và đêm gala." />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loaiHinh.map((l, i) => {
              const Icon = l.icon || Users;
              return (
                <SectionReveal key={l.ten} delay={(i % 3) * 0.06} className="card-surface group overflow-hidden">
                  {l.anh ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Anh src={l.anh} alt={l.ten} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-enter group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="px-6 pt-6">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocean-50 text-ocean-700">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-deep-900">{l.ten}</h3>
                    {l.mo_ta && <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{l.mo_ta}</p>}
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== VIDEO — có link YouTube trong admin mới hiện ===== */}
      {hero.video_id && (
        <section id="video" className="scroll-mt-24 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <TieuDeKhoi giua nhan="Video" tieuDe="Xem một chương trình PSV đã tổ chức" />
            <SectionReveal delay={0.1} className="mt-8">
              <YouTubeEmbed videoId={hero.video_id} title="Video team building cùng PSV Travel" />
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ===== KHOẢNH KHẮC THẬT ===== */}
      {khoanhKhac.length > 0 && (
        <section className="bg-foam py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <TieuDeKhoi nhan="Khoảnh khắc" tieuDe="Những đoàn đã đi cùng PSV" moTa="Hình ảnh thật từ các chương trình chúng tôi tổ chức." />
            <div className="mt-10">
              <ThuVienKhoanhKhac anh={khoanhKhac} />
            </div>
          </div>
        </section>
      )}

      {/* ===== KHÁCH HÀNG ĐÃ ĐỒNG HÀNH — chỉ logo khách đồng ý, đang bật ===== */}
      {khachHang.length > 0 && (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <TieuDeKhoi giua tieuDe="Doanh nghiệp đã đồng hành cùng PSV" />
            {/* flex + căn giữa: ít logo thì vẫn nằm giữa, không dồn sang trái */}
            <ul className="mt-10 flex flex-wrap justify-center gap-4">
              {khachHang.map((k) => (
                <li key={k.ten} title={k.ten} className="relative flex h-24 w-[calc(50%-0.5rem)] items-center justify-center rounded-2xl border border-ocean-100 bg-white px-5 sm:w-52">
                  <div className="relative h-14 w-full">
                    <Anh src={k.logo} alt={`Logo ${k.ten}`} sizes="200px" className="object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ===== CHƯƠNG TRÌNH THAM KHẢO — gói trong admin ===== */}
      {events.length > 0 && (
        <section className="bg-foam py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <TieuDeKhoi nhan="Chương trình tham khảo" tieuDe="Chọn gói gần với đoàn của bạn" moTa="Mỗi gói đều tuỳ chỉnh được theo số khách, ngân sách và điểm đến." />
            <TeamBuildingGrid events={events} />
          </div>
        </section>
      )}

      {/* ===== QUY TRÌNH ===== */}
      <section className="relative overflow-hidden bg-deep-gradient py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <TieuDeKhoi giua toi nhan="Quy trình" tieuDe="Tổ chức trong 5 bước" />
          <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {QUY_TRINH.map((b, i) => (
              <SectionReveal as="li" key={b.title} delay={i * 0.06} className="relative rounded-3xl bg-white/10 p-6">
                <span className="font-display text-4xl font-bold text-white/25">{String(i + 1).padStart(2, "0")}</span>
                <b.icon className="mt-3 h-6 w-6 text-gold-300" aria-hidden="true" />
                <h3 className="mt-3 font-display text-base font-bold">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">{b.desc}</p>
              </SectionReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== ĐÁNH GIÁ — đánh giá đã duyệt của các gói ===== */}
      {danhGia.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <TieuDeKhoi giua nhan="Khách hàng nói gì" tieuDe="Đánh giá từ các đoàn đã đi" />
            <div className="mt-10 flex flex-wrap justify-center gap-5">
              {danhGia.map((d, i) => (
                <SectionReveal key={i} delay={(i % 3) * 0.06} className="card-surface flex w-full flex-col p-6 md:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]">
                  <Quote className="h-7 w-7 text-ocean-200" aria-hidden="true" />
                  <div className="mt-3 flex gap-0.5" aria-label={`${d.diem} trên 5 sao`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className={`h-4 w-4 ${s < d.diem ? "fill-gold-400 text-gold-400" : "text-ink-subtle/30"}`} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-3 line-clamp-6 flex-1 whitespace-pre-line leading-relaxed text-ink-muted">{d.noi_dung}</p>
                  <p className="mt-5 font-semibold text-deep-900">{d.ten}</p>
                  {d.goi && (
                    <Link href={`/team-building/${d.goi_slug}`} className="vung-bam text-sm text-ocean-700 hover:underline">
                      {d.goi}
                    </Link>
                  )}
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== HỎI ĐÁP DOANH NGHIỆP — câu đã bật trong admin ===== */}
      {faqs.length > 0 && (
        <section className="bg-foam py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <TieuDeKhoi giua tieuDe="Câu hỏi doanh nghiệp hay hỏi" />
            <div className="mt-8 space-y-3">
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

      {/* ===== FORM BÁO GIÁ ===== */}
      <section id="bao-gia" className="scroll-mt-20 bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          <SectionReveal>
            <h2 className="font-display text-3xl font-bold text-deep-900 sm:text-4xl">Nhận báo giá cho đoàn của bạn</h2>
            <p className="mt-3 text-ink-muted">
              Cho chúng tôi biết quy mô đoàn, thời gian và ngân sách dự kiến. Bộ phận sự kiện sẽ tư vấn kịch bản và gửi báo giá phù hợp nhất.
            </p>
            <ul className="mt-6 space-y-3">
              {["Tư vấn miễn phí, không ràng buộc", "Báo giá minh bạch trong 24 giờ làm việc", "Nhận tổ chức trên toàn quốc"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              {/* Hồ sơ 1 trang để khách chuyển cho sếp / phòng nhân sự duyệt */}
              <Link
                href={HO_SO_NANG_LUC}
                prefetch={false}
                target="_blank"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50"
              >
                <FileDown className="h-4 w-4" aria-hidden="true" /> Tải hồ sơ năng lực (PDF)
              </Link>
              <a
                href={`tel:${soGoi}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> Gọi {hotline}
              </a>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <TeamBuildingForm hotline={hotline} />
          </SectionReveal>
        </div>
      </section>

      <ThanhBaoGiaDiDong hotline={hotline} />
    </div>
  );
}
