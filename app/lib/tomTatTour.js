// Đường dẫn tương đối (không dùng @/) để chạy được cả trong npm test
import { formatVND } from "../../data/tours.js";

// Khối "Tổng quan tour" ở đầu trang tour: một đoạn tóm tắt + các ô thông tin
// nhanh. Cho khách đọc lướt biết ngay tour đi mấy ngày, từ đâu, giá bao nhiêu,
// ngày nào đi — cũng là đoạn ChatGPT / Google AI dễ trích nguyên văn nhất, vì
// mọi con số nằm gọn trong vài câu thay vì rải khắp trang.
//
// Chỉ ghép từ dữ liệu thật của tour; thiếu dữ liệu nào thì bỏ câu đó.

// Tour không ghé điểm mua sắm: nhãn "No Shopping" (tự gắn khi nhập chương trình
// có chữ NO SHOP) hoặc tên tour có ghi
export const laNoShop = (tour) => /no\s*-?\s*shop/i.test(`${tour.tag || ""} ${tour.name || ""}`);

const noiDi = (tour) => String(tour.departure || "").replace(/^Từ\s+/i, "").trim();

const giaTreEmThapNhat = (tour) => {
  const ds = [tour.childPrice, ...(tour.departures || []).map((d) => d.priceChild)]
    .map(Number)
    .filter((n) => n > 0);
  return ds.length ? Math.min(...ds) : 0;
};

export function tomTatTour(tour) {
  const cau = [];
  const loai = tour.type === "abroad" ? "nước ngoài" : "trong nước";
  // Tên tour thường đã có thời gian ("… 3 ngày 2 đêm", "… 5N4Đ") thì không lặp lại
  const tenCoSoNgay = String(tour.name || "").includes(tour.days) || /\d+\s*N\s*\d+\s*Đ/i.test(tour.name || "");
  cau.push(
    `${tour.name} là tour ${loai}${tenCoSoNgay ? "" : ` ${tour.days}`} do PSV Travel tổ chức${noiDi(tour) ? `, khởi hành từ ${noiDi(tour)}` : ""}.`
  );

  if (tour.price > 0) {
    const treEm = giaTreEmThapNhat(tour);
    cau.push(`Giá từ ${formatVND(tour.price)}/khách${treEm ? `, trẻ em từ ${formatVND(treEm)}` : ""}.`);
  } else {
    cau.push("Giá tour báo theo yêu cầu, liên hệ hotline để nhận báo giá.");
  }

  const dot = (tour.departures || []).slice(0, 3).map((d) => d.startDate).filter(Boolean);
  if (dot.length) cau.push(`Ngày khởi hành gần nhất: ${dot.join(", ")}.`);

  if (tour.visaKind?.label) cau.push(`Tour dùng ${tour.visaKind.label.charAt(0).toLowerCase()}${tour.visaKind.label.slice(1)}.`);
  if (laNoShop(tour)) cau.push("Lịch trình không ghé điểm mua sắm (No Shopping).");

  const diemNhan = (tour.highlights || [])
    .map((h) => String(h).replace(/\*/g, "").trim())
    .filter(Boolean)
    .slice(0, 3);
  if (diemNhan.length) cau.push(`Điểm nổi bật: ${diemNhan.join(", ")}.`);

  return cau.join(" ");
}

// Các ô thông tin nhanh: [{ nhan, giaTri }]
export function thongTinNhanh(tour) {
  const dot = tour.departures || [];
  return [
    { nhan: "Thời gian", giaTri: tour.days },
    noiDi(tour) && { nhan: "Khởi hành từ", giaTri: noiDi(tour) },
    { nhan: "Giá từ", giaTri: tour.price > 0 ? `${formatVND(tour.price)}/khách` : "Liên hệ" },
    {
      nhan: "Ngày đi gần nhất",
      giaTri: dot.length ? `${dot[0].startDate}${dot.length > 1 ? ` (+${dot.length - 1} ngày khác)` : ""}` : "Theo yêu cầu",
    },
    tour.visaKind?.label && { nhan: "Visa", giaTri: tour.visaKind.label },
    laNoShop(tour) && { nhan: "Mua sắm", giaTri: "Không ghé điểm mua sắm" },
  ].filter(Boolean);
}
