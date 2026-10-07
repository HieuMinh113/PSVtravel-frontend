import { layToken } from "@/app/lib/auth";
import { headerIpKhach } from "@/app/lib/ipKhach";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/visa — khách nộp hồ sơ visa (bước 1: thông tin, chưa có file).
//
// Đi vòng qua đây như form đặt tour: token đăng nhập nằm trong cookie httpOnly,
// chỉ phía server đọc được. Đang đăng nhập thì hồ sơ gắn vào tài khoản để khách
// theo dõi ở trang Tài khoản; chưa đăng nhập vẫn nộp được bình thường.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const token = await layToken();

  try {
    const res = await fetch(`${API_URL}/visa-applications`, {
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
    return Response.json(
      { message: "Không kết nối được máy chủ. Vui lòng gọi hotline để được hỗ trợ." },
      { status: 503 },
    );
  }
}
