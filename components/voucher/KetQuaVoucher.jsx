import { CheckCircle2, XCircle, Clock, PauseCircle, Ban, SearchX, CalendarDays, Wallet } from "lucide-react";
import { formatVND } from "@/app/lib/seo";
import { trangThai, ngayVN } from "@/app/lib/voucher";

const BIEU_TUONG = {
  con_dung: CheckCircle2,
  da_dung: XCircle,
  het_han: Clock,
  tam_ngung: PauseCircle,
  da_huy: Ban,
  khong_co: SearchX,
};

// Kết quả kiểm tra một voucher — dùng ở ô kiểm tra (trang Voucher & ưu đãi) và
// trang /voucher/[mã] (khách quét QR trên voucher bằng camera điện thoại).
// `v` = data từ API (null khi không có mã); `ma` = mã khách đã nhập.
export default function KetQuaVoucher({ v, ma, lon = false }) {
  const tt = v?.trang_thai ?? "khong_co";
  const t = trangThai(tt);
  const Icon = BIEU_TUONG[tt] ?? SearchX;
  const mau = t.tot
    ? "border-teal-500 bg-teal-50 text-teal-800"
    : tt === "het_han" || tt === "tam_ngung"
      ? "border-amber-400 bg-amber-50 text-amber-800"
      : "border-red-300 bg-red-50 text-red-700";

  return (
    <div className={`rounded-2xl border-2 ${mau} ${lon ? "p-5 sm:p-7" : "p-4 sm:p-5"}`} role="status" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className={`flex items-center gap-2 font-display font-bold ${lon ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          <Icon className={lon ? "h-8 w-8" : "h-6 w-6"} aria-hidden="true" /> {t.nhan}
        </p>
        <p className="font-mono text-base font-bold tracking-wider text-deep-900">{v?.ma ?? ma}</p>
      </div>
      <p className="mt-1.5 text-sm text-ink">{t.moTa}</p>

      {v && (
        <dl className={`mt-4 grid gap-3 text-deep-900 ${lon ? "sm:grid-cols-3" : "grid-cols-2"}`}>
          <div className="rounded-xl bg-white/80 p-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-ink-muted"><Wallet className="h-3.5 w-3.5" /> Mệnh giá</dt>
            <dd className={`font-display font-bold text-sunset-700 ${lon ? "text-2xl" : "text-xl"}`}>{v.gia_tri ? formatVND(v.gia_tri) : "—"}</dd>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-ink-muted"><CalendarDays className="h-3.5 w-3.5" /> {tt === "da_dung" ? "Đã dùng ngày" : "Hạn sử dụng"}</dt>
            <dd className="text-base font-bold">{(tt === "da_dung" ? ngayVN(v.da_dung_ngay) : ngayVN(v.het_han)) ?? "—"}</dd>
          </div>
          {lon && v.ten_dot && (
            <div className="rounded-xl bg-white/80 p-3">
              <dt className="text-xs font-medium text-ink-muted">Chương trình</dt>
              <dd className="text-base font-bold">{v.ten_dot}</dd>
            </div>
          )}
        </dl>
      )}
      {v && (v.ap_dung || v.dieu_kien) && (
        <div className="mt-3 space-y-1 text-sm text-ink">
          {v.ap_dung && <p><span className="font-semibold text-deep-900">Áp dụng:</span> {v.ap_dung}</p>}
          {v.dieu_kien && <p className="whitespace-pre-line"><span className="font-semibold text-deep-900">Điều kiện:</span> {v.dieu_kien}</p>}
        </div>
      )}
    </div>
  );
}
