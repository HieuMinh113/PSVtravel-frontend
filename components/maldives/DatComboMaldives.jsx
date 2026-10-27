"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BedDouble, CalendarDays, CheckCircle2, ChevronDown, Mail, MapPin, Phone, User } from "lucide-react";
import { datComboMaldives } from "@/app/lib/api";
import { fbTrack } from "@/app/lib/fbpixel";
import { bamLienHe, ghiLead, ghiXemMaldives } from "@/app/lib/doLuong";
import { gtagConversion, CONVERSION_LIEN_HE } from "@/app/lib/gtag";
import { baoGia, ngayVN, quyDoi, trieuDong, usd } from "@/app/lib/maldives";

const O_NHAP = "w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white";

function O({ nhan, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-muted">{nhan}</span>
      <span className="relative mt-1.5 block">{children}</span>
    </label>
  );
}

function SoKhach({ nhan, phu, giaTri, doi, toiThieu = 0 }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2">
      <span className="text-sm text-ink">
        {nhan}
        {phu && <span className="block text-xs text-ink-muted">{phu}</span>}
      </span>
      <span className="flex items-center gap-3">
        <button type="button" onClick={() => doi(Math.max(toiThieu, giaTri - 1))} aria-label={`Bớt ${nhan.toLowerCase()}`} className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100">−</button>
        <span className="w-6 text-center text-sm font-bold text-deep-900" aria-live="polite">{giaTri}</span>
        <button type="button" onClick={() => doi(Math.min(30, giaTri + 1))} aria-label={`Thêm ${nhan.toLowerCase()}`} className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100">+</button>
      </span>
    </div>
  );
}

