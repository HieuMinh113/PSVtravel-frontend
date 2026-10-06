import Link from "next/link";
import { formatVND } from "@/app/lib/seo";

// Đoạn giới thiệu bằng chữ ở cuối các trang chính (trang chủ, danh sách tour,
// vé máy bay, visa).
//
// Vì sao có: công cụ audit SEO báo trang "ít chữ" (thin content) và tỉ lệ chữ
// trên mã HTML thấp — các trang này chủ yếu là thẻ tour, ảnh, nút bấm. Một đoạn
// viết thật về dịch vụ giúp Google (và các công cụ AI) hiểu trang nói về gì,
// đồng thời có link nội bộ sang các trang liên quan.
//
// Nội dung chỉ dựa trên thông tin CÓ THẬT trên website (pháp nhân, giấy phép,
// dịch vụ, danh mục/giá tour lấy từ admin) — không thêm con số tự nghĩ ra.
//
// Component máy chủ, không hiệu ứng: chữ có ngay trong HTML và luôn hiển thị.
export default function DoanGioiThieu({ tieuDe, children }) {
  return (
    <section className="border-t border-ocean-50 bg-foam py-14 sm:py-16">
      <div className="prose-psv mx-auto max-w-3xl px-5 text-ink-muted sm:px-8">
        <h2>{tieuDe}</h2>
        {children}
      </div>
    </section>
  );
}

// "Đà Nẵng, Phú Quốc và Hạ Long" — nối danh sách theo kiểu tiếng Việt.
export function noiDanhSach(ds) {
  const a = ds.filter(Boolean);
  if (a.length <= 1) return a.join("");
  return `${a.slice(0, -1).join(", ")} và ${a[a.length - 1]}`;
}

// Câu tóm tắt TỰ ĐỘNG cho trang danh sách tour: số tour đang bán, khoảng giá,
// các điểm đến kèm số tour — lấy thẳng từ dữ liệu admin nên luôn đúng và mỗi
// trang một nội dung riêng (không trùng lặp giữa trang trong nước / nước ngoài).
// API trả tối đa 50 tour mỗi lần: chạm mốc đó thì ghi "hơn 50" thay vì đếm sai.
export function TomTatTour({ tours = [], danhMuc = [], loai, basePath }) {
  if (!tours.length) return null;
  const gia = tours.map((t) => Number(t.price)).filter((n) => n > 0);
  const dm = danhMuc
    .filter((d) => d.tourCount > 0)
    .sort((a, b) => b.tourCount - a.tourCount)
    .slice(0, 10);
  const soTour = tours.length >= 50 ? "hơn 50" : String(tours.length);

  return (
    <p>
      Hiện PSV Travel đang mở bán <strong>{soTour} {loai}</strong>
      {gia.length > 0 ? (
        <>
          , giá trọn gói từ <strong>{formatVND(Math.min(...gia))}</strong>
          {Math.max(...gia) > Math.min(...gia) ? <> đến {formatVND(Math.max(...gia))}</> : null} mỗi
          khách
        </>
      ) : null}
      {dm.length > 0 ? (
        <>
          . Các điểm đến đang có tour:{" "}
          {dm.map((d, i) => (
            <span key={d.slug}>
              {i > 0 ? ", " : ""}
              <Link href={`${basePath}?category=${encodeURIComponent(d.slug)}&scroll=1`}>{d.name}</Link> ({d.tourCount} tour)
            </span>
          ))}
        </>
      ) : null}
      .
    </p>
  );
}
