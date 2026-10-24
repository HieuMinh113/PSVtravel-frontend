import sanitizeHtml from "sanitize-html";
import { duocToiUu } from "./anh.js";

// Dùng đường dẫn tương đối (không @/) để chạy được trong npm test.

// Tên miền của chính công ty: link trong bài trỏ tới đây là link NỘI BỘ. Gồm cả
// www và tên miền web cũ (.com.vn chuyển sang .com giữ nguyên đường dẫn) — nhân
// viên hay dán nguyên địa chỉ từ thanh trình duyệt.
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://psvtravel.com";
let hostSite = "psvtravel.com";
try {
  hostSite = new URL(SITE).host.replace(/^www\./, "");
} catch {
  /* giữ mặc định */
}
const HOST_NOI_BO = new Set([hostSite, "psvtravel.com", "psvtravel.com.vn"].flatMap((h) => [h, `www.${h}`]));

// Bề rộng ảnh trong bài: phải nằm trong deviceSizes của next.config.mjs (bộ tối
// ưu ảnh trả lỗi 400 với bề rộng lạ). src dùng bản 828px — vừa khung bài trên
// máy tính; srcset cho trình duyệt tự chọn bản to hơn ở màn hình nét.
const BE_RONG = [640, 828, 1200, 1920];
const BE_RONG_SRC = 828;
const KICH_THUOC = "(max-width: 800px) 100vw, 768px";

const anhToiUu = (src, w) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

// Ảnh nhân viên chèn vào bài: trước đây tải nguyên bản gốc (2–6 MB mỗi ảnh)
// xuống điện thoại. Ảnh từ máy chủ của mình thì cho qua bộ tối ưu của Next
// (WebP, đúng cỡ màn hình); ảnh dán từ trang ngoài giữ nguyên địa chỉ.
function lamAnh(tagName, attribs) {
  const src = attribs.src || "";
  const ra = { ...attribs, loading: "lazy", decoding: "async" };
  if (/^https?:\/\//i.test(src) && duocToiUu(src)) {
    ra.src = anhToiUu(src, BE_RONG_SRC);
    ra.srcset = BE_RONG.map((w) => `${anhToiUu(src, w)} ${w}w`).join(", ");
    ra.sizes = KICH_THUOC;
  }
  return { tagName, attribs: ra };
}

// Link trong bài. Link nội bộ: đưa về đường dẫn tương đối, bỏ dấu "/" cuối —
// link www, .com.vn hay "/abc/" đều phải đi qua một lượt chuyển hướng mới tới
// trang thật (Ahrefs: "Page has links to redirect"), và KHÔNG gắn nofollow
// (trước đây mọi link đều bị gắn, Google không truyền điểm sang trang của mình).
// Link ra ngoài giữ nofollow như cũ.
function lamLink(tagName, attribs) {
  const href = (attribs.href || "").trim();
  if (!href) return { tagName, attribs };
  let u = null;
  try {
    u = new URL(href, SITE);
  } catch {
    return { tagName, attribs };
  }
  const noiBo = href.startsWith("#") || (/^(https?:)?\/\//i.test(href) ? HOST_NOI_BO.has(u.host) : href.startsWith("/"));
  if (!noiBo) {
    if (!/^https?:/i.test(u.protocol)) return { tagName, attribs }; // mailto:, tel:
    return { tagName, attribs: { ...attribs, rel: "noopener noreferrer nofollow" } };
  }
  if (href.startsWith("#")) return { tagName, attribs: { href } };
  const duongDan = u.pathname.length > 1 ? u.pathname.replace(/\/+$/, "") : u.pathname;
  const ra = { href: duongDan + u.search + u.hash };
  if (attribs.title) ra.title = attribs.title;
  return { tagName, attribs: ra };
}

const chuTron = (html) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const thoatThuocTinh = (s) => s.replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const coAlt = (the) => /\salt="[^"]*[^"\s][^"]*"/i.test(the);
const ganAlt = (the, alt) => (/\salt="/i.test(the) ? the.replace(/\salt="[^"]*"/i, ` alt="${alt}"`) : the.replace(/^<img\b/i, `<img alt="${alt}"`));

// Ảnh chưa có mô tả (alt) — Google không đọc được ảnh nói gì, Ahrefs báo
// "Missing alt text". Tạm điền theo chú thích ảnh, không có thì theo tiêu đề
// mục ngay phía trên, không có nữa thì theo tên bài. Nhân viên vẫn nên điền mô
// tả thật trong admin (ô "alt" khi chèn ảnh) — khung Gợi ý SEO của bài nhắc việc này.
function dienAlt(html, tenBai) {
  // 1. Ảnh nằm trong <figure> có <figcaption>: lấy chú thích
  let ra = html.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, (khoi) => {
    const cap = khoi.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i);
    const chu = cap ? chuTron(cap[1]) : "";
    return chu ? khoi.replace(/<img\b[^>]*>/gi, (the) => (coAlt(the) ? the : ganAlt(the, thoatThuocTinh(chu)))) : khoi;
  });

  // 2. Còn lại: tiêu đề mục gần nhất phía trên, hoặc tên bài; trùng thì đánh số
  let tieuDeMuc = "";
  const daDung = new Map();
  ra = ra.replace(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>|<img\b[^>]*>/gi, (khop, the, trong) => {
    if (the) {
      tieuDeMuc = chuTron(trong);
      return khop;
    }
    if (coAlt(khop)) return khop;
    const goc = tieuDeMuc || tenBai;
    if (!goc) return khop;
    const lan = (daDung.get(goc) ?? 0) + 1;
    daDung.set(goc, lan);
    return ganAlt(khop, thoatThuocTinh(lan > 1 ? `${goc} - ảnh ${lan}` : goc));
  });
  return ra;
}

// Lọc HTML do admin/nhân viên soạn (RichEditor) trước khi render, chống chèn mã
// (stored XSS): bỏ <script>, <iframe>, thuộc tính on* (onerror, onclick...),
// link javascript:. Chỉ chạy phía máy chủ (server component).
//
// Cho phép các thẻ định dạng thông thường + ảnh + bảng + liên kết, đủ cho nội
// dung bài viết. Mọi thẻ/thuộc tính ngoài danh sách đều bị loại.
//
// tenBai: tên bài / trang, dùng làm mô tả dự phòng cho ảnh chưa có alt.
export function locHtml(html, { tenBai = "" } = {}) {
  if (!html || typeof html !== "string") return "";

  const sach = sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr", "span", "div", "blockquote", "pre", "code",
      "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup", "mark",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "srcset", "sizes", "alt", "title", "width", "height", "loading", "decoding"],
      "*": ["class"],
    },
    // Chỉ cho phép các giao thức an toàn; javascript: bị loại.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    transformTags: { a: lamLink, img: lamAnh },
  });

  return dienAlt(sach, String(tenBai || "").trim());
}
