import { cookies } from "next/headers";
import { TEN_COOKIE, cauHinhCookie } from "@/app/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// POST /api/auth/verify-otp — xác thực mã. Đúng mã thì backend trả token,
// đăng nhập luôn cho khách khỏi phải nhập lại mật khẩu.
export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  if (data?.data?.token) {
    const store = await cookies();
    store.set(TEN_COOKIE, data.data.token, cauHinhCookie);
  }

  return Response.json({ message: data.message, user: data?.data?.user ?? null });
}
