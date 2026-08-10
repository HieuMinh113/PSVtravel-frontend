import Auth from "@/components/pages/Auth";
import { pageMeta } from "@/app/lib/seo";

export const metadata = { ...pageMeta({ title: "Đăng nhập", path: "/dang-nhap" }), robots: { index: false, follow: true } };

export default function Page() {
  return <Auth />;
}
