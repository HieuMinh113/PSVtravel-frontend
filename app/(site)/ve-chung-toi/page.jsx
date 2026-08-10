import AboutUs from "@/components/pages/AboutUs";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({ title: "Về chúng tôi", path: "/ve-chung-toi" });

export default function Page() {
  return <AboutUs />;
}
