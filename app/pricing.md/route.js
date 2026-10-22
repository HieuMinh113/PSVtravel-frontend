import { getBangGia, getVisaCountries, getSettings, slugHopLe } from "@/app/lib/api";
import { bangGiaMarkdown } from "@/app/lib/vanBanChoAI";

// /pricing.md — bảng giá mọi tour đang mở bán, dạng Markdown cho AI và trợ lý tự
// động đọc thẳng (không cần chạy JavaScript như trang web). Tên tiếng Anh vì đó
// là đường dẫn các trợ lý hay tự dò; nội dung tiếng Việt. /llms.txt trỏ tới đây.
//
// Dựng lại mỗi phút như các trang tour. API bảng giá lỗi thì ném lỗi để Next giữ
// bản tốt trước đó — bảng giá rỗng bị AI đọc thành "công ty không còn tour nào".
export const revalidate = 60;

export async function GET() {
  const [tours, visas, settings] = await Promise.all([getBangGia(), getVisaCountries(), getSettings()]);

  return new Response(bangGiaMarkdown({ tours, visas: visas.filter((v) => slugHopLe(v.slug)), settings }), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
