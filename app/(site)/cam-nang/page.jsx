import Guides from "@/components/pages/Guides";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({ title: "Cẩm nang du lịch", path: "/cam-nang" });

export default function Page() {
  return <Guides />;
}
