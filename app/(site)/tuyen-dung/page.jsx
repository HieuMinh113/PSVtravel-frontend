import Careers from "@/components/pages/Careers";
import { pageMeta } from "@/app/lib/seo";
import { getJobs } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Tuyển dụng việc làm ngành du lịch tại TP.HCM",
  description: "Cơ hội nghề nghiệp tại PSV Travel, công ty lữ hành quốc tế hoạt động từ 2013: xem các vị trí đang tuyển, mô tả công việc, quyền lợi và ứng tuyển trực tuyến.",
  path: "/tuyen-dung",
});

export default async function Page() {
  const items = await getJobs();
  return <Careers items={items} />;
}
