"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Receipt, Headphones, RefreshCw } from "lucide-react";

/**
 * Dải cam kết ngay dưới Hero — vị trí mà travel.com.vn, dulichviet.com.vn
 * và viettourist.com đều đặt khối tương tự.
 *
 * Khác với mục "Vì sao chọn chúng tôi" ở giữa trang, dải này phải nằm ngay
 * dưới màn hình đầu: khách đang phân vân "công ty này có thật không" thì thấy
 * câu trả lời trước khi kịp thoát trang.
 *
 * Chỉ ghi những cam kết công ty làm được thật — mỗi dòng ở đây là một lời hứa
 * mà bộ phận chăm sóc khách hàng sẽ phải thực hiện.
 */
const camKet = [
  {
    icon: Receipt,
    title: "Giá trọn gói, không phụ thu",
    desc: "Báo giá đã gồm thuế, phí. Không phát sinh sau khi ký hợp đồng.",
  },
  {
    icon: ShieldCheck,
    title: "Hợp đồng & hoá đơn đầy đủ",
    desc: "Ký hợp đồng du lịch theo quy định, xuất hoá đơn VAT khi có yêu cầu.",
  },
  {
    icon: RefreshCw,
    title: "Hoàn / đổi theo quy định",
    desc: "Điều kiện huỷ đổi ghi rõ trong hợp đồng, không diễn giải mập mờ.",
  },
  {
    icon: Headphones,
    title: "Trực hotline 24/7",
    desc: "Có người nghe máy suốt hành trình, kể cả ngày lễ và ngoài giờ.",
  },
];

export default function TrustBar() {
  return (
    <section className="border-b border-ocean-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-x-6 gap-y-7 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:py-9">
        {camKet.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3.5"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ocean-50 text-ocean-600">
              <c.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-deep-900">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
