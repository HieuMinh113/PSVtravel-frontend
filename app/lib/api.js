// Mọi lời gọi tới backend Laravel đi qua đây. Đổi domain khi lên production.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
const REVALIDATE = 60; // giây — chậm nhất 1 phút thấy thay đổi từ admin

const CHO_GIUA_CAC_LAN = [0, 250, 750]; // mili giây trước lần gọi thứ 1, 2, 3

const nghi = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Gọi backend Laravel.
 *
 * `batBuoc: true` dùng cho dữ liệu mà thiếu nó thì trang trở nên VÔ NGHĨA —
 * danh sách tour, danh mục. Gọi không được thì NÉM LỖI thay vì trả rỗng.
 *
 * Vì sao phải ném lỗi: Next lưu lại kết quả dựng trang rồi phục vụ cho mọi
 * khách trong 60 giây. Nếu nuốt lỗi rồi trả mảng rỗng, trang vẫn "dựng thành
 * công" với 0 tour — và **cái trang rỗng đó bị lưu lại**. Một cú chớp mạng
 * 50 mili giây biến thành 60 giây cả website hiện "Không tìm thấy tour phù
 * hợp" cho tất cả khách. Tệ hơn: việc dựng lại chạy ngầm mỗi khi có người
 * truy cập, nên trúng cú chớp nào là bản rỗng thay thế bản tốt, bất kể lúc nào.
 *
 * Ném lỗi thì Next bỏ lần dựng đó và **giữ nguyên bản tốt trước đó**. Cú chớp
 * mạng trở nên vô hình thay vì đóng băng thành trang rỗng.
 *
 * Dữ liệu phụ (banner, khoảnh khắc, visa...) vẫn trả null như cũ: thiếu chúng
 * thì ẩn một khối, không việc gì phải bỏ cả trang.
 */
async function layJSON(duongDan, { batBuoc = false } = {}) {
  let loiCuoi = null;

  for (let lan = 0; lan < CHO_GIUA_CAC_LAN.length; lan++) {
    if (CHO_GIUA_CAC_LAN[lan]) await nghi(CHO_GIUA_CAC_LAN[lan]);

    try {
      const res = await fetch(`${API_URL}${duongDan}`, {
        next: { revalidate: REVALIDATE },
        headers: { Accept: "application/json" },
      });

      if (res.ok) return res.json();

      // 404 là câu trả lời hợp lệ (trang tĩnh chưa tạo), không thử lại
      if (res.status === 404) return null;

      // 4xx khác là lỗi phía mình, thử lại cũng vậy
      if (res.status < 500) {
        console.error(`API lỗi ${res.status}: ${duongDan}`);
        loiCuoi = new Error(`API trả về ${res.status}`);
        break;
      }

      loiCuoi = new Error(`API trả về ${res.status}`);
    } catch (e) {
      loiCuoi = e;
    }
  }

  const lyDo = loiCuoi?.cause?.code || loiCuoi?.message || "không rõ";
  console.error(`Không gọi được API sau ${CHO_GIUA_CAC_LAN.length} lần: ${duongDan}`, lyDo);

  if (batBuoc) {
    throw new Error(`Không lấy được dữ liệu bắt buộc từ API: ${duongDan} (${lyDo})`);
  }
  return null;
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
    // Dãy ngày khởi hành cho thẻ tour ngoài trang danh sách (dạng dd/mm)
    departureDates: t.departure_dates ?? [],
    departureCount: t.departure_count ?? 0,
    image: t.cover_image,
    tag: t.tag,
    categorySlugs: t.category_slugs ?? [],
    highlights: t.highlights ?? [],
    itinerary: (t.itineraries ?? []).map((it) => ({
      day: `Ngày ${it.day_number}`,
      title: it.title,
      desc: it.description,
      images: it.images ?? [],
    })),
    departures: (t.departures ?? []).map((d) => ({
      id: d.id,
      startDate: d.start_date_display ?? d.start_date,
      price: d.price,
      seatsLeft: d.seats_left,
    })),
    images: (t.images ?? []).map((img) => img.url),
    // Khối "Những thông tin cần lưu ý" ở cuối trang tour
    included: t.included ?? [],
    excluded: t.excluded ?? [],
    cancellationPolicy: t.cancellation_policy ?? "",
    notes: (t.notes ?? []).map((n) => ({ title: n.title, content: n.content })),
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

export async function getTours({ type, featured, category, perPage = 50 } = {}) {
  const q = new URLSearchParams();
  if (type) q.set("type", type);
  if (featured) q.set("featured", "true");
  if (category) q.set("category", category);
  // Trang nào chỉ cần vài tour thì truyền perPage nhỏ — tải 50 tour kèm đợt
  // khởi hành rồi vứt đi gần hết là phần chậm dễ bỏ sót nhất.
  q.set("per_page", String(perPage));

  // Bắt buộc: trang danh sách tour mà không có tour thì không còn là trang nữa
  const json = await layJSON(`/tours?${q.toString()}`, { batBuoc: true });
  return (json?.data ?? []).map(mapTour);
}

export async function getTourBySlug(slug) {
  const json = await layJSON(`/tours/${slug}`);
  return mapTour(json?.data ?? json);
}
// Gọi từ trình duyệt (form đặt tour). Server tự tính tiền & đặt trạng thái.
export async function createBooking(payload) {
  // Gọi route handler của Next chứ KHÔNG gọi thẳng Laravel: chỉ ở phía máy chủ
  // Next mới đọc được cookie token để gắn vào yêu cầu, nhờ đó đơn của khách
  // đã đăng nhập mới nối được vào tài khoản.
  const res = await fetch(`/api/bookings`, {
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

// Trang tĩnh do admin soạn (điều khoản, chính sách...). Nội dung nằm trong
// mục Trang tĩnh của trang quản trị, bộ phận pháp chế tự sửa không cần lập
// trình viên. Chưa soạn thì trả về bản ghi có body rỗng, không phải null.
export async function getPage(slug) {
  const json = await layJSON(`/pages/${slug}`);
  const p = json?.data ?? json;
  if (!p) return null;

  return {
    slug: p.slug,
    title: p.title,
    body: p.body || "",
    heroImage: p.hero_image ?? null,
    metaTitle: p.meta_title || p.title,
    metaDescription: p.meta_description ?? null,
    updatedAt: p.updated_at ?? null,
  };
}

// Điểm đến nổi bật ở trang chủ — lấy từ Danh mục tour trong admin.
// Mỗi danh mục là một điểm đến: có tên, ảnh riêng và SỐ TOUR THẬT do máy chủ đếm.
export async function getCategories(loai) {
  const q = loai ? `?type=${loai}` : "";
  // Bắt buộc: danh mục dựng nên mega menu và các nút lọc
  const json = await layJSON(`/categories${q}`, { batBuoc: true });

  return (json?.data ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    type: c.type,
    image: c.image,
    description: c.description,
    tourCount: c.tours_count ?? 0,
  }));
}
