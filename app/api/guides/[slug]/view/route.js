const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// POST /api/guides/[slug]/view — ghi nhận một lượt đọc bài cẩm nang.
//
// Phải là lời gọi riêng từ trình duyệt, KHÔNG gộp vào lúc dựng trang: trang
// chi tiết cẩm nang được Next dựng sẵn và giữ trong 60 giây, nên đếm lúc dựng
// là đếm số lần dựng lại chứ không phải số người đọc.
export async function POST(request, { params }) {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_URL}/guides/${slug}/view`, {
      method: "POST",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    // Đếm lượt xem hỏng thì im lặng — không đáng để hiện lỗi cho người đang đọc bài
    return Response.json({}, { status: 204 });
  }
}
