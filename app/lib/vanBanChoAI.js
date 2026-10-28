// Nội dung dạng văn bản thuần cho AI (ChatGPT, Perplexity, Claude…) và trợ lý
// tự động: /llms.txt (giới thiệu công ty) và /pricing.md (bảng giá tour).
//
// Mọi con số lấy từ dữ liệu thật (API) hoặc từ đúng các hằng số website đang
// hiện cho khách — AI trích sai một con số thì rất khó gỡ, nên ở đây không có
// câu quảng cáo nào mà trang web không tự nói.
import { SITE_URL, SITE_NAME, NAM_THANH_LAP, soNamHoatDong, formatVND, CONG_TY } from "./seo";

// Hai con số này đang hiện ở trang chủ và trang Về chúng tôi — đổi ở đó thì đổi ở đây
const LUOT_KHACH_MOI_NAM = "10.000";
const SO_TUYEN_TOUR = "300";

const TEN_PHAP_NHAN = "Công ty Cổ phần Du lịch P.S.V Travel";

// "22/10/2026 10:49" theo giờ Việt Nam (máy chủ chạy giờ UTC; định dạng vi-VN
// sẵn có lại đặt giờ lên trước ngày)
const dinhDangGio = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const gioVN = { format: (d) => dinhDangGio.format(d).replace(",", "") };

// "2026-11-20" → "20/11/2026"
const ngayVN = (iso) => (iso ? String(iso).slice(0, 10).split("-").reverse().join("/") : "");

const gia = (n) => (Number(n) > 0 ? formatVND(Number(n)) : "Liên hệ");

const thoiGian = (t) =>
  t.duration_nights > 0 ? `${t.duration_days} ngày ${t.duration_nights} đêm` : `${t.duration_days} ngày`;

// Tên tour đi vào [chữ](link) của Markdown: dấu ngoặc vuông làm vỡ link, dấu *
// là quy ước tô đậm nội bộ
const chu = (s) => String(s || "").replace(/\*/g, "").replace(/([[\]])/g, "\\$1").trim();

const duongDanTour = (t) => `${SITE_URL}/${t.type === "abroad" ? "tour-nuoc-ngoai" : "tour-trong-nuoc"}/${t.slug}`;

// Nhóm tour theo nước (tour nước ngoài) hoặc vùng (trong nước), tên nhóm xếp A→Z
function theoNhom(tours, loai) {
  const nhom = new Map();
  for (const t of tours.filter((x) => x.type === loai)) {
    const ten = (loai === "abroad" ? t.country || t.region : t.region) || "Khác";
    if (!nhom.has(ten)) nhom.set(ten, []);
    nhom.get(ten).push(t);
  }
  return [...nhom.entries()].sort(([a], [b]) => (a === "Khác") - (b === "Khác") || a.localeCompare(b, "vi"));
}

const giaThapNhat = (tours) => {
  const ds = tours.map((t) => Number(t.adult_price)).filter((n) => n > 0);
  return ds.length ? Math.min(...ds) : 0;
};

function lienHe(settings = {}) {
  return {
    hotline: settings.hotline || "0907 870 707",
    email: settings.email || CONG_TY.email,
    diaChi: settings.address || "529 Huỳnh Tấn Phát, Phường Tân Thuận, TP. Hồ Chí Minh",
    // Giờ văn phòng: ô "Giờ làm việc" trong admin, trống thì giờ chuẩn của công ty
    gio: settings.working_hours || CONG_TY.gioLamViec,
    giayPhep: settings.license_number || CONG_TY.giayPhep,
    noiCap: settings.license_issuer || CONG_TY.coQuanCap,
  };
}

function khoiLienHe(lh) {
  return [
    `- Hotline (24/7): ${lh.hotline}`,
    `- Email: ${lh.email}`,
    `- Văn phòng: ${lh.diaChi}`,
    lh.gio ? `- Giờ làm việc văn phòng: ${lh.gio}` : null,
    `- Giấy phép kinh doanh lữ hành quốc tế số ${lh.giayPhep} (${lh.noiCap})`,
  ]
    .filter(Boolean)
    .join("\n");
}

function dongTour(t) {
  const dong = [`#### [${chu(t.name)}](${duongDanTour(t)})`, `- Thời gian: ${thoiGian(t)}`];
  if (t.departure_from) dong.push(`- Khởi hành từ: ${t.departure_from}`);
  dong.push(
    `- Giá từ: ${gia(t.adult_price)}${Number(t.adult_price) > 0 ? "/người lớn" : ""}` +
      (Number(t.child_price) > 0 ? ` · trẻ em ${formatVND(Number(t.child_price))}` : "")
  );
  if (t.departures?.length) {
    const dot = t.departures.map(
      (d) =>
        `${ngayVN(d.start_date)} (${gia(d.price)}` +
        (d.visa_deadline ? `, hạn nộp hồ sơ visa ${ngayVN(d.visa_deadline)}` : "") +
        ")"
    );
    const conLai = (t.departure_count ?? 0) - t.departures.length;
    dong.push(`- Ngày khởi hành gần nhất: ${dot.join("; ")}${conLai > 0 ? ` — và ${conLai} ngày khác` : ""}`);
  } else {
    dong.push("- Ngày khởi hành: theo yêu cầu, liên hệ để chọn ngày");
  }
  if (t.visa_kind_label) dong.push(`- Visa: ${t.visa_kind_label}`);
  if (t.tag) dong.push(`- Nhãn: ${t.tag}`);
  return dong.join("\n");
}

