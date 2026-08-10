"use client";
// Windows/Edge không có font emoji cờ quốc gia đầy đủ nên emoji cờ bị hiển thị thành
// chữ viết tắt (TH, KR, JP...). Ta tự vẽ SVG cờ đơn giản, gọn, để hiển thị đúng trên mọi máy.

export function FlagThailand(props) {
  return (
    <svg viewBox="0 0 36 24" className={props.className}>
      <clipPath id="th"><rect width="36" height="24" rx="4" /></clipPath>
      <g clipPath="url(#th)">
        <rect width="36" height="24" fill="#F4F5F8" />
        <rect width="36" height="4.4" fill="#A51931" />
        <rect y="19.6" width="36" height="4.4" fill="#A51931" />
        <rect y="8.8" width="36" height="6.4" fill="#2D2A4A" />
      </g>
    </svg>
  );
}

export function FlagKorea(props) {
  return (
    <svg viewBox="0 0 36 24" className={props.className}>
      <clipPath id="kr"><rect width="36" height="24" rx="4" /></clipPath>
      <g clipPath="url(#kr)">
        <rect width="36" height="24" fill="#FFFFFF" />
        <circle cx="18" cy="12" r="5.5" fill="#C60C30" />
        <path d="M18 6.5a5.5 5.5 0 0 1 0 11 2.75 2.75 0 0 1 0-5.5 2.75 2.75 0 0 0 0-5.5Z" fill="#003478" />
        <circle cx="13" cy="6.2" r="1" fill="#111" />
        <circle cx="12" cy="8.3" r="1" fill="#111" />
        <circle cx="23" cy="17.8" r="1" fill="#111" />
        <circle cx="24" cy="15.7" r="1" fill="#111" />
      </g>
    </svg>
  );
}

export function FlagJapan(props) {
  return (
    <svg viewBox="0 0 36 24" className={props.className}>
      <clipPath id="jp"><rect width="36" height="24" rx="4" /></clipPath>
      <g clipPath="url(#jp)">
        <rect width="36" height="24" fill="#FFFFFF" />
        <circle cx="18" cy="12" r="6.5" fill="#BC002D" />
      </g>
    </svg>
  );
}

export function FlagSingapore(props) {
  return (
    <svg viewBox="0 0 36 24" className={props.className}>
      <clipPath id="sg"><rect width="36" height="24" rx="4" /></clipPath>
      <g clipPath="url(#sg)">
        <rect width="36" height="12" fill="#EF3340" />
        <rect y="12" width="36" height="12" fill="#FFFFFF" />
        <circle cx="9" cy="7" r="3.4" fill="#FFFFFF" />
        <circle cx="10.4" cy="7" r="2.8" fill="#EF3340" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={13 + i * 1.6} cy={7 - Math.cos((i / 4) * Math.PI) * 0} r="0.55" fill="#FFFFFF" />
        ))}
      </g>
    </svg>
  );
}

export function FlagChina(props) {
  return (
    <svg viewBox="0 0 36 24" className={props.className}>
      <clipPath id="cn"><rect width="36" height="24" rx="4" /></clipPath>
      <g clipPath="url(#cn)">
        <rect width="36" height="24" fill="#DE2910" />
        <path d="M8 4 L9.4 8 L14 8 L10.3 10.6 L11.6 15 L8 12.4 L4.4 15 L5.7 10.6 L2 8 L6.6 8 Z" fill="#FFDE00" />
        <circle cx="15" cy="3" r="0.9" fill="#FFDE00" />
        <circle cx="17.5" cy="5.8" r="0.9" fill="#FFDE00" />
        <circle cx="17.5" cy="9.6" r="0.9" fill="#FFDE00" />
        <circle cx="15" cy="12" r="0.9" fill="#FFDE00" />
      </g>
    </svg>
  );
}

export function FlagTaiwan(props) {
  return (
    <svg viewBox="0 0 36 24" className={props.className}>
      <clipPath id="tw"><rect width="36" height="24" rx="4" /></clipPath>
      <g clipPath="url(#tw)">
        <rect width="36" height="24" fill="#FE0000" />
        <rect width="18" height="12" fill="#000095" />
        <circle cx="9" cy="6" r="3.4" fill="#FFFFFF" />
        <circle cx="9" cy="6" r="2.3" fill="#000095" />
      </g>
    </svg>
  );
}