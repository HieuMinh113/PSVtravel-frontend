"use client";
import Link from "next/link";
import BangChuyen from "@/components/BangChuyen";
import AnhVuaKhung from "@/components/AnhVuaKhung";

// Banner khuyến mãi trang chủ — MỌI banner đang chạy trong admin, theo "Thứ tự".
//
// Trước đây chỉ hiện banner đầu tiên, trong khung cao cố định 300px cắt mất
// trên/dưới ảnh 1920×700 (logo, nút "Khám phá ngay"), lại đè thêm chữ + lớp tối
// lên nửa trái — trong khi ảnh nhân viên làm đã thiết kế sẵn chữ, giá, nút.
// Giờ: ảnh nguyên tấm, không đè chữ, bấm cả banner để mở link; tên banner trong
// admin chỉ làm chữ mô tả ảnh (alt) cho Google.
//
// Khung máy tính theo đúng cỡ admin hướng dẫn (1920×700). Điện thoại: có banner
// nào kèm ảnh điện thoại riêng thì khung dọc 4:5 (cỡ hướng dẫn 800×1000), không
// thì giữ khung ngang như máy tính.
const coAnhDienThoai = (b) => Boolean(b.image_mobile) && b.image_mobile !== b.image;

function LienKet({ href, nhan, children }) {
  const lop = "absolute inset-0 block";
  if (!href) return children;
  // Link nội bộ đi qua next/link (tải trước); link ngoài vẫn mở trong tab hiện tại
  return href.startsWith("/") ? (
    <Link href={href} aria-label={nhan} className={lop} draggable={false}>
      {children}
    </Link>
  ) : (
    <a href={href} aria-label={nhan} className={lop} draggable={false}>
      {children}
    </a>
  );
}

export default function BannerKhuyenMai({ banners = [] }) {
  const ds = banners.filter((b) => b?.image);
  if (!ds.length) return null;
  const khungDoc = ds.some(coAnhDienThoai);

  return (
    <BangChuyen nhan="Ưu đãi PSV Travel" khungClassName="overflow-hidden rounded-3xl bg-deep-950 shadow-deep">
      {ds.map((b) => {
        const nhan = b.title || "Ưu đãi PSV Travel";
        return (
          <div key={b.id} className={`relative w-full ${khungDoc ? "aspect-[4/5]" : "aspect-[96/35]"} sm:aspect-[96/35]`}>
            <LienKet href={b.link?.trim()} nhan={nhan}>
              <AnhVuaKhung
                anh={b.image}
                anhDienThoai={coAnhDienThoai(b) ? b.image_mobile : undefined}
                alt={nhan}
                sizes="(max-width: 1280px) 100vw, 1280px"
                sizesDienThoai="100vw"
              />
            </LienKet>
          </div>
        );
      })}
    </BangChuyen>
  );
}
