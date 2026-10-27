import Image from "next/image";
import Link from "next/link";
import { BedDouble, CalendarDays, Check, ChevronDown, Clock, MapPin, Plane, Ship, Sparkles, Utensils, X } from "lucide-react";
import DatComboMaldives from "@/components/maldives/DatComboMaldives";
import SaoResort from "@/components/maldives/SaoResort";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { duocToiUu } from "@/app/lib/anh";
import { ngayVN, quyDoi, usd } from "@/app/lib/maldives";

const doan = (s) => String(s || "").split(/\n\s*\n/).map((d) => d.trim()).filter(Boolean);

function Anh({ src, alt, sizes, className = "" }) {
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized={!duocToiUu(src)} className={`object-cover ${className}`} />;
}

function TieuDe({ children, phu }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-deep-900 sm:text-2xl">{children}</h2>
      {phu && <p className="mt-1 text-sm text-ink-subtle">{phu}</p>}
    </div>
  );
}

// Một mục bấm mở (lưu ý, quy định) — <details> nên nội dung luôn nằm trong HTML
function MucMo({ tieuDe, noiDung }) {
  return (
    <details className="group border-b border-ocean-100 last:border-b-0">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold text-deep-900 [&::-webkit-details-marker]:hidden">
        {tieuDe}
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-subtle transition-transform group-open:rotate-180" />
      </summary>
      <p className="max-w-2xl whitespace-pre-line pb-4 text-base leading-relaxed text-ink-muted">{noiDung}</p>
    </details>
  );
}

