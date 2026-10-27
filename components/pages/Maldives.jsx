import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Plane, Ship } from "lucide-react";
import PageHero from "@/components/PageHero";
import DoanGioiThieu, { noiDanhSach } from "@/components/DoanGioiThieu";
import SaoResort from "@/components/maldives/SaoResort";
import { duocToiUu } from "@/app/lib/anh";
import { ngayVN, quyDoi, usd } from "@/app/lib/maldives";

export const MO_TA_MAC_DINH = "Combo nghỉ dưỡng Maldives trọn gói vé máy bay, khách sạn và resort — giá theo hạng phòng và ngày khởi hành, nhân viên PSV Travel tư vấn từ lúc chọn villa tới khi về nước.";

function TheCombo({ c, tg }) {
  const thoiGian = c.days ? `${c.days}N${c.nights ?? ""}${c.nights != null ? "Đ" : ""}` : null;
  return (
    <article className="card-surface group flex flex-col overflow-hidden">
      <Link href={`/maldives/${c.slug}`} className="flex flex-1 flex-col">
        <div className="relative h-56 overflow-hidden">
          {c.image ? (
            <Image src={c.image} alt={c.resort?.name || c.name} fill sizes="(max-width: 768px) 100vw, 50vw" unoptimized={!duocToiUu(c.image)} className="object-cover transition-transform duration-700 ease-enter group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-ocean-200 to-teal-200" />
          )}
          <SaoResort sao={c.resort?.stars} className="absolute left-3 top-3 flex items-center gap-0.5 rounded-full bg-white/95 px-2.5 py-1 shadow-sm" saoClass="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          {c.resort?.name && <p className="text-xs font-semibold uppercase tracking-wide text-ocean-700">{c.resort.name}{c.resort.atoll ? ` · ${c.resort.atoll}` : ""}</p>}
          <h2 className="mt-1 font-display text-lg font-semibold leading-snug text-deep-900 transition-colors group-hover:text-ocean-700">{c.name}</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-muted">
            {thoiGian && <li className="flex items-center gap-1.5"><Clock aria-hidden="true" className="h-4 w-4 text-ocean-500" />{thoiGian}</li>}
            {c.airline && <li className="flex items-center gap-1.5"><Plane aria-hidden="true" className="h-4 w-4 text-ocean-500" />{c.airline}</li>}
            {c.transfer && <li className="flex items-center gap-1.5"><Ship aria-hidden="true" className="h-4 w-4 text-ocean-500" />{c.transfer}</li>}
          </ul>
          {c.ngayKhoiHanh.length > 0 && (
            <p className="mt-3 flex items-start gap-1.5 text-sm text-ink-muted">
              <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" />
              {c.ngayKhoiHanh.map((d) => ngayVN(d.startDate).slice(0, 5) + (d.label ? ` (${d.label})` : "")).join(" · ")}
            </p>
          )}
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <p>
              {c.giaTu ? (
                <>
                  <span className="text-xs text-ink-subtle">Từ</span>{" "}
                  <span className="font-display text-2xl font-bold text-sunset-700">{usd(c.giaTu)}</span>
                  <span className="text-xs text-ink-subtle">/khách</span>
                  {tg && <span className="block text-xs text-ink-muted">{quyDoi(c.giaTu, tg)}</span>}
                </>
              ) : (
                <span className="font-semibold text-sunset-700">Liên hệ báo giá</span>
              )}
            </p>
            <span className="flex items-center gap-1 text-sm font-semibold text-sunset-700">Xem combo <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </div>
        </div>
      </Link>
    </article>
  );
}

// Trang /maldives — danh sách combo nghỉ dưỡng (thay cho trang Vé máy bay cũ)
export default function Maldives({ combos = [], gioiThieu, tg, hotline }) {
  const anhNen = combos.map((c) => c.image).filter(Boolean).slice(0, 5).map((src, i) => ({ src, alt: combos[i]?.resort?.name || "Maldives" }));
  const resort = [...new Set(combos.map((c) => c.resort?.name).filter(Boolean))];
  const gia = combos.map((c) => c.giaTu).filter((g) => g > 0);

  return (
    <>
      <PageHero
        eyebrow="Combo nghỉ dưỡng"
        title="Du lịch Maldives"
        description={gioiThieu || MO_TA_MAC_DINH}
        crumbs={[{ label: "Maldives" }]}
        backgroundImages={anhNen.length ? anhNen : undefined}
      />

      <section className="bg-foam py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {combos.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {combos.map((c) => <TheCombo key={c.slug} c={c} tg={tg} />)}
            </div>
          ) : (
            <div className="card-surface mx-auto max-w-xl p-8 text-center">
              <p className="font-display text-lg font-semibold text-deep-900">Đang cập nhật combo Maldives</p>
              <p className="mt-2 text-ink-muted">Gọi <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="font-semibold text-ocean-700">{hotline}</a> để nhận lịch khởi hành và giá mới nhất.</p>
            </div>
          )}
        </div>
      </section>

      {combos.length > 0 && (
        <DoanGioiThieu tieuDe="Combo Maldives tại PSV Travel">
          <p>
            PSV Travel đang mở bán {combos.length} combo nghỉ dưỡng Maldives
            {resort.length ? <> tại {noiDanhSach(resort)}</> : null}
            {gia.length ? <>, giá từ {usd(Math.min(...gia))} mỗi khách</> : null}. Mỗi combo ghi rõ hãng bay, cách di chuyển ra
            resort, lịch trình từng ngày và giá theo từng hạng phòng, từng ngày khởi hành.
          </p>
          <p>
            Giá niêm yết bằng USD theo bảng giá resort; nhân viên xác nhận còn phòng và báo số tiền VNĐ trước khi bạn thanh toán.
            Cần tư vấn chọn villa, ngày đi hay đi tuần trăng mật, gọi <strong>{hotline}</strong> hoặc xem thêm các{" "}
            <Link href="/tour-nuoc-ngoai">tour nước ngoài</Link>.
          </p>
        </DoanGioiThieu>
      )}
    </>
  );
}
