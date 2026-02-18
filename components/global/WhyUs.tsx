// components/why-us/WhyUs.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./WhyUs.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface Metric {
  value: string;
  label: string;
  sub?: string;
}

interface Feature {
  id: string;
  index: string;
  title: string;
  description: string;
  tag: string;
}

/* ════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════ */
const METRICS: Metric[] = [
  { value: "99.98%", label: "Uptime SLA", sub: "12-month rolling" },
  { value: "< 40ms", label: "Avg Latency", sub: "global edge nodes" },
  { value: "10×", label: "Faster Deploy", sub: "vs. legacy infra" },
  { value: "SOC 2", label: "Certified", sub: "Type II compliant" },
];

const FEATURES: Feature[] = [
  {
    id: "f1",
    index: "01",
    title: "Edge-Native Architecture",
    description:
      "Requests are resolved at the nearest node in our 38-region mesh. Zero cold-starts, deterministic routing, and sub-millisecond failover keep your stack invisible to latency.",
    tag: "INFRASTRUCTURE",
  },
  {
    id: "f2",
    index: "02",
    title: "Zero-Trust Security Fabric",
    description:
      "Every packet is verified at the perimeter and at every internal hop. mTLS by default, short-lived credentials, and continuous posture checks — no implicit trust, ever.",
    tag: "SECURITY",
  },
  {
    id: "f3",
    index: "03",
    title: "Unified Observability",
    description:
      "Traces, metrics, and logs flow into a single correlated timeline. Anomaly detection fires before your users notice. One pane, full context, zero tab-switching.",
    tag: "MONITORING",
  },
  {
    id: "f4",
    index: "04",
    title: "GitOps-First Workflow",
    description:
      "Declarative config lives in your repo. Every change is auditable, every rollback is a one-liner. Environments are cattle, not pets — clone prod in seconds.",
    tag: "DEVELOPER EX",
  },
  {
    id: "f5",
    index: "05",
    title: "Elastic Compute Scaling",
    description:
      "Capacity adjusts in real-time against traffic curves, not scheduled windows. Scale to zero costs nothing; burst to 100k RPS costs only what you use.",
    tag: "PERFORMANCE",
  },
  {
    id: "f6",
    index: "06",
    title: "Dedicated Support Orbit",
    description:
      "A named senior engineer is on your account — not a ticket queue. P0 response in under 15 minutes, root-cause in under two hours, post-mortem in 24.",
    tag: "SUPPORT",
  },
];

