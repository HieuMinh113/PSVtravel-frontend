import { Suspense } from "react";
import AbroadTours from "@/components/pages/AbroadTours";
import { pageMeta } from "@/app/lib/seo";

export const metadata = pageMeta({
  title: "Tour nước ngoài",
  description: "Tour nước ngoài: Thái Lan, Singapore, Hàn Quốc, Nhật Bản… Trọn gói vé máy bay, khách sạn, hướng dẫn viên.",
  path: "/tour-nuoc-ngoai",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AbroadTours />
    </Suspense>
  );
}
