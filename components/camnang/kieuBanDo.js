// Kiểu bản đồ cho trang Cẩm nang — dựng trực tiếp ở đây (không lấy kiểu có
// sẵn) để màu khớp bảng màu PSV và kiểm soát nhãn:
//
//  - Nền chi tiết: OpenFreeMap (dữ liệu OpenStreetMap, miễn phí, không cần
//    khoá, cho phép dùng thương mại). Không tải được thì rơi về nền đơn giản:
//    đất liền Natural Earth tự lưu ở /geo/dat-lien.json — quả địa cầu, tô
//    nước, ghim vẫn chạy đủ, chỉ thiếu đường phố.
//  - Ở mức quả địa cầu / quốc gia KHÔNG hiện nhãn của nền (tên nước, tên
//    đảo, tên biển bằng đủ thứ tiếng). Tên nước do trang tự đặt bằng tiếng
//    Việt; quần đảo Hoàng Sa, Trường Sa ghi rõ thuộc Việt Nam. Nhãn đường
//    phố chỉ hiện khi đã phóng vào thành phố.

const OFM = "https://tiles.openfreemap.org";

export const MAU = {
  bien: "#a7d8f3",
  dat: "#f6f1e4",
  cay: "#d8ebc8",
  khuDan: "#efe7d6",
  nha: "#e5dbc5",
  vienNha: "#d6c9ab",
  duong: "#ffffff",
  vienDuong: "#e0d4ba",
  duongLon: "#fff8dc",
  vienDuongLon: "#d9c48f",
  sat: "#b9ad95",
  ranhGioi: "#7f97ab",
  chu: "#0A2A45",
  chuNuoc: "#015185",
  nuocCoCamNang: "#76DA51",
  vienNuocCoCamNang: "#2D741A",
};

const TEN = ["coalesce", ["get", "name:vi"], ["get", "name:latin"], ["get", "name"]];

/** Màu admin chọn cho từng nước (Bản đồ: Quốc gia); sai dạng thì về xanh lá mặc định. */
export const mauNuoc = (hex) => (/^#[0-9a-f]{6}$/i.test(hex || "") ? hex : MAU.nuocCoCamNang);

/** Viền: cùng màu nhưng đậm hơn (nhân độ sáng 0,55) để nước nào cũng có viền rõ. */
export const mauVien = (hex) => {
  const h = mauNuoc(hex);
  const dam = (i) => Math.round(parseInt(h.slice(i, i + 2), 16) * 0.55).toString(16).padStart(2, "0");
  return `#${dam(1)}${dam(3)}${dam(5)}`;
};
const CHU = ["Noto Sans Regular"];
const CHU_DAM = ["Noto Sans Bold"];
const lop = (id, type, sourceLayer, rest) => ({ id, type, source: "omt", "source-layer": sourceLayer, ...rest });
const theoZoom = (...cap) => ["interpolate", ["exponential", 1.5], ["zoom"], ...cap];
const laLop = (...ds) => ["match", ["get", "class"], ds, true, false];

/** Có tải được nền chi tiết không — hỏi nhanh, quá 4,5 giây coi như không. */
export async function coNenChiTiet() {
  try {
    const r = await fetch(`${OFM}/planet`, { signal: AbortSignal.timeout(4500) });
    return r.ok;
  } catch {
    return false;
  }
}

function lopNenChiTiet() {
  return [
    lop("nuoc", "fill", "water", { filter: ["!=", ["get", "brunnel"], "tunnel"], paint: { "fill-color": MAU.bien } }),
    lop("rung", "fill", "landcover", {
      filter: laLop("wood", "grass", "farmland"),
      paint: { "fill-color": MAU.cay, "fill-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0.35, 10, 0.8] },
    }),
    lop("khu-dan", "fill", "landuse", {
      minzoom: 8,
      filter: laLop("residential", "suburb", "neighbourhood", "commercial", "retail"),
      paint: { "fill-color": MAU.khuDan, "fill-opacity": 0.75 },
    }),
    lop("cong-vien", "fill", "park", { paint: { "fill-color": MAU.cay } }),
    lop("song", "line", "waterway", {
      minzoom: 8,
      paint: { "line-color": MAU.bien, "line-width": theoZoom(8, 0.6, 14, 3, 18, 8) },
    }),
    lop("nha", "fill", "building", {
      minzoom: 14,
      paint: {
        "fill-color": MAU.nha,
        "fill-outline-color": MAU.vienNha,
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 14, 0, 15, 1],
      },
    }),
    lop("duong-sat", "line", "transportation", {
      minzoom: 10,
      filter: laLop("rail", "transit"),
      paint: { "line-color": MAU.sat, "line-width": theoZoom(10, 0.6, 16, 2), "line-dasharray": [3, 2] },
    }),
    lop("duong-nho-vien", "line", "transportation", {
      minzoom: 12,
      filter: laLop("tertiary", "minor", "service"),
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": MAU.vienDuong, "line-width": theoZoom(12, 1.6, 16, 11, 19, 30) },
    }),
    lop("duong-lon-vien", "line", "transportation", {
      minzoom: 8,
      filter: laLop("motorway", "trunk", "primary", "secondary"),
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": MAU.vienDuongLon, "line-width": theoZoom(8, 1.2, 12, 4.5, 16, 18, 19, 40) },
    }),
    lop("duong-nho", "line", "transportation", {
      minzoom: 12,
      filter: laLop("tertiary", "minor", "service"),
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": MAU.duong, "line-width": theoZoom(12, 0.8, 16, 9, 19, 26) },
    }),
    lop("duong-lon", "line", "transportation", {
      minzoom: 6,
      filter: laLop("motorway", "trunk", "primary", "secondary"),
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": ["match", ["get", "class"], ["motorway", "trunk"], MAU.duongLon, MAU.duong],
        "line-width": theoZoom(6, 0.5, 12, 3, 16, 15, 19, 36),
      },
    }),
    // Biên giới đất liền giữa các nước — bỏ đường biển, đường tranh chấp, đường
    // "tuyên bố chủ quyền" (claimed_by) của dữ liệu nền
    lop("bien-gioi", "line", "boundary", {
      filter: [
        "all",
        ["==", ["get", "admin_level"], 2],
        ["!=", ["get", "maritime"], 1],
        ["!=", ["get", "disputed"], 1],
        ["!", ["has", "claimed_by"]],
      ],
      layout: { "line-join": "round" },
      paint: { "line-color": MAU.ranhGioi, "line-width": ["interpolate", ["linear"], ["zoom"], 1, 0.4, 5, 1.2, 10, 2], "line-opacity": 0.7 },
    }),
    lop("ten-song-ho", "symbol", "water_name", {
      minzoom: 11,
      filter: ["match", ["geometry-type"], ["Point", "MultiPoint"], true, false],
      layout: { "text-field": TEN, "text-font": ["Noto Sans Italic"], "text-size": 12 },
      paint: { "text-color": MAU.chuNuoc, "text-halo-color": "rgba(255,255,255,0.8)", "text-halo-width": 1.2 },
    }),
    lop("ten-duong", "symbol", "transportation_name", {
      minzoom: 13.5,
      layout: { "text-field": TEN, "text-font": CHU, "text-size": theoZoom(13.5, 10, 17, 13), "symbol-placement": "line" },
      paint: { "text-color": "#4A6076", "text-halo-color": "#ffffff", "text-halo-width": 1.2 },
    }),
    lop("ten-khu", "symbol", "place", {
      minzoom: 11,
      filter: laLop("suburb", "quarter", "neighbourhood"),
      layout: { "text-field": TEN, "text-font": CHU, "text-size": 12, "text-transform": "uppercase", "text-letter-spacing": 0.08, "text-max-width": 8 },
      paint: { "text-color": "#5E7385", "text-halo-color": "#ffffff", "text-halo-width": 1.4 },
    }),
    lop("ten-thanh-pho", "symbol", "place", {
      minzoom: 7,
      filter: laLop("city", "town"),
      layout: { "text-field": TEN, "text-font": CHU_DAM, "text-size": theoZoom(7, 11, 12, 16), "text-max-width": 8 },
      paint: { "text-color": MAU.chu, "text-halo-color": "#ffffff", "text-halo-width": 1.6 },
    }),
  ];
}

