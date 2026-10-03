import test from "node:test";
import assert from "node:assert/strict";
import { isAutumnSeason } from "../app/lib/season.js";

for (const [time, expected] of [
  ["2026-09-30T23:59:59+07:00", false],
  ["2026-10-01T00:00:00+07:00", true],
  ["2026-10-31T23:59:59+07:00", true],
  ["2026-11-01T00:00:00+07:00", false],
]) {
  test(`Autumn campaign at ${time}`, () => {
    assert.equal(isAutumnSeason(new Date(time)), expected);
  });
}
