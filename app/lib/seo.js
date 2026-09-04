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
  phuong: "Phường Tân Thuận",
  thanhPho: "Thành phố Hồ Chí Minh",
  gioMoCua: "Mo-Su 08:00-17:00",
  khoangGia: "$$",
  // Các trang mạng xã hội CHÍNH THỨC. Thêm Zalo/TikTok/YouTube khi có.
  mangXaHoi: [
    "https://www.facebook.com/people/PSV-Travel/61590715693751/",
  ],
};

// Schema tổ chức cho trang chủ. Google và các cỗ máy tìm kiếm AI đọc khối này
// để hiểu doanh nghiệp: tên, số điện thoại, địa chỉ, giờ làm việc, mạng xã hội.
// Trước đây chỉ có tên + logo nên gần như không giúp gì cho tìm kiếm địa phương.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
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
      addressLocality: CONG_TY.phuong,
      addressRegion: CONG_TY.thanhPho,
      addressCountry: "VN",
    },
    openingHours: CONG_TY.gioMoCua,
    areaServed: "VN",
    sameAs: CONG_TY.mangXaHoi,
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
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url,
    },
    ...(tour.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tour.rating,
            reviewCount: tour.reviews || 0,
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
