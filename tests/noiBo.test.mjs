import test from "node:test";
import assert from "node:assert/strict";
import { headerNoiBo } from "../app/lib/noiBo.js";

test("Máy chủ Next có khoá đủ dài → gửi kèm header nội bộ", () => {
  process.env.PSV_NOI_BO = "a".repeat(48);
  assert.deepEqual(headerNoiBo(), { "X-Psv-Noi-Bo": "a".repeat(48) });
});

test("Khoá thiếu / quá ngắn → không gửi gì (bị tính giới hạn như mọi người)", () => {
  delete process.env.PSV_NOI_BO;
  assert.deepEqual(headerNoiBo(), {});
  process.env.PSV_NOI_BO = "";
  assert.deepEqual(headerNoiBo(), {});
  process.env.PSV_NOI_BO = "ngan";
  assert.deepEqual(headerNoiBo(), {});
});

test("Trong trình duyệt không bao giờ gửi khoá", () => {
  process.env.PSV_NOI_BO = "b".repeat(48);
  globalThis.window = {};
  try {
    assert.deepEqual(headerNoiBo(), {});
  } finally {
    delete globalThis.window;
    delete process.env.PSV_NOI_BO;
  }
});
