"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, Search, X, MapPinned, RotateCcw } from "lucide-react";
import PageHero from "@/components/PageHero";
import TourCard from "@/components/TourCard";
import SectionReveal from "@/components/SectionReveal";

export default function TourListPage({
  tours,
  basePath,
  title,
  eyebrow,
  description,
  danhMuc = [], // Danh Mục Tour trong admin — cùng nguồn với mega menu
  orbitImages,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery));

  // Danh mục đang chọn ĐỌC THẲNG TỪ ĐỊA CHỈ, không sao chép vào trạng thái.
  //
  // Trước đây dùng useState(searchParams.get("category")): giá trị chỉ được đọc
  // một lần lúc thành phần được tạo ra. Đang đứng ở /tour-trong-nuoc mà bấm một
  // mục trên mega menu thì địa chỉ đổi nhưng thành phần không được tạo lại, nên
  // bộ lọc đứng im — bấm mãi không thấy gì thay đổi.
  //
  // Đọc thẳng từ địa chỉ thì bấm ở mega menu, ở trang chủ hay ở nút lọc bên
  // dưới đều cho cùng kết quả, và nút Lùi của trình duyệt cũng chạy đúng.
  const slug = searchParams.get("category") || "";
  // Ngày khởi hành và số khách từ thanh tìm kiếm ở trang chủ
  const ngayTu = searchParams.get("ngay") || "";
  const soKhach = Number(searchParams.get("khach")) || 0;
  const tenDangChon = danhMuc.find((d) => d.slug === slug)?.name ?? "";

  // Bấm nút lọc thì ghi vào địa chỉ, để địa chỉ luôn là nguồn duy nhất.
  // Nhờ vậy sao chép link gửi cho người khác vẫn ra đúng kết quả đang xem.
  const chonDanhMuc = (slugMoi) => {
    const thamSo = new URLSearchParams(searchParams.toString());
    if (slugMoi) {
      thamSo.set("category", slugMoi);
    } else {
      thamSo.delete("category");
    }
    thamSo.delete("scroll");
    const chuoi = thamSo.toString();
    router.replace(chuoi ? `${pathname}?${chuoi}` : pathname, { scroll: false });
  };

  // Khi đến từ thanh lọc ở trang chi tiết tour (?scroll=1), cuộn thẳng xuống khu vực kết quả.
  useEffect(() => {
    if (searchParams.get("scroll")) {
      requestAnimationFrame(() => {
        document.getElementById("ket-qua-tour")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const matchQuery = query.trim() === "" ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        (t.country || "").toLowerCase().includes(query.toLowerCase());
      const matchDanhMuc = slug === "" || (t.categorySlugs || []).includes(slug);

      // Còn ít nhất một đợt khởi hành từ ngày khách chọn trở đi.
      // So sánh chuỗi Y-m-d là đủ và đúng: định dạng này xếp theo thứ tự chữ
      // cũng chính là thứ tự thời gian, khỏi phải dựng đối tượng ngày tháng.
      const matchNgay = !ngayTu || (t.lastDepartureDate && t.lastDepartureDate >= ngayTu);

      // Còn một đợt đủ chỗ cho cả nhóm. Tour chưa mở đợt nào thì chưa biết số
      // chỗ — vẫn cho hiện để khách gọi hỏi, thay vì giấu mất tour đang bán.
      const matchKhach = soKhach <= 1 || t.maxSeatsLeft == null || t.maxSeatsLeft >= soKhach;

      return matchQuery && matchDanhMuc && matchNgay && matchKhach;
    });
  }, [tours, query, slug, ngayTu, soKhach]);

  // Có đang lọc gì không — dùng để hiện nút xoá lọc
  const dangLoc = query.trim() !== "" || slug !== "" || ngayTu !== "" || soKhach > 1;

  // Gỡ một điều kiện đến từ thanh tìm kiếm, giữ nguyên các điều kiện còn lại
  const boThamSo = (ten) => {
    const thamSo = new URLSearchParams(searchParams.toString());
    thamSo.delete(ten);
    thamSo.delete("scroll");
    const chuoi = thamSo.toString();
    router.replace(chuoi ? `${pathname}?${chuoi}` : pathname, { scroll: false });
  };

  const xoaLoc = () => {
    setQuery("");
    setSearchOpen(false);
    const thamSo = new URLSearchParams(searchParams.toString());
    ["category", "ngay", "khach", "scroll"].forEach((t) => thamSo.delete(t));
    const chuoi = thamSo.toString();
    router.replace(chuoi ? `${pathname}?${chuoi}` : pathname, { scroll: false });
  };

  return (
    <div>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        crumbs={[{ label: title }]}
        orbitImages={orbitImages}
      />

      <section id="ket-qua-tour" className="scroll-mt-20 bg-foam py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Bộ lọc */}
          <SectionReveal className="sticky top-20 z-20 mb-8 rounded-2xl border border-ocean-100 bg-white/92 p-4 shadow-card backdrop-blur-lg sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              {/* Icon tìm kiếm — bấm vào mới xổ ra ô nhập */}
              <AnimatePresence mode="wait" initial={false}>
                {searchOpen ? (
                  <motion.div
                    key="input"
                    initial={{ width: 44, opacity: 0 }}
                    animate={{ width: 250, opacity: 1 }}
                    exit={{ width: 44, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="relative shrink-0 overflow-hidden"
                  >
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Tìm theo tên tour hoặc điểm đến..."
                      className="w-full rounded-full border border-ocean-100 bg-ocean-50/40 py-2.5 pl-10 pr-9 text-sm text-ink outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                    />
                    <button
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      className="tap-44 absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle transition-colors hover:text-deep-800"
                      aria-label="Đóng tìm kiếm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchOpen(true)}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ocean-50 text-ocean-700 transition-colors hover:bg-ocean-100"
                    aria-label="Mở tìm kiếm"
                  >
                    <Search className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-ocean-500" />
                {[{ slug: "", name: "Tất cả" }, ...danhMuc].map((d) => {
                  const dangChon = slug === d.slug;
                  return (
                    <button
                      key={d.slug || "tat-ca"}
                      onClick={() => chonDanhMuc(d.slug)}
                      aria-pressed={dangChon}
                      className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ease-enter ${
                        dangChon
                          ? "bg-ocean-600 text-white shadow-[0_4px_14px_-4px_rgba(1,105,169,0.6)]"
                          : "bg-ocean-50 text-ocean-700 hover:bg-ocean-100"
                      }`}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>

              {/* Nút xoá lọc chỉ hiện khi đang lọc — tránh làm rối thanh công cụ */}
              <AnimatePresence>
                {dangLoc && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={xoaLoc}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-sunset-200 bg-sunset-50 px-3.5 py-2 text-xs font-semibold text-sunset-700 transition-colors hover:bg-sunset-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Xoá lọc
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Điều kiện đến từ thanh tìm kiếm ở trang chủ.
                Phải hiện ra thành chữ: khách tìm "khởi hành từ 05/09, 4 khách"
                rồi thấy ít tour hơn hẳn mà không có gì giải thích thì tưởng
                website hỏng. Mỗi thẻ có dấu × để gỡ riêng điều kiện đó. */}
            {(ngayTu || soKhach > 1) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ocean-50 pt-3">
                <span className="text-xs text-ink-subtle">Từ ô tìm kiếm:</span>
                {ngayTu && (
                  <button
                    onClick={() => boThamSo("ngay")}
                    className="flex items-center gap-1.5 rounded-full bg-ocean-50 px-3 py-1.5 text-xs font-semibold text-ocean-700 transition-colors hover:bg-ocean-100"
                  >
                    Khởi hành từ {ngayTu.split("-").reverse().join("/")}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {soKhach > 1 && (
                  <button
                    onClick={() => boThamSo("khach")}
                    className="flex items-center gap-1.5 rounded-full bg-ocean-50 px-3 py-1.5 text-xs font-semibold text-ocean-700 transition-colors hover:bg-ocean-100"
                  >
                    {soKhach >= 5 ? "Nhóm 5+ khách" : `${soKhach} khách trở lên`}
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </SectionReveal>

          {/* Dòng kết quả */}
          <div className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-display text-2xl font-bold text-ocean-700">{filtered.length}</span>
            <span className="text-sm text-ink-muted">
              tour phù hợp
              {tenDangChon && <> tại <strong className="font-semibold text-ink">{tenDangChon}</strong></>}
              {query.trim() !== "" && <> cho từ khoá &ldquo;<strong className="font-semibold text-ink">{query}</strong>&rdquo;</>}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ocean-200 bg-white py-20 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ocean-50">
                <MapPinned className="h-8 w-8 text-ocean-300" />
              </div>
              <p className="mt-5 font-display text-xl font-semibold text-deep-900">Không tìm thấy tour phù hợp</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                Thử bỏ bớt điều kiện lọc, hoặc để chúng tôi gợi ý hành trình khác cho bạn.
              </p>
              <button onClick={xoaLoc} className="btn-cta mt-7 !px-6 !py-3 text-sm">
                <RotateCcw className="h-4 w-4" /> Xem tất cả tour
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tour, i) => (
                <TourCard key={tour.slug} tour={tour} basePath={basePath} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
