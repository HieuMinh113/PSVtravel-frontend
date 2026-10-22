# Hồ sơ năng lực 1 trang (du lịch công ty & team building)

Nguồn của tệp `public/ho-so-nang-luc-psv-travel.pdf` — khách tải ở trang
`/team-building` (nút "Tải hồ sơ năng lực"), sales gửi kèm báo giá.

- `ho-so.html`: nội dung + giao diện (khổ A4, font và màu của website).
- `qr-team-building.svg`: mã QR tới `https://psvtravel.com/team-building?utm_source=qr&utm_campaign=ho-so-nang-luc`
  — yêu cầu đến từ mã này hiện ở admin → Bán hàng → Nguồn khách (kênh "Mã QR", chiến dịch "ho-so-nang-luc").
- `tao-pdf.mjs`: in HTML ra PDF.

## Sửa nội dung

1. Sửa chữ trong `ho-so.html` (mở bằng trình duyệt để xem trước).
2. Chạy `node tai-lieu/ho-so-nang-luc/tao-pdf.mjs` (cần Playwright, xem đầu tệp).
3. Commit cả `ho-so.html` lẫn PDF trong `public/`.

Chỉ ghi điều công ty cam kết được (số liệu, giấy phép, quy trình) — giống nội
dung trang Team building. Số năm hoạt động tự tính theo năm in; nên in lại đầu
mỗi năm. Hotline, địa chỉ, email đổi thì sửa cả ở đây (tệp PDF không tự cập nhật
theo Cài đặt trong admin).
