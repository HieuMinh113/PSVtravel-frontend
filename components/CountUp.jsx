"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

export default function CountUp({ to, suffix = "", duration = 1.8, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // Khởi tạo bằng SỐ CUỐI (không phải 0): HTML máy chủ và trường hợp không chạy
  // JS (trình thu thập của Google/AI) đọc được ngay con số thật "10.000+", thay
  // vì thấy "0+" như trước. Hiệu ứng đếm lên chỉ là phần tô điểm khi có JS.
  const [value, setValue] = useState(to);
  const daChay = useRef(false);

  useEffect(() => {
    if (!inView || daChay.current) return;
    daChay.current = true;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * to));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(to);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  // whitespace-nowrap: số dài như 18.400 làm hậu tố "+" bị đẩy xuống dòng
  // riêng, nhìn như một dấu cộng lạc lõng. Giữ số và hậu tố luôn cùng một dòng.
  return (
    <motion.span ref={ref} className={`whitespace-nowrap ${className || ""}`}>
      {value.toLocaleString("vi-VN")}
      {suffix}
    </motion.span>
  );
}