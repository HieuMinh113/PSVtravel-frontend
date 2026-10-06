import { headerIpKhach } from "@/app/lib/ipKhach";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// GET /qr/{id} — đích của mã QR in trên tờ rơi / poster của từng tour.
//
// Mã QR chứa link ngắn cố định này thay vì đường dẫn tour, để:
//  - đổi tên tour (đường dẫn đổi theo) thì ấn phẩm đã in vẫn quét được;
//  - đếm được lượt quét (backend ghi lại, xem trong trang quản trị).
//
// Backend trả về đường dẫn cần tới; lỗi gì cũng đưa khách về trang chủ chứ
// không để họ gặp trang lỗi. Dùng 302 (tạm thời) để trình duyệt KHÔNG nhớ
// đích đến — tour có thể đổi tên hoặc tạm ẩn sau này.
function chuyenToi(duongDan) {
  const dich = typeof duongDan === "string" && duongDan.startsWith("/") && !duongDan.startsWith("//") ? duongDan : "/";
  return new Response(null, {
    status: 302,
    headers: { Location: dich, "Cache-Control": "no-store" },
  });
}

export async function GET(request, { params }) {
  const { id } = await params;
  if (!/^\d{1,10}$/.test(id)) return chuyenToi("/");

  try {
    const res = await fetch(`${API_URL}/qr/${id}`, {
      method: "POST",
      headers: {
        ...(await headerIpKhach()),
        // Để backend phân biệt điện thoại / máy tính và bỏ qua bot xem trước link
        "User-Agent": request.headers.get("user-agent") || "",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    const data = await res.json().catch(() => ({}));
    return chuyenToi(data?.url);
  } catch {
    return chuyenToi("/");
  }
}
