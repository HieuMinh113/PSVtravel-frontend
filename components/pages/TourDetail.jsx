"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, MapPin, CalendarDays, Users2, Check, Phone, ShieldCheck,
  ChevronDown, Plane, ArrowRight, Baby,
  User, Mail, Quote, CheckCircle2, Images, X, FileCheck2, Clock,
  BadgeCheck, HelpCircle, Search, SlidersHorizontal,
} from "lucide-react";
import { createBooking } from "@/app/lib/api";
import { formatVND } from "@/data/tours";
import { getVisaInfo } from "@/data/visa";
import { domesticRegions, abroadRegions } from "@/data/filters";
import { FlagThailand, FlagKorea, FlagJapan, FlagSingapore, FlagChina, FlagTaiwan } from "@/components/FlagIcons";
import TourCard from "@/components/TourCard";
import SectionReveal from "@/components/SectionReveal";

const flagBySlug = {
  "Thái Lan": FlagThailand,
  "Hàn Quốc": FlagKorea,
  "Nhật Bản": FlagJapan,
  "Singapore": FlagSingapore,
  "Trung Quốc": FlagChina,
  "Đài Loan": FlagTaiwan,
};

const tourFaqs = (tour, isAbroad) => [
  {
    q: "Tôi có thể huỷ hoặc đổi lịch khởi hành không?",
    a: "Có. Bạn có thể đổi ngày khởi hành miễn phí nếu báo trước 7 ngày. Huỷ tour trước 5 ngày được hoàn 80% giá trị, chi tiết theo chính sách huỷ tour từng thời điểm.",
  },
  {
    q: "Hình thức thanh toán như thế nào?",
    a: "Bạn có thể đặt cọc 30% để giữ chỗ và thanh toán phần còn lại trước ngày khởi hành 3 ngày, qua chuyển khoản, ví điện tử hoặc tại văn phòng.",
  },
  {
    q: "Trẻ em đi cùng có được giảm giá không?",
    a: "Trẻ em dưới 12 tuổi được tính 60% giá tour người lớn (đã áp dụng sẵn khi bạn chọn số lượng trẻ em ở phần đặt tour bên trên).",
  },
  ...(isAbroad
    ? [{
        q: "Tôi cần chuẩn bị visa như thế nào cho tour này?",
        a: `Với tour ${tour.country}, xem chi tiết yêu cầu visa ở phần "Hướng dẫn visa" phía trên. Đội ngũ PSVTravel hỗ trợ trọn gói thủ tục nếu bạn cần.`,
      }]
    : []),
  {
    q: "Giá tour đã bao gồm vé máy bay chưa?",
    a: "Đã bao gồm vé máy bay khứ hồi và các khoản thuế phí sân bay theo đúng như mục Chính sách giá tour ở trên.",
  },
];

