// Voucher PSV Travel: chuẩn hoá mã khách gõ / quét, nhãn trạng thái.
// Mã in trên voucher dạng PSV-7KQ3-MZ8T; QR mang link …/voucher/PSV-7KQ3-MZ8T.

/** Chữ khách gõ hoặc nội dung QR quét được → mã để tra (null nếu không giống mã). */
export function chuanHoaMa(nhap) {
  let s = String(nhap ?? "").trim();
  const link = s.match(/\/voucher\/([^/?#\s]+)/i);
  if (link) {
    try {
      s = decodeURIComponent(link[1]);
    } catch {
      s = link[1];
    }
  }
  s = s.toUpperCase().replace(/[\s_.]+/g, "-").replace(/[^A-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return s.replace(/-/g, "").length >= 6 && s.length <= 40 ? s : null;
}

/** Trạng thái backend trả về → cách hiển thị */
export const TRANG_THAI = {
  con_dung: { nhan: "Còn dùng được", tot: true, moTa: "Voucher hợp lệ. Đưa voucher (hoặc mã) cho nhân viên PSV Travel khi đặt dịch vụ." },
  da_dung: { nhan: "Đã sử dụng", tot: false, moTa: "Mỗi voucher chỉ dùng một lần — mã này đã được dùng." },
  het_han: { nhan: "Đã hết hạn", tot: false, moTa: "Voucher đã quá hạn sử dụng ghi trên voucher." },
  tam_ngung: { nhan: "Tạm ngưng", tot: false, moTa: "Chương trình voucher này đang tạm ngưng. Gọi hotline để được hỗ trợ." },
  da_huy: { nhan: "Không còn hiệu lực", tot: false, moTa: "Mã này đã bị huỷ. Gọi hotline nếu bạn cần hỗ trợ." },
  khong_co: { nhan: "Không tìm thấy mã", tot: false, moTa: "Kiểm tra lại từng ký tự in dưới mã QR (mã không có số 0, 1 và chữ O, I, L)." },
};

export function trangThai(ma) {
  return TRANG_THAI[ma] ?? TRANG_THAI.khong_co;
}

/** "2026-12-31" → "31/12/2026" */
export function ngayVN(iso) {
  if (!iso) return null;
  const [y, m, d] = String(iso).slice(0, 10).split("-");
  return d && m && y ? `${d}/${m}/${y}` : null;
}

/** Trang quét voucher trong admin (nhân viên mở link → xác nhận dùng) */
export function linkQuetNoiBo(ma, apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1") {
  const goc = String(apiUrl).replace(/\/api\/v\d+\/?$/, "").replace(/\/$/, "");
  return `${goc}/admin/quet-voucher?ma=${encodeURIComponent(ma)}`;
}
