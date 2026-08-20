import { Suspense } from "react";
import DomesticTours from "@/components/pages/DomesticTours";
import { pageMeta } from "@/app/lib/seo";
import { getTours, getOrbitImages } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Tour trong nước",
  description: "Tour du lịch trong nước từ Bắc chí Nam: Hạ Long, Sa Pa, Đà Nẵng, Phú Quốc… Giá trọn gói minh bạch.",
  path: "/tour-trong-nuoc",
});

export default async function Page() {
  const [tours, orbitImages] = await Promise.all([
    getTours({ type: "domestic" }),
    getOrbitImages("orbit_domestic"),
  ]);
  return (
    <Suspense fallback={null}>
      <DomesticTours tours={tours} orbitImages={orbitImages} />
    </Suspense>
  );
}