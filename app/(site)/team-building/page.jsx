import TeamBuilding from "@/components/pages/TeamBuilding";
import { pageMeta, serviceJsonLd, faqJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getEvents, getSettings, getFaqs } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  // Nhắm cả "team building" lẫn "du lịch công ty" — hai cách doanh nghiệp tìm cùng một dịch vụ
  title: "Team Building & Du lịch công ty trọn gói",
  description:
    "PSV Travel tổ chức du lịch công ty (company trip), team building, gala dinner, sự kiện doanh nghiệp trọn gói toàn quốc. Kịch bản riêng, báo giá minh bạch.",
  path: "/team-building",
});

export default async function Page() {
  const [events, settings, faqs] = await Promise.all([getEvents(), getSettings(), getFaqs()]);
  // Hỏi đáp nhóm "Doanh nghiệp / Team building" trong admin (chỉ câu đang hiển thị)
  const hoiDap = faqs.filter((f) => f.category === "doanh-nghiep");

  const schema = serviceJsonLd({
    name: "Tổ chức du lịch công ty, team building & sự kiện doanh nghiệp",
    serviceType: "Event planning",
    url: `${SITE_URL}/team-building`,
    description:
      "Dịch vụ tổ chức du lịch công ty (company trip), team building, gala dinner và sự kiện doanh nghiệp trọn gói — từ kịch bản, hậu cần đến hình ảnh.",
  });

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={faqJsonLd(hoiDap.map((f) => ({ q: f.question, a: f.answer })))} />
      <TeamBuilding events={events} settings={settings} faqs={hoiDap} />
    </>
  );
}
