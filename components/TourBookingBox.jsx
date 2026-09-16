"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User, Phone, CalendarDays, ChevronDown, Users2, Baby, ArrowRight,
  ShieldCheck, CheckCircle2, BadgeCheck, MapPin,
} from "lucide-react";
import Link from "next/link";
import { createBooking } from "@/app/lib/api";
import { formatVND } from "@/data/tours";

// Ô đặt tour dùng lại được: trang chi tiết tour và bài cẩm nang (gắn tour) đều
// dùng chung. Nhận `tour` đã map và `settings` (lấy hotline). `tourLink` để hiện
// tên tour dẫn sang trang tour khi đặt từ bài cẩm nang.
export default function TourBookingBox({ tour, settings = {}, tourLink = null }) {
  const hotline = settings.hotline || "0907 870 707";

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [form, setForm] = useState({ name: "", contact: "" });
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [depId, setDepId] = useState(tour?.departures?.[0]?.id ?? null);

  // Điền sẵn tên & SĐT cho khách đã đăng nhập (lấy phía trình duyệt để không phá ISR).
  useEffect(() => {
    let huy = false;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const u = json?.user;
        if (huy || !u) return;
        setForm((f) => ({ name: f.name || u.name || "", contact: f.contact || u.phone || "" }));
      })
      .catch(() => {});
    return () => { huy = true; };
  }, []);

  if (!tour) return null;

  const dotDangChon = tour.departures?.find((d) => d.id === depId) ?? null;
  const donGiaNguoiLon = dotDangChon?.price ?? tour.price;
  const choConLai = dotDangChon?.seatsLeft ?? tour.seatsLeft;
  const tranKhach = choConLai ?? 50;

  const doiSoKhach = (raw, setter) => {
    if (raw === "") { setter(""); return; }
    const so = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    if (Number.isNaN(so)) return;
    setter(Math.min(so, tranKhach));
  };
  const chotSoKhach = (giaTri, setter, toiThieu) => {
    const so = parseInt(giaTri, 10);
    setter(Number.isNaN(so) ? toiThieu : Math.max(toiThieu, Math.min(so, tranKhach)));
  };

  const childPrice = tour.childPrice ?? Math.round((donGiaNguoiLon * 0.6) / 1000) * 1000;
  const soNguoiLon = parseInt(adults, 10) || 0;
  const soTreEm = parseInt(children, 10) || 0;
  const total = soNguoiLon * donGiaNguoiLon + soTreEm * childPrice;

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.contact.trim()) {
      setFormError("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }
    const soDienThoai = form.contact.replace(/[^0-9+]/g, "");
    if (!/^(0[0-9]{9}|\+84[0-9]{9})$/.test(soDienThoai)) {
      setFormError("Số điện thoại không hợp lệ. Nhập 10 số bắt đầu bằng 0, ví dụ 0907870707.");
      return;
    }
    if (soNguoiLon < 1) {
      setFormError("Đoàn phải có ít nhất 1 người lớn.");
      return;
    }
    if (choConLai != null && soNguoiLon + soTreEm > choConLai) {
      setFormError(`Đợt này chỉ còn ${choConLai} chỗ, không đủ cho ${soNguoiLon + soTreEm} khách.`);
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const res = await createBooking({
        tour_id: tour.id,
        tour_departure_id: depId,
        customer_name: form.name.trim(),
        customer_phone: soDienThoai,
        adults: soNguoiLon,
        children: soTreEm,
      });
      setBookingCode(res?.data?.booking_code || "");
      setSubmitted(true);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-surface overflow-hidden ring-1 ring-ocean-100">
      {/* Đầu thẻ — khối giá */}
      <div className="relative overflow-hidden bg-deep-gradient p-5 text-white">
        <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-70" />
        <div className="relative">
          {tourLink && tour.name && (
            <Link href={tourLink} className="mb-2 flex items-start gap-1.5 text-sm font-semibold text-white transition-colors hover:text-gold-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <span className="line-clamp-2">{tour.name}</span>
            </Link>
          )}

          {choConLai == null ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
              <Users2 className="h-3.5 w-3.5" /> Đang nhận đặt chỗ
            </span>
          ) : choConLai > 0 ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gold-300">
              <Users2 className="h-3.5 w-3.5" /> Chỉ còn {choConLai} chỗ
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-rose-500/90 px-2.5 py-1 text-xs font-bold text-white">
              <Users2 className="h-3.5 w-3.5" /> Hết chỗ
            </span>
          )}

          <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            {tour.oldPrice && (
              <span className="text-sm text-white/60 line-through">{formatVND(tour.oldPrice)}</span>
            )}
            <span className="font-display text-[2rem] font-bold leading-none">{formatVND(donGiaNguoiLon)}</span>
          </div>

          {tour.oldPrice && tour.oldPrice > donGiaNguoiLon && (
            <p className="mt-2 inline-block rounded-lg bg-gold-500/20 px-2 py-1 text-xs font-bold text-gold-300">
              Tiết kiệm {formatVND(tour.oldPrice - donGiaNguoiLon)}
            </p>
          )}

          <p className="mt-2 text-xs text-white/80">
            / khách người lớn{tour.startDate ? ` · khởi hành ${tour.startDate}` : ""}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center px-6 py-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-50">
              <CheckCircle2 className="h-9 w-9 text-teal-600" />
            </div>
            <p className="mt-4 font-display text-lg font-bold text-deep-900">Đã gửi yêu cầu giữ chỗ!</p>
            <p className="mt-1.5 text-sm text-ink-muted">Tư vấn viên sẽ liên hệ {form.name} qua {form.contact} trong 15 phút để xác nhận.</p>
            {bookingCode && (
              <p className="mt-3 rounded-xl border border-dashed border-ocean-300 bg-ocean-50 px-4 py-2.5 font-display text-base font-bold tracking-wide text-ocean-700">
                {bookingCode}
              </p>
            )}
            <button onClick={() => setSubmitted(false)} className="mt-5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">Đặt thêm yêu cầu khác</button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-5">
            <div>
              <label className="text-xs font-semibold text-ink-muted">Họ và tên</label>
              <div className="relative mt-1.5">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-muted">Số điện thoại</label>
              <div className="relative mt-1.5">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                <input
                  value={form.contact}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contact: e.target.value.replace(/[^0-9+ ]/g, "").slice(0, 15) }))
                  }
                  type="tel"
                  inputMode="tel"
                  maxLength={15}
                  autoComplete="tel"
                  placeholder="09xx xxx xxx"
                  className="w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-muted">Ngày khởi hành</label>
              {tour.departures && tour.departures.length > 0 ? (
                <div className="relative mt-1.5">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
                  <select
                    value={depId ?? ""}
                    onChange={(e) => setDepId(Number(e.target.value))}
                    className="w-full appearance-none rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                  >
                    {tour.departures.map((d) => (
                      <option key={d.id} value={d.id}>{d.startDate} · còn {d.seatsLeft} chỗ</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                </div>
              ) : (
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2.5 text-sm">
                  <CalendarDays className="h-4 w-4 text-ocean-500" /> {tour.startDate || "Liên hệ để biết lịch"}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-muted">Người lớn</label>
              <div className="mt-1.5 flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2">
                <span className="flex items-center gap-2 text-sm text-ink"><Users2 className="h-4 w-4 text-ocean-500" /> {formatVND(donGiaNguoiLon)}</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setAdults((g) => Math.max(1, (parseInt(g, 10) || 1) - 1))} aria-label="Bớt một người lớn" className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100">−</button>
                  <input
                    value={adults}
                    onChange={(e) => doiSoKhach(e.target.value, setAdults)}
                    onBlur={() => chotSoKhach(adults, setAdults, 1)}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    aria-label="Số người lớn"
                    className="w-9 rounded-lg border border-transparent bg-transparent text-center text-sm font-bold text-deep-900 outline-none focus:border-ocean-300 focus:bg-white"
                  />
                  <button type="button" onClick={() => setAdults((g) => Math.min(tranKhach, (parseInt(g, 10) || 0) + 1))} aria-label="Thêm một người lớn" className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100">+</button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-muted">Trẻ em (dưới 12 tuổi)</label>
              <div className="mt-1.5 flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2">
                <span className="flex items-center gap-2 text-sm text-ink"><Baby className="h-4 w-4 text-teal-600" /> {formatVND(childPrice)}</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setChildren((g) => Math.max(0, (parseInt(g, 10) || 0) - 1))} aria-label="Bớt một trẻ em" className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100">−</button>
                  <input
                    value={children}
                    onChange={(e) => doiSoKhach(e.target.value, setChildren)}
                    onBlur={() => chotSoKhach(children, setChildren, 0)}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    aria-label="Số trẻ em"
                    className="w-9 rounded-lg border border-transparent bg-transparent text-center text-sm font-bold text-deep-900 outline-none focus:border-ocean-300 focus:bg-white"
                  />
                  <button type="button" onClick={() => setChildren((g) => Math.min(tranKhach, (parseInt(g, 10) || 0) + 1))} aria-label="Thêm một trẻ em" className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100">+</button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 rounded-xl bg-ocean-50/60 p-3.5 text-sm">
              <div className="flex items-center justify-between text-ink-muted">
                <span>{soNguoiLon} người lớn × {formatVND(donGiaNguoiLon)}</span>
                <span className="font-medium text-ink">{formatVND(soNguoiLon * donGiaNguoiLon)}</span>
              </div>
              {soTreEm > 0 && (
                <div className="flex items-center justify-between text-ink-muted">
                  <span>{soTreEm} trẻ em × {formatVND(childPrice)}</span>
                  <span className="font-medium text-ink">{formatVND(soTreEm * childPrice)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-ocean-200/70 pt-2">
                <span className="font-semibold text-deep-900">Tạm tính</span>
                <span className="font-display text-xl font-bold text-sunset-700">{formatVND(total)}</span>
              </div>
            </div>

            {formError && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{formError}</p>
            )}

            <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-cta w-full !py-3.5 text-base disabled:opacity-60">
              {submitting ? "Đang gửi..." : <>Đặt tour ngay <ArrowRight className="h-4 w-4" /></>}
            </button>

            <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-ocean-200 py-3 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50">
              <Phone className="h-4 w-4" /> Gọi tư vấn: {hotline}
            </a>

            <div className="grid grid-cols-3 gap-2 border-t border-ocean-100 pt-4 text-center">
              {[
                { icon: ShieldCheck, text: "Không phụ thu ẩn" },
                { icon: CheckCircle2, text: "Xác nhận 15 phút" },
                { icon: BadgeCheck, text: "Hoàn tiền nếu huỷ" },
              ].map((c) => (
                <div key={c.text} className="flex flex-col items-center gap-1">
                  <c.icon className="h-4 w-4 text-teal-600" />
                  <span className="text-xs leading-tight text-ink-subtle">{c.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
