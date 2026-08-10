"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState("login"); 
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-horizon px-5 py-24">
      {/* Trang trí nổi */}
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
          <div className="mb-8 flex rounded-full bg-ocean-50 p-1">
            {[
              { id: "login", label: "Đăng nhập" },
              { id: "register", label: "Đăng ký" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
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

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <h1 className="font-display text-2xl font-bold text-deep-900">Chào mừng trở lại</h1>
                  <p className="mt-1 text-sm text-deep-800/55">Đăng nhập để tiếp tục hành trình của bạn.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep-800/60">Email hoặc số điện thoại</label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input required placeholder="ban@email.com" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep-800/60">Mật khẩu</label>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input required type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-11 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                    <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-400">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-deep-800/60">
                    <input type="checkbox" className="rounded border-ocean-300 text-ocean-500 focus:ring-ocean-400" />
                    Ghi nhớ đăng nhập
                  </label>
                  <a href="#" className="font-semibold text-ocean-600 hover:text-ocean-700">Quên mật khẩu?</a>
                </div>

                <button type="submit" className="btn-cta w-full !py-3.5">
                  Đăng nhập <ArrowRight className="h-4 w-4" />
                </button>

                <p className="text-center text-xs text-deep-800/50">
                  Chưa có tài khoản?{" "}
                  <button type="button" onClick={() => setMode("register")} className="font-semibold text-ocean-600 hover:text-ocean-700">
                    Đăng ký ngay
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <h1 className="font-display text-2xl font-bold text-deep-900">Tạo tài khoản mới</h1>
                  <p className="mt-1 text-sm text-deep-800/55">Chỉ mất chưa đầy 1 phút để bắt đầu.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep-800/60">Họ và tên</label>
                  <div className="relative mt-1.5">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input required placeholder="Nguyễn Văn A" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-deep-800/60">Số điện thoại</label>
                    <div className="relative mt-1.5">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input required placeholder="09xx xxx xxx" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-deep-800/60">Email</label>
                    <div className="relative mt-1.5">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input required type="email" placeholder="ban@email.com" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep-800/60">Mật khẩu</label>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input required type={showPass ? "text" : "password"} placeholder="Tối thiểu 8 ký tự" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/40 py-3 pl-11 pr-11 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                    <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-400">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-xs text-deep-800/60">
                  <input required type="checkbox" className="mt-0.5 rounded border-ocean-300 text-ocean-500 focus:ring-ocean-400" />
                  Tôi đồng ý với{" "}
                  <Link href="/chinh-sach-bao-mat" className="font-semibold text-ocean-600 hover:text-ocean-700">
                    Chính sách bảo mật
                  </Link>{" "}
                  của PSVTravel
                </label>

                <button type="submit" className="btn-cta w-full !py-3.5">
                  Tạo tài khoản <ArrowRight className="h-4 w-4" />
                </button>

                <p className="text-center text-xs text-deep-800/50">
                  Đã có tài khoản?{" "}
                  <button type="button" onClick={() => setMode("login")} className="font-semibold text-ocean-600 hover:text-ocean-700">
                    Đăng nhập
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