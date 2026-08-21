// Khung xương trang chi tiết tour — dựng theo đúng bố cục thật (ảnh lớn,
// cột nội dung, khối đặt tour bên phải) để lúc dữ liệu về không bị nhảy layout.
export default function TourDetailSkeleton() {
  return (
    <div className="min-h-svh bg-foam" role="status" aria-live="polite">
      <span className="sr-only">Đang tải thông tin tour…</span>

      {/* Ảnh lớn đầu trang */}
      <div className="h-[42vh] min-h-[280px] w-full animate-pulse bg-deep-900/80" />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          {/* Cột nội dung */}
          <div className="space-y-6">
            <div className="h-8 w-3/4 animate-pulse rounded-xl bg-ocean-100/70" />
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-ocean-100/60" />
              ))}
            </div>
            <div className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-ocean-100/50" />
              ))}
            </div>
          </div>

          {/* Khối đặt tour */}
          <div className="h-fit space-y-4 rounded-2xl bg-white p-5 shadow-card lg:sticky lg:top-28">
            <div className="h-7 w-2/3 animate-pulse rounded-lg bg-ocean-100/70" />
            <div className="h-11 animate-pulse rounded-xl bg-ocean-100/50" />
            <div className="h-11 animate-pulse rounded-xl bg-ocean-100/50" />
            <div className="h-12 animate-pulse rounded-full bg-sunset-200/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
