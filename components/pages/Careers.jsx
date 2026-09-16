"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, MapPin, Clock, Wallet, ArrowRight, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

function ngayVietNam(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function Careers({ items = [] }) {
  return (
    <div>
      <PageHero
        eyebrow="Cơ hội nghề nghiệp"
        title="Tuyển dụng tại PSV Travel"
        description="Gia nhập đội ngũ PSV Travel — nơi bạn được phát triển cùng những hành trình và con người tuyệt vời."
        crumbs={[{ label: "Tuyển dụng" }]}
      />

      <section className="bg-foam py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {items.length === 0 ? (
            <SectionReveal className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-card backdrop-blur">
              <Briefcase className="mx-auto h-10 w-10 text-ocean-300" />
              <p className="mt-4 text-ink-muted">
                Hiện chưa có vị trí tuyển dụng. Bạn có thể gửi hồ sơ ứng tuyển tự do qua trang liên hệ.
              </p>
              <Link href="/lien-he" className="btn-cta mt-6 !px-6 !py-3 text-sm">
                Gửi hồ sơ <ArrowRight className="h-4 w-4" />
              </Link>
            </SectionReveal>
          ) : (
            <div className="space-y-4">
              {items.map((j, i) => (
                <motion.div
                  key={j.slug ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/tuyen-dung/${j.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ocean-100 transition-shadow hover:shadow-deep sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-deep-900">{j.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
                        {j.department && <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-ocean-500" /> {j.department}</span>}
                        {j.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-ocean-500" /> {j.location}</span>}
                        {j.employment_type && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-ocean-500" /> {j.employment_type}</span>}
                        {j.salary_range && <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-teal-600" /> {j.salary_range}</span>}
                        {j.quantity ? <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5 text-ocean-500" /> {j.quantity} người</span> : null}
                      </div>
                      {j.deadline && (
                        <p className="mt-2 text-xs font-medium text-sunset-700">Hạn nộp: {ngayVietNam(j.deadline)}</p>
                      )}
                    </div>
                    <span className="btn-cta shrink-0 !px-5 !py-2.5 text-sm">
                      Ứng tuyển <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
