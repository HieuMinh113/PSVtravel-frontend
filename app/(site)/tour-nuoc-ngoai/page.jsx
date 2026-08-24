import { Suspense } from "react";
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
    // Nút lọc = Danh Mục Tour trong admin, cùng nguồn với mega menu
    getCategories("abroad"),
  ]);
  return (
    <Suspense fallback={null}>
      <AbroadTours tours={tours} orbitImages={orbitImages} danhMuc={danhMuc} />
    </Suspense>
  );
}