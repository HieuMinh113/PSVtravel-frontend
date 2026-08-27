"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import TopBar from "./TopBar";
import UserMenu from "./UserMenu";
import useNguoiDung from "@/app/lib/useNguoiDung";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ChevronDown, Compass, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

const links = [
  { to: "/", label: "Trang chủ" },
  { to: "/ve-chung-toi", label: "Về chúng tôi" },
  { to: "/tour-trong-nuoc", label: "Tour trong nước", mega: "domestic" },
  { to: "/tour-nuoc-ngoai", label: "Tour nước ngoài", mega: "abroad" },
  { to: "/ve-may-bay", label: "Vé máy bay" },
  { to: "/lam-visa", label: "Làm visa" },
  { to: "/cam-nang", label: "Cẩm nang" },
  { to: "/lien-he", label: "Liên hệ" },
];

// Mục trong mega menu = Danh Mục Tour trong admin (tên + ảnh + thứ tự).
// Admin thêm danh mục là menu tự có mục đó, khỏi sửa code.
function taoMegaConfig(dmTrongNuoc = [], dmNuocNgoai = []) {
  return {
    domestic: {
      heading: "Khám phá theo điểm đến",
      subheading: dmTrongNuoc.length
        ? `${dmTrongNuoc.length} điểm đến trong nước`
        : "Chưa có điểm đến nào",
      items: dmTrongNuoc,
      to: "/tour-trong-nuoc",
      ctaLabel: "Xem tất cả tour trong nước",
    },
    abroad: {
      heading: "Khám phá theo điểm đến",
      subheading: dmNuocNgoai.length
        ? `${dmNuocNgoai.length} điểm đến nước ngoài`
        : "Chưa có điểm đến nào",
      items: dmNuocNgoai,
      to: "/tour-nuoc-ngoai",
      ctaLabel: "Xem tất cả tour nước ngoài",
    },
  };
}

// Bấm vào một điểm đến thì sang trang danh sách đã lọc sẵn theo danh mục đó.
const duongDanDanhMuc = (config, item) =>
  `${config.to}?category=${encodeURIComponent(item.slug)}&scroll=1`;

const panelVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.035, delayChildren: 0.06 },
  },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

