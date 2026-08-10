import Privacy from "@/components/pages/Privacy";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({ title: "Chính sách bảo mật", path: "/chinh-sach-bao-mat" });

export default function Page() {
  return <Privacy />;
}
