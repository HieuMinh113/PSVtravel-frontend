// Mọi lời gọi tới backend Laravel đi qua đây. Đổi domain khi lên production.
import { layNguon } from "./nguonKhach";
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
// Tour chưa có ảnh bìa: ảnh thay thế nền nhạt có logo PSV — thẻ tour, trang
// chi tiết không bị ô ảnh vỡ. Vòng xoay / nền đầu trang chỉ dùng ảnh thật (coAnhBia).
export const ANH_TOUR_MAC_DINH = "/anh-tour-mac-dinh.jpg";

function mapTour(t) {
  if (!t) return null;
  const dep = Array.isArray(t.departures) && t.departures.length ? t.departures[0] : null;

    return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    // "Tiêu đề SEO" nhân viên tự viết trong admin (tối đa 70 ký tự) — chỉ dùng
    // cho thẻ <title> trên Google; tên tour hiển thị trên web giữ nguyên.
    seoTitle: t.seo_title ?? null,
    type: t.type,
    region: t.region,
    country: t.country,
    days: `${t.duration_days} ngày ${t.duration_nights} đêm`,
    departure: t.departure_from ? `Từ ${t.departure_from}` : "",
    // "Nộp hồ sơ visa trước ngày khởi hành N ngày" đang áp cho tour: theo danh sách
    // visa theo nước hoặc số riêng của tour (null = không có)
    visaDeadlineDays: t.visa_deadline_days ?? null,
    // Mọi ngày khởi hành hiện có đều đã quá hạn nộp hồ sơ visa (tour đã ẩn khỏi
    // danh sách; khách vào bằng link cũ) → trang tour báo hết hạn, mời liên hệ
    hetHanVisa: t.het_han_visa ?? false,
    // Dạng visa của tour (visa đoàn / lẻ / điện tử / giấy thông hành) — null = chưa chọn
    visaKind: t.visa_kind
      ? { label: t.visa_kind_label, note: t.visa_kind_note }
      : null,
    price: t.adult_price,
    childPrice: t.child_price ?? null,
    // Giá em bé (dưới 2 tuổi) — chỉ để khách xem, đặt online chưa tính em bé
    infantPrice: t.infant_price ?? null,
    oldPrice: t.old_price,
    rating: Number(t.rating) || 0,
    reviews: t.review_count ?? 0,
    seatsLeft: dep?.seats_left ?? t.next_seats_left ?? null,
    startDate: dep?.start_date_display ?? t.next_start_date ?? null,
    // Dãy ngày khởi hành cho thẻ tour ngoài trang danh sách (dạng Y-m-d)
    departureDates: t.departure_dates ?? [],
    departureCount: t.departure_count ?? 0,
    // Đợt xa nhất và số chỗ nhiều nhất — dùng để lọc theo ngày và số khách
    lastDepartureDate: t.last_departure_date ?? null,
    maxSeatsLeft: t.max_seats_left ?? null,
    image: t.cover_image || ANH_TOUR_MAC_DINH,
    coAnhBia: Boolean(t.cover_image),
    tag: t.tag,
    categorySlugs: t.category_slugs ?? [],
    // Danh mục tour [{ slug, name }] (chỉ trang chi tiết) — cấp "điểm đến" của breadcrumb
    categories: t.categories ?? [],
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
      startISO: d.start_date ?? null, // Y-m-d cho schema
      price: d.price,
      // Giá trẻ em / em bé của đợt (đợt không có giá riêng thì là giá chung của tour)
      priceChild: d.price_child ?? null,
      priceInfant: d.price_infant ?? null,
      seatsLeft: d.seats_left,
      // Hạn nộp hồ sơ visa của đợt này (đã tính theo quy tắc chung nếu đợt không có hạn riêng)
      visaDeadline: d.visa_deadline_display ?? null,
      visaDeadlineISO: d.visa_deadline ?? null,
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
    updatedAt: t.updated_at ?? null,
    videoId: t.video_id ?? null, // mã video YouTube (chỉ có ở trang chi tiết)
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

// Mọi tour đang hiển thị cho sitemap.xml: [{ slug, type, updated_at }]. Khác
// getTours: không giới hạn 50 tour, và gồm cả tour tạm ẩn khỏi danh sách vì hết
// hạn nộp visa (trang tour vẫn mở).
export async function getTourSitemap() {
  const json = await layJSON(`/tours-sitemap`, { batBuoc: true });
  return json?.data ?? [];
}

// Bảng giá mọi tour khách đặt được, cho /pricing.md và /llms.txt: mỗi tour kèm
// 3 đợt gần nhất (giá, hạn nộp visa). Không giới hạn 50 tour như getTours.
export async function getBangGia() {
  const json = await layJSON(`/tours-bang-gia`, { batBuoc: true });
  // layJSON coi 404 là "không có" và trả null — ở đây 404 nghĩa là API chưa có
  // đường dẫn này (backend cũ), không phải "0 tour": ném lỗi để giữ bản cũ
  if (!Array.isArray(json?.data)) throw new Error("API /tours-bang-gia không trả dữ liệu");
  return json.data;
}

// Trang tour theo mùa / dịp (/tour-tet, /tour-he…) đang bật: [{ slug, name,
// start_from, start_to, updated_at }] — cho sitemap, llms.txt, dựng sẵn trang
export async function getSeasonPages() {
  const json = await layJSON(`/season-pages`);
  return (json?.data ?? []).filter((p) => slugHopLe(p.slug));
}

// Một trang theo mùa / dịp + tour khởi hành trong dịp (thẻ tour chỉ kể ngày đi
// trong dịp). Không có thì null để trang báo 404.
export async function getSeasonPage(slug) {
  const json = await layJSON(`/season-pages/${slug}`);
  const p = json?.data;
  if (!p) return null;
  return { ...p, faqs: p.faqs ?? [], tours: (p.tours ?? []).map(mapTour) };
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
    // Kênh khách đến (TikTok, Google, ChatGPT…) để biết kênh / clip nào ra đơn
    body: JSON.stringify({ ...payload, nguon: layNguon() }),
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
  return (json?.data ?? []).map((m, i) => {
    // Ảnh chính đứng đầu, rồi tới các ảnh phụ (bỏ trùng) → bộ ảnh để xem lớn.
    const gallery = Array.isArray(m.gallery) ? m.gallery.filter(Boolean) : [];
    const photos = [m.image, ...gallery].filter((u, idx, arr) => u && arr.indexOf(u) === idx);
    return {
      id: i,
      name: m.customer_name,
      trip: m.tour_name,
      photo: m.image,
      photos, // ảnh chính + ảnh phụ
      videoId: m.video_id ?? null, // video cảm nhận của khách (YouTube)
      caption: m.caption,
      avatar: null, // model Moment chưa có
      rating: null,
      date: null,
    };
  });
}
// Chuyển một bản ghi visa từ backend sang hình dạng giao diện dùng.
function mapVisa(c) {
  if (!c) return null;
  const loai = { tourist: "Du lịch", business: "Công tác", study: "Du học" };
  return {
    slug: c.slug,
    name: c.name,
    flagImage: c.flag_image, // URL ảnh cờ (nếu có)
    type: c.visa_type,
    typeLabel: loai[c.visa_type] || "Du lịch",
    rate: c.success_rate ? `${c.success_rate}%` : null,
    time: c.processing_time,
    price: c.price ? `${Number(c.price).toLocaleString("vi-VN")}đ` : "Liên hệ",
    priceValue: Number(c.price) || 0, // số, cho bảng giá /pricing.md
    documents: c.required_documents ?? [],
    description: c.description ?? "",
    required: true,
  };
}

export async function getVisaCountries() {
  const json = await layJSON(`/visa-countries`);
  return (json?.data ?? []).map(mapVisa).filter(Boolean);
}

// Chi tiết một quốc gia. Chưa có thì trả null để trang hiện 404 đúng cách.
export async function getVisaCountry(slug) {
  const json = await layJSON(`/visa-countries/${slug}`);
  return mapVisa(json?.data ?? json);
}

// Câu hỏi "Phiếu thông tin xin visa" — backend giữ danh sách, web chỉ hiện ra
export async function getPhieuVisa() {
  const json = await layJSON(`/visa-applications/phieu`);
  return json?.data ?? [];
}

// Một slug hợp lệ chỉ gồm chữ THƯỜNG, số và dấu gạch ngang ở giữa —
// ví dụ "visa-nhat-ban". Dữ liệu admin nhập tay đôi khi lẫn chữ hoa hoặc
// dấu cách thừa ("Chau-a ", "Chau-a") — những slug đó KHÔNG mở được trang
// chi tiết (trang chỉ nhận đúng slug gốc), nên phải loại khỏi sitemap thay
// vì để Google tìm nạp ra 404. KHÔNG tự chuyển về chữ thường: làm vậy sẽ
// tạo URL không khớp bản ghi trong DB. Cách sửa triệt để là xoá bản ghi
// rác trong admin.
const MAU_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function slugHopLe(slug) {
  return typeof slug === "string" && MAU_SLUG.test(slug);
}

// Danh sách slug cho generateStaticParams — dựng sẵn từng trang chi tiết.
export async function getVisaSlugs() {
  const json = await layJSON(`/visa-countries`);
  return (json?.data ?? []).map((c) => c.slug).filter(slugHopLe);
}
export async function getSettings() {
  const json = await layJSON(`/settings`);
  return json?.data ?? {};
}
function mapTacGia(a) {
  if (!a?.slug) return null;
  return {
    slug: a.slug,
    name: a.name,
    position: a.position ?? null,
    photo: a.photo ?? null,
    yearsExperience: a.years_experience ?? null,
    expertise: a.expertise ?? null,
    bio: a.bio ?? "",
    countries: a.countries ?? [],
    profile: a.profile ?? "",
    socialLinks: a.social_links ?? [],
    updatedAt: a.updated_at ?? null,
  };
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
    // Tác giả có trang riêng /tac-gia/{slug} (null: bài chỉ có tên người nhập)
    authorProfile: mapTacGia(g.author),
    views: g.view_count ?? 0,
    date: g.published_at ? g.published_at.split("-").reverse().join("/") : null, // yyyy-mm-dd → dd/mm/yyyy
    updatedAt: g.updated_at ?? g.published_at ?? null, // cho sitemap lastmod thật
    videoId: g.video_id ?? null, // video minh hoạ (YouTube)
    content: g.content ?? null,
    metaTitle: g.meta_title ?? g.title,
    metaDescription: g.meta_description ?? g.excerpt,
    // Tour gắn kèm (nếu admin có chọn) — để hiện ô đặt tour bên bài viết.
    tour: g.tour ? mapTour(g.tour) : null,
    // Bài nằm ở điểm / thành phố nào trên bản đồ cẩm nang (trang bài mở bản đồ đúng chỗ)
    mapSpots: g.map_spots ?? [],
    mapCities: g.map_cities ?? [],
  };
}

