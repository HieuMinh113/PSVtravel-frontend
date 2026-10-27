import { Star, StarHalf } from "lucide-react";
import { saoChu } from "@/app/lib/maldives";

/** Hạng sao resort: 5 → năm sao; 4.5 → bốn sao + nửa sao */
export default function SaoResort({ sao, className = "flex", saoClass = "h-3.5 w-3.5 fill-gold-400 text-gold-400" }) {
  const n = Number(sao);
  if (!n) return null;
  const nguyen = Math.floor(n);
  return (
    <span className={className} aria-label={`${saoChu(n)} sao`}>
      {Array.from({ length: nguyen }).map((_, i) => <Star key={i} aria-hidden="true" className={saoClass} />)}
      {n - nguyen >= 0.5 && <StarHalf aria-hidden="true" className={saoClass} />}
    </span>
  );
}