/** /pricing.md — bảng giá mọi tour đang mở bán + phí dịch vụ visa. */
export function bangGiaMarkdown({ tours = [], visas = [], settings = {}, maldives = [], luc = new Date() }) {
  const lh = lienHe(settings);
  const phan = [
    `# Bảng giá tour — ${SITE_NAME}`,
    "",
    `> Giá tour trọn gói của ${TEN_PHAP_NHAN} (TP. Hồ Chí Minh), tự lấy từ hệ thống đặt tour.`,
    `> Cập nhật lúc ${gioVN.format(luc)} (giờ Việt Nam). Giá bằng đồng Việt Nam (VNĐ), tính cho mỗi khách.`,
    "> Giá từng ngày khởi hành có thể khác giá \"từ\"; giá và chỗ trống cuối cùng xác nhận trên trang tour hoặc qua hotline trước khi đặt.",
    "",
    `- Đang mở bán: ${tours.filter((t) => t.type === "domestic").length} tour trong nước, ${tours.filter((t) => t.type === "abroad").length} tour nước ngoài`,
    "- Đặt online trên trang từng tour: gửi yêu cầu chưa bị trừ tiền, tư vấn viên gọi xác nhận",
    `- Chính sách thanh toán: ${SITE_URL}/chinh-sach-thanh-toan`,
    `- Chính sách huỷ & hoàn tiền: ${SITE_URL}/chinh-sach-huy-hoan`,
  ];

  for (const [loai, tieuDe] of [
    ["domestic", "Tour trong nước"],
    ["abroad", "Tour nước ngoài"],
  ]) {
    const nhom = theoNhom(tours, loai);
    if (!nhom.length) continue;
    phan.push("", `## ${tieuDe}`);
    for (const [ten, ds] of nhom) {
      phan.push("", `### ${ten} (${ds.length} tour)`);
      for (const t of ds) phan.push("", dongTour(t));
    }
  }

  const visaHopLe = visas.filter((v) => v?.slug && v?.name);
  if (visaHopLe.length) {
    phan.push(
      "",
      "## Dịch vụ làm visa",
      "",
      "Phí dịch vụ theo từng nước; hồ sơ cần chuẩn bị ghi trên trang từng nước.",
      "",
      "| Nước | Loại visa | Phí dịch vụ từ | Thời gian xử lý |",
      "|---|---|---|---|",
      ...visaHopLe.map(
        (v) =>
          `| [${chu(v.name)}](${SITE_URL}/lam-visa/${v.slug}) | ${v.typeLabel} | ${gia(v.priceValue)} | ${String(v.time || "Liên hệ").replace(/\|/g, "/")} |`
      )
    );
  }

  // Combo Maldives niêm yết USD theo hạng phòng × ngày (bảng đầy đủ trên trang từng combo)
  if (maldives.length) {
    phan.push(
      "",
      "## Combo nghỉ dưỡng Maldives",
      "",
      "Giá USD cho 1 người lớn, theo hạng phòng và ngày khởi hành; bảng giá đầy đủ trên trang từng combo.",
      "",
      ...maldives.map((c) =>
        `- [${chu(c.name)}](${SITE_URL}/maldives/${c.slug})${c.days ? ` — ${c.days} ngày ${c.nights ?? ""} đêm`.trimEnd() : ""}${c.airline ? `, bay ${c.airline}` : ""}: ${c.giaTu ? `từ $${Number(c.giaTu).toLocaleString("vi-VN")}/khách` : "liên hệ"}`
      )
    );
  }

  phan.push("", "## Liên hệ đặt tour", "", khoiLienHe(lh), "");
  return phan.join("\n");
}

