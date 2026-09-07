import Visa from "@/components/pages/Visa";
import { pageMeta, serviceJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getVisaCountries, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({ title: "Làm visa", path: "/lam-visa" });

export default async function Page() {
  const [countries, settings] = await Promise.all([
    getVisaCountries(),
    getSettings(),
  ]);
  const schema = serviceJsonLd({
    name: "Dịch vụ làm visa du lịch",
    serviceType: "Visa processing",
    url: `${SITE_URL}/lam-visa`,
    description: "Làm visa du lịch trọn gói, tỷ lệ đậu cao — Hàn Quốc, Nhật Bản, châu Âu và nhiều quốc gia khác.",
  });
  return (
    <>
      <JsonLd data={schema} />
      <Visa countries={countries} settings={settings} />
    </>
  );
}