export async function getGuides({ category } = {}) {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  q.set("per_page", "30");
  const json = await layJSON(`/guides?${q.toString()}`);
  return (json?.data ?? []).map(mapGuide);
}

// Mọi bài cẩm nang đang hiển thị cho sitemap.xml: [{ slug, updated_at }] —
// getGuides chỉ lấy 30 bài mới nhất.
export async function getGuideSitemap() {
  const json = await layJSON(`/guides-sitemap`);
  return json?.data ?? [];
}

export async function getGuideBySlug(slug) {
  const json = await layJSON(`/guides/${slug}`);
  return mapGuide(json?.data ?? json);
}

// Bản đồ cẩm nang: nước (kèm hình dạng để tô trên quả địa cầu) → thành phố →
// điểm → bài viết. Dữ liệu phụ: lỗi / chưa có thì trả null, trang Cẩm nang
// tự quay về dạng danh sách bài như cũ.
export async function getGuideMap() {
  const json = await layJSON(`/guide-map`);
  const d = json?.data;
  return d?.countries?.length ? d : null;
}

export async function getGuideSlugs() {
  const json = await layJSON(`/guides-slugs`);
  // Nhận cả mảng trần lẫn { data: [...] } như các hàm *Slugs khác — lệch dạng
  // là generateStaticParams gọi .map() trên object, cả lượt build hỏng.
  return Array.isArray(json) ? json : json?.data ?? [];
}

