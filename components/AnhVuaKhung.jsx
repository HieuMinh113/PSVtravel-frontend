import { getImageProps } from "next/image";
import { duocToiUu } from "@/app/lib/anh";

// Ảnh hiện NGUYÊN tấm trong một khung tỉ lệ cố định (không cắt chữ thiết kế sẵn
// trên ảnh). Ảnh lệch tỉ lệ khung thì phần trống phủ bản mờ của chính ảnh đó —
// cùng địa chỉ ảnh nên trình duyệt không tải thêm lần nào.
//
// Khung cố định để băng chuyền không đổi chiều cao mỗi lần chuyển (trang giật,
// Google tính điểm "dịch chuyển bố cục").
//
// Đặt trong một phần tử `relative` có tỉ lệ khung (aspect-*). `anhDienThoai`:
// ảnh riêng cho màn < 640px; <picture> làm trình duyệt chỉ tải đúng một ảnh.
function Hinh({ anh, anhDienThoai, alt, sizes, sizesDienThoai, className, loading, anDi }) {
  const dt = anhDienThoai || anh;
  const { props: pMay } = getImageProps({ src: anh, alt, fill: true, sizes, loading, unoptimized: !duocToiUu(anh) });
  const { props: pDt } = getImageProps({
    src: dt,
    alt,
    fill: true,
    sizes: sizesDienThoai || sizes,
    loading,
    unoptimized: !duocToiUu(dt),
  });
  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={pMay.srcSet || pMay.src} sizes={pMay.sizes} />
      <img
        {...pDt}
        // Lọc màu đặt thẳng trên ảnh: quy tắc chung "img { filter: saturate… }"
        // trong globals.css mạnh hơn class blur-* nên class bị đè, nền không mờ
        style={anDi ? { ...pDt.style, filter: "blur(28px) brightness(0.55) saturate(1.2)" } : pDt.style}
        alt={anDi ? "" : alt}
        aria-hidden={anDi || undefined}
        draggable={false}
        className={className}
      />
    </picture>
  );
}

export default function AnhVuaKhung(props) {
  // overflow-hidden: nền mờ phóng to 125% không được tràn sang mục bên cạnh
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Hinh {...props} anDi className="scale-125 object-cover" />
      <Hinh {...props} className="object-contain" />
    </div>
  );
}
