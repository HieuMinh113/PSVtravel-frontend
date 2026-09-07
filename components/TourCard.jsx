"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, CalendarDays, Users2, ArrowUpRight } from "lucide-react";
import { formatVND } from "@/data/tours";

// Nhãn khuyến mãi: mỗi loại một màu riêng, tất cả đều đạt tương phản với chữ trắng
const tagStyles = {
  "Bán chạy": "bg-teal-600",
  "Mới": "bg-ocean-600",
  "Giảm giá": "bg-sunset-600",
  "Cao cấp": "bg-deep-800",
};

// Số ngày khởi hành hiện trên thẻ. Nhiều hơn thì gộp thành nhãn "+n" để dãy
// ngày không xuống thành hai hàng làm cao thấp các thẻ lệch nhau.
const SO_NGAY_HIEN = 5;

// API trả Y-m-d (để trang kết quả so sánh được với ngày khách chọn), ô hiển
// thị thì chỉ cần ngày/tháng — thêm năm vào 5 ô liền nhau là chật và thừa.
const ngayGon = (iso) => {
  const [, thang, ngay] = String(iso).split("-");
  return ngay && thang ? `${ngay}/${thang}` : iso;
};

export default function TourCard({ tour, basePath, index = 0 }) {
  const discount = tour.oldPrice
    ? Math.round((1 - tour.price / tour.oldPrice) * 100)
    : null;

  // Còn ít chỗ thì mới cảnh báo — dùng màu ấm để tạo cảm giác cấp thiết đúng lúc,
  // tránh bôi đỏ mọi thẻ khiến tín hiệu mất giá trị
  const sapHetCho = typeof tour.seatsLeft === "number" && tour.seatsLeft > 0 && tour.seatsLeft <= 5;

  // Ngày khởi hành sắp tới, dạng dd/mm. Backend đã lọc còn mở, còn hạn và sắp
  // theo ngày; ở đây chỉ cắt cho vừa bề rộng thẻ.
  const ngayKhoiHanh = (tour.departureDates ?? []).slice(0, SO_NGAY_HIEN);
  const conNua = Math.max(0, (tour.departureCount ?? ngayKhoiHanh.length) - ngayKhoiHanh.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="card-surface group flex flex-col overflow-hidden"
    >
      <Link href={`${basePath}/${tour.slug}`} className="flex flex-1 flex-col">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={90}
            className="object-cover transition-transform duration-700 ease-enter group-hover:scale-110"
          />

          {/* Lớp phủ mờ chân ảnh: luôn hiện nhẹ để chữ trắng phía trên ảnh luôn đọc
              được, đậm dần khi rê chuột */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-950/55 via-deep-950/5 to-transparent transition-opacity duration-500 group-hover:from-deep-950/70" />

          {tour.tag && (
            <span className={`absolute left-3 top-3 rounded-full ${tagStyles[tour.tag] || "bg-ocean-600"} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
              {tour.tag}
            </span>
          )}

          {discount > 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-sunset-700 shadow-sm">
              −{discount}%
            </span>
          )}

          {/* Vùng miền đặt đè lên ảnh: giải phóng chỗ bên dưới cho thông tin quan trọng */}
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-1 text-xs font-medium text-white drop-shadow">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {tour.region}{tour.country ? ` · ${tour.country}` : ""}
            </span>
          </div>

          <span className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 translate-x-2 place-items-center rounded-full bg-white/95 opacity-0 shadow backdrop-blur transition-all duration-300 ease-enter group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4 text-ocean-700" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-deep-900 transition-colors group-hover:text-ocean-700">
            {tour.name}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-subtle">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-ocean-500" /> {tour.days}
            </span>
            <span className="flex items-center gap-1 font-medium text-ink-muted">
              <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
              {tour.rating > 0 ? tour.rating : "Mới"}
              {tour.reviews > 0 && <span className="text-ink-subtle">({tour.reviews})</span>}
            </span>
          </div>

          {/* Dòng cấp thiết: chỉ tô ấm khi thật sự sắp hết chỗ.
              Ngày khởi hành đã tách xuống dãy ô riêng bên dưới nên không nhắc
              lại ở đây nữa. */}
          {(sapHetCho || typeof tour.seatsLeft === "number") && (
            <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${sapHetCho ? "text-sunset-700" : "text-ink-subtle"}`}>
              <Users2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {sapHetCho
                  ? `Chỉ còn ${tour.seatsLeft} chỗ`
                  : tour.seatsLeft > 0
                  ? `Còn ${tour.seatsLeft} chỗ`
                  : "Hết chỗ"}
              </span>
            </div>
          )}

          {/* Dãy ngày khởi hành: nhìn một hàng ngày là biết tour chạy đều đặn,
              có nhiều lựa chọn — thuyết phục hơn hẳn một ngày lẻ. Chỉ để xem,
              không bấm được: cả thẻ đã là một liên kết, lồng nút vào trong dễ
              bấm nhầm trên điện thoại. */}
          {ngayKhoiHanh.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {ngayKhoiHanh.map((ngay) => (
                <span
                  key={ngay}
                  className="rounded-md bg-ocean-50 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-ocean-700"
                >
                  {ngayGon(ngay)}
                </span>
              ))}
              {conNua > 0 && (
                <span className="text-[11px] font-medium text-ink-subtle">+{conNua}</span>
              )}
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-ocean-50 pt-4">
            <div className="min-w-0">
              {tour.oldPrice && (
                <p className="text-xs text-ink-subtle line-through">{formatVND(tour.oldPrice)}</p>
              )}
              <p className="font-display text-xl font-bold text-ocean-700">{formatVND(tour.price)}</p>
              {tour.departure && (
                <p className="truncate text-xs text-ink-subtle">{tour.departure}</p>
              )}
            </div>

            <span className="shrink-0 rounded-full border border-ocean-200 px-4 py-2 text-xs font-semibold text-ocean-700 transition-colors duration-300 group-hover:border-sunset-600 group-hover:bg-sunset-600 group-hover:text-white">
              Xem chi tiết
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
