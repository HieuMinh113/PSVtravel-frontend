import { notFound } from "next/navigation";
import GuideDetail from "@/components/pages/GuideDetail";
import { pageMeta, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getGuideBySlug, getGuideSlugs } from "@/app/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return pageMeta({ title: "Không tìm thấy bài viết", path: `/cam-nang/${slug}` });
  return pageMeta({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/cam-nang/${guide.slug}`,
    image: guide.image,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    image: guide.image,
    author: { "@type": "Organization", name: guide.author || "PSV Travel" },
    datePublished: guide.date ? guide.date.split("/").reverse().join("-") : undefined,
    mainEntityOfPage: `${SITE_URL}/cam-nang/${guide.slug}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <GuideDetail guide={guide} />
    </>
  );
}