// components/smooth-scroll/ScrollProgress.tsx
"use client";

/**
 * Thin teal progress bar at the very top of the page
 * showing how far the user has scrolled.
 */

import React, { useState, useEffect } from "react";
import { useSmoothScroll } from "./SmoothScroll";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    /* prefer lenis scroll events for accuracy */
    const instance = lenis.current;
    if (instance) {
      const handler = (e: { progress: number }) => setProgress(e.progress);
      instance.on("scroll", handler as never);
      return () => instance.off("scroll", handler as never);
    }

    /* fallback: native scroll */
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 99999,
        background: "rgba(24,56,88,0.3)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: "linear-gradient(to right, #183858, #30C0C0, #60DFDF)",
          boxShadow: "0 0 8px rgba(48,192,192,0.6)",
          transition: "width 0.05s linear",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}
