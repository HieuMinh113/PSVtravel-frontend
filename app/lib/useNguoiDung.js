"use client";
import { useCallback, useEffect, useState } from "react";

/**
 * Đọc trạng thái đăng nhập từ phía trình duyệt.
 *
 * Token nằm trong cookie httpOnly nên JavaScript không đọc được — phải hỏi
 * route handler `/api/auth/me`. Đổi lại các trang vẫn được dựng sẵn (SSG),
 * không bị chuyển sang render động chỉ vì thanh điều hướng cần biết tên khách.
 *
 * `dangTai` để giao diện giữ chỗ thay vì nháy từ "Đăng nhập" sang tên người dùng.
 */
export default function useNguoiDung() {
  const [nguoiDung, setNguoiDung] = useState(null);
  const [dangTai, setDangTai] = useState(true);

  const nap = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      setNguoiDung(data?.user ?? null);
    } catch {
      setNguoiDung(null);
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    nap();
  }, [nap]);

  return { nguoiDung, dangTai, datLai: setNguoiDung, napLai: nap };
}
