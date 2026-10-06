import Destinations from "@/components/pages/Destinations";
import { pageMeta } from "@/app/lib/seo";
import { getDestinations } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Điểm đến nổi bật",
  description: "Khám phá các điểm đến du lịch trong nước và quốc tế cùng PSV Travel — giới thiệu chi tiết và tour đang mở.",
  path: "/diem-den",
});

export default async function Page() {
  const items = await getDestinations();
  return <Destinations items={items} />;
}
