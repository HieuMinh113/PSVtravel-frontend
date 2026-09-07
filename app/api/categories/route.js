import { getCategories } from "@/app/lib/api";

// GET /api/categories?type=domestic
//
// Cửa ngõ cùng tên miền cho trình duyệt lấy danh mục. Navbar dùng nó để tự lấy
// lại danh sách khi bản dựng sẵn của layout bị rỗng — xem ghi chú trong
// components/Navbar.jsx.
//
// Gọi qua đây thay vì gọi thẳng api.psvtravel.com để khỏi vướng chặn khác
// nguồn (CORS), và để trình duyệt không phải biết địa chỉ backend.
export async function GET(request) {
  const loai = new URL(request.url).searchParams.get("type");
  const hopLe = loai === "domestic" || loai === "abroad" ? loai : undefined;

  const danhMuc = await getCategories(hopLe);

  return Response.json(danhMuc, {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
