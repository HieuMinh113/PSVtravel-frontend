(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_04850a._.js", {

"[project]/app/lib/api.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

// Mọi lời gọi tới backend Laravel đi qua đây. Đổi domain khi lên production.
__turbopack_esm__({
    "createBooking": ()=>createBooking,
    "getAirlines": ()=>getAirlines,
    "getBanners": ()=>getBanners,
    "getFeaturedReviews": ()=>getFeaturedReviews,
    "getFlightDeals": ()=>getFlightDeals,
    "getGuideBySlug": ()=>getGuideBySlug,
    "getGuideSlugs": ()=>getGuideSlugs,
    "getGuides": ()=>getGuides,
    "getMoments": ()=>getMoments,
    "getSettings": ()=>getSettings,
    "getTourBySlug": ()=>getTourBySlug,
    "getTours": ()=>getTours,
    "getVisaCountries": ()=>getVisaCountries
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
const API_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api/v1") || "http://localhost:8000/api/v1";
const REVALIDATE = 60; // giây — chậm nhất 1 phút thấy thay đổi từ admin
async function layJSON(duongDan) {
    try {
        const res = await fetch(`${API_URL}${duongDan}`, {
            next: {
                revalidate: REVALIDATE
            },
            headers: {
                Accept: "application/json"
            }
        });
        if (!res.ok) {
            if (res.status === 404) return null;
            console.error(`API lỗi ${res.status}: ${duongDan}`);
            return null;
        }
        return res.json();
    } catch (e) {
        // Backend tắt / mất mạng: ghi log rồi trả null để trang vẫn dựng được.
        // Không ném lỗi ra ngoài — một API chết không được phép làm sập cả website.
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
        itinerary: (t.itineraries ?? []).map((it)=>({
                day: `Ngày ${it.day_number}`,
                title: it.title,
                desc: it.description
            })),
        departures: (t.departures ?? []).map((d)=>({
                id: d.id,
                startDate: d.start_date_display ?? d.start_date,
                price: d.price,
                seatsLeft: d.seats_left
            })),
        images: (t.images ?? []).map((img)=>img.url),
        reviewsList: (t.reviews ?? []).map((r)=>({
                name: r.customer_name,
                rating: r.rating,
                comment: r.content,
                reply: r.admin_reply,
                date: r.created_at
            })),
        description: t.description
    };
}
async function getTours({ type, featured, category } = {}) {
    const q = new URLSearchParams();
    if (type) q.set("type", type);
    if (featured) q.set("featured", "true");
    if (category) q.set("category", category);
    q.set("per_page", "50");
    const json = await layJSON(`/tours?${q.toString()}`);
    return (json?.data ?? []).map(mapTour);
}
async function getTourBySlug(slug) {
    const json = await layJSON(`/tours/${slug}`);
    return mapTour(json?.data ?? json);
}
async function createBooking(payload) {
    const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(payload)
    });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(json?.message || "Đặt tour thất bại, vui lòng thử lại.");
    }
    return json;
}
async function getBanners() {
    const json = await layJSON(`/banners`);
    return json?.data ?? [];
}
async function getFeaturedReviews() {
    const json = await layJSON(`/reviews/featured`);
    return (json?.data ?? []).map((r)=>({
            name: r.name,
            trip: r.tour_name,
            quote: r.content,
            rating: r.rating,
            photo: r.tour_image
        }));
}
async function getMoments() {
    const json = await layJSON(`/moments`);
    return (json?.data ?? []).map((m, i)=>({
            id: i,
            name: m.customer_name,
            trip: m.tour_name,
            photo: m.image,
            caption: m.caption,
            avatar: null,
            rating: null,
            date: null
        }));
}
async function getVisaCountries() {
    const json = await layJSON(`/visa-countries`);
    return (json?.data ?? []).map((c)=>({
            slug: c.slug,
            name: c.name,
            flagImage: c.flag_image,
            rate: c.success_rate ? `${c.success_rate}%` : null,
            time: c.processing_time,
            price: c.price ? `${Number(c.price).toLocaleString("vi-VN")}đ` : "Liên hệ",
            required: true
        }));
}
async function getAirlines() {
    const json = await layJSON(`/airlines`);
    return (json?.data ?? []).map((a)=>({
            name: a.name,
            code: a.code,
            logoImage: a.logo
        }));
}
async function getFlightDeals() {
    const json = await layJSON(`/flight-deals`);
    return (json?.data ?? []).map((d, i)=>({
            id: i,
            route: `${d.from_city} → ${d.to_city}`,
            price: d.price ? `${Number(d.price).toLocaleString("vi-VN")}đ` : "Liên hệ",
            oldPrice: d.old_price ? `${Number(d.old_price).toLocaleString("vi-VN")}đ` : null,
            airlineName: d.airline?.name ?? null,
            airlineLogo: d.airline?.logo ?? null,
            note: d.note ?? null,
            image: null
        }));
}
async function getSettings() {
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
        date: g.published_at ? g.published_at.split("-").reverse().join("/") : null,
        content: g.content ?? null,
        metaTitle: g.meta_title ?? g.title,
        metaDescription: g.meta_description ?? g.excerpt
    };
}
async function getGuides({ category } = {}) {
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    q.set("per_page", "30");
    const json = await layJSON(`/guides?${q.toString()}`);
    return (json?.data ?? []).map(mapGuide);
}
async function getGuideBySlug(slug) {
    const json = await layJSON(`/guides/${slug}`);
    return mapGuide(json?.data ?? json);
}
async function getGuideSlugs() {
    const json = await layJSON(`/guides-slugs`);
    return json ?? [];
}

})()),
"[project]/data/tours.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

