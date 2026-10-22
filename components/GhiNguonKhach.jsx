"use client";
import { useEffect } from "react";
import { ghiNhanNguon } from "@/app/lib/nguonKhach";

// Ghi nguồn của lượt vào đầu tiên (nằm ở layout gốc nên chỉ chạy một lần mỗi
// lần tải trang, không chạy lại khi chuyển trang trong website)
export default function GhiNguonKhach() {
  useEffect(() => ghiNhanNguon(), []);
  return null;
}
