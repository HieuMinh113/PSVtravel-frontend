import { goiApiCoToken } from "@/app/lib/auth";

// POST /api/reviews — gửi đánh giá tour.
// Backend tự kiểm tra người này đã đi tour đó chưa và đã đánh giá lần nào chưa.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  try {
    const { ok, status, data } = await goiApiCoToken("/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!ok) {
      return Response.json(data ?? { message: "Gửi đánh giá thất bại." }, {
        status: status || 400,
      });
    }

    return Response.json(data, { status: 201 });
  } catch {
    return Response.json(
      { message: "Không kết nối được máy chủ. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
