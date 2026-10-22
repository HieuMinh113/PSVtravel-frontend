import test from "node:test";
import assert from "node:assert/strict";
import { tourTheoDiemDen, khongDau } from "../app/lib/tourTheoDiemDen.js";

const t = (slug, name = slug) => ({ slug, name });

test("Bỏ dấu tiếng Việt thành đường dẫn", () => {
  assert.equal(khongDau("Vịnh Hạ Long"), "vinh-ha-long");
  assert.equal(khongDau("Đà Lạt  mộng mơ!"), "da-lat-mong-mo");
});

test("Tour đúng điểm đến lên đầu, tour khác cùng vùng tách riêng", () => {
  const cungVung = [t("ha-noi-ha-long-sa-pa-5n4d"), t("ha-giang-dong-van-4n3d"), t("sa-pa-fansipan-3n2d")];
  const tatCa = [t("ha-long-du-thuyen-2n1d"), t("ha-noi-ha-long-sa-pa-5n4d"), t("phu-quoc-3n2d"), t("halong-sai-chinh-ta")];
  const { dungDiem, cungKhuVuc } = tourTheoDiemDen({ slug: "ha-long", name: "Vịnh Hạ Long" }, { tatCa, cungVung });
  assert.deepEqual(dungDiem.map((x) => x.slug), ["ha-noi-ha-long-sa-pa-5n4d", "ha-long-du-thuyen-2n1d"]);
  assert.deepEqual(cungKhuVuc.map((x) => x.slug), ["ha-giang-dong-van-4n3d", "sa-pa-fansipan-3n2d"]);
});

test("Khớp cả theo tên tour không dấu, không khớp nửa từ", () => {
  const tatCa = [t("tour-1", "Seoul – Nami – Everland"), t("tour-2", "Seoulland ngoại ô")];
  const { dungDiem } = tourTheoDiemDen({ slug: "seoul", name: "Seoul" }, { tatCa });
  assert.deepEqual(dungDiem.map((x) => x.slug), ["tour-1"]);
});
