import test from "node:test";
import assert from "node:assert/strict";
import { locHtml } from "../app/lib/sanitize.js";

// API mặc định khi chạy test: http://127.0.0.1:8000 (xem app/lib/anh.js)
const ANH = "http://127.0.0.1:8000/storage/guides/noi-dung/a.jpg";

test("Ảnh trong bài đi qua bộ tối ưu, tải chậm; ảnh trang ngoài giữ nguyên", () => {
  const ra = locHtml(`<p><img src="${ANH}"></p><p><img src="https://trang-ngoai.vn/x.png"></p>`, { tenBai: "Bài" });
  assert.match(ra, /src="\/_next\/image\?url=http%3A%2F%2F127\.0\.0\.1%3A8000%2Fstorage%2Fguides%2Fnoi-dung%2Fa\.jpg&amp;w=828&amp;q=75"/);
  assert.match(ra, /srcset="[^"]*w=1920&amp;q=75 1920w"/);
  assert.doesNotMatch(ra, /w=3840/);
  assert.match(ra, /src="https:\/\/trang-ngoai\.vn\/x\.png"/);
  assert.equal((ra.match(/loading="lazy"/g) || []).length, 2);
});

test("Ảnh thiếu alt: chú thích → tiêu đề mục → tên bài, trùng thì đánh số", () => {
  const ra = locHtml(
    `<img src="${ANH}"><h2>Chợ "đêm" & ăn vặt</h2><img src="${ANH}" alt=""><img src="${ANH}">` +
      `<figure><img src="${ANH}"><figcaption>Phố <b>Dotonbori</b></figcaption></figure><img src="${ANH}" alt="Mô tả thật">`,
    { tenBai: "Cẩm nang Osaka" }
  );
  const alt = [...ra.matchAll(/alt="([^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(alt, ["Cẩm nang Osaka", "Chợ &quot;đêm&quot; &amp; ăn vặt", "Chợ &quot;đêm&quot; &amp; ăn vặt - ảnh 2", "Phố Dotonbori", "Mô tả thật"]);
});

test("Link nội bộ: đường dẫn tương đối, bỏ / cuối, không nofollow; link ngoài giữ nofollow", () => {
  const ra = locHtml(
    `<a href="https://www.psvtravel.com/cam-nang/abc/?a=1#m" target="_blank">1</a>` +
      `<a href="http://psvtravel.com.vn/tour_nuoc_ngoai/nhat/">2</a><a href="/tour-nuoc-ngoai/">3</a>` +
      `<a href="https://google.com" target="_blank">4</a><a href="tel:0907870707">5</a><a href="javascript:alert(1)">6</a>`
  );
  assert.match(ra, /<a href="\/cam-nang\/abc\?a=1#m">1<\/a>/);
  assert.match(ra, /<a href="\/tour_nuoc_ngoai\/nhat">2<\/a>/);
  assert.match(ra, /<a href="\/tour-nuoc-ngoai">3<\/a>/);
  assert.match(ra, /<a href="https:\/\/google\.com" target="_blank" rel="noopener noreferrer nofollow">4<\/a>/);
  assert.match(ra, /<a href="tel:0907870707">5<\/a>/);
  assert.match(ra, /<a>6<\/a>/);
});

test("Vẫn chặn mã độc như trước", () => {
  const ra = locHtml(`<p onclick="x()">a</p><script>alert(1)</script><img src="javascript:alert(1)" onerror="x()"><iframe src="https://x"></iframe>`);
  assert.doesNotMatch(ra, /onclick|onerror|<script|<iframe|javascript:/);
});
