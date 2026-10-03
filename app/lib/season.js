// Khoảng thời gian cố định theo múi giờ Việt Nam, độc lập giờ máy/build.
export function isAutumnSeason(now = new Date()) {
  return now >= new Date("2026-10-01T00:00:00+07:00")
    && now < new Date("2026-11-01T00:00:00+07:00");
}
