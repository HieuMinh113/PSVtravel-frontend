import { layToken } from "@/app/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// POST /api/bookings — đặt tour.
//
// Bắt buộc đi vòng qua đây thay vì gọi thẳng Laravel từ trình duyệt: token
// nằm trong cookie httpOnly của localhost:3000, JavaScript không đọc được và
// trình duyệt cũng không gửi kèm sang localhost:8000 (khác origin). Gọi thẳng
// thì backend luôn thấy khách vãng lai, đơn lưu với user_id rỗng, và mục
// "Tour đã đặt của tôi" vĩnh viễn trống dù khách đã đăng nhập.
//
// Chưa đăng nhập vẫn đặt được bình thường — chỉ là đơn không gắn tài khoản.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const token = await layToken();

  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Chuyển tiếp IP thật để giới hạn tần suất của Laravel đếm đúng người,
        // không đếm nhầm thành máy chủ Next.js
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { message: "Không kết nối được hệ thống đặt tour. Vui lòng gọi hotline để được hỗ trợ." },
      { status: 503 },
    );
  }
}
