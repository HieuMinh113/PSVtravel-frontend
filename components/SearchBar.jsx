"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Users2, Search } from "lucide-react";

/** Hôm nay theo giờ MÁY KHÁCH, dạng Y-m-d.
 *  Không dùng toISOString(): hàm đó trả giờ UTC, nên từ 17h chiều giờ Việt Nam
 *  trở đi nó đã nhảy sang ngày hôm sau — khách sẽ không chọn được ngày mai. */
function homNay() {
  const d = new Date();
  const hai = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${hai(d.getMonth() + 1)}-${hai(d.getDate())}`;
}

// Nhãn hiển thị -> số khách tối thiểu, dùng để lọc tour còn đủ chỗ
const SO_KHACH = [
  { nhan: "2 khách", min: 2 },
  { nhan: "1 khách", min: 1 },
  { nhan: "3-4 khách", min: 3 },
  { nhan: "Nhóm 5+", min: 5 },
];

export default function SearchBar({ diemDenTrongNuoc = [], diemDenNuocNgoai = [] }) {
  const [dest, setDest] = useState("");
  const [type, setType] = useState("trong-nuoc");
  const [ngay, setNgay] = useState("");
  const [khach, setKhach] = useState(2);
  const router = useRouter();

  // Chặn chọn ngày trong quá khứ. Tính sau khi trang đã hiện ra, vì máy chủ
  // dựng sẵn trang này ở múi giờ khác — tính lúc dựng thì ngày chặn sẽ sai.
  const [ngayToiThieu, setNgayToiThieu] = useState("");
  useEffect(() => setNgayToiThieu(homNay()), []);

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

    // Ba ô đều đi vào địa chỉ, để trang kết quả lọc đúng theo cả ba.
    //
    // Trước đây chỉ ô điểm đến được dùng: khách chọn ngày khởi hành và số
    // khách rồi bấm "Tìm tour", hai lựa chọn đó bị vứt đi trong im lặng và
    // trang kết quả hiện y hệt như khi không chọn gì.
    const thamSo = new URLSearchParams();
    if (dest.trim()) thamSo.set("q", dest.trim());
    // Ngày quá khứ có lọt vào (khách gõ tay thay vì bấm lịch) thì bỏ qua
    if (ngay && (!ngayToiThieu || ngay >= ngayToiThieu)) thamSo.set("ngay", ngay);
    if (khach > 1) thamSo.set("khach", String(khach));

    const chuoi = thamSo.toString();
    router.push(chuoi ? `${base}?${chuoi}` : base);
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
            value={ngay}
            min={ngayToiThieu || undefined}
            onChange={(e) => setNgay(e.target.value)}
            aria-label="Khởi hành từ ngày"
            className="w-full rounded-2xl border border-ocean-100 bg-ocean-50/50 py-3.5 pl-11 pr-4 text-sm text-deep-900 outline-none transition-colors focus:border-ocean-400 focus:bg-white"
          />
        </div>

        <div className="relative">
          <Users2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
          <select
            value={khach}
            onChange={(e) => setKhach(Number(e.target.value))}
            aria-label="Số khách"
            className="w-full appearance-none rounded-2xl border border-ocean-100 bg-ocean-50/50 py-3.5 pl-11 pr-4 text-sm text-deep-900 outline-none transition-colors focus:border-ocean-400 focus:bg-white"
          >
            {SO_KHACH.map((o) => (
              <option key={o.nhan} value={o.min}>{o.nhan}</option>
            ))}
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