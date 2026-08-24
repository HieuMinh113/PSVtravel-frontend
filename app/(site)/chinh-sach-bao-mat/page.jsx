import TrangTinh from "@/components/pages/TrangTinh";
import { pageMeta } from "@/app/lib/seo";
import { getPage, getSettings } from "@/app/lib/api";

// Trước đây trang này dùng một component có sẵn 6 mục chính sách viết cứng
// trong code. Ba trang pháp lý còn lại đều do admin nhập, riêng trang này thì
// không — bộ phận pháp chế soạn xong không đăng được nếu không sửa mã nguồn.
// Nội dung cũ vẫn nằm trong lịch sử git nếu cần tham khảo lại.
const SLUG = "privacy-policy";
const TIEU_DE = "Chính sách bảo mật";
const MO_TA = "Cách PSV Travel thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng.";

export const revalidate = 60;

export async function generateMetadata() {
  const page = await getPage(SLUG);
  return pageMeta({
    title: page?.metaTitle || TIEU_DE,
    description: page?.metaDescription || MO_TA,
    path: "/chinh-sach-bao-mat",
  });
}

export default async function Page() {
  const [page, settings] = await Promise.all([getPage(SLUG), getSettings()]);

  return (
    <TrangTinh
      page={page}
      tieuDe={TIEU_DE}
      moTa={MO_TA}
      hotline={settings.hotline || "0907 870 707"}
    />
  );
}
