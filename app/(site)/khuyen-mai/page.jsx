import Promotions from "@/components/pages/Promotions";
import { pageMeta } from "@/app/lib/seo";
import { getPromotions, getSettings, getTours } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Voucher & ưu đãi — kiểm tra voucher, khuyến mãi tour",
  description: "Kiểm tra voucher PSV Travel còn dùng được không (gõ mã hoặc quét QR), xem mệnh giá, hạn dùng và các chương trình giảm giá tour, visa đang áp dụng.",
  path: "/khuyen-mai",
});

export default async function Page() {
  const [items, settings, tours] = await Promise.all([
    getPromotions(),
    getSettings(),
    // Tour chỉ để lấp chỗ khi chưa có ưu đãi — lỗi API thì bỏ khối đó, không bỏ cả trang
    getTours({ featured: true, perPage: 12 }).catch(() => []),
  ]);
  return <Promotions items={items} tours={items.length ? [] : tours} hotline={settings?.hotline || undefined} />;
}
