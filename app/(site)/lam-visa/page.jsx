import Visa from "@/components/pages/Visa";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({ title: "Làm visa", path: "/lam-visa" });

export default function Page() {
  return <Visa />;
}
