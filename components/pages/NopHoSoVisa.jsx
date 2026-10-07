"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, CheckCircle2, FileText, Image as IconAnh, Loader2, Paperclip,
  Phone, Send, ShieldCheck, X, BadgeCheck, ChevronDown, Upload,
} from "lucide-react";
import PageHero from "@/components/PageHero";

// Form khách tự nộp hồ sơ visa.
//
// Hai bước (xem app/api/visa): gửi thông tin trước → nhận mã hồ sơ + mã tải
// file → gửi từng file một. File nào lỗi thì chỉ file đó lỗi, hồ sơ vẫn đã nộp;
// nhân viên sẽ liên hệ để khách gửi bổ sung.
//
// Giấy tờ: chọn "Bạn hiện là" thì hiện danh sách giấy tờ theo mẫu của nước đó;
// mỗi giấy tờ có ô tải riêng để nhân viên xuất ZIP ra đúng tên (Hộ chiếu.pdf…).
// File không thuộc giấy nào thì vào "Giấy tờ khác".

const MUC_DICH = [
  ["du_lich", "Du lịch"],
  ["cong_tac", "Công tác"],
  ["tham_than", "Thăm thân"],
  ["du_hoc", "Du học"],
  ["khac", "Khác"],
];

const DOI_TUONG = [
  ["", "Chưa rõ / để chuyên viên tư vấn"],
  ["nhan_vien", "Nhân viên"],
  ["nha_nuoc", "Công chức / viên chức nhà nước"],
  ["chu_doanh_nghiep", "Chủ doanh nghiệp"],
  ["ho_kinh_doanh", "Hộ kinh doanh"],
  ["tu_do", "Lao động tự do"],
  ["huu_tri", "Hưu trí"],
  ["hoc_sinh", "Học sinh / sinh viên"],
  ["tre_em", "Trẻ em"],
  ["khac", "Khác"],
];

const TOI_DA_FILE = 10;
const TOI_DA_MB = 10;
const LOAI_FILE = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const oNhap =
  "mt-1.5 w-full rounded-xl border border-ocean-100 bg-ocean-50/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white";

