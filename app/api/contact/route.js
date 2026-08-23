const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/contact — chuyển tin liên hệ sang backend để lưu vào cơ sở dữ liệu.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { message: "Không kết nối được máy chủ. Vui lòng gọi hotline giúp chúng tôi." },
      { status: 503 },
    );
  }
}
