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
// Tên tín hiệu báo "thông tin người dùng vừa đổi". Dùng chung để mọi nơi
// hiển thị tên, ảnh đại diện… cùng lấy lại dữ liệu mới.
export const SU_KIEN_DOI = "psv:nguoi-dung-doi";

/** Gọi sau khi lưu hồ sơ thành công để cập nhật ngay mọi chỗ đang hiện tên. */
export function baoNguoiDungDoi() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SU_KIEN_DOI));
  }
}

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

  // Mỗi chỗ gọi hook này giữ một bản sao riêng của thông tin người dùng.
  //
  // Sửa hồ sơ ở trang tài khoản thì thanh điều hướng không hề biết — góc phải
  // vẫn hiện tên cũ cho tới khi bấm F5, khách tưởng lưu hỏng nên bấm lưu lại
  // mấy lần. Ai đổi thông tin thì phát tín hiệu SU_KIEN_DOI, mọi bản sao cùng
  // lấy lại một lượt.
  useEffect(() => {
    window.addEventListener(SU_KIEN_DOI, nap);
    return () => window.removeEventListener(SU_KIEN_DOI, nap);
  }, [nap]);

  return { nguoiDung, dangTai, datLai: setNguoiDung, napLai: nap };
}
