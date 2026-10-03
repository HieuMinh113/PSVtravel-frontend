"use client";

import { useEffect, useState } from "react";
import { isAutumnSeason } from "@/app/lib/season";

// Ít lá, lệch nhịp từ lúc mở trang để trang không bị phủ kín.
const LEAVES = [
  { x: "6%", drift: "8vw", duration: "16s", delay: "-3s", size: 28, color: "#E9B949" },
  { x: "18%", drift: "-7vw", duration: "22s", delay: "-14s", size: 22, color: "#D99A2B" },
  { x: "31%", drift: "10vw", duration: "20s", delay: "-8s", size: 25, color: "#F0D000" },
  { x: "47%", drift: "-9vw", duration: "24s", delay: "-19s", size: 21, color: "#E9B949" },
  { x: "62%", drift: "7vw", duration: "19s", delay: "-5s", size: 29, color: "#D99A2B" },
  { x: "75%", drift: "-8vw", duration: "23s", delay: "-12s", size: 23, color: "#F0D000" },
  { x: "88%", drift: "6vw", duration: "21s", delay: "-16s", size: 27, color: "#E9B949" },
  { x: "96%", drift: "-6vw", duration: "25s", delay: "-7s", size: 22, color: "#D99A2B" },
];

export default function AutumnLeaves({ initialAutumn = false }) {
  const [visible, setVisible] = useState(initialAutumn);

  useEffect(() => {
    const refresh = () => setVisible(isAutumnSeason());
    refresh();
    const timer = setInterval(refresh, 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="autumn-leaves" aria-hidden="true">
      {LEAVES.map((leaf, index) => (
        <svg
          key={index}
          className="autumn-leaf"
          viewBox="0 0 24 24"
          width={leaf.size}
          height={leaf.size}
          style={{
            "--leaf-x": leaf.x,
            "--leaf-drift": leaf.drift,
            "--leaf-duration": leaf.duration,
            "--leaf-delay": leaf.delay,
            color: leaf.color,
          }}
        >
          <path fill="currentColor" d="M12 1 14.2 5.3 17 3.8 16.2 7.1 21 7.3 18.8 10 22 12 17.3 14.1 18.1 17.5 13.2 16.6 12 22 10.8 16.6 5.9 17.5 6.7 14.1 2 12 5.2 10 3 7.3 7.8 7.1 7 3.8 9.8 5.3Z" />
        </svg>
      ))}
    </div>
  );
}