/* ════════════════════════════════════════
   SMALL SHARED ATOMS
════════════════════════════════════════ */
const TealDot = ({ size = 6, pulse = false }: { size?: number; pulse?: boolean }) => (
  <span className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
    {pulse && (
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: "rgba(48,192,192,0.35)", animation: "ping 2s cubic-bezier(0,0,.2,1) infinite" }}
      />
    )}
    <span
      className="relative rounded-full block"
      style={{
        width: size,
        height: size,
        background: "#30C0C0",
        boxShadow: `0 0 ${size + 2}px #30C0C0, 0 0 ${size * 3}px rgba(48,192,192,0.4)`,
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

/* corner bracket */
const Bracket = ({
  pos,
}: {
  pos: "tl" | "tr" | "bl" | "br";
}) => {
  const base = "absolute w-3 h-3 pointer-events-none";
  const map = {
    tl: `top-0 left-0 border-t border-l`,
    tr: `top-0 right-0 border-t border-r`,
    bl: `bottom-0 left-0 border-b border-l`,
    br: `bottom-0 right-0 border-b border-r`,
  };
  return (
    <span
      className={`${base} ${map[pos]}`}
      style={{ borderColor: "rgba(48,192,192,0.45)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   METRIC CARD
════════════════════════════════════════ */
const MetricCard = ({ metric }: { metric: Metric }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.metricCard} relative p-5 flex flex-col gap-1`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="figure"
      aria-label={`${metric.value} — ${metric.label}`}
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />

      {/* glow on hover */}
      <div
        className={styles.metricGlow}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />

      <span
        className="font-mono font-semibold leading-none"
        style={{
          fontSize: "clamp(22px, 3.5vw, 32px)",
          color: hovered ? "#60DFDF" : "#A8D8E0",
          textShadow: hovered ? "0 0 24px rgba(48,192,192,0.55)" : "none",
          transition: "color .3s, text-shadow .3s",
          letterSpacing: "-0.01em",
        }}
      >
        {metric.value}
      </span>

      <span
        className="font-mono text-[11px] tracking-[0.18em] uppercase"
        style={{ color: "#4A7A8A" }}
      >
        {metric.label}
      </span>

      {metric.sub && (
        <span
          className="font-mono text-[9px] tracking-[0.14em] uppercase mt-0.5"
          style={{ color: "#2A4858", lineHeight: 1.4 }}
        >
          {metric.sub}
        </span>
      )}

      {/* bottom scan line on hover */}
      <div
        className={styles.metricScan}
        style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
        aria-hidden="true"
      />
    </div>
  );
};

/* ════════════════════════════════════════
   FEATURE CARD
════════════════════════════════════════ */
const FeatureCard = ({ feature, active, onClick }: {
  feature: Feature;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    className={`${styles.featureCard} ${active ? styles.featureCardActive : ""} w-full text-left`}
    onClick={onClick}
    aria-expanded={active}
    aria-controls={`feature-body-${feature.id}`}
  >
    {/* top border line */}
    <div className={styles.featureTopLine} aria-hidden="true" />

    <div className="flex items-start gap-4 p-5">
      {/* index */}
      <span
        className="font-mono text-[10px] tracking-[0.2em] flex-shrink-0 mt-0.5"
        style={{ color: active ? "#30C0C0" : "#1E4058", transition: "color .3s" }}
        aria-hidden="true"
      >
        {feature.index}
      </span>

      <div className="flex-1 min-w-0">
        {/* tag */}
        <span
          className="font-mono text-[8.5px] tracking-[0.25em] uppercase block mb-1.5"
          style={{ color: active ? "#30C0C0" : "#1E3848", transition: "color .3s" }}
        >
          {feature.tag}
        </span>

        {/* title */}
        <span
          className="font-mono text-[13px] tracking-[0.06em] block leading-snug"
          style={{
            color: active ? "#C8E8F0" : "#4A7A8A",
            transition: "color .3s",
          }}
        >
          {feature.title}
        </span>

        {/* expandable body */}
        <div
          id={`feature-body-${feature.id}`}
          className={styles.featureBody}
          style={{ maxHeight: active ? "200px" : "0px" }}
          aria-hidden={!active}
        >
          <p
            className="font-mono text-[11.5px] leading-relaxed pt-3"
            style={{ color: "#3A6878", letterSpacing: "0.03em" }}
          >
            {feature.description}
          </p>
        </div>
      </div>

      {/* chevron */}
      <span
        className={styles.featureChevron}
        style={{ transform: active ? "rotate(180deg)" : "rotate(0deg)" }}
        aria-hidden="true"
      >
        ›
      </span>
    </div>

    {/* active glow stripe */}
    <div
      className={styles.featureActiveStripe}
      style={{ opacity: active ? 1 : 0 }}
      aria-hidden="true"
    />
  </button>
);

/* ════════════════════════════════════════
   CENTRAL ORB (decorative)
════════════════════════════════════════ */
const CentralOrb = () => (
  <div className={styles.orbWrap} aria-hidden="true">
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="wuOrb" cx="42%" cy="36%" r="60%">
          <stop offset="0%" stopColor="#70E8E8" />
          <stop offset="40%" stopColor="#30C0C0" />
          <stop offset="75%" stopColor="#1060A0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#080C14" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wuBloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#104060" stopOpacity="0.05" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="wuGlow">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="satGlow2">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id="ringMask2">
          <rect width="200" height="200" fill="white" />
          <circle cx="100" cy="100" r="48" fill="black" />
        </mask>
      </defs>

      {/* outer bloom */}
      <circle cx="100" cy="100" r="95" fill="url(#wuBloom)" />

      {/* dashed outer ring track */}
      <circle cx="100" cy="100" r="88" stroke="#183858" strokeWidth="0.5"
        strokeDasharray="2 6" opacity="0.5" />

      {/* particle dots on ring */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * 360;
        const rad = ((angle - 90) * Math.PI) / 180;
        const r = 88 + ((i * 7 + 3) % 11) - 5;
        const x = 100 + r * Math.cos(rad);
        const y = 100 + r * Math.sin(rad);
        const op = 0.15 + ((i * 13 + 7) % 17) / 17 * 0.45;
        return (
          <circle key={i} cx={x} cy={y}
            r={0.8 + ((i * 5 + 2) % 7) / 7 * 1.2}
            fill="#30C0C0" opacity={op} />
        );
      })}

      {/* satellite orbit group */}
      <g className={styles.orbSatelliteOrbit} style={{ transformOrigin: "100px 100px" }}>
        <g filter="url(#satGlow2)">
          <circle cx="100" cy="12" r="3" fill="#60DFDF" opacity="0.95" />
          <circle cx="100" cy="12" r="5.5" fill="none"
            stroke="#30C0C0" strokeWidth="0.5" opacity="0.3" />
        </g>
      </g>

      {/* inner ring */}
      <circle cx="100" cy="100" r="56" fill="none"
        stroke="#18405A" strokeWidth="0.4" strokeDasharray="1.5 7" opacity="0.5" />

      {/* orb bloom bg */}
      <circle cx="100" cy="100" r="68" fill="url(#wuOrb)" opacity="0.2" />

      {/* orb core */}
      <circle cx="100" cy="100" r="40"
        fill="url(#wuOrb)" filter="url(#wuGlow)"
        className={styles.orbPulse} />

      {/* glass highlight */}
      <ellipse cx="91" cy="88" rx="14" ry="9"
        fill="white" opacity="0.06"
        transform="rotate(-25 100 100)" />

      {/* inner ring stroke */}
      <circle cx="100" cy="100" r="40" fill="none"
        stroke="#40D8D8" strokeWidth="0.5" opacity="0.35" />

      {/* crosshair */}
      <line x1="94" y1="100" x2="106" y2="100" stroke="#60DFDF" strokeWidth="0.5" opacity="0.4" />
      <line x1="100" y1="94" x2="100" y2="106" stroke="#60DFDF" strokeWidth="0.5" opacity="0.4" />
      <circle cx="100" cy="100" r="1.5" fill="#90EFEF" opacity="0.9" />
    </svg>
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function WhyUs() {
  const [activeFeature, setActiveFeature] = useState<string>("f1");
  const [visibleMetrics, setVisibleMetrics] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  /* intersection observer for metric reveal */
  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleMetrics(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggleFeature = (id: string) => {
    setActiveFeature((prev) => (prev === id ? "" : id));
  };

  return (
    <section
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="why-us-heading"
    >
      {/* ── bg layers ── */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />

      {/* top border scan */}
      <div className={styles.topBorderLine} aria-hidden="true" />

      <div
        className="relative z-10 w-full max-w-[1280px] mx-auto
                   px-5 sm:px-10 lg:px-16
                   py-20 sm:py-28 lg:py-36"
      >

        {/* ══════════ HEADER AREA ══════════ */}
        <div className="flex flex-col gap-5 mb-16 sm:mb-20">
          <SectionLabel>Why teams choose us</SectionLabel>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              id="why-us-heading"
              className="font-mono leading-tight max-w-xl"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              Built for teams who
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 32px rgba(48,192,192,0.4)",
                }}
              >
                can't afford downtime.
              </span>
            </h2>

            <p
              className="font-mono text-[12px] leading-relaxed max-w-xs lg:max-w-[260px]"
              style={{ color: "#2E5868", letterSpacing: "0.04em" }}
            >
              Infrastructure decisions compound. We obsess over the details so your team ships features, not fixes.
            </p>
          </div>

          {/* thin header divider */}
          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══════════ METRICS ROW ══════════ */}
        <div
          ref={metricsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-16 sm:mb-20"
          role="list"
          aria-label="Key performance metrics"
        >
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              role="listitem"
              className={styles.metricReveal}
              style={{
                opacity: visibleMetrics ? 1 : 0,
                transform: visibleMetrics ? "translateY(0)" : "translateY(16px)",
                transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`,
              }}
            >
              <MetricCard metric={m} />
            </div>
          ))}
        </div>

        {/* ══════════ MAIN CONTENT: features + orb ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px_1fr] gap-8 lg:gap-6 items-start">

          {/* LEFT: features 01–03 */}
          <div className="flex flex-col gap-2" role="list" aria-label="Features">
            {FEATURES.slice(0, 3).map((f) => (
              <div key={f.id} role="listitem">
                <FeatureCard
                  feature={f}
                  active={activeFeature === f.id}
                  onClick={() => toggleFeature(f.id)}
                />
              </div>
            ))}
          </div>

          {/* CENTER: decorative orb */}
          <div className="hidden lg:flex flex-col items-center justify-start gap-6 pt-2">
            <CentralOrb />

            {/* center column status stack */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-px flex-1"
                style={{
                  height: 40,
                  background: "linear-gradient(to bottom, rgba(48,192,192,0.3), transparent)",
                }}
                aria-hidden="true"
              />
              <TealDot size={5} pulse />
              <span
                className="font-mono text-[9px] tracking-[0.22em] uppercase"
                style={{ color: "#1E4858" }}
              >
                SYS.ACTIVE
              </span>
              <div
                className="w-px"
                style={{
                  height: 40,
                  background: "linear-gradient(to bottom, transparent, rgba(48,192,192,0.15))",
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* RIGHT: features 04–06 */}
          <div className="flex flex-col gap-2" role="list" aria-label="More features">
            {FEATURES.slice(3, 6).map((f) => (
              <div key={f.id} role="listitem">
                <FeatureCard
                  feature={f}
                  active={activeFeature === f.id}
                  onClick={() => toggleFeature(f.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ BOTTOM STRIP ══════════ */}
        <div className={`${styles.bottomStrip} mt-16 sm:mt-20`}>
          <div className="flex items-center gap-3">
            <TealDot size={5} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Trusted by 1,400+ engineering teams
            </span>
          </div>

          <div className={styles.bottomStripLine} aria-hidden="true" />

          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              38 global regions
            </span>
            <TealDot size={5} />
          </div>
        </div>

      </div>

      {/* bottom border scan */}
      <div className={styles.bottomBorderLine} aria-hidden="true" />
    </section>
  );
}