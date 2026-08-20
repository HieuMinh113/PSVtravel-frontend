const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// POST /api/bookings/lookup — proxy sang Laravel để tra cứu đơn đặt tour.
// Đi qua đây thay vì gọi thẳng từ trình duyệt: giấu domain backend,
// và giới hạn tốc độ của Laravel tính theo IP thật của khách qua header.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  try {
    const res = await fetch(`${API_URL}/bookings/lookup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        booking_code: body.booking_code ?? "",
        phone: body.phone ?? "",
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { message: "Không kết nối được hệ thống. Vui lòng thử lại sau ít phút." },
      { status: 503 },
    );
  }
}
