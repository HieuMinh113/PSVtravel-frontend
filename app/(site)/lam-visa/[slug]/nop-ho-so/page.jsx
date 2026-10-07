import { notFound } from "next/navigation";
import NopHoSoVisa from "@/components/pages/NopHoSoVisa";
import { getVisaCountry, getSettings, getPhieuVisa } from "@/app/lib/api";
import { layNguoiDung } from "@/app/lib/auth";

// Có đăng nhập thì điền sẵn họ tên / SĐT / email — mỗi người khác nhau nên
// không dựng sẵn được.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const visa = await getVisaCountry(slug);
  return {
    title: visa ? `Nộp hồ sơ visa ${visa.name} online` : "Nộp hồ sơ visa online",
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const [visa, settings, user, phieu] = await Promise.all([
    getVisaCountry(slug),
    getSettings(),
    layNguoiDung(),
    getPhieuVisa(),
  ]);
  if (!visa) notFound();

  return <NopHoSoVisa visa={visa} settings={settings} user={user} phieu={phieu} />;
}