// Ô đặt combo Maldives: chọn ngày → hạng phòng (chỉ hạng bán ngày đó) → nơi
// khởi hành → số khách, giá tạm tính tính lại ngay. Gửi xong nhân viên gọi xác
// nhận còn phòng và chốt giá VNĐ.
export default function DatComboMaldives({ combo, hotline = "0907 870 707", tg = null }) {
  const ngayMo = combo.dates.filter((d) => d.status === "open");
  const [ngayId, setNgayId] = useState(ngayMo[0]?.id ?? null);
  const ngay = combo.dates.find((d) => d.id === ngayId) ?? null;
  const phongCoGia = useMemo(
    () => combo.roomTypes.filter((p) => Number(ngay?.prices?.[p.id]) > 0).sort((a, b) => ngay.prices[a.id] - ngay.prices[b.id]),
    [combo.roomTypes, ngay]
  );
  const [phongChon, setPhongId] = useState(phongCoGia[0]?.id ?? null);
  // Đổi ngày mà hạng phòng đang chọn không bán ngày đó → hạng rẻ nhất của ngày mới
  const phongId = phongCoGia.some((p) => p.id === phongChon) ? phongChon : (phongCoGia[0]?.id ?? null);
  const [noiDi, setNoiDi] = useState(combo.noiKhoiHanh[0]?.city ?? "");
  const [nguoiLon, setNguoiLon] = useState(2);
  const [treEm, setTreEm] = useState(0);
  const [emBe, setEmBe] = useState(0);
  const [khach, setKhach] = useState({ ten: "", sdt: "", email: "", ghiChu: "" });
  const [loi, setLoi] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [xong, setXong] = useState(null);

  useEffect(() => { ghiXemMaldives(combo); }, [combo]);

  const phong = combo.roomTypes.find((p) => p.id === phongId) ?? null;
  // Hạng phòng chỉ nhận người lớn (từ 18 tuổi): không tính / không gửi trẻ em, em bé
  const chiNguoiLon = Boolean(phong?.adultsOnly);
  const soTreEm = chiNguoiLon ? 0 : treEm;
  const soEmBe = chiNguoiLon ? 0 : emBe;
  const nd = combo.noiKhoiHanh.find((n) => n.city === noiDi) ?? null;
  const gia = baoGia({ childPercent: combo.childPercent, ngay, phongId, noiDi: nd, nguoiLon, treEm: soTreEm, emBe: soEmBe, tg });

  const gui = async () => {
    setLoi("");
    if (khach.ten.trim().length < 2) return setLoi("Vui lòng nhập họ tên.");
    if (!/^[0-9+ .-]{8,20}$/.test(khach.sdt.trim())) return setLoi("Vui lòng nhập số điện thoại hợp lệ.");
    setDangGui(true);
    try {
      const kq = await datComboMaldives({
        combo_id: combo.id, combo_date_id: ngayId, room_type_id: phongId, departure_city: noiDi || null,
        adults: nguoiLon, children: soTreEm, infants: soEmBe,
        customer_name: khach.ten.trim(), customer_phone: khach.sdt.trim(), customer_email: khach.email.trim() || null, note: khach.ghiChu.trim() || null,
      });
      setXong(kq?.data ?? {});
      const giaTriVnd = kq?.data?.total_vnd || 0;
      fbTrack("Lead", { content_name: combo.name, content_category: "maldives", ...(gia.tong ? { value: gia.tong, currency: "USD" } : {}) });
      gtagConversion(CONVERSION_LIEN_HE, { ...(giaTriVnd ? { value: giaTriVnd, currency: "VND" } : {}), ...(kq?.data?.code ? { transaction_id: kq.data.code } : {}) });
      ghiLead("maldives", { giaTri: giaTriVnd, tenTour: combo.name });
    } catch (e) {
      setLoi(e.message);
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div id="dat-combo" className="card-surface scroll-mt-28 overflow-hidden">
      <div className="bg-ocean-800 p-5 text-white">
        <p className="text-xs font-semibold text-gold-300">{ngay ? `Khởi hành ${ngayVN(ngay.startDate)}${ngay.label ? ` · ${ngay.label}` : ""}` : "Combo Maldives"}</p>
        <p className="mt-2 font-display text-3xl font-bold leading-none">
          {gia.donGia ? usd(gia.donGia) : combo.giaTu ? <><span className="text-base font-semibold">Từ </span>{usd(combo.giaTu)}</> : "Liên hệ"}
        </p>
        <p className="mt-2 text-xs text-white/85">
          / người lớn{phong ? ` · ${phong.name}` : ""}
          {(gia.donGia || combo.giaTu) && tg ? <> · {quyDoi(gia.donGia || combo.giaTu, tg)}</> : null}
        </p>
      </div>

      {xong ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-teal-50"><CheckCircle2 className="h-9 w-9 text-teal-600" /></span>
          <p className="mt-4 font-display text-lg font-bold text-deep-900">Đã gửi yêu cầu đặt combo!</p>
          <p className="mt-1.5 text-sm text-ink-muted">Nhân viên sẽ gọi {khach.ten} qua số {khach.sdt} để xác nhận còn phòng và báo giá chính xác.</p>
          {xong.code && <p className="mt-3 rounded-xl border border-dashed border-ocean-300 bg-ocean-50 px-4 py-2.5 font-display text-base font-bold tracking-wide text-ocean-700">{xong.code}</p>}
          <button type="button" onClick={() => setXong(null)} className="mt-5 min-h-[44px] text-sm font-semibold text-ocean-700 hover:text-ocean-800">Gửi thêm yêu cầu khác</button>
        </div>
      ) : (
        <div className="space-y-4 p-5">
          {combo.dates.length > 0 ? (
            <O nhan="Ngày khởi hành">
              <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
              <select value={ngayId ?? ""} onChange={(e) => setNgayId(Number(e.target.value))} className={`${O_NHAP} appearance-none pr-9`}>
                {combo.dates.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.status !== "open"}>
                    {ngayVN(d.startDate)}{d.label ? ` · ${d.label}` : ""}{d.status === "full" ? " · hết phòng" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
            </O>
          ) : (
            <p className="rounded-xl bg-ocean-50 px-3.5 py-2.5 text-sm text-ink-muted">Đang cập nhật ngày khởi hành — gửi yêu cầu, nhân viên báo lịch gần nhất.</p>
          )}

          {phongCoGia.length > 0 && (
            <O nhan="Hạng phòng">
              <BedDouble aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
              <select value={phongId ?? ""} onChange={(e) => setPhongId(Number(e.target.value))} className={`${O_NHAP} appearance-none pr-9`}>
                {phongCoGia.map((p) => <option key={p.id} value={p.id}>{p.name} — {usd(ngay.prices[p.id])}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
            </O>
          )}
          {phong?.capacity && <p className="-mt-2 px-1 text-xs text-ink-muted">Sức chứa: {phong.capacity}</p>}

          {combo.noiKhoiHanh.length > 0 && (
            <O nhan="Khởi hành từ">
              <MapPin aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
              <select value={noiDi} onChange={(e) => setNoiDi(e.target.value)} className={`${O_NHAP} appearance-none pr-9`}>
                {combo.noiKhoiHanh.map((n) => (
                  <option key={n.city} value={n.city}>
                    {n.city}{n.surchargeUsd > 0 ? ` (+${usd(n.surchargeUsd)}/khách)` : n.surchargeUsd == null ? " (phụ thu: liên hệ)" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
            </O>
          )}

          <div className="space-y-2">
            <SoKhach nhan="Người lớn" giaTri={nguoiLon} doi={setNguoiLon} toiThieu={1} />
            {chiNguoiLon ? (
              <p className="rounded-xl bg-gold-50 px-3.5 py-2.5 text-xs leading-relaxed text-gold-900">
                {phong.name} chỉ nhận khách từ 18 tuổi. Đi cùng trẻ em, vui lòng chọn hạng phòng khác hoặc gọi để được tư vấn.
              </p>
            ) : (
              <>
                <SoKhach nhan="Trẻ em" phu={[combo.childAge, gia.giaTreEm ? usd(gia.giaTreEm) : combo.childPercent ? `${combo.childPercent}% giá người lớn` : null].filter(Boolean).join(" · ")} giaTri={treEm} doi={setTreEm} />
                <SoKhach nhan="Em bé dưới 2 tuổi" phu={combo.infantNote || "Liên hệ"} giaTri={emBe} doi={setEmBe} />
              </>
            )}
          </div>

          <div className="space-y-1.5 rounded-xl bg-ocean-50/60 p-3.5 text-sm">
            {gia.donGia ? (
              <>
                <div className="flex justify-between text-ink-muted"><span>{nguoiLon} người lớn × {usd(gia.donGia)}</span><span className="font-medium text-ink">{usd(nguoiLon * gia.donGia)}</span></div>
                {soTreEm > 0 && gia.giaTreEm !== null && <div className="flex justify-between text-ink-muted"><span>{soTreEm} trẻ em × {usd(gia.giaTreEm)}</span><span className="font-medium text-ink">{usd(soTreEm * gia.giaTreEm)}</span></div>}
                {gia.phuThu > 0 && <div className="flex justify-between text-ink-muted"><span>Phụ thu {noiDi} × {nguoiLon + soTreEm} khách</span><span className="font-medium text-ink">{usd(gia.phuThu * (nguoiLon + soTreEm))}</span></div>}
                <div className="flex items-baseline justify-between border-t border-ocean-200/70 pt-2">
                  <span className="font-semibold text-deep-900">Tạm tính</span>
                  <span className="text-right">
                    <span className="block font-display text-xl font-bold text-sunset-700">{usd(gia.tong)}</span>
                    {gia.tongVnd && <span className="text-xs text-ink-muted">≈ {trieuDong(gia.tongVnd)} đồng</span>}
                  </span>
                </div>
                {gia.chuaGom.length > 0 && <p className="text-xs text-ink-muted">Chưa gồm {gia.chuaGom.join(", ")} — nhân viên báo khi gọi xác nhận.</p>}
              </>
            ) : (
              <p className="text-ink-muted">Nhân viên sẽ báo giá theo ngày và hạng phòng bạn cần.</p>
            )}
          </div>

          <O nhan="Họ và tên">
            <User aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
            <input value={khach.ten} onChange={(e) => setKhach((k) => ({ ...k, ten: e.target.value }))} maxLength={100} autoComplete="name" placeholder="Nguyễn Văn A" className={O_NHAP} />
          </O>
          <O nhan="Số điện thoại">
            <Phone aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
            <input value={khach.sdt} onChange={(e) => setKhach((k) => ({ ...k, sdt: e.target.value.replace(/[^0-9+ ]/g, "").slice(0, 15) }))} type="tel" inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" className={O_NHAP} />
          </O>
          <O nhan="Email (không bắt buộc)">
            <Mail aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
            <input value={khach.email} onChange={(e) => setKhach((k) => ({ ...k, email: e.target.value }))} type="email" autoComplete="email" maxLength={150} placeholder="ban@email.com" className={O_NHAP} />
          </O>
          <label className="block">
            <span className="text-xs font-semibold text-ink-muted">Ghi chú (tuần trăng mật, số phòng, yêu cầu riêng…)</span>
            <textarea value={khach.ghiChu} onChange={(e) => setKhach((k) => ({ ...k, ghiChu: e.target.value }))} maxLength={1000} rows={2} className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white" />
          </label>

          {loi && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{loi}</p>}

          <button type="button" onClick={gui} disabled={dangGui} className="btn-cta w-full !py-3.5 text-base disabled:opacity-60">
            {dangGui ? "Đang gửi..." : <>Gửi yêu cầu đặt combo <ArrowRight aria-hidden="true" className="h-4 w-4" /></>}
          </button>
          <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} onClick={() => bamLienHe("hotline", combo.name)} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-ocean-200 py-3 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50">
            <Phone aria-hidden="true" className="h-4 w-4" /> Gọi tư vấn: {hotline}
          </a>
          <p className="text-center text-xs text-ink-subtle">Gửi yêu cầu <strong className="font-semibold text-ink-muted">chưa bị trừ tiền</strong>. Giá USD quy đổi sang VNĐ theo tỷ giá lúc thanh toán.</p>
        </div>
      )}
    </div>
  );
}
