"use client";
import { useState } from "react";
import { Star, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

// Form khách gửi đánh giá cho một gói sự kiện. Ai cũng gửi được (không cần đăng
// nhập); backend lưu ở trạng thái chờ admin duyệt.
export default function EventReviewForm({ slug }) {
  const [xong, setXong] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [sao, setSao] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ customer_name: "", content: "", website: "" });

  const doiO = (ten) => (e) => setForm((f) => ({ ...f, [ten]: e.target.value }));

  const guiForm = async (e) => {
    e.preventDefault();
    if (dangGui) return;
    if (sao < 1) {
      setLoi("Vui lòng chọn số sao.");
      return;
    }
    setDangGui(true);
    setLoi("");

    try {
      const res = await fetch(`/api/events/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: sao }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          setLoi("Bạn gửi hơi nhanh. Vui lòng thử lại sau ít phút.");
          return;
        }
        const chiTiet = data?.errors ? Object.values(data.errors).flat().join(" ") : null;
        setLoi(chiTiet || data?.message || "Gửi đánh giá thất bại. Vui lòng thử lại.");
        return;
      }
      setXong(true);
    } catch {
      setLoi("Không kết nối được máy chủ. Vui lòng thử lại sau.");
    } finally {
      setDangGui(false);
    }
  };

  if (xong) {
    return (
      <div className="card-surface flex flex-col items-center justify-center p-6 py-10 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-50">
          <CheckCircle2 className="h-9 w-9 text-teal-600" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-deep-900">Cảm ơn bạn!</h3>
        <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
          Đánh giá của bạn đang chờ kiểm duyệt và sẽ hiển thị sau ít phút.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={guiForm} className="card-surface relative space-y-4 p-6">
      <h3 className="font-display text-lg font-bold text-deep-900">Viết đánh giá của bạn</h3>

      <div>
        <label className="text-xs font-semibold text-ink-muted">Đánh giá của bạn</label>
        <div className="mt-1.5 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSao(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} sao`}
              className="p-0.5"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  n <= (hover || sao) ? "fill-sunset-400 text-sunset-400" : "text-ocean-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-ink-muted">Tên của bạn</label>
        <input
          required
          value={form.customer_name}
          onChange={doiO("customer_name")}
          placeholder="Nguyễn Văn A"
          className="mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-ink-muted">Nội dung</label>
        <textarea
          required
          rows={4}
          minLength={10}
          maxLength={2000}
          value={form.content}
          onChange={doiO("content")}
          placeholder="Chia sẻ trải nghiệm của bạn về chương trình..."
          className="mt-1.5 w-full resize-none rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white"
        />
      </div>

      {/* Ô bẫy chống bot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website-rv">Đừng điền ô này</label>
        <input id="website-rv" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={doiO("website")} />
      </div>

      {loi && (
        <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{loi}</span>
        </div>
      )}

      <button type="submit" disabled={dangGui} className="btn-cta w-full !py-3 disabled:opacity-60">
        {dangGui ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Đang gửi...</>
        ) : (
          <>Gửi đánh giá <Send className="h-4 w-4" /></>
        )}
      </button>
    </form>
  );
}
