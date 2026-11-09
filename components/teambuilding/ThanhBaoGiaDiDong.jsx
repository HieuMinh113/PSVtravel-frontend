"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { bamLienHe } from "@/app/lib/doLuong";

// Thanh "Nhận báo giá" dính đáy màn hình trên điện thoại: hiện khi đã cuộn qua
// phần đầu trang, tự ẩn khi form báo giá (#bao-gia) đang nằm trên màn hình.
// data-thanh-dat-tour: nút gọi nổi tự cất đi (globals.css) để không chồng nhau.
export default function ThanhBaoGiaDiDong({ hotline }) {
  const [daCuon, setDaCuon] = useState(false);
  const [thayForm, setThayForm] = useState(false);

  useEffect(() => {
    const cuon = () => setDaCuon(window.scrollY > 520);
    cuon();
    window.addEventListener("scroll", cuon, { passive: true });
    const form = document.getElementById("bao-gia");
    const quan = form && "IntersectionObserver" in window ? new IntersectionObserver(([e]) => setThayForm(e.isIntersecting), { rootMargin: "0px 0px -20% 0px" }) : null;
    if (quan) quan.observe(form);
    return () => {
      window.removeEventListener("scroll", cuon);
      quan?.disconnect();
    };
  }, []);

  const hien = daCuon && !thayForm;
  const so = (hotline || "").replace(/[^0-9+]/g, "");

  return (
    <AnimatePresence>
      {hien && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          data-thanh-dat-tour
          className="fixed inset-x-0 bottom-0 z-30 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(7,30,51,0.12)] lg:hidden"
        >
          <div className="flex items-center gap-3">
            {so && (
              <a
                href={`tel:${so}`}
                onClick={() => bamLienHe("hotline", "Team Building")}
                aria-label={`Gọi tư vấn ${hotline}`}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ocean-200 text-ocean-700 transition-colors active:bg-ocean-50"
              >
                <Phone className="h-5 w-5" />
              </a>
            )}
            <a href="#bao-gia" className="btn-cta flex-1 justify-center !py-3 text-sm">
              Nhận báo giá trong 24 giờ <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
