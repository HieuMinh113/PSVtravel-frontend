import test from "node:test";
import assert from "node:assert/strict";
import { docNguon } from "../app/lib/nguonKhach.js";

const now = 1_800_000_000_000;

test("Link clip TikTok gắn utm: giữ chiến dịch + mã clip", () => {
  assert.deepEqual(
    docNguon({ search: "?utm_source=tiktok&utm_campaign=tet-2027&utm_content=clip-01", host: "psvtravel.com", path: "/tour-tet", now }),
    { source: "tiktok", campaign: "tet-2027", content: "clip-01", landing: "/tour-tet", at: now }
  );
});

test("Từ Perplexity / Google: chỉ giữ tên miền giới thiệu", () => {
  assert.deepEqual(docNguon({ referrer: "https://www.perplexity.ai/search/abc?q=tour", host: "psvtravel.com", path: "/", now }), {
    referrer: "perplexity.ai",
    landing: "/",
    at: now,
  });
  assert.equal(docNguon({ search: "?gclid=xyz", referrer: "https://www.google.com/", host: "psvtravel.com", now }).gclid, 1);
});

test("Vào thẳng hoặc chuyển trang nội bộ: không ghi đè nguồn cũ", () => {
  assert.equal(docNguon({ host: "psvtravel.com", now }), null);
  assert.equal(docNguon({ referrer: "https://psvtravel.com/tour-trong-nuoc", host: "www.psvtravel.com", now }), null);
  assert.equal(docNguon({ referrer: "không phải link", host: "psvtravel.com", now }), null);
});