// Dữ liệu mẫu — trong dự án thật sẽ được thay bằng API/CMS
__turbopack_esm__({
    "abroadTours": ()=>abroadTours,
    "allTours": ()=>allTours,
    "domesticTours": ()=>domesticTours,
    "formatVND": ()=>formatVND,
    "regionIcons": ()=>regionIcons
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/tree-palm.js [app-client] (ecmascript) <export default as Palmtree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mountain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mountain$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/mountain.js [app-client] (ecmascript) <export default as Mountain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$waves$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Waves$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/waves.js [app-client] (ecmascript) <export default as Waves>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/landmark.js [app-client] (ecmascript) <export default as Landmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/tree-pine.js [app-client] (ecmascript) <export default as TreePine>");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const domesticTours = [
    {
        slug: "phu-quoc-3n2d",
        name: "Phú Quốc thiên đường biển đảo",
        region: "Miền Nam",
        days: "3 ngày 2 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 5890000,
        oldPrice: 6990000,
        rating: 4.8,
        reviews: 214,
        seatsLeft: 6,
        startDate: "26/07/2026",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop",
        tag: "Bán chạy",
        highlights: [
            "Grand World về đêm",
            "Cáp treo Hòn Thơm",
            "VinWonders Safari",
            "Lặn ngắm san hô"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Phú Quốc – Grand World",
                desc: "Đón chuyến bay ra đảo Ngọc, nhận phòng khách sạn, dạo chơi phố đi bộ Grand World với show nhạc nước, ánh sáng rực rỡ."
            },
            {
                day: "Ngày 2",
                title: "VinWonders – Safari – Cáp treo Hòn Thơm",
                desc: "Khám phá công viên giải trí, vườn thú bán hoang dã Safari, trải nghiệm cáp treo vượt biển dài nhất thế giới."
            },
            {
                day: "Ngày 3",
                title: "Chợ đêm Dinh Cậu – Tiễn sân bay",
                desc: "Tự do mua sắm đặc sản, tiễn đoàn ra sân bay về lại TP.HCM."
            }
        ]
    },
    {
        slug: "sapa-fansipan-4n3d",
        name: "Sa Pa – Chinh phục Fansipan",
        region: "Miền Bắc",
        days: "4 ngày 3 đêm",
        departure: "Từ Hà Nội",
        price: 4590000,
        oldPrice: null,
        rating: 4.9,
        reviews: 189,
        seatsLeft: 10,
        startDate: "22/07/2026",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1600&auto=format&fit=crop",
        tag: "Mới",
        highlights: [
            "Đỉnh Fansipan bằng cáp treo",
            "Bản Cát Cát",
            "Ruộng bậc thang Mường Hoa",
            "Chợ phiên vùng cao"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "Hà Nội – Lào Cai – Sa Pa",
                desc: "Khởi hành đêm, di chuyển bằng xe giường nằm cao cấp."
            },
            {
                day: "Ngày 2",
                title: "Bản Cát Cát – Thung lũng Mường Hoa",
                desc: "Tham quan bản làng người H'Mông, ngắm ruộng bậc thang mùa lúa."
            },
            {
                day: "Ngày 3",
                title: "Chinh phục Fansipan",
                desc: "Trải nghiệm cáp treo ba dây hiện đại lên nóc nhà Đông Dương."
            },
            {
                day: "Ngày 4",
                title: "Chợ Sa Pa – Về Hà Nội",
                desc: "Mua sắm quà lưu niệm, khởi hành về Hà Nội."
            }
        ]
    },
    {
        slug: "ha-long-ninh-binh-3n2d",
        name: "Vịnh Hạ Long – Tràng An Ninh Bình",
        region: "Miền Bắc",
        days: "3 ngày 2 đêm",
        departure: "Từ Hà Nội",
        price: 4290000,
        oldPrice: 4890000,
        rating: 4.7,
        reviews: 302,
        seatsLeft: 8,
        startDate: "19/07/2026",
        image: "https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?q=80&w=1600&auto=format&fit=crop",
        tag: "Giảm giá",
        highlights: [
            "Du thuyền ngủ đêm trên vịnh",
            "Hang Sửng Sốt",
            "Thuyền Tràng An",
            "Chùa Bái Đính"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "Hà Nội – Hạ Long",
                desc: "Lên du thuyền 4 sao, thưởng thức hải sản, ngắm hoàng hôn trên vịnh."
            },
            {
                day: "Ngày 2",
                title: "Hang Sửng Sốt – Ninh Bình",
                desc: "Chèo kayak, khám phá hang động, di chuyển về Tràng An."
            },
            {
                day: "Ngày 3",
                title: "Tràng An – Bái Đính – Hà Nội",
                desc: "Ngồi thuyền xuyên hang Tràng An, viếng chùa Bái Đính."
            }
        ]
    },
    {
        slug: "da-nang-hoi-an-hue-5n4d",
        name: "Đà Nẵng – Hội An – Huế mộng mơ",
        region: "Miền Trung",
        days: "5 ngày 4 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 8799000,
        oldPrice: 9599000,
        rating: 4.8,
        reviews: 256,
        seatsLeft: 10,
        startDate: "22/07/2026",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1600&auto=format&fit=crop",
        tag: "Bán chạy",
        highlights: [
            "Bà Nà Hills – Cầu Vàng",
            "Phố cổ Hội An về đêm",
            "Đại Nội Huế",
            "Động Phong Nha"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Đà Nẵng",
                desc: "Nhận phòng, dạo biển Mỹ Khê."
            },
            {
                day: "Ngày 2",
                title: "Bà Nà Hills",
                desc: "Tham quan Cầu Vàng, Làng Pháp, vườn hoa Le Jardin."
            },
            {
                day: "Ngày 3",
                title: "Hội An – Đèn lồng cổ trấn",
                desc: "Phố cổ Hội An, thả đèn hoa đăng trên sông Hoài."
            },
            {
                day: "Ngày 4",
                title: "Huế – Đại Nội",
                desc: "Tham quan Đại Nội, lăng tẩm triều Nguyễn."
            },
            {
                day: "Ngày 5",
                title: "Động Phong Nha – Tiễn sân bay",
                desc: "Khám phá hang động, ra sân bay về lại."
            }
        ]
    },
    {
        slug: "mien-tay-can-tho-3n2d",
        name: "Miền Tây sông nước Cần Thơ",
        region: "Miền Nam",
        days: "3 ngày 2 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 2990000,
        oldPrice: null,
        rating: 4.6,
        reviews: 143,
        seatsLeft: 10,
        startDate: "24/07/2026",
        image: "https://images.unsplash.com/photo-1596395463024-e37ff86e1e0e?q=80&w=1600&auto=format&fit=crop",
        tag: null,
        highlights: [
            "Chợ nổi Cái Răng",
            "Vườn trái cây miệt vườn",
            "Cù Lao Thới Sơn",
            "Đờn ca tài tử"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Mỹ Tho – Bến Tre",
                desc: "Tham quan cù lao, thưởng thức trà mật ong, đờn ca tài tử."
            },
            {
                day: "Ngày 2",
                title: "Cần Thơ – Chợ nổi Cái Răng",
                desc: "Dậy sớm khám phá chợ nổi, tham quan vườn trái cây."
            },
            {
                day: "Ngày 3",
                title: "Sóc Trăng – Về TP.HCM",
                desc: "Viếng chùa Dơi, mua đặc sản, khởi hành về."
            }
        ]
    },
    {
        slug: "ha-giang-4n3d",
        name: "Hà Giang mùa hoa tam giác mạch",
        region: "Miền Bắc",
        days: "4 ngày 3 đêm",
        departure: "Từ Hà Nội",
        price: 5290000,
        oldPrice: null,
        rating: 4.9,
        reviews: 97,
        seatsLeft: 5,
        startDate: "15/08/2026",
        image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=1600&auto=format&fit=crop",
        tag: "Mới",
        highlights: [
            "Đèo Mã Pí Lèng",
            "Sông Nho Quế",
            "Cao nguyên đá Đồng Văn",
            "Cột cờ Lũng Cú"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "Hà Nội – Hà Giang",
                desc: "Khởi hành sớm, nghỉ chân tại Tam Sơn."
            },
            {
                day: "Ngày 2",
                title: "Đồng Văn – Lũng Cú",
                desc: "Chinh phục cột cờ Lũng Cú, tham quan phố cổ Đồng Văn."
            },
            {
                day: "Ngày 3",
                title: "Mã Pí Lèng – Sông Nho Quế",
                desc: "Đi thuyền trên sông Nho Quế, ngắm đèo Mã Pí Lèng hùng vĩ."
            },
            {
                day: "Ngày 4",
                title: "Về Hà Nội",
                desc: "Trên đường về ghé chợ phiên vùng cao."
            }
        ]
    }
];
const abroadTours = [
    {
        slug: "thai-lan-bangkok-pattaya-5n4d",
        name: "Thái Lan Bangkok – Pattaya",
        region: "Đông Nam Á",
        country: "Thái Lan",
        days: "5 ngày 4 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 7990000,
        oldPrice: 8990000,
        rating: 4.7,
        reviews: 421,
        seatsLeft: 10,
        startDate: "02/08/2026",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1600&auto=format&fit=crop",
        tag: "Bán chạy",
        highlights: [
            "Đảo Coral đảo San Hô",
            "Chợ nổi Damnoen Saduak",
            "Chùa Vàng, Chùa Bình Minh",
            "Show Alcazar"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Bangkok",
                desc: "Bay sang Bangkok, tham quan thành phố về đêm."
            },
            {
                day: "Ngày 2",
                title: "Chợ nổi – Pattaya",
                desc: "Tham quan chợ nổi, di chuyển đến Pattaya."
            },
            {
                day: "Ngày 3",
                title: "Đảo San Hô",
                desc: "Vui chơi thể thao biển tại Coral Island."
            },
            {
                day: "Ngày 4",
                title: "Show Alcazar – Bangkok",
                desc: "Xem show nghệ thuật nổi tiếng, mua sắm tại Bangkok."
            },
            {
                day: "Ngày 5",
                title: "Chùa Vàng – Về nước",
                desc: "Tham quan chùa, ra sân bay về TP.HCM."
            }
        ]
    },
    {
        slug: "han-quoc-seoul-nami-4n3d",
        name: "Hàn Quốc Seoul – Đảo Nami",
        region: "Đông Bắc Á",
        country: "Hàn Quốc",
        days: "4 ngày 4 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 17499000,
        oldPrice: 18990000,
        rating: 4.8,
        reviews: 268,
        seatsLeft: 6,
        startDate: "26/07/2026",
        image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1600&auto=format&fit=crop",
        tag: "Bán chạy",
        highlights: [
            "Đảo Nami lãng mạn",
            "Tháp Namsan",
            "Cung điện Gyeongbokgung",
            "Everland Park"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Seoul",
                desc: "Đáp chuyến bay đêm đến Incheon."
            },
            {
                day: "Ngày 2",
                title: "Đảo Nami – Petite France",
                desc: "Tham quan bối cảnh phim Bản tình ca mùa đông."
            },
            {
                day: "Ngày 3",
                title: "Everland – Chợ Myeongdong",
                desc: "Vui chơi công viên giải trí lớn nhất Hàn Quốc."
            },
            {
                day: "Ngày 4",
                title: "Cung điện – Về nước",
                desc: "Tham quan cung điện cổ, mua sắm mỹ phẩm."
            }
        ]
    },
    {
        slug: "nhat-ban-osaka-kyoto-5n5d",
        name: "Nhật Bản Osaka – Kyoto – Núi Phú Sĩ",
        region: "Đông Bắc Á",
        country: "Nhật Bản",
        days: "5 ngày 5 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 34999000,
        oldPrice: null,
        rating: 4.9,
        reviews: 156,
        seatsLeft: 9,
        startDate: "23/07/2026",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop",
        tag: "Cao cấp",
        highlights: [
            "Núi Phú Sĩ",
            "Đền Fushimi Inari",
            "Lâu đài Osaka",
            "Phố cổ Kyoto"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Osaka",
                desc: "Nhận phòng khách sạn trung tâm Osaka."
            },
            {
                day: "Ngày 2",
                title: "Kyoto cổ kính",
                desc: "Tham quan đền Fushimi Inari, rừng tre Arashiyama."
            },
            {
                day: "Ngày 3",
                title: "Núi Phú Sĩ",
                desc: "Ngắm núi thiêng từ hồ Kawaguchi."
            },
            {
                day: "Ngày 4",
                title: "Tokyo – Yamanashi",
                desc: "Tự do khám phá theo lịch trình gợi ý."
            },
            {
                day: "Ngày 5",
                title: "Về nước",
                desc: "Mua sắm quà lưu niệm, ra sân bay."
            }
        ]
    },
    {
        slug: "singapore-sentosa-4n3d",
        name: "Singapore – Đảo Sentosa",
        region: "Đông Nam Á",
        country: "Singapore",
        days: "4 ngày 3 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 12990000,
        oldPrice: 13990000,
        rating: 4.7,
        reviews: 198,
        seatsLeft: 10,
        startDate: "30/07/2026",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop",
        tag: "Giảm giá",
        highlights: [
            "Gardens by the Bay",
            "Universal Studios Sentosa",
            "Vịnh Marina",
            "Chinatown"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Singapore",
                desc: "Tham quan vịnh Marina Bay về đêm."
            },
            {
                day: "Ngày 2",
                title: "Sentosa – Universal Studios",
                desc: "Vui chơi cả ngày tại đảo giải trí Sentosa."
            },
            {
                day: "Ngày 3",
                title: "Gardens by the Bay",
                desc: "Ngắm Supertree Grove, mua sắm Orchard Road."
            },
            {
                day: "Ngày 4",
                title: "Về nước",
                desc: "Tự do buổi sáng, ra sân bay."
            }
        ]
    },
    {
        slug: "trung-quoc-truong-gia-gioi-6n5d",
        name: "Trung Quốc Ân Thi – Trương Gia Giới",
        region: "Đông Bắc Á",
        country: "Trung Quốc",
        days: "6 ngày 5 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 17990000,
        oldPrice: null,
        rating: 4.6,
        reviews: 88,
        seatsLeft: 5,
        startDate: "19/07/2026",
        image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=1600&auto=format&fit=crop",
        tag: null,
        highlights: [
            "Núi Thiên Môn Sơn",
            "Cầu kính Trương Gia Giới",
            "Phượng Hoàng Cổ Trấn",
            "Rừng cột đá Avatar"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Trương Gia Giới",
                desc: "Nhận phòng, nghỉ ngơi sau chuyến bay."
            },
            {
                day: "Ngày 2",
                title: "Thiên Môn Sơn",
                desc: "Cáp treo dài nhất thế giới, cổng trời huyền thoại."
            },
            {
                day: "Ngày 3",
                title: "Cầu kính đại phong cảnh",
                desc: "Trải nghiệm cầu kính cao nhất thế giới."
            },
            {
                day: "Ngày 4",
                title: "Phượng Hoàng Cổ Trấn",
                desc: "Dạo phố cổ bên sông Đà Giang."
            },
            {
                day: "Ngày 5",
                title: "Ân Thi",
                desc: "Tham quan thị trấn cổ trầm mặc."
            },
            {
                day: "Ngày 6",
                title: "Về nước",
                desc: "Ra sân bay về TP.HCM."
            }
        ]
    },
    {
        slug: "dai-loan-dai-bac-cao-hung-5n4d",
        name: "Đài Loan Đài Bắc – Cao Hùng",
        region: "Đông Bắc Á",
        country: "Đài Loan",
        days: "5 ngày 4 đêm",
        departure: "Từ Hồ Chí Minh",
        price: 12999000,
        oldPrice: 13990000,
        rating: 4.7,
        reviews: 132,
        seatsLeft: 7,
        startDate: "01/08/2026",
        image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=1600&auto=format&fit=crop",
        tag: "Giảm giá",
        highlights: [
            "Tháp Đài Bắc 101",
            "Cửu Phần cổ trấn",
            "Hồ Nhật Nguyệt",
            "Chợ đêm Sĩ Lâm"
        ],
        itinerary: [
            {
                day: "Ngày 1",
                title: "TP.HCM – Đài Bắc",
                desc: "Tham quan tháp Đài Bắc 101, chợ đêm Sĩ Lâm."
            },
            {
                day: "Ngày 2",
                title: "Cửu Phần – Thập Phần",
                desc: "Thả đèn trời tại phố cổ Thập Phần."
            },
            {
                day: "Ngày 3",
                title: "Hồ Nhật Nguyệt",
                desc: "Du thuyền ngắm hồ nước ngọt đẹp nhất Đài Loan."
            },
            {
                day: "Ngày 4",
                title: "Cao Hùng",
                desc: "Tham quan chùa Phật Quang Sơn."
            },
            {
                day: "Ngày 5",
                title: "Về nước",
                desc: "Mua sắm quà lưu niệm, ra sân bay."
            }
        ]
    }
];
const allTours = [
    ...domesticTours,
    ...abroadTours
];
const regionIcons = {
    "Miền Bắc": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mountain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mountain$3e$__["Mountain"],
    "Miền Trung": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__["Landmark"],
    "Miền Nam": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__["Palmtree"],
    "Đông Nam Á": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$waves$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Waves$3e$__["Waves"],
    "Đông Bắc Á": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
    "Khác": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__["TreePine"]
};
const formatVND = (n)=>n.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    });

})()),
"[project]/data/visa.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

