import { goiApiCoToken } from "@/app/lib/auth";

// GET /api/reviews/can-review/[slug] — người đang đăng nhập có được đánh giá
// tour này không. Chưa đăng nhập thì trả về "không được", không phải lỗi.
export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const { ok, data } = await goiApiCoToken(`/reviews/can-review/${slug}`);

    if (!ok) {
      return Response.json({ can_review: false });
    }

    return Response.json(data);
  } catch {
    return Response.json({ can_review: false });
  }
}
