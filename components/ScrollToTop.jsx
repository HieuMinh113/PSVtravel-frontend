"use client";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Đưa trang về đầu mỗi khi chuyển sang trang khác.
 *
 * Trên điện thoại việc này khó hơn trên máy tính vì ba thứ xảy ra gần như cùng
 * lúc khi bấm một mục trong menu: trang mới bắt đầu dựng, menu hamburger thu
 * lại (mất khoảng nửa giây) làm chiều cao trang đổi, và trình duyệt cố khôi
 * phục vị trí cuộn cũ. Bản trước chỉ cuộn đúng một lần sau một khung hình nên
 * bị hai việc kia ghi đè — đo thực tế: đang ở 974 thì sau khi chuyển trang
 * thành 1383, tức là còn trôi xa hơn.
 *
 * Nên ở đây cuộn vài nhịp trải trong khoảng nửa giây đầu, nhưng dừng ngay khi
 * khách tự cuộn — không giằng tay người dùng.
 *
 * Ngoại lệ: đường dẫn có ?scroll=1 là chủ ý nhảy thẳng xuống khu vực kết quả
 * (bấm bộ lọc từ trang chi tiết tour), không được kéo ngược lên đầu.
 */
function CuonLenDau() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nhayXuongKetQua = searchParams.get("scroll");

  // Tắt cơ chế tự khôi phục vị trí cuộn của trình duyệt — chính nó ghi đè
  // lệnh cuộn của mình khi trang mới dựng xong.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (nhayXuongKetQua) return;

    let khachTuCuon = false;
    const danhDau = () => {
      khachTuCuon = true;
    };
    window.addEventListener("wheel", danhDau, { passive: true });
    window.addEventListener("touchstart", danhDau, { passive: true });
    window.addEventListener("keydown", danhDau);

    const cuon = () => {
      if (!khachTuCuon) window.scrollTo(0, 0);
    };

    cuon();
    const khungHinh = requestAnimationFrame(cuon);
    // 120ms: trang mới vừa dựng xong. 560ms: menu hamburger thu lại xong.
    const hen1 = setTimeout(cuon, 120);
    const hen2 = setTimeout(cuon, 560);

    return () => {
      cancelAnimationFrame(khungHinh);
      clearTimeout(hen1);
      clearTimeout(hen2);
      window.removeEventListener("wheel", danhDau);
      window.removeEventListener("touchstart", danhDau);
      window.removeEventListener("keydown", danhDau);
    };
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
