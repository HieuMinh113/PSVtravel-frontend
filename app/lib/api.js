// Mọi lời gọi tới backend Laravel đi qua đây. Đổi domain khi lên production.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const REVALIDATE = 60; // giây — chậm nhất 1 phút thấy thay đổi từ admin

async function layJSON(duongDan) {
<<<<<<< HEAD
=======
  // Backend chết KHÔNG được kéo sập cả website: trả null để trang vẫn dựng
  // với phần dữ liệu còn lại, thay vì ném lỗi làm Next trả 500 toàn trang.
>>>>>>> 682d1cac74c502564cf1e1fa781c4c727b1f5188
  try {
    const res = await fetch(`${API_URL}${duongDan}`, {
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/json" },
    });
<<<<<<< HEAD

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`API lỗi ${res.status}: ${duongDan}`);
      return null;
    }

    return res.json();
  } catch (e) {
    // Backend tắt / mất mạng: ghi log rồi trả null để trang vẫn dựng được.
    // Không ném lỗi ra ngoài — một API chết không được phép làm sập cả website.
=======
    if (!res.ok) {
      if (res.status !== 404) console.error(`API lỗi ${res.status}: ${duongDan}`);
      return null;
    }
    return res.json();
  } catch (e) {
>>>>>>> 682d1cac74c502564cf1e1fa781c4c727b1f5188
    console.error(`Không gọi được API: ${duongDan}`, e?.cause?.code || e?.message);
    return null;
  }
}

// Chuyển dữ liệu tour từ backend sang đúng hình dạng giao diện quen dùng
function mapTour(t) {
  if (!t) return null;
  const dep = Array.isArray(t.departures) && t.departures.length ? t.departures[0] : null;

    return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    type: t.type,
    region: t.region,
    country: t.country,
    days: `${t.duration_days} ngày ${t.duration_nights} đêm`,
    departure: t.departure_from ? `Từ ${t.departure_from}` : "",
    price: t.adult_price,
    childPrice: t.child_price ?? null,
    oldPrice: t.old_price,
    rating: Number(t.rating) || 0,
    reviews: t.review_count ?? 0,
    seatsLeft: dep?.seats_left ?? t.next_seats_left ?? null,
    startDate: dep?.start_date_display ?? t.next_start_date ?? null,
    image: t.cover_image,
    tag: t.tag,
    highlights: t.highlights ?? [],
    itinerary: (t.itineraries ?? []).map((it) => ({
      day: `Ngày ${it.day_number}`,
      title: it.title,
      desc: it.description,
    })),
    departures: (t.departures ?? []).map((d) => ({
      id: d.id,
      startDate: d.start_date_display ?? d.start_date,
      price: d.price,
      seatsLeft: d.seats_left,
    })),
    images: (t.images ?? []).map((img) => img.url),
    reviewsList: (t.reviews ?? []).map((r) => ({
      name: r.customer_name,
      rating: r.rating,
      comment: r.content,
      reply: r.admin_reply,
      date: r.created_at,
    })),
    description: t.description,
  };
}

export async function getTours({ type, featured, category } = {}) {
  const q = new URLSearchParams();
  if (type) q.set("type", type);
  if (featured) q.set("featured", "true");
  if (category) q.set("category", category);
  q.set("per_page", "50");

  const json = await layJSON(`/tours?${q.toString()}`);
  return (json?.data ?? []).map(mapTour);
}

export async function getTourBySlug(slug) {
  const json = await layJSON(`/tours/${slug}`);
  return mapTour(json?.data ?? json);
}
// Gọi từ trình duyệt (form đặt tour). Server tự tính tiền & đặt trạng thái.
export async function createBooking(payload) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || "Đặt tour thất bại, vui lòng thử lại.");
  }
  return json;
}
// viTri: promo | orbit_home | orbit_domestic | orbit_abroad
export async function getBanners(viTri = "promo") {
  const json = await layJSON(`/banners?position=${viTri}`);
  return json?.data ?? [];
}

// Ảnh cho vòng xoay ở đầu trang, quản lý trong admin (Banner → chọn vị trí).
// Trả mảng URL. Chưa upload ảnh nào thì trả mảng rỗng để trang tự dùng ảnh dự phòng.
export async function getOrbitImages(viTri) {
  const banners = await getBanners(viTri);
  return banners.map((b) => b.image).filter(Boolean);
}
export async function getFeaturedReviews() {
  const json = await layJSON(`/reviews/featured`);
  return (json?.data ?? []).map((r) => ({
    name: r.name,
    trip: r.tour_name,
    quote: r.content,
    rating: r.rating,
    photo: r.tour_image,
  }));
}
export async function getMoments() {
  const json = await layJSON(`/moments`);
  return (json?.data ?? []).map((m, i) => ({
    id: i,
    name: m.customer_name,
    trip: m.tour_name,
    photo: m.image,
    caption: m.caption,
    avatar: null, // model Moment chưa có
    rating: null,
    date: null,
  }));
}
export async function getVisaCountries() {
  const json = await layJSON(`/visa-countries`);
  return (json?.data ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    flagImage: c.flag_image, // URL ảnh cờ (nếu có)
    rate: c.success_rate ? `${c.success_rate}%` : null,
    time: c.processing_time,
    price: c.price ? `${Number(c.price).toLocaleString("vi-VN")}đ` : "Liên hệ",
    required: true,
  }));
}
export async function getAirlines() {
  const json = await layJSON(`/airlines`);
  return (json?.data ?? []).map((a) => ({
    name: a.name,
    code: a.code,
    logoImage: a.logo, // URL hoặc null
  }));
}

export async function getFlightDeals() {
  const json = await layJSON(`/flight-deals`);
  return (json?.data ?? []).map((d, i) => ({
    id: i,
    route: `${d.from_city} → ${d.to_city}`,
    price: d.price ? `${Number(d.price).toLocaleString("vi-VN")}đ` : "Liên hệ",
    oldPrice: d.old_price ? `${Number(d.old_price).toLocaleString("vi-VN")}đ` : null,
    airlineName: d.airline?.name ?? null,
    airlineLogo: d.airline?.logo ?? null,
    note: d.note ?? null,
    image: null, // FlightDeal không có ảnh
  }));
}
export async function getSettings() {
  const json = await layJSON(`/settings`);
  return json?.data ?? {};
}
function mapGuide(g) {
  if (!g) return null;
  return {
    slug: g.slug,
    title: g.title,
    excerpt: g.excerpt,
    image: g.cover_image,
    category: g.category,
    author: g.author_name ?? null,
    views: g.view_count ?? 0,
    date: g.published_at ? g.published_at.split("-").reverse().join("/") : null, // yyyy-mm-dd → dd/mm/yyyy
    content: g.content ?? null,
    metaTitle: g.meta_title ?? g.title,
    metaDescription: g.meta_description ?? g.excerpt,
  };
}

export async function getGuides({ category } = {}) {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  q.set("per_page", "30");
  const json = await layJSON(`/guides?${q.toString()}`);
  return (json?.data ?? []).map(mapGuide);
}

export async function getGuideBySlug(slug) {
  const json = await layJSON(`/guides/${slug}`);
  return mapGuide(json?.data ?? json);
}

export async function getGuideSlugs() {
  const json = await layJSON(`/guides-slugs`);
  return json ?? [];
}