// Tác giả bài cẩm nang: [{ slug, name, updated_at }] — chỉ người có bài đã đăng
export async function getAuthors() {
  const json = await layJSON(`/authors`);
  return (json?.data ?? []).filter((a) => slugHopLe(a?.slug));
}

// Hồ sơ tác giả + các bài đã viết; null nếu không có / đã ẩn
export async function getAuthor(slug) {
  const json = await layJSON(`/authors/${slug}`);
  const a = mapTacGia(json?.data);
  return a ? { ...a, guides: (json.data.guides ?? []).map(mapGuide) } : null;
}

// ---- Combo Maldives (tách riêng khỏi tour) ----
function mapComboMaldives(c) {
  if (!c?.slug) return null;
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    seoTitle: c.seo_title ?? null,
    summary: c.summary ?? "",
    image: c.cover_image ?? null,
    days: c.duration_days ?? null,
    nights: c.duration_nights ?? null,
    stay: c.stay_summary ?? "",
    airline: c.airline ?? "",
    transfer: c.transfer ?? "",
    giaTu: c.gia_tu_usd ?? null,
    // Thẻ danh sách: tên nơi khởi hành; trang chi tiết: đủ phụ thu + lịch bay
    noiKhoiHanh: (c.noi_khoi_hanh ?? []).map((n) =>
      typeof n === "string" ? { city: n } : { city: n.city, surchargeUsd: n.surcharge_usd ?? null, flights: n.flights ?? [] }
    ),
    ngayKhoiHanh: (c.ngay_khoi_hanh ?? []).map((d) => ({ startDate: d.start_date, label: d.label ?? null })),
    featured: !!c.is_featured,
    updatedAt: c.updated_at ?? null,
    highlights: c.highlights ?? [],
    childPercent: c.child_percent ?? null,
    childAge: c.child_age ?? "",
    infantNote: c.infant_note ?? "",
    minGroup: c.min_group ?? null,
    included: c.included ?? [],
    excluded: c.excluded ?? [],
    notes: c.notes ?? [],
    dates: (c.dates ?? []).map((d) => ({ id: d.id, startDate: d.start_date, label: d.label ?? null, status: d.status, prices: d.prices ?? {} })),
    roomTypes: (c.room_types ?? []).map((p) => ({ id: p.id, name: p.name, capacity: p.capacity ?? "", adultsOnly: Boolean(p.adults_only), description: p.description ?? "", image: p.image ?? null })),
    itinerary: (c.days ?? []).map((d) => ({ day: d.day_number, title: d.title, meals: d.meals ?? "", desc: d.description ?? "", images: d.images ?? [] })),
    resort: c.resort
      ? {
          slug: c.resort.slug,
          name: c.resort.name,
          stars: c.resort.stars ?? null,
          atoll: c.resort.atoll ?? "",
          packageName: c.resort.package_name ?? "",
          intro: c.resort.intro ?? "",
          highlights: c.resort.highlights ?? [],
          image: c.resort.cover_image ?? null,
          gallery: c.resort.gallery ?? [],
          videoId: c.resort.video_id ?? null,
          amenities: c.resort.amenities ?? [],
          policies: c.resort.policies ?? [],
        }
      : null,
  };
}

