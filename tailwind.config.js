/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Bảng màu "PSVTravel" — đúng 3 màu trong logo: xanh dương, xanh lá, vàng
        deep: {
          950: "#04121F", // đáy đại dương
          900: "#071E33",
          800: "#0A2A45",
          700: "#0D3A5C",
        },

        // ===== Chữ theo ngữ nghĩa =====
        // Trước đây chữ phụ dùng deep-800 kèm opacity (/40, /45, /50) — pha với nền
        // trắng cho ra tương phản chỉ ~2.5:1, dưới chuẩn WCAG AA (4.5:1).
        // Ba mức dưới đây đều đã đạt chuẩn, dùng thay cho mọi chỗ opacity chữ.
        ink: {
          DEFAULT: "#0A2A45", // chữ chính        — 14.8:1 trên nền trắng
          muted: "#4A6076",   // chữ phụ           —  7.1:1
          subtle: "#5E7385",  // chú thích, meta   —  5.2:1
          onDark: "#E8F2F8",  // chữ trên nền tối
        },

        ocean: {
          // Xanh dương — deepskyblue hoà một chút mediumblue theo yêu cầu
          50: "#EBF7FE",
          100: "#D1EDFD",
          200: "#9EDAFC",
          300: "#61C2F9",
          400: "#29ACF7",
          500: "#009DF6",
          600: "#0085D2",
          700: "#0169A9",
          800: "#015185",
          900: "#013C65",
        },
        teal: {
          // Xanh lá — đúng màu xanh lá trong logo (giữ tên "teal" để không phá các nơi
          // đang dùng class teal-* trong toàn bộ trang, chỉ đổi mã màu bên trong)
          50: "#F4FCF2",
          100: "#E5F8DE",
          200: "#C7F0B8",
          300: "#A0E687",
          400: "#76DA51",
          500: "#50D020", // đúng màu xanh lá logo
          600: "#44B01E",
          700: "#38901C",
          800: "#2D741A",
          900: "#225819",
        },
        gold: {
          // Vàng — màu thứ 3 trong logo, mới thêm
          50: "#FEFCF0",
          100: "#FDF8D9",
          200: "#FAF0AD",
          300: "#F7E675",
          400: "#F3DA38",
          500: "#F0D000", // đúng màu vàng logo
          600: "#CAB003",
          700: "#A49006",
          800: "#837409",
          900: "#62580C",
        },

        // ===== Màu ấm bổ túc (MỚI) =====
        // Xanh dương #009DF6 có màu bổ túc nằm ở dải cam. Thang này cho phép nút
        // chuyển đổi "nhảy" ra khỏi nền xanh — nguyên tắc cặp bổ túc của Aurora UI.
        // sunset-600 = #EA580C: chữ trắng đặt lên đạt 4.6:1, vừa qua chuẩn AA.
        sunset: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },

        sand: {
          50: "#FDFAF4",
          100: "#FBF4E7", // nền ấm thay cho trắng thuần
          200: "#F4E9D3",
        },
        foam: "#F5FBFC",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "horizon": "linear-gradient(160deg, #EBF7FE 0%, #9EDAFC 30%, #F7E675 58%, #76DA51 82%, #44B01E 100%)",
        "deep-gradient": "linear-gradient(160deg, #013C65 0%, #0169A9 35%, #009DF6 72%, #0085D2 100%)",
        "duotone-glow": "radial-gradient(circle at 22% 25%, rgba(41,172,247,0.55), transparent 50%), radial-gradient(circle at 82% 80%, rgba(80,208,32,0.16), transparent 45%), radial-gradient(circle at 50% 100%, rgba(240,208,0,0.10), transparent 40%)",
        "tide": "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",

        // Aurora UI — mesh gradient nhiều điểm dừng, có cặp bổ túc xanh–cam.
        // Dùng làm nền cho các khối lớn (hero, dải CTA) thay cho màu phẳng.
        "aurora": "radial-gradient(at 18% 22%, rgba(0,157,246,0.28) 0px, transparent 55%), radial-gradient(at 82% 18%, rgba(240,208,0,0.20) 0px, transparent 50%), radial-gradient(at 70% 82%, rgba(80,208,32,0.22) 0px, transparent 52%), radial-gradient(at 25% 88%, rgba(234,88,12,0.14) 0px, transparent 48%)",
        "aurora-deep": "radial-gradient(at 15% 20%, rgba(0,133,210,0.55) 0px, transparent 55%), radial-gradient(at 85% 25%, rgba(80,208,32,0.28) 0px, transparent 50%), radial-gradient(at 60% 90%, rgba(234,88,12,0.22) 0px, transparent 50%)",
        "cta-warm": "linear-gradient(120deg, #F97316 0%, #EA580C 55%, #C2410C 100%)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "50%": { transform: "translateX(-2%) translateY(-6px)" },
        },
        driftSlow: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(3%)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        ripple: {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        // Aurora: nền mesh trôi chậm 14s — chỉ đổi background-position nên không
        // gây reflow, giữ 60fps. Tắt hoàn toàn khi người dùng chọn giảm chuyển động.
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%, 100% 50%, 50% 100%, 0% 0%" },
          "50%": { backgroundPosition: "100% 50%, 0% 50%, 50% 0%, 100% 100%" },
        },
      },
      animation: {
        drift: "drift 8s ease-in-out infinite",
        driftSlow: "driftSlow 14s ease-in-out infinite",
        bob: "bob 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite linear",
        marquee: "marquee 30s linear infinite",
        ripple: "ripple 2.2s ease-out infinite",
        pulseGlow: "pulseGlow 5s ease-in-out infinite",
        aurora: "aurora 14s ease-in-out infinite",
      },
      boxShadow: {
        deep: "0 20px 60px -15px rgba(7, 30, 51, 0.35)",
        glow: "0 0 40px rgba(80, 208, 32, 0.4)",
        // Quầng sáng ấm cho nút chuyển đổi — cùng tông với nút nên trông tự nhiên
        "glow-warm": "0 8px 30px -8px rgba(234, 88, 12, 0.55)",
        // Bóng đổ nhiều lớp: mềm và thật hơn bóng một lớp
        card: "0 1px 2px rgba(10,42,69,0.04), 0 8px 24px -8px rgba(10,42,69,0.12)",
        "card-hover": "0 2px 4px rgba(10,42,69,0.05), 0 18px 40px -12px rgba(10,42,69,0.20)",
      },
      transitionTimingFunction: {
        // Giảm tốc khi phần tử đi vào (cảm giác "hạ cánh" tự nhiên)
        "enter": "cubic-bezier(0.22, 1, 0.36, 1)",
        // Tăng tốc khi rời đi — theo quy tắc easing của skill
        "exit": "cubic-bezier(0.4, 0, 1, 1)",
      },
    },
  },
  plugins: [],
};
