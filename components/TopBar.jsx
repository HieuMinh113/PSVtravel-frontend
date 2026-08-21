"use client";
import Link from "next/link";
import { Phone, Mail, FileSearch, Clock3 } from "lucide-react";

/**
 * Thanh tiện ích trên cùng — mẫu dùng chung của mọi hãng lữ hành lớn ở VN
 * (Vietravel, Du Lịch Việt, Viettourist): số hotline luôn nhìn thấy, không phải cuộn.
 *
 * Với khách Việt, số điện thoại gọi được ngay là tín hiệu tin cậy mạnh nhất —
 * mạnh hơn mọi huy hiệu hay lời cam kết trên trang.
 */
export default function TopBar({ settings = {} }) {
  const hotline = settings.hotline || "0907 870 707";
  const email = settings.email || "hi@psvtravel.vn";
  const gioLamViec = settings.working_hours || "Hỗ trợ 24/7, kể cả cuối tuần";

  // tel: phải bỏ hết khoảng trắng thì máy Android/iOS mới bấm gọi được
  const soGoi = hotline.replace(/[^0-9+]/g, "");

  return (
    <div className="hidden bg-deep-950 text-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-2 text-xs sm:px-8">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-white/70">
            <Clock3 className="h-3.5 w-3.5 text-teal-400" />
            {gioLamViec}
          </span>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-white"
          >
            <Mail className="h-3.5 w-3.5 text-teal-400" />
            {email}
          </a>
        </div>

        <div className="flex items-center gap-5">
          {/* Tra cứu đơn: khách đặt không cần tài khoản vẫn xem lại được đơn.
              Đây là thứ khách hay tìm nhất sau khi bấm "Đặt tour". */}
          <Link
            href="/tra-cuu-booking"
            className="flex items-center gap-1.5 font-semibold text-white/85 transition-colors hover:text-teal-300"
          >
            <FileSearch className="h-3.5 w-3.5" />
            Tra cứu đơn đặt tour
          </Link>

          <a
            href={`tel:${soGoi}`}
            className="flex items-center gap-1.5 rounded-full bg-sunset-600 px-3.5 py-1 font-bold tracking-wide text-white transition-colors hover:bg-sunset-500"
          >
            <Phone className="h-3.5 w-3.5" />
            Hotline: {hotline}
          </a>
        </div>
      </div>
    </div>
  );
}
