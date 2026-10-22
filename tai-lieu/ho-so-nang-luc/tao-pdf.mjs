// In ho-so.html ra PDF A4 vào public/ (link "Tải hồ sơ năng lực" ở trang Team building).
//   node tai-lieu/ho-so-nang-luc/tao-pdf.mjs
// Cần Playwright + Chromium: npm i --no-save playwright && npx playwright install chromium
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const thuMuc = path.dirname(fileURLToPath(import.meta.url));
const ra = path.join(thuMuc, "../../public/ho-so-nang-luc-psv-travel.pdf");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Chưa có Playwright: npm i --no-save playwright && npx playwright install chromium");
  process.exit(1);
}

const trinhDuyet = await chromium.launch();
const trang = await trinhDuyet.newPage();
await trang.goto(pathToFileURL(path.join(thuMuc, "ho-so.html")).href, { waitUntil: "networkidle" });
await trang.evaluate(() => document.fonts.ready);
await trang.pdf({ path: ra, format: "A4", printBackground: true, preferCSSPageSize: true });
await trinhDuyet.close();
console.log("Đã tạo", ra);
