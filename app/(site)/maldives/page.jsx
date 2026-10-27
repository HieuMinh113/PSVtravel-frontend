import Maldives, { MO_TA_MAC_DINH } from "@/components/pages/Maldives";
import { pageMeta, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getMaldivesCombos, getSettings } from "@/app/lib/api";
import { tyGia } from "@/app/lib/maldives";

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSettings();
  return pageMeta({
    title: "Combo du lịch Maldives",
    description: settings?.maldives_gioi_thieu || MO_TA_MAC_DINH,
    path: "/maldives",
  });
}

export default async function Page() {
  const [combos, settings] = await Promise.all([getMaldivesCombos(), getSettings()]);
  const danhSach = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Combo du lịch Maldives",
    itemListElement: combos.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/maldives/${c.slug}`, name: c.name })),
  };
  return (
    <>
      {combos.length > 0 && <JsonLd data={danhSach} />}
      <Maldives combos={combos} gioiThieu={settings?.maldives_gioi_thieu} tg={tyGia(settings)} hotline={settings?.hotline || "0907 870 707"} />
    </>
  );
}
