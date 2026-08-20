import Gallery from "@/components/pages/Gallery";
import { pageMeta } from "@/app/lib/seo";
import { getMoments, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({ title: "Khoảnh khắc du khách", path: "/khoanh-khac-du-khach" });

export default async function Page() {
  const [photos, settings] = await Promise.all([getMoments(), getSettings()]);
  return <Gallery photos={photos} settings={settings} />;
}