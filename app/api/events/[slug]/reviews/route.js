const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/events/{slug}/reviews — chuyển đánh giá gói sự kiện sang backend
// (backend lưu ở trạng thái chờ duyệt).
export async function POST(request, { params }) {
  const { slug } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const res = await fetch(`${API_URL}/events/${encodeURIComponent(slug)}/reviews`, {
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
