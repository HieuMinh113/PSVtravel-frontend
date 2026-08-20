import Home from "@/components/pages/Home";
import { pageMeta } from "@/app/lib/seo";
import { getTours, getBanners, getOrbitImages, getFeaturedReviews } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Đặt tour du lịch trong nước & nước ngoài",
  path: "/",
});

export default async function Page() {
  const [domestic, abroad, banners, orbitImages, reviews] = await Promise.all([
    getTours({ type: "domestic" }),
    getTours({ type: "abroad" }),
    getBanners(),
    getOrbitImages("orbit_home"),
    getFeaturedReviews(),
  ]);

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
      reviews={reviews}
    />
  );
}