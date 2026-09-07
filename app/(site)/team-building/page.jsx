import TeamBuilding from "@/components/pages/TeamBuilding";
import { pageMeta, serviceJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getEvents, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Team Building & Tổ chức sự kiện doanh nghiệp",
  description:
    "PSV Travel tổ chức trọn gói team building, gala dinner, company trip và sự kiện doanh nghiệp trên toàn quốc. Kịch bản riêng, ê-kíp chuyên nghiệp, báo giá minh bạch.",
  path: "/team-building",
});

export default async function Page() {
  const [events, settings] = await Promise.all([getEvents(), getSettings()]);

  const schema = serviceJsonLd({
    name: "Tổ chức team building & sự kiện doanh nghiệp",
    serviceType: "Event planning",
    url: `${SITE_URL}/team-building`,
    description:
      "Dịch vụ tổ chức team building, gala dinner, company trip và sự kiện doanh nghiệp trọn gói — từ kịch bản, hậu cần đến hình ảnh.",
  });

  return (
    <>
      <JsonLd data={schema} />
      <TeamBuilding events={events} settings={settings} />
    </>
  );
}
