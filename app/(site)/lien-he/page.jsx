import Contact from "@/components/pages/Contact";
import { pageMeta } from "@/app/lib/seo";
import { getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({ title: "Liên hệ", path: "/lien-he" });

export default async function Page() {
  const settings = await getSettings();
  return <Contact settings={settings} />;
}