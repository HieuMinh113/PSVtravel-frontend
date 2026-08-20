import { layToken } from "@/app/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// PUT /api/auth/profile — cập nhật hồ sơ.
// Nhận FormData (vì có thể kèm ảnh đại diện) và chuyển thẳng sang Laravel.
// Token lấy từ cookie httpOnly, trình duyệt không bao giờ chạm vào.
export async function PUT(request) {
  const token = await layToken();
  if (!token) {
    return Response.json({ message: "Bạn cần đăng nhập." }, { status: 401 });
  }

  const form = await request.formData();

  // Laravel không đọc PUT multipart, phải gửi POST kèm _method=PUT
  form.append("_method", "PUT");

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      body: form,
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { message: "Không kết nối được máy chủ. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
