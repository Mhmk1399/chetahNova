// components/portfolio/PortfolioPreview.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback, JSX } from "react";
import styles from "./PortfolioPreview.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface Project {
  id: string;
  index: string;
  title: string;
  industry: string;
  thumbnail: string;
  services: string[];
  result: string;
  resultLabel: string;
  description: string;
  tags: string[];
  year: string;
}

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */
const PROJECTS: Project[] = [
  {
    id: "proj1",
    index: "01",
    title: "LuxeHome Realty",
    industry: "Real Estate",
    thumbnail: "/portfolio/realestate.jpg",
    services: ["Web Design", "SEO", "AI Chatbot"],
    result: "+340%",
    resultLabel: "Lead Growth",
    description:
      "Complete digital transformation with custom property listing system and AI-powered lead qualification.",
    tags: ["DESIGN", "SEO", "AI"],
    year: "2024",
  },
  {
    id: "proj2",
    index: "02",
    title: "TechFlow SaaS",
    industry: "SaaS / Technology",
    thumbnail: "/portfolio/saas.jpg",
    services: ["UI/UX Design", "Development", "Analytics"],
    result: "2.5x",
    resultLabel: "Conversion Rate",
    description:
      "Modern SaaS dashboard redesign with optimized user flows and integrated analytics tracking.",
    tags: ["DESIGN", "DEV"],
    year: "2024",
  },
  {
    id: "proj3",
    index: "03",
    title: "UrbanStyle Shop",
    industry: "E-commerce",
    thumbnail: "/portfolio/ecommerce.jpg",
    services: ["E-commerce", "SEO", "AI Recommendations"],
    result: "+180%",
    resultLabel: "Revenue",
    description:
      "High-converting online store with personalized AI product recommendations and SEO optimization.",
    tags: ["ECOM", "SEO", "AI"],
    year: "2023",
  },
  {
    id: "proj4",
    index: "04",
    title: "MedCare Clinic",
    industry: "Healthcare",
    thumbnail: "/portfolio/healthcare.jpg",
    services: ["Web Design", "Booking System", "Local SEO"],
    result: "+95%",
    resultLabel: "Bookings",
    description:
      "Patient-focused healthcare website with AI appointment scheduling and Google Maps optimization.",
    tags: ["DESIGN", "AI", "SEO"],
    year: "2024",
  },
  {
    id: "proj5",
    index: "05",
    title: "GreenBuild Construction",
    industry: "Construction",
    thumbnail: "/portfolio/construction.jpg",
    services: ["Brand Design", "SEO", "Lead Gen"],
    result: "#1",
    resultLabel: "Local Ranking",
    description:
      "Authority-building website with project showcases and automated contractor lead generation.",
    tags: ["DESIGN", "SEO"],
    year: "2023",
  },
  {
    id: "proj6",
    index: "06",
    title: "FinanceFirst Advisory",
    industry: "Finance",
    thumbnail: "/portfolio/finance.jpg",
    services: ["Web App", "Dashboard", "AI Insights"],
    result: "60%",
    resultLabel: "Time Saved",
    description:
      "Secure financial advisory platform with AI-powered market insights and client portals.",
    tags: ["DEV", "AI"],
    year: "2024",
  },
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
   THUMBNAIL PLACEHOLDER
════════════════════════════════════════ */
const ThumbnailPlaceholder = ({ industry }: { industry: string }) => {
  // Generate a simple visual pattern based on industry
  const patterns: Record<string, JSX.Element> = {
    "Real Estate": (
      <>
        <rect
          x="20"
          y="35"
          width="60"
          height="40"
          rx="2"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <rect
          x="30"
          y="45"
          width="15"
          height="20"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
        <rect
          x="55"
          y="45"
          width="15"
          height="20"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M20 35 L50 20 L80 35"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
      </>
    ),
    "SaaS / Technology": (
      <>
        <rect
          x="15"
          y="30"
          width="70"
          height="45"
          rx="3"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <line
          x1="15"
          y1="40"
          x2="85"
          y2="40"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <circle
          cx="25"
          cy="55"
          r="8"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
        <rect
          x="40"
          y="50"
          width="35"
          height="3"
          rx="1"
          fill="currentColor"
          opacity="0.2"
        />
        <rect
          x="40"
          y="58"
          width="25"
          height="3"
          rx="1"
          fill="currentColor"
          opacity="0.15"
        />
        <rect
          x="40"
          y="66"
          width="30"
          height="3"
          rx="1"
          fill="currentColor"
          opacity="0.1"
        />
      </>
    ),
    "E-commerce": (
      <>
        <rect
          x="25"
          y="25"
          width="25"
          height="30"
          rx="2"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          opacity="0.4"
        />
        <rect
          x="55"
          y="25"
          width="25"
          height="30"
          rx="2"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          opacity="0.3"
        />
        <rect
          x="25"
          y="60"
          width="25"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
        <rect
          x="55"
          y="60"
          width="25"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
        <circle
          cx="50"
          cy="82"
          r="6"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
      </>
    ),
    Healthcare: (
      <>
        <circle
          cx="50"
          cy="45"
          r="20"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M50 32 L50 58 M37 45 L63 45"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.5"
        />
        <rect
          x="25"
          y="70"
          width="50"
          height="8"
          rx="2"
          fill="currentColor"
          opacity="0.15"
        />
      </>
    ),
    Construction: (
      <>
        <path
          d="M20 75 L50 30 L80 75 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <rect
          x="40"
          y="55"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M30 75 L30 55 L45 40"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <circle
          cx="70"
          cy="35"
          r="8"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
      </>
    ),
    Finance: (
      <>
        <path
          d="M20 70 L35 50 L50 60 L65 35 L80 45"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <circle cx="20" cy="70" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="35" cy="50" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="50" cy="60" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="65" cy="35" r="2" fill="currentColor" opacity="0.4" />
        <circle cx="80" cy="45" r="2" fill="currentColor" opacity="0.4" />
        <rect
          x="25"
          y="75"
          width="50"
          height="4"
          rx="1"
          fill="currentColor"
          opacity="0.15"
        />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 100 100" className={styles.thumbnailSvg}>
      <defs>
        <linearGradient id="thumbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1624" />
          <stop offset="100%" stopColor="#0c1828" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#thumbGrad)" />
      <g style={{ color: "#30C0C0" }}>
        {patterns[industry] || patterns["SaaS / Technology"]}
      </g>
    </svg>
  );
};

/* ════════════════════════════════════════
   SERVICE TAG
════════════════════════════════════════ */
const ServiceTag = ({ tag }: { tag: string }) => {
  const colors: Record<string, string> = {
    DESIGN: "#30C0C0",
    SEO: "#30A090",
    AI: "#3090C0",
    DEV: "#3070A0",
    ECOM: "#30B0A0",
  };

  return (
    <span
      className={styles.serviceTag}
      style={{
        borderColor: `${colors[tag] || "#30C0C0"}44`,
        color: colors[tag] || "#30C0C0",
      }}
    >
      {tag}
    </span>
  );
};

/* ════════════════════════════════════════
   PROJECT CARD
════════════════════════════════════════ */
const ProjectCard = ({
  project,
  revealed,
  index,
}: {
  project: Project;
  revealed: boolean;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`${styles.projectCard} ${revealed ? styles.cardRevealed : ""} relative`}
      style={{ transitionDelay: `${index * 80}ms` }}
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

      {/* THUMBNAIL SECTION */}
      <div className={styles.thumbnailWrapper}>
        <ThumbnailPlaceholder industry={project.industry} />

        {/* Overlay on hover */}
        <div
          className={styles.thumbnailOverlay}
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div className={styles.overlayContent}>
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase"
              style={{ color: "#30C0C0" }}
            >
              {project.year}
            </span>
            <span
              className="font-mono text-[11px]"
              style={{ color: "#B8D8E4" }}
            >
              View Details
            </span>
          </div>
        </div>

        {/* Index badge */}
        <div className={styles.indexBadge}>
          <span
            className="font-mono text-[9px] tracking-widest"
            style={{ color: "#1A3848" }}
          >
            {project.index}
          </span>
        </div>

        {/* Result badge */}
        <div
          className={styles.resultBadge}
          style={{
            transform: hovered ? "translateY(0)" : "translateY(-10px)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <Bracket pos="tl" />
          <Bracket pos="br" />
          <span
            className="font-mono font-bold"
            style={{
              fontSize: "14px",
              color: "#60E8E8",
              letterSpacing: "-0.01em",
            }}
          >
            {project.result}
          </span>
          <span
            className="font-mono text-[7px] tracking-[0.15em] uppercase"
            style={{ color: "#2A5868" }}
          >
            {project.resultLabel}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className={styles.cardContent}>
        {/* Industry & Services row */}
        <div className="flex items-center justify-between mb-3">
          <div className={styles.industryBadge}>
            <TealDot size={3} color={hovered ? "#30C0C0" : "#1A3848"} />
            <span
              className="font-mono text-[8px] tracking-[0.18em] uppercase"
              style={{
                color: hovered ? "#30C0C0" : "#1A3848",
                transition: "color 0.3s",
              }}
            >
              {project.industry}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-mono font-semibold leading-tight mb-2"
          style={{
            fontSize: "clamp(14px, 1.8vw, 17px)",
            color: hovered ? "#C8E8F0" : "#5A8898",
            letterSpacing: "0.02em",
            transition: "color 0.3s",
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="font-mono text-[11px] leading-relaxed mb-3"
          style={{ color: "#3A6070", letterSpacing: "0.02em" }}
        >
          {project.description}
        </p>

        {/* Service Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <ServiceTag key={tag} tag={tag} />
          ))}
        </div>

        {/* Divider */}
        <div className={styles.cardDivider}>
          <div className={styles.dividerLine} />
          <TealDot size={3} />
          <div className={styles.dividerLine} />
        </div>

        {/* CTA Button */}
        <a href={`#case-study-${project.id}`} className={styles.cardCta}>
          <span
            className="font-mono text-[9px] tracking-[0.15em] uppercase"
            style={{ color: "#7ABFCF" }}
          >
            View Case Study
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

      {/* Bottom line */}
      <div className={styles.cardBottomLine} aria-hidden="true" />
    </article>
  );
};

/* ════════════════════════════════════════
   STATS ROW
════════════════════════════════════════ */
const StatsRow = () => {
  const stats = [
    { value: "150+", label: "Projects Delivered" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "12", label: "Industries Served" },
  ];

  return (
    <div className={styles.statsRow}>
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          <div className={`${styles.statItem} relative`}>
            <Bracket pos="tl" />
            <Bracket pos="br" />
            <span
              className="font-mono font-bold"
              style={{
                fontSize: "clamp(18px, 2.5vw, 26px)",
                color: "#60C8D0",
                letterSpacing: "-0.02em",
              }}
            >
              {stat.value}
            </span>
            <span
              className="font-mono text-[8px] tracking-[0.18em] uppercase"
              style={{ color: "#1E4058" }}
            >
              {stat.label}
            </span>
          </div>
          {i < stats.length - 1 && <div className={styles.statSeparator} />}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function PortfolioPreview() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const cards = cardRefs.current;
    const observers: IntersectionObserver[] = [];

    cards.forEach((el, id) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => new Set([...prev, id]));
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
      aria-labelledby="portfolio-heading"
    >
      {/* Background layers */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        {/* ══ HEADER ══ */}
        <div className="flex flex-col gap-5 mb-12 sm:mb-16">
          <SectionLabel>Portfolio</SectionLabel>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex flex-col gap-4 max-w-2xl">
              <h2
                id="portfolio-heading"
                className="font-mono leading-tight"
                style={{
                  fontSize: "clamp(26px, 4vw, 48px)",
                  color: "#B8D8E4",
                  letterSpacing: "-0.01em",
                }}
              >
                Featured Projects &
                <br />
                <span
                  style={{
                    color: "#30C0C0",
                    textShadow: "0 0 32px rgba(48,192,192,0.4)",
                  }}
                >
                  Case Studies
                </span>
              </h2>

              <p
                className="font-mono text-[12px] leading-relaxed"
                style={{ color: "#3A6070", letterSpacing: "0.03em" }}
              >
                Here are a few examples of our work, including high-performance
                websites, SEO growth campaigns, and AI automation systems built
                for businesses.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <TealDot size={4} />
              <span
                className="font-mono text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "#1A3848" }}
              >
                Selected Work · {new Date().getFullYear()}
              </span>
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ STATS ROW ══ */}
        <StatsRow />

        {/* ══ DIVIDER ══ */}
        <div className={styles.sectionDivider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerNode}>
            <TealDot size={6} pulse />
          </div>
          <div className={styles.dividerLine} />
        </div>

        {/* ══ PROJECTS GRID ══ */}
        <div
          className={styles.projectsGrid}
          role="list"
          aria-label="Featured projects"
        >
          {PROJECTS.map((project, i) => (
            <div key={project.id} role="listitem" ref={setRef(project.id)}>
              <ProjectCard
                project={project}
                index={i}
                revealed={revealed.has(project.id)}
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
              Want to see more of our work?
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <a
            href="#portfolio"
            className={`${styles.ctaLink} relative flex items-center gap-2`}
          >
            <Bracket pos="tl" />
            <Bracket pos="br" />
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "#7ABFCF" }}
            >
              View Full Portfolio
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

        {/* ══ TRUST INDICATORS ══ */}
        <div className={styles.trustRow}>
          {["All industries", "Custom solutions", "Measurable results"].map(
            (text, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-3.5 h-3.5"
                  style={{ color: "#30C0C0" }}
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <path
                    d="M5.5 8L7 9.5L10.5 6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="font-mono text-[8px] tracking-[0.15em] uppercase"
                  style={{ color: "#2A5868" }}
                >
                  {text}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
