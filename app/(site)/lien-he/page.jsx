import Contact from "@/components/pages/Contact";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({ title: "Liên hệ", path: "/lien-he" });

export default function Page() {
  return <Contact />;
}
