"use client";
// Nút "xem trên bản đồ" ở đầu bài cẩm nang: cuộn xuống bản đồ cuối bài.
// Cuộn bằng JS thay vì đổi #địa-chỉ — không thêm một bước Back thừa, bấm Back
// vẫn quay đúng về bản đồ trang Cẩm nang.
export default function NutXemBanDo({ className, children }) {
  return (
    <a
      href="#ban-do-cam-nang"
      className={className}
      onClick={(e) => {
        const dich = document.getElementById("ban-do-cam-nang");
        if (!dich) return;
        e.preventDefault();
        const giam = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        dich.scrollIntoView({ behavior: giam ? "auto" : "smooth", block: "start" });
      }}
    >
      {children}
    </a>
  );
}
