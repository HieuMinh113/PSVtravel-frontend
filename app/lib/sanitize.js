import sanitizeHtml from "sanitize-html";

// Lọc HTML do admin/nhân viên soạn (RichEditor) trước khi render, chống chèn mã
// (stored XSS): bỏ <script>, <iframe>, thuộc tính on* (onerror, onclick...),
// link javascript:. Chỉ chạy phía máy chủ (server component).
//
// Cho phép các thẻ định dạng thông thường + ảnh + bảng + liên kết, đủ cho nội
// dung bài viết. Mọi thẻ/thuộc tính ngoài danh sách đều bị loại.
export function locHtml(html) {
  if (!html || typeof html !== "string") return "";

  return sanitizeHtml(html, {
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
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["class"],
    },
    // Chỉ cho phép các giao thức an toàn; javascript: bị loại.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    // Link ngoài luôn mở tab mới an toàn.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }, true),
    },
  });
}
