import Guides from "@/components/pages/Guides";
import { pageMeta } from "@/app/lib/seo";
import { getGuides } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({ title: "Cẩm nang du lịch", path: "/cam-nang" });

export default async function Page() {
  const guides = await getGuides();
  return <Guides guides={guides} />;
}