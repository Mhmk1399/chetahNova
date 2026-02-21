// components/trust-bar/TrustBar.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./TrustBar.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface TrustItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  stat: string;
  statLabel: string;
  tag: string;
}

interface Stat {
  value: string;
  label: string;
}

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */
const TRUST_ITEMS: TrustItem[] = [
  {
    id: "seo",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M8 8l6 6M8 14l6-6" strokeLinecap="round" />
      </svg>
    ),
    label: "SEO Results",
    stat: "#1",
    statLabel: "Rankings",
    tag: "RANKING",
  },
  {
    id: "ai",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5v1.5h-4v-1.5A4 4 0 0 1 12 2Z" />
        <path d="M10 11h4v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2Z" />
        <circle cx="12" cy="19" r="2" />
        <path d="M12 15v2" />
        <path d="M5 5l2 2M19 5l-2 2M5 12H3M21 12h-2" strokeLinecap="round" />
      </svg>
    ),
    label: "Custom AI Tools",
    stat: "50+",
    statLabel: "Automations",
    tag: "AI",
  },
  {
    id: "secure",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <circle cx="12" cy="16" r="1" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    label: "Secure Websites",
    stat: "SSL",
    statLabel: "Protected",
    tag: "SECURITY",
  },
  {
    id: "speed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" strokeLinejoin="round" />
      </svg>
    ),
    label: "Fast Performance",
    stat: "99",
    statLabel: "Speed Score",
    tag: "SPEED",
  },
  {
    id: "mobile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" strokeLinecap="round" />
        <path d="M9 6h6" strokeLinecap="round" />
      </svg>
    ),
    label: "Mobile Optimized",
    stat: "100%",
    statLabel: "Responsive",
    tag: "MOBILE",
  },
  {
    id: "support",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    ),
    label: "24/7 Support",
    stat: "24/7",
    statLabel: "Available",
    tag: "SUPPORT",
  },
];

const STATS: Stat[] = [
  { value: "150+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "5+", label: "Years Experience" },
  { value: "50+", label: "Happy Clients" },
];

/* ════════════════════════════════════════
   ATOMS
════════════════════════════════════════ */
const TealDot = ({
  size = 6,
  pulse = false,
  color = "#30C0C0",
}: {
  size?: number;
  pulse?: boolean;
  color?: string;
}) => (
  <span
    className="relative inline-flex shrink-0"
    style={{ width: size, height: size }}
  >
    {pulse && (
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: `${color}44`,
          animation: "ping 2s cubic-bezier(0,0,.2,1) infinite",
        }}
      />
    )}
    <span
      className="relative rounded-full block"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size + 2}px ${color}, 0 0 ${size * 3}px ${color}44`,
      }}
    />
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2.5">
    <TealDot size={5} />
    <span
      className="font-mono text-[10px] tracking-[0.28em] uppercase"
      style={{ color: "#30C0C0", opacity: 0.8 }}
    >
      {children}
    </span>
  </div>
);

const Bracket = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const map = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`absolute w-2.5 h-2.5 pointer-events-none ${map[pos]}`}
      style={{ borderColor: "rgba(48,192,192,0.4)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   STAT CARD
════════════════════════════════════════ */
const StatCard = ({
  stat,
  index,
  revealed,
}: {
  stat: Stat;
  index: number;
  revealed: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.statCard} ${revealed ? styles.statRevealed : ""} relative`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />

      <div
        className={styles.statGlow}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />

      <span
        className="font-mono font-bold"
        style={{
          fontSize: "clamp(22px, 3.5vw, 32px)",
          color: hovered ? "#70E8E8" : "#60C8D0",
          letterSpacing: "-0.02em",
          transition: "color 0.3s",
          textShadow: hovered ? "0 0 20px rgba(48,192,192,0.4)" : "none",
        }}
      >
        {stat.value}
      </span>
      <span
        className="font-mono text-[9px] tracking-[0.18em] uppercase"
        style={{ color: "#2A5060" }}
      >
        {stat.label}
      </span>

      <div
        className={styles.statScanLine}
        style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
        aria-hidden="true"
      />
    </div>
  );
};

