import { redirect } from "next/navigation";
import { goiApiCoToken, layNguoiDung } from "@/app/lib/auth";
import AccountClient from "@/components/pages/AccountClient";

// Trang cá nhân: mỗi người thấy dữ liệu khác nhau nên không dựng sẵn được
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tài khoản của tôi | PSV Travel",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }) {
  const user = await layNguoiDung();
  if (!user) redirect("/dang-nhap");

  const { tab } = await searchParams;

  // Lấy lịch sử đơn ngay ở server để trang hiện ra là có dữ liệu luôn
  const { ok, data } = await goiApiCoToken("/auth/bookings?per_page=20");

  return (
    <AccountClient
      user={user}
      donBanDau={ok ? data?.data ?? [] : []}
      loiTaiDon={!ok}
      tabBanDau={tab === "ho-so" ? "ho-so" : "don-hang"}
    />
  );
}
