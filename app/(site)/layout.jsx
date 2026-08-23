import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import ScrollToTop from "@/components/ScrollToTop";
import { getSettings, getTours } from "@/app/lib/api";

export default async function SiteLayout({ children }) {
  const [settings, tourTrongNuoc, tourNuocNgoai] = await Promise.all([
    getSettings(),
    getTours({ type: "domestic" }),
    getTours({ type: "abroad" }),
  ]);

  // Mục trong mega menu lấy từ tour thật đang bán, sắp theo bảng chữ cái tiếng Việt
  const sapXep = (ds) =>
    [...new Set(ds.filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"));

  const vungMien = sapXep(tourTrongNuoc.map((t) => t.region));
  const quocGia = sapXep(tourNuocNgoai.map((t) => t.country));
  return (
    <>
      <ScrollToTop />
      <Navbar settings={settings} vungMien={vungMien} quocGia={quocGia} />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingContact settings={settings} />
    </>
  );
}