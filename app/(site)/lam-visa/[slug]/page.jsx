import { notFound } from "next/navigation";
import VisaDetail from "@/components/pages/VisaDetail";
import { pageMeta } from "@/app/lib/seo";
import { getVisaCountry, getVisaSlugs, getVisaCountries, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getVisaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const visa = await getVisaCountry(slug);
  if (!visa) return pageMeta({ title: "Dịch vụ visa", path: `/lam-visa/${slug}` });
  return pageMeta({
    title: `Visa ${visa.name} — Dịch vụ làm visa ${visa.typeLabel.toLowerCase()}`,
    description: `Dịch vụ làm visa ${visa.name} trọn gói tại PSV Travel: phí từ ${visa.price}, thời gian xử lý ${visa.time || "linh hoạt"}${visa.rate ? `, tỷ lệ đậu ${visa.rate}` : ""}. Tư vấn hồ sơ miễn phí.`,
    path: `/lam-visa/${slug}`,
    image: visa.flagImage || undefined,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const [visa, all, settings] = await Promise.all([
    getVisaCountry(slug),
    getVisaCountries(),
    getSettings(),
  ]);
  if (!visa) notFound();

  // Vài quốc gia khác cho khối cuối trang (bỏ chính nó ra)
  const related = all.filter((c) => c.slug !== visa.slug).slice(0, 6);

  return <VisaDetail visa={visa} related={related} settings={settings} />;
}
