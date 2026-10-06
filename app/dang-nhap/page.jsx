import Auth from "@/components/pages/Auth";
import { pageMeta } from "@/app/lib/seo";

export const metadata = { ...pageMeta({
  title: "Đăng nhập",
  description:
    "Đăng nhập hoặc tạo tài khoản PSV Travel để xem lại các đơn đặt tour và theo dõi trạng thái giữ chỗ của bạn ở cùng một nơi.",
  path: "/dang-nhap",
}), robots: { index: false, follow: true } };

export default function Page() {
  return <Auth />;
}
