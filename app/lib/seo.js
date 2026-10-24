import { tomTatTour, tenCoSoNgay } from "./tomTatTour";

// Cấu hình SEO dùng chung. Đổi SITE_URL sang domain thật khi lên production.
// Đổi qua biến NEXT_PUBLIC_SITE_URL trong .env.local khi lên domain thật.
// Sai giá trị này thì thẻ canonical, Open Graph và sitemap đều trỏ nhầm chỗ.
// Giá trị dự phòng phải là tên miền THẬT: chuỗi này đi vào sitemap.xml, thẻ
// canonical, Open Graph và dữ liệu có cấu trúc gửi cho Google. Để nhầm một tên
// miền không tồn tại là khai báo sai với công cụ tìm kiếm.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://psvtravel.com";
export const SITE_NAME = "PSV Travel";
// Năm PSV Travel bắt đầu hoạt động — MỘT chỗ duy nhất cho cả website (trang
// chủ, Về chúng tôi, dữ liệu gửi Google). Trước đây chỗ ghi "9 năm", chỗ ghi
// "thành lập năm 2017", chỗ khác lại 2013 — tự mâu thuẫn trước mắt khách.
export const NAM_THANH_LAP = 2013;

// Số năm hoạt động, tự tăng theo năm hiện tại — không phải sửa tay mỗi năm.
export const soNamHoatDong = () => new Date().getFullYear() - NAM_THANH_LAP;

export const SITE_DESCRIPTION =
  "PSV Travel — công ty lữ hành chuyên tour trong nước và nước ngoài, vé máy bay, làm visa. Giá trọn gói minh bạch, hỗ trợ 24/7.";

export const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

// Ảnh chia sẻ mặc định (Open Graph/Twitter) khi trang không có ảnh riêng — để
// mọi trang đều có og:image (nếu thiếu, công cụ audit báo "OG tags incomplete",
// và khi dán link lên Facebook/Zalo cũng không hiện ảnh). Thay bằng ảnh banner
// 1200×630 khi có; tạm dùng logo cho đủ thẻ.
const OG_IMAGE_MAC_DINH = `${SITE_URL}/logo.png`;

// Gỡ dấu sao bọc tên điểm tham quan ("*Vạn Lý Trường Thành*") — quy ước nội bộ
// để tô đậm ngoài giao diện, không được lọt lên Google.
const boDauSao = (chu) => String(chu || "").replace(/\*([^*\n]+)\*/g, "$1");

// Cắt mô tả về tối đa ~155 ký tự (ngắt ở khoảng trắng, thêm dấu …) để thẻ meta
// description không bị công cụ tìm kiếm cắt cụt. Mô tả ngắn giữ nguyên.
function rutGonMoTa(text, gioiHan = 155) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length <= gioiHan) return s;
  const cat = s.slice(0, gioiHan);
  const khoangTrangCuoi = cat.lastIndexOf(" ");
  return (khoangTrangCuoi > 0 ? cat.slice(0, khoangTrangCuoi) : cat).trimEnd() + "…";
}

// Mô tả Google ngắn quá (dưới 110 ký tự — Ahrefs báo "Meta description too
// short", Google hay tự lấy đoạn khác thay vào) thì nối thêm đoạn mở đầu của
// CHÍNH nội dung trang. pageMeta rút gọn lại về ~155 ký tự.
export function moTaDu(moTa, html) {
  const dau = String(moTa || "").replace(/\s+/g, " ").trim();
  if (dau.length >= 110 || !html) return dau;
  // Mỗi đoạn / tiêu đề mục thành một câu (thêm dấu chấm nếu thiếu) — khỏi dính
  // "…bỏ qua Phố cổ Hội An về đêm Xem thêm…" thành một câu vô nghĩa
  const chu = String(html)
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .split(/<\/(?:p|h[1-6]|li|div|figcaption|blockquote|td|th)>|<br\s*\/?>/i)
    .map((doan) =>
      doan
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .replace(/\s+([.,!?;:…])/g, "$1")
        .trim()
    )
    .filter(Boolean)
    .map((cau) => (/[.!?…:]$/.test(cau) ? cau : `${cau}.`))
    .join(" ");
  if (!chu) return dau;
  // Nội dung mở đầu bằng đúng câu tóm tắt thì khỏi lặp lại
  const them = dau && chu.startsWith(dau) ? chu.slice(dau.length).trim() : chu;
  return dau ? `${/[.!?…]$/.test(dau) ? dau : `${dau}.`} ${them}` : them;
}

