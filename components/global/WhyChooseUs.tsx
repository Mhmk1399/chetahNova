// components/why-choose-us/WhyChooseUs.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./WhyChooseUs.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface Feature {
  id: string;
  index: string;
  title: string;
  tag: string;
  description: string;
  metrics: { label: string; value: string }[];
  highlights: string[];
}

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */
const FEATURES: Feature[] = [
  {
    id: "performance",
    index: "01",
    title: "Performance-Focused Development",
    tag: "SPEED",
    description:
      "We optimize speed, Core Web Vitals, and mobile performance to ensure your website loads fast and ranks higher.",
    metrics: [
      { label: "Speed Score", value: "99+" },
      { label: "Load Time", value: "< 1s" },
      { label: "Mobile", value: "100%" },
    ],
    highlights: ["Core Web Vitals", "Edge Caching", "Code Splitting"],
  },
  {
    id: "conversion",
    index: "02",
    title: "Conversion-Driven Design",
    tag: "GROWTH",
    description:
      "Every section is designed with psychology, trust-building, and lead generation principles.",
    metrics: [
      { label: "Conversion", value: "+300%" },
      { label: "Bounce Rate", value: "-45%" },
      { label: "Engagement", value: "+180%" },
    ],
    highlights: ["UX Psychology", "A/B Testing", "Trust Signals"],
  },
  {
    id: "seo",
    index: "03",
    title: "SEO From Day One",
    tag: "RANKING",
    description:
      "We structure the website properly from the beginning to make Google indexing and ranking easier.",
    metrics: [
      { label: "Rankings", value: "#1" },
      { label: "Organic Traffic", value: "+420%" },
      { label: "Keywords", value: "500+" },
    ],
    highlights: ["Technical SEO", "Schema Markup", "Content Strategy"],
  },
  {
    id: "automation",
    index: "04",
    title: "AI Automation That Saves You Time",
    tag: "AI",
    description:
      "We replace repetitive tasks with smart systems so your business scales faster with less manual work.",
    metrics: [
      { label: "Time Saved", value: "80%" },
      { label: "Tasks Automated", value: "50+" },
      { label: "ROI", value: "10x" },
    ],
    highlights: ["AI Chatbots", "Auto Lead Qual", "Smart Analytics"],
  },
];

