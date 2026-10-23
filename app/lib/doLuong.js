import { fbTrack } from "./fbpixel";
import { gaEvent } from "./gtag";

// Khách bấm gọi hotline / nhắn Zalo / Messenger: báo cả Meta Pixel ("Contact")
// lẫn GA4. Mỗi cách liên hệ một tên sự kiện GA4 riêng để đọc thẳng trong báo cáo
// Sự kiện, không phải khai báo thêm "phương diện tuỳ chỉnh".
const SU_KIEN_GA4 = { hotline: "goi_hotline", zalo: "nhan_zalo", messenger: "nhan_messenger" };

export function bamLienHe(cach, tenTour) {
  fbTrack("Contact", tenTour ? { method: cach, content_name: tenTour } : { method: cach });
  gaEvent(SU_KIEN_GA4[cach] || "lien_he_khac", tenTour ? { tour: tenTour } : {});
}

// Khách để lại thông tin (đặt tour, form liên hệ, team building) — sự kiện GA4
// chuẩn "generate_lead", đánh dấu là Sự kiện chính trong GA4 để tính chuyển đổi.
// nguon: "dat_tour" | "lien_he" | "team_building"
export function ghiLead(nguon, { giaTri, tenTour } = {}) {
  gaEvent("generate_lead", {
    lead_source: nguon,
    ...(giaTri > 0 ? { value: giaTri, currency: "VND" } : {}),
    ...(tenTour ? { tour: tenTour } : {}),
  });
}

// Khách mở trang tour — sự kiện thương mại chuẩn "view_item" của GA4
export function ghiXemTour(tour) {
  const gia = Number(tour.price) || 0;
  gaEvent("view_item", {
    currency: "VND",
    ...(gia > 0 ? { value: gia } : {}),
    items: [
      {
        item_id: tour.slug,
        item_name: tour.name,
        item_category: tour.type === "abroad" ? "Tour nước ngoài" : "Tour trong nước",
        ...(gia > 0 ? { price: gia } : {}),
      },
    ],
  });
}
