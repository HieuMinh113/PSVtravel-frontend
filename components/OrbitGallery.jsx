"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useTime, useTransform } from "framer-motion";

/**
 * Vòng ảnh chạy quanh khối nội dung ở đầu trang — điểm nhấn thương hiệu.
 *
 * Quỹ đạo là hình BẦU DỤC: trục ngang bám bề rộng màn hình để ôm trọn khối
 * chữ và ô tìm kiếm, trục dọc bám chiều cao để ảnh trên/dưới không bị cắt.
 *
 * Từng ảnh tự chạy dọc theo quỹ đạo, KHÔNG xoay cả khung.
 * Xoay cả khung là cách viết cũ và nó sai về hình học: phép xoay đưa mỗi điểm
 * đi theo đường TRÒN bán kính bằng khoảng cách của nó tới tâm — ảnh nằm ở mép
 * ngang (cách tâm 560px) sau một phần tư vòng sẽ nhảy lên cao 560px, vượt khỏi
 * khung nhìn và bị cắt mất. Chỉ đúng khi quỹ đạo là hình tròn.
 */
function AnhTrenQuyDao({ src, alt, gocBanDau, radiusX, radiusY, duration, goc0 }) {
  const time = useTime();

  const goc = useTransform(time, (t) => gocBanDau + (t / (duration * 1000)) * 360);

  // Làm tròn vị trí về đúng điểm ảnh của màn hình. Ảnh nằm lệch nửa điểm ảnh
  // thì trình duyệt phải nội suy, ảnh nhỏ 96px trông nhoè hẳn đi. goc0 = toạ
  // độ góc trái-trên của ảnh khi chưa dịch (tâm khung căn giữa nên hay lẻ .5).
  const tron = (v, goc0Truc) => {
    // useTransform tính giá trị đầu ngay lúc dựng trang trên máy chủ — chưa có window
    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    return Math.round((goc0Truc + v) * dpr) / dpr - goc0Truc;
  };
  const x = useTransform(goc, (g) => tron(Math.cos((g * Math.PI) / 180) * radiusX, goc0.x));
  const y = useTransform(goc, (g) => tron(Math.sin((g * Math.PI) / 180) * radiusY, goc0.y));

  // Chưa đo xong khung (lúc máy chủ dựng HTML, trước khi JavaScript chạy):
  // đặt ảnh bằng CSS thuần — cos()/sin() nhân với bán kính do CSS tính — nên
  // ảnh nằm ĐÚNG chỗ ngay từ khung hình đầu tiên. Đo xong thì framer-motion
  // tiếp quản; useTime bắt đầu từ 0 nên góc lúc tiếp quản trùng góc ban đầu,
  // ảnh không giật.
  const daDo = radiusX != null;
  const viTriTinh = `translate(calc(cos(${gocBanDau}deg) * var(--rx)), calc(sin(${gocBanDau}deg) * var(--ry)))`;

  return (
    <motion.div
      className="orbit-anh absolute left-1/2 top-1/2 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/80"
      style={daDo ? { x, y } : { transform: viTriTinh }}
    >
      {/* Tải gấp đôi cỡ hiển thị + nén nhẹ (90): ảnh thu nhỏ từ bản lớn nét hơn
          hẳn bản vừa khít 96px nén 75 — mỗi ảnh vẫn chỉ vài chục KB */}
      <Image src={src} alt={alt} draggable={false} fill sizes="(max-width: 1023px) 136px, 192px" quality={90} className="object-cover" />
    </motion.div>
  );
}

const ALT_MAC_DINH = "Tour du lịch cùng PSV Travel";

