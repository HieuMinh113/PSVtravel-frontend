// Cấu hình SEO dùng chung. Đổi SITE_URL sang domain thật khi lên production.
// Đổi qua biến NEXT_PUBLIC_SITE_URL trong .env.local khi lên domain thật.
// Sai giá trị này thì thẻ canonical, Open Graph và sitemap đều trỏ nhầm chỗ.
// Giá trị dự phòng phải là tên miền THẬT: chuỗi này đi vào sitemap.xml, thẻ
// canonical, Open Graph và dữ liệu có cấu trúc gửi cho Google. Để nhầm một tên
// miền không tồn tại là khai báo sai với công cụ tìm kiếm.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://psvtravel.com";
export const SITE_NAME = "PSV Travel";
export const SITE_DESCRIPTION =
  "PSV Travel — công ty lữ hành chuyên tour trong nước và nước ngoài, vé máy bay, làm visa. Giá trọn gói minh bạch, hỗ trợ 24/7.";

export const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

// Metadata cho một trang thường
export function pageMeta({ title, description, path = "/", image }) {
  const url = SITE_URL + path;
  const desc = description || SITE_DESCRIPTION;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      url,
      siteName: SITE_NAME,
      locale: "vi_VN",
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      images: image ? [image] : undefined,
    },
  };
}

// Metadata cho trang chi tiết tour
export function tourMeta(tour, basePath) {
  if (!tour) return pageMeta({ title: "Không tìm thấy tour", path: basePath });
  const path = `${basePath}/${tour.slug}`;
  const description = `${tour.name} — ${tour.days}, khởi hành ${tour.departure}. Giá từ ${formatVND(
    tour.price
  )}/khách. ${(tour.highlights || []).slice(0, 3).join(", ")}.`;
  return pageMeta({ title: tour.name, description, path, image: tour.image });
}

// JSON-LD tổ chức (đặt ở layout gốc)
// Thông tin pháp nhân — cố định theo giấy phép doanh nghiệp, ít khi đổi.
// Để ở đây (không đọc từ API) vì layout dựng tĩnh; đọc API sẽ khiến mọi trang
// chuyển sang render động, mất phần dựng sẵn.
const CONG_TY = {
  dienThoai: "+84 907 870 707",
  email: "hi@psvtravel.com",
  diaChi: "529 Huỳnh Tấn Phát",
  quan: "Quận 7",
  thanhPho: "Thành phố Hồ Chí Minh",
  maBuuChinh: "700000",
  // Toạ độ THẬT lấy từ Google Business Profile (map nhúng ở trang liên hệ)
  viDo: 10.74372,
  kinhDo: 106.72971,
  gioMoCua: "Mo-Su 08:00-17:00",
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
// Gỡ dấu sao bọc tên điểm tham quan trong nội dung lịch trình.
const boDauSao = (chu) => String(chu || "").replace(/\*([^*\n]+)\*/g, "$1");

export function tourJsonLd(tour, basePath) {
  const url = `${SITE_URL}${basePath}/${tour.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: boDauSao((tour.highlights || []).join(", ")),
    image: tour.image,
    url,
    touristType: "Leisure",
    itinerary: (tour.itinerary || []).map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.title,
      // Bỏ dấu sao đánh dấu điểm tham quan: đó là quy ước nội bộ để tô đậm
      // ngoài giao diện, không được lọt vào dữ liệu gửi cho công cụ tìm kiếm.
      description: boDauSao(d.desc),
    })),
    provider: { "@id": ORG_ID },
    // Ngày cập nhật gần nhất — độ mới là yếu tố mạnh để AI trích dẫn.
    ...(tour.updatedAt ? { dateModified: String(tour.updatedAt).slice(0, 10) } : {}),
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url,
      ...(tour.departures?.length
        ? {
            // Đợt khởi hành gần nhất còn mở (đã lọc, sắp theo ngày)
            validFrom: tour.departures[0].startISO,
          }
        : {}),
    },
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

// Component nhúng JSON-LD
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
