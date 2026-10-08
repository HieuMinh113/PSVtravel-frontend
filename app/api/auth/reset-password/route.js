import { cookies } from "next/headers";
import { TEN_COOKIE, cauHinhCookie } from "@/app/lib/auth";
import { headerIpKhach } from "@/app/lib/ipKhach";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/auth/reset-password — mã + mật khẩu mới. Đúng thì backend trả
// token, đăng nhập luôn cho khách (cookie httpOnly như lúc đăng nhập).
export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { ...(await headerIpKhach()), "Content-Type": "application/json", Accept: "application/json" },
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
