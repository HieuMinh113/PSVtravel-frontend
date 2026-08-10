import Home from "@/components/pages/Home";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({
  title: "Đặt tour du lịch trong nước & nước ngoài",
  path: "/",
});

export default function Page() {
  return <Home />;
}
