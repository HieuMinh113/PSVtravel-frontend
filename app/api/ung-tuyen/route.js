import { headerIpKhach } from "@/app/lib/ipKhach";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
const MAU_SLUG = /^[a-z0-9-]{1,200}$/;
const O_CHU = ["full_name", "phone", "email", "message", "portfolio_url", "dong_y", "website"];

// POST /api/ung-tuyen — ứng viên gửi hồ sơ từ trang chi tiết tin tuyển dụng:
// thông tin liên hệ + CV (PDF) + portfolio (PDF, không bắt buộc), một lần gửi.
// Đi vòng qua đây như các form khác để kèm IP thật của khách (giới hạn số lần
// gửi tính đúng từng người). Kiểm tra kỹ file (đúng PDF, dung lượng) ở Laravel.
export async function POST(request) {
  const vao = await request.formData().catch(() => null);
  const slug = String(vao?.get("slug") || "");
  const cv = vao?.get("cv");

  if (!MAU_SLUG.test(slug) || !(cv instanceof Blob)) {
    return Response.json({ message: "Vui lòng đính kèm CV (PDF)." }, { status: 422 });
  }

  const ra = new FormData();
  for (const k of O_CHU) ra.append(k, String(vao.get(k) ?? ""));
  ra.append("cv", cv, cv.name || "CV.pdf");
  const portfolio = vao.get("portfolio");
  if (portfolio instanceof Blob && portfolio.size > 0) ra.append("portfolio", portfolio, portfolio.name || "Portfolio.pdf");

  try {
    const res = await fetch(`${API_URL}/jobs/${slug}/apply`, {
      method: "POST",
      headers: { ...(await headerIpKhach()), Accept: "application/json" },
      body: ra,
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { message: "Không gửi được hồ sơ lúc này. Vui lòng thử lại hoặc gọi hotline." },
      { status: 503 },
    );
  }
}
