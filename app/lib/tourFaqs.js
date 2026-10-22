import { formatVND } from "@/data/tours";
import { laNoShop } from "@/app/lib/tomTatTour";

// Câu hỏi thường gặp ở cuối trang tour. Dùng CHUNG cho phần hiện trên trang và
// dữ liệu có cấu trúc FAQPage gửi Google — hai bên luôn khớp nhau từng chữ.
//
// Câu trả lời về giá trẻ em và huỷ tour lấy từ dữ liệu THẬT của tour: trước đây
// ghi cứng "trẻ em tính 60% giá người lớn", "huỷ trước 5 ngày hoàn 80%" — trái
// với giá trẻ em ở ô đặt tour và chính sách huỷ của chính tour đó trên cùng trang.
export function tourFaqs(tour) {
  const nuocNgoai = tour.type === "abroad" && Boolean(tour.country);
  const chinhSachHuy = String(tour.cancellationPolicy || "").replace(/\s+/g, " ").trim();
  // Giá trẻ em thấp nhất: giá chung của tour hoặc giá riêng từng ngày khởi hành
  const giaTreEm = [tour.childPrice, ...(tour.departures || []).map((d) => d.priceChild)]
    .filter((v) => v !== null && v !== undefined && v !== "")
    .map(Number);
  // Mục "Bao gồm / Không bao gồm" thật của tour, bỏ dấu đầu dòng và dấu câu cuối
  const sach = (ds) =>
    (ds || []).map((m) => String(m).replace(/^[\s•\-–➢*]+/u, "").replace(/[\s.;,]+$/u, "").trim()).filter(Boolean);
  const baoGom = sach(tour.included);
  const khongBaoGom = sach(tour.excluded);
  const dot = (tour.departures || []).slice(0, 3);

  return [
    {
      q: "Tôi có thể huỷ hoặc đổi lịch khởi hành không?",
      a: chinhSachHuy
        ? `Có. Chính sách đổi / huỷ của tour này: ${chinhSachHuy}`
        : "Có. Bạn có thể đổi ngày khởi hành miễn phí nếu báo trước 7 ngày. Huỷ tour trước 5 ngày được hoàn 80% giá trị, chi tiết theo chính sách huỷ tour từng thời điểm.",
    },
    {
      q: "Hình thức thanh toán như thế nào?",
      a: "Bạn có thể đặt cọc 30% để giữ chỗ và thanh toán phần còn lại trước ngày khởi hành 3 ngày, qua chuyển khoản, ví điện tử hoặc tại văn phòng.",
    },
    {
      q: "Trẻ em đi cùng có được giảm giá không?",
      a: giaTreEm.length
        ? `Có giá riêng cho trẻ em dưới 12 tuổi: từ ${formatVND(Math.min(...giaTreEm))}/khách${
            tour.price ? ` (người lớn từ ${formatVND(tour.price)}/khách)` : ""
          }, đã cộng sẵn khi bạn chọn số trẻ em ở phần đặt tour.`
        : "Giá trẻ em dưới 12 tuổi được báo riêng theo từng ngày khởi hành: bạn chọn số trẻ em khi đặt tour, nhân viên sẽ báo giá khi xác nhận đơn.",
    },
    ...(nuocNgoai
      ? [{
          q: "Tôi cần chuẩn bị visa như thế nào cho tour này?",
          a: `Với tour ${tour.country}, xem chi tiết yêu cầu visa ở phần "Hướng dẫn visa" phía trên. Đội ngũ PSVTravel hỗ trợ trọn gói thủ tục nếu bạn cần.`,
        }]
      : []),
    {
      // Liệt kê đúng ô "Bao gồm" của tour — KHÔNG khẳng định tour nào cũng có vé
      // máy bay (tour đi xe thì không)
      q: "Giá tour đã bao gồm những gì?",
      a: baoGom.length
        ? `Giá tour bao gồm: ${lietKe(baoGom)}.`
        : 'Xem đầy đủ ở mục "Giá tour bao gồm" và "Giá tour không bao gồm" trong khối Những thông tin cần lưu ý ở cuối trang. Còn thắc mắc, gọi hotline để được tư vấn viên giải đáp.',
    },
    ...(khongBaoGom.length
      ? [{ q: "Giá tour chưa bao gồm những gì?", a: `Giá tour chưa bao gồm: ${lietKe(khongBaoGom)}.` }]
      : []),
    // Tour mà mọi ngày đi đã hết hạn nộp visa thì trang đã báo riêng — bỏ câu này
    ...(tour.hetHanVisa
      ? []
      : [{
          q: "Khi nào có ngày khởi hành gần nhất?",
          a: dot.length
            ? `Các ngày khởi hành gần nhất: ${dot
                .map((d) => `${d.startDate}${Number(d.price) > 0 ? ` (${formatVND(d.price)}/khách)` : ""}`)
                .join(", ")}. Chọn ngày ở ô đặt tour để xem số chỗ còn lại.`
            : "Tour khởi hành theo yêu cầu: gọi hotline để chọn ngày phù hợp với nhóm của bạn.",
        }]),
    ...(laNoShop(tour)
      ? [{ q: "Tour có ghé điểm mua sắm không?", a: "Không. Lịch trình tour này không ghé điểm mua sắm (No Shopping)." }]
      : []),
  ];
}

// Ghép các mục "Bao gồm / Không bao gồm": tối đa 8 mục, quá thì chỉ ra chỗ xem đủ
function lietKe(ds) {
  const dau = ds.slice(0, 8).join("; ");
  return ds.length > 8 ? `${dau}; và các mục khác ghi ở cuối trang` : dau;
}
