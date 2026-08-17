// Mọi lời gọi tới backend Laravel đi qua đây.
// Đổi domain khi lên production ở biến API_URL.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Thời gian Next tự làm mới trang tĩnh (giây). 60 = chậm nhất 1 phút thấy thay đổi từ admin.
const REVALIDATE = 60;

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

// ---- Chuyển dữ liệu tour từ backend sang hình dạng giao diện quen dùng ----
function mapTour(t) {
  if (!t) return null;

  // Lấy đợt gần nhất (nếu API chi tiết có departures)
  const dep = Array.isArray(t.departures) && t.departures.length ? t.departures[0] : null;

  return {
    slug: t.slug,
    name: t.name,
    region: t.region,
    country: t.country,
    days: `${t.duration_days} ngày ${t.duration_nights} đêm`,
    departure: t.departure_from ? `Từ ${t.departure_from}` : "",
    price: t.adult_price,
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
      content: r.content,
      reply: r.admin_reply,
      date: r.created_at,
    })),
    cancellationPolicy: t.cancellation_policy,
    description: t.description,
  };
}

// ---- Các hàm dùng trong trang ----
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

export async function getTourSlugs() {
  const json = await layJSON(`/tours-slugs`);
  return json ?? [];
}