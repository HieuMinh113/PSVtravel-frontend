"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, ScanLine, X, Loader2, ArrowRight } from "lucide-react";
import KetQuaVoucher from "./KetQuaVoucher";
import { chuanHoaMa } from "@/app/lib/voucher";

const KHUNG_CAMERA = "psv-quet-voucher-khach";

// Ô kiểm tra voucher: gõ mã in dưới QR, hoặc bấm "Quét mã" để dùng camera
// (đọc QR / mã vạch ngay trong trình duyệt bằng html5-qrcode — ảnh camera không
// gửi đi đâu). Mở bằng camera điện thoại thường thì QR dẫn thẳng tới /voucher/[mã].
export default function KiemTraVoucher() {
  const [nhap, setNhap] = useState("");
  const [dang, setDang] = useState(false);
  const [kq, setKq] = useState(null); // { v, ma } | null
  const [loi, setLoi] = useState("");
  const [camera, setCamera] = useState(false);
  const [loiCamera, setLoiCamera] = useState("");
  const may = useRef(null);

  const kiemTra = async (chu = nhap) => {
    const ma = chuanHoaMa(chu);
    setLoi("");
    if (!ma) {
      setKq(null);
      setLoi("Nhập mã in dưới mã QR trên voucher, ví dụ PSV-7KQ3-MZ8T.");
      return;
    }
    setNhap(ma);
    setDang(true);
    try {
      const res = await fetch(`/api/vouchers/${encodeURIComponent(ma)}`, { headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setKq({ v: json.data, ma });
      else if (res.status === 404) setKq({ v: null, ma });
      else if (res.status === 429) setLoi("Bạn kiểm tra quá nhiều lần — đợi một phút rồi thử lại.");
      else setLoi(json?.message || "Chưa kiểm tra được, vui lòng thử lại.");
    } catch {
      setLoi("Không kết nối được máy chủ. Vui lòng thử lại.");
    } finally {
      setDang(false);
    }
  };

  // Đóng hộp quét thì khung camera bị gỡ khỏi trang — bỏ luôn bộ quét, lần sau tạo lại
  const tatCamera = async () => {
    try {
      if (may.current?.isScanning) await may.current.stop();
      may.current?.clear();
    } catch {}
    may.current = null;
    setCamera(false);
  };

  const moCamera = async () => {
    setLoiCamera("");
    setCamera(true);
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
      await new Promise((r) => requestAnimationFrame(r)); // chờ khung camera hiện ra
      may.current ??= new Html5Qrcode(KHUNG_CAMERA, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.CODE_128],
        verbose: false,
      });
      let daDoc = false;
      await may.current.start(
        { facingMode: "environment" },
        // Vùng đọc gần trọn khung hình: khách không phải căn mã vào giữa
        { fps: 12, qrbox: (w, h) => ({ width: Math.floor(w * 0.92), height: Math.floor(h * 0.9) }) },
        async (chu) => {
          if (daDoc) return;
          daDoc = true;
          navigator.vibrate?.(60);
          await tatCamera();
          kiemTra(chu);
        },
        () => {},
      );
    } catch (e) {
      const ten = e?.name || String(e);
      setLoiCamera(
        /NotAllowed|Permission/i.test(ten)
          ? "Bạn chưa cho phép dùng camera. Cho phép camera cho trang này rồi thử lại, hoặc gõ mã."
          : /NotFound|Overconstrained/i.test(ten)
            ? "Không tìm thấy camera trên thiết bị này — vui lòng gõ mã."
            : "Không mở được camera — vui lòng gõ mã in dưới QR.",
      );
    }
  };

  useEffect(() => () => {
    if (may.current?.isScanning) may.current.stop().catch(() => {});
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          kiemTra();
        }}
        className="flex flex-col gap-2.5 sm:flex-row"
      >
        <label htmlFor="ma-voucher" className="sr-only">Mã voucher</label>
        <input
          id="ma-voucher"
          value={nhap}
          onChange={(e) => setNhap(e.target.value)}
          placeholder="Nhập mã, VD: PSV-7KQ3-MZ8T"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          enterKeyHint="search"
          maxLength={60}
          className="min-w-0 flex-1 rounded-xl border border-ocean-200 bg-white px-4 py-3.5 font-mono text-base font-semibold uppercase tracking-wider text-deep-900 placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-subtle focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-200"
        />
        <div className="flex gap-2.5">
          <button type="submit" disabled={dang} className="btn-cta flex-1 justify-center !px-5 !py-3.5 text-sm sm:flex-none">
            {dang ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Kiểm tra
          </button>
          <button
            type="button"
            onClick={moCamera}
            className="vung-bam inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-ocean-200 bg-white px-4 py-3.5 text-sm font-semibold text-ocean-800 transition-colors hover:bg-ocean-50 sm:flex-none"
          >
            <ScanLine className="h-4 w-4" /> Quét mã
          </button>
        </div>
      </form>

      {loi && <p className="mt-3 text-sm font-medium text-red-600">{loi}</p>}

      {kq && (
        <div className="mt-4">
          <KetQuaVoucher v={kq.v} ma={kq.ma} />
          {kq.v && (
            <Link href={`/voucher/${encodeURIComponent(kq.v.ma)}`} className="vung-bam mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
              Mở trang voucher (gửi cho người thân, nhân viên) <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {/* Gắn thẳng vào <body>: ô kiểm tra nằm trong khối đầu trang có lớp xếp chồng
          riêng (z-10) — để tại chỗ thì thanh menu và nút liên hệ đè lên hộp quét */}
      {camera && createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-deep-950/85 p-4" role="dialog" aria-modal="true" aria-label="Quét mã voucher">
          <div className="w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-bold text-deep-900">Quét mã trên voucher</p>
              <button type="button" onClick={tatCamera} className="vung-bam rounded-full p-2 text-ink-muted hover:bg-ocean-50" aria-label="Đóng">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div id={KHUNG_CAMERA} className="overflow-hidden rounded-2xl bg-deep-900 [&_video]:!w-full" style={{ minHeight: 240 }} />
            {loiCamera ? (
              <p className="mt-3 text-sm font-medium text-red-600">{loiCamera}</p>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">Đưa mã QR (hoặc mã vạch) vào khung — máy tự đọc, không cần chụp.</p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
