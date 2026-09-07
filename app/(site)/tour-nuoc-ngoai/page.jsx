import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import AbroadTours from "@/components/pages/AbroadTours";
import { pageMeta } from "@/app/lib/seo";
import { getTours, getOrbitImages, getCategories } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Tour nước ngoài",
  description: "Tour nước ngoài: Thái Lan, Hàn Quốc, Nhật Bản, Singapore… Trọn gói vé máy bay, khách sạn, hỗ trợ visa.",
  path: "/tour-nuoc-ngoai",
});

export default async function Page() {
  const [tours, orbitImages, danhMuc] = await Promise.all([
    getTours({ type: "abroad" }),
    getOrbitImages("orbit_abroad"),
    getCategories("abroad"),
  ]);

  const anhVongXoay = orbitImages.length
    ? orbitImages
    : tours.length
    ? Array.from({ length: 10 }, (_, i) => tours[i % tours.length].image)
    : [];

  return (
    <div>
      {/* Hero render phía máy chủ, ngoài Suspense. Đoạn giới thiệu từ khoá đặt
          ở cuối trang — xem ghi chú ở trang tour-trong-nuoc. */}
      <PageHero
        eyebrow="Tour nước ngoài"
        title="Những chân trời mới đang chờ đón"
        description="Thái Lan sôi động, Hàn Quốc lãng mạn, Nhật Bản tinh tế — chọn điểm đến, chúng tôi lo phần còn lại."
        crumbs={[{ label: "Tour nước ngoài" }]}
        orbitImages={anhVongXoay}
      />

      <Suspense fallback={null}>
        <AbroadTours tours={tours} danhMuc={danhMuc} />
      </Suspense>

      <section className="border-t border-ocean-50 bg-foam py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionReveal className="prose-psv text-ink-muted">
            <h2>Tour du lịch nước ngoài, bay thẳng, hỗ trợ trọn gói thủ tục visa</h2>
            <p>
              PSV Travel là công ty lữ hành quốc tế, chuyên <strong>tour nước ngoài</strong> tới
              <strong> Thái Lan</strong>, <strong>Hàn Quốc</strong>, <strong>Nhật Bản</strong>,
              <strong> Singapore</strong> – Malaysia, Trung Quốc, Dubai và các tuyến
              <strong> châu Âu</strong>. Mỗi hành trình được thiết kế với lịch bay thuận tiện, khách
              sạn tốt, hướng dẫn viên tiếng Việt và lịch trình tham quan rõ ràng theo từng ngày.
            </p>
            <p>
              Đội ngũ của chúng tôi <strong>hỗ trợ trọn gói thủ tục xin visa</strong> cho tour nước
              ngoài, tư vấn giấy tờ và chuẩn bị hồ sơ để bạn yên tâm trước chuyến đi. Giá tour đã bao
              gồm những dịch vụ chính, công khai minh bạch. Chọn điểm đến bên dưới, hoặc gọi
              <strong> 0907 870 707</strong> để được tư vấn tuyến phù hợp và mùa đẹp nhất để đi.
            </p>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
