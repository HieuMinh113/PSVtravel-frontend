import AboutUs from "@/components/pages/AboutUs";
import { pageMeta } from "@/app/lib/seo";
import { getMoments, getTeamMembers, getAboutImages } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Về chúng tôi",
  description:
    "PSV Travel — doanh nghiệp lữ hành thành lập năm 2017, hơn 300 tuyến tour trong nước và quốc tế, phục vụ hơn 10.000 lượt khách mỗi năm.",
  path: "/ve-chung-toi",
});

export default async function Page() {
  // Ảnh khối "Khoảnh khắc" ưu tiên lấy từ Admin → Nội dung → Hình ảnh Về chúng tôi;
  // thiếu thì dùng Khoảnh Khắc Du Khách. Đội ngũ lấy từ Admin → Đội ngũ.
  const [moments, team, aboutImages] = await Promise.all([
    getMoments(),
    getTeamMembers(),
    getAboutImages(),
  ]);
  return <AboutUs moments={moments} team={team} aboutImages={aboutImages} />;
}
