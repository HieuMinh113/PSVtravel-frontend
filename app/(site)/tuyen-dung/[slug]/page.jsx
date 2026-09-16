import { notFound } from "next/navigation";
import CareerDetail from "@/components/pages/CareerDetail";
import { pageMeta } from "@/app/lib/seo";
import { getJobBySlug, getJobSlugs } from "@/app/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const j = await getJobBySlug(slug);
  if (!j) return pageMeta({ title: "Không tìm thấy tin tuyển dụng", path: `/tuyen-dung/${slug}` });
  return pageMeta({
    title: `Tuyển dụng: ${j.title}`,
    description: `PSV Travel tuyển dụng ${j.title}${j.location ? ` tại ${j.location}` : ""}.`,
    path: `/tuyen-dung/${j.slug}`,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const j = await getJobBySlug(slug);
  if (!j) notFound();
  return <CareerDetail job={j} />;
}