// Tiêu đề hiển thị trên Google — tối đa 70 ký tự (quá mức này Google cắt cụt
// thành "…" và công cụ audit báo "Long title element").
//
// Mặc định thêm đuôi " | PSV Travel" (template ở layout gốc). Tên tour / bài
// viết đã dài thì BỎ đuôi; vẫn còn quá dài thì cắt gọn ở ranh giới một từ —
// không bao giờ cắt giữa chữ. Tour và bài cẩm nang có ô "Tiêu đề SEO" trong
// trang quản trị để nhân viên tự viết tiêu đề ngắn, đẹp hơn cách cắt tự động.
const TIEU_DE_TOI_DA = 70;
const DUOI_TIEU_DE = ` | ${SITE_NAME}`;

export function tieuDeSeo(title) {
  const t = String(title || "").replace(/\s+/g, " ").trim();
  if ((t + DUOI_TIEU_DE).length <= TIEU_DE_TOI_DA) {
    return { metaTitle: t, hienThi: t + DUOI_TIEU_DE };
  }
  let ngan = t;
  if (ngan.length > TIEU_DE_TOI_DA) {
    const cat = ngan.slice(0, TIEU_DE_TOI_DA - 1);
    const kt = cat.lastIndexOf(" ");
    // Bỏ dấu ngăn cách còn trơ ở cuối ("… Hội An –", "… CATHAY |")
    ngan = (kt > 20 ? cat.slice(0, kt) : cat).replace(/[\s\-–—|:,;/]+$/u, "") + "…";
  }
  return { metaTitle: { absolute: ngan }, hienThi: ngan };
}

// Metadata cho một trang thường
export function pageMeta({ title, description, path = "/", image }) {
  const url = SITE_URL + path;
  // Trang nào quên khai báo mô tả thì ghép tên trang vào đầu câu mặc định —
  // mỗi trang một mô tả riêng, không bao giờ trùng nhau ("Duplicate meta
  // descriptions": trước đây 7 trang cùng dùng nguyên một câu mặc định).
  const desc = rutGonMoTa(description || `${title} — ${SITE_DESCRIPTION}`);
  const anh = image || OG_IMAGE_MAC_DINH;
  const { metaTitle, hienThi } = tieuDeSeo(title);
  return {
    title: metaTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: hienThi,
      description: desc,
      url,
      siteName: SITE_NAME,
      locale: "vi_VN",
      type: "website",
      images: [{ url: anh }],
    },
    twitter: {
      card: "summary_large_image",
      title: hienThi,
      description: desc,
      images: [anh],
    },
  };
}

// Metadata cho trang chi tiết tour
export function tourMeta(tour, basePath) {
  if (!tour) return pageMeta({ title: "Không tìm thấy tour", path: basePath });
  const path = `${basePath}/${tour.slug}`;
  // Ghép từng phần, phần nào trống thì bỏ — trước đây ra "khởi hành Từ Hồ Chí
  // Minh" (hoa giữa câu), "khởi hành ." khi chưa nhập nơi đi, "Giá từ 0 ₫" với
  // tour giá liên hệ, và lọt dấu * đánh dấu tên điểm tham quan lên Google.
  const noiDi = String(tour.departure || "").trim();
  const diemNhan = (tour.highlights || []).map((h) => boDauSao(h).trim()).filter(Boolean).slice(0, 3);
  const description = [
    `${tour.name} — ${tour.days}${noiDi ? `, khởi hành ${noiDi.charAt(0).toLowerCase()}${noiDi.slice(1)}` : ""}`,
    tour.price > 0 ? `Giá từ ${formatVND(tour.price)}/khách` : "Liên hệ để nhận báo giá",
    diemNhan.join(", "),
  ]
    .filter(Boolean)
    .join(". ") + ".";
  // Ưu tiên "Tiêu đề SEO" nhân viên tự viết trong admin; trống thì tự sinh
  return pageMeta({ title: tour.seoTitle || tieuDeTour(tour), description, path, image: tour.coAnhBia ? tour.image : undefined });
}

