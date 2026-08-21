// Khung xương hiện ngay khi chuyển trang, thay cho màn hình đứng im.
//
// Next.js chỉ vẽ file này khi trang đang chờ dữ liệu từ máy chủ. Trước đây
// không có nó nên bấm vào tour xong màn hình đứng yên vài giây, khách không
// biết máy có nhận lệnh hay không và bấm lại nhiều lần.
export default function Loading() {
  return (
    <div className="min-h-svh bg-foam pb-20 pt-32" role="status" aria-live="polite">
      <span className="sr-only">Đang tải nội dung…</span>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Dòng tiêu đề */}
        <div className="h-9 w-2/3 max-w-md animate-pulse rounded-xl bg-ocean-100/70" />
        <div className="mt-3 h-4 w-1/2 max-w-sm animate-pulse rounded-lg bg-ocean-100/50" />

        {/* Lưới thẻ tour */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white shadow-card"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="aspect-[4/3] animate-pulse bg-ocean-100/70" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-4/5 animate-pulse rounded bg-ocean-100/70" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-ocean-100/50" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-ocean-100/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
