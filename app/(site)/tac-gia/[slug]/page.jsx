import { notFound } from "next/navigation";
import AuthorDetail from "@/components/pages/AuthorDetail";
import { pageMeta, JsonLd, SITE_URL, ORG_ID, breadcrumbJsonLd, personJsonLd } from "@/app/lib/seo";
import { getAuthor, getAuthors } from "@/app/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const ds = await getAuthors();
  return ds.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getAuthor(slug);
  if (!a) return pageMeta({ title: "Không tìm thấy tác giả", path: `/tac-gia/${slug}` });
  return pageMeta({
    title: `${a.name}${a.position ? ` — ${a.position}` : ""}`,
    description: a.bio || `Các bài cẩm nang du lịch do ${a.name}${a.position ? `, ${a.position}` : ""} tại PSV Travel viết.`,
    path: `/tac-gia/${a.slug}`,
    image: a.photo,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();
  const url = `${SITE_URL}/tac-gia/${author.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url,
          dateModified: author.updatedAt ?? undefined,
          mainEntity: personJsonLd(author),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          publisher: { "@id": ORG_ID },
          // Các bài người này viết — Google nối trang tác giả với từng bài
          hasPart: author.guides.slice(0, 20).map((g) => ({
            "@type": "Article",
            headline: g.title,
            url: `${SITE_URL}/cam-nang/${g.slug}`,
          })),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: SITE_URL },
          { name: "Cẩm nang", url: `${SITE_URL}/cam-nang` },
          { name: author.name, url },
        ])}
      />
      <AuthorDetail author={author} />
    </>
  );
}
