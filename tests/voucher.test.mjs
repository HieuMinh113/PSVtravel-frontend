import test from "node:test";
import assert from "node:assert/strict";
import { chuanHoaMa, trangThai, ngayVN, linkQuetNoiBo } from "../app/lib/voucher.js";

test("Mã khách gõ: chữ thường, khoảng trắng, thiếu gạch đều tra được", () => {
  assert.equal(chuanHoaMa(" psv-7kq3-mz8t "), "PSV-7KQ3-MZ8T");
  assert.equal(chuanHoaMa("psv 7kq3 mz8t"), "PSV-7KQ3-MZ8T");
  assert.equal(chuanHoaMa("PSV7KQ3MZ8T"), "PSV7KQ3MZ8T");
});

test("Nội dung QR là link trang kiểm tra → lấy mã", () => {
  assert.equal(chuanHoaMa("https://psvtravel.com/voucher/PSV-7KQ3-MZ8T"), "PSV-7KQ3-MZ8T");
  assert.equal(chuanHoaMa("https://psvtravel.com/voucher/psv-7kq3-mz8t?utm_source=qr"), "PSV-7KQ3-MZ8T");
});

test("Chuỗi quá ngắn / lạ thì không gửi đi tra", () => {
  assert.equal(chuanHoaMa(""), null);
  assert.equal(chuanHoaMa("abc"), null);
  assert.equal(chuanHoaMa("<script>"), "SCRIPT"); // chỉ giữ chữ, số, gạch — tra không thấy thì báo không có
  assert.equal(chuanHoaMa("x".repeat(60)), null);
});

test("Nhãn trạng thái + ngày + link nhân viên", () => {
  assert.equal(trangThai("con_dung").tot, true);
  assert.equal(trangThai("da_dung").nhan, "Đã sử dụng");
  assert.equal(trangThai("la").nhan, "Không tìm thấy mã");
  assert.equal(ngayVN("2026-12-31"), "31/12/2026");
  assert.equal(ngayVN(null), null);
  assert.equal(linkQuetNoiBo("PSV-7KQ3-MZ8T", "https://api.psvtravel.com/api/v1"), "https://api.psvtravel.com/admin/quet-voucher?ma=PSV-7KQ3-MZ8T");
});