// Dữ liệu visa dùng chung — trang /lam-visa và phần "Hướng dẫn visa" trong chi tiết
// tour nước ngoài cùng đọc từ đây để nhất quán, chỉ cần sửa 1 nơi.
__turbopack_esm__({
    "getVisaInfo": ()=>getVisaInfo,
    "visaCountries": ()=>visaCountries
});
const visaCountries = [
    {
        name: "Hàn Quốc",
        flag: "🇰🇷",
        required: true,
        time: "5-7 ngày",
        price: "1.890.000đ",
        rate: "98%"
    },
    {
        name: "Nhật Bản",
        flag: "🇯🇵",
        required: true,
        time: "5-7 ngày",
        price: "1.590.000đ",
        rate: "97%"
    },
    {
        name: "Đài Loan",
        flag: "🇹🇼",
        required: true,
        time: "4-6 ngày",
        price: "1.290.000đ",
        rate: "99%"
    },
    {
        name: "Trung Quốc",
        flag: "🇨🇳",
        required: true,
        time: "5-8 ngày",
        price: "1.690.000đ",
        rate: "96%"
    },
    {
        name: "Mỹ",
        flag: "🇺🇸",
        required: true,
        time: "3-6 tuần",
        price: "2.990.000đ",
        rate: "82%"
    },
    {
        name: "Châu Âu (Schengen)",
        flag: "🇪🇺",
        required: true,
        time: "10-15 ngày",
        price: "2.490.000đ",
        rate: "93%"
    },
    {
        name: "Úc",
        flag: "🇦🇺",
        required: true,
        time: "2-4 tuần",
        price: "2.290.000đ",
        rate: "90%"
    },
    {
        name: "Canada",
        flag: "🇨🇦",
        required: true,
        time: "3-5 tuần",
        price: "2.590.000đ",
        rate: "88%"
    },
    // Công dân Việt Nam được miễn visa ngắn hạn — vẫn liệt kê để trang chi tiết tour
    // có thể hiển thị đúng thông tin thay vì bỏ sót.
    {
        name: "Thái Lan",
        flag: "🇹🇭",
        required: false,
        note: "Miễn visa tối đa 30 ngày cho công dân Việt Nam"
    },
    {
        name: "Singapore",
        flag: "🇸🇬",
        required: false,
        note: "Miễn visa tối đa 30 ngày cho công dân Việt Nam"
    }
];
function getVisaInfo(countryName) {
    return visaCountries.find((c)=>c.name === countryName) || null;
}

})()),
"[project]/data/filters.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