/** /llms.txt — giới thiệu công ty cho AI theo chuẩn llmstxt.org. */
export function llmsTxt({ tours = [], visas = [], settings = {}, muaDip = [], maldives = [], luc = new Date() }) {
  const lh = lienHe(settings);
  const trongNuoc = tours.filter((t) => t.type === "domestic");
  const nuocNgoai = tours.filter((t) => t.type === "abroad");
  const noShop = tours.filter((t) => /no\s*-?\s*shop/i.test(`${t.tag || ""} ${t.name || ""}`)).length;
  const visaCoGia = visas.filter((v) => v.priceValue > 0);

  const tomTatNhom = (loai) =>
    theoNhom(tours, loai).map(([ten, ds]) => {
      const thapNhat = giaThapNhat(ds);
      return `- ${ten}: ${ds.length} tour${thapNhat ? `, giá từ ${formatVND(thapNhat)}/khách` : ""}`;
    });

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} (${TEN_PHAP_NHAN}) là công ty lữ hành quốc tế tại TP. Hồ Chí Minh, hoạt động từ năm ${NAM_THANH_LAP}. Công ty tổ chức tour du lịch trọn gói trong nước và nước ngoài, làm visa, đặt vé máy bay, team building và du lịch công ty.`,
    "",
    `Thông tin cập nhật lúc ${gioVN.format(luc)} (giờ Việt Nam):`,
    "",
    `- ${soNamHoatDong()} năm hoạt động (từ năm ${NAM_THANH_LAP}), phục vụ hơn ${LUOT_KHACH_MOI_NAM} lượt khách mỗi năm, hơn ${SO_TUYEN_TOUR} tuyến tour.`,
    `- Giấy phép kinh doanh lữ hành quốc tế số ${lh.giayPhep}, do ${lh.noiCap} cấp.`,
    `- Đang mở bán ${trongNuoc.length} tour trong nước và ${nuocNgoai.length} tour nước ngoài; giá công khai trên từng trang tour và trong bảng giá bên dưới.`,
    noShop ? `- ${noShop} tour có nhãn No Shopping (lịch trình không ghé điểm mua sắm), ghi rõ trong bảng giá.` : null,
    "- Đặt tour online: chọn ngày khởi hành, gửi yêu cầu chưa bị trừ tiền, tư vấn viên gọi xác nhận.",
    "",
    "## Bảng giá",
    "",
    `- [Bảng giá tour](${SITE_URL}/pricing.md): mọi tour đang mở bán — giá người lớn, trẻ em, 3 ngày khởi hành gần nhất, hạn nộp hồ sơ visa, phí dịch vụ visa. Tự cập nhật theo hệ thống đặt tour.`,
    "",
    "## Tour trong nước",
    "",
    `- [Tất cả tour trong nước](${SITE_URL}/tour-trong-nuoc)`,
    ...tomTatNhom("domestic"),
    "",
    "## Tour nước ngoài",
    "",
    `- [Tất cả tour nước ngoài](${SITE_URL}/tour-nuoc-ngoai)`,
    ...tomTatNhom("abroad"),
    "",
    ...(muaDip.length
      ? [
          "## Tour theo mùa / dịp lễ",
          "",
          ...muaDip.map((p) => `- [${chu(p.name)}](${SITE_URL}/${p.slug}): tour khởi hành ${ngayVN(p.start_from)} – ${ngayVN(p.start_to)}`),
          "",
        ]
      : []),
    "## Dịch vụ khác",
    "",
    `- [Làm visa](${SITE_URL}/lam-visa): dịch vụ làm hồ sơ visa${visas.length ? ` cho ${visas.length} nước` : ""}${visaCoGia.length ? `, phí dịch vụ từ ${formatVND(Math.min(...visaCoGia.map((v) => v.priceValue)))}` : ""}`,
    `- [Combo Maldives](${SITE_URL}/maldives): combo nghỉ dưỡng trọn gói vé máy bay + resort${maldives.length ? `, ${maldives.length} combo đang mở bán` : ""}`,
    `- [Vé máy bay](${SITE_URL}/ve-may-bay): vé trong nước và quốc tế`,
    `- [Team building & du lịch công ty](${SITE_URL}/team-building): company trip, gala dinner, sự kiện doanh nghiệp trọn gói`,
    `- [Voucher & ưu đãi](${SITE_URL}/khuyen-mai): kiểm tra voucher PSV Travel còn dùng được không (gõ mã hoặc quét QR), chương trình giảm giá đang áp dụng`,
    "",
    "## Hỏi đáp & cẩm nang",
    "",
    `- [Câu hỏi thường gặp](${SITE_URL}/cau-hoi-thuong-gap)`,
    `- [Cẩm nang du lịch](${SITE_URL}/cam-nang): kinh nghiệm, hướng dẫn theo điểm đến`,
    `- [Khoảnh khắc du khách](${SITE_URL}/khoanh-khac-du-khach): ảnh thật của các đoàn`,
    "",
    "## Chính sách",
    "",
    `- [Chính sách thanh toán](${SITE_URL}/chinh-sach-thanh-toan)`,
    `- [Chính sách huỷ & hoàn tiền](${SITE_URL}/chinh-sach-huy-hoan)`,
    `- [Chính sách bảo mật](${SITE_URL}/chinh-sach-bao-mat)`,
    `- [Điều khoản sử dụng](${SITE_URL}/dieu-khoan-su-dung)`,
    "",
    "## Liên hệ",
    "",
    `- [Trang liên hệ](${SITE_URL}/lien-he)`,
    `- [Về chúng tôi](${SITE_URL}/ve-chung-toi)`,
    khoiLienHe(lh),
    "",
    "## Optional",
    "",
    `- [Sitemap](${SITE_URL}/sitemap.xml): danh sách mọi trang`,
    "",
  ]
    .filter((d) => d !== null)
    .join("\n");
}
