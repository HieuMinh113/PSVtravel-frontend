"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ticket, UserCog, CalendarDays, Users2, Wallet, ArrowRight,
  Loader2, CheckCircle2, AlertCircle, KeyRound, Save,
} from "lucide-react";

const tienVN = (v) => (typeof v === "number" ? v.toLocaleString("vi-VN") + "đ" : v);

const mauTrangThai = {
  completed: "bg-teal-50 text-teal-700 ring-teal-200",
  confirmed: "bg-ocean-50 text-ocean-700 ring-ocean-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
};

/* ---------- Thẻ một đơn đã đặt ---------- */
function TheDon({ don, index }) {
  const duongDan = don.tour_slug
    ? `${don.tour_type === "domestic" ? "/tour-trong-nuoc" : "/tour-nuoc-ngoai"}/${don.tour_slug}`
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl bg-white shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ocean-50 bg-ocean-50/40 px-5 py-3">
        <p className="font-mono text-sm font-bold text-deep-900">{don.booking_code}</p>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${mauTrangThai[don.status] || mauTrangThai.pending}`}>
            {don.status_label}
          </span>
          <span className="rounded-full bg-ocean-50 px-2.5 py-1 text-xs font-semibold text-ink-muted ring-1 ring-ocean-100">
            {don.payment_label}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        {don.tour_image && (
          <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-36">
            <Image src={don.tour_image} alt={don.tour_name || ""} fill sizes="144px" className="object-cover" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-bold leading-snug text-deep-900">
            {don.tour_name || "Tour đã đặt"}
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-muted">
            {don.start_date && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-ocean-500" /> {don.start_date}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users2 className="h-4 w-4 text-ocean-500" />
              {don.adults} người lớn{don.children > 0 ? `, ${don.children} trẻ em` : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-ocean-500" /> {tienVN(don.total_price)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ocean-50 pt-3">
            <p className="text-xs text-ink-subtle">Đặt lúc {don.created_at}</p>
            {duongDan && (
              <Link href={duongDan} className="group flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
                Xem lại tour
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-enter group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- Hộp thông báo dùng chung ---------- */
function ThongBao({ loai, noiDung }) {
  if (!noiDung) return null;
  const thanhCong = loai === "ok";

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ring-1 ${
        thanhCong ? "bg-teal-50 text-teal-800 ring-teal-200" : "bg-rose-50 text-rose-700 ring-rose-200"
      }`}
    >
      {thanhCong ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{noiDung}</span>
    </motion.div>
  );
}

const oNhap =
  "mt-2 w-full rounded-xl border border-ocean-100 bg-white px-4 py-3 text-sm text-deep-900 outline-none transition-colors placeholder:text-ink-subtle/60 focus:border-ocean-400 disabled:bg-ocean-50/50 disabled:text-ink-subtle";

