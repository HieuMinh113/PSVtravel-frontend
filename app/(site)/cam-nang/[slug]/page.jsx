import { notFound } from "next/navigation";
import GuideDetail from "@/components/pages/GuideDetail";
import { pageMeta, JsonLd, SITE_URL, ORG_ID, videoJsonLd, breadcrumbJsonLd, personJsonLd } from "@/app/lib/seo";
import { getGuideBySlug, getGuideMap, getGuideSlugs, getSettings } from "@/app/lib/api";

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
  const [guide, settings, banDo] = await Promise.all([getGuideBySlug(slug), getSettings(), getGuideMap()]);
  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    image: guide.image,
    // Có trang tác giả → Person đầy đủ; chỉ có tên → Person theo tên; không có
    // ai → chính công ty. Trước đây khai tên người là "Organization" — sai loại.
    author: guide.authorProfile
      ? personJsonLd(guide.authorProfile)
      : guide.author
        ? { "@type": "Person", name: guide.author }
        : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    datePublished: guide.date ? guide.date.split("/").reverse().join("-") : undefined,
    dateModified: guide.updatedAt ?? undefined,
    mainEntityOfPage: `${SITE_URL}/cam-nang/${guide.slug}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: SITE_URL },
          { name: "Cẩm nang", url: `${SITE_URL}/cam-nang` },
          { name: guide.title, url: `${SITE_URL}/cam-nang/${guide.slug}` },
        ])}
      />
      <JsonLd
        data={videoJsonLd({
          videoId: guide.videoId,
          name: `Video: ${guide.title}`,
          description: guide.excerpt,
          uploadDate: guide.updatedAt,
          url: `${SITE_URL}/cam-nang/${guide.slug}`,
        })}
      />
      <GuideDetail guide={guide} settings={settings} banDo={banDo} />
    </>
  );
}