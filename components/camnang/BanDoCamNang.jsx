"use client";
// Bản đồ cẩm nang: quả địa cầu → nước → thành phố → điểm → bài cẩm nang.
//
// Cách dựng:
//  - MapLibre GL (mã nguồn mở) nạp lúc chạy từ /vendor — không đóng vào gói JS
//    chung, trang khác không phải tải. Chưa tải xong vẫn có danh sách nước /
//    thành phố / điểm (dựng sẵn từ máy chủ) để bấm.
//  - Ghim là <button> thật gắn vào bản đồ: bấm được bằng bàn phím, đọc được
//    bằng trình đọc màn hình, đủ 44px để bấm trên điện thoại.
//  - Trạng thái nằm trên địa chỉ trang (?nuoc=…&tp=…&diem=…): chia sẻ link mở
//    đúng chỗ, nút Back của trình duyệt lùi từng bước.
//  - Người dùng bật "giảm chuyển động": không xoay quả địa cầu, camera nhảy
//    thẳng tới nơi thay vì bay.
//  - Máy không chạy được bản đồ 3D (không có WebGL2): vẫn duyệt bằng danh sách.

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, BookOpen, ChevronRight, Earth, Maximize2, Minimize2, Minus, Navigation, Plus, Search, X } from "lucide-react";
import { FlagChina, FlagJapan, FlagKorea, FlagSingapore, FlagTaiwan, FlagThailand, FlagVietnam } from "@/components/FlagIcons";
import { coNenChiTiet, kieuBanDo, mauNuoc, mauVien } from "./kieuBanDo";
import { loaiCua } from "./loaiDiem";

const THU_VIEN = "/vendor/maplibre-6.11.2/maplibre-gl.mjs";
const CSS_THU_VIEN = "/vendor/maplibre-6.11.2/maplibre-gl.css";
const TAM_THE_GIOI = [110, 18]; // nhìn về châu Á — nơi khách PSV đi nhiều nhất
const CO = { CHN: FlagChina, JPN: FlagJapan, KOR: FlagKorea, SGP: FlagSingapore, TWN: FlagTaiwan, THA: FlagThailand, VNM: FlagVietnam };
const QUAN_DAO = [
  { ten: "Quần đảo Hoàng Sa (Việt Nam)", toaDo: [112.1, 16.6] },
  { ten: "Quần đảo Trường Sa (Việt Nam)", toaDo: [114.3, 9.9] },
];
const RONG = { the_gioi: 0, nuoc: 1, tp: 2, diem: 3 };

const boDau = (s) =>
  (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

function lapChiMuc(data) {
  const nuoc = new Map();
  const tp = new Map();
  const diem = new Map();
  for (const n of data.countries) {
    let soDiem = 0;
    for (const t of n.cities) {
      tp.set(t.slug, { ...t, nuoc: n.slug, tenNuoc: n.name });
      soDiem += t.spots.length;
      for (const d of t.spots) diem.set(String(d.id), { ...d, id: String(d.id), tp: t.slug, tenTp: t.name, nuoc: n.slug });
    }
    nuoc.set(n.slug, { ...n, soDiem });
  }
  return { nuoc, tp, diem };
}

/** Đọc ?nuoc=&tp=&diem= — sai / thiếu thì tự sửa cho khớp nhau. */
function docUrl(cm) {
  const p = new URLSearchParams(window.location.search);
  const d = cm.diem.get(p.get("diem") ?? "");
  const t = cm.tp.get(p.get("tp") ?? "") ?? (d && cm.tp.get(d.tp));
  const n = cm.nuoc.get(p.get("nuoc") ?? "") ?? (t && cm.nuoc.get(t.nuoc));
  const nuoc = n?.slug ?? null;
  const tp = t && t.nuoc === nuoc ? t.slug : null;
  const diem = d && d.tp === tp ? d.id : null;
  return { nuoc, tp, diem };
}

/** Giữ đúng các cấp có thật trong dữ liệu (trang bài truyền chỗ bắt đầu vào). */
function chuanHoa(cm, s) {
  const n = s?.nuoc && cm.nuoc.get(s.nuoc);
  const t = n && s.tp && cm.tp.get(s.tp);
  return { nuoc: n ? n.slug : null, tp: t && t.nuoc === n.slug ? t.slug : null, diem: null };
}

function urlCua(s) {
  const p = new URLSearchParams(window.location.search);
  for (const k of ["nuoc", "tp", "diem"]) (s[k] ? p.set(k, s[k]) : p.delete(k));
  const q = p.toString();
  return `${window.location.pathname}${q ? `?${q}` : ""}`;
}

function useManHinhNho() {
  const [nho, setNho] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const f = () => setNho(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return nho;
}

/**
 * Tâm + mức phóng để khung [tây, nam, đông, bắc] vừa vùng nhìn thấy (trừ lề).
 * Tự tính thay cho fitBounds: ở chế độ quả địa cầu, fitBounds lệch tâm khi lề
 * trái / phải khác nhau (cột danh sách bên trái).
 */
function khungVua([tay, nam, dong, bac], rong, cao) {
  const y = (lat) => Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, lat)) * Math.PI) / 360));
  const zx = Math.log2((Math.max(rong, 100) * 360) / (512 * Math.max(dong - tay, 0.01)));
  const zy = Math.log2((Math.max(cao, 100) * 2 * Math.PI) / (512 * Math.max(y(bac) - y(nam), 0.0001)));
  const giuaY = (y(bac) + y(nam)) / 2;
  const lat = (Math.atan(Math.sinh(giuaY)) * 180) / Math.PI;
  return { center: [(tay + dong) / 2, lat], zoom: Math.min(zx, zy) };
}

/** Mức phóng để quả địa cầu chiếm ~88% vùng trống (đường kính = chu vi / π). */
const zoomTheGioi = (rong, cao) => Math.log2((0.88 * Math.max(Math.min(rong, cao), 200) * Math.PI) / 512);

