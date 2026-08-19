import { cookies } from "next/headers";

// Tên cookie chứa token. Cookie đặt httpOnly nên JavaScript phía trình duyệt
// KHÔNG đọc được — kể cả khi trang bị chèn mã độc (XSS) cũng không lấy được token.
export const TEN_COOKIE = "psv_token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Cấu hình cookie dùng chung khi đăng nhập
export const cauHinhCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // production bắt buộc HTTPS
  sameSite: "lax",                               // chống CSRF cơ bản
  path: "/",
  maxAge: 60 * 60 * 24 * 7,                      // 7 ngày, khớp hạn token backend
};

// Đọc token từ cookie (chỉ chạy phía server)
export async function layToken() {
  const store = await cookies();
  return store.get(TEN_COOKIE)?.value ?? null;
}

// Gọi API backend kèm token. Trả về { ok, status, data }
export async function goiApiCoToken(duongDan, options = {}) {
  const token = await layToken();
  if (!token) return { ok: false, status: 401, data: null };

  const res = await fetch(`${API_URL}${duongDan}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    cache: "no-store", // dữ liệu cá nhân — tuyệt đối không cache
  });

  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

// Lấy thông tin người đang đăng nhập; null nếu chưa đăng nhập hoặc token hết hạn
export async function layNguoiDung() {
  const { ok, data } = await goiApiCoToken("/auth/me");
  return ok ? data?.data ?? null : null;
}
