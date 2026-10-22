"use client";
// lucide-react đã loại bỏ các icon thương hiệu (Facebook, Instagram, Youtube) khỏi phiên bản mới,
// nên ta dùng SVG tối giản tự vẽ, đồng bộ về stroke-width với bộ icon Lucide đang dùng trong dự án.
export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 9V6.5c0-.83.67-1.5 1.5-1.5H17V2h-2.5A4.5 4.5 0 0 0 10 6.5V9H7v3h3v10h4V12h2.6l.4-3H14Z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.3v5.4l4.8-2.7-4.8-2.7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="7.5" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <path d="M7.5 11v6" />
      <path d="M12 17v-3.5c0-1.4 1-2.5 2.25-2.5S16.5 12.1 16.5 13.5V17" />
      <path d="M12 11v6" />
    </svg>
  );
}
// Messenger: bong bóng chat + tia chớp, cùng nét vẽ với bộ icon Lucide
export function MessengerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2.5C6.75 2.5 2.5 6.43 2.5 11.28c0 2.6 1.22 4.93 3.15 6.53V21.5l3.2-1.76c.99.27 2.05.42 3.15.42 5.25 0 9.5-3.93 9.5-8.78S17.25 2.5 12 2.5Z" />
      <path d="m7 13.5 3.3-3.5 2.4 2.2 4.3-3.7-3.3 3.6-2.4-2.2L7 13.5Z" />
    </svg>
  );
}
