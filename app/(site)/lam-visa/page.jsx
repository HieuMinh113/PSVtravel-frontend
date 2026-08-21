import Visa from "@/components/pages/Visa";
import { pageMeta } from "@/app/lib/seo";
import { getVisaCountries, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({ title: "Làm visa", path: "/lam-visa" });

export default async function Page() {
  const [countries, settings] = await Promise.all([
    getVisaCountries(),
    getSettings(),
  ]);
  return <Visa countries={countries} settings={settings} />;
}