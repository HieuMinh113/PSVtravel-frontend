"use client";
import { ShieldCheck, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

const sections = [
  {
    icon: Database,
    title: "1. Thông tin chúng tôi thu thập",
    content: "Chúng tôi thu thập thông tin bạn cung cấp khi đặt tour, đăng ký tài khoản hoặc liên hệ tư vấn, bao gồm: họ tên, số điện thoại, email, địa chỉ, thông tin giấy tờ tuỳ thân (khi cần thiết cho visa hoặc vé máy bay), và lịch sử đặt tour trên hệ thống.",
  },
  {
    icon: Eye,
    title: "2. Mục đích sử dụng thông tin",
    content: "Thông tin của bạn được sử dụng để xử lý đơn đặt tour, liên hệ xác nhận dịch vụ, hỗ trợ chăm sóc khách hàng, gửi thông báo khuyến mãi (nếu bạn đồng ý), và cải thiện chất lượng dịch vụ. Chúng tôi không sử dụng thông tin cho mục đích ngoài phạm vi này.",
  },
  {
    icon: Lock,
    title: "3. Bảo mật thông tin",
    content: "Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ thông tin cá nhân khỏi truy cập, sử dụng hoặc tiết lộ trái phép, bao gồm mã hoá dữ liệu thanh toán và giới hạn quyền truy cập nội bộ.",
  },
  {
    icon: UserCheck,
    title: "4. Chia sẻ thông tin với bên thứ ba",
    content: "Thông tin chỉ được chia sẻ với các đối tác cần thiết để hoàn tất dịch vụ (hãng hàng không, khách sạn, đơn vị xử lý visa, cổng thanh toán) và không được bán hoặc cho thuê cho bất kỳ bên thứ ba nào vì mục đích thương mại khác.",
  },
  {
    icon: ShieldCheck,
    title: "5. Quyền của khách hàng",
    content: "Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xoá thông tin cá nhân của mình bất kỳ lúc nào bằng cách liên hệ với chúng tôi qua hotline hoặc email hỗ trợ được cung cấp bên dưới.",
  },
  {
    icon: Mail,
    title: "6. Liên hệ về chính sách bảo mật",
    content: "Nếu có bất kỳ thắc mắc nào về chính sách bảo mật này, vui lòng liên hệ qua email hi@psvtravel.vn hoặc hotline 1900 1177 để được hỗ trợ.",
  },
];

export default function Privacy() {
  return (
    <div>
      <PageHero
        eyebrow="Chính sách"
        title="Chính sách bảo mật thông tin"
        description="Cập nhật lần cuối: 01/07/2026. Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng theo quy định pháp luật hiện hành."
        crumbs={[{ label: "Chính sách bảo mật" }]}
      />

      <section className="bg-foam py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionReveal className="rounded-2xl border border-ocean-100 bg-ocean-50/60 p-5 text-sm text-ink-muted">
            PSVTravel tôn trọng quyền riêng tư của khách hàng. Tài liệu này giải thích cách chúng tôi thu thập,
            sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng website và dịch vụ của chúng tôi.
          </SectionReveal>

          <div className="mt-10 space-y-8">
            {sections.map((s, i) => (
              <SectionReveal key={s.title} delay={i * 0.06} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ocean-100">
                  <s.icon className="h-5 w-5 text-ocean-600" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-deep-900">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.content}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}