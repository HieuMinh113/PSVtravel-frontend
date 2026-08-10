"use client";
import { motion } from "framer-motion";

// Bọc quanh bất kỳ khối nội dung nào để nó "trồi lên" nhịp nhàng khi cuộn tới
export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  once = true,
  as = "div",
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}