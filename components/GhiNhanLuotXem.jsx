"use client";
import { useEffect } from "react";

/**
 * Báo cho máy chủ biết bài viết vừa được một người thật mở ra.
 *
 * Không hiển thị gì. Phải chạy ở trình duyệt vì trang chi tiết cẩm nang được
 * Next dựng sẵn và giữ trong 60 giây — đếm ở phía máy chủ lúc dựng trang thì
 * ba người đọc trong cùng một phút chỉ ghi nhận được một lượt.
 */
export default function GhiNhanLuotXem({ slug }) {
  useEffect(() => {
    if (!slug) return;

    // Ping một lần cho mỗi lần mở trang. Máy chủ tự lọc trùng theo IP trong
    // một giờ nên bấm F5 liên tục cũng không thổi phồng được con số.
    const bo = new AbortController();

    fetch(`/api/guides/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      signal: bo.signal,
    }).catch(() => {
      // Đếm lượt xem hỏng không phải việc của người đang đọc bài — im lặng bỏ qua
    });

    return () => bo.abort();
  }, [slug]);

  return null;
}