function MegaPanel({ config }) {
  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute left-1/2 top-full mt-3 w-[400px] -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-deep ring-1 ring-black/5"
    >
      {/* Đầu bảng — gradient thương hiệu, thay vì chữ xám đơn điệu */}
      <div className="relative overflow-hidden bg-gradient-to-r from-ocean-500 to-teal-500 px-5 py-4">
        <div className="pointer-events-none absolute -right-4 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex items-center gap-2.5 text-white">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
            <Compass className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold leading-none">{config.heading}</p>
            <p className="mt-1 text-xs text-white/75">{config.subheading}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-3">
        {config.items.map((item) => (
          <motion.div key={item.slug} variants={itemVariants}>
            <Link
              // Bấm vào phải LỌC. Trước đây dùng state={{query}} — cú pháp của
              // React Router, sang Next không có tác dụng nên bấm mục nào cũng
              // ra trang danh sách đầy đủ, không lọc gì.
              href={duongDanDanhMuc(config, item)}
              className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors duration-200 hover:bg-ocean-50/60"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                />
              ) : (
                // Danh mục chưa upload ảnh — vẫn hiện được, không để ô trống
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-600">
                  <Compass className="h-4 w-4" />
                </span>
              )}
              <span className="flex flex-1 flex-col leading-tight">
                <span className="text-sm font-semibold text-deep-900 transition-colors group-hover:text-ocean-700">
                  {item.name}
                </span>
                <span className="text-xs font-medium text-ink-subtle">
                  {item.tourCount > 0 ? `${item.tourCount} tour` : "Sắp có tour"}
                </span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-ocean-500 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="px-3 pb-3">
        <Link
          href={config.to}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ocean-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-200 hover:-translate-y-0.5"
        >
          {config.ctaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function Navbar({ settings = {}, dmTrongNuoc = [], dmNuocNgoai = [] }) {
  // Dựng lại chỉ khi danh sách đổi, không dựng lại mỗi lần rê chuột
  // Danh mục do layout dựng sẵn ở phía máy chủ truyền xuống.
  //
  // Layout KHÔNG được dựng lại khi chuyển trang bằng cách bấm link — nó giữ
  // nguyên dữ liệu của lần dựng đầu tiên. Nếu trang đầu tiên khách mở lại là
  // bản lưu tạm sinh ra lúc chưa có danh mục nào (ngay sau khi triển khai, hoặc
  // sau khi dọn cơ sở dữ liệu), navbar sẽ trống suốt cả phiên cho tới khi bấm
  // F5 — trong khi các nút lọc bên dưới lại hiện đủ, vì chúng thuộc về trang.
  //
  // Nên: nhận danh sách rỗng thì tự lấy lại ở phía trình duyệt đúng một lần.
  // Có dữ liệu sẵn thì không tốn thêm lượt gọi nào.
  const [dmTuLay, setDmTuLay] = useState(null);

  useEffect(() => {
    if (dmTrongNuoc.length || dmNuocNgoai.length || dmTuLay) return;

    let conHieuLuc = true;
    Promise.all([
      fetch("/api/categories?type=domestic").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/categories?type=abroad").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([trongNuoc, nuocNgoai]) => {
        if (conHieuLuc && (trongNuoc.length || nuocNgoai.length)) {
          setDmTuLay({ trongNuoc, nuocNgoai });
        }
      })
      .catch(() => {});

    return () => {
      conHieuLuc = false;
    };
  }, [dmTrongNuoc.length, dmNuocNgoai.length, dmTuLay]);

  const megaConfig = useMemo(
    () =>
      taoMegaConfig(
        dmTuLay?.trongNuoc ?? dmTrongNuoc,
        dmTuLay?.nuocNgoai ?? dmNuocNgoai
      ),
    [dmTrongNuoc, dmNuocNgoai, dmTuLay]
  );

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpenKey, setMegaOpenKey] = useState(null);
  const [mobileMegaOpenKey, setMobileMegaOpenKey] = useState(null);

  // Chiều cao tối đa của ngăn kéo trên điện thoại — ĐO chứ không đoán.
  //
  // Thanh điều hướng là position:fixed, nên phần ngăn kéo tràn quá đáy màn hình
  // nằm ngoài luồng cuộn của trang — cuộn kiểu gì cũng không tới. Trên máy cao
  // dưới ~700px (iPhone SE, Android đời cũ, hay trình duyệt máy tính thu nhỏ),
  // khách đã đăng nhập không tài nào bấm được nút Đăng xuất.
  //
  // Không viết cứng một con số: chiều cao thanh điều hướng thay đổi theo cỡ
  // logo, theo breakpoint, và theo việc thanh hotline phía trên đang mở hay đã
  // thu lại. Đo đúng vị trí ngăn kéo rồi lấy phần còn lại của màn hình.
  const ngamKeoRef = useRef(null);
  const [caoToiDa, setCaoToiDa] = useState(undefined);

  useEffect(() => {
    if (!open) {
      setCaoToiDa(undefined);
      return;
    }
    const doLai = () => {
      const el = ngamKeoRef.current;
      if (!el) return;
      const dinh = el.getBoundingClientRect().top;
      // visualViewport phản ánh đúng phần màn hình đang thấy khi bàn phím ảo
      // hoặc thanh địa chỉ đang chiếm chỗ
      const caoManHinh = window.visualViewport?.height ?? window.innerHeight;
      setCaoToiDa(Math.max(200, Math.floor(caoManHinh - dinh - 8)));
    };
    doLai();
    // Thanh hotline thu lại trong 500ms khi mở menu — đo lại sau khi xong
    const hen = setTimeout(doLai, 560);
    window.addEventListener("resize", doLai);
    window.visualViewport?.addEventListener("resize", doLai);
    return () => {
      clearTimeout(hen);
      window.removeEventListener("resize", doLai);
      window.visualViewport?.removeEventListener("resize", doLai);
    };
  }, [open]);
  const pathname = usePathname();
  const router = useRouter();
  const { nguoiDung, datLai } = useNguoiDung();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Những trang KHÔNG có ảnh nền tối ở đầu trang.
  //
  // Thanh điều hướng để trong suốt với chữ trắng khi chưa cuộn — hợp với trang
  // có Hero tối, nhưng trên trang nền sáng thì thành trắng trên trắng, cả menu
  // biến mất. Ép nền trắng ngay từ đầu cho những trang này.
  const TRANG_NEN_SANG = ["/tai-khoan"];
  const nenSang = TRANG_NEN_SANG.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const solid = scrolled || open || nenSang;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "bg-white/85 shadow-md backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      {/* Thanh hotline: hiện khi ở đầu trang, tự thu lại khi khách cuộn xuống
          để trả chỗ cho nội dung — giữ nguyên hành vi header cũ. */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-enter ${
          solid ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <TopBar settings={settings} />
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center">
          <Image
            src="/logo.png"
            alt="PSVTravel"
            width={900}
            height={349}
            priority
            className="h-auto w-44 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:w-52"
          />
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {links.map((l) =>
            l.mega ? (
              <div
                key={l.to}
                className="relative"
                onMouseEnter={() => setMegaOpenKey(l.mega)}
                onMouseLeave={() => setMegaOpenKey((k) => (k === l.mega ? null : k))}
              >
                <NavLink
                  href={l.to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[12.5px] lg:px-3 xl:px-4 xl:text-sm font-medium transition-colors duration-300 ${
                      solid
                        ? isActive
                          ? "text-ocean-600"
                          : "text-deep-800 hover:text-ocean-600"
                        : isActive
                        ? "text-white"
                        : "text-white/85 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          megaOpenKey === l.mega ? "rotate-180" : ""
                        }`}
                      />
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full ${
                            solid ? "bg-ocean-500" : "bg-teal-400"
                          }`}
                        />
                      )}
                    </>
                  )}
                </NavLink>

                <AnimatePresence>
                  {megaOpenKey === l.mega && <MegaPanel config={megaConfig[l.mega]} solid={solid} />}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink
                key={l.to}
                href={l.to}
                className={({ isActive }) =>
                  `relative whitespace-nowrap rounded-full px-2.5 py-2 text-[12.5px] lg:px-3 xl:px-4 xl:text-sm font-medium transition-colors duration-300 ${
                    solid
                      ? isActive
                        ? "text-ocean-600"
                        : "text-deep-800 hover:text-ocean-600"
                      : isActive
                      ? "text-white"
                      : "text-white/85 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full ${
                          solid ? "bg-ocean-500" : "bg-teal-400"
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            )
          )}
        </div>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <UserMenu solid={solid} />
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          // Ở đầu trang (chưa cuộn) thanh điều hướng trong suốt. Trước đây nút
          // này để chữ trắng trơn nên trên những trang có nền sáng ngay từ đầu
          // (Tài khoản, Đăng nhập) thì trắng trên trắng — nút biến mất, khách
          // phải cuộn xuống mới thấy. Cho nó một nền tối mờ để nổi trên mọi nền.
          className={`grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden ${
            solid
              ? "text-deep-900 hover:bg-ocean-50"
              : "bg-deep-950/55 text-white backdrop-blur-sm"
          }`}
          aria-label="Mở menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden bg-white lg:hidden"
          >
            {/* Ngăn kéo tự cuộn được — xem ghi chú ở chỗ tính caoToiDa */}
            <div
              ref={ngamKeoRef}
              style={{ maxHeight: caoToiDa }}
              className="flex flex-col gap-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2"
            >
              {links.map((l) =>
                l.mega ? (
                  <div key={l.to}>
                    <div className="flex items-center rounded-xl pr-2 text-sm font-medium text-deep-800">
                      <NavLink
                        href={l.to}
                        className={({ isActive }) =>
                          `flex-1 rounded-xl px-4 py-3 ${isActive ? "bg-ocean-50 text-ocean-700" : ""}`
                        }
                      >
                        {l.label}
                      </NavLink>
                      <button
                        onClick={() =>
                          setMobileMegaOpenKey((k) => (k === l.mega ? null : l.mega))
                        }
                        className="grid h-9 w-9 place-items-center text-ink-subtle"
                        aria-label={`Xem danh sách ${l.label}`}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            mobileMegaOpenKey === l.mega ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {mobileMegaOpenKey === l.mega && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-1 py-1 pl-3">
                            {megaConfig[l.mega].items.map((item) => (
                              <Link
                                key={item.slug}
                                href={duongDanDanhMuc(megaConfig[l.mega], item)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-ocean-50"
                              >
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 shrink-0 rounded-md object-cover ring-1 ring-black/5"
                                  />
                                ) : (
                                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ocean-50 text-ocean-600">
                                    <Compass className="h-3.5 w-3.5" />
                                  </span>
                                )}
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    key={l.to}
                    href={l.to}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive ? "bg-ocean-50 text-ocean-700" : "text-deep-800"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                )
              )}
              {nguoiDung ? (
                <>
                  <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-ocean-50 px-4 py-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ocean-600 text-xs font-bold text-white">
                      {(nguoiDung.name || "?").trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-deep-900">{nguoiDung.name}</p>
                      <p className="truncate text-xs text-ink-subtle">{nguoiDung.email}</p>
                    </div>
                  </div>
                  <Link href="/tai-khoan" className="rounded-xl px-4 py-3 text-sm font-medium text-deep-800">
                    Đơn đặt tour của tôi
                  </Link>
                  <Link href="/tai-khoan?tab=ho-so" className="rounded-xl px-4 py-3 text-sm font-medium text-deep-800">
                    Hồ sơ &amp; mật khẩu
                  </Link>
                  {/* Lối tắt sang trang quản trị. Trước đây chỉ bản máy tính có,
                      nhân viên dùng điện thoại phải tự nhớ và gõ địa chỉ ở cổng
                      khác — trong khi họ chính là người hay xử lý đơn ngoài giờ.
                      Mở tab mới để không mất trang đang xem bên website. */}
                  {nguoiDung.la_nhan_vien && nguoiDung.admin_url && (
                    <a
                      href={nguoiDung.admin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-ocean-700"
                    >
                      <ShieldCheck className="h-4 w-4 shrink-0 text-ocean-600" />
                      <span className="flex-1">Vào trang quản trị</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-subtle" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
                      datLai(null);
                      router.push("/");
                      router.refresh();
                    }}
                    className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="mt-2 rounded-xl bg-ocean-500 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}