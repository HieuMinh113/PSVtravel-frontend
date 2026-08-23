const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/auth/resend-otp — xin gửi lại mã.
// Giới hạn chống spam nằm ở backend (chờ 60 giây, tối đa 5 mã/giờ).
export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return Response.json(data, { status: res.status });
}
