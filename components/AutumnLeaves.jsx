"use client";

import { useEffect, useState } from "react";
import { isAutumnSeason } from "@/app/lib/season";

// Ít lá, lệch nhịp từ lúc mở trang để trang không bị phủ kín.
const LEAVES = [
  { x: "2%", drift: "3vw", duration: "16s", delay: "-3s", size: 35, color: "#E9B949" },
  { x: "6%", drift: "-2vw", duration: "22s", delay: "-14s", size: 28, color: "#D99A2B" },
  { x: "10%", drift: "2vw", duration: "20s", delay: "-8s", size: 32, color: "#F0D000" },
  { x: "14%", drift: "-3vw", duration: "24s", delay: "-19s", size: 27, color: "#E9B949" },
  { x: "82%", drift: "-3vw", duration: "19s", delay: "-5s", size: 37, color: "#D99A2B" },
  { x: "87%", drift: "2vw", duration: "23s", delay: "-12s", size: 29, color: "#F0D000" },
  { x: "92%", drift: "-2vw", duration: "21s", delay: "-16s", size: 34, color: "#E9B949" },
  { x: "96%", drift: "-4vw", duration: "25s", delay: "-7s", size: 28, color: "#D99A2B" },
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
          viewBox="0 0 32 32"
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
          <path fill="currentColor" d="M28 3C19 3 9 7 5 17c-2 5 0 9 4 11 5 2 11 0 15-7 3-5 5-12 4-18Z" />
          <path
            fill="none"
            stroke="#8A5A16"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
            d="M4 30C11 22 19 14 26 7M12 22l-4-6m9 0 6 2m-3-5-1-5"
          />
        </svg>
      ))}
    </div>
  );
}
