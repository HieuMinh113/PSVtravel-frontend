"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Users2, Search } from "lucide-react";

export default function SearchBar({ diemDenTrongNuoc = [], diemDenNuocNgoai = [] }) {
  const [dest, setDest] = useState("");
  const [type, setType] = useState("trong-nuoc");
  const router = useRouter();

  // Gợi ý phải khớp tab đang chọn: đang ở "Tour trong nước" mà gợi ý Thái Lan
  // thì khách bấm vào chỉ nhận kết quả rỗng. Danh sách lấy từ tour thật đang
  // bán, không viết cứng nữa.
  const goiY = type === "trong-nuoc" ? diemDenTrongNuoc : diemDenNuocNgoai;

  const doiTab = (t) => {
    setType(t);
    setDest(""); // từ khoá của tab cũ không còn nghĩa ở tab mới
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const base = type === "trong-nuoc" ? "/tour-trong-nuoc" : "/tour-nuoc-ngoai";
    const qs = dest.trim() ? `?q=${encodeURIComponent(dest.trim())}` : "";
    router.push(base + qs);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-4xl rounded-3xl bg-white/95 p-3 shadow-deep backdrop-blur-xl sm:p-4"
    >
      <div className="flex gap-2 pb-3">
        {[
          { id: "trong-nuoc", label: "Tour trong nước" },
          { id: "nuoc-ngoai", label: "Tour nước ngoài" },
        ].map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => doiTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
              type === t.id ? "bg-ocean-500 text-white" : "bg-ocean-50 text-ocean-700 hover:bg-ocean-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
          <input
            list="destinations"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            placeholder="Bạn muốn đi đâu?"
            className="w-full rounded-2xl border border-ocean-100 bg-ocean-50/50 py-3.5 pl-11 pr-4 text-sm text-deep-900 outline-none transition-colors placeholder:text-ink-subtle focus:border-ocean-400 focus:bg-white"
          />
          <datalist id="destinations">
            {goiY.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>

        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
          <input
            type="date"
            className="w-full rounded-2xl border border-ocean-100 bg-ocean-50/50 py-3.5 pl-11 pr-4 text-sm text-deep-900 outline-none transition-colors focus:border-ocean-400 focus:bg-white"
          />
        </div>

        <div className="relative">
          <Users2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
          <select className="w-full appearance-none rounded-2xl border border-ocean-100 bg-ocean-50/50 py-3.5 pl-11 pr-4 text-sm text-deep-900 outline-none transition-colors focus:border-ocean-400 focus:bg-white">
            <option>2 khách</option>
            <option>1 khách</option>
            <option>3-4 khách</option>
            <option>Nhóm 5+</option>
          </select>
        </div>

        <button type="submit" className="btn-cta !py-3.5 !px-6">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Tìm tour</span>
        </button>
      </div>
    </motion.form>
  );
}