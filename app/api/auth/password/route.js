import { goiApiCoToken } from "@/app/lib/auth";

// PUT /api/auth/password — đổi mật khẩu.
// Backend thu hồi toàn bộ token cũ sau khi đổi, nên người dùng phải đăng nhập lại.
export async function PUT(request) {
  const body = await request.json().catch(() => ({}));

  try {
    const { ok, status, data } = await goiApiCoToken("/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!ok) {
      return Response.json(data ?? { message: "Đổi mật khẩu thất bại." }, {
        status: status || 400,
      });
    }

    return Response.json(data);
  } catch {
    return Response.json(
      { message: "Không kết nối được máy chủ. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
