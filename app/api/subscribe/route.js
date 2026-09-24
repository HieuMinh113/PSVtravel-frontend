const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/subscribe — chuyển đăng ký nhận ưu đãi sang backend.
// Đi qua route cùng origin (giống liên hệ / đặt tour) để trình duyệt không
// phải gọi chéo tên miền sang API — tránh vướng CORS và giấu API nội bộ.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  try {
    const res = await fetch(`${API_URL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { message: "Không kết nối được máy chủ. Vui lòng thử lại sau." },
      { status: 503 },
    );
  }
}
