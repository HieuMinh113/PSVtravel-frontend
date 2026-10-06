import Careers from "@/components/pages/Careers";
import { pageMeta } from "@/app/lib/seo";
import { getJobs } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Tuyển dụng",
  description: "Cơ hội nghề nghiệp tại PSV Travel — các vị trí đang tuyển dụng và cách ứng tuyển.",
  path: "/tuyen-dung",
});

export default async function Page() {
  const items = await getJobs();
  return <Careers items={items} />;
}
