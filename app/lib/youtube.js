// Tiện ích video YouTube dùng chung.
//
// Backend chỉ trả về MÃ video (11 ký tự), không trả link thô. Ở đây kiểm tra
// lại mã một lần nữa rồi mới dựng link — website chỉ bao giờ nhúng đúng
// youtube-nocookie.com, không thể bị lợi dụng để nhúng địa chỉ lạ.

const MAU_MA_VIDEO = /^[A-Za-z0-9_-]{11}$/;

export const laMaVideoHopLe = (id) => typeof id === "string" && MAU_MA_VIDEO.test(id);

// youtube-nocookie: bản nhúng "bảo mật nâng cao" của YouTube — không đặt cookie
// theo dõi cho tới khi khách bấm phát.
export const linkNhung = (id, { tuPhat = false } = {}) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${tuPhat ? "&autoplay=1" : ""}`;

export const anhThuNho = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const linkXem = (id) => `https://www.youtube.com/watch?v=${id}`;

// Bộ media của một khoảnh khắc du khách: VIDEO đứng đầu (nếu có), rồi tới ảnh.
// Bỏ ảnh thu nhỏ YouTube khỏi danh sách ảnh — đó chỉ là ảnh bìa tạm máy chủ gắn
// cho khoảnh khắc chỉ có video, không phải ảnh thật để xem riêng.
export function mediaKhoanhKhac(m) {
  if (!m) return [];
  const anh = (m.photos?.length ? m.photos : [m.photo])
    .filter((src) => src && !src.startsWith("https://i.ytimg.com/"))
    .map((src) => ({ loai: "anh", src }));
  return laMaVideoHopLe(m.videoId) ? [{ loai: "video", id: m.videoId }, ...anh] : anh;
}
