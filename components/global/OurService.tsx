// components/services-overview/ServicesOverview.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ServicesOverview.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface ServiceCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  tag: string;
}

/* ════════════════════════════════════════
   ICONS
════════════════════════════════════════ */
const WebDesignIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    <path d="M6 7h12M6 11h8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SEOIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    <path d="M11 8v6M8 11h6" strokeLinecap="round" />
    <path d="M9 3l2 2 2-2M3 9l2 2-2 2" strokeLinecap="round" />
  </svg>
);

const AIIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2a3 3 0 0 1 3 3c0 1.2-.6 2.3-1.5 2.9v1.1h-3V7.9A3 3 0 0 1 12 2Z" />
    <rect x="9" y="9" width="6" height="4" rx="1" />
    <circle cx="12" cy="18" r="2" />
    <path
      d="M12 13v3M6 6l1.5 1.5M18 6l-1.5 1.5M6 12H4M20 12h-2"
      strokeLinecap="round"
    />
  </svg>
);

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */
const SERVICES: ServiceCard[] = [
  {
    id: "web-design",
    icon: <WebDesignIcon />,
    title: "Web Design & Development",
    subtitle: "Custom Websites Built to Convert",
    description:
      "We design modern, fast, and responsive websites with premium UI/UX, optimized for sales, lead generation, and brand authority.",
    features: [
      "Custom UI/UX Design",
      "Mobile-First Development",
      "Landing Pages + Full Websites",
      "Fast Performance & Clean Code",
    ],
    tag: "DESIGN",
  },
  {
    id: "seo",
    icon: <SEOIcon />,
    title: "SEO & Google Growth",
    subtitle: "SEO That Drives Real Traffic",
    description:
      "We don't do basic SEO. We build complete SEO systems that rank your business and bring customers consistently.",
    features: [
      "Technical SEO Setup",
      "On-Page Optimization",
      "Content Strategy",
      "Local SEO & Google Maps Growth",
      "Monthly Reporting",
    ],
    tag: "GROWTH",
  },
  {
    id: "ai-automation",
    icon: <AIIcon />,
    title: "AI Website Automation",
    subtitle: "Smart Websites With Custom AI Tools",
    description:
      "We create AI-powered tools that automate your website processes such as lead handling, customer support, booking systems, and business analysis.",
    features: [
      "AI Chatbots & Smart Assistants",
      "Automated Lead Qualification",
      "AI Content Generation",
      "AI Dashboards for Business Insights",
      "Workflow Automation Tools",
    ],
    tag: "AI",
  },
];

/* ════════════════════════════════════════
   ATOMS
════════════════════════════════════════ */
const TealDot = ({
  size = 6,
  pulse = false,
}: {
  size?: number;
  pulse?: boolean;
}) => (
  <span
    className="relative inline-flex shrink-0"
    style={{ width: size, height: size }}
  >
    {pulse && (
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "#30C0C044",
          animation: "ping 2s cubic-bezier(0,0,.2,1) infinite",
        }}
      />
    )}
    <span
      className="relative rounded-full block"
      style={{
        width: size,
        height: size,
        background: "#30C0C0",
        boxShadow: `0 0 ${size + 2}px #30C0C0, 0 0 ${size * 3}px #30C0C044`,
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
   SERVICE CARD COMPONENT
════════════════════════════════════════ */
const ServiceCardComponent = ({
  service,
  index,
}: {
  service: ServiceCard;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), index * 100);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`${styles.serviceCard} ${revealed ? styles.revealed : ""} relative`}
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
      <div className="flex items-center justify-between mb-4">
        <div className={styles.tagBadge}>
          <TealDot size={3} color={hovered ? "#30C0C0" : "#1A3848"} />
          <span
            className="font-mono text-[7.5px] tracking-[0.2em] uppercase"
            style={{
              color: hovered ? "#30C0C0" : "#1A3848",
              transition: "color 0.3s",
            }}
          >
            {service.tag}
          </span>
        </div>
        <span
          className="font-mono text-[8px] tracking-[0.15em]"
          style={{ color: "#1A3848" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Icon + Title Section */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon */}
        <div className={styles.iconBox}>
          <div
            className={styles.iconInner}
            style={{
              color: hovered ? "#60E8E8" : "#30C0C0",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {service.icon}
          </div>
          <Bracket pos="tl" />
          <Bracket pos="br" />
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span
            className="font-mono text-[11px] tracking-[0.12em] uppercase"
            style={{
              color: hovered ? "#70E8E8" : "#2A5060",
              transition: "color 0.3s",
            }}
          >
            {service.subtitle}
          </span>
          <h3
            className="font-mono text-[16px] font-semibold leading-tight"
            style={{
              color: hovered ? "#C0E0E8" : "#5A8898",
              letterSpacing: "0.01em",
              transition: "color 0.3s",
            }}
          >
            {service.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p
        className="font-mono text-[12px] leading-relaxed mb-4"
        style={{
          color: "#3A6070",
          letterSpacing: "0.01em",
        }}
      >
        {service.description}
      </p>

      {/* Divider */}
      <div className={styles.featureDivider}>
        <div className={styles.dividerLine} />
        <TealDot size={4} />
        <div className={styles.dividerLine} />
      </div>

      {/* Features List */}
      <ul className="list-none p-0 m-0 flex flex-col gap-2.5 mt-4">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0"
              style={{
                color: hovered ? "#50C8D0" : "#1E4058",
                transition: "color 0.3s",
              }}
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
              className="font-mono text-[11px] leading-snug"
              style={{
                color: hovered ? "#7ABFCF" : "#2A5060",
                letterSpacing: "0.01em",
                transition: "color 0.3s",
              }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Bottom line */}
      <div className={styles.cardBottomLine} aria-hidden="true" />
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ServicesOverview() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="services-heading"
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
        <div className="flex flex-col gap-4 mb-10 sm:mb-14">
          <SectionLabel>Our Services</SectionLabel>

          <div className="flex flex-col gap-5">
            <h2
              id="services-heading"
              className="font-mono leading-tight max-w-3xl"
              style={{
                fontSize: "clamp(22px, 3.5vw, 38px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              Everything You Need to Build, Rank,
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 28px rgba(48,192,192,0.4)",
                }}
              >
                and Automate Your Business Online
              </span>
            </h2>

            <p
              className="font-mono text-[13px] leading-relaxed max-w-2xl"
              style={{
                color: "#3A6070",
                letterSpacing: "0.01em",
              }}
            >
              Our agency combines modern web development, advanced SEO
              strategies, and AI-powered automation to create websites that
              generate leads, build trust, and scale your business faster than
              traditional web design.
            </p>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ SERVICES GRID ══ */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10 sm:mb-12"
          role="list"
          aria-label="Our services"
        >
          {SERVICES.map((service, i) => (
            <div key={service.id} role="listitem">
              <ServiceCardComponent service={service} index={i} />
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

        {/* ══ BOTTOM STRIP ══ */}
        <div className={styles.bottomStrip}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Want to explore our complete service offerings?
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <a
            href="#services"
            className={`${styles.ctaLink} relative flex items-center gap-2`}
          >
            <Bracket pos="tl" />
            <Bracket pos="br" />
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "#7ABFCF" }}
            >
              View All Services
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
