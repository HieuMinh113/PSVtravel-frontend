import Link from "next/link";
import Home from "@/components/pages/Home";
import DoanGioiThieu, { noiDanhSach } from "@/components/DoanGioiThieu";
import { isAutumnSeason } from "@/app/lib/season";
import { pageMeta } from "@/app/lib/seo";
import {
  getTours,
  getBanners,
  getOrbitImages,
  getFeaturedReviews,
  getCategories,
  getPromotions,
  getGuides,
  getPartners,
  getSettings,
} from "@/app/lib/api";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Đặt tour du lịch trong nước & nước ngoài",
  description:
    "Đặt tour du lịch trong nước và nước ngoài trọn gói tại PSV Travel: hơn 300 tuyến tour, giá minh bạch, lịch trình chi tiết. Hotline 0907 870 707.",
  path: "/",
});

export default async function Page() {
  const [domestic, abroad, banners, orbitImages, reviews, danhMuc, promotions, guides, partners, settings] = await Promise.all([
    getTours({ type: "domestic" }),
    getTours({ type: "abroad" }),
    getBanners(),
    getOrbitImages("orbit_home"),
    getFeaturedReviews(),
    // Điểm đến nổi bật = Danh mục tour trong admin, số tour do máy chủ đếm thật
    getCategories(),
    getPromotions(),
    getGuides(),
    getPartners(),
    // Video giới thiệu trang chủ (admin dán link YouTube trong Cài đặt)
    getSettings(),
  ]);

  // Gợi ý cho ô tìm kiếm: tên tour + vùng miền/quốc gia của tour thật đang bán
  const goiY = (ds, truong) =>
    [...new Set(ds.flatMap((t) => [t[truong], t.name]).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "vi"))
      .slice(0, 30);

  // Hình bìa tất cả tour đang bán (bỏ trùng) — dùng cho vòng xoay & nền Hero.
  const anhBiaTour = [
    ...new Set([...domestic, ...abroad].map((t) => t.image).filter(Boolean)),
  ];

  // Ảnh bìa → tên tour, làm chữ thay thế (alt) cho ảnh vòng xoay & nền Hero
  const tenAnhTour = Object.fromEntries(
    [...domestic, ...abroad].filter((t) => t.image).map((t) => [t.image, t.name])
  );

  const upcoming = [...domestic, ...abroad]
    .filter((t) => t.startDate)
    .sort(
      (a, b) =>
        new Date(a.startDate.split("/").reverse().join("-")) -
        new Date(b.startDate.split("/").reverse().join("-"))
    )
    .slice(0, 6);

  // Tên điểm đến THẬT đang có tour (danh mục trong admin) — đoạn giới thiệu tự
  // cập nhật khi thêm/bớt điểm đến, không phải sửa chữ.
  const tenDiemDen = (loai) =>
    danhMuc.filter((d) => d.type === loai && d.tourCount > 0).slice(0, 8).map((d) => d.name);
  const diemTrongNuoc = tenDiemDen("domestic");
  const diemNuocNgoai = tenDiemDen("abroad");

  return (
    <>
    <Home
      initialAutumn={isAutumnSeason()}
      upcoming={upcoming}
      banner={banners[0] ?? null}
      orbitImages={orbitImages}
      anhBiaTour={anhBiaTour}
      tenAnhTour={tenAnhTour}
      diemDen={danhMuc.slice(0, 6)}
      goiYTrongNuoc={goiY(domestic, "region")}
      goiYNuocNgoai={goiY(abroad, "country")}
      reviews={reviews}
      promotions={promotions}
      latestGuides={guides.slice(0, 4)}
      partners={partners}
      videoTrangChu={settings?.home_video_url ?? null}
      tieuDeVideo={settings?.home_video_title ?? null}
    />

    <DoanGioiThieu tieuDe="Đặt tour du lịch trong nước và nước ngoài cùng PSV Travel">
      <p>
        <strong>PSV Travel</strong> (Công ty Cổ phần Du lịch P.S.V Travel, mã số thuế 0314542363)
        là doanh nghiệp lữ hành có giấy phép kinh doanh dịch vụ lữ hành quốc tế số
        79-769/2020/CDLQGVN-GP LHQT, văn phòng tại 529 Huỳnh Tấn Phát, Quận 7, TP. Hồ Chí Minh.
        Chúng tôi khai thác hơn 300 tuyến tour trong nước và quốc tế, với giá trọn gói minh bạch
        và lịch trình chi tiết theo từng ngày.
      </p>
      <h3>Tour trong nước</h3>
      <p>
        Các <Link href="/tour-trong-nuoc">tour trong nước</Link> đưa bạn tới những vùng đất nổi
        bật của Việt Nam
        {diemTrongNuoc.length > 0 ? <> như {noiDanhSach(diemTrongNuoc)}</> : null}. Mỗi tour có
        ảnh thực tế, ngày khởi hành cụ thể và giá cho từng khách, giúp bạn so sánh và chọn hành
        trình phù hợp với thời gian, ngân sách của gia đình hay nhóm bạn.
      </p>
      <h3>Tour nước ngoài</h3>
      <p>
        Với <Link href="/tour-nuoc-ngoai">tour nước ngoài</Link>
        {diemNuocNgoai.length > 0 ? <> đi {noiDanhSach(diemNuocNgoai)}</> : null}, PSV Travel hỗ
        trợ trọn gói từ vé máy bay, khách sạn, hướng dẫn viên tới thủ tục{" "}
        <Link href="/lam-visa">làm visa</Link>, để bạn chỉ cần chuẩn bị hành lý và tận hưởng chuyến
        đi.
      </p>
      <h3>Dịch vụ đi kèm</h3>
      <p>
        Bên cạnh các chương trình tham quan, chúng tôi cung cấp{" "}
        <Link href="/ve-may-bay">vé máy bay</Link> nội địa và quốc tế, dịch vụ visa, xe du lịch,
        đặt khách sạn – resort, cùng chương trình{" "}
        <Link href="/team-building">team building và tổ chức sự kiện</Link> cho doanh nghiệp.
      </p>
      <h3>Đặt tour như thế nào?</h3>
      <p>
        Chọn tour, xem lịch trình và ngày khởi hành, rồi gửi yêu cầu giữ chỗ ngay trên website —
        nhân viên PSV Travel sẽ liên hệ xác nhận. Bạn có thể{" "}
        <Link href="/tra-cuu-booking">tra cứu đơn đặt tour</Link> bằng mã đơn và số điện thoại mà
        không cần đăng nhập. PSV Travel nhận thanh toán bằng chuyển khoản ngân hàng, thẻ
        VISA/MasterCard hoặc tiền mặt tại văn phòng; điều kiện{" "}
        <Link href="/chinh-sach-huy-hoan">huỷ – hoàn tiền</Link> và{" "}
        <Link href="/chinh-sach-thanh-toan">thanh toán</Link> được công bố rõ ràng. Cần tư vấn
        thêm, hãy gọi hotline <strong>0907 870 707</strong>.
      </p>
    </DoanGioiThieu>
    </>
  );
}