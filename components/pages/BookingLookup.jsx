"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch, Loader2, AlertCircle, CalendarDays, Users2,
  Phone, ArrowRight, Ticket, Wallet,
} from "lucide-react";
import PageHero from "@/components/PageHero";

const dinhDangTien = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + "đ" : v;

// Màu nhãn trạng thái — xanh lá = xong, xanh biển = đã xác nhận,
// hổ phách = đang chờ, đỏ = huỷ. Không dùng màu để truyền tin duy nhất:
// luôn kèm chữ, phục vụ người khó phân biệt màu.
const mauTrangThai = {
  completed: "bg-teal-50 text-teal-700 ring-teal-200",
  confirmed: "bg-ocean-50 text-ocean-700 ring-ocean-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
};

export default function BookingLookup() {
  const [maDon, setMaDon] = useState("");
  const [sdt, setSdt] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [donHang, setDonHang] = useState(null);

  const guiTraCuu = async (e) => {
    e.preventDefault();
    if (dangGui) return;

    setDangGui(true);
    setLoi("");
    setDonHang(null);

    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_code: maDon.trim(), phone: sdt.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoi(
          res.status === 429
            ? "Bạn tra cứu quá nhiều lần. Vui lòng chờ một phút rồi thử lại."
            : data.message || "Không tìm thấy đơn phù hợp.",
        );
        return;
      }

      setDonHang(data.data);
    } catch {
      setLoi("Không kết nối được máy chủ. Vui lòng thử lại sau ít phút.");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Hỗ trợ khách hàng"
        title="Tra cứu đơn đặt tour"
        description="Nhập mã đơn và số điện thoại bạn đã dùng khi đặt để xem lại trạng thái hành trình. Không cần đăng nhập."
        crumbs={[{ label: "Tra cứu đơn" }]}
      />

      <section className="bg-foam py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-600">
                <FileSearch className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-deep-900">Nhập thông tin đơn</h2>
                <p className="text-xs text-ink-muted">
                  Mã đơn nằm trong email xác nhận, dạng <span className="font-mono font-semibold">PSV-20260820-A3F9</span>.
                </p>
              </div>
            </div>

            <form onSubmit={guiTraCuu} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ma-don" className="text-sm font-semibold text-deep-900">
                  Mã đơn đặt tour
                </label>
                <input
                  id="ma-don"
                  required
                  value={maDon}
                  onChange={(e) => setMaDon(e.target.value.toUpperCase())}
                  placeholder="PSV-20260820-A3F9"
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-ocean-100 bg-white px-4 py-3 font-mono text-sm text-deep-900 outline-none transition-colors placeholder:font-sans placeholder:text-ink-subtle/60 focus:border-ocean-400"
                />
              </div>

              <div>
                <label htmlFor="sdt-dat" className="text-sm font-semibold text-deep-900">
                  Số điện thoại đã đặt
                </label>
                <input
                  id="sdt-dat"
                  required
                  type="tel"
                  inputMode="tel"
                  value={sdt}
                  onChange={(e) => setSdt(e.target.value)}
                  placeholder="09xx xxx xxx"
                  autoComplete="tel"
                  className="mt-2 w-full rounded-xl border border-ocean-100 bg-white px-4 py-3 text-sm text-deep-900 outline-none transition-colors placeholder:text-ink-subtle/60 focus:border-ocean-400"
                />
              </div>

              <div className="sm:col-span-2">
                <button type="submit" disabled={dangGui} className="btn-cta w-full justify-center disabled:opacity-60">
                  {dangGui ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Đang tra cứu...
                    </>
                  ) : (
                    <>
                      Tra cứu đơn <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-ink-subtle">
                  Cần đúng cả mã đơn lẫn số điện thoại — để không ai khác xem được đơn của bạn.
                </p>
              </div>
            </form>

            <AnimatePresence mode="wait">
              {loi && (
                <motion.div
                  key="loi"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{loi}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== KẾT QUẢ ===== */}
          <AnimatePresence mode="wait">
            {donHang && (
              <motion.div
                key={donHang.booking_code}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ocean-50 bg-ocean-50/40 px-6 py-4">
                  <p className="flex items-center gap-2 font-mono text-sm font-bold text-deep-900">
                    <Ticket className="h-4 w-4 text-ocean-600" />
                    {donHang.booking_code}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                      mauTrangThai[donHang.status] || mauTrangThai.pending
                    }`}
                  >
                    {donHang.status_label}
                  </span>
                </div>

                <div className="flex flex-col gap-5 p-6 sm:flex-row">
                  {donHang.tour_image && (
                    <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-44">
                      <Image
                        src={donHang.tour_image}
                        alt={donHang.tour_name || "Tour đã đặt"}
                        fill
                        sizes="(max-width: 640px) 100vw, 176px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold leading-snug text-deep-900">
                      {donHang.tour_name || "Tour đã đặt"}
                    </h3>

                    <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      {donHang.start_date && (
                        <div className="flex items-center gap-2 text-ink-muted">
                          <CalendarDays className="h-4 w-4 shrink-0 text-ocean-500" />
                          Khởi hành {donHang.start_date}
                          {donHang.end_date && ` – ${donHang.end_date}`}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-ink-muted">
                        <Users2 className="h-4 w-4 shrink-0 text-ocean-500" />
                        {donHang.adults} người lớn
                        {donHang.children > 0 && `, ${donHang.children} trẻ em`}
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted">
                        <Phone className="h-4 w-4 shrink-0 text-ocean-500" />
                        {donHang.customer_name} — {donHang.customer_phone}
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted">
                        <Wallet className="h-4 w-4 shrink-0 text-ocean-500" />
                        {donHang.payment_label}
                      </div>
                    </dl>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ocean-50 pt-4">
                      <p className="font-display text-xl font-bold text-ocean-700">
                        {dinhDangTien(donHang.total_price)}
                      </p>
                      {donHang.tour_slug && (
                        <Link
                          href={`${donHang.tour_type === "domestic" ? "/tour-trong-nuoc" : "/tour-nuoc-ngoai"}/${donHang.tour_slug}`}
                          className="group flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800"
                        >
                          Xem lại lịch trình tour
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-enter group-hover:translate-x-1" />
                        </Link>
                      )}
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
                      Đơn đặt lúc {donHang.created_at}. Cần thay đổi hoặc huỷ, vui lòng gọi hotline —
                      nhân viên phụ trách sẽ đối chiếu theo mã đơn này.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
