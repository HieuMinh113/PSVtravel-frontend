import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Mẫu "đọc ngày giờ / localStorage trong useEffect rồi setState" được dùng
      // CỐ Ý để máy chủ và trình duyệt dựng cùng một HTML (tránh lỗi lệch nội dung
      // khi máy chủ ở múi giờ khác) — chỉ cảnh báo, không chặn.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "public/**"]),
]);

export default eslintConfig;
