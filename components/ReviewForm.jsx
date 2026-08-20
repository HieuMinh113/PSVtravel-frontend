"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Loader2, CheckCircle2, AlertCircle, PenLine, LogIn } from "lucide-react";
import useNguoiDung from "@/app/lib/useNguoiDung";

/**
 * Ô gửi đánh giá dưới trang chi tiết tour.
 *
 * Chỉ hiện với người đã đăng nhập VÀ đã thực sự đi tour này — backend kiểm tra
 * lại điều kiện đó lần nữa khi nhận bài, phần kiểm tra ở đây chỉ để không bày ra
 * cái form mà bấm vào sẽ bị từ chối.
 */
export default function ReviewForm({ slug, tourName }) {
  const { nguoiDung, dangTai } = useNguoiDung();

  const [duocDanhGia, setDuocDanhGia] = useState(null); // null = đang kiểm tra
  const [tourId, setTourId] = useState(null);
  const [sao, setSao] = useState(0);
  const [saoTam, setSaoTam] = useState(0);
  const [noiDung, setNoiDung] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [xong, setXong] = useState(false);

  // Hỏi backend xem tài khoản này có quyền đánh giá tour đang xem không
  useEffect(() => {
    if (dangTai) return;

    if (!nguoiDung) {
      setDuocDanhGia(false);
      return;
    }

    let huy = false;

    fetch(`/api/reviews/can-review/${slug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (huy) return;
        const d = json?.data ?? json ?? {};
        setDuocDanhGia(Boolean(d.can_review));
        setTourId(d.tour_id ?? null);
      })
      .catch(() => !huy && setDuocDanhGia(false));

    return () => {
      huy = true;
    };
  }, [slug, nguoiDung, dangTai]);

  const gui = async (e) => {
    e.preventDefault();
    if (dangGui) return;

    if (sao < 1) {
      setLoi("Vui lòng chọn số sao.");
      return;
    }
    if (noiDung.trim().length < 10) {
      setLoi("Vui lòng viết ít nhất 10 ký tự để chia sẻ rõ hơn.");
      return;
    }

    setDangGui(true);
    setLoi("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tour_id: tourId, rating: sao, content: noiDung.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const chiTiet = data?.errors ? Object.values(data.errors).flat().join(" ") : null;
        setLoi(chiTiet || data?.message || "Gửi đánh giá thất bại.");
        return;
      }

      setXong(true);
    } catch {
      setLoi("Không kết nối được máy chủ. Vui lòng thử lại.");
    } finally {
      setDangGui(false);
    }
  };

  // Đang kiểm tra: không bày gì ra, tránh nhấp nháy
  if (dangTai || duocDanhGia === null) return null;

  // Chưa đăng nhập: mời đăng nhập, không giấu biệt chức năng
  if (!nguoiDung) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ocean-200 bg-ocean-50/40 px-6 py-7 text-center">
        <PenLine className="h-6 w-6 text-ocean-500" />
        <p className="text-sm text-ink-muted">
          Bạn đã đi tour này? Đăng nhập để chia sẻ cảm nhận với những khách sau.
        </p>
        <Link
          href="/dang-nhap"
          className="flex items-center gap-1.5 rounded-full bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700"
        >
          <LogIn className="h-4 w-4" /> Đăng nhập để đánh giá
        </Link>
      </div>
    );
  }

  // Đăng nhập rồi nhưng chưa đi tour này (hoặc đã đánh giá rồi)
  if (!duocDanhGia) {
    return (
      <p className="mt-8 rounded-2xl bg-ocean-50/50 px-5 py-4 text-center text-sm text-ink-muted">
        Chỉ khách đã đi tour này mới gửi được đánh giá. Nếu bạn vừa đi xong mà chưa
        thấy ô đánh giá, vui lòng gọi hotline để chúng tôi đóng đơn giúp bạn.
      </p>
    );
  }

  if (xong) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex flex-col items-center gap-2.5 rounded-2xl bg-teal-50 px-6 py-8 text-center ring-1 ring-teal-200"
      >
        <CheckCircle2 className="h-8 w-8 text-teal-600" />
        <p className="font-display text-lg font-bold text-teal-800">Cảm ơn bạn đã chia sẻ!</p>
        <p className="max-w-sm text-sm text-teal-700">
          Đánh giá đang chờ duyệt và sẽ hiển thị công khai sau ít phút.
        </p>
      </motion.div>
    );
  }

  const nhanSao = ["Rất tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"];
  const dangHien = saoTam || sao;

  return (
    <form onSubmit={gui} className="mt-8 rounded-2xl bg-white p-6 shadow-card sm:p-7">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-deep-900">
        <PenLine className="h-5 w-5 text-ocean-600" /> Chia sẻ cảm nhận của bạn
      </h3>
      <p className="mt-1.5 text-sm text-ink-muted">
        Về hành trình <span className="font-semibold text-deep-900">{tourName}</span>
      </p>

      {/* Chọn sao */}
      <div className="mt-5">
        <span className="text-sm font-semibold text-deep-900">Bạn đánh giá mấy sao?</span>
        <div className="mt-2.5 flex items-center gap-1" onMouseLeave={() => setSaoTam(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSao(n)}
              onMouseEnter={() => setSaoTam(n)}
              aria-label={`${n} sao — ${nhanSao[n - 1]}`}
              className="rounded-lg p-1 transition-transform duration-200 hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  n <= dangHien ? "fill-gold-400 text-gold-400" : "text-ocean-200"
                }`}
              />
            </button>
          ))}
          {dangHien > 0 && (
            <span className="ml-2 text-sm font-semibold text-ink-muted">{nhanSao[dangHien - 1]}</span>
          )}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="noi-dung-danh-gia" className="text-sm font-semibold text-deep-900">
          Cảm nhận của bạn
        </label>
        <textarea
          id="noi-dung-danh-gia"
          rows={5}
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          maxLength={1000}
          placeholder="Hướng dẫn viên, khách sạn, bữa ăn, lịch trình… điều gì làm bạn nhớ nhất?"
          className="mt-2 w-full rounded-xl border border-ocean-100 bg-white px-4 py-3 text-sm leading-relaxed text-deep-900 outline-none transition-colors placeholder:text-ink-subtle/60 focus:border-ocean-400"
        />
        <p className="mt-1.5 text-right text-xs text-ink-subtle">{noiDung.length}/1000</p>
      </div>

      <AnimatePresence>
        {loi && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{loi}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={dangGui} className="btn-cta !px-6 !py-3 text-sm disabled:opacity-60">
          {dangGui ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang gửi...</> : "Gửi đánh giá"}
        </button>
        <p className="text-xs text-ink-subtle">
          Hiển thị với tên <span className="font-semibold text-ink-muted">{nguoiDung.name}</span> sau khi được duyệt.
        </p>
      </div>
    </form>
  );
}
