"use client";
import { useState } from "react";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

// Form yêu cầu tổ chức sự kiện / team building.
//
// `goi` (không bắt buộc): tên gói khách đang xem — điền sẵn để bộ phận sự kiện
// biết khách quan tâm gói nào. `hotline` để hiện số gọi nhanh khi lỗi mạng.
export default function TeamBuildingForm({ goi = "", hotline = "0907 870 707" }) {
  const [xong, setXong] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    group_size: "",
    event_date: "",
    location: "",
    budget: "",
    message: "",
    package: goi,
    website: "", // ô bẫy chống bot
  });

  const doiO = (ten) => (e) => setForm((f) => ({ ...f, [ten]: e.target.value }));
  const soGoi = hotline.replace(/[^0-9]/g, "");

  const guiForm = async (e) => {
    e.preventDefault();
    if (dangGui) return;
    setDangGui(true);
    setLoi("");

    try {
      const res = await fetch("/api/team-building", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, package: goi || form.package }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          setLoi("Bạn đã gửi nhiều yêu cầu liên tiếp. Vui lòng gọi hotline để được hỗ trợ ngay.");
          return;
        }
        const chiTiet = data?.errors ? Object.values(data.errors).flat().join(" ") : null;
        setLoi(chiTiet || data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
        return;
      }

      setXong(true);
      setForm((f) => ({
        ...f, name: "", phone: "", email: "", company: "",
        group_size: "", event_date: "", location: "", budget: "", message: "",
      }));
    } catch {
      setLoi("Không kết nối được máy chủ. Vui lòng gọi hotline giúp chúng tôi.");
    } finally {
      setDangGui(false);
    }
  };

  const oInput =
    "mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white";
  const nhan = "text-xs font-semibold text-ink-muted";

  if (xong) {
    return (
      <div className="card-surface flex flex-col items-center justify-center p-8 py-16 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-50">
          <CheckCircle2 className="h-11 w-11 text-teal-600" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-deep-900">Đã gửi yêu cầu!</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-muted">
          Cảm ơn bạn. Bộ phận sự kiện của PSV Travel sẽ liên hệ tư vấn và báo giá trong thời gian sớm nhất.
        </p>
        <button onClick={() => setXong(false)} className="mt-6 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={guiForm} className="card-surface relative space-y-5 p-6 sm:p-8">
      <div>
        <h3 className="font-display text-xl font-bold text-deep-900">Nhận tư vấn &amp; báo giá</h3>
        <p className="mt-1 text-sm text-ink-muted">
          {goi ? `Bạn đang quan tâm: ${goi}. ` : ""}Để lại thông tin, chúng tôi gọi lại trong 15 phút làm việc.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={nhan}>Họ và tên <span className="text-sunset-600">*</span></label>
          <input required value={form.name} onChange={doiO("name")} placeholder="Nguyễn Văn A" className={oInput} />
        </div>
        <div>
          <label className={nhan}>Số điện thoại <span className="text-sunset-600">*</span></label>
          <input required type="tel" inputMode="tel" value={form.phone} onChange={doiO("phone")} placeholder="09xx xxx xxx" className={oInput} />
        </div>
        <div>
          <label className={nhan}>Email <span className="font-normal text-ink-subtle">(không bắt buộc)</span></label>
          <input type="email" value={form.email} onChange={doiO("email")} placeholder="ban@email.com" className={oInput} />
        </div>
        <div>
          <label className={nhan}>Công ty / đơn vị</label>
          <input value={form.company} onChange={doiO("company")} placeholder="Tên công ty" className={oInput} />
        </div>
        <div>
          <label className={nhan}>Số người dự kiến</label>
          <input value={form.group_size} onChange={doiO("group_size")} placeholder="VD: 80 người" className={oInput} />
        </div>
        <div>
          <label className={nhan}>Ngày mong muốn</label>
          <input value={form.event_date} onChange={doiO("event_date")} placeholder="VD: cuối tháng 11" className={oInput} />
        </div>
        <div>
          <label className={nhan}>Địa điểm mong muốn</label>
          <input value={form.location} onChange={doiO("location")} placeholder="VD: Vũng Tàu" className={oInput} />
        </div>
        <div>
          <label className={nhan}>Ngân sách dự kiến</label>
          <input value={form.budget} onChange={doiO("budget")} placeholder="VD: 1.5 triệu/khách" className={oInput} />
        </div>
      </div>

      <div>
        <label className={nhan}>Nội dung cần trao đổi</label>
        <textarea rows={4} maxLength={2000} value={form.message} onChange={doiO("message")} placeholder="Mô tả nhu cầu, yêu cầu riêng của đoàn..." className={`${oInput} resize-none`} />
      </div>

      {/* Ô bẫy chống bot — ẩn khỏi mắt người và trình đọc màn hình */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website-tb">Đừng điền ô này</label>
        <input id="website-tb" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={doiO("website")} />
      </div>

      {loi && (
        <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{loi}</span>
        </div>
      )}

      <button type="submit" disabled={dangGui} className="btn-cta w-full !py-3.5 disabled:opacity-60">
        {dangGui ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Đang gửi...</>
        ) : (
          <>Gửi yêu cầu tư vấn <Send className="h-4 w-4" /></>
        )}
      </button>
      <p className="text-center text-xs text-ink-subtle">
        Hoặc gọi trực tiếp <a href={`tel:${soGoi}`} className="font-semibold text-sunset-700 hover:underline">{hotline}</a> để được hỗ trợ ngay.
      </p>
    </form>
  );
}
