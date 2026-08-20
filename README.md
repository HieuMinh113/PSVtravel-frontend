# PSV Travel — phiên bản Next.js (chuẩn SEO)

Đây là bản chuyển từ Vite + React Router sang **Next.js 14 (App Router)** để render sẵn HTML,
phục vụ SEO cho web kinh doanh thật. Toàn bộ giao diện (Tailwind, màu sắc, animation, component)
được giữ nguyên; chỉ thay lớp định tuyến và render bên dưới.

## Chạy dự án

Cần **Node.js 18 trở lên**, và **backend phải đang chạy trước** — trang lấy toàn bộ
dữ liệu từ API Laravel. Xem hướng dẫn dựng backend ở repo `psvtravel-backend`.

```bash
npm install

# Tạo file cấu hình, trỏ tới API của backend
cp .env.example .env.local     # Windows PowerShell: copy .env.example .env.local

npm run dev        # môi trường phát triển: http://localhost:3000
npm run build      # build production (render sẵn tất cả trang + sitemap)
npm start          # chạy bản production
```

### Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Địa chỉ API backend. Lên production đổi thành domain thật |

### Backend chưa bật thì sao?

Trang **vẫn mở được**, chỉ thiếu dữ liệu — danh sách tour trống, không có banner.
Terminal sẽ in `Không gọi được API: /tours ECONNREFUSED`. Đây là hành vi cố ý:
một API chết không được phép làm sập cả website.

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
2. Đổi `NEXT_PUBLIC_API_URL` sang domain API thật, và thêm domain đó vào
   `config/cors.php` bên backend.
3. Thêm domain ảnh của backend vào `images.remotePatterns` trong `next.config.js`
   (hiện mới khai báo `localhost:8000`) — thiếu bước này ảnh upload sẽ không hiện.
4. Thay các con số quảng cáo viết cứng trong `components/pages/Home.jsx`
   (18.000 khách/năm, 4.8/5 từ 2.400 đánh giá, 12 năm…) bằng số thật.
5. Thay ảnh Unsplash trong `data/*.js` và ảnh vòng xoay dự phòng bằng ảnh thật.
6. Nối form Liên hệ và form Nhận ưu đãi ở chân trang — **hiện chưa gửi đi đâu**,
   chỉ hiện thông báo thành công trên màn hình.

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
  api/                  # route handler: proxy đăng nhập/OTP/tra cứu đơn sang Laravel
  lib/api.js            # nơi duy nhất gọi API backend
  lib/auth.js           # đọc/ghi token trong cookie httpOnly
data/                   # dữ liệu dự phòng + tiện ích định dạng (formatVND, bộ lọc)
public/                # logo, favicon, icon
```

## Cách hoạt động của định tuyến mới

- Mỗi file `app/.../page.jsx` là "vỏ" chạy phía server: khai báo `metadata` (SEO) rồi render
  component giao diện tương ứng trong `components/pages/`.
- Trang chi tiết tour dùng `generateStaticParams` để render sẵn mọi tour, và
  `generateMetadata` để mỗi tour có title/mô tả/ảnh riêng.
- Điều hướng có mang tham số (tìm kiếm, lọc vùng) chuyển từ router-state sang query param
  (`?q=`, `?region=`, `?scroll=1`).
