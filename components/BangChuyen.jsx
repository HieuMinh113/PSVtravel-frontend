"use client";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Băng chuyền dùng chung: banner khuyến mãi trang chủ, poster popup.
//
// - Cuộn ngang gốc của trình duyệt (scroll-snap): vuốt trên điện thoại mượt như
//   ứng dụng, không thêm thư viện, không chạy JS nặng lúc tải trang.
// - Máy tính: kéo bằng chuột, mũi tên hai bên, phím ← →; chấm tròn bên dưới.
// - Tự chuyển sau `thoiGian` mili giây; dừng khi khách rê chuột / chạm / đang
//   dùng phím trong khung, khi khung khuất khỏi màn hình hoặc tab bị ẩn. Khách
//   bật "giảm chuyển động" trong máy thì không tự chạy.
// - Kéo xong thì nuốt cú click ngay sau đó — không thì thả chuột trên banner là
//   mở luôn link, hoặc thả ra ngoài poster là đóng popup.
// - Chỉ có 1 mục thì hiện tĩnh, không mũi tên, không chấm.
const NGUONG_KEO = 50; // px kéo tối thiểu để sang mục khác

function useGiamChuyenDong() {
  const [giam, setGiam] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const capNhat = () => setGiam(mq.matches);
    capNhat();
    mq.addEventListener("change", capNhat);
    return () => mq.removeEventListener("change", capNhat);
  }, []);
  return giam;
}

export default function BangChuyen({
  children,
  nhan = "Băng chuyền",
  thoiGian = 5000,
  nenToi = false, // chấm / mũi tên cho nền tối (popup)
  className = "",
  khungClassName = "",
}) {
  const muc = Children.toArray(children);
  const n = muc.length;
  const ref = useRef(null);
  const keo = useRef(null);
  const [idx, setIdx] = useState(0);
  const [nhip, setNhip] = useState(0);
  const [dung, setDung] = useState({ chuot: false, cham: false, phim: false, khuat: false });
  const giamChuyenDong = useGiamChuyenDong();

  // Mục đang hiện = vị trí cuộn (đúng cả khi khách tự vuốt)
  useEffect(() => {
    const el = ref.current;
    if (!el || n < 2) return;
    let raf = 0;
    const khiCuon = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIdx(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))));
    };
    el.addEventListener("scroll", khiCuon, { passive: true });
    return () => {
      el.removeEventListener("scroll", khiCuon);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  const toi = useCallback(
    (i, vongLai = true) => {
      const el = ref.current;
      if (!el || n < 2) return;
      const dich = vongLai ? ((i % n) + n) % n : Math.min(Math.max(i, 0), n - 1);
      el.scrollTo({ left: dich * el.clientWidth, behavior: giamChuyenDong ? "auto" : "smooth" });
    },
    [n, giamChuyenDong]
  );

  // Khuất khỏi màn hình thì không tự chạy
  useEffect(() => {
    const el = ref.current;
    if (!el || n < 2 || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setDung((d) => ({ ...d, khuat: !e.isIntersecting })), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [n]);

  const dangDung = n < 2 || giamChuyenDong || dung.chuot || dung.cham || dung.phim || dung.khuat;
  useEffect(() => {
    if (dangDung) return;
    const hen = setTimeout(() => {
      if (document.visibilityState === "visible") toi(idx + 1);
      setNhip((x) => x + 1); // hẹn lại kể cả khi tab đang ẩn
    }, thoiGian);
    return () => clearTimeout(hen);
  }, [idx, nhip, dangDung, thoiGian, toi]);

  // Kéo bằng chuột (vuốt cảm ứng đã có sẵn nhờ cuộn ngang gốc)
  const batDauKeo = (e) => {
    const el = ref.current;
    if (!el || n < 2 || e.pointerType !== "mouse" || e.button !== 0) return;
    keo.current = { x: e.clientX, trai: el.scrollLeft, tu: Math.round(el.scrollLeft / el.clientWidth), daKeo: false };
    const khiDi = (ev) => {
      const k = keo.current;
      if (!k) return;
      const lech = ev.clientX - k.x;
      if (!k.daKeo && Math.abs(lech) > 5) {
        k.daKeo = true;
        el.style.scrollSnapType = "none"; // tắt hít khi đang kéo, không thì giật
      }
      if (k.daKeo) el.scrollLeft = k.trai - lech;
    };
    const khiTha = (ev) => {
      window.removeEventListener("pointermove", khiDi);
      window.removeEventListener("pointerup", khiTha);
      const k = keo.current;
      keo.current = null;
      if (!k?.daKeo) return;
      const lech = ev.clientX - k.x;
      toi(lech < -NGUONG_KEO ? k.tu + 1 : lech > NGUONG_KEO ? k.tu - 1 : k.tu, false);
      setTimeout(() => (el.style.scrollSnapType = ""), 450);
      // Nuốt cú click do chính lần thả chuột này sinh ra (ở bất kỳ đâu)
      const chan = (c) => {
        c.preventDefault();
        c.stopPropagation();
      };
      window.addEventListener("click", chan, { capture: true, once: true });
      setTimeout(() => window.removeEventListener("click", chan, { capture: true }), 0);
    };
    window.addEventListener("pointermove", khiDi);
    window.addEventListener("pointerup", khiTha);
  };

  const mau = nenToi
    ? { cham: "bg-white/45", chamHien: "bg-white", nut: "bg-white/90 text-deep-900 hover:bg-white" }
    : { cham: "bg-ocean-200", chamHien: "bg-ocean-700", nut: "bg-white/90 text-deep-900 shadow-lg hover:bg-white" };

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label={nhan}
      onMouseEnter={() => setDung((d) => ({ ...d, chuot: true }))}
      onMouseLeave={() => setDung((d) => ({ ...d, chuot: false }))}
      onTouchStart={() => setDung((d) => ({ ...d, cham: true }))}
      onTouchEnd={() => setDung((d) => ({ ...d, cham: false }))}
      onFocus={() => setDung((d) => ({ ...d, phim: true }))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setDung((d) => ({ ...d, phim: false }))}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") toi(idx + 1);
        if (e.key === "ArrowLeft") toi(idx - 1);
      }}
    >
      <div className={`group relative ${khungClassName}`}>
        <div
          ref={ref}
          onPointerDown={batDauKeo}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {muc.map((m, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}`}
              className="w-full shrink-0 snap-center snap-always"
            >
              {m}
            </div>
          ))}
        </div>

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => toi(idx - 1)}
              aria-label="Xem mục trước"
              className={`absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 sm:grid ${mau.nut}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => toi(idx + 1)}
              aria-label="Xem mục tiếp theo"
              className={`absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 sm:grid ${mau.nut}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="mt-3 flex justify-center gap-1">
          {muc.map((_, i) => (
            // Vùng bấm 24px cho dễ chạm, chấm nhìn thấy chỉ 8px
            <button
              key={i}
              type="button"
              onClick={() => toi(i)}
              aria-label={`Xem mục ${i + 1}`}
              aria-current={i === idx ? "true" : undefined}
              className="grid h-6 min-w-6 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-all duration-300 ${i === idx ? `w-6 ${mau.chamHien}` : `w-2 ${mau.cham}`}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
