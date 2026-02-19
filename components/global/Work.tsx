// components/work/Work.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Work.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface WorkItem {
  id: string;
  index: string;
  title: string;
  category: string;
  tag: string;
  year: string;
  description: string;
  imageUrl: string;
  imageFallback: string;
  metrics: { label: string; value: string }[];
  tech: string[];
  featured?: boolean;
}

/* ════════════════════════════════════════
   MOCK DATA — using Unsplash reliable URLs
════════════════════════════════════════ */
const WORK_ITEMS: WorkItem[] = [
  {
    id: "w1",
    index: "01",
    title: "Orbital Command Center",
    category: "Infrastructure",
    tag: "FEATURED",
    year: "2024",
    description:
      "Real-time infrastructure orchestration dashboard for a Fortune 500 logistics company. Processing 4B events daily across 38 edge regions.",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop",
    imageFallback:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop",
    metrics: [
      { label: "Latency reduced", value: "−72%" },
      { label: "Uptime", value: "99.99%" },
      { label: "Daily events", value: "4B+" },
    ],
    tech: ["Edge Compute", "Mesh Net", "Observe"],
    featured: true,
  },
  {
    id: "w2",
    index: "02",
    title: "Cipher Gateway",
    category: "Security",
    tag: "SECURITY",
    year: "2024",
    description:
      "Zero-trust authentication fabric for a global fintech platform. mTLS everywhere, dynamic secrets, policy-as-code enforcement.",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop",
    imageFallback:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80&auto=format&fit=crop",
    metrics: [
      { label: "Threats blocked", value: "99.7%" },
      { label: "Auth latency", value: "< 2ms" },
      { label: "Credentials", value: "Auto-rotate" },
    ],
    tech: ["Threat Shield", "Vault", "mTLS"],
    featured: false,
  },
  {
    id: "w3",
    index: "03",
    title: "Pulse Analytics Engine",
    category: "Analytics",
    tag: "DATA",
    year: "2023",
    description:
      "Unified telemetry platform for a SaaS company with 2M+ active users. Sub-second anomaly detection, correlated across traces, logs, and metrics.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
    imageFallback:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80&auto=format&fit=crop",
    metrics: [
      { label: "MTTR improved", value: "−60%" },
      { label: "Events/sec", value: "1M+" },
      { label: "Retention", value: "365 days" },
    ],
    tech: ["Observe & Trace", "Pipeline", "AI Detect"],
    featured: false,
  },
  {
    id: "w4",
    index: "04",
    title: "Nexus Mesh Network",
    category: "Networking",
    tag: "INFRA",
    year: "2023",
    description:
      "Private encrypted backbone connecting 12 data centers and 3 cloud providers into a single mesh. Replaced legacy VPN with 400Gbps throughput.",
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80&auto=format&fit=crop",
    imageFallback:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop",
    metrics: [
      { label: "Throughput", value: "400Gbps" },
      { label: "Hops avg", value: "≤ 2" },
      { label: "Failover", value: "< 50ms" },
    ],
    tech: ["Mesh Net", "BGP", "WireGuard"],
    featured: false,
  },
  {
    id: "w5",
    index: "05",
    title: "Flux Data Pipeline",
    category: "Data Engineering",
    tag: "PIPELINE",
    year: "2023",
    description:
      "End-to-end streaming pipeline for an e-commerce giant — ingesting clickstream, inventory, and payment events with exactly-once guarantees.",
    imageUrl:
      "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&q=80&auto=format&fit=crop",
    imageFallback:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80&auto=format&fit=crop",
    metrics: [
      { label: "Events/day", value: "8B+" },
      { label: "Delivery SLA", value: "< 500ms" },
      { label: "Connectors", value: "48 active" },
    ],
    tech: ["Data Pipeline", "Kafka", "SQL Transform"],
    featured: false,
  },
  {
    id: "w6",
    index: "06",
    title: "Aurora Edge Deploy",
    category: "DevOps",
    tag: "DEVOPS",
    year: "2024",
    description:
      "GitOps-driven deployment platform that cut release cycles from weeks to minutes. Every environment is ephemeral, auditable, and clone-able.",
    imageUrl:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80&auto=format&fit=crop",
    imageFallback:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80&auto=format&fit=crop",
    metrics: [
      { label: "Deploy time", value: "−94%" },
      { label: "Rollback", value: "One-click" },
      { label: "Env cloning", value: "< 30s" },
    ],
    tech: ["GitOps", "Edge Compute", "IaC"],
    featured: false,
  },
];

