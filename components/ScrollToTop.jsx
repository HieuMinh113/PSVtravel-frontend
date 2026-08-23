"use client";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Đưa trang về đầu mỗi khi chuyển sang trang khác.
 *
 * Trước đây chỉ theo dõi đường dẫn, nên khi đang ở cuối trang mà bấm sang mục
 * khác thì đôi lúc trình duyệt giữ nguyên vị trí cuộn cũ — người dùng rơi vào
 * giữa trang mới, tưởng trang bị lỗi.
 *
 * Ngoại lệ: đường dẫn có ?scroll=1 là chủ ý nhảy thẳng xuống khu vực kết quả
 * (bấm bộ lọc từ trang chi tiết tour), không được kéo ngược lên đầu.
 */
function CuonLenDau() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nhayXuongKetQua = searchParams.get("scroll");

  useEffect(() => {
    if (nhayXuongKetQua) return;

    // Chờ hết khung hình hiện tại rồi mới cuộn: cuộn ngay lúc này có thể bị
    // chính bước khôi phục vị trí cuộn của trình duyệt ghi đè lên.
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => cancelAnimationFrame(id);
  }, [pathname, nhayXuongKetQua]);

  return null;
}

// useSearchParams bắt buộc nằm trong Suspense, nếu không Next sẽ bỏ render tĩnh
// của mọi trang con — mất SSG toàn site chỉ vì một tiện ích cuộn trang.
export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <CuonLenDau />
    </Suspense>
  );
}
