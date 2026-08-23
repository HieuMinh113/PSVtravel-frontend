import { FileText, CalendarClock, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";

/**
 * Khung chung cho các trang văn bản do admin soạn: điều khoản sử dụng,
 * chính sách thanh toán, chính sách huỷ & hoàn tiền...
 *
 * Nội dung lấy từ mục Trang tĩnh trong trang quản trị — bộ phận pháp chế tự
 * sửa được, không phải nhờ lập trình viên. Chưa soạn thì trang vẫn tồn tại và
 * hiển thị lời nhắn cùng hotline, vì cơ quan quản lý vào kiểm tra mà gặp 404
 * là trượt hồ sơ thông báo website.
 */
export default function TrangTinh({ page, tieuDe, moTa, hotline }) {
  const coNoiDung = Boolean(page?.body?.trim());
  const soGoi = (hotline || "").replace(/[^0-9+]/g, "");

  return (
    <div>
      <PageHero
        eyebrow="Thông tin pháp lý"
        title={page?.title || tieuDe}
        description={moTa}
        crumbs={[{ label: page?.title || tieuDe }]}
      />

      <section className="bg-foam py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <article className="rounded-3xl bg-white p-6 shadow-card sm:p-9">
            {coNoiDung ? (
              <div className="prose-psv" dangerouslySetInnerHTML={{ __html: page.body }} />
            ) : (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ocean-50 text-ocean-600">
                  <FileText className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-deep-900">
                  Nội dung đang được cập nhật
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                  Chúng tôi đang hoàn thiện văn bản này. Trong lúc chờ, vui lòng gọi hotline
                  để được nhân viên tư vấn giải đáp trực tiếp.
                </p>
                {hotline && (
                  <a href={`tel:${soGoi}`} className="btn-cta mt-6 !px-6 !py-3 text-sm">
                    <Phone className="h-4 w-4" /> Gọi {hotline}
                  </a>
                )}
              </div>
            )}

            {coNoiDung && page?.updatedAt && (
              <p className="mt-8 flex items-center gap-2 border-t border-ocean-50 pt-5 text-xs text-ink-subtle">
                <CalendarClock className="h-3.5 w-3.5" />
                Cập nhật lần cuối:{" "}
                {new Date(page.updatedAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
