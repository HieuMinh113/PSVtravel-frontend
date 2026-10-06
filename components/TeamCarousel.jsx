"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Carousel 3D giới thiệu đội ngũ.
//
// Chuyển thể từ mẫu "circular-testimonials" (vốn viết TypeScript + react-icons)
// sang JavaScript + lucide-react + framer-motion cho khớp dự án, và đổi màu theo
// tông xanh của web. Dữ liệu là các thành viên đội ngũ do admin thêm (họ tên,
// chức vụ, email, ảnh, giới thiệu ngắn).

function tinhKhoangCach(width) {
  const minW = 1024, maxW = 1456, minGap = 40, maxGap = 72;
  if (width <= minW) return minGap;
  if (width >= maxW) return maxGap;
  return minGap + (maxGap - minGap) * ((width - minW) / (maxW - minW));
}

export default function TeamCarousel({ members = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1000);
  const imageRef = useRef(null);
  const autoRef = useRef(null);

  const soLuong = members.length;
  const active = members[activeIndex] || null;

  useEffect(() => {
    const doLai = () => imageRef.current && setContainerWidth(imageRef.current.offsetWidth);
    doLai();
    window.addEventListener("resize", doLai);
    return () => window.removeEventListener("resize", doLai);
  }, []);

  // Tự chạy — chỉ khi có nhiều hơn 1 người
  useEffect(() => {
    if (soLuong <= 1) return;
    autoRef.current = setInterval(() => setActiveIndex((p) => (p + 1) % soLuong), 5000);
    return () => autoRef.current && clearInterval(autoRef.current);
  }, [soLuong]);

  const next = useCallback(() => {
    setActiveIndex((p) => (p + 1) % soLuong);
    if (autoRef.current) clearInterval(autoRef.current);
  }, [soLuong]);
  const prev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + soLuong) % soLuong);
    if (autoRef.current) clearInterval(autoRef.current);
  }, [soLuong]);

  function kieuAnh(index) {
    const gap = tinhKhoangCach(containerWidth);
    const stickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + soLuong) % soLuong === index;
    const isRight = (activeIndex + 1) % soLuong === index;
    const base = { transition: "all 0.7s cubic-bezier(.4,2,.3,1)" };
    if (isActive) return { ...base, zIndex: 3, opacity: 1, transform: "translateX(0) translateY(0) scale(1) rotateY(0deg)" };
    if (isLeft) return { ...base, zIndex: 2, opacity: 1, transform: `translateX(-${gap}px) translateY(-${stickUp}px) scale(0.85) rotateY(15deg)` };
    if (isRight) return { ...base, zIndex: 2, opacity: 1, transform: `translateX(${gap}px) translateY(-${stickUp}px) scale(0.85) rotateY(-15deg)` };
    return { ...base, zIndex: 1, opacity: 0, pointerEvents: "none" };
  }

  const chuDau = (t) => (t || "?").trim().charAt(0).toUpperCase();

  if (soLuong === 0 || !active) return null;

  const nhieuNguoi = soLuong > 1;

  return (
    <div className="tc-wrap">
      <div className="tc-grid">
        {/* Ảnh */}
        <div className="tc-images" ref={imageRef}>
          {members.map((m, index) => (
            <div key={m.id ?? index} className="tc-slide" style={kieuAnh(index)}>
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="tc-img" />
              ) : (
                <div className="tc-img tc-fallback">{chuDau(m.name)}</div>
              )}
            </div>
          ))}
        </div>

        {/* Nội dung */}
        <div className="tc-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="tc-name">{active.name}</h3>
              <p className="tc-position">{active.position}</p>
              {active.email && (
                <a href={`mailto:${active.email}`} className="tc-email">
                  <Mail className="h-4 w-4" /> {active.email}
                </a>
              )}
              {active.bio && (
                <p className="tc-bio">
                  {active.bio.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * i }}
                      style={{ display: "inline-block" }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {nhieuNguoi && (
            <div className="tc-arrows">
              <button
                type="button"
                className="tc-arrow"
                onClick={prev}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
                style={{ backgroundColor: hoverPrev ? "#0a5a63" : "#0e6b74" }}
                aria-label="Người trước"
              >
                <ArrowLeft className="h-5 w-5" color="#fff" />
              </button>
              <button
                type="button"
                className="tc-arrow"
                onClick={next}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                style={{ backgroundColor: hoverNext ? "#0a5a63" : "#0e6b74" }}
                aria-label="Người tiếp theo"
              >
                <ArrowRight className="h-5 w-5" color="#fff" />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .tc-wrap { width: 100%; max-width: 56rem; margin: 0 auto; padding: 1rem; }
        .tc-grid { display: grid; gap: 3rem; align-items: center; }
        .tc-images { position: relative; width: 100%; height: 22rem; perspective: 1000px; }
        .tc-slide { position: absolute; inset: 0; }
        .tc-img { width: 100%; height: 100%; object-fit: cover; border-radius: 1.25rem;
          box-shadow: 0 12px 34px rgba(1,60,90,.22); }
        .tc-fallback { display: flex; align-items: center; justify-content: center;
          font-size: 5rem; font-weight: 700; color: #fff;
          background: linear-gradient(135deg, #0e6b74, #12b39b); }
        .tc-content { display: flex; flex-direction: column; justify-content: center; text-align: center; }
        .tc-name { font-weight: 700; font-size: 1.6rem; color: #1b2531; margin: 0; }
        .tc-position { color: #0e6b74; font-weight: 600; font-size: 1rem; margin: .35rem 0 0; }
        .tc-email { display: inline-flex; align-items: center; gap: .4rem; margin: .8rem auto 0;
          color: #55606f; font-size: .9rem; text-decoration: none; }
        .tc-email:hover { color: #0e6b74; }
        .tc-bio { color: #55606f; font-size: 1rem; line-height: 1.7; margin: 1.1rem 0 0; }
        .tc-arrows { display: flex; gap: 1rem; justify-content: center; padding-top: 2rem; }
        .tc-arrow { width: 2.7rem; height: 2.7rem; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; cursor: pointer; border: none;
          transition: background-color .3s; }
        @media (min-width: 768px) {
          .tc-grid { grid-template-columns: 1fr 1fr; }
          .tc-content { text-align: left; }
          .tc-email { margin-left: 0; margin-right: auto; }
          .tc-arrows { justify-content: flex-start; padding-top: 0; }
        }
      `}</style>
    </div>
  );
}
