import Contact from "@/components/pages/Contact";
import { pageMeta } from "@/app/lib/seo";
import { getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Liên hệ",
  description:
    "Liên hệ PSV Travel: 529 Huỳnh Tấn Phát, Quận 7, TP. Hồ Chí Minh. Hotline 0907 870 707 — tư vấn tour, vé máy bay, visa và team building.",
  path: "/lien-he",
});

export default async function Page() {
  const settings = await getSettings();
  return <Contact settings={settings} />;
}