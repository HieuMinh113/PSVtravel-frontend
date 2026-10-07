import { headerIpKhach } from "@/app/lib/ipKhach";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
const MAU_MA = /^HSV-\d{1,10}$/;

// POST /api/visa/tep — gửi MỘT file giấy tờ cho hồ sơ vừa nộp (bước 2).
//
// Gửi từng file thay vì gom một lần: nginx nhận tối đa 20MB mỗi lần gửi, 10 file
// × 10MB thì không lọt. Mỗi file kèm mã hồ sơ + mã tải file backend trả về ở
// bước 1 (chỉ dùng cho đúng hồ sơ đó, trong 2 giờ).
export async function POST(request) {
  const vao = await request.formData().catch(() => null);
  const ma = String(vao?.get("code") || "");
  const tep = vao?.get("file");

  if (!MAU_MA.test(ma) || !(tep instanceof Blob)) {
    return Response.json({ message: "Yêu cầu không hợp lệ." }, { status: 422 });
  }

  const ra = new FormData();
  ra.append("token", String(vao.get("token") || ""));
  ra.append("file", tep, tep.name || "giay-to");

  try {
    const res = await fetch(`${API_URL}/visa-applications/${ma}/files`, {
      method: "POST",
      headers: { ...(await headerIpKhach()), Accept: "application/json" },
      body: ra,
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ message: "Không gửi được file. Vui lòng thử lại." }, { status: 503 });
  }
}
