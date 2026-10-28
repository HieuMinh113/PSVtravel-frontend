import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Phone, UserCheck } from "lucide-react";
import KetQuaVoucher from "@/components/voucher/KetQuaVoucher";
import { getSettings } from "@/app/lib/api";
import { headerIpKhach } from "@/app/lib/ipKhach";
import { chuanHoaMa, linkQuetNoiBo, trangThai } from "@/app/lib/voucher";
import { duocToiUu } from "@/app/lib/anh";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Trang mở ra khi quét QR in trên voucher (…/voucher/PSV-7KQ3-MZ8T). Luôn hỏi
// trạng thái mới nhất (voucher vừa dùng xong phải báo "Đã sử dụng" ngay), không
// cho Google lập chỉ mục — mỗi mã một trang, không có nội dung cho tìm kiếm.
async function layVoucher(ma) {
  if (!ma) return { v: null, loi: null };
  try {
    const res = await fetch(`${API_URL}/vouchers/${encodeURIComponent(ma)}`, {
      headers: { ...(await headerIpKhach()), Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) return { v: (await res.json())?.data ?? null, loi: null };
    if (res.status === 404) return { v: null, loi: null };
    return { v: null, loi: res.status === 429 ? "Bạn kiểm tra quá nhiều lần — đợi một phút rồi tải lại trang." : "Chưa kiểm tra được voucher, vui lòng tải lại trang." };
  } catch {
    return { v: null, loi: "Không kết nối được máy chủ, vui lòng tải lại trang." };
  }
}

export async function generateMetadata({ params }) {
  const ma = chuanHoaMa((await params).ma) ?? "";
  return {
    title: `Kiểm tra voucher ${ma}`.trim(),
    description: "Kết quả kiểm tra voucher PSV Travel: còn dùng được hay đã sử dụng, mệnh giá, hạn dùng.",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }) {
  const ma = chuanHoaMa((await params).ma);
  const [{ v, loi }, settings] = await Promise.all([layVoucher(ma), getSettings()]);
  const hotline = settings?.hotline || "0907 870 707";
  const conDung = v?.trang_thai === "con_dung";

  return (
    <section className="min-h-[70vh] bg-foam px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-3xl">
        <Link href="/khuyen-mai#kiem-tra" className="vung-bam inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800">
          <ArrowLeft className="h-4 w-4" /> Kiểm tra mã khác
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-deep-900 sm:text-4xl">Kiểm tra voucher</h1>

        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ocean-100">
          {v?.anh && (
            <div className={`relative aspect-[155/100] bg-deep-900 ${conDung ? "" : "grayscale-[60%]"}`}>
              <Image src={v.anh} alt={v.ten_dot || "Voucher PSV Travel"} fill sizes="(max-width: 768px) 100vw, 768px" unoptimized={!duocToiUu(v.anh)} className="object-cover" priority />
            </div>
          )}
          <div className="p-4 sm:p-6">
            {loi ? (
              <p className="rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-800">{loi}</p>
            ) : (
              <KetQuaVoucher v={v} ma={ma ?? ""} lon />
            )}
            {!loi && !v && (
              <p className="mt-3 text-sm text-ink-muted">{trangThai("khong_co").moTa} Vẫn không thấy? Gọi {hotline}.</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-3xl bg-white p-5 ring-1 ring-ocean-100">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-teal-600" />
            <p className="text-sm text-ink">Mỗi voucher dùng một lần. Voucher không ghi tên — giữ cẩn thận, không đăng ảnh mã lên mạng.</p>
          </div>
          <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="flex items-start gap-3 rounded-3xl bg-white p-5 ring-1 ring-ocean-100 transition-shadow hover:shadow-card">
            <Phone className="mt-0.5 h-6 w-6 shrink-0 text-sunset-700" />
            <span className="text-sm text-ink">Cần hỗ trợ về voucher? Gọi <b className="text-deep-900">{hotline}</b></span>
          </a>
        </div>

        {conDung && (
          <a href={linkQuetNoiBo(v.ma)} rel="nofollow" className="vung-bam mt-6 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ocean-700">
            <UserCheck className="h-3.5 w-3.5" /> Nhân viên PSV Travel: xác nhận sử dụng
          </a>
        )}
      </div>
    </section>
  );
}
