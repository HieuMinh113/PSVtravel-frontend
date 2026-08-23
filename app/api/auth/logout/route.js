import { cookies } from "next/headers";
import { TEN_COOKIE } from "@/app/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/auth/logout — thu hồi token ở backend rồi xoá cookie.
export async function POST() {
  const store = await cookies();
  const token = store.get(TEN_COOKIE)?.value;

  if (token) {
    // Gọi backend để xoá token khỏi CSDL; lỗi mạng cũng vẫn xoá cookie phía dưới
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }

  store.delete(TEN_COOKIE);
  return Response.json({ message: "Đã đăng xuất." });
}