// Tiêu đề Google tự sinh: tên tour (+ số ngày nếu tên chưa có) + "Từ 3,99 triệu"
// — giá hiện ngay trên kết quả tìm kiếm kéo thêm lượt bấm (ưu tiên hơn đuôi
// " | PSV Travel", đuôi chỉ thêm khi còn chỗ). Giá viết gọn vì tên tour thật
// thường đã 40–50 ký tự; dài quá 65 ký tự thì bỏ giá cho khỏi bị Google cắt.
function tieuDeTour(tour) {
  const m = String(tour.days || "").match(/(\d+)\s*ngày\s*(\d+)\s*đêm/);
  const soNgay = !m || tenCoSoNgay(tour) ? "" : Number(m[2]) > 0 ? ` ${m[1]}N${m[2]}Đ` : ` ${m[1]} ngày`;
  const ten = `${String(tour.name || "").trim()}${soNgay}`;
  const gia = Number(tour.price);
  if (!(gia > 0)) return ten;
  const giaGon =
    gia >= 1_000_000
      ? `${(gia / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} triệu`
      : `${gia.toLocaleString("vi-VN")}đ`;
  const coGia = `${ten} | Từ ${giaGon}`;
  return coGia.length <= 65 ? coGia : ten;
}

// JSON-LD tổ chức (đặt ở layout gốc)
// Thông tin pháp nhân — cố định theo giấy phép doanh nghiệp, ít khi đổi.
// Để ở đây (không đọc từ API) vì layout dựng tĩnh; đọc API sẽ khiến mọi trang
// chuyển sang render động, mất phần dựng sẵn.
export const CONG_TY = {
  dienThoai: "+84 907 870 707",
  email: "nguyendusit399@gmail.com",
  diaChi: "529 Huỳnh Tấn Phát",
  quan: "Quận 7",
  thanhPho: "Thành phố Hồ Chí Minh",
  maBuuChinh: "700000",
  // Toạ độ THẬT lấy từ Google Business Profile (map nhúng ở trang liên hệ)
  viDo: 10.74372,
  kinhDo: 106.72971,
  // Giờ văn phòng 8:00–17:00 mọi ngày (hotline vẫn 24/7). Đổi thì đổi CẢ HAI dòng:
  // dòng trên cho Google (schema), dòng dưới hiện cho khách và trong /llms.txt
  gioMoCua: "Mo-Su 08:00-17:00",
  gioLamViec: "Thứ 2 – Chủ nhật: 8:00 – 17:00",
  khoangGia: "$$",
  giayPhep: "79-769/2020/CDLQGVN-GP LHQT",
  coQuanCap: "Cục Du lịch Quốc gia Việt Nam",
  // Các trang mạng xã hội CHÍNH THỨC. Thêm Zalo/TikTok/YouTube khi có.
  mangXaHoi: [
    "https://www.facebook.com/people/PSV-Travel/61590715693751/",
  ],
};

// Dùng chung một mã định danh cho pháp nhân, để các schema khác trỏ về bằng @id
// thay vì lặp lại cả khối — Google gộp thành một thực thể duy nhất.
export const ORG_ID = `${SITE_URL}/#organization`;

// Schema tổ chức cho trang chủ. Google và các cỗ máy tìm kiếm AI đọc khối này
// để hiểu doanh nghiệp: tên, số điện thoại, địa chỉ, giờ làm việc, mạng xã hội.
// Trước đây chỉ có tên + logo nên gần như không giúp gì cho tìm kiếm địa phương.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: "CÔNG TY CỔ PHẦN DU LỊCH P.S.V TRAVEL",
    foundingDate: String(NAM_THANH_LAP),
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    telephone: CONG_TY.dienThoai,
    email: CONG_TY.email,
    priceRange: CONG_TY.khoangGia,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONG_TY.diaChi,
      addressLocality: CONG_TY.quan,
      addressRegion: CONG_TY.thanhPho,
      postalCode: CONG_TY.maBuuChinh,
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONG_TY.viDo,
      longitude: CONG_TY.kinhDo,
    },
    openingHours: CONG_TY.gioMoCua,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONG_TY.dienThoai,
      contactType: "customer service",
      areaServed: "VN",
      availableLanguage: ["vi", "en"],
    },
    // Giấy phép lữ hành quốc tế — tín hiệu uy tín hiếm, kiểm chứng được.
    // Trước đây chỉ nằm trong llms.txt, giờ đưa vào schema cho AI và Google thấy.
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Giấy phép kinh doanh lữ hành quốc tế",
      identifier: CONG_TY.giayPhep,
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: CONG_TY.coQuanCap,
      },
    },
    areaServed: "VN",
    sameAs: CONG_TY.mangXaHoi,
  };
}

// Schema WEBSITE cho trang chủ — giúp Google/AI hiểu đây là một thực thể website
// gắn với pháp nhân. KHÔNG kèm SearchAction vì website chưa có trang tìm kiếm
// riêng (bộ lọc chạy client, không có endpoint /tim-kiem).
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "vi-VN",
    publisher: { "@id": ORG_ID },
  };
}

