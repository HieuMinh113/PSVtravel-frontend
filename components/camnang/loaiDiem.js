import { BedDouble, Landmark, MapPin, ShoppingBag, TramFront, Trees, UtensilsCrossed } from "lucide-react";

// Loại điểm trên bản đồ thành phố — khớp GuideSpot::LOAI bên backend.
// Mỗi loại có biểu tượng riêng: không chỉ dựa vào màu để phân biệt (người
// mù màu vẫn đọc được). Màu nền đều đạt tương phản ≥ 4.5:1 với biểu tượng trắng.
export const LOAI_DIEM = {
  tham_quan: { nhan: "Tham quan", mau: "#0169A9", Icon: Landmark },
  an_uong: { nhan: "Ăn uống", mau: "#C2410C", Icon: UtensilsCrossed },
  mua_sam: { nhan: "Mua sắm", mau: "#837409", Icon: ShoppingBag },
  thien_nhien: { nhan: "Thiên nhiên", mau: "#2D741A", Icon: Trees },
  luu_tru: { nhan: "Lưu trú", mau: "#0D3A5C", Icon: BedDouble },
  di_chuyen: { nhan: "Di chuyển", mau: "#4A6076", Icon: TramFront },
  khac: { nhan: "Khác", mau: "#5E7385", Icon: MapPin },
};

export const loaiCua = (ma) => LOAI_DIEM[ma] ?? LOAI_DIEM.khac;
