"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, CalendarDays, Users2, ArrowUpRight } from "lucide-react";
import { formatVND } from "@/data/tours";

const tagStyles = {
  "Bán chạy": "bg-teal-500",
  "Mới": "bg-ocean-500",
  "Giảm giá": "bg-rose-500",
  "Cao cấp": "bg-deep-800",
};

export default function TourCard({ tour, basePath, index = 0 }) {
  const discount = tour.oldPrice
    ? Math.round((1 - tour.price / tour.oldPrice) * 100)
    : null;

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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {tour.tag && (
            <span className={`absolute left-3 top-3 rounded-full ${tagStyles[tour.tag] || "bg-ocean-500"} px-3 py-1 text-xs font-semibold text-white shadow`}>
              {tour.tag}
            </span>
          )}
          {discount && (
            <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-rose-600 shadow">
              -{discount}%
            </span>
          )}

          <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white/90 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4 text-ocean-700" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-1 text-xs font-medium text-ocean-600">
            <MapPin className="h-3.5 w-3.5" />
            {tour.region} {tour.country ? `· ${tour.country}` : ""}
          </div>

          <h3 className="mt-1.5 line-clamp-2 font-display text-lg font-semibold leading-snug text-deep-900 transition-colors group-hover:text-ocean-600">
            {tour.name}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-xs text-deep-800/60">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> {tour.days}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-teal-400 text-teal-400" /> {tour.rating} ({tour.reviews})
            </span>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-rose-600">
            <Users2 className="h-3.5 w-3.5" />
            Chỉ còn {tour.seatsLeft} chỗ · Khởi hành {tour.startDate}
          </div>

          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              {tour.oldPrice && (
                <p className="text-xs text-deep-800/40 line-through">{formatVND(tour.oldPrice)}</p>
              )}
              <p className="font-display text-xl font-bold text-ocean-700">{formatVND(tour.price)}</p>
              <p className="text-[11px] text-deep-800/50">{tour.departure}</p>
            </div>
            <span className="rounded-full border border-ocean-200 px-4 py-2 text-xs font-semibold text-ocean-700 transition-colors group-hover:border-ocean-500 group-hover:bg-ocean-500 group-hover:text-white">
              Xem chi tiết
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}