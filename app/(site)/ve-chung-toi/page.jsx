import AboutUs from "@/components/pages/AboutUs";
import { pageMeta, NAM_THANH_LAP } from "@/app/lib/seo";
import { getMoments, getTeamMembers, getAboutImages, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Về chúng tôi",
  description:
    `PSV Travel — doanh nghiệp lữ hành hoạt động từ năm ${NAM_THANH_LAP}, hơn 300 tuyến tour trong nước và quốc tế, phục vụ hơn 10.000 lượt khách mỗi năm.`,
  path: "/ve-chung-toi",
});

export default async function Page() {
  // Ảnh khối "Khoảnh khắc" ưu tiên lấy từ Admin → Nội dung → Hình ảnh Về chúng tôi;
  // thiếu thì dùng Khoảnh Khắc Du Khách. Đội ngũ lấy từ Admin → Đội ngũ.
  // Video giới thiệu lấy từ Admin → Cài đặt → "Video trang Về chúng tôi".
  const [moments, team, aboutImages, settings] = await Promise.all([
    getMoments(),
    getTeamMembers(),
    getAboutImages(),
    getSettings(),
  ]);
  return (
    <AboutUs
      moments={moments}
      team={team}
      aboutImages={aboutImages}
      videoGioiThieu={settings?.about_video_url ?? null}
      tieuDeVideo={settings?.about_video_title ?? null}
    />
  );
}
