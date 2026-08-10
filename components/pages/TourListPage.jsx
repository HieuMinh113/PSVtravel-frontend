"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, Search, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import TourCard from "@/components/TourCard";
import SectionReveal from "@/components/SectionReveal";

export default function TourListPage({
  tours,
  basePath,
  title,
  eyebrow,
  description,
  regions,
  orbitImages,
  matchFilter, // (tour, selectedOption) => boolean — mặc định lọc theo vùng miền
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialRegion = searchParams.get("region") || "Tất cả";
  const [query, setQuery] = useState(initialQuery);
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery));
  const [region, setRegion] = useState(initialRegion);

  const isMatch = matchFilter || ((t, r) => t.region === r);

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
      const matchRegion = region === "Tất cả" || isMatch(t, region);
      return matchQuery && matchRegion;
    });
  }, [tours, query, region]);

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
          <SectionReveal className="sticky top-20 z-20 mb-10 rounded-2xl border border-ocean-100 bg-white/90 p-4 shadow-sm backdrop-blur-lg sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              {/* Icon tìm kiếm — bấm vào mới xổ ra ô nhập */}
              <AnimatePresence mode="wait" initial={false}>
                {searchOpen ? (
                  <motion.div
                    key="input"
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative shrink-0 overflow-hidden"
                  >
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Tìm theo tên tour hoặc điểm đến..."
                      className="w-full rounded-full border border-ocean-100 bg-ocean-50/40 py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                    />
                    <button
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-800/40 hover:text-deep-800"
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
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-50 text-ocean-600 transition-colors hover:bg-ocean-100"
                    aria-label="Mở tìm kiếm"
                  >
                    <Search className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-ocean-500" />
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      region === r ? "bg-ocean-500 text-white" : "bg-ocean-50 text-ocean-700 hover:bg-ocean-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </SectionReveal>

          <p className="mb-6 text-sm text-deep-800/55">
            Tìm thấy <span className="font-semibold text-ocean-700">{filtered.length}</span> tour phù hợp
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ocean-200 bg-white py-20 text-center">
              <p className="font-display text-lg font-semibold text-deep-900">Không tìm thấy tour phù hợp</p>
              <p className="mt-1 text-sm text-deep-800/55">Hãy thử từ khoá khác hoặc chọn lại điểm đến.</p>
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