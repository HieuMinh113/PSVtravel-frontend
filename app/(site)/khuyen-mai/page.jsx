import Promotions from "@/components/pages/Promotions";
import { pageMeta } from "@/app/lib/seo";
import { getPromotions } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Khuyến mãi & Ưu đãi",
  description: "Tổng hợp các chương trình giảm giá tour, vé máy bay và dịch vụ visa mới nhất tại PSV Travel.",
  path: "/khuyen-mai",
});

export default async function Page() {
  const items = await getPromotions();
  return <Promotions items={items} />;
}
