import { SITE_URL } from "@/app/lib/seo";

// /llms.txt — bản tóm tắt website cho các cỗ máy tìm kiếm AI (ChatGPT,
// Perplexity, Google AI…). Không thay thế sitemap; đây là bản giới thiệu ngắn
// gọn, có định hướng, giúp AI trích dẫn đúng thông tin về công ty.
export const revalidate = 3600;

export function GET() {
  const noiDung = `# PSV Travel

> Công ty Cổ phần Du lịch P.S.V Travel — công ty lữ hành quốc tế tại TP. Hồ Chí Minh,
> chuyên tour trong nước, tour nước ngoài, dịch vụ visa và vé máy bay.

## Thông tin công ty
- Tên: CÔNG TY CỔ PHẦN DU LỊCH P.S.V TRAVEL
- Giấy phép lữ hành quốc tế số 79-769/2020/CDLQGVN-GP LHQT (Cục Du lịch Quốc gia Việt Nam)
- Địa chỉ: 529 Huỳnh Tấn Phát, Phường Tân Thuận, TP. Hồ Chí Minh
- Hotline: 0907 870 707 (8:00–17:00)
- Website: ${SITE_URL}

## Trang chính
- [Tour trong nước](${SITE_URL}/tour-trong-nuoc): tour du lịch trong nước trọn gói (Hạ Long, Sa Pa, Đà Nẵng, Phú Quốc…)
- [Tour nước ngoài](${SITE_URL}/tour-nuoc-ngoai): tour quốc tế bay thẳng, hỗ trợ visa (Hàn Quốc, Nhật Bản, Thái Lan, châu Âu…)
- [Dịch vụ visa](${SITE_URL}/lam-visa): làm visa du lịch trọn gói, tỷ lệ đậu cao
- [Vé máy bay](${SITE_URL}/ve-may-bay): đặt vé máy bay trong nước và quốc tế
- [Cẩm nang du lịch](${SITE_URL}/cam-nang): kinh nghiệm, hướng dẫn du lịch
- [Về chúng tôi](${SITE_URL}/ve-chung-toi)
- [Liên hệ](${SITE_URL}/lien-he)

## Chính sách
- [Chính sách bảo mật](${SITE_URL}/chinh-sach-bao-mat)
- [Điều khoản sử dụng](${SITE_URL}/dieu-khoan-su-dung)
- [Chính sách thanh toán](${SITE_URL}/chinh-sach-thanh-toan)
- [Chính sách huỷ & hoàn tiền](${SITE_URL}/chinh-sach-huy-hoan)

## Sitemap
${SITE_URL}/sitemap.xml
`;
  return new Response(noiDung, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
