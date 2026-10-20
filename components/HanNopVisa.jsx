"use client";
import { useEffect, useState } from "react";
import { FileClock } from "lucide-react";

// Hạn nộp hồ sơ visa của tour nước ngoài (đặt trong admin: quy tắc chung
// "trước ngày khởi hành N ngày" của tour, hoặc hạn riêng từng ngày khởi hành).
//
// Số ngày còn lại tính SAU khi trang chạy trên máy khách: máy chủ có thể đang
// ở múi giờ khác (UTC) — tính lúc dựng trang sẽ lệch một ngày và React báo lỗi
// lệch nội dung giữa máy chủ và trình duyệt.

/** Số ngày từ hôm nay tới ngày "Y-m-d" (âm = đã qua). */
export function conNgay(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const nay = new Date();
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(nay.getFullYear(), nay.getMonth(), nay.getDate())) / 86400000);
}

const MAU = {
  thuong: "bg-ocean-50 text-ocean-800 ring-ocean-100",
  gap: "bg-amber-50 text-amber-800 ring-amber-200",
  qua: "bg-rose-50 text-rose-700 ring-rose-200",
};

/**
 * @param ngay   hạn của ngày khởi hành đang chọn, dạng "15/11/2026"
 * @param iso    cùng ngày đó dạng "2026-11-15" (để tính còn bao nhiêu ngày)
 * @param soNgay quy tắc chung của tour — dùng khi chưa có ngày khởi hành cụ thể
 */
export default function HanNopVisa({ ngay, iso, soNgay, className = "" }) {
  const [n, setN] = useState(null);
  useEffect(() => setN(conNgay(iso)), [iso]);

  if (!ngay && !soNgay) return null;
  const muc = n === null ? "thuong" : n < 0 ? "qua" : n <= 7 ? "gap" : "thuong";

  return (
    <p className={`flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ring-1 ${MAU[muc]} ${className}`}>
      <FileClock className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
      {ngay ? (
        <span>
          Hạn nộp hồ sơ visa: <strong className="font-bold">{ngay}</strong>
          {muc === "gap" && (n === 0 ? " — hôm nay là hạn cuối" : ` — còn ${n} ngày`)}
          {muc === "qua" && " — đã qua hạn, gọi hotline để được hỗ trợ"}
        </span>
      ) : (
        <span>
          Nộp hồ sơ visa trước ngày khởi hành <strong className="font-bold">{soNgay} ngày</strong>
        </span>
      )}
    </p>
  );
}

/**
 * Mọi ngày khởi hành hiện có đều đã quá hạn nộp hồ sơ visa (tour đã ẩn khỏi
 * danh sách, khách vào bằng link cũ): báo rõ thay vì để trống ô ngày, mời gọi
 * tư vấn đợt khác. Vẫn gửi yêu cầu được — nhân viên sẽ gọi lại.
 */
export function HetHanNhanHoSo({ hotline, className = "" }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200 ${className}`}>
      <FileClock className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        Các ngày khởi hành hiện có đã <strong className="font-bold">hết hạn nhận hồ sơ visa</strong>.
        {" "}Gọi{" "}
        <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="font-bold underline underline-offset-2">{hotline}</a>
        {" "}hoặc gửi yêu cầu bên dưới để được tư vấn đợt khác.
      </span>
    </div>
  );
}