const STATS = [
  { value: "500+", label: "Websites Built" },
  { value: "98%", label: "Client Retention" },
  { value: "10x", label: "Average ROI" },
  { value: "24/7", label: "Support" },
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
   FEATURE CARD
════════════════════════════════════════ */
const FeatureCard = ({
  feature,
  revealed,
  index,
}: {
  feature: Feature;
  revealed: boolean;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`${styles.featureCard} ${revealed ? styles.cardRevealed : ""} relative flex flex-col overflow-hidden`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Feature: ${feature.title}`}
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* card glow */}
      <div
        className={styles.cardGlow}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* top scan line */}
      <div
        className={`${styles.cardScanTop} ${hovered ? styles.cardScanTopActive : ""}`}
        aria-hidden="true"
      />

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[10px] tracking-[0.25em]"
            style={{ color: hovered ? "#30C0C0" : "#1E4058" }}
          >
            {feature.index}
          </span>
          <div className={styles.tagBadge}>
            <TealDot size={3} color={hovered ? "#30C0C0" : "#1A3848"} />
            <span
              className="font-mono text-[8px] tracking-[0.2em] uppercase"
              style={{
                color: hovered ? "#30C0C0" : "#1A3848",
                transition: "color 0.3s",
              }}
            >
              {feature.tag}
            </span>
          </div>
        </div>

        {/* hover indicator */}
        <div
          className={styles.statusIndicator}
          style={{ opacity: hovered ? 1 : 0.3 }}
        >
          <span
            className="font-mono text-[7px] tracking-[0.15em] uppercase"
            style={{ color: "#1A3848" }}
          >
            Active
          </span>
          <TealDot size={4} pulse={hovered} />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        <h3
          className="font-mono text-[14px] leading-snug"
          style={{
            color: hovered ? "#C0E0E8" : "#5A8898",
            letterSpacing: "0.02em",
            transition: "color 0.3s",
          }}
        >
          {feature.title}
        </h3>

        <p
          className="font-mono text-[11px] leading-relaxed"
          style={{ color: "#2A5060", letterSpacing: "0.03em" }}
        >
          {feature.description}
        </p>

        {/* ── METRICS ── */}
        <div
          className="flex flex-wrap gap-2 mt-auto pt-3"
          style={{ borderTop: "1px solid #0C1A28" }}
          role="list"
          aria-label="Feature metrics"
        >
          {feature.metrics.map((m) => (
            <div
              key={m.label}
              role="listitem"
              className={`${styles.metricChip} relative flex items-center gap-2 px-3 py-1.5`}
            >
              <Bracket pos="tl" />
              <Bracket pos="br" />
              <span
                className="font-mono text-[12px] font-semibold"
                style={{
                  color: hovered ? "#60D8E0" : "#50C8D0",
                  letterSpacing: "-0.01em",
                  transition: "color 0.3s",
                }}
              >
                {m.value}
              </span>
              <span
                className="font-mono text-[8px] tracking-[0.12em] uppercase"
                style={{ color: "#1E4058" }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── HIGHLIGHTS ── */}
        <div className="flex flex-wrap gap-1.5" aria-label="Key highlights">
          {feature.highlights.map((h) => (
            <span key={h} className={styles.highlightTag}>
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* bottom line */}
      <div className={styles.cardBottomLine} aria-hidden="true" />
    </article>
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
  stat: { value: string; label: string };
  index: number;
  revealed: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.statCard} ${revealed ? styles.statRevealed : ""} relative`}
      style={{ transitionDelay: `${index * 100}ms` }}
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
          fontSize: "clamp(24px, 4vw, 36px)",
          color: hovered ? "#70E8E8" : "#60C8D0",
          letterSpacing: "-0.02em",
          transition: "color 0.3s",
          textShadow: hovered ? "0 0 24px rgba(48,192,192,0.4)" : "none",
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
   MAIN COMPONENT
════════════════════════════════════════ */
export default function WhyChooseUs() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [statsRevealed, setStatsRevealed] = useState(false);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const statsRef = useRef<HTMLDivElement>(null);

  /* intersection reveal for cards */
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

  /* intersection reveal for stats */
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

  const setRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(id, el);
    },
    [],
  );

  return (
    <section
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="why-choose-heading"
    >
      {/* bg layers */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        {/* ══ HEADER ══ */}
        <div className="flex flex-col gap-5 mb-12 sm:mb-16">
          <SectionLabel>Why choose us</SectionLabel>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              id="why-choose-heading"
              className="font-mono leading-tight max-w-2xl"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              Why Businesses
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 32px rgba(48,192,192,0.4)",
                }}
              >
                Choose Us
              </span>
            </h2>

            <div className="flex flex-col gap-2 lg:items-end">
              <p
                className="font-mono text-[12px] leading-relaxed max-w-sm lg:text-right"
                style={{ color: "#2E5868", letterSpacing: "0.04em" }}
              >
                Most websites look good but fail to generate results. We build
                websites with performance, SEO, and automation in mind. Your
                website will actively work for your business.
              </p>
              <div className="flex items-center gap-2">
                <TealDot size={4} />
                <span
                  className="font-mono text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: "#1A3848" }}
                >
                  Results-driven approach
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ STATS ROW ══ */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12 sm:mb-16"
          role="list"
          aria-label="Key statistics"
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} role="listitem">
              <StatCard stat={stat} index={i} revealed={statsRevealed} />
            </div>
          ))}
        </div>

        {/* ══ FEATURES GRID ══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="list"
          aria-label="Why choose us features"
        >
          {FEATURES.map((feature, i) => (
            <div key={feature.id} role="listitem" ref={setRef(feature.id)}>
              <FeatureCard
                feature={feature}
                revealed={revealed.has(feature.id)}
                index={i}
              />
            </div>
          ))}
        </div>

        {/* ══ BOTTOM STRIP ══ */}
        <div className={`${styles.bottomStrip} mt-16 sm:mt-20`}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Proven methodology
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
              Start Your Project
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
