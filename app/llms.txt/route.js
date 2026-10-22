import { getBangGia, getVisaCountries, getSettings, getSeasonPages, slugHopLe } from "@/app/lib/api";
import { llmsTxt } from "@/app/lib/vanBanChoAI";

// /llms.txt — bản giới thiệu website cho các cỗ máy tìm kiếm AI (ChatGPT,
// Perplexity, Claude…) theo chuẩn llmstxt.org. Không thay thế sitemap; đây là
// bản tóm tắt có định hướng: công ty là ai, đang bán gì, giá ở đâu.
//
// Số tour, nước/vùng và giá thấp nhất tự lấy từ API, dựng lại mỗi phút như các
// trang tour. API bảng giá lỗi thì ném lỗi (getBangGia bắt buộc): Next giữ
// nguyên bản tốt trước đó thay vì lưu một bản "0 tour".
export const revalidate = 60;

export async function GET() {
  const [tours, visas, settings, muaDip] = await Promise.all([getBangGia(), getVisaCountries(), getSettings(), getSeasonPages()]);

  return new Response(llmsTxt({ tours, visas: visas.filter((v) => slugHopLe(v.slug)), settings, muaDip }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
