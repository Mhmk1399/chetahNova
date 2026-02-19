// components/smooth-scroll/ScrollToTop.tsx
"use client";

import   { useState, useEffect } from "react";
import { useScrollTo } from "./SmoothScroll";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => scrollTo(0)}
      className="fixed bottom-6 right-6 z-9999 group"
      aria-label="Scroll to top"
      style={{
        width: 42,
        height: 42,
        border: "1px solid rgba(48,192,192,0.3)",
        borderRadius: 2,
        background: "rgba(7,13,24,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.25s, background 0.25s",
        animation: "fadeInUp 0.3s ease both",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(48,192,192,0.6)";
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(48,192,192,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(48,192,192,0.3)";
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(7,13,24,0.88)";
      }}
    >
      {/* corner brackets */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderTop: "1px solid rgba(48,192,192,0.45)",
          borderLeft: "1px solid rgba(48,192,192,0.45)",
        }}
        aria-hidden="true"
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 8,
          height: 8,
          borderBottom: "1px solid rgba(48,192,192,0.45)",
          borderRight: "1px solid rgba(48,192,192,0.45)",
        }}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 12 12"
        fill="none"
        style={{ width: 12, height: 12 }}
        aria-hidden="true"
      >
        <path
          d="M6 10V2M2 6l4-4 4 4"
          stroke="#30C0C0"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </button>
  );
}