// Trang /maldives/{slug} — component phía server: giá, lịch trình, tiện ích,
// quy định nằm sẵn trong HTML; chỉ ô đặt combo chạy phía trình duyệt.
export default function MaldivesDetail({ combo, hotline, tg }) {
  const r = combo.resort ?? {};
  const anhBia = combo.image || r.image || r.gallery?.[0] || null;
  const boAnh = (r.gallery ?? []).filter((a) => a !== anhBia).slice(0, 6);
  // Hạng phòng có giá ở ít nhất một ngày — hạng chưa bán ngày nào thì khỏi chiếm dòng
  const phongCoGia = combo.roomTypes.filter((p) => combo.dates.some((d) => Number(d.prices?.[p.id]) > 0));
  const thoiGian = combo.days ? `${combo.days} ngày${combo.nights != null ? ` ${combo.nights} đêm` : ""}` : null;

  return (
    <article>
      <section className="relative h-[60dvh] min-h-[420px] overflow-hidden">
        {anhBia ? <Anh src={anhBia} alt={`${r.name || combo.name} Maldives`} sizes="100vw" className="" /> : <div className="h-full w-full bg-deep-gradient" />}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-950/92 via-deep-950/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 sm:px-8">
          <nav aria-label="Đường dẫn" className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-white/75">
            <Link href="/" className="vung-bam hover:text-gold-300">Trang chủ</Link><span>/</span>
            <Link href="/maldives" className="vung-bam hover:text-gold-300">Maldives</Link><span>/</span>
            <span className="line-clamp-1 text-white/90">{combo.name}</span>
          </nav>
          {r.name && (
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gold-300">
              {r.name}
              <SaoResort sao={r.stars} />
              {r.atoll && <span className="font-normal text-white/80">· {r.atoll}</span>}
            </p>
          )}
          <h1 className="mt-2 max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-[2.5rem]">{combo.name}</h1>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm text-white">
            {thoiGian && <li className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5"><Clock aria-hidden="true" className="h-4 w-4 text-gold-300" />{thoiGian}</li>}
            {combo.airline && <li className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5"><Plane aria-hidden="true" className="h-4 w-4 text-gold-300" />{combo.airline}</li>}
            {combo.transfer && <li className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5"><Ship aria-hidden="true" className="h-4 w-4 text-gold-300" />{combo.transfer}</li>}
            {combo.noiKhoiHanh.length > 0 && <li className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5"><MapPin aria-hidden="true" className="h-4 w-4 text-gold-300" />Từ {combo.noiKhoiHanh.map((n) => n.city).join(", ")}</li>}
          </ul>
          {combo.giaTu && (
            <p className="mt-4 text-white">
              <span className="text-sm text-white/80">Giá từ </span>
              <span className="font-display text-2xl font-bold">{usd(combo.giaTu)}</span>
              <span className="text-sm text-white/80"> / người lớn {quyDoi(combo.giaTu, tg) && `· ${quyDoi(combo.giaTu, tg)}`}</span>
            </p>
          )}
        </div>
      </section>

      <section className="bg-foam py-10 sm:py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-12">
            {(combo.stay || r.packageName || combo.highlights.length > 0) && (
              <div className="card-surface p-6">
                {combo.stay && <p className="font-display text-lg font-semibold text-deep-900">{combo.stay}</p>}
                {r.packageName && <p className="mt-1 text-sm text-ocean-700">Gói dịch vụ tại resort: <strong>{r.packageName}</strong></p>}
                {combo.highlights.length > 0 && (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {combo.highlights.map((h, i) => <li key={i} className="flex gap-2 text-base text-ink"><Sparkles aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-gold-500" />{h}</li>)}
                  </ul>
                )}
              </div>
            )}

            {(r.intro || boAnh.length > 0) && (
              <div>
                <TieuDe>Về {r.name || "resort"}</TieuDe>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-muted">{doan(r.intro).map((d, i) => <p key={i}>{d}</p>)}</div>
                {r.highlights?.length > 0 && (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">{r.highlights.map((h, i) => <li key={i} className="flex gap-2 text-base text-ink"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-teal-600" />{h}</li>)}</ul>
                )}
                {boAnh.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {boAnh.map((a, i) => (
                      <div key={a} className="relative h-32 overflow-hidden rounded-xl sm:h-44"><Anh src={a} alt={`${r.name} - ảnh ${i + 1}`} sizes="(max-width: 640px) 50vw, 260px" /></div>
                    ))}
                  </div>
                )}
                {r.videoId && <YouTubeEmbed videoId={r.videoId} title={`Video ${r.name}`} className="mt-6" />}
              </div>
            )}

            <div id="bang-gia" className="scroll-mt-28">
              <TieuDe phu="Giá USD cho 1 người lớn ở phòng 2–3 người, theo hạng phòng và ngày khởi hành.">Bảng giá combo</TieuDe>
              {combo.dates.length > 0 && phongCoGia.length > 0 ? (
                <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-card">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-ocean-50 text-deep-900">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Hạng phòng</th>
                        {combo.dates.map((d) => (
                          <th key={d.id} scope="col" className="px-3 py-3 text-center font-semibold">
                            {ngayVN(d.startDate)}
                            {d.label && <span className="block text-xs font-normal text-sunset-700">{d.label}</span>}
                            {d.status === "full" && <span className="block text-xs font-normal text-rose-600">Hết phòng</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-100">
                      {phongCoGia.map((p) => (
                        <tr key={p.id}>
                          <th scope="row" className="px-4 py-3 font-semibold text-deep-900">
                            {p.name}
                            {p.capacity && <span className="block text-xs font-normal text-ink-muted">{p.capacity}</span>}
                            {p.adultsOnly && <span className="mt-1 inline-block rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-semibold text-gold-800">Chỉ người lớn 18+</span>}
                          </th>
                          {combo.dates.map((d) => {
                            const g = Number(d.prices?.[p.id]);
                            return <td key={d.id} className={`px-3 py-3 text-center font-display text-base font-bold ${d.status === "full" ? "text-ink-subtle line-through" : "text-ocean-800"}`}>{g > 0 ? usd(g) : "—"}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 rounded-2xl bg-white p-5 text-ink-muted shadow-card">Đang cập nhật bảng giá — gọi hotline {hotline} để nhận giá theo ngày bạn muốn đi.</p>
              )}
              <ul className="mt-4 space-y-1.5 text-sm text-ink-muted">
                {combo.childPercent ? <li>• Trẻ em {combo.childAge || ""}: {combo.childPercent}% giá người lớn.</li> : null}
                {combo.infantNote && <li>• Em bé dưới 2 tuổi: {combo.infantNote}.</li>}
                {combo.noiKhoiHanh.filter((n) => n.surchargeUsd > 0 || n.surchargeUsd == null).map((n) => (
                  <li key={n.city}>• Khởi hành từ {n.city}: {n.surchargeUsd > 0 ? `phụ thu ${usd(n.surchargeUsd)}/khách` : "phụ thu liên hệ"}.</li>
                ))}
                {combo.minGroup ? <li>• Combo xây dựng trên vé đoàn, tối thiểu {combo.minGroup} khách/đoàn.</li> : null}
                {tg ? <li>• Giá VNĐ trên trang là tạm tính theo tỷ giá {tg.toLocaleString("vi-VN")}đ/USD; số tiền chính xác theo tỷ giá lúc thanh toán.</li> : null}
              </ul>
            </div>

            {combo.roomTypes.some((p) => p.image || p.description) && (
              <div>
                <TieuDe>Các hạng phòng</TieuDe>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {combo.roomTypes.map((p) => (
                    <div key={p.id} className="card-surface overflow-hidden">
                      {p.image && <div className="relative h-44"><Anh src={p.image} alt={p.name} sizes="(max-width: 640px) 100vw, 400px" /></div>}
                      <div className="p-4">
                        <p className="flex items-center gap-2 font-display font-semibold text-deep-900"><BedDouble aria-hidden="true" className="h-4 w-4 text-ocean-600" />{p.name}</p>
                        {p.capacity && <p className="mt-1 text-sm text-ocean-700">{p.capacity}</p>}
                        {p.adultsOnly && <p className="mt-1 text-xs font-semibold text-gold-800">Chỉ nhận khách từ 18 tuổi</p>}
                        {p.description && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {combo.noiKhoiHanh.some((n) => n.flights?.length) && (
              <div>
                <TieuDe>Nơi khởi hành & lịch bay</TieuDe>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {combo.noiKhoiHanh.map((n) => (
                    <div key={n.city} className="card-surface p-4">
                      <p className="font-display font-semibold text-deep-900">Từ {n.city}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{n.surchargeUsd > 0 ? `Phụ thu ${usd(n.surchargeUsd)}/khách` : n.surchargeUsd === 0 ? "Không phụ thu" : "Phụ thu: liên hệ"}</p>
                      {n.flights?.length > 0 && <ul className="mt-3 space-y-1 font-mono text-sm text-ocean-800">{n.flights.map((f, i) => <li key={i}>{f}</li>)}</ul>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {combo.itinerary.length > 0 && (
              <div>
                <TieuDe>Lịch trình chi tiết</TieuDe>
                <ol className="mt-5 space-y-4">
                  {combo.itinerary.map((d) => (
                    <li key={d.day} className="card-surface p-5">
                      <div className="flex items-start gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-700 font-display text-sm font-bold text-white">{d.day}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-ocean-700">Ngày {d.day}</p>
                          <h3 className="font-display text-base font-semibold text-deep-900">{d.title}</h3>
                          {d.meals && <p className="mt-1 flex items-center gap-1.5 text-sm text-sunset-700"><Utensils aria-hidden="true" className="h-4 w-4" />{d.meals}</p>}
                          {d.desc && <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink-muted">{d.desc}</p>}
                          {d.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                              {d.images.map((a, i) => <div key={a} className="relative h-28 overflow-hidden rounded-xl sm:h-36"><Anh src={a} alt={`Ngày ${d.day}: ${d.title} - ảnh ${i + 1}`} sizes="(max-width: 640px) 50vw, 240px" /></div>)}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {r.amenities?.length > 0 && (
              <div>
                <TieuDe phu={r.packageName ? `Trong gói ${r.packageName}` : null}>Tiện ích tại {r.name}</TieuDe>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {r.amenities.map((a) => (
                    <div key={a.title} className="card-surface p-5">
                      <h3 className="font-display text-base font-bold text-deep-900">{a.title}</h3>
                      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink-muted">{a.items.map((m, i) => <li key={i} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ocean-400" />{m}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(combo.included.length > 0 || combo.excluded.length > 0) && (
              <div>
                <TieuDe>Giá combo bao gồm những gì</TieuDe>
                <div className={`mt-5 grid gap-4 ${combo.included.length && combo.excluded.length ? "md:grid-cols-2" : ""}`}>
                  {[
                    { tieuDe: "Đã bao gồm", ds: combo.included, Icon: Check, mau: "text-teal-600", nen: "bg-teal-50" },
                    { tieuDe: "Không bao gồm", ds: combo.excluded, Icon: X, mau: "text-sunset-700", nen: "bg-sunset-50" },
                  ].filter((c) => c.ds.length).map(({ tieuDe, ds, Icon, mau, nen }) => (
                    <div key={tieuDe} className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
                      <h3 className="font-display text-base font-bold text-deep-900">{tieuDe}</h3>
                      <ul className="mt-3 space-y-2.5 text-base leading-relaxed text-ink-muted">
                        {ds.map((dong, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span aria-hidden="true" className={`mt-[0.2rem] grid h-5 w-5 shrink-0 place-items-center rounded-full ${nen}`}><Icon className={`h-3.5 w-3.5 ${mau}`} strokeWidth={3} /></span>
                            <span>{dong}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(combo.notes.length > 0 || r.policies?.length > 0) && (
              <div className="card-surface px-5 py-2 sm:px-8">
                <h2 className="pb-1 pt-4 font-display text-lg font-bold text-deep-900">Lưu ý & quy định của resort</h2>
                {combo.notes.map((n) => <MucMo key={`n-${n.title}`} tieuDe={n.title} noiDung={n.content} />)}
                {(r.policies ?? []).map((n) => <MucMo key={`p-${n.title}`} tieuDe={n.title} noiDung={n.content} />)}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <DatComboMaldives combo={combo} hotline={hotline} tg={tg} />
          </aside>
        </div>
      </section>

      {/* Điện thoại: ô đặt nằm cuối trang — thanh nhỏ ở đáy màn hình dẫn xuống */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-ocean-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <p className="text-sm text-ink-muted">{combo.giaTu ? <>Từ <strong className="font-display text-lg text-sunset-700">{usd(combo.giaTu)}</strong>/khách</> : "Combo Maldives"}</p>
        <a href="#dat-combo" className="btn-cta !px-5 !py-2.5 text-sm"><CalendarDays aria-hidden="true" className="h-4 w-4" /> Đặt combo</a>
      </div>
      <div aria-hidden="true" className="h-16 lg:hidden" />
    </article>
  );
}
