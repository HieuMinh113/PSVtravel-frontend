const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// GET /api/visa/checklist — danh sách giấy tờ theo nước + mục đích + đối tượng,
// để form nộp hồ sơ hiện ô tải file cho từng giấy tờ.
export async function GET(request) {
  const vao = new URL(request.url).searchParams;
  const ra = new URLSearchParams();
  for (const k of ["visa_country", "purpose", "profile"]) {
    const v = vao.get(k);
    if (v && /^[a-z0-9_-]{1,100}$/.test(v)) ra.set(k, v);
  }

  try {
    const res = await fetch(`${API_URL}/visa-applications/checklist?${ra}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ data: { items: [] } }, { status: 503 });
  }
}
