import AboutUs from "@/components/pages/AboutUs";
import { pageMeta } from "@/app/lib/seo";
import { getMoments } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Về chúng tôi",
  description:
    "PSV Travel — doanh nghiệp lữ hành thành lập năm 2017, hơn 300 tuyến tour trong nước và quốc tế, phục vụ hơn 10.000 lượt khách mỗi năm.",
  path: "/ve-chung-toi",
});

export default async function Page() {
  // Ảnh hậu trường lấy từ Admin → Khoảnh Khắc Du Khách, không viết cứng nữa
  const moments = await getMoments();
  return <AboutUs moments={moments} />;
}
