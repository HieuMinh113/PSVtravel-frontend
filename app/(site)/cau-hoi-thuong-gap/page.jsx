import Faqs from "@/components/pages/Faqs";
import { pageMeta, JsonLd } from "@/app/lib/seo";
import { getFaqs } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Câu hỏi thường gặp",
  description: "Giải đáp các thắc mắc về đặt tour, thanh toán, đổi huỷ và thủ tục visa tại PSV Travel.",
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
