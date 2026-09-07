import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import DomesticTours from "@/components/pages/DomesticTours";
import { pageMeta } from "@/app/lib/seo";
import { getTours, getOrbitImages, getCategories } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Tour trong nước",
  description: "Tour du lịch trong nước từ Bắc chí Nam: Hạ Long, Sa Pa, Đà Nẵng, Phú Quốc… Giá trọn gói minh bạch.",
  path: "/tour-trong-nuoc",
});

export default async function Page() {
  const [tours, orbitImages, danhMuc] = await Promise.all([
    getTours({ type: "domestic" }),
    getOrbitImages("orbit_domestic"),
    getCategories("domestic"),
  ]);

  // Chưa upload ảnh vòng xoay thì lấy tạm ảnh bìa tour đang bán
  const anhVongXoay = orbitImages.length
    ? orbitImages
    : tours.length
    ? Array.from({ length: 10 }, (_, i) => tours[i % tours.length].image)
    : [];

  return (
    <div>
      {/* Hero render PHÍA MÁY CHỦ, ngoài Suspense — H1 luôn nằm trong HTML dựng
          sẵn. Đoạn giới thiệu chứa từ khoá đặt ở CUỐI trang (sau lưới tour) để
          khách thấy tour trước; Google vẫn đọc cả trang nên SEO không đổi. */}
      <PageHero
        eyebrow="Tour trong nước"
        title="Khám phá Việt Nam từ Bắc chí Nam"
        description="Từ vịnh Hạ Long kỳ vĩ đến đảo Ngọc Phú Quốc rực nắng — mỗi vùng đất đều mang một câu chuyện riêng."
        crumbs={[{ label: "Tour trong nước" }]}
        orbitImages={anhVongXoay}
      />

      <Suspense fallback={null}>
        <DomesticTours tours={tours} danhMuc={danhMuc} />
      </Suspense>

      <section className="border-t border-ocean-50 bg-foam py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionReveal className="prose-psv text-ink-muted">
            <h2>Tour du lịch trong nước trọn gói, khởi hành từ TP. Hồ Chí Minh</h2>
            <p>
              PSV Travel tổ chức <strong>tour trong nước</strong> tới hầu hết các điểm đến nổi bật
              của Việt Nam: vịnh <strong>Hạ Long</strong>, <strong>Sa Pa</strong> – Fansipan,
              <strong> Đà Nẵng</strong> – Hội An, biển <strong>Nha Trang</strong>, đảo Ngọc
              <strong> Phú Quốc</strong> cùng nhiều hành trình miền Tây, Tây Nguyên, Đông Bắc. Mỗi
              tour đều có lịch trình chi tiết theo ngày, ảnh thực tế và ngày khởi hành rõ ràng để
              bạn dễ chọn.
            </p>
            <p>
              Giá tour trong nước phổ biến từ khoảng vài triệu đến trên mười triệu đồng mỗi khách,
              <strong> trọn gói minh bạch</strong> — thường đã gồm vé máy bay hoặc xe, khách sạn theo
              tiêu chuẩn tour, các bữa ăn chính, hướng dẫn viên và bảo hiểm du lịch. Chọn điểm đến
              bên dưới, hoặc gọi <strong>0907 870 707</strong> để được tư vấn hành trình phù hợp nhất.
            </p>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