const dungLuong = (b) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)}MB` : `${Math.ceil(b / 1024)}KB`);

// Lỗi trả về từ Laravel: ưu tiên lỗi của từng ô, không có thì câu chung
function cauLoi(res, data) {
  if (res.status === 429) return "Bạn gửi quá nhiều lần. Vui lòng thử lại sau ít phút hoặc gọi hotline.";
  const loiO = data?.errors && Object.values(data.errors).flat()[0];
  return loiO || data?.message || "Gửi chưa được. Vui lòng thử lại.";
}

// Một ô trong phiếu thông tin (câu hỏi do backend trả về)
function OPhieu({ cau, giaTri, doi }) {
  const id = `pt-${cau.khoa}`;
  if (cau.kieu === "co_khong") {
    return (
      <fieldset className="sm:col-span-2">
        <legend className="text-xs font-semibold text-ink-muted">{cau.nhan}</legend>
        <div className="mt-1.5 flex gap-4">
          {Object.entries(cau.lua_chon || {}).map(([v, t]) => (
            <label key={v} className="flex items-center gap-2 text-sm text-ink">
              <input type="radio" name={id} value={v} checked={giaTri === v} onChange={() => doi(v)} className="accent-ocean-700" /> {t}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  const rong = cau.kieu === "textarea" ? "sm:col-span-2" : "";
  return (
    <div className={rong}>
      <label htmlFor={id} className="text-xs font-semibold text-ink-muted">{cau.nhan}</label>
      {cau.kieu === "textarea" ? (
        <textarea id={id} rows={2} maxLength={2000} value={giaTri || ""} onChange={(e) => doi(e.target.value)} className={`${oNhap} resize-none`} />
      ) : cau.kieu === "chon" ? (
        <select id={id} value={giaTri || ""} onChange={(e) => doi(e.target.value)} className={oNhap}>
          <option value="">—</option>
          {Object.entries(cau.lua_chon || {}).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
      ) : (
        <input id={id} type={cau.kieu === "date" ? "date" : "text"} maxLength={300} value={giaTri || ""} onChange={(e) => doi(e.target.value)} className={oNhap} />
      )}
    </div>
  );
}

export default function NopHoSoVisa({ visa, settings = {}, user = null, phieu = [] }) {
  const hotline = settings.hotline || "0907 870 707";
  const homNay = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    full_name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    birth_date: "",
    purpose: "du_lich",
    profile: "",
    travel_date: "",
    note: "",
    dong_y: false,
    website: "", // ô bẫy chống bot
  });
  const [tep, setTep] = useState([]); // [{ file, giay }] — giay = tên giấy tờ, null = giấy tờ khác
  const [loiTep, setLoiTep] = useState("");
  const [dsGiay, setDsGiay] = useState([]); // [{ muc, ten, ghi_chu }]
  const [dangTaiDs, setDangTaiDs] = useState(false);
  const [thongTin, setThongTin] = useState({});
  const giayDangChon = useRef(null);
  const [loi, setLoi] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [tienDo, setTienDo] = useState(null); // { xong, tong }
  const [ketQua, setKetQua] = useState(null); // { code, documents, tepLoi }
  const chonTep = useRef(null);

  const doiO = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  // Đổi mục đích / đối tượng → lấy lại danh sách giấy tờ của mẫu phù hợp
  useEffect(() => {
    if (!form.profile) {
      setDsGiay([]);
      return;
    }
    let huy = false;
    setDangTaiDs(true);
    const q = new URLSearchParams({ visa_country: visa.slug, purpose: form.purpose, profile: form.profile });
    fetch(`/api/visa/checklist?${q}`)
      .then((r) => r.json())
      .then((d) => !huy && setDsGiay(d?.data?.items ?? []))
      .catch(() => !huy && setDsGiay([]))
      .finally(() => !huy && setDangTaiDs(false));
    return () => {
      huy = true;
    };
  }, [form.purpose, form.profile, visa.slug]);

  // File đã chọn cho giấy tờ không còn trong danh sách mới → chuyển sang "Giấy tờ khác"
  useEffect(() => {
    const ten = new Set(dsGiay.map((g) => g.ten));
    setTep((cu) => cu.map((t) => (t.giay && !ten.has(t.giay) ? { ...t, giay: null } : t)));
  }, [dsGiay]);

  const moChonTep = (giay) => {
    giayDangChon.current = giay;
    chonTep.current?.click();
  };

  const themTep = (e) => {
    const moi = Array.from(e.target.files || []);
    e.target.value = ""; // chọn lại đúng file vừa bỏ vẫn nhận
    const boQua = [];
    const hopLe = moi.filter((f) => {
      if (!LOAI_FILE.includes(f.type)) return boQua.push(`${f.name}: chỉ nhận ảnh JPG/PNG/WEBP hoặc PDF`), false;
      if (f.size > TOI_DA_MB * 1024 * 1024) return boQua.push(`${f.name}: lớn hơn ${TOI_DA_MB}MB`), false;
      return true;
    });
    const giay = giayDangChon.current;

    setTep((cu) => {
      const gop = [...cu, ...hopLe.map((file) => ({ file, giay }))];
      if (gop.length > TOI_DA_FILE) boQua.push(`Tối đa ${TOI_DA_FILE} file — đã bỏ bớt ${gop.length - TOI_DA_FILE} file`);
      return gop.slice(0, TOI_DA_FILE);
    });
    setLoiTep(boQua.join(". "));
  };

  const boTep = (t) => setTep((cu) => cu.filter((x) => x !== t));

  const gui = async (e) => {
    e.preventDefault();
    if (dangGui) return;
    setLoi("");
    setDangGui(true);

    try {
      const res = await fetch("/api/visa", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, visa_country: visa.slug, profile: form.profile || null, thong_tin: thongTin }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoi(cauLoi(res, data));
        return;
      }

      const { code, upload_token: token, documents = [], items = [] } = data.data || {};
      const mucTheoTen = Object.fromEntries(items.map((g) => [g.ten, g.muc]));
      const tepLoi = [];

      // Gửi lần lượt từng file để thấy tiến độ và để file lỗi không kéo theo file khác
      for (let i = 0; i < tep.length; i++) {
        setTienDo({ xong: i, tong: tep.length });
        const { file, giay } = tep[i];
        const fd = new FormData();
        fd.append("code", code);
        fd.append("token", token);
        if (giay && mucTheoTen[giay] !== undefined) fd.append("muc", String(mucTheoTen[giay]));
        fd.append("file", file);
        try {
          const r = await fetch("/api/visa/tep", { method: "POST", body: fd });
          if (!r.ok) {
            const d = await r.json().catch(() => ({}));
            tepLoi.push(`${file.name} — ${cauLoi(r, d)}`);
          }
        } catch {
          tepLoi.push(`${file.name} — mất kết nối`);
        }
      }

      setKetQua({ code, documents, tepLoi });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setLoi("Mất kết nối. Vui lòng kiểm tra mạng rồi thử lại.");
    } finally {
      setDangGui(false);
      setTienDo(null);
    }
  };

  const hero = (
    <PageHero
      eyebrow="Dịch vụ visa"
      title={`Nộp hồ sơ visa ${visa.name} online`}
      description="Điền thông tin và gửi kèm giấy tờ (nếu có sẵn). Chuyên viên visa sẽ gọi lại kiểm tra hồ sơ và hướng dẫn các bước tiếp theo."
      crumbs={[
        { label: "Làm visa", to: "/lam-visa" },
        { label: visa.name, to: `/lam-visa/${visa.slug}` },
        { label: "Nộp hồ sơ" },
      ]}
    />
  );

  if (ketQua) {
    return (
      <div>
        {hero}
        <section className="bg-foam py-14 sm:py-16">
          <div className="mx-auto max-w-2xl px-5 sm:px-8">
            <div className="card-surface p-6 text-center sm:p-10">
              <CheckCircle2 className="mx-auto h-12 w-12 text-teal-600" />
              <h2 className="mt-4 font-display text-2xl font-bold text-deep-900">Đã nhận hồ sơ của bạn</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Chuyên viên visa sẽ gọi lại cho bạn trong giờ làm việc.
                {form.email ? " Thư xác nhận đã được gửi tới email của bạn." : ""}
              </p>

              <div className="mx-auto mt-6 max-w-xs rounded-2xl border border-dashed border-ocean-400 bg-ocean-50 px-4 py-5">
                <p className="text-xs font-bold uppercase tracking-widest text-ocean-700/75">Mã hồ sơ</p>
                <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-ocean-700">{ketQua.code}</p>
                <p className="mt-2 text-xs text-ink-subtle">Đọc mã này khi gọi hotline để được hỗ trợ nhanh.</p>
              </div>

              {ketQua.tepLoi.length > 0 && (
                <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-left text-sm text-amber-800 ring-1 ring-amber-200">
                  <p className="font-semibold">Một số file chưa gửi được — chuyên viên sẽ liên hệ để bạn gửi bổ sung:</p>
                  <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                    {ketQua.tepLoi.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}

              {ketQua.documents.length > 0 && (
                <div className="mt-6 text-left">
                  <p className="font-display text-base font-bold text-deep-900">Giấy tờ thường cần chuẩn bị</p>
                  <ul className="mt-3 space-y-2">
                    {ketQua.documents.map((d) => (
                      <li key={d} className="flex gap-2.5 text-sm text-ink-muted">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> {d}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-ink-subtle">
                    Danh sách tham khảo — chuyên viên sẽ xác nhận lại cho đúng trường hợp của bạn.
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {user ? (
                  <Link href="/tai-khoan?tab=visa" className="btn-cta !px-6 !py-3 text-sm">
                    Theo dõi hồ sơ trong tài khoản
                  </Link>
                ) : (
                  <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="btn-cta !px-6 !py-3 text-sm">
                    <Phone className="h-4 w-4" /> Gọi {hotline}
                  </a>
                )}
                <Link href={`/lam-visa/${visa.slug}`} className="text-sm font-semibold text-ocean-700 hover:text-ocean-800">
                  Về trang visa {visa.name}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {hero}
      <section className="bg-foam py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
          <form onSubmit={gui} className="card-surface relative space-y-5 p-6 sm:p-8">
            <div>
              <h2 className="font-display text-xl font-bold text-deep-900">Thông tin người xin visa</h2>
              {user ? (
                <p className="mt-1 text-xs text-ink-subtle">
                  Hồ sơ sẽ gắn vào tài khoản của bạn — theo dõi trạng thái ở trang Tài khoản.
                </p>
              ) : (
                <p className="mt-1 text-xs text-ink-subtle">
                  Không cần tài khoản.{" "}
                  <Link href="/dang-nhap" className="font-semibold text-ocean-700 hover:underline">Đăng nhập</Link>{" "}
                  nếu muốn theo dõi trạng thái hồ sơ trên website.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="hs-ten" className="text-xs font-semibold text-ink-muted">Họ tên (như trên hộ chiếu) *</label>
                <input id="hs-ten" required maxLength={255} value={form.full_name} onChange={doiO("full_name")} className={oNhap} placeholder="NGUYEN VAN A" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="hs-sdt" className="text-xs font-semibold text-ink-muted">Số điện thoại / Zalo *</label>
                <input id="hs-sdt" required type="tel" pattern="[0-9\s+.\-]{8,20}" value={form.phone} onChange={doiO("phone")} className={oNhap} placeholder="09xx xxx xxx" autoComplete="tel" />
              </div>
              <div>
                <label htmlFor="hs-email" className="text-xs font-semibold text-ink-muted">Email (nhận thư xác nhận)</label>
                <input id="hs-email" type="email" maxLength={255} value={form.email} onChange={doiO("email")} className={oNhap} placeholder="ban@email.com" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="hs-ngaysinh" className="text-xs font-semibold text-ink-muted">Ngày sinh</label>
                <input id="hs-ngaysinh" type="date" max={homNay} value={form.birth_date} onChange={doiO("birth_date")} className={oNhap} />
              </div>
              <div>
                <label htmlFor="hs-ngaydi" className="text-xs font-semibold text-ink-muted">Ngày dự kiến đi</label>
                <input id="hs-ngaydi" type="date" min={homNay} value={form.travel_date} onChange={doiO("travel_date")} className={oNhap} />
              </div>
              <div>
                <label htmlFor="hs-mucdich" className="text-xs font-semibold text-ink-muted">Mục đích chuyến đi *</label>
                <select id="hs-mucdich" required value={form.purpose} onChange={doiO("purpose")} className={oNhap}>
                  {MUC_DICH.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="hs-doituong" className="text-xs font-semibold text-ink-muted">Bạn hiện là</label>
                <select id="hs-doituong" value={form.profile} onChange={doiO("profile")} className={oNhap}>
                  {DOI_TUONG.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="hs-nhan" className="text-xs font-semibold text-ink-muted">Lời nhắn cho chuyên viên</label>
                <textarea id="hs-nhan" rows={3} maxLength={2000} value={form.note} onChange={doiO("note")} className={`${oNhap} resize-none`} placeholder="VD: đi cùng gia đình 4 người, từng bị từ chối visa năm 2024..." />
              </div>
            </div>

            {/* Giấy tờ — mỗi giấy một ô tải riêng */}
            <div>
              <p className="text-xs font-semibold text-ink-muted">Giấy tờ (không bắt buộc)</p>
              <p className="mt-0.5 text-xs text-ink-subtle">
                Ảnh chụp hoặc PDF, tải vào đúng ô từng giấy. Tối đa {TOI_DA_FILE} file, mỗi file {TOI_DA_MB}MB.
                Chưa có sẵn cũng không sao — chuyên viên sẽ liên hệ để bạn gửi bổ sung.
              </p>
              <input ref={chonTep} type="file" multiple accept={LOAI_FILE.join(",")} onChange={themTep} className="hidden" />

              {!form.profile ? (
                <p className="mt-3 rounded-xl bg-ocean-50/70 px-4 py-3 text-sm text-ocean-800">
                  Chọn mục <strong>“Bạn hiện là”</strong> ở trên để hiện danh sách giấy tờ cần chuẩn bị.
                </p>
              ) : dangTaiDs ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-ink-subtle"><Loader2 className="h-4 w-4 animate-spin" /> Đang tải danh sách giấy tờ...</p>
              ) : dsGiay.length === 0 ? (
                <p className="mt-3 rounded-xl bg-ocean-50/70 px-4 py-3 text-sm text-ocean-800">
                  Chuyên viên sẽ tư vấn giấy tờ cho trường hợp của bạn. Có sẵn giấy tờ nào thì tải vào ô “Giấy tờ khác”.
                </p>
              ) : null}

              <ul className="mt-3 divide-y divide-ocean-50 rounded-xl ring-1 ring-ocean-100">
                {[...dsGiay, { muc: "khac", ten: null, ghi_chu: "File không thuộc giấy tờ nào ở trên" }].map((g) => {
                  const cua = tep.filter((t) => t.giay === g.ten);
                  return (
                    <li key={g.muc} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-deep-900">
                            {cua.length > 0 && <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />}
                            {g.ten ?? "Giấy tờ khác"}
                          </p>
                          {g.ghi_chu && <p className="mt-0.5 text-xs text-ink-subtle">{g.ghi_chu}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => moChonTep(g.ten)}
                          disabled={dangGui || tep.length >= TOI_DA_FILE}
                          className="flex shrink-0 items-center gap-1.5 rounded-full border border-ocean-200 px-3 py-1.5 text-xs font-semibold text-ocean-700 transition-colors hover:bg-ocean-50 disabled:opacity-50"
                        >
                          <Upload className="h-3.5 w-3.5" /> Tải lên
                        </button>
                      </div>
                      {cua.length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {cua.map((t, i) => (
                            <li key={`${t.file.name}-${i}`} className="flex items-center gap-3 rounded-lg bg-ocean-50/60 px-3 py-1.5 text-sm">
                              {t.file.type === "application/pdf" ? <FileText className="h-4 w-4 shrink-0 text-ocean-600" /> : <IconAnh className="h-4 w-4 shrink-0 text-ocean-600" />}
                              <span className="min-w-0 flex-1 truncate text-deep-900">{t.file.name}</span>
                              <span className="shrink-0 text-xs text-ink-subtle">{dungLuong(t.file.size)}</span>
                              <button type="button" onClick={() => boTep(t)} disabled={dangGui} aria-label={`Bỏ ${t.file.name}`} className="shrink-0 rounded-full p-1 text-ink-subtle hover:bg-white hover:text-rose-600">
                                <X className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-right text-xs text-ink-subtle"><Paperclip className="mr-1 inline h-3.5 w-3.5" />{tep.length}/{TOI_DA_FILE} file</p>
              {loiTep && <p className="mt-1 text-xs text-rose-600">{loiTep}</p>}
            </div>

            {/* Phiếu thông tin — không bắt buộc */}
            {phieu.length > 0 && (
              <details className="group rounded-xl ring-1 ring-ocean-100">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-deep-900">Điền phiếu thông tin xin visa</span>
                    <span className="block text-xs text-ink-subtle">Không bắt buộc — điền trước giúp làm hồ sơ nhanh hơn, chuyên viên đỡ phải hỏi lại.</span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-ocean-600 transition-transform group-open:rotate-180" />
                </summary>
                <div className="space-y-5 border-t border-ocean-50 px-4 py-4">
                  {phieu.map((nhom) => (
                    <div key={nhom.tieu_de}>
                      <p className="text-sm font-bold text-ocean-800">{nhom.tieu_de}</p>
                      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {nhom.cau_hoi.map((cau) => (
                          <OPhieu
                            key={cau.khoa}
                            cau={cau}
                            giaTri={thongTin[cau.khoa]}
                            doi={(v) => setThongTin((t) => ({ ...t, [cau.khoa]: v }))}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Ô bẫy chống bot: ẩn khỏi mắt người và khỏi trình đọc màn hình */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="hs-website">Đừng điền ô này</label>
              <input id="hs-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={doiO("website")} />
            </div>

            <label className="flex items-start gap-3 text-sm text-ink-muted">
              <input type="checkbox" required checked={form.dong_y} onChange={doiO("dong_y")} className="mt-0.5 h-4 w-4 shrink-0 accent-ocean-700" />
              <span>
                Tôi đồng ý để PSV Travel dùng thông tin và giấy tờ này để làm hồ sơ visa, theo{" "}
                <Link href="/chinh-sach-bao-mat" target="_blank" className="font-semibold text-ocean-700 hover:underline">chính sách bảo mật</Link>.
              </span>
            </label>

            {loi && (
              <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{loi}</span>
              </div>
            )}

            <button type="submit" disabled={dangGui} className="btn-cta w-full !py-3.5 disabled:opacity-60">
              {dangGui ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {tienDo ? `Đang gửi file ${tienDo.xong + 1}/${tienDo.tong}...` : "Đang gửi hồ sơ..."}
                </>
              ) : (
                <>Nộp hồ sơ <Send className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="card-surface p-6">
              <p className="font-display text-base font-bold text-deep-900">Sau khi bạn nộp</p>
              <ol className="mt-3 space-y-3 text-sm text-ink-muted">
                <li><strong className="text-deep-900">1.</strong> Bạn nhận mã hồ sơ (và thư xác nhận nếu có email).</li>
                <li><strong className="text-deep-900">2.</strong> Chuyên viên visa gọi lại, kiểm tra giấy tờ và báo những gì còn thiếu.</li>
                <li><strong className="text-deep-900">3.</strong> Đủ giấy tờ, PSV Travel đặt lịch và nộp hồ sơ cho bạn.</li>
              </ol>
            </div>

            {visa.documents.length > 0 && (
              <div className="card-surface p-6">
                <p className="font-display text-base font-bold text-deep-900">Giấy tờ cơ bản visa {visa.name}</p>
                <ul className="mt-3 space-y-2">
                  {visa.documents.map((d, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-ink-muted">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-2xl bg-teal-50 p-4 text-xs text-teal-800 ring-1 ring-teal-100">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <span>Giấy tờ của bạn được lưu riêng, chỉ chuyên viên phụ trách hồ sơ mới mở được.</span>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
