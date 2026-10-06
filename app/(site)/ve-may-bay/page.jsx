import Flights from "@/components/pages/Flights";
import Link from "next/link";
import DoanGioiThieu, { noiDanhSach } from "@/components/DoanGioiThieu";
import { pageMeta, serviceJsonLd, JsonLd, SITE_URL } from "@/app/lib/seo";
import { getAirlines, getFlightDeals, getSettings } from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Vé máy bay",
  description:
    "Đặt vé máy bay nội địa và quốc tế tại PSV Travel: so sánh giá nhiều hãng bay, hỗ trợ đổi và hoàn vé. Gọi 0907 870 707 để nhận giá theo ngày bay.",
  path: "/ve-may-bay",
});

export default async function Page() {
  const [airlines, deals, settings] = await Promise.all([
    getAirlines(),
    getFlightDeals(),
    getSettings(),
  ]);
  const schema = serviceJsonLd({
    name: "Đặt vé máy bay trong nước & quốc tế",
    serviceType: "Flight booking",
    url: `${SITE_URL}/ve-may-bay`,
    description: "Đặt vé máy bay nội địa và quốc tế giá tốt, hỗ trợ đổi/hoàn linh hoạt.",
  });
  return (
    <>
      <JsonLd data={schema} />
      <Flights airlines={airlines} deals={deals} settings={settings} />
      <DoanGioiThieu tieuDe="Đặt vé máy bay nội địa và quốc tế tại PSV Travel">
        <p>
          PSV Travel nhận đặt vé máy bay nội địa và quốc tế
          {airlines.length > 0 ? <> của các hãng {noiDanhSach(airlines.slice(0, 10).map((a) => a.name))}</> : null},
          hỗ trợ đổi và hoàn vé khi kế hoạch của bạn thay đổi.
          {deals.length > 0 ? (
            <>
              {" "}Các chặng bay đang có giá tham khảo:{" "}
              {deals.slice(0, 8).map((d) => `${d.route} (${d.price})`).join(", ")}.
            </>
          ) : null}
        </p>
        <p>
          Giá vé thay đổi theo ngày bay và số chỗ còn lại, nên hãy gọi hotline{" "}
          <strong>{settings?.hotline || "0907 870 707"}</strong> để nhận giá tốt nhất cho đúng ngày
          bạn cần. Muốn đi trọn gói cả vé, khách sạn và lịch trình, bạn có thể xem thêm các{" "}
          <Link href="/tour-trong-nuoc">tour trong nước</Link> và{" "}
          <Link href="/tour-nuoc-ngoai">tour nước ngoài</Link>.
        </p>
      </DoanGioiThieu>
    </>
  );
}