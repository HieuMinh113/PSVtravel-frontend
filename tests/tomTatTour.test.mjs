import test from "node:test";
import assert from "node:assert/strict";
import { tomTatTour, thongTinNhanh, laNoShop } from "../app/lib/tomTatTour.js";

const vnd = (n) => Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const tour = {
  name: "Phú Quốc - Hòn Thơm 3 ngày 2 đêm",
  type: "domestic",
  days: "3 ngày 2 đêm",
  departure: "Từ Hồ Chí Minh",
  price: 3990000,
  childPrice: 2990000,
  departures: [
    { startDate: "28/10/2026", priceChild: 2500000 },
    { startDate: "04/11/2026" },
    { startDate: "11/11/2026" },
    { startDate: "18/11/2026" },
  ],
  highlights: ["*Cáp treo* Hòn Thơm", "Grand World", "Lặn ngắm san hô", "Chợ đêm"],
};

test("Tóm tắt tour ghép đủ thông tin thật, không lặp số ngày đã có trong tên", () => {
  assert.equal(
    tomTatTour(tour),
    `Phú Quốc - Hòn Thơm 3 ngày 2 đêm là tour trong nước do PSV Travel tổ chức, khởi hành từ Hồ Chí Minh. ` +
      `Giá từ ${vnd(3990000)}/khách, trẻ em từ ${vnd(2500000)}. ` +
      `Ngày khởi hành gần nhất: 28/10/2026, 04/11/2026, 11/11/2026. ` +
      `Điểm nổi bật: Cáp treo Hòn Thơm, Grand World, Lặn ngắm san hô.`
  );
});

test("Tour nước ngoài: ghi số ngày khi tên không có, dạng visa, No Shopping", () => {
  const t = { ...tour, name: "Hàn Quốc mùa thu", type: "abroad", days: "5 ngày 4 đêm", visaKind: { label: "Visa đoàn" }, tag: "No Shopping", highlights: [] };
  const s = tomTatTour(t);
  assert.match(s, /^Hàn Quốc mùa thu là tour nước ngoài 5 ngày 4 đêm do PSV Travel tổ chức/);
  assert.match(s, /Tour dùng visa đoàn\./);
  assert.match(s, /không ghé điểm mua sắm \(No Shopping\)/);
  assert.equal(laNoShop({ name: "TOUR NOSHOP QUÝ CHÂU 5N4Đ" }), true);
  assert.equal(laNoShop({ name: "Shopping Myeongdong" }), false);
});

test("Tour giá liên hệ, chưa có lịch, chưa có nơi đi: bỏ câu thiếu dữ liệu", () => {
  const t = { name: "Bà Nà Hills", type: "domestic", days: "1 ngày 0 đêm", departure: "", price: 0, departures: [], highlights: [] };
  assert.equal(tomTatTour(t), "Bà Nà Hills là tour trong nước 1 ngày 0 đêm do PSV Travel tổ chức. Giá tour báo theo yêu cầu, liên hệ hotline để nhận báo giá.");
  assert.deepEqual(
    thongTinNhanh(t).map((o) => [o.nhan, o.giaTri]),
    [["Thời gian", "1 ngày 0 đêm"], ["Giá từ", "Liên hệ"], ["Ngày đi gần nhất", "Theo yêu cầu"]]
  );
});