export default function AccountClient({ user, donBanDau = [], loiTaiDon = false, tabBanDau = "don-hang" }) {
  const [tab, setTab] = useState(tabBanDau);
  const router = useRouter();

  // --- hồ sơ ---
  const [ten, setTen] = useState(user.name || "");
  const [sdt, setSdt] = useState(user.phone || "");
  const [luuHoSo, setLuuHoSo] = useState(false);
  const [tbHoSo, setTbHoSo] = useState(null);

  // --- mật khẩu ---
  const [mkCu, setMkCu] = useState("");
  const [mkMoi, setMkMoi] = useState("");
  const [mkXacNhan, setMkXacNhan] = useState("");
  const [luuMk, setLuuMk] = useState(false);
  const [tbMk, setTbMk] = useState(null);

  const guiHoSo = async (e) => {
    e.preventDefault();
    if (luuHoSo) return;

    setLuuHoSo(true);
    setTbHoSo(null);

    try {
      const form = new FormData();
      form.append("name", ten.trim());
      form.append("phone", sdt.trim());

      const res = await fetch("/api/auth/profile", { method: "PUT", body: form });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Laravel trả lỗi theo từng ô trong `errors` — gom lại thành một dòng
        const chiTiet = data?.errors ? Object.values(data.errors).flat().join(" ") : null;
        setTbHoSo({ loai: "loi", noiDung: chiTiet || data?.message || "Cập nhật thất bại." });
        return;
      }

      setTbHoSo({ loai: "ok", noiDung: data?.message || "Đã cập nhật hồ sơ." });
      router.refresh();
    } catch {
      setTbHoSo({ loai: "loi", noiDung: "Không kết nối được máy chủ." });
    } finally {
      setLuuHoSo(false);
    }
  };

  const guiMatKhau = async (e) => {
    e.preventDefault();
    if (luuMk) return;

    if (mkMoi !== mkXacNhan) {
      setTbMk({ loai: "loi", noiDung: "Xác nhận mật khẩu mới không khớp." });
      return;
    }

    setLuuMk(true);
    setTbMk(null);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: mkCu,
          password: mkMoi,
          password_confirmation: mkXacNhan,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const chiTiet = data?.errors ? Object.values(data.errors).flat().join(" ") : null;
        setTbMk({ loai: "loi", noiDung: chiTiet || data?.message || "Đổi mật khẩu thất bại." });
        return;
      }

      // Backend thu hồi hết token cũ sau khi đổi mật khẩu → phiên hiện tại hết hiệu lực
      setTbMk({ loai: "ok", noiDung: "Đổi mật khẩu thành công. Đang chuyển sang đăng nhập lại..." });
      setMkCu("");
      setMkMoi("");
      setMkXacNhan("");

      setTimeout(() => {
        fetch("/api/auth/logout", { method: "POST" })
          .catch(() => {})
          .finally(() => router.push("/dang-nhap"));
      }, 1600);
    } catch {
      setTbMk({ loai: "loi", noiDung: "Không kết nối được máy chủ." });
    } finally {
      setLuuMk(false);
    }
  };

  const cacTab = [
    { key: "don-hang", label: "Đơn đặt tour", icon: Ticket },
    { key: "ho-so", label: "Hồ sơ & mật khẩu", icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-foam pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* Đầu trang */}
        <div className="flex flex-wrap items-center gap-4">
          {user.avatar ? (
            <Image src={user.avatar} alt="" width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ocean-600 font-display text-2xl font-bold text-white">
              {(user.name || "?").trim().charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold text-deep-900 sm:text-3xl">{user.name}</h1>
            <p className="mt-0.5 text-sm text-ink-muted">
              {user.email}
              {user.username ? ` · @${user.username}` : ""}
            </p>
          </div>
        </div>

        {/* Chuyển tab */}
        <div className="mt-8 flex gap-1.5 rounded-2xl bg-white p-1.5 shadow-card">
          {cacTab.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.key ? "bg-ocean-600 text-white" : "text-ink-muted hover:bg-ocean-50"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "don-hang" ? (
            <motion.div
              key="don-hang"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4"
            >
              {loiTaiDon ? (
                <div className="rounded-2xl bg-white p-8 text-center shadow-card">
                  <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
                  <p className="mt-3 text-sm text-ink-muted">
                    Không tải được lịch sử đơn. Vui lòng thử lại sau ít phút.
                  </p>
                </div>
              ) : donBanDau.length === 0 ? (
                <div className="rounded-2xl bg-white p-10 text-center shadow-card">
                  <Ticket className="mx-auto h-9 w-9 text-ocean-300" />
                  <p className="mt-4 font-display text-lg font-bold text-deep-900">Bạn chưa đặt tour nào</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                    Các đơn đặt bằng tài khoản này sẽ hiện ở đây. Đơn đặt lúc chưa đăng nhập
                    vẫn tra được bằng mã đơn.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Link href="/tour-trong-nuoc" className="btn-cta !px-6 !py-3 text-sm">
                      Khám phá tour <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/tra-cuu-booking" className="text-sm font-semibold text-ocean-700 hover:text-ocean-800">
                      Tra cứu bằng mã đơn
                    </Link>
                  </div>
                </div>
              ) : (
                donBanDau.map((don, i) => <TheDon key={don.booking_code} don={don} index={i} />)
              )}
            </motion.div>
          ) : (
            <motion.div
              key="ho-so"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6"
            >
              {/* Hồ sơ */}
              <section className="rounded-2xl bg-white p-6 shadow-card sm:p-7">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-deep-900">
                  <UserCog className="h-5 w-5 text-ocean-600" /> Thông tin cá nhân
                </h2>

                <form onSubmit={guiHoSo} className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ten" className="text-sm font-semibold text-deep-900">Họ và tên</label>
                    <input id="ten" required value={ten} onChange={(e) => setTen(e.target.value)} className={oNhap} />
                  </div>
                  <div>
                    <label htmlFor="sdt" className="text-sm font-semibold text-deep-900">Số điện thoại</label>
                    <input id="sdt" required type="tel" inputMode="tel" value={sdt} onChange={(e) => setSdt(e.target.value)} className={oNhap} />
                  </div>

                  {/* Email và tên đăng nhập cố định — đổi email phải qua xác thực lại */}
                  <div>
                    <label htmlFor="email" className="text-sm font-semibold text-deep-900">Email</label>
                    <input id="email" value={user.email || ""} disabled className={oNhap} />
                    <p className="mt-1.5 text-xs text-ink-subtle">Muốn đổi email, vui lòng gọi hotline.</p>
                  </div>
                  <div>
                    <label htmlFor="username" className="text-sm font-semibold text-deep-900">Tên đăng nhập</label>
                    <input id="username" value={user.username || ""} disabled className={oNhap} />
                    <p className="mt-1.5 text-xs text-ink-subtle">Không thể thay đổi.</p>
                  </div>

                  <div className="sm:col-span-2">
                    <AnimatePresence>{tbHoSo && <ThongBao loai={tbHoSo.loai} noiDung={tbHoSo.noiDung} />}</AnimatePresence>
                    <button type="submit" disabled={luuHoSo} className="btn-cta mt-4 !px-6 !py-3 text-sm disabled:opacity-60">
                      {luuHoSo ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</> : <><Save className="h-4 w-4" /> Lưu thay đổi</>}
                    </button>
                  </div>
                </form>
              </section>

              {/* Mật khẩu */}
              <section className="rounded-2xl bg-white p-6 shadow-card sm:p-7">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-deep-900">
                  <KeyRound className="h-5 w-5 text-ocean-600" /> Đổi mật khẩu
                </h2>
                <p className="mt-1.5 text-sm text-ink-muted">
                  Đổi xong bạn sẽ được đăng xuất khỏi mọi thiết bị và cần đăng nhập lại.
                </p>

                <form onSubmit={guiMatKhau} className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="mk-cu" className="text-sm font-semibold text-deep-900">Mật khẩu hiện tại</label>
                    <input id="mk-cu" required type="password" autoComplete="current-password" value={mkCu} onChange={(e) => setMkCu(e.target.value)} className={oNhap} />
                  </div>
                  <div>
                    <label htmlFor="mk-moi" className="text-sm font-semibold text-deep-900">Mật khẩu mới</label>
                    <input id="mk-moi" required type="password" autoComplete="new-password" value={mkMoi} onChange={(e) => setMkMoi(e.target.value)} className={oNhap} />
                    <p className="mt-1.5 text-xs text-ink-subtle">Ít nhất 8 ký tự, có cả chữ và số.</p>
                  </div>
                  <div>
                    <label htmlFor="mk-xn" className="text-sm font-semibold text-deep-900">Nhập lại mật khẩu mới</label>
                    <input id="mk-xn" required type="password" autoComplete="new-password" value={mkXacNhan} onChange={(e) => setMkXacNhan(e.target.value)} className={oNhap} />
                  </div>

                  <div className="sm:col-span-2">
                    <AnimatePresence>{tbMk && <ThongBao loai={tbMk.loai} noiDung={tbMk.noiDung} />}</AnimatePresence>
                    <button type="submit" disabled={luuMk} className="btn-ocean mt-4 !px-6 !py-3 text-sm disabled:opacity-60">
                      {luuMk ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang đổi...</> : <>Đổi mật khẩu</>}
                    </button>
                  </div>
                </form>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
