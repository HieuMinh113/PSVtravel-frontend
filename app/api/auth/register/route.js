const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/auth/register — chuyển tiếp sang backend.
// Chưa cấp token ở bước này vì tài khoản cần xác thực OTP trước.
export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return Response.json(data, { status: res.status });
}
