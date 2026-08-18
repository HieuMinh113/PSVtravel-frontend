// Mọi lời gọi tới backend Laravel đi qua đây. Đổi domain khi lên production.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const REVALIDATE = 60; // giây — chậm nhất 1 phút thấy thay đổi từ admin

async function layJSON(duongDan) {
  const res = await fetch(`${API_URL}${duongDan}`, {
    next: { revalidate: REVALIDATE },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`API lỗi ${res.status}: ${duongDan}`);
  }
  return res.json();
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
export async function getBanners() {
  const json = await layJSON(`/banners`);
  return json?.data ?? [];
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