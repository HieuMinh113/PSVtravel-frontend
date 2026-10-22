import { formatVND } from "@/data/tours";

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
      // KHÔNG khẳng định tour nào cũng có vé máy bay — tour đi xe thì không.
      q: "Giá tour đã bao gồm những gì?",
      a: 'Xem đầy đủ ở mục "Giá tour bao gồm" và "Giá tour không bao gồm" trong khối Những thông tin cần lưu ý ở cuối trang. Còn thắc mắc, gọi hotline để được tư vấn viên giải đáp.',
    },
  ];
}
