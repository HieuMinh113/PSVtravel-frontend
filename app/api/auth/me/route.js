import { layNguoiDung } from "@/app/lib/auth";

// GET /api/auth/me — trả thông tin người đang đăng nhập, hoặc null.
//
// Vì sao gọi từ trình duyệt chứ không đọc thẳng trong layout phía server:
// đọc cookie trong layout sẽ biến TOÀN BỘ trang con thành render động, mất
// hết phần dựng sẵn (SSG) của trang tour — trang sẽ chậm hẳn đi.
// Trạng thái đăng nhập vốn khác nhau theo từng người nên không dựng sẵn được,
// tách riêng ra đây là hợp lý.
export async function GET() {
  const user = await layNguoiDung();
  return Response.json({ user });
}
