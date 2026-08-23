import Home from "@/components/pages/Home";
import { pageMeta } from "@/app/lib/seo";
import {
  getTours,
  getBanners,
  getOrbitImages,
  getFeaturedReviews,
  getCategories,
} from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Đặt tour du lịch trong nước & nước ngoài",
  path: "/",
});

export default async function Page() {
  const [domestic, abroad, banners, orbitImages, reviews, danhMuc] = await Promise.all([
    getTours({ type: "domestic" }),
    getTours({ type: "abroad" }),
    getBanners(),
    getOrbitImages("orbit_home"),
    getFeaturedReviews(),
    // Điểm đến nổi bật = Danh mục tour trong admin, số tour do máy chủ đếm thật
    getCategories(),
  ]);

  // Gợi ý cho ô tìm kiếm: tên tour + vùng miền/quốc gia của tour thật đang bán
  const goiY = (ds, truong) =>
    [...new Set(ds.flatMap((t) => [t[truong], t.name]).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "vi"))
      .slice(0, 30);

  const upcoming = [...domestic, ...abroad]
    .filter((t) => t.startDate)
    .sort(
      (a, b) =>
        new Date(a.startDate.split("/").reverse().join("-")) -
        new Date(b.startDate.split("/").reverse().join("-"))
    )
    .slice(0, 6);

  return (
    <Home
      upcoming={upcoming}
      banner={banners[0] ?? null}
      orbitImages={orbitImages}
      diemDen={danhMuc.slice(0, 6)}
      goiYTrongNuoc={goiY(domestic, "region")}
      goiYNuocNgoai={goiY(abroad, "country")}
      reviews={reviews}
    />
  );
}