export default function OrbitGallery({
  images,
  radiusLg = 210,
  radiusMd = 160,
  radiusSm = 108,
  cardSizeLg = 92,
  cardSizeMd = 76,
  cardSizeSm = 56,
  duration = 50,
  showCenter = true,
  showRing = true,
}) {
  // Vòng ảnh LUÔN chạy, kể cả khi máy khách bật "giảm chuyển động".
  //
  // Trước đây nó dừng hẳn theo thiết lập đó, nên máy tính nào tắt hiệu ứng động
  // trong Windows là vòng ảnh chết cứng — đúng thứ khách nhớ về thương hiệu lại
  // biến mất, mà chủ website không hề biết vì máy mình vẫn chạy bình thường.
  //
  // Vẫn giữ nguyên việc dừng các hiệu ứng MẠNH theo thiết lập đó: nền aurora
  // trôi, băng đánh giá chạy ngang, nhấp nháy (xem globals.css). Vòng này quay
  // 50 giây một vòng và nằm ở nền phía sau nên êm hơn hẳn.

  // KÍCH THƯỚC DO CSS TÍNH, không do JavaScript đo.
  //
  // Trước đây khung lấy cỡ desktop làm mặc định rồi đợi JavaScript đo màn
  // hình mới co lại. Trên điện thoại, HTML từ máy chủ vẽ khung rộng ~1200px,
  // 2–4 giây sau JavaScript chạy xong mới co về ~390px → cả đầu trang giật một
  // cái (CLS 0,50 — Google chấm "kém"), kèm cảnh báo lệch HTML khi hydrate.
  //
  // Nay cỡ ảnh, bán kính, giới hạn theo bề rộng/chiều cao màn hình đều viết
  // bằng CSS (lớp .orbit-khung trong globals.css) — đúng ngay từ khung hình
  // đầu. JavaScript chỉ ĐỌC lại khung đã vẽ để biết bán kính cho chuyển động.
  const khungRef = useRef(null);
  const [{ radiusX, radiusY, goc0 }, setDims] = useState({ radiusX: null, radiusY: null, goc0: { x: 0, y: 0 } });

  useEffect(() => {
    const khung = khungRef.current;
    if (!khung) return;
    const doLai = () => {
      const anh = khung.querySelector(".orbit-anh");
      const cardSize = anh ? anh.offsetWidth : 0;
      const r = khung.getBoundingClientRect();
      setDims({
        radiusX: (khung.offsetWidth - cardSize) / 2,
        radiusY: (khung.offsetHeight - cardSize) / 2,
        // góc trái-trên của ảnh khi chưa dịch (tâm khung − nửa ảnh) — để làm tròn vị trí
        goc0: { x: r.left + r.width / 2 - cardSize / 2, y: r.top + r.height / 2 - cardSize / 2 + window.scrollY },
      });
    };
    doLai();
    const ro = new ResizeObserver(doLai);
    ro.observe(khung);
    return () => ro.disconnect();
  }, []);

  // Mỗi ảnh là chuỗi URL hoặc { src, alt }. Có tên tour thì dùng làm alt: công
  // cụ SEO đếm ảnh thiếu alt (alt="" bị tính là thiếu) và Google Hình ảnh cũng
  // dựa vào alt. Vòng ảnh vẫn là trang trí nên lớp chứa nó đặt aria-hidden —
  // trình đọc màn hình không đọc lại một loạt tên tour.
  const dsAnh = images.map((a) =>
    typeof a === "string" ? { src: a, alt: ALT_MAC_DINH } : { src: a.src, alt: a.alt || ALT_MAC_DINH }
  );
  const angleStep = 360 / dsAnh.length;

  return (
    <div
      ref={khungRef}
      className="orbit-khung relative mx-auto max-w-full"
      style={{
        "--r-sm": `${radiusSm}px`,
        "--r-md": `${radiusMd}px`,
        "--r-lg": `${radiusLg}px`,
        "--card-sm": `${cardSizeSm}px`,
        "--card-md": `${cardSizeMd}px`,
        "--card-lg": `${cardSizeLg}px`,
      }}
    >
      {/* Đường dẫn hướng mờ phía sau, cho thấy quỹ đạo */}
      {showRing && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-white/25"
          style={{ width: "calc(var(--rx) * 2)", height: "calc(var(--ry) * 2)" }}
        />
      )}

      {dsAnh.map(({ src, alt }, i) => (
        <AnhTrenQuyDao
          key={src + i}
          src={src}
          alt={alt}
          gocBanDau={angleStep * i}
          radiusX={radiusX}
          radiusY={radiusY}
          duration={duration}
          goc0={goc0}
        />
      ))}

      {/* Tâm vòng — tắt khi dùng làm nền bao quanh nội dung khác */}
      {showCenter && (
        <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-xl sm:h-24 sm:w-24">
          <span className="text-center font-display text-xs font-bold leading-tight text-ocean-700 sm:text-sm">
            PSV
            <br />
            Travel
          </span>
        </div>
      )}
    </div>
  );
}
