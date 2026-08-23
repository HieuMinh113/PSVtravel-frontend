"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { User, LogOut, Ticket, Settings, ChevronDown, Loader2, ShieldCheck, ExternalLink } from "lucide-react";
import useNguoiDung from "@/app/lib/useNguoiDung";

/**
 * Nút tài khoản trên thanh điều hướng.
 *
 * Chưa đăng nhập thì đây là nút "Đăng nhập". Đã đăng nhập thì thành menu thả
 * xuống có tên người dùng, lịch sử đặt tour, hồ sơ và nút đăng xuất.
 *
 * `solid` cho biết thanh điều hướng đang ở nền trắng hay đang trong suốt trên
 * nền ảnh — chữ phải đổi màu theo, nếu không sẽ trắng trên trắng.
 */
export default function UserMenu({ solid = false }) {
  const { nguoiDung: user, dangTai, datLai } = useNguoiDung();
  const [open, setOpen] = useState(false);
  const [dangThoat, setDangThoat] = useState(false);
  const boc = useRef(null);
  const router = useRouter();

  // Bấm ra ngoài hoặc bấm Esc thì đóng menu
  useEffect(() => {
    if (!open) return;

    const bamNgoai = (e) => {
      if (boc.current && !boc.current.contains(e.target)) setOpen(false);
    };
    const bamEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", bamNgoai);
    document.addEventListener("keydown", bamEsc);
    return () => {
      document.removeEventListener("mousedown", bamNgoai);
      document.removeEventListener("keydown", bamEsc);
    };
  }, [open]);

  const dangXuat = async () => {
    if (dangThoat) return;
    setDangThoat(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Gọi backend hỏng thì cookie vẫn được xoá ở route handler — cứ đi tiếp
    }

    setOpen(false);
    datLai(null);
    router.push("/");
    router.refresh();
  };

  // Chưa biết đã đăng nhập hay chưa: giữ chỗ đúng kích thước nút để thanh
  // điều hướng không bị giật khi dữ liệu về
  if (dangTai) {
    return <div aria-hidden className="h-9 w-[104px] rounded-full bg-white/10" />;
  }

  if (!user) {
    return (
      <Link
        href="/dang-nhap"
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
          solid
            ? "bg-ocean-600 text-white hover:bg-ocean-700"
            : "bg-white/15 text-white backdrop-blur hover:bg-white/25"
        }`}
      >
        <User className="h-4 w-4" />
        <span className="hidden xl:inline">Đăng nhập</span>
      </Link>
    );
  }

  // Chữ cái đầu của tên làm ảnh đại diện khi khách chưa tải ảnh lên
  const chuDau = (user.name || user.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div ref={boc} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-1.5 pr-3 text-sm font-semibold transition-colors duration-300 ${
          solid
            ? "bg-ocean-50 text-ocean-800 hover:bg-ocean-100"
            : "bg-white/15 text-white backdrop-blur hover:bg-white/25"
        }`}
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span
            className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
              solid ? "bg-ocean-600 text-white" : "bg-white/25 text-white"
            }`}
          >
            {chuDau}
          </span>
        )}
        <span className="hidden max-w-[10ch] truncate xl:inline">{user.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl bg-white shadow-deep ring-1 ring-black/5"
          >
            <div className="border-b border-ocean-50 bg-ocean-50/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-deep-900">{user.name}</p>
                {user.la_nhan_vien && (
                  <span className="shrink-0 rounded-full bg-ocean-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Nhân viên
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-ink-subtle">{user.email}</p>
            </div>

            <div className="p-1.5">
              <Link
                href="/tai-khoan"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-deep-800 transition-colors hover:bg-ocean-50"
              >
                <Ticket className="h-4 w-4 text-ocean-600" />
                Đơn đặt tour của tôi
              </Link>
              <Link
                href="/tai-khoan?tab=ho-so"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-deep-800 transition-colors hover:bg-ocean-50"
              >
                <Settings className="h-4 w-4 text-ocean-600" />
                Hồ sơ &amp; mật khẩu
              </Link>
            </div>

            {/* Lối tắt sang trang quản trị — chỉ hiện với nhân viên và quản trị
                viên. Họ hay xem website như khách rồi cần nhảy sang admin xử lý
                đơn; trước đây phải tự gõ địa chỉ ở cổng khác.
                Mở tab mới để không mất trang đang xem bên website. */}
            {user.la_nhan_vien && user.admin_url && (
              <div className="border-t border-ocean-50 p-1.5">
                <a
                  href={user.admin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-50"
                >
                  <ShieldCheck className="h-4 w-4 text-ocean-600" />
                  <span className="flex-1">Vào trang quản trị</span>
                  <ExternalLink className="h-3.5 w-3.5 text-ink-subtle" />
                </a>
              </div>
            )}

            <div className="border-t border-ocean-50 p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={dangXuat}
                disabled={dangThoat}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60"
              >
                {dangThoat ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                {dangThoat ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