// Danh mục lọc dùng chung — trang danh sách tour (TourListPage) và thanh tìm kiếm
// trong trang chi tiết tour (TourDetail) cùng đọc từ đây để luôn đồng bộ.
__turbopack_esm__({
    "abroadRegions": ()=>abroadRegions,
    "domesticRegions": ()=>domesticRegions,
    "matchByCountry": ()=>matchByCountry
});
const domesticRegions = [
    "Tất cả",
    "Miền Bắc",
    "Miền Trung",
    "Miền Nam"
];
const abroadRegions = [
    "Tất cả",
    "Thái Lan",
    "Singapore",
    "Nhật Bản",
    "Hàn Quốc",
    "Tour lạ",
    "Mỹ",
    "Úc"
];
// Các quốc gia phổ biến đã có nhãn riêng; "Tour lạ" gom các điểm đến còn lại
// (Trung Quốc, Đài Loan...) — những tuyến ít người đi hơn nhưng độc đáo.
const mainCountries = [
    "Thái Lan",
    "Singapore",
    "Nhật Bản",
    "Hàn Quốc"
];
const matchByCountry = (tour, selected)=>{
    if (selected === "Tour lạ") return !mainCountries.includes(tour.country);
    return tour.country === selected;
};

})()),
"[project]/components/TourCard.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>TourCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/users-round.js [app-client] (ecmascript) <export default as Users2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-client] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/data/tours.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
;
;
;
// Nhãn khuyến mãi: mỗi loại một màu riêng, tất cả đều đạt tương phản với chữ trắng
const tagStyles = {
    "Bán chạy": "bg-teal-600",
    "Mới": "bg-ocean-600",
    "Giảm giá": "bg-sunset-600",
    "Cao cấp": "bg-deep-800"
};
function TourCard({ tour, basePath, index = 0 }) {
    const discount = tour.oldPrice ? Math.round((1 - tour.price / tour.oldPrice) * 100) : null;
    // Còn ít chỗ thì mới cảnh báo — dùng màu ấm để tạo cảm giác cấp thiết đúng lúc,
    // tránh bôi đỏ mọi thẻ khiến tín hiệu mất giá trị
    const sapHetCho = typeof tour.seatsLeft === "number" && tour.seatsLeft > 0 && tour.seatsLeft <= 5;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 24
        },
        whileInView: {
            opacity: 1,
            y: 0
        },
        viewport: {
            once: true,
            amount: 0.2
        },
        transition: {
            duration: 0.55,
            delay: index % 6 * 0.06,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        whileHover: {
            y: -8
        },
        className: "card-surface group flex flex-col overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: `${basePath}/${tour.slug}`,
            className: "flex flex-1 flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative h-52 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: tour.image,
                            alt: tour.name,
                            fill: true,
                            sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
                            className: "object-cover transition-transform duration-700 ease-enter group-hover:scale-110"
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-gradient-to-t from-deep-950/55 via-deep-950/5 to-transparent transition-opacity duration-500 group-hover:from-deep-950/70"
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        tour.tag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `absolute left-3 top-3 rounded-full ${tagStyles[tour.tag] || "bg-ocean-600"} px-3 py-1 text-xs font-semibold text-white shadow-sm`,
                            children: tour.tag
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 49,
                            columnNumber: 13
                        }, this),
                        discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-sunset-700 shadow-sm",
                            children: [
                                "−",
                                discount,
                                "%"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-x-3 bottom-3 flex items-center gap-1 text-xs font-medium text-white drop-shadow",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                    className: "h-3.5 w-3.5 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate",
                                    children: [
                                        tour.region,
                                        tour.country ? ` · ${tour.country}` : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 translate-x-2 place-items-center rounded-full bg-white/95 opacity-0 shadow backdrop-blur transition-all duration-300 ease-enter group-hover:translate-x-0 group-hover:opacity-100",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                className: "h-4 w-4 text-ocean-700"
                            }, void 0, false, {
                                fileName: "[project]/components/TourCard.jsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/TourCard.jsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 flex-col p-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "line-clamp-2 font-display text-lg font-semibold leading-snug text-deep-900 transition-colors group-hover:text-ocean-700",
                            children: tour.name
                        }, void 0, false, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-subtle",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                            className: "h-3.5 w-3.5 text-ocean-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        tour.days
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1 font-medium text-ink-muted",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "h-3.5 w-3.5 fill-gold-500 text-gold-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this),
                                        tour.rating > 0 ? tour.rating : "Mới",
                                        tour.reviews > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-ink-subtle",
                                            children: [
                                                "(",
                                                tour.reviews,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 85,
                                            columnNumber: 36
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        (sapHetCho || tour.startDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `mt-3 flex items-center gap-1.5 text-xs font-medium ${sapHetCho ? "text-sunset-700" : "text-ink-subtle"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"], {
                                    className: "h-3.5 w-3.5 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate",
                                    children: [
                                        sapHetCho ? `Chỉ còn ${tour.seatsLeft} chỗ` : tour.seatsLeft ? `Còn ${tour.seatsLeft} chỗ` : "Nhận đặt chỗ",
                                        tour.startDate ? ` · Khởi hành ${tour.startDate}` : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 93,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-auto flex items-end justify-between gap-3 border-t border-ocean-50 pt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        tour.oldPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-ink-subtle line-through",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.oldPrice)
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 103,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-display text-xl font-bold text-ocean-700",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.price)
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this),
                                        tour.departure && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "truncate text-xs text-ink-subtle",
                                            children: tour.departure
                                        }, void 0, false, {
                                            fileName: "[project]/components/TourCard.jsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 rounded-full border border-ocean-200 px-4 py-2 text-xs font-semibold text-ocean-700 transition-colors duration-300 group-hover:border-sunset-600 group-hover:bg-sunset-600 group-hover:text-white",
                                    children: "Xem chi tiết"
                                }, void 0, false, {
                                    fileName: "[project]/components/TourCard.jsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TourCard.jsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/TourCard.jsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/TourCard.jsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/TourCard.jsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c = TourCard;
var _c;
__turbopack_refresh__.register(_c, "TourCard");

})()),
"[project]/components/SectionReveal.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>SectionReveal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
function SectionReveal({ children, className = "", delay = 0, y = 28, once = true, as = "div" }) {
    const Comp = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"][as] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        initial: {
            opacity: 0,
            y
        },
        whileInView: {
            opacity: 1,
            y: 0
        },
        viewport: {
            once,
            amount: 0.25
        },
        transition: {
            duration: 0.7,
            delay,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/SectionReveal.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = SectionReveal;
var _c;
__turbopack_refresh__.register(_c, "SectionReveal");

})()),
"[project]/components/pages/TourDetail.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>TourDetail
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/users-round.js [app-client] (ecmascript) <export default as Users2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plane$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/plane.js [app-client] (ecmascript) <export default as Plane>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$baby$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Baby$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/baby.js [app-client] (ecmascript) <export default as Baby>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-client] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$images$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Images$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/images.js [app-client] (ecmascript) <export default as Images>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/file-check-2.js [app-client] (ecmascript) <export default as FileCheck2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgeCheck$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/badge-check.js [app-client] (ecmascript) <export default as BadgeCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/lib/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/data/tours.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$visa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/data/visa.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$filters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/data/filters.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FlagIcons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/FlagIcons.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TourCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/TourCard.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/SectionReveal.jsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
const flagBySlug = {
    "Thái Lan": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FlagIcons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlagThailand"],
    "Hàn Quốc": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FlagIcons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlagKorea"],
    "Nhật Bản": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FlagIcons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlagJapan"],
    "Singapore": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FlagIcons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlagSingapore"],
    "Trung Quốc": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FlagIcons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlagChina"],
    "Đài Loan": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FlagIcons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlagTaiwan"]
};
const tourFaqs = (tour, isAbroad)=>[
        {
            q: "Tôi có thể huỷ hoặc đổi lịch khởi hành không?",
            a: "Có. Bạn có thể đổi ngày khởi hành miễn phí nếu báo trước 7 ngày. Huỷ tour trước 5 ngày được hoàn 80% giá trị, chi tiết theo chính sách huỷ tour từng thời điểm."
        },
        {
            q: "Hình thức thanh toán như thế nào?",
            a: "Bạn có thể đặt cọc 30% để giữ chỗ và thanh toán phần còn lại trước ngày khởi hành 3 ngày, qua chuyển khoản, ví điện tử hoặc tại văn phòng."
        },
        {
            q: "Trẻ em đi cùng có được giảm giá không?",
            a: "Trẻ em dưới 12 tuổi được tính 60% giá tour người lớn (đã áp dụng sẵn khi bạn chọn số lượng trẻ em ở phần đặt tour bên trên)."
        },
        ...isAbroad ? [
            {
                q: "Tôi cần chuẩn bị visa như thế nào cho tour này?",
                a: `Với tour ${tour.country}, xem chi tiết yêu cầu visa ở phần "Hướng dẫn visa" phía trên. Đội ngũ PSVTravel hỗ trợ trọn gói thủ tục nếu bạn cần.`
            }
        ] : [],
        {
            q: "Giá tour đã bao gồm vé máy bay chưa?",
            a: "Đã bao gồm vé máy bay khứ hồi và các khoản thuế phí sân bay theo đúng như mục Chính sách giá tour ở trên."
        }
    ];
function ItineraryItem({ day, index, isOpen, onToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-2xl border border-ocean-100 bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggle,
                className: "flex w-full items-center gap-4 p-5 text-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-500 font-display text-sm font-bold text-white",
                        children: index + 1
                    }, void 0, false, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold uppercase tracking-wide text-ocean-600",
                                children: day.day
                            }, void 0, false, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-display text-base font-semibold text-deep-900",
                                children: day.title
                            }, void 0, false, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                        animate: {
                            rotate: isOpen ? 180 : 0
                        },
                        transition: {
                            duration: 0.3
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "h-5 w-5 text-ink-subtle"
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                initial: false,
                children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        height: 0,
                        opacity: 0
                    },
                    animate: {
                        height: "auto",
                        opacity: 1
                    },
                    exit: {
                        height: 0,
                        opacity: 0
                    },
                    transition: {
                        duration: 0.3,
                        ease: "easeInOut"
                    },
                    className: "overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4 px-5 pb-5 sm:pl-[4.25rem]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm leading-relaxed text-ink-muted",
                                children: day.desc
                            }, void 0, false, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 80,
                                columnNumber: 15
                            }, this),
                            day.images && day.images.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-2.5",
                                children: day.images.slice(0, 3).map((img, k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: img,
                                        alt: `${day.title} - ảnh ${k + 1}`,
                                        loading: "lazy",
                                        className: "h-24 w-full rounded-xl object-cover sm:h-32"
                                    }, k, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 84,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 82,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 79,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 70,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/pages/TourDetail.jsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c = ItineraryItem;
function ReviewCard({ r, index }) {
    const initial = (r.name || "?").trim().charAt(0).toUpperCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 20
        },
        whileInView: {
            opacity: 1,
            y: 0
        },
        viewport: {
            once: true,
            amount: 0.2
        },
        transition: {
            duration: 0.5,
            delay: index % 6 * 0.06
        },
        className: "card-surface flex flex-col overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-1 flex-col p-5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-100 font-display text-sm font-bold text-ocean-700",
                            children: initial
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-deep-900",
                                    children: r.name
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-ink-subtle",
                                    children: r.date
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-0.5",
                            children: Array.from({
                                length: r.rating || 0
                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                    className: "h-3.5 w-3.5 fill-gold-500 text-gold-500"
                                }, i, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 123,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                    className: "mt-3 h-4 w-4 text-sunset-300"
                }, void 0, false, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1.5 flex-1 text-sm leading-relaxed text-ink",
                    children: r.comment
                }, void 0, false, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, this),
                r.reply && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 rounded-xl bg-ocean-50/70 p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold text-ocean-700",
                            children: "Phản hồi từ PSV Travel"
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 131,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-sm text-ink-muted",
                            children: r.reply
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 132,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 130,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/pages/TourDetail.jsx",
            lineNumber: 112,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/pages/TourDetail.jsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_c1 = ReviewCard;
function FaqItem({ item, isOpen, onToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-ocean-100 bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggle,
                className: "flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-start gap-2.5 font-display text-sm font-semibold text-deep-900 sm:text-base",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                className: "mt-0.5 h-4 w-4 shrink-0 text-ocean-500"
                            }, void 0, false, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            item.q
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                        animate: {
                            rotate: isOpen ? 180 : 0
                        },
                        transition: {
                            duration: 0.3
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "h-5 w-5 shrink-0 text-ocean-500"
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: false,
                animate: {
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                },
                transition: {
                    duration: 0.3
                },
                className: "overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-4 pb-4 pl-11 text-sm leading-relaxed text-ink-muted sm:px-5 sm:pb-5",
                    children: item.a
                }, void 0, false, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/pages/TourDetail.jsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
_c2 = FaqItem;
function TourDetail({ basePath, tour, related = [] }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [openDay, setOpenDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [adults, setAdults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(2);
    const [children, setChildren] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        contact: ""
    });
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bookingCode, setBookingCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [depId, setDepId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(tour?.departures?.[0]?.id ?? null);
    const [lightboxImg, setLightboxImg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openFaq, setOpenFaq] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showMobileBar, setShowMobileBar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [detailSearchOpen, setDetailSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [detailQuery, setDetailQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [askForm, setAskForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        phone: ""
    });
    const [askSubmitted, setAskSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleDetailSearch = (e)=>{
        e.preventDefault();
        if (!detailQuery.trim()) return;
        // Về đúng trang tương ứng: tour đang xem là trong nước thì về Tour trong nước,
        // là nước ngoài thì về Tour nước ngoài — dựa theo basePath của chính trang đang xem.
        router.push(`${basePath}?q=${encodeURIComponent(detailQuery.trim())}&scroll=1`);
    };
    // Danh mục lọc đổi theo loại tour đang xem — trong nước hiện vùng miền, nước ngoài hiện quốc gia
    const detailRegions = basePath === "/tour-trong-nuoc" ? __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$filters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["domesticRegions"] : __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$filters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abroadRegions"];
    const handleDetailRegion = (r)=>{
        router.push(`${basePath}?region=${encodeURIComponent(r)}&scroll=1`);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onScroll = ()=>setShowMobileBar(window.scrollY > 520);
        window.addEventListener("scroll", onScroll);
        return ()=>window.removeEventListener("scroll", onScroll);
    }, []);
    const galleryImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!tour) return [];
        const fromApi = (tour.images || []).filter(Boolean);
        return [
            ...new Set([
                tour.image,
                ...fromApi
            ].filter(Boolean))
        ].slice(0, 6);
    }, [
        tour
    ]);
    const dayImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!tour || galleryImages.length === 0) return [];
        const count = Math.min(3, galleryImages.length);
        return tour.itinerary.map((_, i)=>Array.from({
                length: count
            }, (_, k)=>galleryImages[(i + 1 + k) % galleryImages.length]));
    }, [
        tour,
        galleryImages
    ]);
    const reviews = tour?.reviewsList ?? [];
    const visaInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>tour?.country ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$visa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVisaInfo"])(tour.country) : null, [
        tour
    ]);
    const VisaFlag = tour?.country ? flagBySlug[tour.country] : null;
    const faqs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>tour ? tourFaqs(tour, !!tour.country) : [], [
        tour
    ]);
    if (!tour) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notFound"])();
    const childPrice = tour.childPrice ?? Math.round(tour.price * 0.6 / 1000) * 1000;
    const total = adults * tour.price + children * childPrice;
    const scrollToBooking = ()=>{
        document.getElementById("booking-card")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };
    const handleSubmit = async ()=>{
        if (!form.name.trim() || !form.contact.trim()) {
            setFormError("Vui lòng nhập họ tên và số điện thoại.");
            return;
        }
        setFormError("");
        setSubmitting(true);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBooking"])({
                tour_id: tour.id,
                tour_departure_id: depId,
                customer_name: form.name.trim(),
                customer_phone: form.contact.trim(),
                adults,
                children
            });
            setBookingCode(res?.data?.booking_code || "");
            setSubmitted(true);
        } catch (e) {
            setFormError(e.message);
        } finally{
            setSubmitting(false);
        }
    };
    const handleAskSubmit = (e)=>{
        e.preventDefault();
        if (!askForm.name.trim() || !askForm.phone.trim()) return;
        setAskSubmitted(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative h-[62dvh] min-h-[460px] overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: tour.image,
                        alt: tour.name,
                        fill: true,
                        priority: true,
                        sizes: "100vw",
                        className: "object-cover"
                    }, void 0, false, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep-950/80 via-deep-950/30 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-deep-950/85 via-deep-950/20 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 flex items-center gap-1.5 text-xs text-white/75",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: "transition-colors hover:text-gold-300",
                                        children: "Trang chủ"
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 272,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: basePath,
                                        className: "transition-colors hover:text-gold-300",
                                        children: basePath === "/tour-trong-nuoc" ? "Tour trong nước" : "Tour nước ngoài"
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 277,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white/90",
                                        children: tour.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-sm font-medium text-ocean-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    tour.region,
                                    " ",
                                    tour.country ? `· ${tour.country}` : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "mt-2 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl",
                                children: tour.name
                            }, void 0, false, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex flex-wrap items-center gap-4 text-sm text-white/85",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                className: "h-4 w-4 fill-gold-500 text-gold-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                lineNumber: 285,
                                                columnNumber: 55
                                            }, this),
                                            " ",
                                            tour.rating > 0 ? tour.rating : "Mới",
                                            " ",
                                            tour.reviews > 0 ? `(${tour.reviews} đánh giá)` : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 285,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                lineNumber: 286,
                                                columnNumber: 55
                                            }, this),
                                            " ",
                                            tour.days
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 286,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plane$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plane$3e$__["Plane"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                lineNumber: 287,
                                                columnNumber: 55
                                            }, this),
                                            " ",
                                            tour.departure
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 287,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 284,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 266,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: lightboxImg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: ()=>setLightboxImg(null),
                    className: "fixed inset-0 z-[60] flex items-center justify-center bg-deep-950/90 p-6 backdrop-blur-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setLightboxImg(null),
                            className: "absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20",
                            "aria-label": "Đóng",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 302,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 301,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].img, {
                            initial: {
                                scale: 0.95
                            },
                            animate: {
                                scale: 1
                            },
                            src: lightboxImg,
                            alt: tour.name,
                            onClick: (e)=>e.stopPropagation(),
                            className: "max-h-[85dvh] max-w-full rounded-2xl object-contain"
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 304,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 294,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 292,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-foam py-10 sm:py-14",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_380px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "sticky top-20 z-20 mb-6 rounded-2xl border border-ocean-100 bg-white/90 p-3 shadow-sm backdrop-blur-lg sm:p-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                                mode: "wait",
                                                initial: false,
                                                children: detailSearchOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].form, {
                                                    onSubmit: handleDetailSearch,
                                                    initial: {
                                                        width: 40,
                                                        opacity: 0
                                                    },
                                                    animate: {
                                                        width: 240,
                                                        opacity: 1
                                                    },
                                                    exit: {
                                                        width: 40,
                                                        opacity: 0
                                                    },
                                                    transition: {
                                                        duration: 0.25,
                                                        ease: "easeOut"
                                                    },
                                                    className: "relative shrink-0 overflow-hidden",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 327,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            autoFocus: true,
                                                            value: detailQuery,
                                                            onChange: (e)=>setDetailQuery(e.target.value),
                                                            placeholder: "Tìm tour hoặc điểm đến khác...",
                                                            className: "w-full rounded-full border border-ocean-100 bg-ocean-50/40 py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 328,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setDetailSearchOpen(false);
                                                                setDetailQuery("");
                                                            },
                                                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-deep-800",
                                                            "aria-label": "Đóng tìm kiếm",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 341,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 335,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, "input", true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 318,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                                    initial: {
                                                        opacity: 0
                                                    },
                                                    animate: {
                                                        opacity: 1
                                                    },
                                                    exit: {
                                                        opacity: 0
                                                    },
                                                    onClick: ()=>setDetailSearchOpen(true),
                                                    className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-50 text-ocean-600 transition-colors hover:bg-ocean-100",
                                                    "aria-label": "Tìm tour khác",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 354,
                                                        columnNumber: 23
                                                    }, this)
                                                }, "icon", false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 345,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                lineNumber: 316,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-1 flex-wrap items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                        className: "h-4 w-4 shrink-0 text-ocean-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 360,
                                                        columnNumber: 19
                                                    }, this),
                                                    detailRegions.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDetailRegion(r),
                                                            className: "flex-1 whitespace-nowrap rounded-full bg-ocean-50 px-3.5 py-1.5 text-center text-xs font-semibold text-ocean-700 transition-colors hover:bg-ocean-100",
                                                            children: r
                                                        }, r, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 362,
                                                            columnNumber: 21
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                lineNumber: 359,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 315,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 314,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "card-surface p-6 sm:p-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-display text-xl font-bold text-deep-900",
                                            children: "Điểm nổi bật của hành trình"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 375,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2",
                                            children: tour.highlights.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start gap-2.5 rounded-xl bg-ocean-50/60 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            className: "mt-0.5 h-4 w-4 shrink-0 text-ocean-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 379,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-ink",
                                                            children: h
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 380,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, h, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 378,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 376,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 374,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    delay: 0.1,
                                    className: "mt-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-display text-xl font-bold text-deep-900",
                                            children: "Lịch trình chi tiết"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 387,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-ink-subtle",
                                            children: "Kèm hình ảnh thực tế các điểm đến, món ăn theo từng ngày."
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 388,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-5 space-y-3",
                                            children: tour.itinerary.map((day, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ItineraryItem, {
                                                    day: {
                                                        ...day,
                                                        images: dayImages[i]
                                                    },
                                                    index: i,
                                                    isOpen: openDay === i,
                                                    onToggle: ()=>setOpenDay(openDay === i ? -1 : i)
                                                }, day.day, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 391,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 389,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 386,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    delay: 0.15,
                                    className: "mt-8 card-surface p-6 sm:p-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-display text-xl font-bold text-deep-900",
                                            children: "Chính sách giá tour"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 397,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-semibold text-teal-700",
                                                            children: "Giá tour bao gồm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 400,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "mt-2 space-y-1.5 text-sm text-ink-muted",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                            className: "h-4 w-4 shrink-0 text-teal-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                                            lineNumber: 402,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " Vé máy bay khứ hồi, thuế phí"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 402,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                            className: "h-4 w-4 shrink-0 text-teal-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                                            lineNumber: 403,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " Khách sạn theo tiêu chuẩn tour"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 403,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                            className: "h-4 w-4 shrink-0 text-teal-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                                            lineNumber: 404,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " Xe đưa đón, hướng dẫn viên"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 404,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                            className: "h-4 w-4 shrink-0 text-teal-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                                            lineNumber: 405,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " Bảo hiểm du lịch trọn tour"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 405,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 401,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 399,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-semibold text-sunset-700",
                                                            children: "Giá tour không bao gồm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 409,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "mt-2 space-y-1.5 text-sm text-ink-muted",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "mt-0.5 h-4 w-4 shrink-0 text-center text-sunset-500",
                                                                            children: "–"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                                            lineNumber: 411,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " Chi phí cá nhân ngoài chương trình"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 411,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "mt-0.5 h-4 w-4 shrink-0 text-center text-sunset-500",
                                                                            children: "–"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                                            lineNumber: 412,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " Phụ thu phòng đơn (nếu có)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 412,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "mt-0.5 h-4 w-4 shrink-0 text-center text-sunset-500",
                                                                            children: "–"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                                            lineNumber: 413,
                                                                            columnNumber: 48
                                                                        }, this),
                                                                        " Tiền tip cho HDV, tài xế"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 413,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 410,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 408,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 398,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 396,
                                    columnNumber: 13
                                }, this),
                                visaInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    delay: 0.2,
                                    className: "mt-8 card-surface overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 bg-gradient-to-r from-ocean-600 to-teal-600 px-6 py-4 text-white",
                                            children: [
                                                VisaFlag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VisaFlag, {
                                                    className: "h-7 w-10 rounded shadow-sm ring-1 ring-white/30"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 423,
                                                    columnNumber: 32
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-display text-base font-bold",
                                                            children: [
                                                                "Hướng dẫn visa ",
                                                                tour.country
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 425,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-white/85",
                                                            children: "Thông tin cần biết trước khi khởi hành"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 426,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 424,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 422,
                                            columnNumber: 17
                                        }, this),
                                        visaInfo.required ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-4 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center gap-1.5 text-ink-muted",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                    className: "h-4 w-4 text-ocean-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 433,
                                                                    columnNumber: 82
                                                                }, this),
                                                                " Thời gian xử lý: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    className: "text-deep-900",
                                                                    children: visaInfo.time
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 433,
                                                                    columnNumber: 144
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 433,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center gap-1.5 text-ink-muted",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgeCheck$3e$__["BadgeCheck"], {
                                                                    className: "h-4 w-4 text-teal-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 434,
                                                                    columnNumber: 82
                                                                }, this),
                                                                " Tỷ lệ đậu: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    className: "text-deep-900",
                                                                    children: visaInfo.rate
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 434,
                                                                    columnNumber: 142
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 434,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center gap-1.5 text-ink-muted",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck2$3e$__["FileCheck2"], {
                                                                    className: "h-4 w-4 text-ocean-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 435,
                                                                    columnNumber: 82
                                                                }, this),
                                                                " Phí dịch vụ từ: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    className: "text-deep-900",
                                                                    children: visaInfo.price
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 435,
                                                                    columnNumber: 148
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 435,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 432,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/lam-visa",
                                                    className: "flex shrink-0 items-center justify-center gap-2 rounded-full bg-ocean-50 px-5 py-2.5 text-sm font-semibold text-ocean-700 transition-colors hover:bg-ocean-100",
                                                    children: [
                                                        "Xem dịch vụ làm visa ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 438,
                                                            columnNumber: 44
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 437,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 431,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-2 text-sm font-medium text-teal-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgeCheck$3e$__["BadgeCheck"], {
                                                            className: "h-5 w-5 text-teal-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 444,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        visaInfo.note
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 443,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-ink-subtle",
                                                    children: "Vui lòng kiểm tra hộ chiếu còn hạn tối thiểu 6 tháng."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 446,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 442,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 421,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 312,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:sticky lg:top-24 lg:self-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    id: "booking-card",
                                    initial: {
                                        opacity: 0,
                                        x: 20
                                    },
                                    whileInView: {
                                        opacity: 1,
                                        x: 0
                                    },
                                    viewport: {
                                        once: true
                                    },
                                    transition: {
                                        duration: 0.6
                                    },
                                    className: "card-surface scroll-mt-24 overflow-hidden ring-1 ring-ocean-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden bg-deep-gradient p-5 text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 bg-aurora-deep bg-[length:200%_200%] animate-aurora opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 467,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        tour.seatsLeft ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center gap-1.5 rounded-full bg-sunset-600 px-2.5 py-1 text-xs font-bold text-white",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"], {
                                                                    className: "h-3.5 w-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 472,
                                                                    columnNumber: 23
                                                                }, this),
                                                                " Chỉ còn ",
                                                                tour.seatsLeft,
                                                                " chỗ"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 471,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"], {
                                                                    className: "h-3.5 w-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 476,
                                                                    columnNumber: 23
                                                                }, this),
                                                                " Đang nhận đặt chỗ"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 475,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1",
                                                            children: [
                                                                tour.oldPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm text-white/60 line-through",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.oldPrice)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 482,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-display text-[2rem] font-bold leading-none",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.price)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 484,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 480,
                                                            columnNumber: 19
                                                        }, this),
                                                        tour.oldPrice && tour.oldPrice > tour.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-2 inline-block rounded-lg bg-gold-500/20 px-2 py-1 text-xs font-bold text-gold-300",
                                                            children: [
                                                                "Tiết kiệm ",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.oldPrice - tour.price)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 490,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-2 text-xs text-white/80",
                                                            children: [
                                                                "/ khách người lớn",
                                                                tour.startDate ? ` · khởi hành ${tour.startDate}` : ""
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 495,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 469,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 466,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                            mode: "wait",
                                            children: submitted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    opacity: 0
                                                },
                                                animate: {
                                                    opacity: 1
                                                },
                                                className: "flex flex-col items-center px-6 py-10 text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid h-16 w-16 place-items-center rounded-full bg-teal-50",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            className: "h-9 w-9 text-teal-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 505,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 504,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-4 font-display text-lg font-bold text-deep-900",
                                                        children: "Đã gửi yêu cầu giữ chỗ!"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 507,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1.5 text-sm text-ink-muted",
                                                        children: [
                                                            "Tư vấn viên sẽ liên hệ ",
                                                            form.name,
                                                            " qua ",
                                                            form.contact,
                                                            " trong 15 phút để xác nhận."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 508,
                                                        columnNumber: 21
                                                    }, this),
                                                    bookingCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-3 rounded-xl border border-dashed border-ocean-300 bg-ocean-50 px-4 py-2.5 font-display text-base font-bold tracking-wide text-ocean-700",
                                                        children: bookingCode
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 510,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setSubmitted(false),
                                                        className: "mt-5 text-sm font-semibold text-ocean-700 hover:text-ocean-800",
                                                        children: "Đặt thêm yêu cầu khác"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 514,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, "success", true, {
                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                lineNumber: 503,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    opacity: 0
                                                },
                                                animate: {
                                                    opacity: 1
                                                },
                                                className: "space-y-4 p-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs font-semibold text-ink-muted",
                                                                children: "Họ và tên"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 519,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative mt-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                        className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 521,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: form.name,
                                                                        onChange: (e)=>setForm((f)=>({
                                                                                    ...f,
                                                                                    name: e.target.value
                                                                                })),
                                                                        placeholder: "Nguyễn Văn A",
                                                                        className: "w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 522,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 520,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 518,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs font-semibold text-ink-muted",
                                                                children: "Số điện thoại"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 526,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative mt-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                        className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 528,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: form.contact,
                                                                        onChange: (e)=>setForm((f)=>({
                                                                                    ...f,
                                                                                    contact: e.target.value
                                                                                })),
                                                                        placeholder: "09xx xxx xxx",
                                                                        className: "w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 529,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 527,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 525,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs font-semibold text-ink-muted",
                                                                children: "Ngày khởi hành"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 533,
                                                                columnNumber: 23
                                                            }, this),
                                                            tour.departures && tour.departures.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative mt-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                                                        className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 536,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: depId ?? "",
                                                                        onChange: (e)=>setDepId(Number(e.target.value)),
                                                                        className: "w-full appearance-none rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white",
                                                                        children: tour.departures.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: d.id,
                                                                                children: [
                                                                                    d.startDate,
                                                                                    " · còn ",
                                                                                    d.seatsLeft,
                                                                                    " chỗ"
                                                                                ]
                                                                            }, d.id, true, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 543,
                                                                                columnNumber: 31
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 537,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                        className: "pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 546,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 535,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-1.5 flex items-center gap-2 rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2.5 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                                                                        className: "h-4 w-4 text-ocean-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 550,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " ",
                                                                    tour.startDate || "Liên hệ để biết lịch"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 549,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 532,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs font-semibold text-ink-muted",
                                                                children: "Người lớn"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 556,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-1.5 flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-2 text-sm text-ink",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"], {
                                                                                className: "h-4 w-4 text-ocean-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 558,
                                                                                columnNumber: 84
                                                                            }, this),
                                                                            " ",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.price)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 558,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setAdults((g)=>Math.max(1, g - 1)),
                                                                                "aria-label": "Bớt một người lớn",
                                                                                className: "tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100",
                                                                                children: "−"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 560,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-4 text-center text-sm font-bold text-deep-900",
                                                                                children: adults
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 561,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setAdults((g)=>Math.min(tour.seatsLeft || 99, g + 1)),
                                                                                "aria-label": "Thêm một người lớn",
                                                                                className: "tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100",
                                                                                children: "+"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 562,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 559,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 557,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 555,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs font-semibold text-ink-muted",
                                                                children: "Trẻ em (dưới 12 tuổi)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 568,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-1.5 flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-2 text-sm text-ink",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$baby$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Baby$3e$__["Baby"], {
                                                                                className: "h-4 w-4 text-teal-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 570,
                                                                                columnNumber: 84
                                                                            }, this),
                                                                            " ",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(childPrice)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 570,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setChildren((g)=>Math.max(0, g - 1)),
                                                                                "aria-label": "Bớt một trẻ em",
                                                                                className: "tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100",
                                                                                children: "−"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 572,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-4 text-center text-sm font-bold text-deep-900",
                                                                                children: children
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 573,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setChildren((g)=>g + 1),
                                                                                "aria-label": "Thêm một trẻ em",
                                                                                className: "tap-44 grid h-7 w-7 place-items-center rounded-full bg-white text-ocean-700 shadow transition-colors hover:bg-ocean-100",
                                                                                children: "+"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                                lineNumber: 574,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 571,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 569,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 567,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5 rounded-xl bg-ocean-50/60 p-3.5 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between text-ink-muted",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            adults,
                                                                            " người lớn × ",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.price)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 583,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium text-ink",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(adults * tour.price)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 584,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 582,
                                                                columnNumber: 23
                                                            }, this),
                                                            children > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between text-ink-muted",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            children,
                                                                            " trẻ em × ",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(childPrice)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 588,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium text-ink",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(children * childPrice)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 589,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 587,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between border-t border-ocean-200/70 pt-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-deep-900",
                                                                        children: "Tạm tính"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 593,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-display text-xl font-bold text-sunset-700",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(total)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 594,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 592,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 581,
                                                        columnNumber: 21
                                                    }, this),
                                                    formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700",
                                                        children: formError
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 599,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: handleSubmit,
                                                        disabled: submitting,
                                                        className: "btn-cta w-full !py-3.5 text-base disabled:opacity-60",
                                                        children: submitting ? "Đang gửi..." : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                "Đặt tour ngay ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                    className: "h-4 w-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                                    lineNumber: 603,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 602,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "tel:19001177",
                                                        className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-ocean-200 py-3 text-sm font-semibold text-ocean-700 transition-colors hover:border-ocean-400 hover:bg-ocean-50",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 607,
                                                                columnNumber: 23
                                                            }, this),
                                                            " Gọi tư vấn: 1900 1177"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 606,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-3 gap-2 border-t border-ocean-100 pt-4 text-center",
                                                        children: [
                                                            {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
                                                                text: "Không phụ thu ẩn"
                                                            },
                                                            {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
                                                                text: "Xác nhận 15 phút"
                                                            },
                                                            {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgeCheck$3e$__["BadgeCheck"],
                                                                text: "Hoàn tiền nếu huỷ"
                                                            }
                                                        ].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(c.icon, {
                                                                        className: "h-4 w-4 text-teal-600"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 618,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs leading-tight text-ink-subtle",
                                                                        children: c.text
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                                        lineNumber: 619,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, c.text, true, {
                                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                                lineNumber: 617,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                                        lineNumber: 611,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, "form", true, {
                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                lineNumber: 517,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 501,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 455,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-3 text-center text-xs text-ink-subtle",
                                    children: [
                                        "Gửi yêu cầu ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "font-semibold text-ink-muted",
                                            children: "chưa bị trừ tiền"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 630,
                                            columnNumber: 27
                                        }, this),
                                        ". Tư vấn viên sẽ gọi xác nhận trước."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 629,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 454,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 310,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 309,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-foam pb-12 sm:pb-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl px-5 sm:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "mb-4 flex items-center gap-2 text-sm font-semibold text-ink-muted",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$images$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Images$3e$__["Images"], {
                                    className: "h-4 w-4 text-ocean-500"
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 640,
                                    columnNumber: 13
                                }, this),
                                " Hình ảnh thực tế của hành trình"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 639,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            delay: 0.05,
                            className: "grid grid-cols-4 grid-rows-2 gap-2.5 sm:gap-3",
                            children: galleryImages.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setLightboxImg(img),
                                    "aria-label": `Xem ảnh ${i + 1} của ${tour.name}`,
                                    className: `group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: img,
                                            alt: `${tour.name} - ảnh ${i + 1}`,
                                            loading: "lazy",
                                            className: "h-full min-h-[100px] w-full object-cover transition-transform duration-500 ease-enter group-hover:scale-110"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 650,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-deep-950/0 transition-colors duration-300 group-hover:bg-deep-950/20"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 656,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 opacity-0 shadow backdrop-blur transition-opacity duration-300 group-hover:opacity-100",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$images$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Images$3e$__["Images"], {
                                                className: "h-4 w-4 text-ocean-700"
                                            }, void 0, false, {
                                                fileName: "[project]/components/pages/TourDetail.jsx",
                                                lineNumber: 659,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 658,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 644,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 642,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 638,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 637,
                columnNumber: 7
            }, this),
            related.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-ocean-50/50 py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl px-5 sm:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "mb-8 font-display text-2xl font-bold text-deep-900",
                            children: "Tour cùng khu vực bạn có thể thích"
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 670,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
                            children: related.map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TourCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    tour: t,
                                    basePath: basePath,
                                    index: i
                                }, t.slug, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 673,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 671,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 669,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 668,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-foam py-14 sm:py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1.3fr_1fr]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-bold uppercase tracking-[0.25em] text-teal-700",
                                    children: "Giải đáp"
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 684,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "mt-2 font-display text-2xl font-bold text-deep-900 sm:text-3xl",
                                    children: "Câu hỏi thường gặp"
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 685,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 space-y-3",
                                    children: faqs.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FaqItem, {
                                            item: f,
                                            isOpen: openFaq === i,
                                            onToggle: ()=>setOpenFaq(openFaq === i ? -1 : i)
                                        }, f.q, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 688,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 686,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 683,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            delay: 0.1,
                            className: "card-surface h-fit p-6 sm:p-7",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                mode: "wait",
                                children: askSubmitted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0
                                    },
                                    animate: {
                                        opacity: 1
                                    },
                                    className: "flex flex-col items-center py-8 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            className: "h-11 w-11 text-teal-600"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 697,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-3 font-display text-base font-bold text-deep-900",
                                            children: "Đã ghi nhận câu hỏi của bạn!"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 698,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1.5 text-sm text-ink-muted",
                                            children: [
                                                "Tư vấn viên sẽ gọi lại cho ",
                                                askForm.name,
                                                " sớm nhất."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 699,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setAskSubmitted(false);
                                                setAskForm({
                                                    name: "",
                                                    phone: ""
                                                });
                                            },
                                            className: "mt-5 text-sm font-semibold text-ocean-700 hover:text-ocean-800",
                                            children: "Gửi câu hỏi khác"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 700,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, "ask-success", true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 696,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].form, {
                                    initial: {
                                        opacity: 0
                                    },
                                    animate: {
                                        opacity: 1
                                    },
                                    onSubmit: handleAskSubmit,
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-display text-lg font-bold text-deep-900",
                                                    children: "Vẫn còn thắc mắc?"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 707,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-ink-muted",
                                                    children: "Để lại thông tin, tư vấn viên sẽ liên hệ giải đáp miễn phí."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 708,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 706,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-semibold text-ink-muted",
                                                    children: "Họ và tên"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 711,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative mt-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 713,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            required: true,
                                                            value: askForm.name,
                                                            onChange: (e)=>setAskForm((f)=>({
                                                                        ...f,
                                                                        name: e.target.value
                                                                    })),
                                                            placeholder: "Nguyễn Văn A",
                                                            className: "w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 714,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 712,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 710,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-semibold text-ink-muted",
                                                    children: "Số điện thoại"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 718,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative mt-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                            className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 720,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            required: true,
                                                            value: askForm.phone,
                                                            onChange: (e)=>setAskForm((f)=>({
                                                                        ...f,
                                                                        phone: e.target.value
                                                                    })),
                                                            placeholder: "09xx xxx xxx",
                                                            className: "w-full rounded-xl border border-ocean-100 bg-ocean-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                                            lineNumber: 721,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 719,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 717,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-semibold text-ink-muted",
                                                    children: "Câu hỏi của bạn (không bắt buộc)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 725,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    rows: 3,
                                                    placeholder: "Ví dụ: Tour có hỗ trợ ăn chay không?",
                                                    className: "mt-1.5 w-full resize-none rounded-xl border border-ocean-100 bg-ocean-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ocean-400 focus:bg-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 726,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 724,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "btn-cta w-full !py-3",
                                            children: [
                                                "Gửi câu hỏi ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                                    lineNumber: 728,
                                                    columnNumber: 86
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 728,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, "ask-form", true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 705,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 694,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 693,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 682,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 681,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-ocean-50/50 py-14 sm:py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl px-5 sm:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SectionReveal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold uppercase tracking-[0.25em] text-teal-700",
                                            children: "Trải nghiệm thực tế"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 741,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mt-2 font-display text-2xl font-bold text-deep-900 sm:text-3xl",
                                            children: "Đánh giá từ khách hàng"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 742,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 740,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "h-5 w-5 fill-gold-500 text-gold-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 745,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-display text-xl font-bold text-deep-900",
                                            children: tour.rating > 0 ? tour.rating : "—"
                                        }, void 0, false, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 746,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-ink-subtle",
                                            children: [
                                                "/5 · ",
                                                tour.reviews,
                                                " đánh giá"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/pages/TourDetail.jsx",
                                            lineNumber: 747,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 744,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 739,
                            columnNumber: 11
                        }, this),
                        reviews.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "rounded-2xl border border-dashed border-ocean-200 bg-white py-12 text-center text-sm text-ink-muted",
                            children: "Chưa có đánh giá cho tour này."
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 751,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
                            children: reviews.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewCard, {
                                    r: r,
                                    index: i
                                }, r.name + i, false, {
                                    fileName: "[project]/components/pages/TourDetail.jsx",
                                    lineNumber: 757,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/pages/TourDetail.jsx",
                            lineNumber: 755,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 738,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 737,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showMobileBar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        y: 100,
                        opacity: 0
                    },
                    animate: {
                        y: 0,
                        opacity: 1
                    },
                    exit: {
                        y: 100,
                        opacity: 0
                    },
                    transition: {
                        duration: 0.3,
                        ease: "easeOut"
                    },
                    className: "fixed inset-x-0 bottom-0 z-30 border-t border-ocean-100 bg-white/95 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-4 pr-16 shadow-[0_-8px_30px_rgba(7,30,51,0.12)] backdrop-blur-lg lg:hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    tour.oldPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-xs text-ink-subtle line-through",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.oldPrice)
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 777,
                                        columnNumber: 35
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate font-display text-lg font-bold text-ocean-700",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tours$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatVND"])(tour.price)
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 778,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 776,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: scrollToBooking,
                                className: "btn-cta shrink-0 !px-5 !py-3 text-sm",
                                children: [
                                    "Đặt tour ngay ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/pages/TourDetail.jsx",
                                        lineNumber: 784,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/pages/TourDetail.jsx",
                                lineNumber: 780,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/pages/TourDetail.jsx",
                        lineNumber: 775,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/pages/TourDetail.jsx",
                    lineNumber: 768,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/pages/TourDetail.jsx",
                lineNumber: 766,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/pages/TourDetail.jsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
}
_s(TourDetail, "F3fXkvnlaNJG5RWTTKUYKZYAO/4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c3 = TourDetail;
var _c, _c1, _c2, _c3;
__turbopack_refresh__.register(_c, "ItineraryItem");
__turbopack_refresh__.register(_c1, "ReviewCard");
__turbopack_refresh__.register(_c2, "FaqItem");
__turbopack_refresh__.register(_c3, "TourDetail");

})()),
"[project]/app/(site)/tour-trong-nuoc/[slug]/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_04850a._.js.map