const giamChuyenDong = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function napCss() {
  if (document.querySelector(`link[href="${CSS_THU_VIEN}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = CSS_THU_VIEN;
  document.head.appendChild(l);
}

const Co = ({ code, className }) => {
  const F = CO[code];
  return F ? (
    <F className={className} />
  ) : (
    <span aria-hidden="true" className={`grid place-items-center rounded bg-ocean-100 text-[9px] font-bold text-ocean-800 ${className}`}>
      {code}
    </span>
  );
};

/**
 * @param cheDo   "trang": phần đầu trang /cam-nang, chỗ đang xem ghi lên địa chỉ trang.
 *                "nhung": đặt cuối trang bài cẩm nang để chọn chỗ khác — không đổi địa
 *                chỉ trang, chỉ nạp bản đồ khi người đọc cuộn gần tới.
 * @param batDau  { nuoc, tp } — chỗ mở sẵn (trang bài: thành phố của bài)
 * @param dangDoc slug bài đang đọc — điểm của bài này được đánh dấu "Đang đọc"
 */
export default function BanDoCamNang({ data, cheDo = "trang", batDau = null, dangDoc = null }) {
  const laNhung = cheDo === "nhung";
  const cm = useMemo(() => lapChiMuc(data), [data]);
  const [chon, setChon] = useState({ nuoc: null, tp: null, diem: null });
  const [che, setChe] = useState("dang_tai"); // dang_tai | san_sang | loi
  const [nenChiTiet, setNenChiTiet] = useState(true);
  const [moRong, setMoRong] = useState(false); // bảng dưới đáy (điện thoại) đang kéo lên?
  const [loc, setLoc] = useState(null); // lọc loại điểm trong thành phố
  const [tuKhoa, setTuKhoa] = useState("");
  const [thongBao, setThongBao] = useState("");
  const [phanTu, setPhanTu] = useState(null); // khoá ghim → phần tử DOM gắn trên bản đồ
  const [tro, setTro] = useState(null); // nước đang rê chuột vào
  const [dai, setDai] = useState("zm-thap"); // dải zoom: ẩn / hiện nhãn quần đảo, tên điểm
  const [toan, setToan] = useState(false); // điện thoại: bản đồ toàn màn hình, kéo bằng một ngón
  const [duocNap, setDuocNap] = useState(!laNhung); // trang bài: chờ cuộn gần tới mới tải bản đồ
  const voRef = useRef(null);
  const [caoDau, setCaoDau] = useState(124); // chiều cao phần đầu tấm trượt khi thu gọn
  const [cum, setCum] = useState({}); // id điểm đại diện → số điểm gộp chung (điểm sát nhau đè lên nhau)
  const cumRef = useRef({}); // id điểm đại diện → [id các điểm trong cụm]
  const nho = useManHinhNho();
  const tamRef = useRef(null); // tấm trượt
  const dauRef = useRef(null); // phần đầu tấm trượt (tay nắm + tiêu đề) — chỗ vuốt
  const keoRef = useRef(null);

  const khungRef = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const tieuDeRef = useRef(null);
  const xoayRef = useRef({ bat: false, hen: null, tro: false }); // tro: chuột đang nằm trên bản đồ
  const chonRef = useRef(chon);
  chonRef.current = chon;

  const nuoc = chon.nuoc ? cm.nuoc.get(chon.nuoc) : null;
  const tp = chon.tp ? cm.tp.get(chon.tp) : null;
  const diem = chon.diem ? cm.diem.get(chon.diem) : null;
  const cap = diem ? "diem" : tp ? "tp" : nuoc ? "nuoc" : "the_gioi";

  const tongTp = cm.tp.size;
  const tongDiem = cm.diem.size;

  // ---------- Điều hướng (ghi lên địa chỉ trang) ----------
  const vuaBam = useRef(false); // chỉ dời focus khi người dùng tự bấm, không phải lúc mở link
  const laNhungRef = useRef(laNhung);
  const di = useCallback((moi, { thayThe = false } = {}) => {
    const s = { nuoc: null, tp: null, diem: null, ...moi };
    vuaBam.current = !thayThe;
    setChon(s);
    // Điện thoại: chọn điểm → mở thẻ cẩm nang; chọn nước / thành phố → thu tấm trượt để thấy bản đồ
    if (s.diem) setMoRong(true);
    else if (s.nuoc) setMoRong(false);
    setTuKhoa("");
    if (!s.tp) setLoc(null);
    if (laNhungRef.current) return; // nhúng trong trang bài: không đổi địa chỉ trang
    const url = urlCua(s);
    if (url !== window.location.pathname + window.location.search) {
      window.history[thayThe ? "replaceState" : "pushState"](null, "", url);
    }
  }, []);
  const diRef = useRef(di);
  diRef.current = di;

  const lenMotCap = useCallback(() => {
    const c = chonRef.current;
    if (c.diem) di({ nuoc: c.nuoc, tp: c.tp });
    else if (c.tp) di({ nuoc: c.nuoc });
    else if (c.nuoc) di({});
  }, [di]);

  const batDauKhoa = JSON.stringify(batDau ?? {});
  useEffect(() => {
    if (laNhung) {
      // Mở bài từ bản đồ (?diem=…): về đúng thành phố của điểm vừa bấm (một bài có thể gắn nhiều điểm)
      const id = new URLSearchParams(window.location.search).get("diem");
      const d = id && cm.diem.get(id);
      setChon(chuanHoa(cm, d && d.guide?.slug === dangDoc ? d : JSON.parse(batDauKhoa)));
      return;
    }
    setChon(docUrl(cm));
    const f = () => setChon(docUrl(cm));
    window.addEventListener("popstate", f);
    return () => window.removeEventListener("popstate", f);
  }, [cm, laNhung, batDauKhoa, dangDoc]);

  // Trang bài: chỉ tải bản đồ (~300 KB) khi người đọc cuộn tới gần
  useEffect(() => {
    if (duocNap || !voRef.current) return;
    const io = new IntersectionObserver(([m]) => m.isIntersecting && setDuocNap(true), { rootMargin: "600px 0px" });
    io.observe(voRef.current);
    return () => io.disconnect();
  }, [duocNap]);

  // ---------- Mở bài cẩm nang của một điểm ----------
  const dangDocIds = useMemo(
    () => new Set([...cm.diem.values()].filter((d) => dangDoc && d.guide?.slug === dangDoc).map((d) => d.id)),
    [cm, dangDoc],
  );
  const linkBai = (d) => `/cam-nang/${d.guide.slug}?diem=${d.id}`;
  // Trước khi sang bài: ghi địa chỉ hiện tại về cấp thành phố — bấm Back quay lại đúng bản đồ thành phố đó
  const truocKhiMoBai = (d) => {
    if (!laNhung) window.history.replaceState(null, "", urlCua({ nuoc: d.nuoc, tp: d.tp }));
  };
  const veDauBai = () => window.scrollTo({ top: 0, behavior: giamChuyenDong() ? "auto" : "smooth" });

  // Thông báo cho trình đọc màn hình + mở bảng khi chọn điểm (điện thoại)
  useEffect(() => {
    if (diem) {
      setThongBao(`${diem.name}, ${loaiCua(diem.type).nhan}, ${diem.tenTp}`);
      if (vuaBam.current) requestAnimationFrame(() => tieuDeRef.current?.focus({ preventScroll: true }));
    } else if (tp) {
      setThongBao(`${tp.name}: ${tp.spots.length} điểm cẩm nang`);
    } else if (nuoc) {
      setThongBao(`${nuoc.name}: ${nuoc.cities.length} thành phố`);
    }
    else setThongBao("Quả địa cầu");
  }, [diem, tp, nuoc]);

  // ---------- Xoay quả địa cầu chậm khi đang ở mức thế giới ----------
  const dungXoay = useCallback(() => {
    xoayRef.current.bat = false;
    clearTimeout(xoayRef.current.hen);
  }, []);
  const henXoay = useCallback((sau = 6000) => {
    clearTimeout(xoayRef.current.hen);
    if (giamChuyenDong()) return;
    xoayRef.current.hen = setTimeout(() => {
      const map = mapRef.current;
      if (!map || chonRef.current.nuoc || document.hidden || xoayRef.current.tro) return;
      xoayRef.current.bat = true;
      const buoc = () => {
        if (!xoayRef.current.bat) return;
        const c = map.getCenter();
        map.easeTo({ center: [c.lng + 8, c.lat], duration: 4000, easing: (t) => t });
      };
      map.once("moveend", function lap() {
        if (!xoayRef.current.bat) return;
        map.once("moveend", lap);
        buoc();
      });
      buoc();
    }, sau);
  }, []);

  // ---------- Tạo bản đồ ----------
  useEffect(() => {
    if (!duocNap) return;
    let huy = false;
    let map = null;
    (async () => {
      try {
        napCss();
        const [ml, coNen] = await Promise.all([import(/* webpackIgnore: true */ THU_VIEN), coNenChiTiet()]);
        if (huy || !khungRef.current) return;
        setNenChiTiet(coNen);
        const nhoNay = window.matchMedia("(max-width: 1023px)").matches;
        map = new ml.Map({
          container: khungRef.current,
          style: kieuBanDo({ coNen }),
          center: TAM_THE_GIOI,
          zoom: zoomTheGioi(khungRef.current.clientWidth - (nhoNay ? 32 : 480), khungRef.current.clientHeight - (nhoNay ? 160 : 80)),
          minZoom: 0.4,
          maxZoom: 17.5,
          attributionControl: false,
          // Một ngón tay để cuộn trang, hai ngón để kéo bản đồ; Ctrl + lăn chuột để phóng
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          maxPitch: 0,
          fadeDuration: giamChuyenDong() ? 0 : 300,
          // Màn hình điện thoại 3x: vẽ ở 2x là đủ nét mà nhẹ hơn ~45% — kéo, phóng mượt hơn
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          locale: {
            "CooperativeGesturesHandler.WindowsHelpText": "Giữ Ctrl và lăn chuột để phóng to / thu nhỏ bản đồ",
            "CooperativeGesturesHandler.MacHelpText": "Giữ ⌘ và lăn chuột để phóng to / thu nhỏ bản đồ",
            "CooperativeGesturesHandler.MobileHelpText": "Dùng hai ngón tay để kéo bản đồ — hoặc bấm nút mở rộng ở góc phải để dùng một ngón",
            "AttributionControl.ToggleAttribution": "Nguồn dữ liệu bản đồ",
          },
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(
          new ml.AttributionControl({ compact: true, customAttribution: coNen ? undefined : "Natural Earth" }),
          nhoNay ? "top-left" : "bottom-right", // điện thoại: góc dưới bị tấm trượt che
        );
        mapRef.current = map;
        libRef.current = ml;
        if (process.env.NODE_ENV !== "production") window.__banDoCamNang = map; // để soi lỗi khi chạy dev

        const lop = (z) => setDai(z < 3 ? "zm-thap" : z >= 13.5 ? "zm-cao zm-duong" : z >= 9 ? "zm-cao" : "");
        map.on("zoom", () => lop(map.getZoom()));
        lop(map.getZoom());

        map.on("load", () => {
          if (huy) return;
          map.getSource("nuoc-cam-nang").setData({
            type: "FeatureCollection",
            features: data.countries.map((n) => ({
              type: "Feature",
              properties: { code: n.code, slug: n.slug, mau: mauNuoc(n.color), mau_vien: mauVien(n.color) },
              geometry: n.geometry,
            })),
          });
          map.on("mousemove", "nuoc-to", (e) => {
            if (map.getZoom() > 5.5) return;
            map.getCanvas().style.cursor = "pointer";
            setTro(e.features?.[0]?.properties?.code ?? null);
          });
          map.on("mouseleave", "nuoc-to", () => {
            map.getCanvas().style.cursor = "";
            setTro(null);
          });
          map.on("click", (e) => {
            // Bấm trúng ghim: ghim tự xử lý, bản đồ bỏ qua (không thì vùng nước nằm dưới ghim kéo ngược về cấp quốc gia)
            if (e.originalEvent?.target?.closest?.(".ghim-cn")) return;
            const c = chonRef.current;
            const f = map.getZoom() < 5.5 ? map.queryRenderedFeatures(e.point, { layers: ["nuoc-to"] })[0] : null;
            if (f) {
              if (f.properties.slug !== c.nuoc) diRef.current({ nuoc: f.properties.slug });
              return;
            }
            if (c.diem) diRef.current({ nuoc: c.nuoc, tp: c.tp }); // chạm ra ngoài → đóng thẻ điểm
          });
          // Tự lùi cấp khi người dùng tự thu nhỏ ra xa (không tạo thêm bước Back)
          map.on("zoomend", (e) => {
            if (!e.originalEvent) return;
            const c = chonRef.current;
            const z = map.getZoom();
            const t = c.tp && cm.tp.get(c.tp);
            if (t && z < t.zoom - 4) diRef.current({ nuoc: c.nuoc }, { thayThe: true });
            else if (!c.tp && c.nuoc && z < 1.8) diRef.current({}, { thayThe: true });
          });
          for (const ev of ["mousedown", "touchstart", "wheel"]) {
            map.on(ev, () => {
              if (!xoayRef.current.bat) return;
              dungXoay();
              map.stop();
              if (!chonRef.current.nuoc) henXoay(12000);
            });
          }
          setChe("san_sang");
        });
      } catch (e) {
        console.warn("Không dựng được bản đồ — chuyển sang xem danh sách", e);
        if (!huy) setChe("loi");
      }
    })();

    // Tạm dừng xoay khi bản đồ khuất khỏi màn hình hoặc tab bị ẩn — đỡ tốn pin
    const io = new IntersectionObserver(([m]) => {
      if (!m.isIntersecting) dungXoay();
      else if (!chonRef.current.nuoc && mapRef.current) henXoay(1500);
    });
    if (khungRef.current) io.observe(khungRef.current);
    const an = () => (document.hidden ? dungXoay() : !chonRef.current.nuoc && henXoay(1500));
    document.addEventListener("visibilitychange", an);

    return () => {
      huy = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", an);
      dungXoay();
      map?.remove();
      mapRef.current = null;
    };
  }, [data, cm, dungXoay, henXoay, duocNap]);

  const thuTuDiem = useMemo(() => {
    const m = new Map();
    for (const t of cm.tp.values()) t.spots.forEach((d, i) => m.set(String(d.id), i));
    return m;
  }, [cm]);

  // ---------- Ghim: tạo một lần, React vẽ nội dung qua portal ----------
  const dsGhim = useMemo(() => {
    const ds = [];
    for (const n of cm.nuoc.values()) ds.push({ khoa: `n:${n.slug}`, toaDo: n.label });
    for (const t of cm.tp.values()) ds.push({ khoa: `t:${t.slug}`, toaDo: [t.lng, t.lat] });
    for (const d of cm.diem.values()) ds.push({ khoa: `d:${d.id}`, toaDo: [d.lng, d.lat] });
    QUAN_DAO.forEach((q, i) => ds.push({ khoa: `q:${i}`, toaDo: q.toaDo }));
    return ds;
  }, [cm]);

  useEffect(() => {
    const map = mapRef.current;
    const ml = libRef.current;
    if (che !== "san_sang" || !map || !ml) return;
    const gan = dsGhim.map(({ khoa, toaDo }) => {
      const el = document.createElement("div");
      el.className = "ghim-cn";
      const m = new ml.Marker({ element: el, anchor: "center", opacityWhenCovered: 0 }).setLngLat(toaDo).addTo(map);
      return [khoa, el, m];
    });
    setPhanTu(new Map(gan.map(([k, el]) => [k, el])));
    return () => gan.forEach(([, , m]) => m.remove());
  }, [che, dsGhim]);

  // ---------- Camera theo trạng thái ----------
  const dem = useCallback(() => {
    const k = khungRef.current;
    if (!k) return { top: 0, bottom: 0, left: 0, right: 0 };
    return nho
      ? { top: 64, bottom: (moRong ? Math.round(k.clientHeight * 0.64) : caoDau) + 16, left: 16, right: 16 }
      : { top: 40, bottom: 40, left: 400, right: 80 };
  }, [nho, moRong, caoDau]);

  useEffect(() => {
    const map = mapRef.current;
    if (che !== "san_sang" || !map) return;
    dungXoay();
    const padding = dem();
    const nhay = giamChuyenDong() ? { duration: 0 } : {};
    if (diem) {
      map.easeTo({ center: [diem.lng, diem.lat], zoom: Math.max(map.getZoom(), Math.min(tp.zoom + 2.2, 15.5)), padding, duration: 900, ...nhay });
    } else if (tp) {
      map.flyTo({ center: [tp.lng, tp.lat], zoom: tp.zoom, padding, speed: 1.1, curve: 1.6, ...nhay });
    } else if (nuoc) {
      const k = khungRef.current;
      const vua = khungVua(nuoc.bbox, k.clientWidth - padding.left - padding.right - 60, k.clientHeight - padding.top - padding.bottom - 60);
      map.flyTo({ center: vua.center, zoom: Math.min(vua.zoom, 6), padding, speed: 1.1, curve: 1.5, ...nhay });
    } else {
      const k = khungRef.current;
      const zoom = zoomTheGioi(k.clientWidth - padding.left - padding.right, k.clientHeight - padding.top - padding.bottom);
      map.flyTo({ center: TAM_THE_GIOI, zoom, padding, speed: 1.1, ...nhay });
      henXoay(5000);
    }
    for (const n of cm.nuoc.values()) {
      map.setFeatureState({ source: "nuoc-cam-nang", id: n.code }, { chon: n.slug === chon.nuoc });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ bay khi đổi chỗ, không bay lại khi kéo tấm trượt
  }, [chon, che, cm, diem, tp, nuoc, nho, dungXoay, henXoay]);

  // Kéo tấm trượt lên / xuống, bật / tắt toàn màn hình: dời tâm theo phần bản đồ còn thấy
  useEffect(() => {
    const map = mapRef.current;
    if (che !== "san_sang" || !map || !nho || map.isMoving()) return; // đang bay: chuyến bay đã dùng lề mới
    map.easeTo({ padding: dem(), duration: giamChuyenDong() ? 0 : 350 });
  }, [moRong, caoDau, toan, che, nho, dem]);

  useEffect(() => {
    const map = mapRef.current;
    if (che !== "san_sang" || !map) return;
    for (const n of cm.nuoc.values()) map.setFeatureState({ source: "nuoc-cam-nang", id: n.code }, { tro: n.code === tro });
  }, [tro, che, cm]);

  useEffect(() => {
    const map = mapRef.current;
    if (che !== "san_sang" || !map || !phanTu) return;
    let hen = 0;
    const xep = () => {
      hen = 0;
      // Điểm trong thành phố nằm sát nhau (VD hai quán cách 50 m) thì đè lên nhau, điểm
      // bên dưới không bấm được → gộp thành một ghim có số, bấm vào thì phóng tới khi tách ra
      const dsDiem = [];
      for (const [khoa, el] of phanTu) {
        if (khoa[0] !== "d") continue;
        el.classList.remove("ghim-gop");
        if (el.classList.contains("ghim-an")) continue;
        const c = el.querySelector("[data-cham]");
        if (!c) continue;
        const r = c.getBoundingClientRect();
        const id = khoa.slice(2);
        dsDiem.push({ el, id, x: r.left + r.width / 2, y: r.top + r.height / 2, uu: id === chonRef.current.diem || dangDocIds.has(id) ? 1e9 : -(thuTuDiem.get(id) ?? 0) });
      }
      dsDiem.sort((a, b) => b.uu - a.uu);
      const nhom = {};
      const dai = [];
      for (const d of dsDiem) {
        const g = dai.find((q) => Math.hypot(q.x - d.x, q.y - d.y) < 34);
        if (g) {
          nhom[g.id].push(d.id);
          d.el.classList.add("ghim-gop");
        } else {
          dai.push(d);
          nhom[d.id] = [d.id];
        }
      }
      cumRef.current = nhom;
      const soMoi = Object.fromEntries(Object.entries(nhom).filter(([, v]) => v.length > 1).map(([k, v]) => [k, v.length]));
      setCum((cu) => (JSON.stringify(cu) === JSON.stringify(soMoi) ? cu : soMoi));

      const ds = [];
      const cham = []; // chấm của mọi ghim đang hiện — nhãn không được che lên
      for (const [khoa, el] of phanTu) {
        if (el.classList.contains("ghim-an") || el.classList.contains("ghim-gop") || el.classList.contains("maplibregl-marker-covered")) continue;
        const c = el.querySelector("[data-cham]");
        if (c) {
          const r = c.getBoundingClientRect();
          cham.push({ el, r: { left: r.left - 4, right: r.right + 4, top: r.top - 4, bottom: r.bottom + 4 } });
        }
        const nhan = khoa[0] === "n" || khoa[0] === "t" ? el.querySelector("[data-nhan]") : null;
        if (nhan && el.firstElementChild) {
          const nut = el.firstElementChild.getBoundingClientRect();
          const r = nhan.getBoundingClientRect();
          const tren = nut.top + nut.height / 2 - r.height / 2;
          const o = (trai) => ({ left: trai, right: trai + r.width, top: tren, bottom: tren + r.height });
          ds.push({ el, phai: o(nut.left + 36), trai: o(nut.right - 36 - r.width), uu: +(el.firstElementChild.dataset.uuTien ?? 0) });
        }
      }
      ds.sort((a, b) => b.uu - a.uu);
      const de = (r, q, x = 0, y = 0) => r.left < q.right + x && r.right > q.left - x && r.top < q.bottom + y && r.bottom > q.top - y;
      const khung = khungRef.current.getBoundingClientRect();
      const ngoai = (r) => r.left < khung.left + 4 || r.right > khung.right - 4;
      const vuong = (el, r) => ngoai(r) || daDat.some((q) => de(r, q, 6, 3)) || cham.some((c) => c.el !== el && de(r, c.r));
      const daDat = [];
      for (const { el, phai, trai } of ds) {
        const r = !vuong(el, phai) ? phai : !vuong(el, trai) ? trai : null;
        el.classList.toggle("nhan-chong", !r);
        el.classList.toggle("nhan-trai", r === trai);
        if (r) daDat.push(r);
      }
    };
    // Đo vị trí nhãn tốn công (bắt trình duyệt tính lại bố cục) — lúc đang kéo
    // chỉ làm ~11 lần/giây, dừng tay mới xếp lại chính xác
    let lan = 0;
    const lich = () => {
      if (hen || performance.now() - lan < 90) return;
      hen = requestAnimationFrame(() => {
        hen = 0;
        lan = performance.now();
        xep();
      });
    };
    const dung = () => {
      cancelAnimationFrame(hen);
      hen = requestAnimationFrame(xep);
    };
    map.on("move", lich);
    map.on("moveend", dung);
    dung();
    return () => {
      map.off("move", lich);
      map.off("moveend", dung);
      cancelAnimationFrame(hen);
    };
  }, [che, phanTu, chon, thuTuDiem, dangDocIds]);

  // Bấm ghim cụm: phóng tới mức các điểm tách ra (cách nhau ≥ ~44px)
  const moCum = (ids) => {
    const map = mapRef.current;
    const ds = ids.map((i) => cm.diem.get(i)).filter(Boolean);
    if (!map || ds.length < 2) return false;
    let xa = 0;
    for (const a of ds) for (const b of ds) xa = Math.max(xa, Math.hypot((a.lng - b.lng) * Math.cos((a.lat * Math.PI) / 180), a.lat - b.lat) * 111320);
    const can = Math.log2((156543 * Math.cos((ds[0].lat * Math.PI) / 180) * 44) / Math.max(xa, 1));
    if (map.getZoom() >= Math.min(can, 17.5) - 0.05) return false; // đã phóng hết cỡ mà vẫn sát nhau → chọn luôn điểm trên cùng
    const lng = ds.reduce((t, d) => t + d.lng, 0) / ds.length;
    const lat = ds.reduce((t, d) => t + d.lat, 0) / ds.length;
    map.easeTo({ center: [lng, lat], zoom: Math.min(can + 0.3, 17.5), padding: dem(), duration: giamChuyenDong() ? 0 : 700 });
    return true;
  };

  useEffect(() => {
    const an = nho && (moRong || toan);
    document.documentElement.classList.toggle("an-lien-he-noi", an);
    return () => document.documentElement.classList.remove("an-lien-he-noi");
  }, [nho, moRong, toan]);

  // ---------- Toàn màn hình (điện thoại) ----------
  useEffect(() => {
    const map = mapRef.current;
    if (map && che === "san_sang") {
      if (toan) map.cooperativeGestures.disable();
      else map.cooperativeGestures.enable();
    }
    if (!toan) return;
    const goc = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden"; // khoá cuộn trang phía sau
    return () => {
      document.documentElement.style.overflow = goc;
    };
  }, [toan, che]);
  useEffect(() => {
    if (!nho) setToan(false);
  }, [nho]);

  // ---------- Tấm trượt (điện thoại): vuốt lên / xuống ----------
  useLayoutEffect(() => {
    if (dauRef.current) setCaoDau(dauRef.current.offsetHeight);
  }, [chon, nho, che]);

  const viTriTam = (mo) => (mo ? "translateY(0)" : `translateY(calc(100% - ${caoDau}px))`);
  const batDauKeo = (e) => {
    if (!nho || e.button > 0) return;
    keoRef.current = { y0: e.clientY, t0: performance.now(), lech: 0, dangKeo: false, cao: tamRef.current.offsetHeight, id: e.pointerId };
  };
  const keo = (e) => {
    const k = keoRef.current;
    if (!k) return;
    k.lech = e.clientY - k.y0;
    if (!k.dangKeo) {
      if (Math.abs(k.lech) < 6) return; // còn là chạm — để nút bên trong nhận bấm
      k.dangKeo = true;
      e.currentTarget.setPointerCapture(k.id);
      tamRef.current.style.transition = "none";
    }
    const goc = moRong ? 0 : k.cao - caoDau;
    const y = Math.max(0, Math.min(k.cao - caoDau, goc + k.lech));
    tamRef.current.style.transform = `translateY(${y}px)`;
  };
  const thaKeo = () => {
    const k = keoRef.current;
    keoRef.current = null;
    if (!k?.dangKeo) return;
    const vanToc = k.lech / Math.max(performance.now() - k.t0, 1); // px / ms
    const moi = vanToc < -0.35 || k.lech < -60 ? true : vanToc > 0.35 || k.lech > 60 ? false : moRong;
    tamRef.current.style.transition = "";
    tamRef.current.style.transform = viTriTam(moi);
    setMoRong(moi);
  };

  // Esc: lùi một cấp
  const banPhim = (e) => {
    if (e.key === "Escape" && toan) {
      e.preventDefault();
      setToan(false);
      return;
    }
    if (e.key === "Escape" && cap !== "the_gioi") {
      e.preventDefault();
      lenMotCap();
    }
  };

  // ---------- Tìm kiếm ----------
  const ketQua = useMemo(() => {
    const q = boDau(tuKhoa.trim());
    if (q.length < 2) return null;
    const khop = (s) => boDau(s).includes(q);
    return {
      nuoc: [...cm.nuoc.values()].filter((n) => khop(n.name)).slice(0, 5),
      tp: [...cm.tp.values()].filter((t) => khop(t.name)).slice(0, 6),
      diem: [...cm.diem.values()].filter((d) => khop(d.name) || khop(d.guide?.title)).slice(0, 8),
    };
  }, [tuKhoa, cm]);

  const diemCuaTp = tp ? tp.spots.map((d) => cm.diem.get(String(d.id))) : [];

  const diemHien = loc ? diemCuaTp.filter((d) => d.type === loc) : diemCuaTp;
  const loaiCoTrongTp = tp ? [...new Set(diemCuaTp.map((d) => d.type))] : [];

  const hienGhim = (khoa) => {
    const [loai, ma] = khoa.split(":");
    if (loai === "q") return true;
    if (loai === "n") return cap === "the_gioi";
    if (loai === "t") return cap === "nuoc" ? cm.tp.get(ma)?.nuoc === chon.nuoc : false;
    if (loai === "d") {
      const d = cm.diem.get(ma);
      return !!d && d.tp === chon.tp && (!loc || d.type === loc || d.id === chon.diem);
    }
    return false;
  };

  const tieuDe = diem ? diem.name : tp ? tp.name : nuoc ? nuoc.name : "Chọn điểm đến";
  const TieuDeBang = laNhung ? "h3" : "h2";

  // Ẩn / hiện ghim theo cấp đang xem (ghim ẩn: không bấm được, không nhận Tab)
  useEffect(() => {
    if (!phanTu) return;
    for (const [khoa, el] of phanTu) el.classList.toggle("ghim-an", !hienGhim(khoa));
  });

  return (
    <section
      id={laNhung ? "ban-do-cam-nang" : undefined}
      aria-labelledby={laNhung ? "ban-do-dau" : "ban-do-tieu-de"}
      onKeyDown={banPhim}
      className={`relative overflow-hidden bg-deep-950 px-3 sm:px-6 ${laNhung ? "py-12 sm:py-16" : "pb-10 pt-28 lg:pt-[7.5rem]"}`}
    >
      {/* Nền vũ trụ: mesh gradient thương hiệu + chấm sao */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-aurora-deep opacity-60" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "34px 34px" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-4 flex flex-col gap-3 px-2 lg:flex-row lg:items-end lg:justify-between">
          {laNhung ? (
            <div className="max-w-3xl">
              <h2 id="ban-do-dau" className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                Khám phá cẩm nang khác trên bản đồ
              </h2>
              <p className="mt-2 text-white/85">
                {tp ? `Chọn điểm khác ở ${tp.name}, ` : "Chọn một điểm, "}hoặc bấm biểu tượng quả địa cầu để sang nước khác.
              </p>
            </div>
          ) : (
          <div className="max-w-3xl">
            <nav aria-label="Đường dẫn" className="mb-2 flex items-center gap-1.5 text-xs text-white/80">
              <Link href="/" className="vung-bam transition-colors hover:text-gold-300">Trang chủ</Link>
              <ChevronRight aria-hidden="true" className="h-3 w-3 text-white/50" />
              <span className="font-medium text-white">Cẩm nang</span>
            </nav>
            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Cẩm nang du lịch trên quả địa cầu
            </h1>
            <p className="mt-2 text-white/85">
              Chọn một nước, phóng vào thành phố — mỗi điểm trên bản đồ là một bài cẩm nang do hướng dẫn viên PSV viết.
            </p>
          </div>
          )}
          <dl className="flex gap-2 text-sm">
            {[
              [cm.nuoc.size, "nước"],
              [tongTp, "thành phố"],
              [tongDiem, "điểm cẩm nang"],
            ].map(([so, nhan]) => (
              <div key={nhan} className="rounded-2xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-white backdrop-blur">
                <dt className="sr-only">{nhan}</dt>
                <dd>
                  <span className="font-display text-xl font-bold text-gold-300">{so}</span>{" "}
                  <span className="text-white/80">{nhan}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Ô giữ chỗ: khung bản đồ chuyển sang toàn màn hình thì trang phía sau không bị xô */}
        <div
          ref={voRef}
          className={`relative min-h-[540px] lg:min-h-[560px] ${laNhung ? "h-[74svh] lg:h-[min(78svh,760px)]" : "h-[78svh] lg:h-[calc(100svh-15.5rem)] lg:max-h-[860px]"}`}
        >
        <div
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            xoayRef.current.tro = true;
            if (!xoayRef.current.bat) return;
            dungXoay();
            mapRef.current?.stop();
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            xoayRef.current.tro = false;
            if (!chonRef.current.nuoc) henXoay(4000);
          }}
          onFocus={() => {
            // Tab vào bản đồ: dừng xoay để ghim đứng yên (chỉ khi đang xoay — không cắt chuyến bay của camera)
            if (!xoayRef.current.bat) return;
            dungXoay();
            mapRef.current?.stop();
          }}
          className={
            toan
              ? "fixed inset-0 z-[90] h-[100dvh] overflow-hidden bg-deep-950"
              : "absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-deep-900/40 to-deep-950/60"
          }
          aria-busy={che === "dang_tai"}
        >
          {/* Khung bản đồ */}
          <div
            ref={khungRef}
            role="region"
            aria-label="Bản đồ cẩm nang tương tác. Dùng phím mũi tên để kéo, dấu cộng trừ để phóng to thu nhỏ."
            className={`ban-do-cn absolute inset-0 transition-opacity duration-700 ease-enter ${dai} ${che === "san_sang" ? "opacity-100" : "opacity-0"}`}
          />

          {/* Đang tải / không chạy được bản đồ: quả cầu tĩnh giữ chỗ (không xô lệch bố cục) */}
          {che !== "san_sang" && (
            <div aria-hidden={che === "dang_tai"} className="pointer-events-none absolute inset-0 grid place-items-center lg:pl-[380px]">
              <div className="flex flex-col items-center gap-5 px-6 text-center">
                <div className="relative h-56 w-56 rounded-full bg-[radial-gradient(circle_at_35%_30%,#9EDAFC_0%,#29ACF7_35%,#0169A9_70%,#013C65_100%)] shadow-[0_0_80px_rgba(41,172,247,0.45)] sm:h-72 sm:w-72">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-[radial-gradient(circle_at_60%_55%,rgba(118,218,81,0.55)_0%,transparent_30%),radial-gradient(circle_at_30%_60%,rgba(246,241,228,0.6)_0%,transparent_25%)]" />
                </div>
                <p className="text-sm text-white/85" role="status">
                  {che === "dang_tai"
                    ? "Đang tải quả địa cầu…"
                    : "Trình duyệt này chưa hiển thị được bản đồ 3D — bạn vẫn xem cẩm nang theo danh sách."}
                </p>
              </div>
            </div>
          )}

          {/* Nút điều khiển (phải trên) */}
          {che === "san_sang" && (
            <div className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setToan((v) => !v)}
                className="nut-ban-do lg:hidden"
                aria-label={toan ? "Thu nhỏ bản đồ" : "Mở bản đồ toàn màn hình"}
                aria-pressed={toan}
              >
                {toan ? <Minimize2 className="h-5 w-5" aria-hidden="true" /> : <Maximize2 className="h-5 w-5" aria-hidden="true" />}
              </button>
              {cap !== "the_gioi" && (
                <button type="button" onClick={() => di({})} className="nut-ban-do" aria-label="Về quả địa cầu" title="Về quả địa cầu">
                  <Earth className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              <button type="button" onClick={() => mapRef.current?.zoomIn()} className="nut-ban-do" aria-label="Phóng to" title="Phóng to">
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => mapRef.current?.zoomOut()} className="nut-ban-do" aria-label="Thu nhỏ" title="Thu nhỏ">
                <Minus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}

          {!nenChiTiet && che === "san_sang" && cap !== "the_gioi" && (
            <p className="absolute left-3 right-16 top-12 z-10 rounded-xl bg-white/90 px-3 py-2 text-xs text-ink-muted shadow lg:left-auto lg:top-3 lg:max-w-[240px]">
              Chưa tải được bản đồ đường phố chi tiết — các điểm vẫn đúng vị trí.
            </p>
          )}

          {/* ===== Bảng điều hướng: cột trái (máy tính) / tấm trượt dưới đáy (điện thoại) ===== */}
          <div
            ref={tamRef}
            style={nho ? { transform: viTriTam(moRong || che === "loi") } : undefined}
            className={`absolute inset-x-0 bottom-0 z-20 flex h-[64%] flex-col overflow-hidden rounded-t-3xl max-lg:[transform:translateY(calc(100%-124px))] bg-white text-ink shadow-[0_-8px_30px_rgba(7,30,51,0.25)] transition-transform duration-[450ms] ease-enter will-change-transform lg:inset-x-auto lg:bottom-4 lg:left-4 lg:top-4 lg:h-auto lg:w-[360px] lg:rounded-2xl lg:bg-white/95 lg:shadow-deep lg:backdrop-blur ${
              toan ? "pb-[env(safe-area-inset-bottom)]" : ""
            }`}
          >
            {/* Phần đầu: tay nắm + vị trí + tiêu đề. Điện thoại: vuốt lên / xuống để mở / thu */}
            <div
              ref={dauRef}
              onPointerDown={batDauKeo}
              onPointerMove={keo}
              onPointerUp={thaKeo}
              onPointerCancel={thaKeo}
              className="shrink-0 touch-none lg:touch-auto"
            >
              <button
                type="button"
                onClick={() => setMoRong((v) => !v)}
                aria-expanded={moRong}
                className="flex h-7 w-full items-center justify-center lg:hidden"
              >
                <span className="sr-only">{moRong ? "Thu gọn danh sách" : "Mở danh sách"}</span>
                <span aria-hidden="true" className="h-1.5 w-10 rounded-full bg-ink-subtle/40" />
              </button>

              <div className="border-b border-ocean-50 px-4 pb-3 lg:pt-4">
              <nav aria-label="Vị trí đang xem trên bản đồ" className="flex flex-wrap items-center gap-1 text-xs text-ink-subtle">
                <button type="button" onClick={() => di({})} className="vung-bam rounded font-medium hover:text-ocean-700" aria-current={cap === "the_gioi" ? "location" : undefined}>
                  Thế giới
                </button>
                {nuoc && (
                  <>
                    <ChevronRight aria-hidden="true" className="h-3 w-3" />
                    <button type="button" onClick={() => di({ nuoc: nuoc.slug })} className="vung-bam rounded font-medium hover:text-ocean-700" aria-current={cap === "nuoc" ? "location" : undefined}>
                      {nuoc.name}
                    </button>
                  </>
                )}
                {tp && (
                  <>
                    <ChevronRight aria-hidden="true" className="h-3 w-3" />
                    <button type="button" onClick={() => di({ nuoc: tp.nuoc, tp: tp.slug })} className="vung-bam rounded font-medium hover:text-ocean-700" aria-current={cap === "tp" ? "location" : undefined}>
                      {tp.name}
                    </button>
                  </>
                )}
              </nav>
              <div className="mt-1 flex items-center gap-2">
                {cap !== "the_gioi" && (
                  <button type="button" onClick={lenMotCap} className="-ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-ocean-50 hover:text-ocean-700" aria-label="Quay lại">
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
                <TieuDeBang id="ban-do-tieu-de" ref={diem ? undefined : tieuDeRef} tabIndex={-1} className="truncate font-display text-xl font-bold text-deep-900 focus:outline-none">
                  {diem ? (tp?.name ?? tieuDe) : tieuDe}
                </TieuDeBang>
              </div>
            </div>
            </div>

            <div inert={nho && !moRong && che !== "loi" ? true : undefined} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
              {diem ? (
                <TheDiem diem={diem} tieuDeRef={tieuDeRef} onDong={() => di({ nuoc: diem.nuoc, tp: diem.tp })} />
              ) : (
                <>
                  {cap === "the_gioi" && (
                    <div className="relative mb-3">
                      <label htmlFor="tim-cam-nang" className="sr-only">Tìm nước, thành phố hoặc điểm</label>
                      <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                      <input
                        id="tim-cam-nang"
                        type="search"
                        value={tuKhoa}
                        onChange={(e) => setTuKhoa(e.target.value)}
                        onFocus={() => setMoRong(true)}
                        placeholder="Tìm: Thượng Hải, Tokyo, ăn vặt…"
                        className="h-11 w-full rounded-xl border border-ocean-100 bg-white pl-9 pr-9 text-sm text-ink placeholder:text-ink-subtle focus:border-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-200"
                      />
                      {tuKhoa && (
                        <button type="button" onClick={() => setTuKhoa("")} className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-subtle hover:text-ink" aria-label="Xoá từ khoá">
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  )}

                  {ketQua ? (
                    <KetQuaTim ketQua={ketQua} cm={cm} di={di} linkBai={linkBai} truocKhiMoBai={truocKhiMoBai} />
                  ) : cap === "the_gioi" ? (
                    <>
                      <p className="mb-2 text-sm text-ink-muted">
                        Bấm vào nước được <span className="font-semibold text-deep-900">tô màu</span> trên quả địa cầu, hoặc chọn ở đây:
                      </p>
                      <ul className="space-y-1.5">
                        {[...cm.nuoc.values()].map((n) => (
                          <li key={n.slug}>
                            <button
                              type="button"
                              onClick={() => di({ nuoc: n.slug })}
                              onMouseEnter={() => setTro(n.code)}
                              onMouseLeave={() => setTro(null)}
                              className="dong-ds group"
                            >
                              <Co code={n.code} className="h-6 w-9 shrink-0 rounded shadow-sm" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold text-deep-900 group-hover:text-ocean-700">{n.name}</span>
                                <span className="block text-xs text-ink-subtle">{n.cities.length} thành phố · {n.soDiem} điểm</span>
                              </span>
                              <ChevronRight aria-hidden="true" className="h-4 w-4 text-ink-subtle transition-transform group-hover:translate-x-0.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : cap === "nuoc" ? (
                    <>
                      {nuoc.intro && <p className="mb-3 text-base text-ink-muted">{nuoc.intro}</p>}
                      <ul className="space-y-2">
                        {nuoc.cities.map((t) => (
                          <li key={t.slug}>
                            <button type="button" onClick={() => di({ nuoc: nuoc.slug, tp: t.slug })} className="dong-ds group">
                              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-ocean-100 to-teal-100">
                                <Anh src={t.cover_image} alt="" sizes="56px" className="object-cover" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-semibold text-deep-900 group-hover:text-ocean-700">{t.name}</span>
                                {t.intro && <span className="line-clamp-1 block text-xs text-ink-muted">{t.intro}</span>}
                                <span className="block text-xs font-medium text-teal-800">{t.spots.length} điểm cẩm nang</span>
                              </span>
                              <ChevronRight aria-hidden="true" className="h-4 w-4 text-ink-subtle transition-transform group-hover:translate-x-0.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      {tp.intro && <p className="mb-3 text-base text-ink-muted">{tp.intro}</p>}
                      {tp.guide && tp.guide.slug !== dangDoc && (
                        <Link href={`/cam-nang/${tp.guide.slug}`} className="mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-ocean-700 to-ocean-600 p-3 text-white shadow-card transition-transform duration-300 ease-enter hover:-translate-y-0.5">
                          <BookOpen aria-hidden="true" className="h-5 w-5 shrink-0 text-gold-300" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/75">Cẩm nang tổng quan</span>
                            <span className="line-clamp-2 block text-sm font-semibold">{tp.guide.title}</span>
                          </span>
                          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                        </Link>
                      )}
                      {loaiCoTrongTp.length > 1 && (
                        <div role="group" aria-label="Lọc theo loại điểm" className="mb-3 flex flex-wrap gap-2">
                          <button type="button" onClick={() => setLoc(null)} aria-pressed={!loc} className={`chip-loai ${!loc ? "chip-loai-chon" : ""}`}>
                            Tất cả
                          </button>
                          {loaiCoTrongTp.map((ma) => {
                            const L = loaiCua(ma);
                            return (
                              <button key={ma} type="button" onClick={() => setLoc(loc === ma ? null : ma)} aria-pressed={loc === ma} className={`chip-loai ${loc === ma ? "chip-loai-chon" : ""}`}>
                                <L.Icon aria-hidden="true" className="h-3.5 w-3.5" style={{ color: loc === ma ? undefined : L.mau }} />
                                {L.nhan}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <ul className="space-y-1.5">
                        {diemHien.map((d) => {
                          const L = loaiCua(d.type);
                          const dangDocNay = dangDocIds.has(d.id);
                          const noiDungDong = (
                            <>
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white shadow-sm" style={{ backgroundColor: L.mau }}>
                                <L.Icon aria-hidden="true" className="h-5 w-5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-semibold text-deep-900 group-hover:text-ocean-700">{d.name}</span>
                                {d.guide ? (
                                  <span className="line-clamp-1 block text-xs text-ink-muted">
                                    {dangDocNay ? <span className="font-semibold text-sunset-700">Đang đọc · </span> : null}
                                    {d.guide.title}
                                  </span>
                                ) : (
                                  <span className="block text-xs text-ink-subtle">{L.nhan}</span>
                                )}
                              </span>
                              {d.guide ? (
                                <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0 text-sunset-600" />
                              ) : (
                                <ChevronRight aria-hidden="true" className="h-4 w-4 text-ink-subtle transition-transform group-hover:translate-x-0.5" />
                              )}
                            </>
                          );
                          return (
                            <li key={d.id}>
                              {d.guide && !dangDocNay ? (
                                <Link href={linkBai(d)} prefetch={false} onClick={() => truocKhiMoBai(d)} className="dong-ds group">
                                  {noiDungDong}
                                </Link>
                              ) : (
                                <button type="button" onClick={() => (dangDocNay ? veDauBai() : di({ nuoc: d.nuoc, tp: d.tp, diem: d.id }))} className="dong-ds group">
                                  {noiDungDong}
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <p className="sr-only" aria-live="polite">{thongBao}</p>
        </div>
        </div>
      </div>

      {/* ===== Nội dung các ghim (vẽ vào phần tử MapLibre đặt trên bản đồ) ===== */}
      {phanTu &&
        dsGhim.map(({ khoa }) => {
          const el = phanTu.get(khoa);
          if (!el) return null;
          const hien = hienGhim(khoa);
          const [loai, ma] = khoa.split(":");
          let noiDung = null;
          if (loai === "n") {
            const n = cm.nuoc.get(ma);
            noiDung = (
              <button
                type="button"
                tabIndex={hien ? 0 : -1}
                onClick={() => di({ nuoc: n.slug })}
                onMouseEnter={() => setTro(n.code)}
                onMouseLeave={() => setTro(null)}
                onFocus={() => setTro(n.code)}
                onBlur={() => setTro(null)}
                aria-label={`${n.name}: ${n.cities.length} thành phố, ${n.soDiem} điểm cẩm nang`}
                data-uu-tien={n.soDiem}
                className={`ghim-nuoc ${tro === n.code ? "ghim-nuoc-tro" : ""}`}
              >
                <span aria-hidden="true" data-cham className="ghim-nuoc-cham" style={{ "--mau-nuoc": mauNuoc(n.color) }} />
                <span aria-hidden="true" data-nhan className="ghim-nhan">
                  <Co code={n.code} className="h-3.5 w-5 rounded-sm" />
                  {n.name}
                </span>
              </button>
            );
          } else if (loai === "t") {
            const t = cm.tp.get(ma);
            noiDung = (
              <button
                type="button"
                tabIndex={hien ? 0 : -1}
                onClick={() => di({ nuoc: t.nuoc, tp: t.slug })}
                aria-label={`${t.name}: ${t.spots.length} điểm cẩm nang`}
                data-uu-tien={t.spots.length}
                className="ghim-tp"
              >
                <span aria-hidden="true" data-cham className="ghim-tp-cham" />
                <span aria-hidden="true" data-nhan className="ghim-tp-nhan">
                  {t.name}
                  <span className="ml-1 font-normal text-ink-subtle">· {t.spots.length}</span>
                </span>
              </button>
            );
          } else if (loai === "d") {
            const d = cm.diem.get(ma);
            const L = loaiCua(d.type);
            const dangChon = chon.diem === d.id;
            const dangDocNay = dangDocIds.has(d.id);
            const laCum = !!cum[d.id];
            const nhan = laCum
              ? `${d.name} và ${cum[d.id] - 1} điểm sát bên — bấm để phóng gần`
              : dangDocNay
                ? `${d.name} — bài bạn đang đọc`
                : d.guide
                  ? `${d.name} — đọc cẩm nang: ${d.guide.title}`
                  : `${d.name} — ${L.nhan}`;
            const ruot = (
              <>
                <span aria-hidden="true" data-cham className="ghim-diem-tron" style={{ backgroundColor: L.mau }}>
                  <L.Icon className="h-[18px] w-[18px]" />
                </span>
                <span aria-hidden="true" className="nhan-diem">
                  {d.name}
                  {dangDocNay ? <span className="ml-1 text-sunset-700">· Đang đọc</span> : null}
                </span>
              </>
            );
            const lop = `ghim-diem ${dangChon || dangDocNay ? "ghim-diem-chon" : ""} ${dangDocNay ? "ghim-diem-dang-doc" : ""}`;
            const moCumNeuCo = (e) => {
              const nhom = cumRef.current[d.id];
              if (nhom?.length > 1 && moCum(nhom)) {
                e.preventDefault();
                return true;
              }
              return false;
            };
            noiDung =
              d.guide && !dangDocNay ? (
                <Link
                  href={linkBai(d)}
                  prefetch={false}
                  tabIndex={hien ? 0 : -1}
                  onClick={(e) => !moCumNeuCo(e) && truocKhiMoBai(d)}
                  aria-label={nhan}
                  data-so={laCum ? cum[d.id] : undefined}
                  className={lop}
                >
                  {ruot}
                </Link>
              ) : (
                <button
                  type="button"
                  tabIndex={hien ? 0 : -1}
                  onClick={(e) => {
                    if (moCumNeuCo(e)) return;
                    if (dangDocNay) veDauBai();
                    else di({ nuoc: d.nuoc, tp: d.tp, diem: d.id });
                  }}
                  aria-pressed={d.guide ? undefined : dangChon}
                  aria-label={nhan}
                  data-so={laCum ? cum[d.id] : undefined}
                  className={lop}
                >
                  {ruot}
                </button>
              );
          } else {
            noiDung = <span className="nhan-quan-dao">{QUAN_DAO[+ma].ten}</span>;
          }
          return createPortal(noiDung, el, khoa);
        })}
    </section>
  );
}

/** Ảnh từ trang quản trị; tải lỗi (link hỏng, ảnh đã xoá) thì hiện nền màu thay vì ô ảnh vỡ. */
function Anh({ src, alt, sizes, className, duPhong }) {
  const [loi, setLoi] = useState(false);
  useEffect(() => setLoi(false), [src]);
  if (!src || loi) return duPhong ?? null;
  return <Image src={src} alt={alt} fill sizes={sizes} className={className} onError={() => setLoi(true)} />;
}

function TheDiem({ diem, tieuDeRef, onDong }) {
  const L = loaiCua(diem.type);
  const anh = diem.image ?? diem.guide?.cover_image;
  return (
    <article aria-labelledby={`diem-${diem.id}`}>
      <div className="relative -mx-4 -mt-3 mb-3 aspect-[16/9] overflow-hidden bg-gradient-to-br from-ocean-100 to-teal-100">
        <Anh
          src={anh}
          alt={diem.name}
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover"
          duPhong={
            <div className="grid h-full place-items-center">
              <L.Icon aria-hidden="true" className="h-12 w-12" style={{ color: L.mau }} />
            </div>
          }
        />
        <button type="button" onClick={onDong} className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-ink shadow hover:bg-white" aria-label="Đóng, về danh sách điểm">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white" style={{ backgroundColor: L.mau }}>
        <L.Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {L.nhan}
      </span>
      <h3 id={`diem-${diem.id}`} ref={tieuDeRef} tabIndex={-1} className="mt-2 font-display text-xl font-bold leading-snug text-deep-900 focus:outline-none">
        {diem.name}
      </h3>
      {diem.summary && <p className="mt-1.5 text-base text-ink-muted">{diem.summary}</p>}

      {diem.guide ? (
        <div className="mt-4 rounded-2xl border border-ocean-100 bg-ocean-50/60 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ocean-700">
            <BookOpen aria-hidden="true" className="h-3.5 w-3.5" /> Cẩm nang
          </p>
          <p className="mt-1 font-semibold leading-snug text-deep-900">{diem.guide.title}</p>
          {diem.guide.excerpt && <p className="mt-1 line-clamp-3 text-base text-ink-muted">{diem.guide.excerpt}</p>}
        </div>
      ) : null}

      <div className="mt-4 grid gap-2">
        {diem.guide && (
          <Link href={`/cam-nang/${diem.guide.slug}`} className="btn-cta !px-5 !py-3 text-sm">
            <BookOpen aria-hidden="true" className="h-4 w-4" /> Đọc cẩm nang
          </Link>
        )}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${diem.lat},${diem.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-ocean-200 bg-white px-5 text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-50"
        >
          <Navigation aria-hidden="true" className="h-4 w-4" /> Chỉ đường
          <span className="sr-only">(mở Google Maps ở thẻ mới)</span>
        </a>
      </div>
    </article>
  );
}

function KetQuaTim({ ketQua, cm, di, linkBai, truocKhiMoBai }) {
  const tong = ketQua.nuoc.length + ketQua.tp.length + ketQua.diem.length;
  if (!tong) return <p className="py-6 text-center text-sm text-ink-muted">Chưa có điểm nào khớp. Thử tên khác, hoặc chọn trên quả địa cầu.</p>;
  const Nhom = ({ tieuDe, children }) => (
    <div className="mb-3">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">{tieuDe}</p>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
  return (
    <div>
      <p className="sr-only" role="status">{tong} kết quả</p>
      {ketQua.nuoc.length > 0 && (
        <Nhom tieuDe="Nước">
          {ketQua.nuoc.map((n) => (
            <li key={n.slug}>
              <button type="button" onClick={() => di({ nuoc: n.slug })} className="dong-ds">
                <Co code={n.code} className="h-5 w-7 rounded" />
                <span className="font-semibold text-deep-900">{n.name}</span>
              </button>
            </li>
          ))}
        </Nhom>
      )}
      {ketQua.tp.length > 0 && (
        <Nhom tieuDe="Thành phố">
          {ketQua.tp.map((t) => (
            <li key={t.slug}>
              <button type="button" onClick={() => di({ nuoc: t.nuoc, tp: t.slug })} className="dong-ds">
                <span className="font-semibold text-deep-900">{t.name}</span>
                <span className="text-xs text-ink-subtle">{t.tenNuoc}</span>
              </button>
            </li>
          ))}
        </Nhom>
      )}
      {ketQua.diem.length > 0 && (
        <Nhom tieuDe="Điểm">
          {ketQua.diem.map((d) => {
            const L = loaiCua(d.type);
            const noiDung = (
              <>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: L.mau }}>
                  <L.Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-deep-900">{d.name}</span>
                  <span className="block text-xs text-ink-subtle">{d.tenTp} · {cm.nuoc.get(d.nuoc)?.name}</span>
                </span>
                {d.guide && <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0 text-sunset-600" />}
              </>
            );
            return (
              <li key={d.id}>
                {d.guide ? (
                  <Link href={linkBai(d)} prefetch={false} onClick={() => truocKhiMoBai(d)} className="dong-ds">
                    {noiDung}
                  </Link>
                ) : (
                  <button type="button" onClick={() => di({ nuoc: d.nuoc, tp: d.tp, diem: d.id })} className="dong-ds">
                    {noiDung}
                  </button>
                )}
              </li>
            );
          })}
        </Nhom>
      )}
    </div>
  );
}

