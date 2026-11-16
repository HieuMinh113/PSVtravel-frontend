import Faqs from "@/components/pages/Faqs";
import { pageMeta, JsonLd } from "@/app/lib/seo";
import { getFaqs } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Câu hỏi thường gặp",
  description: "Giải đáp các thắc mắc thường gặp tại PSV Travel: cách đặt tour, thanh toán, đổi huỷ tour và thủ tục làm visa. Chưa thấy câu trả lời? Gọi hotline 0907 870 707.",
  path: "/cau-hoi-thuong-gap",
});

export default async function Page() {
  const items = await getFaqs();

  // Structured data cho Google (rich result FAQ)
  const jsonLd = items.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <Faqs items={items} />
    </>
  );
}
