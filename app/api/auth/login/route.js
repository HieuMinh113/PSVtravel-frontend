import { cookies } from "next/headers";
import { TEN_COOKIE, cauHinhCookie } from "@/app/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// POST /api/auth/login — nhận email/username/SĐT + mật khẩu từ form,
// gọi backend Laravel, rồi CẤT TOKEN VÀO COOKIE httpOnly.
// Token không bao giờ được trả về cho JavaScript phía trình duyệt.
export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Giữ nguyên mã lỗi để form hiển thị đúng thông báo (403 = chưa xác thực OTP)
    return Response.json(data, { status: res.status });
  }

  const store = await cookies();
  store.set(TEN_COOKIE, data.data.token, cauHinhCookie);

  return Response.json({ message: data.message, user: data.data.user });
}
