import Gallery from "@/components/pages/Gallery";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({ title: "Khoảnh khắc du khách", path: "/khoanh-khac-du-khach" });

export default function Page() {
  return <Gallery />;
}
