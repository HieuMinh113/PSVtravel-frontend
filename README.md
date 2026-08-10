# PSV Travel — phiên bản Next.js (chuẩn SEO)

Đây là bản chuyển từ Vite + React Router sang **Next.js 14 (App Router)** để render sẵn HTML,
phục vụ SEO cho web kinh doanh thật. Toàn bộ giao diện (Tailwind, màu sắc, animation, component)
được giữ nguyên; chỉ thay lớp định tuyến và render bên dưới.

## Chạy dự án

```bash
npm install
npm run dev        # môi trường phát triển: http://localhost:3000
npm run build      # build production (render sẵn tất cả trang + sitemap)
npm start          # chạy bản production
```

## Điểm SEO đã có sẵn

- **Render sẵn HTML (SSG):** mỗi trang, kể cả từng trang chi tiết tour, được tạo thành HTML tĩnh
  lúc build — Google đọc được ngay, không còn cảnh trang trắng chờ JavaScript.
- **Title + meta description riêng cho từng trang.** Trang tour tự sinh mô tả từ dữ liệu tour.
- **Canonical, Open Graph, Twitter Card** cho mọi trang.
- **JSON-LD dữ liệu có cấu trúc:** `TravelAgency` (toàn site) và `TouristTrip` + `Offer`
  + `AggregateRating` cho từng tour → đủ điều kiện lên rich result.
- **`sitemap.xml` và `robots.txt`** tự sinh (tự cập nhật khi thêm tour mới).
- `lang="vi"`, trang `/dang-nhap` đặt `noindex`.

## Việc cần làm khi lên chạy thật

1. Sửa `SITE_URL` trong `app/lib/seo.js` thành domain thật (đang để `psvtravel.vercel.app`).
2. Thay dữ liệu mẫu trong `data/*.js` bằng tour thật (hoặc nối API/CMS).
   Metadata + JSON-LD + sitemap sẽ tự cập nhật theo, không phải sửa tay.
3. Thay ảnh Unsplash bằng ảnh thật; cân nhắc dùng `next/image` để tối ưu.
4. Nối các form (đăng nhập, liên hệ, nhận tin) và link Zalo/mạng xã hội thật.

## Cấu trúc thư mục

```
app/
  layout.jsx            # layout gốc: <html lang="vi">, metadata nền, JSON-LD tổ chức
  globals.css           # CSS toàn cục (chuyển từ index.css)
  lib/seo.js            # cấu hình SEO + hàm tạo metadata / JSON-LD
  sitemap.js            # sinh sitemap.xml
  robots.js             # sinh robots.txt
  not-found.jsx         # trang 404
  (site)/               # nhóm route có Navbar/Footer
    layout.jsx          # Navbar + Footer + nút liên hệ + cuộn lên đầu
    page.jsx            # Trang chủ
    tour-trong-nuoc/            page.jsx  +  [slug]/page.jsx  (SSG từng tour)
    tour-nuoc-ngoai/            page.jsx  +  [slug]/page.jsx  (SSG từng tour)
    ve-chung-toi, lam-visa, ve-may-bay, cam-nang,
    khoanh-khac-du-khach, lien-he, chinh-sach-bao-mat/page.jsx
  dang-nhap/page.jsx    # trang đăng nhập (không có Navbar/Footer, noindex)
components/             # toàn bộ component giao diện (giữ nguyên, thêm "use client")
  pages/                # nội dung từng trang (bản client, được route ở app/ bọc lại)
data/                  # dữ liệu tour, review, guide... (giữ nguyên)
public/                # logo, favicon, icon
```

## Cách hoạt động của định tuyến mới

- Mỗi file `app/.../page.jsx` là "vỏ" chạy phía server: khai báo `metadata` (SEO) rồi render
  component giao diện tương ứng trong `components/pages/`.
- Trang chi tiết tour dùng `generateStaticParams` để render sẵn mọi tour, và
  `generateMetadata` để mỗi tour có title/mô tả/ảnh riêng.
- Điều hướng có mang tham số (tìm kiếm, lọc vùng) chuyển từ router-state sang query param
  (`?q=`, `?region=`, `?scroll=1`).
