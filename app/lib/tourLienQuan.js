// Khối "Tour cùng khu vực" cuối trang tour: 3 tour gợi ý, xếp theo độ gần.
//
// Trước đây lấy 8 tour bất kỳ cùng loại rồi lọc cùng "vùng" — tour nước ngoài
// thường để trống vùng nên gợi ý lệch (tour Hàn Quốc gợi ý tour châu Âu), còn
// lọc trong 8 tour thì hay ra rỗng. Giờ: cùng nước (tour nước ngoài) / cùng vùng
// (trong nước) trước, rồi cùng danh mục điểm đến, thiếu mới bù tour cùng loại.
export function tourLienQuan(tour, dm, ungVien, soLuong = 3) {
  const cungNoi = (t) =>
    tour.type === "abroad" ? Boolean(tour.country) && t.country === tour.country : Boolean(tour.region) && t.region === tour.region;
  const diem = (t) => (cungNoi(t) ? 2 : 0) + (dm && (t.categorySlugs || []).includes(dm.slug) ? 1 : 0);

  const daCo = new Set([tour.slug]);
  const ds = [];
  for (const t of ungVien) {
    // Khác loại thì thẻ tour trỏ sai đường dẫn (/tour-trong-nuoc ↔ /tour-nuoc-ngoai)
    if (!t?.slug || daCo.has(t.slug) || t.type !== tour.type) continue;
    daCo.add(t.slug);
    ds.push(t);
  }
  // sort ổn định: cùng điểm thì giữ thứ tự API (tour nổi bật, thứ tự admin)
  return ds
    .map((t, i) => ({ t, i, d: diem(t) }))
    .sort((a, b) => b.d - a.d || a.i - b.i)
    .slice(0, soLuong)
    .map((x) => x.t);
}
