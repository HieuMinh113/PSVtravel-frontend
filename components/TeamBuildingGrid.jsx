"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Users, Clock, MapPin, ArrowRight, PartyPopper, Star } from "lucide-react";

// Nhãn đối tượng — khớp với App\Models\Event::DOI_TUONG bên backend
const DOI_TUONG = {
  "gia-dinh": "Gia đình",
  "doanh-nghiep": "Doanh nghiệp",
  "ca-nhan": "Cá nhân",
};

// Lưới các gói + bộ lọc theo đối tượng. Là client component để lọc ngay trên
// trình duyệt, nhưng toàn bộ thẻ vẫn được dựng sẵn trong HTML (Next render sẵn
// client component ở phía máy chủ) nên Google vẫn đọc đủ nội dung.
export default function TeamBuildingGrid({ events = [] }) {
  const [loc, setLoc] = useState("all");

  // Chỉ hiện tab của những đối tượng thực sự có gói — tránh tab rỗng
  const tabs = useMemo(() => {
    const co = new Set();
    events.forEach((e) => (e.audience || []).forEach((a) => co.add(a)));
    return ["all", ...Object.keys(DOI_TUONG).filter((k) => co.has(k))];
  }, [events]);

  const danhSach =
    loc === "all" ? events : events.filter((e) => (e.audience || []).includes(loc));

  return (
    <div>
      {tabs.length > 2 && (
        <div className="mt-7 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setLoc(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                loc === t
                  ? "bg-ocean-600 text-white"
                  : "bg-white text-ocean-700 ring-1 ring-ocean-100 hover:bg-ocean-50"
              }`}
            >
              {t === "all" ? "Tất cả" : DOI_TUONG[t]}
            </button>
          ))}
        </div>
      )}

      <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {danhSach.map((e) => (
          <Link
            key={e.slug}
            href={`/team-building/${e.slug}`}
            className="card-surface group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-ocean-100">
              {e.image ? (
                <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-ocean-300">
                  <PartyPopper className="h-12 w-12" />
                </div>
              )}
              {e.featured && (
                <span className="absolute left-3 top-3 rounded-full bg-sunset-500 px-3 py-1 text-xs font-bold text-white shadow">Nổi bật</span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              {e.audience?.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {e.audience.map((a) => (
                    <span key={a} className="rounded-full bg-ocean-50 px-2.5 py-0.5 text-xs font-semibold text-ocean-700">
                      {DOI_TUONG[a] || a}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-deep-900 group-hover:text-ocean-700">{e.title}</h3>
              </div>
              {e.reviewCount > 0 && (
                <div className="mt-1 flex items-center gap-1 text-xs text-ink-subtle">
                  <Star className="h-3.5 w-3.5 fill-sunset-400 text-sunset-400" />
                  <span className="font-semibold text-deep-900">{e.rating}</span>
                  <span>({e.reviewCount})</span>
                </div>
              )}
              {e.summary && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{e.summary}</p>}

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-subtle">
                {e.groupSize && <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5 text-ocean-500" /> {e.groupSize}</span>}
                {e.duration && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-ocean-500" /> {e.duration}</span>}
                {e.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-ocean-500" /> {e.location}</span>}
              </div>

              <div className="mt-auto flex items-end justify-between pt-4">
                <span className="font-display text-base font-bold text-sunset-700">{e.priceNote || "Liên hệ báo giá"}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-ocean-700">
                  Xem chi tiết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
