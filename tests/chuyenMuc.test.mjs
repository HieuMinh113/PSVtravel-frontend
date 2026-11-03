import test from "node:test";
import assert from "node:assert/strict";
import { tenChuyenMuc, cacChuyenMuc } from "../app/lib/chuyenMuc.js";

test("Mã chuyên mục → tên tiếng Việt (trước đây hiện thẳng am-thuc, kinh-nghiem)", () => {
  assert.equal(tenChuyenMuc("am-thuc"), "Ẩm thực");
  assert.equal(tenChuyenMuc("kinh-nghiem"), "Kinh nghiệm");
  assert.equal(tenChuyenMuc("thu-tuc"), "Thủ tục");
  assert.equal(tenChuyenMuc("diem-den"), "Điểm đến");
  assert.equal(tenChuyenMuc("mua-sam"), "Mua sam"); // mã lạ: vẫn đọc được
  assert.equal(tenChuyenMuc(null), "");
});

test("Nút lọc theo thứ tự cố định, không trùng, bỏ bài không có chuyên mục", () => {
  const ds = [{ category: "diem-den" }, { category: "am-thuc" }, { category: null }, { category: "kinh-nghiem" }, { category: "am-thuc" }];
  assert.deepEqual(cacChuyenMuc(ds), ["kinh-nghiem", "am-thuc", "diem-den"]);
});
