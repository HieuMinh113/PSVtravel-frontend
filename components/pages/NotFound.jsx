"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-foam px-5 text-center">
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Compass className="h-20 w-20 text-ocean-400" />
      </motion.div>
      <h1 className="mt-6 font-display text-5xl font-bold text-deep-900">404</h1>
      <p className="mt-2 max-w-sm text-deep-800/60">
        Có vẻ như bạn đã lạc vào vùng biển chưa có trên bản đồ. Hãy quay lại để tiếp tục hành trình.
      </p>
      <Link href="/" className="btn-cta mt-8">
        <ArrowLeft className="h-4 w-4" /> Về trang chủ
      </Link>
    </div>
  );
}