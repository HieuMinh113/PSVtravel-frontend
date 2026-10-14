"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Mỗi ảnh nền hiển thị bao lâu trước khi chuyển sang ảnh kế (mili giây)
const DOI_ANH_MS = 6500;

/**
 * Ảnh nền đầu trang lấy từ chính các tour đang bán, chuyển cảnh chậm.
 * Dùng ở trang chủ và trang Tour trong nước / Tour nước ngoài — mỗi trang
 * truyền ảnh tour của riêng nó nên nền luôn đúng thứ đang bán ở trang đó.
 *
 * Tất cả ảnh render sẵn và chỉ đổi độ mờ — không gắn/tháo phần tử liên tục
 * nên không giật. Ảnh đầu đặt priority để giữ điểm LCP tốt.
 *
 * @param images danh sách { src, alt }
 */
export default function NenAnhDoiCanh({ images }) {
  const [hienTai, setHienTai] = useState(0);

  // Lúc mở trang CHỈ tải ảnh nền đầu tiên. Các ảnh sau nằm chồng lên nhau ở
  // độ mờ 0 nhưng vẫn "trong màn hình" nên trình duyệt tải hết ngay từ đầu
  // (~200KB), tranh băng thông với tiêu đề/phông chữ trên 4G. Đợi trang tải
  // xong thêm một nhịp mới gắn các ảnh còn lại và bắt đầu chuyển cảnh.
  const [taiAnhSau, setTaiAnhSau] = useState(false);
  useEffect(() => {
    let hen;
    const batDau = () => {
      hen = setTimeout(() => setTaiAnhSau(true), 2500);
    };
    if (document.readyState === "complete") batDau();
    else window.addEventListener("load", batDau, { once: true });
    return () => {
      window.removeEventListener("load", batDau);
      clearTimeout(hen);
    };
  }, []);

  // Chuyển cảnh chậm giữa các ảnh. Người dùng bật giảm chuyển động thì giữ
  // nguyên một ảnh — không có gì nhấp nháy.
  useEffect(() => {
    if (!taiAnhSau || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setHienTai((i) => (i + 1) % images.length), DOI_ANH_MS);
    return () => clearInterval(id);
  }, [taiAnhSau, images.length]);

  return images.slice(0, taiAnhSau ? images.length : 1).map(({ src, alt }, i) => (
    <Image
      key={src}
      src={src}
      // Ảnh nền trang trí (aria-hidden) nhưng vẫn ghi tên tour vào alt:
      // công cụ SEO tính alt rỗng là "thiếu alt", Google Hình ảnh cũng đọc.
      alt={alt || "Tour du lịch cùng PSV Travel"}
      aria-hidden
      fill
      priority={i === 0}
      sizes="100vw"
      // Nền chỉ hiện mờ 35% dưới lớp phủ tối → nén mạnh hơn không thấy khác
      quality={50}
      className={`object-cover transition-opacity duration-[1600ms] ease-in-out ${
        i === hienTai ? "opacity-35" : "opacity-0"
      }`}
    />
  ));
}