// Tác giả bài cẩm nang (Person) — Google dùng để đánh giá độ tin cậy của bài
// (E-E-A-T). Chỉ khai các ô admin đã điền; sameAs là trang mạng xã hội của
// chính người đó. a: tác giả đã qua mapTacGia (app/lib/api.js).
export function personJsonLd(a) {
  const url = `${SITE_URL}/tac-gia/${a.slug}`;
  const knowsAbout = [a.expertise, ...(a.countries ?? [])].filter(Boolean);
  return {
    "@type": "Person",
    "@id": `${url}#person`,
    name: a.name,
    url,
    jobTitle: a.position || undefined,
    image: a.photo || undefined,
    description: a.bio || undefined,
    worksFor: { "@id": ORG_ID },
    knowsAbout: knowsAbout.length ? knowsAbout : undefined,
    sameAs: a.socialLinks?.length ? a.socialLinks : undefined,
  };
}

// Đường dẫn phân cấp (breadcrumb) — hiện dải điều hướng trên kết quả tìm kiếm,
// và giúp AI hiểu cấu trúc trang. items: [{ name, url }] theo thứ tự từ gốc.
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// Schema dịch vụ (visa, vé máy bay) — trỏ nhà cung cấp về pháp nhân qua @id.
export function serviceJsonLd({ name, serviceType, url, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    url,
    description,
    provider: { "@id": ORG_ID },
    areaServed: "VN",
  };
}

// JSON-LD cho một tour (TouristTrip + Offer)

// Tình trạng bán theo thực tế: mọi ngày khởi hành đều đã hết hạn nhận hồ sơ visa
// thì "hết", còn lại "còn" (tour chưa có lịch vẫn nhận đặt theo yêu cầu).
const tinhTrangBan = (tour) =>
  tour.hetHanVisa ? "https://schema.org/OutOfStock" : "https://schema.org/InStock";