/* ════════════════════════════════════════
   TRUST ITEM CARD
════════════════════════════════════════ */
const TrustItemCard = ({
  item,
  index,
  revealed,
}: {
  item: TrustItem;
  index: number;
  revealed: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.trustCard} ${revealed ? styles.cardRevealed : ""} relative`}
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* Card glow */}
      <div
        className={styles.cardGlow}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Top scan line */}
      <div
        className={`${styles.cardScanTop} ${hovered ? styles.cardScanTopActive : ""}`}
        aria-hidden="true"
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className={styles.tagBadge}>
          <TealDot size={3} color={hovered ? "#30C0C0" : "#1A3848"} />
          <span
            className="font-mono text-[7.5px] tracking-[0.2em] uppercase"
            style={{
              color: hovered ? "#30C0C0" : "#1A3848",
              transition: "color 0.3s",
            }}
          >
            {item.tag}
          </span>
        </div>
        <span
          className="font-mono text-[8px] tracking-[0.15em]"
          style={{ color: "#1A3848" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Main content */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={styles.iconBox}>
          <div
            className={styles.iconInner}
            style={{
              color: hovered ? "#60E8E8" : "#30C0C0",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {item.icon}
          </div>
          <Bracket pos="tl" />
          <Bracket pos="br" />
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span
            className="font-mono text-[12px] leading-snug"
            style={{
              color: hovered ? "#C0E0E8" : "#5A8898",
              letterSpacing: "0.02em",
              transition: "color 0.3s",
            }}
          >
            {item.label}
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="font-mono text-[14px] font-semibold"
              style={{
                color: hovered ? "#70E8E8" : "#50C8D0",
                letterSpacing: "-0.01em",
                transition: "color 0.3s",
              }}
            >
              {item.stat}
            </span>
            <span
              className="font-mono text-[8px] tracking-[0.14em] uppercase"
              style={{ color: "#1E4058" }}
            >
              {item.statLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className={styles.cardBottomLine} aria-hidden="true" />
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function TrustBar() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [statsRevealed, setStatsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /* Intersection observer for stats */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Intersection observer for cards */
  useEffect(() => {
    const map = cardRefs.current;
    const observers: IntersectionObserver[] = [];

    map.forEach((el, id) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed((p) => new Set([...p, id]));
            obs.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const setRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(id, el);
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="trust-heading"
    >
      {/* Background layers */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
        {/* ══ HEADER ══ */}
        <div className="flex flex-col gap-4 mb-10 sm:mb-12">
          <SectionLabel>Social proof</SectionLabel>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h2
              id="trust-heading"
              className="font-mono leading-tight max-w-xl"
              style={{
                fontSize: "clamp(22px, 3.5vw, 38px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              Trusted by startups,
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 28px rgba(48,192,192,0.4)",
                }}
              >
                agencies & growing brands.
              </span>
            </h2>

            <div className="flex items-center gap-2">
              <TealDot size={4} />
              <span
                className="font-mono text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "#1A3848" }}
              >
                Worldwide · {new Date().getFullYear()}
              </span>
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ STATS ROW ══ */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10 sm:mb-12"
          role="list"
          aria-label="Key statistics"
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} role="listitem">
              <StatCard stat={stat} index={i} revealed={statsRevealed} />
            </div>
          ))}
        </div>

        {/* ══ DIVIDER ══ */}
        <div className={styles.sectionDivider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerNode}>
            <TealDot size={6} pulse />
          </div>
          <div className={styles.dividerLine} />
        </div>

        {/* ══ TRUST ITEMS GRID ══ */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10 sm:mb-12"
          role="list"
          aria-label="Trust indicators"
        >
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.id} role="listitem" ref={setRef(item.id)}>
              <TrustItemCard
                item={item}
                index={i}
                revealed={revealed.has(item.id)}
              />
            </div>
          ))}
        </div>

        {/* ══ BOTTOM STRIP ══ */}
        <div className={styles.bottomStrip}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Ready to transform your digital presence?
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <a
            href="#contact"
            className={`${styles.ctaLink} relative flex items-center gap-2`}
          >
            <Bracket pos="tl" />
            <Bracket pos="br" />
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "#7ABFCF" }}
            >
              Let's Talk
            </span>
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="#30C0C0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
