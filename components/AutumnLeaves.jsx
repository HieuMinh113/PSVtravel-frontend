"use client";

import { useEffect, useState } from "react";
import { isAutumnSeason } from "@/app/lib/season";

// Ít lá, lệch nhịp từ lúc mở trang để trang không bị phủ kín.
const LEAVES = [
  { x: "2%", drift: "3vw", duration: "16s", delay: "-3s", size: 35, image: "0%" },
  { x: "6%", drift: "-2vw", duration: "22s", delay: "-14s", size: 28, image: "50%" },
  { x: "10%", drift: "2vw", duration: "20s", delay: "-8s", size: 32, image: "100%" },
  { x: "14%", drift: "-3vw", duration: "24s", delay: "-19s", size: 27, image: "50%" },
  { x: "82%", drift: "-3vw", duration: "19s", delay: "-5s", size: 37, image: "0%" },
  { x: "87%", drift: "2vw", duration: "23s", delay: "-12s", size: 29, image: "50%" },
  { x: "92%", drift: "-2vw", duration: "21s", delay: "-16s", size: 34, image: "100%" },
  { x: "96%", drift: "-4vw", duration: "25s", delay: "-7s", size: 28, image: "50%" },
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
        <span
          key={index}
          className="autumn-leaf"
          style={{
            width: leaf.size,
            height: leaf.size,
            "--leaf-x": leaf.x,
            "--leaf-drift": leaf.drift,
            "--leaf-duration": leaf.duration,
            "--leaf-delay": leaf.delay,
            "--leaf-image-position": leaf.image,
          }}
        />
      ))}
    </div>
  );
}