const FILTERS = [
  "All",
  "Infrastructure",
  "Security",
  "Analytics",
  "Networking",
  "Data Engineering",
  "DevOps",
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
   PROGRESSIVE IMAGE
════════════════════════════════════════ */
const ProgressiveImage = ({
  src,
  fallback,
  alt,
  className = "",
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  /* preload */
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    setCurrentSrc(src);
  }, [src]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    } else {
      setErrored(true);
    }
  }, [currentSrc, fallback]);

  return (
    <div className={`${styles.imgWrapper} ${className}`}>
      {/* skeleton shimmer */}
      {!loaded && !errored && (
        <div className={styles.imgSkeleton} aria-hidden="true">
          <div className={styles.imgSkeletonShimmer} />
        </div>
      )}

      {/* actual image */}
      {!errored ? (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`${styles.img} ${loaded ? styles.imgLoaded : styles.imgHidden}`}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      ) : (
        /* SVG placeholder when all URLs fail */
        <div className={styles.imgPlaceholder} aria-label={alt}>
          <svg
            viewBox="0 0 200 140"
            fill="none"
            className="w-full h-full"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id={`ph-${alt}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#080C14" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="200" height="140" fill="#080E1C" />
            <circle cx="100" cy="70" r="55" fill={`url(#ph-${alt})`} />
            <circle
              cx="100"
              cy="70"
              r="28"
              fill="none"
              stroke="#183858"
              strokeWidth="0.6"
              strokeDasharray="2 5"
            />
            <circle
              cx="100"
              cy="70"
              r="16"
              fill="none"
              stroke="#1A4060"
              strokeWidth="0.5"
            />
            <circle cx="100" cy="70" r="6" fill="#183858" />
            <circle cx="100" cy="42" r="2.5" fill="#30C0C0" opacity="0.6" />
            <line
              x1="60"
              y1="70"
              x2="80"
              y2="70"
              stroke="#183858"
              strokeWidth="0.5"
            />
            <line
              x1="120"
              y1="70"
              x2="140"
              y2="70"
              stroke="#183858"
              strokeWidth="0.5"
            />
            <line
              x1="100"
              y1="30"
              x2="100"
              y2="50"
              stroke="#183858"
              strokeWidth="0.5"
            />
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="110"
              stroke="#183858"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      )}

      {/* overlay gradient (always on top of image) */}
      <div className={styles.imgOverlay} aria-hidden="true" />
    </div>
  );
};

