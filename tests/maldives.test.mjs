import test from "node:test";
import assert from "node:assert/strict";
import { baoGia, usd, trieuDong, tyGia, quyDoi, ngayVN } from "../app/lib/maldives.js";

const ngay = { prices: { 11: 2631, 12: 2846 } };

test("Giá tạm tính giống backend: người lớn + trẻ em 75% + phụ thu mỗi khách", () => {
  const kq = baoGia({ childPercent: 75, ngay, phongId: 11, noiDi: { city: "TP.HCM", surchargeUsd: 100 }, nguoiLon: 2, treEm: 1, tg: 26300 });
  assert.equal(kq.donGia, 2631);
  assert.equal(kq.giaTreEm, 1973);
  assert.equal(kq.tong, 2 * 2631 + 1973 + 3 * 100);
  assert.equal(kq.tongVnd, 7535 * 26300);
  assert.deepEqual(kq.chuaGom, []);
});

test("Phần chưa có số thì không cộng, ghi rõ chưa gồm", () => {
  const kq = baoGia({ childPercent: 75, ngay, phongId: 11, noiDi: { city: "Đà Nẵng", surchargeUsd: null }, nguoiLon: 2, emBe: 1 });
  assert.equal(kq.tong, 2 * 2631);
  assert.equal(kq.tongVnd, null); // chưa có tỷ giá
  assert.deepEqual(kq.chuaGom, ["phụ thu khởi hành từ Đà Nẵng", "em bé dưới 2 tuổi"]);
  assert.equal(baoGia({ ngay, phongId: 99, nguoiLon: 2 }).tong, null); // hạng phòng không bán ngày đó
});

test("Định dạng giá", () => {
  assert.equal(usd(2631), "$2.631");
  assert.equal(trieuDong(69_195_300), "69,2 triệu");
  assert.equal(tyGia({ maldives_ty_gia: "26.300" }), 26300);
  assert.equal(tyGia({}), null);
  assert.equal(quyDoi(2631, 26300), "≈ 69,2 triệu đồng");
  assert.equal(quyDoi(2631, null), "");
  assert.equal(ngayVN("2026-11-04"), "04/11/2026");
});
