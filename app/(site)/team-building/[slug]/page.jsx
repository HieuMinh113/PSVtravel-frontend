import { notFound } from "next/navigation";
import EventDetail from "@/components/pages/EventDetail";
import { pageMeta, breadcrumbJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getEventBySlug, getEventSlugs, getEvents, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return pageMeta({ title: "Team Building", path: `/team-building/${slug}` });
  return pageMeta({
    title: `${event.title} — Team Building & Sự kiện`,
    description:
      event.summary ||
      `Gói ${event.title} do PSV Travel tổ chức trọn gói cho doanh nghiệp. Tư vấn kịch bản, báo giá minh bạch.`,
    path: `/team-building/${slug}`,
    image: event.image || undefined,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const [event, all, settings] = await Promise.all([
    getEventBySlug(slug),
    getEvents(),
    getSettings(),
  ]);
  if (!event) notFound();

  const related = all.filter((e) => e.slug !== event.slug).slice(0, 3);

  const bc = breadcrumbJsonLd([
    { name: "Trang chủ", url: SITE_URL },
    { name: "Team Building", url: `${SITE_URL}/team-building` },
    { name: event.title, url: `${SITE_URL}/team-building/${event.slug}` },
  ]);

  return (
    <>
      <JsonLd data={bc} />
      <EventDetail event={event} related={related} settings={settings} />
    </>
  );
}