export async function getMaldivesCombos() {
  const json = await layJSON(`/maldives`);
  return (json?.data ?? []).map(mapComboMaldives).filter(Boolean);
}

export async function getMaldivesCombo(slug) {
  const json = await layJSON(`/maldives/${encodeURIComponent(slug)}`);
  return mapComboMaldives(json?.data ?? null);
}

// [{ slug, updated_at }] cho sitemap / dựng sẵn trang
export async function getMaldivesSitemap() {
  const json = await layJSON(`/maldives-sitemap`);
  return (json?.data ?? []).filter((c) => slugHopLe(c?.slug));
}

// Khách gửi yêu cầu đặt combo — đi qua route của Next (gắn tài khoản, IP khách)
export async function datComboMaldives(payload) {
  const res = await fetch(`/api/maldives`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...payload, nguon: layNguon() }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const loi = json?.errors ? Object.values(json.errors).flat()[0] : null;
    throw new Error(loi || json?.message || "Gửi yêu cầu thất bại, vui lòng thử lại hoặc gọi hotline.");
  }
  return json;
}

// ---- Sự kiện / Team Building ----
function mapEvent(e) {
  if (!e) return null;
  return {
    slug: e.slug,
    title: e.title,
    summary: e.summary ?? "",
    audience: Array.isArray(e.audience) ? e.audience : [],
    image: e.cover_image ?? null,
    groupSize: e.group_size ?? null,
    duration: e.duration ?? null,
    location: e.location ?? null,
    priceNote: e.price_note ?? null,
    featured: !!e.is_featured,
  };
}

