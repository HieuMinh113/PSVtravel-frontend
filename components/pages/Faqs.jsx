"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircleQuestion, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ocean-100">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
      >
        <span className="font-semibold text-deep-900">{item.question}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-ocean-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p className="whitespace-pre-line px-5 pb-5 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faqs({ items = [] }) {
  const [open, setOpen] = useState(null); // id đang mở

  // Gom theo nhóm, giữ thứ tự xuất hiện
  const groups = [];
  const byKey = {};
  for (const it of items) {
    const key = it.category || "chung";
    if (!byKey[key]) {
      byKey[key] = { key, label: it.category_label || "Chung", list: [] };
      groups.push(byKey[key]);
    }
    byKey[key].list.push(it);
  }

  return (
    <div>
      <PageHero
        eyebrow="Hỗ trợ khách hàng"
        title="Câu hỏi thường gặp"
        description="Giải đáp nhanh những thắc mắc phổ biến về đặt tour, thanh toán, đổi huỷ và thủ tục visa. Chưa tìm thấy câu trả lời? Hãy liên hệ với chúng tôi."
        crumbs={[{ label: "Câu hỏi thường gặp" }]}
      />

      <section className="bg-foam py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {items.length === 0 ? (
            <SectionReveal className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-card backdrop-blur">
              <HelpCircle className="mx-auto h-10 w-10 text-ocean-300" />
              <p className="mt-4 text-ink-muted">Nội dung đang được cập nhật.</p>
            </SectionReveal>
          ) : (
            <div className="space-y-10">
              {groups.map((g) => (
                <div key={g.key}>
                  <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-deep-900">
                    <MessageCircleQuestion className="h-5 w-5 text-sunset-600" /> {g.label}
                  </h2>
                  <div className="space-y-3">
                    {g.list.map((it) => (
                      <FaqItem key={it.id} item={it} isOpen={open === it.id} onToggle={() => setOpen(open === it.id ? null : it.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <SectionReveal className="relative mt-14 overflow-hidden rounded-3xl bg-deep-gradient p-8 text-center sm:p-10">
            <div className="absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-75" />
            <div className="relative">
              <h2 className="font-display text-2xl font-bold text-white">Vẫn còn thắc mắc?</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
                Đội ngũ tư vấn của PSV Travel luôn sẵn sàng hỗ trợ bạn.
              </p>
              <Link href="/lien-he" className="btn-cta mt-6 !px-6 !py-3 text-sm">
                Liên hệ tư vấn <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
