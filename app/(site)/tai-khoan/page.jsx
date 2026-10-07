import { redirect } from "next/navigation";
import { goiApiCoToken, layNguoiDung } from "@/app/lib/auth";
import AccountClient from "@/components/pages/AccountClient";

// Trang cá nhân: mỗi người thấy dữ liệu khác nhau nên không dựng sẵn được
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tài khoản của tôi", // đuôi " | PSV Travel" do template ở layout gốc tự thêm
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  const user = await layNguoiDung();
  if (!user) redirect("/dang-nhap");

  const { tab } = await searchParams;

  // Lấy lịch sử đơn + hồ sơ visa ngay ở server để trang hiện ra là có dữ liệu luôn
  const [{ ok, data }, visa] = await Promise.all([
    goiApiCoToken("/auth/bookings?per_page=20"),
    goiApiCoToken("/auth/visa-cases"),
  ]);

  return (
    <AccountClient
      user={user}
      donBanDau={ok ? data?.data ?? [] : []}
      loiTaiDon={!ok}
      hoSoVisa={visa.ok ? visa.data?.data ?? [] : []}
      loiTaiVisa={!visa.ok}
      tabBanDau={["ho-so", "visa"].includes(tab) ? tab : "don-hang"}
    />
  );
}
