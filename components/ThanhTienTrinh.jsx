"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thanh tiến trình mảnh ở mép trên màn hình khi chuyển trang trong web.
 *
 * Thay cho các file loading.jsx (khung xương "đang tải"). Khung xương có một
 * cái giá lớn mà trước đây không thấy: Next bọc CẢ trang vào <Suspense>, nên
 * ngay cả lần mở trang đầu tiên HTML cũng gửi khung xương trước, nội dung thật
 * nằm trong khối ẩn và chỉ được hiện ra khi script chạy tới — tiêu đề trang
 * chậm ~2,5 giây trên điện thoại, PageSpeed báo LCP 7,4s.
 *
 * Bỏ khung xương thì nội dung có ngay trong HTML. Còn cảm giác "web đã nhận
 * lệnh" khi bấm sang trang khác (lý do ban đầu thêm khung xương: khách bấm vào
 * tour, màn hình đứng im, không biết có nhận chưa nên bấm lại) thì thanh này
 * lo: bấm link là thanh chạy ngay, trang mới hiện thì thanh chạy hết rồi ẩn.
 */
export default function ThanhTienTrinh() {
  const pathname = usePathname();
  const [trangThai, setTrangThai] = useState("an"); // an | chay | xong
  const henGio = useRef([]);

  const xoaHen = () => {
    henGio.current.forEach(clearTimeout);
    henGio.current = [];
  };

  // Bắt đầu khi bấm vào link nội bộ dẫn tới TRANG KHÁC
  useEffect(() => {
    const khiBam = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // mở tab mới
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      let dich;
      try {
        dich = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (dich.origin !== window.location.origin) return;
      // Chỉ đổi tham số (bộ lọc) hoặc nhảy tới #mục trong cùng trang: gần như
      // tức thì, không cần thanh — mà pathname không đổi nên thanh sẽ treo.
      if (dich.pathname === window.location.pathname) return;

      xoaHen();
      setTrangThai("chay");
      // Chốt an toàn: lỡ điều hướng bị huỷ thì 10 giây sau tự ẩn
      henGio.current.push(setTimeout(() => setTrangThai("an"), 10000));
    };
    document.addEventListener("click", khiBam, true);
    return () => document.removeEventListener("click", khiBam, true);
  }, []);

  // Trang mới đã hiện → chạy nốt rồi ẩn
  useEffect(() => {
    setTrangThai((t) => {
      if (t !== "chay") return t;
      xoaHen();
      henGio.current.push(setTimeout(() => setTrangThai("an"), 350));
      return "xong";
    });
  }, [pathname]);

  useEffect(() => xoaHen, []);

  if (trangThai === "an") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] overflow-hidden"
    >
      <div
        className={`h-full origin-left bg-gradient-to-r from-sunset-500 via-gold-400 to-teal-400 ${
          trangThai === "chay" ? "thanh-tien-trinh-chay" : "thanh-tien-trinh-xong"
        }`}
      />
    </div>
  );
}