/* ════════════════════════════════════════
   FEATURED CARD (large, horizontal)
════════════════════════════════════════ */
const FeaturedCard = ({
  item,
  revealed,
}: {
  item: WorkItem;
  revealed: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [imgScale, setImgScale] = useState(false);

  return (
    <article
      className={`${styles.featuredCard} ${revealed ? styles.cardRevealed : ""} relative overflow-hidden`}
      onMouseEnter={() => {
        setHovered(true);
        setImgScale(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setImgScale(false);
      }}
      aria-label={`Featured work: ${item.title}`}
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* card glow */}
      <div
        className={styles.featuredGlow}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* top scan */}
      <div
        className={`${styles.cardScanTop} ${hovered ? styles.cardScanTopActive : ""}`}
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] h-full">
        {/* LEFT: content */}
        <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10 gap-6 relative z-10">
          {/* header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[9px] tracking-[0.25em] uppercase"
                  style={{ color: "#30C0C0", opacity: 0.7 }}
                >
                  {item.index}
                </span>
                <div className={styles.featuredBadge}>
                  <TealDot size={4} pulse />
                  <span
                    className="font-mono text-[8.5px] tracking-[0.2em] uppercase"
                    style={{ color: "#30C0C0" }}
                  >
                    {item.tag}
                  </span>
                </div>
              </div>
              <span
                className="font-mono text-[9px] tracking-[0.18em]"
                style={{ color: "#1E3848" }}
              >
                {item.year}
              </span>
            </div>

            <h3
              className="font-mono leading-tight"
              style={{
                fontSize: "clamp(20px, 3vw, 32px)",
                color: hovered ? "#C8E8F0" : "#8AAABB",
                letterSpacing: "-0.01em",
                transition: "color 0.3s",
              }}
            >
              {item.title}
            </h3>

            <span
              className="font-mono text-[9.5px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4058" }}
            >
              {item.category}
            </span>

            <p
              className="font-mono text-[12px] leading-relaxed"
              style={{
                color: "#2A5060",
                letterSpacing: "0.03em",
                maxWidth: 420,
              }}
            >
              {item.description}
            </p>
          </div>

          {/* metrics */}
          <div
            className="flex flex-wrap gap-3"
            role="list"
            aria-label="Project metrics"
          >
            {item.metrics.map((m) => (
              <div
                key={m.label}
                role="listitem"
                className={`${styles.metricChip} relative flex items-center gap-2 px-3 py-1.5`}
              >
                <Bracket pos="tl" />
                <Bracket pos="br" />
                <span
                  className="font-mono text-[12px] font-semibold"
                  style={{ color: "#60C8D0", letterSpacing: "-0.01em" }}
                >
                  {m.value}
                </span>
                <span
                  className="font-mono text-[8.5px] tracking-[0.14em] uppercase"
                  style={{ color: "#1E4058" }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* footer row */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* tech tags */}
            <div
              className="flex flex-wrap gap-1.5"
              aria-label="Technologies used"
            >
              {item.tech.map((t) => (
                <span key={t} className={styles.techTag}>
                  {t}
                </span>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#"
              className={`${styles.ctaLink} relative flex items-center gap-2`}
              aria-label={`View case study for ${item.title}`}
            >
              <Bracket pos="tl" />
              <Bracket pos="br" />
              <span
                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "#7ABFCF" }}
              >
                Case Study
              </span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-3 h-3"
                aria-hidden="true"
              >
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

        {/* RIGHT: image */}
        <div className={`${styles.featuredImgPane} relative overflow-hidden`}>
          <div
            className={`${styles.imgScaleWrap} ${imgScale ? styles.imgScaleActive : ""}`}
          >
            <ProgressiveImage
              src={item.imageUrl}
              fallback={item.imageFallback}
              alt={item.title}
              className="w-full h-full"
            />
          </div>

          {/* left edge fade */}
          <div className={styles.featuredImgFadeLeft} aria-hidden="true" />
          {/* top edge fade */}
          <div className={styles.featuredImgFadeTop} aria-hidden="true" />

          {/* image corner labels */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
            <TealDot size={4} />
            <span
              className="font-mono text-[8px] tracking-[0.18em] uppercase"
              style={{ color: "#2A5868" }}
            >
              Visual
            </span>
          </div>
          <div
            className="absolute bottom-3 right-3 font-mono text-[8px] tracking-[0.15em] z-20"
            style={{ color: "#1A3848" }}
          >
            {item.index} / {String(WORK_ITEMS.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </article>
  );
};

/* ════════════════════════════════════════
   GRID CARD (smaller)
════════════════════════════════════════ */
const GridCard = ({
  item,
  revealed,
  index,
}: {
  item: WorkItem;
  revealed: boolean;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`${styles.gridCard} ${revealed ? styles.cardRevealed : ""} relative flex flex-col overflow-hidden`}
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Work: ${item.title}`}
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />

      {/* card glow */}
      <div
        className={styles.gridGlow}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* top scan */}
      <div
        className={`${styles.cardScanTop} ${hovered ? styles.cardScanTopActive : ""}`}
        aria-hidden="true"
      />

      {/* ── IMAGE PANE ── */}
      <div className={`${styles.gridImgPane} relative overflow-hidden`}>
        <div
          className={`${styles.imgScaleWrap} ${hovered ? styles.imgScaleActive : ""}`}
        >
          <ProgressiveImage
            src={item.imageUrl}
            fallback={item.imageFallback}
            alt={item.title}
            className="w-full h-full"
          />
        </div>

        {/* image overlays */}
        <div className={styles.gridImgFadeBottom} aria-hidden="true" />

        {/* floating tag */}
        <div className="absolute top-3 left-3 z-20">
          <div className={`${styles.floatingTag} flex items-center gap-1.5`}>
            <TealDot size={3} color={hovered ? "#30C0C0" : "#183848"} />
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
        </div>

        {/* year */}
        <div className="absolute top-3 right-3 z-20">
          <span
            className="font-mono text-[8px] tracking-[0.15em]"
            style={{ color: "#1A3848" }}
          >
            {item.year}
          </span>
        </div>

        {/* index overlay bottom-left */}
        <div className="absolute bottom-3 left-3 z-20">
          <span
            className="font-mono text-[9px] tracking-[0.12em]"
            style={{ color: "#1E4058" }}
          >
            {item.index}
          </span>
        </div>

        {/* hover: expand icon */}
        <div
          className={`${styles.gridExpandIcon} absolute inset-0 z-20 flex items-center justify-center`}
          style={{ opacity: hovered ? 1 : 0 }}
          aria-hidden="true"
        >
          <div className={styles.gridExpandCircle}>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="#30C0C0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span
              className="font-mono text-[8.5px] tracking-[0.22em] uppercase"
              style={{ color: "#1A3848" }}
            >
              {item.category}
            </span>
            <h3
              className="font-mono text-[13px] leading-snug"
              style={{
                color: hovered ? "#C0E0E8" : "#3A6878",
                letterSpacing: "0.04em",
                transition: "color 0.3s",
              }}
            >
              {item.title}
            </h3>
          </div>
        </div>

        <p
          className="font-mono text-[10.5px] leading-relaxed"
          style={{ color: "#1E3848", letterSpacing: "0.02em" }}
        >
          {item.description.length > 100
            ? item.description.slice(0, 100) + "…"
            : item.description}
        </p>

        {/* key metric highlight */}
        <div
          className="flex items-center gap-2 mt-auto pt-2"
          style={{ borderTop: "1px solid #0C1A28" }}
        >
          <span
            className="font-mono text-[13px] font-semibold"
            style={{ color: "#50C8D0", letterSpacing: "-0.01em" }}
          >
            {item.metrics[0].value}
          </span>
          <span
            className="font-mono text-[8.5px] tracking-[0.14em] uppercase"
            style={{ color: "#1A3848" }}
          >
            {item.metrics[0].label}
          </span>
        </div>

        {/* tech + cta */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {item.tech.slice(0, 2).map((t) => (
              <span key={t} className={styles.techTagSm}>
                {t}
              </span>
            ))}
          </div>
          <a
            href="#"
            className={`${styles.gridCta} flex items-center gap-1.5`}
            aria-label={`View ${item.title}`}
          >
            <span
              className="font-mono text-[9px] tracking-[0.18em] uppercase"
              style={{
                color: hovered ? "#30C0C0" : "#1E4058",
                transition: "color 0.25s",
              }}
            >
              View
            </span>
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="w-2.5 h-2.5"
              aria-hidden="true"
            >
              <path
                d="M2 6h8M6 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  color: hovered ? "#30C0C0" : "#1E4058",
                  transition: "color 0.25s",
                }}
              />
            </svg>
          </a>
        </div>
      </div>

      {/* bottom line */}
      <div className={styles.cardBottomLine} aria-hidden="true" />
    </article>
  );
};

/* ════════════════════════════════════════
   FILTER BAR
════════════════════════════════════════ */
const FilterBar = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (f: string) => void;
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={barRef}
      className={`${styles.filterBar} flex items-center gap-1 overflow-x-auto`}
      role="tablist"
      aria-label="Filter work by category"
    >
      {FILTERS.map((f) => (
        <button
          key={f}
          role="tab"
          aria-selected={active === f}
          className={`${styles.filterBtn} ${active === f ? styles.filterBtnActive : ""}`}
          onClick={() => onChange(f)}
        >
          {active === f && (
            <span
              className="w-1 h-1 rounded-full shrink-0"
              style={{ background: "#30C0C0", boxShadow: "0 0 6px #30C0C0" }}
              aria-hidden="true"
            />
          )}
          <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase whitespace-nowrap">
            {f}
          </span>
        </button>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Work() {
  const [filter, setFilter] = useState("All");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filtered =
    filter === "All"
      ? WORK_ITEMS
      : WORK_ITEMS.filter((w) => w.category === filter);

  const featured = filtered.find((w) => w.featured);
  const grid = filtered.filter((w) => !w.featured);

  /* intersection reveal */
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
        { threshold: 0.12 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [filtered]);

  const setRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(id, el);
    },
    [],
  );

  return (
    <section
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="work-heading"
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
          <SectionLabel>Selected work</SectionLabel>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              id="work-heading"
              className="font-mono leading-tight max-w-2xl"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              Built for scale,
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 32px rgba(48,192,192,0.4)",
                }}
              >
                shipped with precision.
              </span>
            </h2>

            <div className="flex flex-col gap-2 lg:items-end">
              <p
                className="font-mono text-[12px] leading-relaxed max-w-xs lg:text-right"
                style={{ color: "#2E5868", letterSpacing: "0.04em" }}
              >
                A selection of infrastructure and platform projects delivered
                for high-scale teams.
              </p>
              <div className="flex items-center gap-2">
                <TealDot size={4} />
                <span
                  className="font-mono text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: "#1A3848" }}
                >
                  {WORK_ITEMS.length} projects · {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ FILTER BAR ══ */}
        <div className="mb-10 sm:mb-12">
          <FilterBar active={filter} onChange={setFilter} />
        </div>

        {/* ══ FEATURED CARD ══ */}
        {featured && (
          <div ref={setRef(featured.id)} className="mb-5">
            <FeaturedCard
              item={featured}
              revealed={revealed.has(featured.id)}
            />
          </div>
        )}

        {/* ══ GRID CARDS ══ */}
        {grid.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label="Work examples"
          >
            {grid.map((item, i) => (
              <div key={item.id} role="listitem" ref={setRef(item.id)}>
                <GridCard
                  item={item}
                  revealed={revealed.has(item.id)}
                  index={i}
                />
              </div>
            ))}
          </div>
        )}

        {/* empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className={styles.emptyOrb} aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#183858"
                  strokeWidth="0.6"
                  strokeDasharray="2 5"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="18"
                  fill="none"
                  stroke="#1A4060"
                  strokeWidth="0.5"
                />
                <circle cx="40" cy="40" r="6" fill="#183858" />
              </svg>
            </div>
            <p
              className="font-mono text-[11px] tracking-[0.18em] uppercase"
              style={{ color: "#1A3848" }}
            >
              No projects in this category
            </p>
            <button
              className={styles.filterBtn}
              onClick={() => setFilter("All")}
            >
              <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase">
                Clear filter
              </span>
            </button>
          </div>
        )}

        {/* ══ BOTTOM STRIP ══ */}
        <div className={`${styles.bottomStrip} mt-16 sm:mt-20`}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              All work delivered on schedule
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              NDA-friendly on request
            </span>
            <TealDot size={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