export function kieuBanDo({ coNen }) {
  const daChon = ["boolean", ["feature-state", "chon"], false];
  const dangTro = ["boolean", ["feature-state", "tro"], false];

  return {
    version: 8,
    projection: { type: "globe" },
    ...(coNen ? { glyphs: `${OFM}/fonts/{fontstack}/{range}.pbf` } : {}),
    // Quầng khí quyển quanh quả địa cầu, mờ dần khi phóng vào
    sky: {
      "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 4, 0.8, 7, 0],
    },
    sources: {
      ...(coNen
        ? { omt: { type: "vector", url: `${OFM}/planet` } }
        : { "dat-lien": { type: "geojson", data: "/geo/dat-lien.json" } }),
      "nuoc-cam-nang": { type: "geojson", data: { type: "FeatureCollection", features: [] }, promoteId: "code" },
    },
    layers: [
      { id: "nen", type: "background", paint: { "background-color": coNen ? MAU.dat : MAU.bien } },
      ...(coNen
        ? lopNenChiTiet()
        : [{ id: "dat-lien", type: "fill", source: "dat-lien", paint: { "fill-color": MAU.dat, "fill-outline-color": "#d9cfb6" } }]),
      // Nước có cẩm nang: tô màu admin chọn cho từng nước (mặc định xanh lá
      // logo) trên quả địa cầu, nhạt dần khi phóng vào
      {
        id: "nuoc-to",
        type: "fill",
        source: "nuoc-cam-nang",
        paint: {
          "fill-color": ["coalesce", ["get", "mau"], MAU.nuocCoCamNang],
          "fill-opacity": [
            "interpolate", ["linear"], ["zoom"],
            1, ["case", dangTro, 0.8, daChon, 0.3, 0.55],
            4, ["case", dangTro, 0.5, daChon, 0.12, 0.35],
            7, 0,
          ],
        },
      },
      {
        id: "nuoc-vien",
        type: "line",
        source: "nuoc-cam-nang",
        layout: { "line-join": "round" },
        paint: {
          "line-color": ["coalesce", ["get", "mau_vien"], MAU.vienNuocCoCamNang],
          "line-width": ["case", daChon, 2.4, dangTro, 1.8, 0.8],
          "line-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0.9, 8, 0],
        },
      },
    ],
  };
}
