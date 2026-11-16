import Destinations from "@/components/pages/Destinations";
import { pageMeta } from "@/app/lib/seo";
import { getDestinations } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Điểm đến du lịch trong nước & nước ngoài",
  description: "Khám phá các điểm đến du lịch trong nước và nước ngoài cùng PSV Travel: giới thiệu chi tiết từng nơi và các tour trọn gói đang mở bán cho mỗi điểm đến.",
  path: "/diem-den",
});

export default async function Page() {
  const items = await getDestinations();
  return <Destinations items={items} />;
}
