"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, Link2, Loader2, Send, UploadCloud, X } from "lucide-react";

// Ứng tuyển ngay trên trang chi tiết tin tuyển dụng: bấm nút → hộp thoại nhập
// thông tin + đính kèm CV (PDF, bắt buộc) và portfolio (PDF hoặc link, không
// bắt buộc) → gửi một lần qua /api/ung-tuyen. Hồ sơ vào mục "Hồ sơ ứng tuyển"
// trong trang quản trị, admin nhận chuông và liên hệ ứng viên.
//
// Mở hộp thoại từ chỗ khác trên trang (nút ở đầu trang): <NutMoUngTuyen />,
// hoặc link có đuôi #ung-tuyen.

const SU_KIEN_MO = "psv:mo-ung-tuyen";
const CV_TOI_DA_MB = 5;
const PORTFOLIO_TOI_DA_MB = 10;

const oNhap =
  "mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white";

const dungLuong = (b) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.ceil(b / 1024))}KB`);
const laPdf = (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);

/** Nút mở hộp thoại ứng tuyển — đặt ở bất kỳ đâu trên trang chi tiết. */
export function NutMoUngTuyen({ className = "", children }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(SU_KIEN_MO))}>
      {children}
    </button>
  );
}

// Ô chọn file PDF: bấm để chọn hoặc kéo thả file vào
function OTepPdf({ id, nhan, goiY, toiDaMb, batBuoc, tep, datTep, loi, datLoi, khoa }) {
  const chon = useRef(null);
  const [keoVao, setKeoVao] = useState(false);

  const nhanTep = (f) => {
    if (!f) return;
    if (!laPdf(f)) return datLoi("Chỉ nhận file PDF. Xuất CV từ Word / Canva sang PDF rồi chọn lại.");
    if (f.size > toiDaMb * 1024 * 1024) return datLoi(`File ${dungLuong(f.size)} — tối đa ${toiDaMb}MB.`);
    datLoi("");
    datTep(f);
  };

  return (
    <div>
      <p id={`${id}-nhan`} className="text-xs font-semibold text-ink-muted">
        {nhan} {batBuoc && "*"}
      </p>
      <input
        ref={chon}
        id={id}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        aria-labelledby={`${id}-nhan`}
        aria-describedby={`${id}-goi-y`}
        tabIndex={-1}
        onChange={(e) => {
          nhanTep(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {tep ? (
        <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-ocean-50/70 px-4 py-3 ring-1 ring-ocean-100">
          <FileText className="h-5 w-5 shrink-0 text-ocean-600" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-deep-900">{tep.name}</span>
            <span className="block text-xs text-ink-subtle">{dungLuong(tep.size)}</span>
          </span>
          <button
            type="button"
            disabled={khoa}
            onClick={() => datTep(null)}
            aria-label={`Bỏ file ${tep.name}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-white hover:text-rose-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={khoa}
          onClick={() => chon.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setKeoVao(true);
          }}
          onDragLeave={() => setKeoVao(false)}
          onDrop={(e) => {
            e.preventDefault();
            setKeoVao(false);
            nhanTep(e.dataTransfer.files?.[0]);
          }}
          aria-describedby={`${id}-goi-y`}
          className={`mt-1.5 flex min-h-[64px] w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
            keoVao ? "border-ocean-500 bg-ocean-50 text-ocean-800" : "border-ocean-200 text-ocean-700 hover:border-ocean-400 hover:bg-ocean-50/60"
          }`}
        >
          <UploadCloud className="h-5 w-5" /> Chọn file PDF
          <span className="hidden font-normal text-ink-subtle sm:inline">hoặc kéo thả vào đây</span>
        </button>
      )}
      <p id={`${id}-goi-y`} className="mt-1 text-xs text-ink-subtle">{goiY}</p>
      {loi && (
        <p className="mt-1 text-xs font-medium text-rose-600" role="alert">
          {loi}
        </p>
      )}
    </div>
  );
}

const TRONG = { full_name: "", phone: "", email: "", message: "", portfolio_url: "", dong_y: false, website: "" };

