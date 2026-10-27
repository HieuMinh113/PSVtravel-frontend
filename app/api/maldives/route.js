import { layToken } from "@/app/lib/auth";
import { headerIpKhach } from "@/app/lib/ipKhach";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/maldives — khách gửi yêu cầu đặt combo Maldives. Đi vòng qua đây
// như đặt tour (app/api/bookings): gắn tài khoản đang đăng nhập (cookie httpOnly)
// và IP thật của khách để backend giới hạn số lượt gửi theo từng người.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const token = await layToken();

  try {
    const res = await fetch(`${API_URL}/maldives/bookings`, {
      method: "POST",
      headers: {
        ...(await headerIpKhach()),
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ message: "Không kết nối được hệ thống đặt combo. Vui lòng gọi hotline để được hỗ trợ." }, { status: 503 });
  }
}
