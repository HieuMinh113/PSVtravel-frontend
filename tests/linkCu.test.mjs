import test from "node:test";
import assert from "node:assert/strict";
import { phanLoaiLinkCu, traDoiDuongDan, _datDanhSachDoi } from "../app/lib/linkCu.js";

test("Sitemap của WordPress cũ → sitemap mới", () => {
  for (const p of ["/sitemap_index.xml", "/sitemap.xml.gz", "/wp-sitemap.xml", "/post-sitemap.xml", "/product-sitemap2.xml"]) {
    assert.deepEqual(phanLoaiLinkCu(p), { ma: 301, toi: "/sitemap.xml" }, p);
  }
});

test("Ảnh, feed, trang hệ thống WordPress: đã gỡ (410), không hỏi backend", () => {
  for (const p of [
    "/wp-content/uploads/2023/09/dong-batu-malaysia.jpg",
    "/wp-includes/js/jquery.js",
    "/wp-login.php",
    "/feed",
    "/comments/feed",
    "/chuyen-vien-digital-marketing-02-nhan-vien/feed/",
  ]) {
    assert.deepEqual(phanLoaiLinkCu(p), { ma: 410 }, p);
  }
});

test("Tour / danh mục cũ có tiền tố: hỏi backend", () => {
  for (const p of ["/tour_nuoc_ngoai/bangkok-pattaya-5n4d-new-2023", "/tour/han-quoc-nami-seoul-everland-4n4d", "/Tour_Trong_Nuoc/Da-Lat/", "/danh-muc-san-pham/chau-a/nhat-ban"]) {
    assert.deepEqual(phanLoaiLinkCu(p), { hoi: true }, p);
  }
});

test("Trang của website mới không bị đụng tới", () => {
  for (const p of ["/", "/sitemap.xml", "/tour-nuoc-ngoai", "/tour-nuoc-ngoai/thai-lan-bangkok-pattaya-5n4d", "/tour-tet", "/cam-nang/abc", "/tour_nuoc_ngoai", "/nhat-ban"]) {
    assert.equal(phanLoaiLinkCu(p), null, p);
  }
});

test("Tour / bài vừa đổi đường dẫn: chuyển theo danh sách backend", async () => {
  _datDanhSachDoi({
    "/tour-nuoc-ngoai/thanhdo-cuutraicau": "/tour-nuoc-ngoai/thanh-do-cuu-trai-cau",
    "/cam-nang/bai-cu": "/cam-nang/bai-moi",
    "/cam-nang/vong-lap": "/cam-nang/vong-lap",
    "/cam-nang/ra-ngoai": "//trang-khac.com/x",
  });
  assert.equal(await traDoiDuongDan("/tour-nuoc-ngoai/thanhdo-cuutraicau"), "/tour-nuoc-ngoai/thanh-do-cuu-trai-cau");
  assert.equal(await traDoiDuongDan("/Cam-Nang/Bai-Cu/"), "/cam-nang/bai-moi");
  assert.equal(await traDoiDuongDan("/cam-nang/bai-moi"), null); // trang đang có
  assert.equal(await traDoiDuongDan("/cam-nang/vong-lap"), null);
  assert.equal(await traDoiDuongDan("/cam-nang/ra-ngoai"), null); // không chuyển ra ngoài website
  assert.equal(await traDoiDuongDan("/ve-chung-toi"), null); // ngoài tour / cẩm nang: khỏi tra
  _datDanhSachDoi(null);
});