export default function UngTuyen({ job }) {
  const hop = useRef(null);
  const idTieuDe = useId();
  const [mo, setMo] = useState(false);
  const [form, setForm] = useState(TRONG);
  const [cv, setCv] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loiO, setLoiO] = useState({}); // lỗi từng ô (từ máy chủ hoặc kiểm tra tại chỗ)
  const [loi, setLoi] = useState("");
  const [tienDo, setTienDo] = useState(null); // % đã tải lên, null = chưa gửi
  const [xong, setXong] = useState(false);
  const dangGui = tienDo !== null;

  const moHop = useCallback(() => setMo(true), []);
  const dongHop = useCallback(() => {
    if (tienDo !== null) return; // đang tải file lên thì không đóng giữa chừng
    setMo(false);
  }, [tienDo]);

  // Mở / đóng hộp thoại gốc của trình duyệt (khoá nền, bẫy Tab, Esc để đóng)
  useEffect(() => {
    const d = hop.current;
    if (!d) return;
    if (mo && !d.open) {
      d.showModal();
      d.querySelector("#ut-ten")?.focus();
      document.documentElement.style.overflow = "hidden";
    } else if (!mo && d.open) {
      d.close();
    }
    if (!mo) document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mo]);

  // Nút ở đầu trang + link …#ung-tuyen (mở trang mới hoặc chỉ đổi phần #)
  useEffect(() => {
    const theoHash = () => window.location.hash === "#ung-tuyen" && moHop();
    window.addEventListener(SU_KIEN_MO, moHop);
    window.addEventListener("hashchange", theoHash);
    theoHash();
    return () => {
      window.removeEventListener(SU_KIEN_MO, moHop);
      window.removeEventListener("hashchange", theoHash);
    };
  }, [moHop]);

  const doiO = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (loiO[k]) setLoiO((l) => ({ ...l, [k]: "" }));
    setLoi("");
  };

  const gui = async (e) => {
    e.preventDefault();
    if (dangGui) return;
    setLoi("");
    if (!cv) {
      setLoiO((l) => ({ ...l, cv: "Vui lòng đính kèm CV (PDF)." }));
      return;
    }

    const fd = new FormData();
    fd.append("slug", job.slug);
    for (const [k, v] of Object.entries(form)) fd.append(k, k === "dong_y" ? (v ? "1" : "") : v);
    fd.append("cv", cv, cv.name);
    if (portfolio) fd.append("portfolio", portfolio, portfolio.name);

    setTienDo(0);
    // XMLHttpRequest thay vì fetch: fetch không báo được tiến độ tải lên — CV
    // + portfolio cỡ 10MB trên mạng điện thoại cần thấy thanh chạy.
    const { status, data } = await new Promise((xong) => {
      const x = new XMLHttpRequest();
      x.open("POST", "/api/ung-tuyen");
      x.setRequestHeader("Accept", "application/json");
      x.upload.onprogress = (ev) => ev.lengthComputable && setTienDo(Math.round((ev.loaded / ev.total) * 100));
      x.onload = () => {
        let d = {};
        try {
          d = JSON.parse(x.responseText);
        } catch {}
        xong({ status: x.status, data: d });
      };
      x.onerror = () => xong({ status: 0, data: {} });
      x.send(fd);
    });
    setTienDo(null);

    if (status === 201) {
      setXong(true);
      return;
    }
    if (status === 422 && data?.errors) {
      setLoiO(Object.fromEntries(Object.entries(data.errors).map(([k, v]) => [k, [v].flat()[0]])));
      setLoi("Vui lòng kiểm tra lại các ô báo đỏ.");
      return;
    }
    setLoi(
      status === 0
        ? "Mất kết nối khi đang gửi. Kiểm tra mạng rồi bấm gửi lại."
        : status === 413
          ? "File quá lớn. CV tối đa 5MB, portfolio tối đa 10MB — file nặng hơn hãy dán link Google Drive."
          : status === 429
            ? "Bạn đã gửi nhiều lần. Vui lòng thử lại sau ít phút hoặc gọi hotline."
            : data?.message || "Chưa gửi được hồ sơ. Vui lòng thử lại.",
    );
  };

  const lamLai = () => {
    setForm(TRONG);
    setCv(null);
    setPortfolio(null);
    setLoiO({});
    setLoi("");
    setXong(false);
  };

  return (
    <>
      <div id="ung-tuyen" className="scroll-mt-28 rounded-3xl bg-white p-6 shadow-card ring-1 ring-ocean-100">
        <h3 className="font-display text-lg font-bold text-deep-900">Ứng tuyển vị trí này</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Gửi CV (PDF) và portfolio nếu có. Bộ phận nhân sự sẽ xem hồ sơ và liên hệ bạn.
        </p>
        <button type="button" onClick={moHop} className="btn-cta mt-5 w-full !py-3 text-sm">
          Gửi hồ sơ ứng tuyển <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <dialog
        ref={hop}
        aria-labelledby={idTieuDe}
        onCancel={(e) => {
          e.preventDefault(); // Esc: đóng qua state để đồng bộ
          dongHop();
        }}
        onClick={(e) => e.target === hop.current && dongHop()}
        className="w-[calc(100%-24px)] max-w-xl overflow-hidden rounded-3xl bg-white p-0 text-ink shadow-2xl backdrop:bg-deep-900/60 backdrop:backdrop-blur-sm open:motion-safe:animate-[hop-thoai-vao_.22s_ease-out]"
      >
        <div className="flex max-h-[min(92dvh,860px)] flex-col">
          <div className="flex items-start gap-3 border-b border-ocean-50 px-6 pb-4 pt-5">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-ocean-600">Ứng tuyển</p>
              <h2 id={idTieuDe} className="mt-0.5 font-display text-lg font-bold leading-snug text-deep-900">
                {job.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={dongHop}
              disabled={dangGui}
              aria-label="Đóng"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-ocean-50 hover:text-deep-900 disabled:opacity-40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {xong ? (
            <div className="min-h-0 overflow-y-auto px-6 py-10 text-center" role="status">
              <CheckCircle2 className="mx-auto h-14 w-14 text-teal-600" />
              <p className="mt-4 font-display text-xl font-bold text-deep-900">Đã gửi hồ sơ!</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
                PSV Travel đã nhận CV của bạn. Bộ phận nhân sự sẽ liên hệ qua số <strong className="text-deep-900">{form.phone}</strong>{" "}
                hoặc email nếu hồ sơ phù hợp. Thư xác nhận đã được gửi tới <strong className="text-deep-900">{form.email}</strong>.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={dongHop} className="btn-cta !px-7 !py-3 text-sm">
                  Xong
                </button>
                <button type="button" onClick={lamLai} className="text-sm font-semibold text-ocean-700 hover:text-ocean-800">
                  Gửi hồ sơ khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={gui} className="relative min-h-0 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="ut-ten" className="text-xs font-semibold text-ink-muted">Họ tên *</label>
                  <input id="ut-ten" required maxLength={255} value={form.full_name} onChange={doiO("full_name")} className={oNhap} placeholder="Nguyễn Văn A" autoComplete="name" disabled={dangGui} />
                  {loiO.full_name && <p className="mt-1 text-xs font-medium text-rose-600">{loiO.full_name}</p>}
                </div>
                <div>
                  <label htmlFor="ut-sdt" className="text-xs font-semibold text-ink-muted">Số điện thoại / Zalo *</label>
                  <input id="ut-sdt" required type="tel" inputMode="tel" pattern="[0-9\s+.\-]{8,20}" value={form.phone} onChange={doiO("phone")} className={oNhap} placeholder="09xx xxx xxx" autoComplete="tel" disabled={dangGui} />
                  {loiO.phone && <p className="mt-1 text-xs font-medium text-rose-600">{loiO.phone}</p>}
                </div>
                <div>
                  <label htmlFor="ut-email" className="text-xs font-semibold text-ink-muted">Email *</label>
                  <input id="ut-email" required type="email" maxLength={255} value={form.email} onChange={doiO("email")} className={oNhap} placeholder="ban@email.com" autoComplete="email" disabled={dangGui} />
                  {loiO.email && <p className="mt-1 text-xs font-medium text-rose-600">{loiO.email}</p>}
                </div>
              </div>

              <OTepPdf
                id="ut-cv"
                nhan="CV"
                batBuoc
                goiY={`PDF, tối đa ${CV_TOI_DA_MB}MB.`}
                toiDaMb={CV_TOI_DA_MB}
                tep={cv}
                datTep={(f) => {
                  setCv(f);
                  setLoi("");
                }}
                loi={loiO.cv}
                datLoi={(m) => setLoiO((l) => ({ ...l, cv: m }))}
                khoa={dangGui}
              />
              <OTepPdf
                id="ut-portfolio"
                nhan="Portfolio (nếu có)"
                goiY={`PDF, tối đa ${PORTFOLIO_TOI_DA_MB}MB. File nặng hơn thì dán link bên dưới.`}
                toiDaMb={PORTFOLIO_TOI_DA_MB}
                tep={portfolio}
                datTep={(f) => {
                  setPortfolio(f);
                  setLoi("");
                }}
                loi={loiO.portfolio}
                datLoi={(m) => setLoiO((l) => ({ ...l, portfolio: m }))}
                khoa={dangGui}
              />
              <div>
                <label htmlFor="ut-link" className="text-xs font-semibold text-ink-muted">Hoặc link portfolio</label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3.5 top-1/2 mt-[3px] h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                  <input id="ut-link" type="url" maxLength={500} value={form.portfolio_url} onChange={doiO("portfolio_url")} className={`${oNhap} pl-10`} placeholder="https://drive.google.com/… · Behance · website" disabled={dangGui} />
                </div>
                {loiO.portfolio_url && <p className="mt-1 text-xs font-medium text-rose-600">{loiO.portfolio_url}</p>}
              </div>
              <div>
                <label htmlFor="ut-nhan" className="text-xs font-semibold text-ink-muted">Giới thiệu ngắn (không bắt buộc)</label>
                <textarea id="ut-nhan" rows={3} maxLength={2000} value={form.message} onChange={doiO("message")} className={`${oNhap} resize-none`} placeholder="VD: 2 năm kinh nghiệm bán tour, có thể đi làm từ tháng 11…" disabled={dangGui} />
              </div>

              {/* Ô bẫy chống bot: ẩn khỏi mắt người và khỏi trình đọc màn hình */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="ut-website">Đừng điền ô này</label>
                <input id="ut-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={doiO("website")} />
              </div>

              <label className="flex items-start gap-3 text-sm text-ink-muted">
                <input type="checkbox" required checked={form.dong_y} onChange={doiO("dong_y")} disabled={dangGui} className="mt-0.5 h-4 w-4 shrink-0 accent-ocean-700" />
                <span>
                  Tôi đồng ý để PSV Travel lưu và dùng CV này cho việc tuyển dụng, theo{" "}
                  <Link href="/chinh-sach-bao-mat" target="_blank" className="font-semibold text-ocean-700 hover:underline">chính sách bảo mật</Link>.
                </span>
              </label>
              {loiO.dong_y && <p className="-mt-2 text-xs font-medium text-rose-600">{loiO.dong_y}</p>}

              {loi && (
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {loi}
                </div>
              )}

              <div className="sticky bottom-0 -mx-6 -mb-5 border-t border-ocean-50 bg-white px-6 pb-5 pt-4">
                {dangGui && (
                  <div className="mb-3" aria-live="polite">
                    <div className="flex justify-between text-xs text-ink-muted">
                      <span>{tienDo < 100 ? "Đang tải hồ sơ lên…" : "Đang lưu hồ sơ…"}</span>
                      <span>{tienDo}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ocean-50">
                      <div className="h-full rounded-full bg-ocean-600 transition-[width] duration-200" style={{ width: `${tienDo}%` }} />
                    </div>
                  </div>
                )}
                <button type="submit" disabled={dangGui} className="btn-cta w-full !py-3 text-sm disabled:opacity-70">
                  {dangGui ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {dangGui ? "Đang gửi…" : "Gửi hồ sơ"}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
