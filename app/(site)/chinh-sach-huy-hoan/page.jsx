import TrangTinh from "@/components/pages/TrangTinh";
import { pageMeta, moTaDu } from "@/app/lib/seo";
import { getPage, getSettings } from "@/app/lib/api";

const SLUG = "cancellation-policy";
const TIEU_DE = "Chính sách huỷ & hoàn tiền";
const MO_TA = "Điều kiện huỷ tour, mức phí và thời gian hoàn tiền.";

export const revalidate = 60;

export async function generateMetadata() {
  const page = await getPage(SLUG);
  return pageMeta({
    title: page?.metaTitle || TIEU_DE,
    // Mô tả ngắn (dưới 110 ký tự) thì nối đoạn mở đầu của chính nội dung trang
    description: moTaDu(page?.metaDescription || MO_TA, page?.body),
    path: "/chinh-sach-huy-hoan",
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
