import { Suspense } from "react";
import DomesticTours from "@/components/pages/DomesticTours";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({
  title: "Tour trong nước",
  description: "Tour du lịch trong nước từ Bắc chí Nam: Hạ Long, Sa Pa, Đà Nẵng, Phú Quốc… Giá trọn gói minh bạch.",
  path: "/tour-trong-nuoc",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DomesticTours />
    </Suspense>
  );
}
