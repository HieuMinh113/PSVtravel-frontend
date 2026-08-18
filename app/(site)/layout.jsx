import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import ScrollToTop from "@/components/ScrollToTop";
import { getSettings } from "@/app/lib/api";

export default async function SiteLayout({ children }) {
  const settings = await getSettings();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingContact settings={settings} />
    </>
  );
}