export function tourJsonLd(tour, basePath) {
  const url = `${SITE_URL}${basePath}/${tour.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    // Đúng đoạn "Tổng quan tour" đang hiện đầu trang
    description: boDauSao(String(tour.description || "").trim() || tomTatTour(tour)),
    image: tour.coAnhBia ? tour.image : undefined,
    url,
    touristType: "Leisure",
    // itinerary theo schema.org phải là ItemList (không phải mảng ListItem trần)
    // — để mảng trần khiến trình kiểm tra dữ liệu có cấu trúc báo lỗi kiểu.
    itinerary: {
      "@type": "ItemList",
      itemListElement: (tour.itinerary || []).map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.title,
        // Bỏ dấu sao đánh dấu điểm tham quan: đó là quy ước nội bộ để tô đậm
        // ngoài giao diện, không được lọt vào dữ liệu gửi cho công cụ tìm kiếm.
        description: boDauSao(d.desc),
      })),
    },
    provider: { "@id": ORG_ID },
    // Ngày cập nhật gần nhất — độ mới là yếu tố mạnh để AI trích dẫn.
    ...(tour.updatedAt ? { dateModified: String(tour.updatedAt).slice(0, 10) } : {}),
    // Tour giá "liên hệ" (0đ) không khai giá: Google sẽ hiện thành "Miễn phí"
    ...(tour.price > 0
      ? {
          offers: {
            "@type": "Offer",
            price: tour.price,
            priceCurrency: "VND",
            availability: tinhTrangBan(tour),
            url,
            ...(tour.departures?.length
              ? {
                  // Đợt khởi hành gần nhất còn mở (đã lọc, sắp theo ngày)
                  validFrom: tour.departures[0].startISO,
                }
              : {}),
          },
        }
      : {}),
    // aggregateRating CHỈ khi có đánh giá thật: Google coi block này không hợp lệ
    // nếu reviewCount = 0, cả trang mất luôn dữ liệu có cấu trúc.
    ...(tour.rating && tour.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tour.rating,
            reviewCount: tour.reviews,
          },
        }
      : {}),
  };
}

// Schema PRODUCT cho tour — để Google hiện GIÁ + SAO đánh giá (rich snippet)
// ngay trên kết quả tìm kiếm, giống các đối thủ lớn. TouristTrip ở trên giữ
// ngữ nghĩa "chuyến đi"; Product ở đây mở khoá ô giá/sao. Giá, đánh giá đều là
// dữ liệu THẬT đang hiển thị trên trang nên hợp lệ với chính sách của Google.
export function tourProductJsonLd(tour, basePath) {
  const url = `${SITE_URL}${basePath}/${tour.slug}`;
  // priceValidUntil (Google khuyến nghị có, tránh cảnh báo): ưu tiên đợt khởi
  // hành xa nhất; không có thì lấy cuối năm sau.
  const hanGia =
    tour.lastDepartureDate ||
    tour.departures?.[tour.departures.length - 1]?.startISO ||
    `${new Date().getFullYear() + 1}-12-31`;
  const coDanhGia = Boolean(tour.rating && tour.reviews > 0);
  // Từng đánh giá: tối đa 5 bài ĐẦU TIÊN đang hiện trên trang (Google chỉ nhận
  // đánh giá khách nhìn thấy được), có tên, số sao và nội dung — AI trích được
  // lời khách thật thay vì chỉ một con số trung bình.
  const danhGia = (tour.reviewsList || [])
    .filter((r) => r.name && String(r.comment || "").trim() && r.rating > 0)
    .slice(0, 5);
  // Product phải có giá hoặc đánh giá mới hợp lệ — tour giá liên hệ chưa có đánh
  // giá thì không khai báo (khai thiếu thì Search Console báo lỗi cả trang).
  if (!(tour.price > 0) && !coDanhGia && !danhGia.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tour.name,
    ...(tour.coAnhBia ? { image: [tour.image] } : {}),
    description: boDauSao((tour.highlights || []).join(", ")) || tour.name,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(tour.slug ? { sku: tour.slug } : {}),
    ...(tour.price > 0
      ? {
          offers: {
            "@type": "Offer",
            price: tour.price,
            priceCurrency: "VND",
            availability: tinhTrangBan(tour),
            url,
            priceValidUntil: String(hanGia).slice(0, 10),
          },
        }
      : {}),
    // aggregateRating chỉ thêm khi có đánh giá thật (reviewCount > 0) — bắt buộc
    // để Google hiện sao, và để không vi phạm chính sách "đánh giá phải có thật".
    ...(tour.rating && tour.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tour.rating,
            reviewCount: tour.reviews,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(danhGia.length
      ? {
          review: danhGia.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
            reviewBody: String(r.comment).trim(),
            ...(r.date ? { datePublished: String(r.date).slice(0, 10) } : {}),
          })),
        }
      : {}),
  };
}

// Schema VIDEO dùng chung (tour, cẩm nang, sự kiện) — để video có cơ hội hiện
// ở tab "Video" của Google kèm ảnh thu nhỏ. Google BẮT BUỘC có uploadDate: dùng
// ngày cập nhật trang (lúc video được gắn lên). Thiếu mã hợp lệ hoặc thiếu ngày
// thì không xuất schema, tránh báo lỗi trong Search Console.
export function videoJsonLd({ videoId, name, description, uploadDate, url }) {
  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId) || !uploadDate) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description: rutGonMoTa(description || name),
    thumbnailUrl: [`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`],
    uploadDate: String(uploadDate).slice(0, 10),
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    url,
    publisher: { "@id": ORG_ID },
  };
}

export function tourVideoJsonLd(tour, basePath) {
  if (!tour) return null;
  return videoJsonLd({
    videoId: tour.videoId,
    name: `Video tour ${tour.name}`,
    description:
      boDauSao((tour.highlights || []).join(", ")) || `Video giới thiệu tour ${tour.name} của ${SITE_NAME}.`,
    uploadDate: tour.updatedAt,
    url: `${SITE_URL}${basePath}/${tour.slug}`,
  });
}

// Câu hỏi thường gặp — items: [{ q, a }] đúng như đang hiện trên trang (Google
// yêu cầu nội dung FAQPage phải nhìn thấy được trên trang).
export function faqJsonLd(items) {
  if (!items?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Component nhúng JSON-LD
// Chuỗi JSON đưa vào thẻ <script> PHẢI thay "<" bằng <.
//
// JSON.stringify không chặn "</script>": một tên tour / câu FAQ / tiêu đề bài
// (nhân viên nhập trong admin) chứa "</script><script>…" sẽ đóng khối JSON-LD
// sớm và chạy mã trên trang công khai, với MỌI khách truy cập (stored XSS).
// < vẫn là "<" với trình phân tích JSON — Google đọc schema y hệt — nhưng
// trình duyệt không còn thấy thẻ đóng. Đúng cách tài liệu Next khuyến nghị.
export function chuoiJsonLdAnToan(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: chuoiJsonLdAnToan(data) }}
    />
  );
}
