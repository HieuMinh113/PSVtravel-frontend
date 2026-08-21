"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, AtSign, ShieldCheck, Loader2 } from "lucide-react";

// Gọi các route handler của chính Next (cùng tên miền) — token được cất vào
// cookie httpOnly ở phía máy chủ, JavaScript trong trình duyệt không đọc được.
async function goiApi(duongDan, body) {
  const res = await fetch(duongDan, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// Gom thông báo lỗi từ Laravel thành một chuỗi dễ đọc
function docLoi(data) {
  if (data?.errors) {
    const dong = Object.values(data.errors).flat();
    if (dong.length) return dong.join(" ");
  }
  return data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
}

export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login | register | otp
  const [showPass, setShowPass] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [thongBao, setThongBao] = useState("");

  const [dangNhap, setDangNhap] = useState({ login: "", password: "" });
  const [dangKy, setDangKy] = useState({
    name: "", username: "", email: "", phone: "",
    password: "", password_confirmation: "",
  });

  const [emailChoXacThuc, setEmailChoXacThuc] = useState("");
  const [maOtp, setMaOtp] = useState("");
  const [demNguoc, setDemNguoc] = useState(0);

  // Đồng hồ đếm ngược cho nút "Gửi lại mã"
  useEffect(() => {
    if (demNguoc <= 0) return;
    const t = setTimeout(() => setDemNguoc((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [demNguoc]);

  const doiMode = (m) => {
    setMode(m);
    setLoi("");
    setThongBao("");
  };

  const xuLyDangNhap = async (e) => {
    e.preventDefault();
    setLoi(""); setDangGui(true);

    const { ok, status, data } = await goiApi("/api/auth/login", dangNhap);
    setDangGui(false);

    if (ok) {
      // Dùng điều hướng cứng thay cho router.push: cookie phiên vừa được đặt
      // trong phản hồi, nhưng bộ nhớ đệm định tuyến phía trình duyệt vẫn giữ
      // bản /tai-khoan render lúc CHƯA đăng nhập, nên lần bấm đầu bị đá ngược
      // về trang đăng nhập — phải đăng nhập lần hai mới vào được. Tải lại cả
      // trang thì máy chủ chắc chắn thấy cookie mới, và thanh điều hướng cũng
      // vẽ lại đúng trạng thái đã đăng nhập.
      window.location.assign("/tai-khoan");
      return;
    }

    // Tài khoản chưa xác thực OTP — chuyển thẳng sang màn hình nhập mã
    if (status === 403 && data?.need_verify) {
      setEmailChoXacThuc(data?.data?.email || "");
      setThongBao("Tài khoản chưa xác thực. Mã đã được gửi tới email của bạn.");
      await goiApi("/api/auth/resend-otp", { email: data?.data?.email });
      setDemNguoc(60);
      setMode("otp");
      return;
    }

    setLoi(docLoi(data));
  };

  const xuLyDangKy = async (e) => {
    e.preventDefault();
    setLoi(""); setDangGui(true);

    const { ok, data } = await goiApi("/api/auth/register", dangKy);
    setDangGui(false);

    if (ok) {
      setEmailChoXacThuc(dangKy.email);
      setThongBao("Mã xác thực đã được gửi tới email của bạn.");
      setDemNguoc(60);
      setMode("otp");
      return;
    }

    setLoi(docLoi(data));
  };

  const xuLyXacThuc = async (e) => {
    e.preventDefault();
    setLoi(""); setDangGui(true);

    const { ok, data } = await goiApi("/api/auth/verify-otp", {
      email: emailChoXacThuc,
      code: maOtp,
    });
    setDangGui(false);

    if (ok) {
      window.location.assign("/tai-khoan");
      return;
    }

    setLoi(docLoi(data));
  };

  const guiLaiMa = async () => {
    if (demNguoc > 0) return;
    setLoi(""); setDangGui(true);

    const { ok, data } = await goiApi("/api/auth/resend-otp", { email: emailChoXacThuc });
    setDangGui(false);

    if (ok) {
      setThongBao("Đã gửi lại mã. Vui lòng kiểm tra hộp thư.");
      setDemNguoc(60);
    } else {
      setLoi(docLoi(data));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-horizon px-5 py-24">
      <div className="pointer-events-none absolute left-10 top-24 h-40 w-40 rounded-full bg-white/20 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute bottom-24 right-10 h-56 w-56 rounded-full bg-teal-400/25 blur-3xl animate-driftSlow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-deep lg:grid-cols-2"
      >
        {/* Panel hình ảnh */}
        <div className="relative hidden overflow-hidden bg-deep-gradient lg:block">
          <Image
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop"
            alt="Bãi biển nhiệt đới"
            fill
            sizes="50vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="PSVTravel" width={900} height={349} priority className="h-10 w-auto object-contain drop-shadow-sm" />
              <span className="font-display text-lg font-bold">PSVTravel</span>
            </Link>
            <div>
              <h2 className="font-display text-2xl font-bold leading-snug">
                Mỗi tài khoản là một tấm vé mở ra hành trình mới
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Lưu tour yêu thích, theo dõi đơn đặt và nhận ưu đãi độc quyền dành riêng cho thành viên.
              </p>
            </div>
          </div>
        </div>

        {/* Panel form */}
        <div className="p-8 sm:p-10">
          {mode !== "otp" && (
            <div className="mb-8 flex rounded-full bg-ocean-50 p-1">
              {[
                { id: "login", label: "Đăng nhập" },
                { id: "register", label: "Đăng ký" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => doiMode(t.id)}
                  className="relative flex-1 rounded-full py-2.5 text-sm font-semibold"
                >
                  {mode === t.id && (
                    <motion.span
                      layoutId="auth-pill"
                      className="absolute inset-0 rounded-full bg-ocean-500 shadow"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className={`relative z-10 ${mode === t.id ? "text-white" : "text-ocean-700"}`}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Thông báo chung */}
          {thongBao && (
            <div className="mb-4 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">{thongBao}</div>
          )}
          {loi && (
            <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{loi}</div>
          )}

          <AnimatePresence mode="wait">
            {/* ================= ĐĂNG NHẬP ================= */}
            {mode === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
                onSubmit={xuLyDangNhap}
              >
                <div>
                  <h1 className="font-display text-2xl font-bold text-deep-900">Chào mừng trở lại</h1>
                  <p className="mt-1 text-sm text-ink-muted">Đăng nhập để tiếp tục hành trình của bạn.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-muted">Email, tên đăng nhập hoặc số điện thoại</label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input
                      required
                      value={dangNhap.login}
                      onChange={(e) => setDangNhap((f) => ({ ...f, login: e.target.value }))}
                      placeholder="ban@email.com"
                      className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-muted">Mật khẩu</label>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input
                      required
                      type={showPass ? "text" : "password"}
                      value={dangNhap.password}
                      onChange={(e) => setDangNhap((f) => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-11 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                    />
                    <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-400">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={dangGui} className="btn-cta w-full !py-3.5 disabled:opacity-60">
                  {dangGui ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...</> : <>Đăng nhập <ArrowRight className="h-4 w-4" /></>}
                </button>

                <p className="text-center text-xs text-ink-subtle">
                  Chưa có tài khoản?{" "}
                  <button type="button" onClick={() => doiMode("register")} className="font-semibold text-ocean-600 hover:text-ocean-700">
                    Đăng ký ngay
                  </button>
                </p>
              </motion.form>
            )}

            {/* ================= ĐĂNG KÝ ================= */}
            {mode === "register" && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
                onSubmit={xuLyDangKy}
              >
                <div>
                  <h1 className="font-display text-2xl font-bold text-deep-900">Tạo tài khoản mới</h1>
                  <p className="mt-1 text-sm text-ink-muted">Chỉ mất chưa đầy 1 phút để bắt đầu.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Họ và tên</label>
                    <div className="relative mt-1.5">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input
                        required
                        value={dangKy.name}
                        onChange={(e) => setDangKy((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Nguyễn Văn A"
                        className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Tên đăng nhập</label>
                    <div className="relative mt-1.5">
                      <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input
                        required
                        value={dangKy.username}
                        onChange={(e) => setDangKy((f) => ({ ...f, username: e.target.value.toLowerCase() }))}
                        placeholder="nguyenvana"
                        className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Số điện thoại</label>
                    <div className="relative mt-1.5">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input
                        required
                        value={dangKy.phone}
                        onChange={(e) => setDangKy((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="0901234567"
                        className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Email</label>
                    <div className="relative mt-1.5">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input
                        required
                        type="email"
                        value={dangKy.email}
                        onChange={(e) => setDangKy((f) => ({ ...f, email: e.target.value }))}
                        placeholder="ban@email.com"
                        className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-muted">Mật khẩu</label>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input
                      required
                      type={showPass ? "text" : "password"}
                      value={dangKy.password}
                      onChange={(e) => setDangKy((f) => ({ ...f, password: e.target.value }))}
                      placeholder="Tối thiểu 8 ký tự, có chữ và số"
                      className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-11 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                    />
                    <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-400">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-muted">Nhập lại mật khẩu</label>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input
                      required
                      type={showPass ? "text" : "password"}
                      value={dangKy.password_confirmation}
                      onChange={(e) => setDangKy((f) => ({ ...f, password_confirmation: e.target.value }))}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 text-xs text-ink-muted">
                  <input required type="checkbox" className="mt-0.5 rounded border-ocean-300 text-ocean-500 focus:ring-ocean-400" />
                  <span>
                    Tôi đồng ý với{" "}
                    <Link href="/chinh-sach-bao-mat" className="font-semibold text-ocean-600 hover:text-ocean-700">
                      Chính sách bảo mật
                    </Link>{" "}
                    của PSVTravel
                  </span>
                </label>

                <button type="submit" disabled={dangGui} className="btn-cta w-full !py-3.5 disabled:opacity-60">
                  {dangGui ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...</> : <>Tạo tài khoản <ArrowRight className="h-4 w-4" /></>}
                </button>

                <p className="text-center text-xs text-ink-subtle">
                  Đã có tài khoản?{" "}
                  <button type="button" onClick={() => doiMode("login")} className="font-semibold text-ocean-600 hover:text-ocean-700">
                    Đăng nhập
                  </button>
                </p>
              </motion.form>
            )}

            {/* ================= NHẬP MÃ OTP ================= */}
            {mode === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
                onSubmit={xuLyXacThuc}
              >
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ocean-50">
                    <ShieldCheck className="h-7 w-7 text-ocean-600" />
                  </div>
                  <h1 className="mt-4 font-display text-2xl font-bold text-deep-900">Xác thực email</h1>
                  <p className="mt-1 text-sm text-ink-muted">
                    Chúng tôi đã gửi mã gồm 6 chữ số tới<br />
                    <span className="font-semibold text-deep-900">{emailChoXacThuc}</span>
                  </p>
                </div>

                <div>
                  <input
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={maOtp}
                    onChange={(e) => setMaOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="000000"
                    className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-4 text-center font-display text-3xl font-bold tracking-[0.5em] outline-none focus:border-ocean-400 focus:bg-white"
                  />
                  <p className="mt-2 text-center text-xs text-ink-subtle">Mã có hiệu lực trong 10 phút</p>
                </div>

                <button type="submit" disabled={dangGui || maOtp.length !== 6} className="btn-cta w-full !py-3.5 disabled:opacity-60">
                  {dangGui ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang kiểm tra...</> : <>Xác thực <ArrowRight className="h-4 w-4" /></>}
                </button>

                <div className="text-center text-xs text-ink-muted">
                  Không nhận được mã?{" "}
                  <button
                    type="button"
                    onClick={guiLaiMa}
                    disabled={demNguoc > 0 || dangGui}
                    className="font-semibold text-ocean-600 hover:text-ocean-700 disabled:text-deep-800/35"
                  >
                    {demNguoc > 0 ? `Gửi lại sau ${demNguoc}s` : "Gửi lại mã"}
                  </button>
                </div>

                <p className="text-center text-xs text-ink-subtle">
                  <button type="button" onClick={() => doiMode("login")} className="font-semibold text-ocean-600 hover:text-ocean-700">
                    Quay lại đăng nhập
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
