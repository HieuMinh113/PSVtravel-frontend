import { notFound } from "next/navigation";
import CareerDetail from "@/components/pages/CareerDetail";
import { pageMeta, breadcrumbJsonLd, jobPostingJsonLd, JsonLd, SITE_URL, moTaDu } from "@/app/lib/seo";
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
    description: moTaDu(
      [
        `PSV Travel tuyển ${j.title}${j.location ? ` tại ${j.location}` : ""}`,
        j.salary_range && `lương ${j.salary_range}`,
        j.deadline && `hạn nộp ${j.deadline.split("-").reverse().join("/")}`,
      ].filter(Boolean).join(", ") + ".",
      j.description,
    ),
    path: `/tuyen-dung/${j.slug}`,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const j = await getJobBySlug(slug);
  if (!j) notFound();
  const tin = jobPostingJsonLd(j);
  return (
    <>
      {tin && <JsonLd data={tin} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: SITE_URL },
          { name: "Tuyển dụng", url: `${SITE_URL}/tuyen-dung` },
          { name: j.title, url: `${SITE_URL}/tuyen-dung/${j.slug}` },
        ])}
      />
      <CareerDetail job={j} />
    </>
  );
}
