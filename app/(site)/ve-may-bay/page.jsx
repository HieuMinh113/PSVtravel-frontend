import Flights from "@/components/pages/Flights";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({ title: "Vé máy bay", path: "/ve-may-bay" });

export default function Page() {
  return <Flights />;
}