function mapEventDetail(e) {
  if (!e) return null;
  return {
    slug: e.slug,
    title: e.title,
    summary: e.summary ?? "",
    audience: Array.isArray(e.audience) ? e.audience : [],
    image: e.cover_image ?? null,
    gallery: Array.isArray(e.gallery) ? e.gallery : [],
    description: e.description ?? "",
    includes: Array.isArray(e.includes) ? e.includes : [],
    itinerary: Array.isArray(e.itinerary)
      ? e.itinerary.map((d) => ({
          title: d.title ?? "",
          description: d.description ?? "",
          images: Array.isArray(d.images) ? d.images : [],
        }))
      : [],
    rating: e.rating ?? null,
    reviewCount: e.review_count ?? 0,
    groupSize: e.group_size ?? null,
    duration: e.duration ?? null,
    location: e.location ?? null,
    priceNote: e.price_note ?? null,
    metaTitle: e.meta_title ?? e.title,
    metaDescription: e.meta_description ?? e.summary,
    videoId: e.video_id ?? null, // clip recap sự kiện (YouTube)
    updatedAt: e.updated_at ?? null,
  };
}

export async function getEvents() {
  const json = await layJSON(`/events?per_page=60`);
  return (json?.data ?? []).map(mapEvent).filter(Boolean);
}

export async function getEventBySlug(slug) {
  const json = await layJSON(`/events/${slug}`);
  return mapEventDetail(json?.data ?? json);
}

export async function getEventSlugs() {
  // Lọc slug hợp lệ (giống visa) để slug nhập sai không lọt vào sitemap/dựng trang
  const json = await layJSON(`/events-slugs`);
  return (json ?? []).filter(slugHopLe);
}

// Đội ngũ / ban lãnh đạo cho trang Về chúng tôi
export async function getTeamMembers() {
  const json = await layJSON(`/team-members`);
  return (json?.data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    position: m.position,
    email: m.email ?? null,
    photo: m.photo ?? null,
    bio: m.bio ?? "",
    authorSlug: m.author_slug ?? null, // có trang tác giả → gắn link
  }));
}

// Ảnh trang "Về chúng tôi" do admin thêm (Nội dung → Hình ảnh Về chúng tôi).
export async function getAboutImages() {
  const json = await layJSON(`/about-images`);
  return (json?.data ?? []).map((m) => ({
    id: m.id,
    image: m.image,
    caption: m.caption ?? "",
  }));
}

// ===== Nội dung marketing do admin quản lý =====

export async function getPromotions() {
  const json = await layJSON(`/promotions`);
  return json?.data ?? [];
}

export async function getDestinations({ featured } = {}) {
  const json = await layJSON(`/destinations${featured ? "?featured=1" : ""}`);
  return json?.data ?? [];
}

export async function getDestinationBySlug(slug) {
  const json = await layJSON(`/destinations/${slug}`);
  return json?.data ?? null;
}

export async function getDestinationSlugs() {
  const json = await layJSON(`/destinations-slugs`);
  return Array.isArray(json) ? json : json?.data ?? [];
}

export async function getFaqs() {
  const json = await layJSON(`/faqs`);
  return json?.data ?? [];
}

export async function getJobs() {
  const json = await layJSON(`/jobs`);
  return json?.data ?? [];
}

export async function getJobBySlug(slug) {
  const json = await layJSON(`/jobs/${slug}`);
  return json?.data ?? null;
}

export async function getJobSlugs() {
  const json = await layJSON(`/jobs-slugs`);
  return Array.isArray(json) ? json : json?.data ?? [];
}

export async function getPartners() {
  const json = await layJSON(`/partners`);
  return json?.data ?? [];
}

// Khách đăng ký nhận ưu đãi — đi qua route cùng origin /api/subscribe
// (không gọi chéo tên miền sang API, tránh CORS chặn ở production).
export async function subscribeEmail(email, source = "trang-chu") {
  const res = await fetch(`/api/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, source }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || "Đăng ký thất bại, vui lòng thử lại.");
  }
  return json;
}


// Đánh giá đã duyệt của một gói (dựng sẵn ở trang chi tiết cho SEO)
export async function getEventReviews(slug) {
  const json = await layJSON(`/events/${slug}/reviews`);
  return {
    items: json?.data ?? [],
    rating: json?.rating ?? null,
    reviewCount: json?.review_count ?? 0,
  };
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
