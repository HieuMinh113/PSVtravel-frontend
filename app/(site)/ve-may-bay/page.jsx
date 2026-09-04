import Flights from "@/components/pages/Flights";
import { pageMeta, serviceJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getAirlines, getFlightDeals, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({ title: "Vé máy bay", path: "/ve-may-bay" });

export default async function Page() {
  const [airlines, deals, settings] = await Promise.all([
    getAirlines(),
    getFlightDeals(),
    getSettings(),
  ]);
  const schema = serviceJsonLd({
    name: "Đặt vé máy bay trong nước & quốc tế",
    serviceType: "Flight booking",
    url: `${SITE_URL}/ve-may-bay`,
    description: "Đặt vé máy bay nội địa và quốc tế giá tốt, hỗ trợ đổi/hoàn linh hoạt.",
  });
  return (
    <>
      <JsonLd data={schema} />
      <Flights airlines={airlines} deals={deals} settings={settings} />
    </>
  );
}