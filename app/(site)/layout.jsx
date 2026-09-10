import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import ScrollToTop from "@/components/ScrollToTop";
import PromoPopup from "@/components/PromoPopup";
import { getSettings, getCategories, getBanners } from "@/app/lib/api";

export default async function SiteLayout({ children }) {
  // Mega menu lấy thẳng từ Danh Mục Tour trong admin: mỗi danh mục có tên,
  // ảnh riêng và thứ tự do admin sắp.
  //
  // Trước đây menu suy ra từ ô "Vùng / khu vực" gõ tay của từng tour, nên gõ
  // lệch một chữ ("Hàn quốc" / "Hàn Quốc") là menu mọc ra hai mục riêng, bấm
  // vào mỗi mục chỉ ra một nửa số tour mà không ai phát hiện được. Giờ tour
  // được gán vào danh mục bằng ô chọn có sẵn nên không thể sai.
  //
  // Đổi luôn được hai lượt tải toàn bộ tour ở mọi trang thành hai lượt tải
  // danh mục — nhẹ hơn hẳn.
  const [settings, dmTrongNuoc, dmNuocNgoai, popups] = await Promise.all([
    getSettings(),
    getCategories("domestic"),
    getCategories("abroad"),
    getBanners("popup"),
  ]);

  // Poster popup: lấy cái đầu tiên đang bật (sắp theo thứ tự trong admin)
  const poster = Array.isArray(popups) && popups.length ? popups[0] : null;

  return (
    <>
      <ScrollToTop />
      <Navbar settings={settings} dmTrongNuoc={dmTrongNuoc} dmNuocNgoai={dmNuocNgoai} />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingContact settings={settings} />
      {poster && <PromoPopup poster={poster} />}
    </>
  );
}
