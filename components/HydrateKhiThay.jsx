"use client";
import { lazy, memo, Suspense, useEffect, useRef } from "react";

/**
 * Khối nằm dưới màn hình đầu: HTML vẫn có đủ ngay từ máy chủ (Google đọc được,
 * khách thấy ngay), nhưng phần JavaScript "đánh thức" nó (hydrate) được HOÃN
 * tới khi khách cuộn gần tới.
 *
 * Vì sao cần: trước đây cả trang chủ — hơn 1.000 thẻ HTML, hàng chục hiệu ứng
 * — được đánh thức MỘT LƯỢT ngay khi mở trang. Trên điện thoại tầm trung, máy
 * bị chiếm gần 1 giây; khách chạm vào ô tìm kiếm hay nút menu trong lúc đó sẽ
 * thấy trễ. Giờ lúc mở trang chỉ đánh thức phần đầu, các khối bên dưới lần
 * lượt được đánh thức khi cuộn tới — mỗi lần một phần nhỏ, không gây giật.
 *
 * Cách làm: React giữ nguyên HTML của máy chủ cho một khối <Suspense> khi mã
 * của nó chưa sẵn sàng. Ở đây "mã chưa sẵn sàng" được giữ bằng một lời hứa chỉ
 * mở khi khối lọt vào gần tầm nhìn (IntersectionObserver).
 *
 * Kèm content-visibility (lớp .khoi-duoi-man-hinh trong globals.css): khối
 * chưa cuộn tới thì trình duyệt KHÔNG tính bố cục, không vẽ — đo thực tế đây
 * là phần nặng nhất lúc mở trang chủ (một lượt tính bố cục cả trang ~300ms).
 *
 * Dùng:  const Khoi = hydrateKhiThay(() => import("./A").then(m => ({ default: m.Khoi })));
 * Props truyền vào PHẢI ổn định (lấy thẳng từ props trang, không tạo mới mỗi
 * lần render): khối chưa được đánh thức mà nhận props khác đi thì React bỏ HTML
 * máy chủ và vẽ lại từ đầu — mất đúng cái lợi mình muốn.
 */
export default function hydrateKhiThay(nap, { khoangCach = "200px" } = {}) {
  let moKhoa;
  const choToi = new Promise((r) => (moKhoa = r));

  // Máy chủ: dựng HTML ngay. Trình duyệt: chờ tới khi được mở khoá.
  const Lazy = lazy(() => (typeof window === "undefined" ? nap() : choToi.then(nap)));

  function KhoiHoan(props) {
    const ref = useRef(null);

    useEffect(() => {
      const el = ref.current;
      // Không có HTML máy chủ (khách chuyển trang trong web, không tải lại
      // trang) hoặc trình duyệt quá cũ → dựng ngay, không có gì để hoãn.
      if (!el || el.childElementCount === 0 || !("IntersectionObserver" in window)) {
        moKhoa();
        return;
      }
      // Tải sẵn MÃ lúc máy rảnh (không đánh thức) — tới lúc khách cuộn tới
      // chỉ còn việc đánh thức, không phải chờ tải file qua mạng.
      const tai = () => nap().catch(() => {});
      const hen = "requestIdleCallback" in window
        ? window.requestIdleCallback(tai, { timeout: 4000 })
        : window.setTimeout(tai, 2500);

      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            moKhoa();
            io.disconnect();
          }
        },
        { rootMargin: `${khoangCach} 0px` }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        if ("cancelIdleCallback" in window) window.cancelIdleCallback(hen);
        else window.clearTimeout(hen);
      };
    }, []);

    return (
      <div ref={ref} className="khoi-duoi-man-hinh">
        <Suspense fallback={null}>
          <Lazy {...props} />
        </Suspense>
      </div>
    );
  }

  return memo(KhoiHoan);
}
