import Visa from "@/components/pages/Visa";
import Link from "next/link";
import DoanGioiThieu, { noiDanhSach } from "@/components/DoanGioiThieu";
import { pageMeta, serviceJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getVisaCountries, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Làm visa",
  description:
    "Dịch vụ làm visa trọn gói tại PSV Travel: tư vấn hồ sơ, nộp và nhận kết quả. Xem giấy tờ cần chuẩn bị, thời gian xử lý và phí theo từng quốc gia.",
  path: "/lam-visa",
});

export default async function Page() {
  const [countries, settings] = await Promise.all([
    getVisaCountries(),
    getSettings(),
  ]);
  const schema = serviceJsonLd({
    name: "Dịch vụ làm visa du lịch",
    serviceType: "Visa processing",
    url: `${SITE_URL}/lam-visa`,
    description: "Làm visa du lịch trọn gói, tỷ lệ đậu cao — Hàn Quốc, Nhật Bản, châu Âu và nhiều quốc gia khác.",
  });
  return (
    <>
      <JsonLd data={schema} />
      <Visa countries={countries} settings={settings} />
      <DoanGioiThieu tieuDe="Dịch vụ làm visa trọn gói tại PSV Travel">
        <p>
          PSV Travel hỗ trợ trọn gói thủ tục visa, từ tư vấn hồ sơ đến nộp và nhận kết quả
          {countries.length > 0 ? (
            <>
              . Hiện chúng tôi nhận hồ sơ visa đi{" "}
              {noiDanhSach(countries.slice(0, 12).map((c) => c.name))}
              {countries.length > 12 ? " cùng nhiều quốc gia khác" : ""}
            </>
          ) : null}
          . Mỗi quốc gia có trang riêng ghi rõ giấy tờ cần chuẩn bị, thời gian xử lý và phí dịch
          vụ, để bạn chủ động sắp xếp hồ sơ từ trước.
        </p>
        <p>
          Nếu bạn đi theo <Link href="/tour-nuoc-ngoai">tour nước ngoài</Link> của PSV Travel, thủ
          tục visa được hỗ trợ cùng lúc với việc đặt tour. Hồ sơ của mỗi người mỗi khác — hãy gọi
          hotline <strong>{settings?.hotline || "0907 870 707"}</strong> hoặc{" "}
          <Link href="/lien-he">để lại lời nhắn</Link> để được tư vấn trường hợp cụ thể của bạn.
        </p>
      </DoanGioiThieu>
    </>
  );
}