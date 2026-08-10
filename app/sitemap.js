import { domesticTours, abroadTours } from "@/data/tours";
import { SITE_URL } from "./lib/seo";

export default function sitemap() {
  const staticPaths = [
    "", "/tour-trong-nuoc", "/tour-nuoc-ngoai", "/ve-may-bay",
    "/lam-visa", "/cam-nang", "/khoanh-khac-du-khach", "/ve-chung-toi", "/lien-he", "/chinh-sach-bao-mat",
  ];
  const now = new Date();
  const staticEntries = staticPaths.map((p) => ({
    url: SITE_URL + p,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
  const tourEntries = [
    ...domesticTours.map((t) => ({ base: "/tour-trong-nuoc", t })),
    ...abroadTours.map((t) => ({ base: "/tour-nuoc-ngoai", t })),
  ].map(({ base, t }) => ({
    url: `${SITE_URL}${base}/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...staticEntries, ...tourEntries];
}
