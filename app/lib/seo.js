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
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/logo.png`,
    areaServed: "VN",
  };
}

// JSON-LD cho một tour (TouristTrip + Offer)
export function tourJsonLd(tour, basePath) {
  const url = `${SITE_URL}${basePath}/${tour.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: (tour.highlights || []).join(", "),
    image: tour.image,
    url,
    touristType: "Leisure",
    itinerary: (tour.itinerary || []).map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.title,
      description: d.desc,
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
