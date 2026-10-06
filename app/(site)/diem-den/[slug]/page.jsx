import { notFound } from "next/navigation";
import DestinationDetail from "@/components/pages/DestinationDetail";
import { pageMeta } from "@/app/lib/seo";
import { getDestinationBySlug, getDestinationSlugs, getTours } from "@/app/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) return pageMeta({ title: "Không tìm thấy điểm đến", path: `/diem-den/${slug}` });
  return pageMeta({
    title: d.name,
    description: d.summary || `Khám phá ${d.name} cùng PSV Travel — giới thiệu chi tiết và tour đang mở.`,
    path: `/diem-den/${d.slug}`,
    image: d.image,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) notFound();

  // Tour liên quan lấy theo danh mục admin gắn cho điểm đến (nếu có).
  const tours = d.category_slug ? await getTours({ category: d.category_slug, perPage: 6 }) : [];

  return <DestinationDetail destination={d} tours={tours} />;
}
