import BookingLookup from "@/components/pages/BookingLookup";

export const metadata = {
  title: "Tra cứu đơn đặt tour | PSV Travel",
  description:
    "Nhập mã đơn và số điện thoại để xem lại trạng thái đơn đặt tour tại PSV Travel. Không cần đăng nhập.",
  // Trang tra cứu là công cụ tiện ích, không có nội dung cho Google —
  // chặn lập chỉ mục để không làm loãng SEO của các trang tour.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <BookingLookup />;
}
