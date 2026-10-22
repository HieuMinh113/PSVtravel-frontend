import test from "node:test";
import assert from "node:assert/strict";
import { phanLoaiLinkCu } from "../app/lib/linkCu.js";

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