function ItineraryItem({ day, index, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ocean-100 bg-white">
      <button onClick={onToggle} className="flex w-full items-center gap-4 p-5 text-left">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-500 font-display text-sm font-bold text-white">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-ocean-600">{day.day}</p>
          <p className="font-display text-base font-semibold text-deep-900">{day.title}</p>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 text-ink-subtle" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-5 pb-5 sm:pl-[4.25rem]">
              <p className="text-sm leading-relaxed text-ink-muted">{day.desc}</p>
              {day.images && day.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5">
                  {day.images.slice(0, 3).map((img, k) => (
                    <img
                      key={k}
                      src={img}
                      alt={`${day.title} - ảnh ${k + 1}`}
                      loading="lazy"
                      className="h-24 w-full rounded-xl object-cover sm:h-32"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewCard({ r, index }) {
  const initial = (r.name || "?").trim().charAt(0).toUpperCase();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="card-surface flex flex-col overflow-hidden"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-100 font-display text-sm font-bold text-ocean-700">
            {initial}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-deep-900">{r.name}</p>
            <p className="text-xs text-ink-subtle">{r.date}</p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: r.rating || 0 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
            ))}
          </div>
        </div>
        <Quote className="mt-3 h-4 w-4 text-ocean-200" />
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink">{r.comment}</p>
        {r.reply && (
          <div className="mt-3 rounded-xl bg-ocean-50/70 p-3">
            <p className="text-xs font-semibold text-ocean-700">Phản hồi từ PSV Travel</p>
            <p className="mt-1 text-sm text-ink-muted">{r.reply}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-ocean-100 bg-white">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5">
        <span className="flex items-start gap-2.5 font-display text-sm font-semibold text-deep-900 sm:text-base">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" />
          {item.q}
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 shrink-0 text-ocean-500" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-4 pb-4 pl-11 text-sm leading-relaxed text-ink-muted sm:px-5 sm:pb-5">{item.a}</p>
      </motion.div>
    </div>
  );
}

export default function TourDetail({ basePath, tour, related = [] }) {
  const router = useRouter();
  const [openDay, setOpenDay] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [form, setForm] = useState({ name: "", contact: "" });
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [depId, setDepId] = useState(tour?.departures?.[0]?.id ?? null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const [detailSearchOpen, setDetailSearchOpen] = useState(false);
  const [detailQuery, setDetailQuery] = useState("");

  const [askForm, setAskForm] = useState({ name: "", phone: "" });
  const [askSubmitted, setAskSubmitted] = useState(false);

  const handleDetailSearch = (e) => {
    e.preventDefault();
    if (!detailQuery.trim()) return;
    // Về đúng trang tương ứng: tour đang xem là trong nước thì về Tour trong nước,
    // là nước ngoài thì về Tour nước ngoài — dựa theo basePath của chính trang đang xem.
    router.push(`${basePath}?q=${encodeURIComponent(detailQuery.trim())}&scroll=1`);
  };

  // Danh mục lọc đổi theo loại tour đang xem — trong nước hiện vùng miền, nước ngoài hiện quốc gia
  const detailRegions = basePath === "/tour-trong-nuoc" ? domesticRegions : abroadRegions;
  const handleDetailRegion = (r) => {
    router.push(`${basePath}?region=${encodeURIComponent(r)}&scroll=1`);
  };

  useEffect(() => {
    const onScroll = () => setShowMobileBar(window.scrollY > 520);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const galleryImages = useMemo(() => {
    if (!tour) return [];
    const fromApi = (tour.images || []).filter(Boolean);
    return [...new Set([tour.image, ...fromApi].filter(Boolean))].slice(0, 6);
  }, [tour]);

  const dayImages = useMemo(() => {
    if (!tour || galleryImages.length === 0) return [];
    const count = Math.min(3, galleryImages.length);
    return tour.itinerary.map((_, i) =>
      Array.from({ length: count }, (_, k) => galleryImages[(i + 1 + k) % galleryImages.length])
    );
  }, [tour, galleryImages]);

  const reviews = tour?.reviewsList ?? [];
  const visaInfo = useMemo(() => (tour?.country ? getVisaInfo(tour.country) : null), [tour]);
  const VisaFlag = tour?.country ? flagBySlug[tour.country] : null;
  const faqs = useMemo(() => (tour ? tourFaqs(tour, !!tour.country) : []), [tour]);

  if (!tour) return notFound();

  const childPrice = tour.childPrice ?? Math.round((tour.price * 0.6) / 1000) * 1000;
  const total = adults * tour.price + children * childPrice;

  const scrollToBooking = () => {
    document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.contact.trim()) {
      setFormError("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const res = await createBooking({
        tour_id: tour.id,
        tour_departure_id: depId,
        customer_name: form.name.trim(),
        customer_phone: form.contact.trim(),
        adults,
        children,
      });
      setBookingCode(res?.data?.booking_code || "");
      setSubmitted(true);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (!askForm.name.trim() || !askForm.phone.trim()) return;
    setAskSubmitted(true);
  };

  return (
    <div>
      {/* Hero ảnh lớn */}
      <section className="relative h-[62dvh] min-h-[460px] overflow-hidden">
        <Image src={tour.image} alt={tour.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep-950/80 via-deep-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-950/85 via-deep-950/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/60">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <Link href={basePath} className="hover:text-white">
              {basePath === "/tour-trong-nuoc" ? "Tour trong nước" : "Tour nước ngoài"}
            </Link>
            <span>/</span>
            <span className="text-white/85">{tour.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-ocean-200">
            <MapPin className="h-4 w-4" /> {tour.region} {tour.country ? `· ${tour.country}` : ""}
          </div>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl">{tour.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/75">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-teal-400 text-teal-400" /> {tour.rating} ({tour.reviews} đánh giá)</span>
            <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {tour.days}</span>
            <span className="flex items-center gap-1"><Plane className="h-4 w-4" /> {tour.departure}</span>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-deep-950/90 p-6 backdrop-blur-sm"
          >
            <button onClick={() => setLightboxImg(null)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Đóng">
              <X className="h-5 w-5" />
            </button>
            <motion.img initial={{ scale: 0.95 }} animate={{ scale: 1 }} src={lightboxImg} alt={tour.name} onClick={(e) => e.stopPropagation()} className="max-h-[85dvh] max-w-full rounded-2xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-foam py-10 sm:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_380px]">
          {/* Nội dung chính */}
          <div>
            {/* Tìm tour khác — giống thanh lọc ở trang danh sách, tự đổi danh mục theo loại tour đang xem */}
            <SectionReveal className="sticky top-20 z-20 mb-6 rounded-2xl border border-ocean-100 bg-white/90 p-3 shadow-sm backdrop-blur-lg sm:p-4">
              <div className="flex flex-wrap items-center gap-3">
                <AnimatePresence mode="wait" initial={false}>
                  {detailSearchOpen ? (
                    <motion.form
                      key="input"
                      onSubmit={handleDetailSearch}
                      initial={{ width: 40, opacity: 0 }}
                      animate={{ width: 240, opacity: 1 }}
                      exit={{ width: 40, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="relative shrink-0 overflow-hidden"
                    >
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input
                        autoFocus
                        value={detailQuery}
                        onChange={(e) => setDetailQuery(e.target.value)}
                        placeholder="Tìm tour hoặc điểm đến khác..."
                        className="w-full rounded-full border border-ocean-100 bg-ocean-50/40 py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => { setDetailSearchOpen(false); setDetailQuery(""); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-deep-800"
                        aria-label="Đóng tìm kiếm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.button
                      key="icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setDetailSearchOpen(true)}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-50 text-ocean-600 transition-colors hover:bg-ocean-100"
                      aria-label="Tìm tour khác"
                    >
                      <Search className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 shrink-0 text-ocean-500" />
                  {detailRegions.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleDetailRegion(r)}
                      className="flex-1 whitespace-nowrap rounded-full bg-ocean-50 px-3.5 py-1.5 text-center text-xs font-semibold text-ocean-700 transition-colors hover:bg-ocean-100"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal className="card-surface p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold text-deep-900">Điểm nổi bật của hành trình</h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2.5 rounded-xl bg-ocean-50/60 p-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600" />
                    <span className="text-sm text-ink">{h}</span>
                  </div>
                ))}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1} className="mt-8">
              <h2 className="font-display text-xl font-bold text-deep-900">Lịch trình chi tiết</h2>
              <p className="mt-1 text-sm text-ink-subtle">Kèm hình ảnh thực tế các điểm đến, món ăn theo từng ngày.</p>
              <div className="mt-5 space-y-3">
                {tour.itinerary.map((day, i) => (
                  <ItineraryItem key={day.day} day={{ ...day, images: dayImages[i] }} index={i} isOpen={openDay === i} onToggle={() => setOpenDay(openDay === i ? -1 : i)} />
                ))}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15} className="mt-8 card-surface p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold text-deep-900">Chính sách giá tour</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-ocean-700">Giá tour bao gồm</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-ocean-500" /> Vé máy bay khứ hồi, thuế phí</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-ocean-500" /> Khách sạn theo tiêu chuẩn tour</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-ocean-500" /> Xe đưa đón, hướng dẫn viên</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-ocean-500" /> Bảo hiểm du lịch trọn tour</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-rose-600">Giá tour không bao gồm</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
                    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 shrink-0 text-center text-rose-400">–</span> Chi phí cá nhân ngoài chương trình</li>
                    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 shrink-0 text-center text-rose-400">–</span> Phụ thu phòng đơn (nếu có)</li>
                    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 shrink-0 text-center text-rose-400">–</span> Tiền tip cho HDV, tài xế</li>
                  </ul>
                </div>
              </div>
            </SectionReveal>

            {/* ===== HƯỚNG DẪN VISA — chỉ hiện với tour nước ngoài ===== */}
            {visaInfo && (
              <SectionReveal delay={0.2} className="mt-8 card-surface overflow-hidden">
                <div className="flex items-center gap-3 bg-gradient-to-r from-ocean-500 to-teal-500 px-6 py-4 text-white">
                  {VisaFlag && <VisaFlag className="h-7 w-10 rounded shadow-sm ring-1 ring-white/30" />}
                  <div>
                    <p className="font-display text-base font-bold">Hướng dẫn visa {tour.country}</p>
                    <p className="text-xs text-white/80">Thông tin cần biết trước khi khởi hành</p>
                  </div>
                </div>

                {visaInfo.required ? (
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-ink-muted"><Clock className="h-4 w-4 text-ocean-500" /> Thời gian xử lý: <strong className="text-deep-900">{visaInfo.time}</strong></span>
                      <span className="flex items-center gap-1.5 text-ink-muted"><BadgeCheck className="h-4 w-4 text-teal-500" /> Tỷ lệ đậu: <strong className="text-deep-900">{visaInfo.rate}</strong></span>
                      <span className="flex items-center gap-1.5 text-ink-muted"><FileCheck2 className="h-4 w-4 text-ocean-500" /> Phí dịch vụ từ: <strong className="text-deep-900">{visaInfo.price}</strong></span>
                    </div>
                    <Link href="/lam-visa" className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-ocean-50 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-100">
                      Xem dịch vụ làm visa <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-teal-700">
                      <BadgeCheck className="h-5 w-5 text-teal-500" /> {visaInfo.note}
                    </span>
                    <span className="text-xs text-ink-subtle">Vui lòng kiểm tra hộ chiếu còn hạn tối thiểu 6 tháng.</span>
                  </div>
                )}
              </SectionReveal>
            )}
          </div>

          {/* Sidebar đặt tour — sticky cả khi lướt lên/xuống trên desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              id="booking-card"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-surface scroll-mt-24 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-ocean-500 to-teal-500 p-5 text-white">
                <p className="text-xs font-medium text-white/85">Chỉ còn {tour.seatsLeft} chỗ trống</p>
                <div className="mt-1 flex items-baseline gap-2">
                  {tour.oldPrice && <span className="text-sm text-white/60 line-through">{formatVND(tour.oldPrice)}</span>}
                  <span className="font-display text-3xl font-bold">{formatVND(tour.price)}</span>
                </div>
                <p className="text-xs text-white/80">/ khách người lớn · khởi hành {tour.startDate}</p>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center px-6 py-10 text-center">
                    <CheckCircle2 className="h-12 w-12 text-teal-500" />
                    <p className="mt-3 font-display text-base font-bold text-deep-900">Đã gửi yêu cầu giữ chỗ!</p>
                    <p className="mt-1.5 text-sm text-ink-muted">Tư vấn viên sẽ liên hệ {form.name} qua {form.contact} trong 15 phút để xác nhận.</p>
                    {bookingCode && (
                      <p className="mt-2 rounded-lg bg-ocean-50 px-3 py-2 text-sm font-semibold text-ocean-700">Mã đơn: {bookingCode}</p>
                    )}
                    <button onClick={() => setSubmitted(false)} className="mt-5 text-sm font-semibold text-ocean-600 hover:text-ocean-700">Đặt thêm yêu cầu khác</button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-5">
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Họ và tên</label>
                      <div className="relative mt-1.5">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Số điện thoại</label>
                      <div className="relative mt-1.5">
                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                        <input value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} placeholder="09xx xxx xxx" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Ngày khởi hành</label>
                      {tour.departures && tour.departures.length > 0 ? (
                        <div className="relative mt-1.5">
                          <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
                          <select
                            value={depId ?? ""}
                            onChange={(e) => setDepId(Number(e.target.value))}
                            className="w-full appearance-none rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ocean-400 focus:bg-white"
                          >
                            {tour.departures.map((d) => (
                              <option key={d.id} value={d.id}>{d.startDate} · còn {d.seatsLeft} chỗ</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2.5 text-sm">
                          <CalendarDays className="h-4 w-4 text-ocean-500" /> {tour.startDate || "Liên hệ để biết lịch"}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Người lớn</label>
                      <div className="mt-1.5 flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2">
                        <span className="flex items-center gap-2 text-sm"><Users2 className="h-4 w-4 text-ocean-500" /> {formatVND(tour.price)}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setAdults((g) => Math.max(1, g - 1))} className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow hover:bg-ocean-100">−</button>
                          <span className="w-4 text-center text-sm font-semibold">{adults}</span>
                          <button onClick={() => setAdults((g) => Math.min((tour.seatsLeft || 99), g + 1))} className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow hover:bg-ocean-100">+</button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ink-muted">Trẻ em (dưới 12 tuổi)</label>
                      <div className="mt-1.5 flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2">
                        <span className="flex items-center gap-2 text-sm"><Baby className="h-4 w-4 text-teal-500" /> {formatVND(childPrice)}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setChildren((g) => Math.max(0, g - 1))} className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow hover:bg-ocean-100">−</button>
                          <span className="w-4 text-center text-sm font-semibold">{children}</span>
                          <button onClick={() => setChildren((g) => g + 1)} className="tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow hover:bg-ocean-100">+</button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-ocean-100 pt-4 text-sm">
                      <span className="text-ink-muted">Tạm tính</span>
                      <span className="font-display text-lg font-bold text-ocean-700">{formatVND(total)}</span>
                    </div>
                    {formError && <p className="text-xs font-medium text-rose-600">{formError}</p>}
                    <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-cta w-full !py-3.5 disabled:opacity-60">
                      {submitting ? "Đang gửi..." : <>Đặt tour ngay <ArrowRight className="h-4 w-4" /></>}
                    </button>
                    <a href="tel:19001177" className="flex w-full items-center justify-center gap-2 rounded-full border border-ocean-200 py-3 text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-50">
                      <Phone className="h-4 w-4" /> Gọi tư vấn: 1900 1177
                    </a>
                    <p className="flex items-center gap-2 text-xs text-ink-subtle"><ShieldCheck className="h-4 w-4 text-ocean-500" /> Thanh toán an toàn, hoàn tiền nếu tour bị huỷ</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ẢNH THỰC TẾ (đã chuyển xuống dưới nội dung tour) ===== */}
      <section className="bg-foam pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-muted">
            <Images className="h-4 w-4 text-ocean-500" /> Hình ảnh thực tế của hành trình
          </SectionReveal>
          <SectionReveal delay={0.05} className="grid grid-cols-4 grid-rows-2 gap-2.5 sm:gap-3">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxImg(img)}
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
              >
                <img
                  src={img}
                  alt={`${tour.name} - ảnh ${i + 1}`}
                  loading="lazy"
                  className="h-full min-h-[100px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-deep-950/0 transition-colors duration-300 group-hover:bg-deep-950/15" />
              </button>
            ))}
          </SectionReveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-ocean-50/50 py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionReveal className="mb-8 font-display text-2xl font-bold text-deep-900">Tour cùng khu vực bạn có thể thích</SectionReveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t, i) => (
                <TourCard key={t.slug} tour={t} basePath={basePath} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ + FORM HỎI THÊM ===== */}
      <section className="bg-foam py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1.3fr_1fr]">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-500">Giải đáp</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-deep-900 sm:text-3xl">Câu hỏi thường gặp</h2>
            <div className="mt-6 space-y-3">
              {faqs.map((f, i) => (
                <FaqItem key={f.q} item={f} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1} className="card-surface h-fit p-6 sm:p-7">
            <AnimatePresence mode="wait">
              {askSubmitted ? (
                <motion.div key="ask-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8 text-center">
                  <CheckCircle2 className="h-11 w-11 text-teal-500" />
                  <p className="mt-3 font-display text-base font-bold text-deep-900">Đã ghi nhận câu hỏi của bạn!</p>
                  <p className="mt-1.5 text-sm text-ink-muted">Tư vấn viên sẽ gọi lại cho {askForm.name} sớm nhất.</p>
                  <button onClick={() => { setAskSubmitted(false); setAskForm({ name: "", phone: "" }); }} className="mt-5 text-sm font-semibold text-ocean-600 hover:text-ocean-700">
                    Gửi câu hỏi khác
                  </button>
                </motion.div>
              ) : (
                <motion.form key="ask-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleAskSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-deep-900">Vẫn còn thắc mắc?</h3>
                    <p className="mt-1 text-sm text-ink-muted">Để lại thông tin, tư vấn viên sẽ liên hệ giải đáp miễn phí.</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Họ và tên</label>
                    <div className="relative mt-1.5">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input required value={askForm.name} onChange={(e) => setAskForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Số điện thoại</label>
                    <div className="relative mt-1.5">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                      <input required value={askForm.phone} onChange={(e) => setAskForm((f) => ({ ...f, phone: e.target.value }))} placeholder="09xx xxx xxx" className="w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-muted">Câu hỏi của bạn (không bắt buộc)</label>
                    <textarea rows={3} placeholder="Ví dụ: Tour có hỗ trợ ăn chay không?" className="mt-1.5 w-full resize-none rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-ocean-400 focus:bg-white" />
                  </div>
                  <button type="submit" className="btn-cta w-full !py-3">Gửi câu hỏi <ArrowRight className="h-4 w-4" /></button>
                </motion.form>
              )}
            </AnimatePresence>
          </SectionReveal>
        </div>
      </section>

      {/* ===== ĐÁNH GIÁ TỪ KHÁCH HÀNG ===== */}
      <section className="bg-ocean-50/50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-500">Trải nghiệm thực tế</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-deep-900 sm:text-3xl">Đánh giá từ khách hàng</h2>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-sm">
              <Star className="h-5 w-5 fill-teal-500 text-teal-500" />
              <span className="font-display text-xl font-bold text-deep-900">{tour.rating}</span>
              <span className="text-sm text-ink-subtle">/5 · {tour.reviews} đánh giá</span>
            </div>
          </SectionReveal>
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ocean-200 bg-white py-12 text-center text-sm text-ink-muted">
              Chưa có đánh giá cho tour này.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r, i) => (
                <ReviewCard key={r.name + i} r={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ===== THANH ĐẶT TOUR NỔI TRÊN MOBILE — luôn theo khi cuộn trang ===== */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-ocean-100 bg-white/95 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-4 pr-16 shadow-[0_-8px_30px_rgba(7,30,51,0.12)] backdrop-blur-lg lg:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {tour.oldPrice && <p className="truncate text-xs text-ink-subtle line-through">{formatVND(tour.oldPrice)}</p>}
                <p className="truncate font-display text-lg font-bold text-ocean-700">{formatVND(tour.price)}</p>
              </div>
              <button
                onClick={scrollToBooking}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-ocean-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-glow"
              >
                Đặt tour ngay <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
