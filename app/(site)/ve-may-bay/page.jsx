import Flights from "@/components/pages/Flights";
import { pageMeta } from "@/app/lib/seo";
import { getAirlines, getFlightDeals } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({ title: "Vé máy bay", path: "/ve-may-bay" });

export default async function Page() {
  const [airlines, deals] = await Promise.all([getAirlines(), getFlightDeals()]);
  return <Flights airlines={airlines} deals={deals} />;
}