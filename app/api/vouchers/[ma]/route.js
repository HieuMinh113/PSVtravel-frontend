import { headerIpKhach } from "@/app/lib/ipKhach";
import { chuanHoaMa } from "@/app/lib/voucher";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// GET /api/vouchers/{mã} — khách kiểm tra voucher ở trang Voucher & ưu đãi.
// Đi qua route cùng origin, kèm IP thật của khách: backend giới hạn số lần tra
// mỗi phút theo IP (chống dò mã) — không kèm thì mọi khách bị tính chung một IP.
export async function GET(_request, { params }) {
  const ma = chuanHoaMa((await params).ma);
  if (!ma) {
    return Response.json({ message: "Mã voucher chưa đúng dạng.", trang_thai: "khong_co" }, { status: 422 });
  }
  try {
    const res = await fetch(`${API_URL}/vouchers/${encodeURIComponent(ma)}`, {
      headers: { ...(await headerIpKhach()), Accept: "application/json" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Không kết nối được máy chủ. Vui lòng thử lại sau." }, { status: 503 });
  }
}
