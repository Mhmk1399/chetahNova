// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/CoreValuesSection.tsx
// PURPOSE: Core values section with interconnected node network design
// VERSION: 2.4.1
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useRef, useEffect, useCallback, memo, type RefObject, JSX } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  background: "#0B0F19",
  success: "#10B981",
  surface: "#0F1420",
} as const;

const OPACITY = {
  body: 0.6,
  caption: 0.4,
  decorative: 0.06,
  grid: 0.015,
  glassBg: 0.025,
  cardBg: 0.04,
  connectionLine: 0.15,
  nodeGlow: 0.3,
} as const;

const ANIMATION = {
  entranceDuration: 0.6,
  staggerDelay: 0.1,
  cardStagger: 0.12,
  lineDrawDuration: 1.2,
  pulseInterval: 3,
  scanLineDuration: 8,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_CONTENT = {
  systemLabel: "SYS::CORE_PRINCIPLES",
  eyebrow: "Brand Identity",
  title: "Our Core Values",
  intro:
    "Every project we build is guided by clear principles. These values define how we work, how we communicate, and what we deliver.",
  values: [
    {
      id: "results",
      number: "01",
      title: "Results Over Design Trends",
      description:
        'We create websites that generate real business growth, not just "nice-looking" pages.',
      icon: "target",
      color: COLORS.primary,
      connections: ["transparency", "performance"],
    },
    {
      id: "transparency",
      number: "02",
      title: "Transparency & Honest Communication",
      description:
        "We believe strong partnerships are built through clarity, reporting, and direct communication.",
      icon: "eye",
      color: COLORS.secondary,
      connections: ["client-success"],
    },
    {
      id: "performance",
      number: "03",
      title: "Performance Matters",
      description:
        "Speed, mobile optimization, and technical quality are essential for SEO and user experience.",
      icon: "gauge",
      color: COLORS.primary,
      connections: ["innovation"],
    },
    {
      id: "innovation",
      number: "04",
      title: "Innovation Through AI",
      description:
        "We stay ahead by integrating AI tools that improve productivity and automation for our clients.",
      icon: "cpu",
      color: COLORS.accent,
      connections: ["long-term"],
    },
    {
      id: "long-term",
      number: "05",
      title: "Long-Term Growth Mindset",
      description:
        "We build systems that scale and improve over time, not short-term solutions.",
      icon: "trending",
      color: COLORS.secondary,
      connections: ["client-success"],
    },
    {
      id: "client-success",
      number: "06",
      title: "Client Success is Our Reputation",
      description:
        "Your results are the proof of our work. We treat every project as if it's our own business.",
      icon: "trophy",
      color: COLORS.primary,
      connections: [],
    },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface CoreValuesSectionProps {
  id?: string;
}

interface ValueCardProps {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  nodeRef: (el: HTMLDivElement | null) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ICON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Icons: Record<string, () => JSX.Element> = {
  target: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  eye: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  gauge: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  cpu: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" />
      <rect x="9" y="9" width="6" height="6" fill="currentColor" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  trending: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trophy: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const generateDiagonalGrid = (): string => `
  linear-gradient(45deg, rgba(255,255,255,${OPACITY.grid}) 1px, transparent 1px),
  linear-gradient(-45deg, rgba(255,255,255,${OPACITY.grid}) 1px, transparent 1px)
`;

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DiagonalGrid - Unique diagonal grid pattern
 */
const DiagonalGrid = memo(function DiagonalGrid(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: generateDiagonalGrid(),
        backgroundSize: "60px 60px",
      }}
    />
  );
});

/**
 * ScanLine - Horizontal scanning line effect
 */
const ScanLine = memo(function ScanLine({
  scanRef,
}: {
  scanRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  return (
    <div
      ref={scanRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0 h-px will-change-transform"
      style={{
        background: `linear-gradient(90deg, transparent, ${COLORS.secondary}30, ${COLORS.secondary}60, ${COLORS.secondary}30, transparent)`,
        boxShadow: `0 0 20px ${COLORS.secondary}40`,
        top: 0,
      }}
    />
  );
});

/**
 * ConnectionLines - SVG lines connecting value nodes
 */
const ConnectionLines = memo(function ConnectionLines({
  linesRef,
}: {
  linesRef: RefObject<SVGSVGElement | null>;
}): JSX.Element {
  return (
    <svg
      ref={linesRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    >
      <defs>
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0" />
          <stop offset="50%" stopColor={COLORS.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.secondary} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.secondary} stopOpacity="0" />
          <stop offset="50%" stopColor={COLORS.accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={COLORS.secondary} stopOpacity="0" />
        </linearGradient>
        {/* Animated pulse filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection paths - these will be animated */}
      <g className="connection-lines" strokeWidth="1" fill="none">
        {/* Row 1 horizontal connections */}
        <path
          d="M 16.66% 25% H 50%"
          stroke="url(#lineGradient1)"
          strokeDasharray="4 4"
          className="connection-path"
        />
        <path
          d="M 50% 25% H 83.33%"
          stroke="url(#lineGradient1)"
          strokeDasharray="4 4"
          className="connection-path"
        />

        {/* Row 2 horizontal connections */}
        <path
          d="M 16.66% 75% H 50%"
          stroke="url(#lineGradient2)"
          strokeDasharray="4 4"
          className="connection-path"
        />
        <path
          d="M 50% 75% H 83.33%"
          stroke="url(#lineGradient2)"
          strokeDasharray="4 4"
          className="connection-path"
        />

        {/* Vertical connections */}
        <path
          d="M 16.66% 25% V 75%"
          stroke="url(#lineGradient2)"
          strokeDasharray="4 4"
          className="connection-path"
        />
        <path
          d="M 83.33% 25% V 75%"
          stroke="url(#lineGradient1)"
          strokeDasharray="4 4"
          className="connection-path"
        />

        {/* Diagonal connections */}
        <path
          d="M 50% 25% L 16.66% 75%"
          stroke="url(#lineGradient2)"
          strokeDasharray="4 4"
          className="connection-path"
        />
        <path
          d="M 50% 25% L 83.33% 75%"
          stroke="url(#lineGradient1)"
          strokeDasharray="4 4"
          className="connection-path"
        />
      </g>
    </svg>
  );
});

/**
 * CentralNode - Pulsing center point of the network
 */
const CentralNode = memo(function CentralNode({
  nodeRef,
}: {
  nodeRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {/* Outer ring */}
      <div
        className="absolute -inset-8 animate-ping opacity-20"
        style={{
          border: `1px solid ${COLORS.accent}`,
        }}
      />
      {/* Middle ring */}
      <div
        className="absolute -inset-4"
        style={{
          border: `1px solid ${COLORS.accent}40`,
        }}
      />
      {/* Core */}
      <div
        className="relative h-3 w-3"
        style={{
          backgroundColor: COLORS.accent,
          boxShadow: `0 0 30px ${COLORS.accent}80, 0 0 60px ${COLORS.accent}40`,
        }}
      />
    </div>
  );
});

/**
 * ValueCard - Individual value card with node indicator
 */
const ValueCard = memo(function ValueCard({
  number,
  title,
  description,
  icon,
  color,
  index,
  cardRef,
  nodeRef,
}: ValueCardProps): JSX.Element {
  const IconComponent = Icons[icon] || Icons.target;
  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className="group relative opacity-0 will-change-transform"
    >
      {/* Node indicator - connection point */}
      <div
        ref={nodeRef}
        aria-hidden="true"
        className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
      >
        <div
          className="h-2 w-2 will-change-transform"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}80`,
          }}
        />
        {/* Vertical connector to card */}
        <div
          className="mx-auto h-3 w-px"
          style={{
            background: `linear-gradient(180deg, ${color}, transparent)`,
          }}
        />
      </div>

      {/* Card surface */}
      <div
        className="relative overflow-hidden border transition-all duration-300 ease-out hover:-translate-y-1"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${OPACITY.cardBg})`,
          borderColor: `rgba(255, 255, 255, 0.08)`,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Top accent line */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: isEven
              ? `linear-gradient(90deg, ${color}, transparent)`
              : `linear-gradient(90deg, transparent, ${color})`,
          }}
        />

        {/* Hover glow effect */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${isEven ? "0% 0%" : "100% 0%"}, ${color}10, transparent 70%)`,
          }}
        />

        {/* Corner brackets */}
        <div aria-hidden="true" className="pointer-events-none">
          <span
            className="absolute left-2 top-2 h-3 w-3 border-l border-t transition-colors duration-300"
            style={{ borderColor: `${color}30` }}
          />
          <span
            className="absolute right-2 top-2 h-3 w-3 border-r border-t transition-colors duration-300"
            style={{ borderColor: `${color}30` }}
          />
        </div>

        {/* Content */}
        <div className="relative p-6 sm:p-8">
          {/* Header row */}
          <div className="mb-4 flex items-start justify-between">
            {/* Number badge */}
            <span
              className="font-mono text-xs tracking-widest"
              style={{ color: `${color}90` }}
            >
              {number}
            </span>
            {/* Icon */}
            <div
              className="flex h-10 w-10 items-center justify-center border transition-colors duration-300"
              style={{
                borderColor: `${color}40`,
                color: color,
              }}
            >
              <IconComponent />
            </div>
          </div>

          {/* Title */}
          <h3
            className="mb-3 text-lg font-medium text-white sm:text-xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed sm:text-base"
            style={{
              color: `rgba(255, 255, 255, ${OPACITY.body})`,
              lineHeight: 1.7,
            }}
          >
            {description}
          </p>

          {/* Bottom status bar */}
          <div aria-hidden="true" className="mt-6 flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${color}40, transparent)`,
              }}
            />
            <span
              className="font-mono text-[9px] uppercase tracking-widest"
              style={{ color: `rgba(255, 255, 255, 0.3)` }}
            >
              CORE.VALUE
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
          }}
        />
      </div>
    </div>
  );
});

/**
 * AmbientEffects - Background atmospheric elements
 */
const AmbientEffects = memo(function AmbientEffects(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Top-left glow */}
      <div
        className="absolute -left-32 -top-32 h-125 w-125"
        style={{
          background: `radial-gradient(circle, ${COLORS.primary}08 0%, transparent 70%)`,
        }}
      />
      {/* Bottom-right glow */}
      <div
        className="absolute -bottom-32 -right-32 h-125 w-125"
        style={{
          background: `radial-gradient(circle, ${COLORS.secondary}08 0%, transparent 70%)`,
        }}
      />
      {/* Center accent */}
      <div
        className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}05 0%, transparent 50%)`,
        }}
      />
    </div>
  );
});

/**
 * SystemMarkers - Atmospheric corner labels
 */
const SystemMarkers = memo(function SystemMarkers(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none font-mono text-[10px] tracking-widest text-white/10"
    >
      <span className="absolute left-4 top-4 sm:left-8 sm:top-8">
        {SECTION_CONTENT.systemLabel}
      </span>
      <span className="absolute right-4 top-4 flex items-center gap-2 sm:right-8 sm:top-8">
        <span className="h-1 w-1 animate-pulse bg-emerald-400" />
        NETWORK.ACTIVE
      </span>
      <span className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
        NODES::06
      </span>
      <span className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8">
        GRID.INTEGRITY.100%
      </span>
    </div>
  );
});

/**
 * SectionHeader - Title and intro text
 */
const SectionHeader = memo(function SectionHeader({
  headerRefs,
}: {
  headerRefs: RefObject<HTMLElement[]>;
}): JSX.Element {
  const addRef = useCallback(
    (el: HTMLElement | null) => {
      if (el && headerRefs.current && !headerRefs.current.includes(el)) {
        headerRefs.current.push(el);
      }
    },
    [headerRefs],
  );

  return (
    <div className="relative mx-auto mb-16 max-w-3xl text-center lg:mb-20">
      {/* Eyebrow */}
      <p
        ref={addRef}
        className="mb-4 font-mono text-xs uppercase opacity-0 will-change-transform"
        style={{
          color: COLORS.accent,
          letterSpacing: "0.25em",
        }}
      >
        {SECTION_CONTENT.eyebrow}
      </p>

      {/* Title */}
      <h2
        ref={addRef}
        className="mb-6 text-3xl font-semibold text-white opacity-0 will-change-transform sm:text-4xl lg:text-5xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        {SECTION_CONTENT.title}
      </h2>

      {/* Decorative divider */}
      <div
        ref={addRef}
        aria-hidden="true"
        className="mx-auto mb-6 flex items-center justify-center gap-3 opacity-0 will-change-transform"
      >
        <div
          className="h-px w-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${COLORS.primary})`,
          }}
        />
        <div
          className="h-2 w-2"
          style={{
            backgroundColor: COLORS.accent,
            boxShadow: `0 0 12px ${COLORS.accent}`,
          }}
        />
        <div
          className="h-px w-12"
          style={{
            background: `linear-gradient(90deg, ${COLORS.secondary}, transparent)`,
          }}
        />
      </div>

      {/* Intro text */}
      <p
        ref={addRef}
        className="text-base opacity-0 will-change-transform sm:text-lg"
        style={{
          color: `rgba(255, 255, 255, ${OPACITY.body})`,
          lineHeight: 1.75,
        }}
      >
        {SECTION_CONTENT.intro}
      </p>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useCoreValuesAnimations(refs: {
  sectionRef: RefObject<HTMLElement | null>;
  headerRefs: RefObject<HTMLElement[]>;
  cardRefs: RefObject<HTMLDivElement[]>;
  nodeRefs: RefObject<HTMLDivElement[]>;
  linesRef: RefObject<SVGSVGElement | null>;
  centralNodeRef: RefObject<HTMLDivElement | null>;
  scanRef: RefObject<HTMLDivElement | null>;
}): void {
  const {
    sectionRef,
    headerRefs,
    cardRefs,
    nodeRefs,
    linesRef,
    centralNodeRef,
    scanRef,
  } = refs;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (headerRefs.current) gsap.set(headerRefs.current, { opacity: 1 });
        if (cardRefs.current) gsap.set(cardRefs.current, { opacity: 1 });
        gsap.set(centralNodeRef.current, { opacity: 1 });
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // HEADER ENTRANCE
      // ─────────────────────────────────────────────────────────────────────

      if (headerRefs.current && headerRefs.current.length > 0) {
        gsap.fromTo(
          headerRefs.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION.entranceDuration,
            ease: "power2.out",
            stagger: ANIMATION.staggerDelay,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // ─────────────────────────────────────────────────────────────────────
      // CARD ENTRANCE (staggered grid reveal)
      // ─────────────────────────────────────────────────────────────────────

      if (cardRefs.current && cardRefs.current.length > 0) {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: ANIMATION.entranceDuration,
            ease: "power2.out",
            stagger: {
              amount: 0.6,
              grid: [2, 3],
              from: "center",
            },
            scrollTrigger: {
              trigger: cardRefs.current[0],
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // ─────────────────────────────────────────────────────────────────────
      // CONNECTION LINES DRAW
      // ─────────────────────────────────────────────────────────────────────

      if (linesRef.current) {
        const paths = linesRef.current.querySelectorAll(".connection-path");
        paths.forEach((path) => {
          const length = (path as SVGPathElement).getTotalLength?.() || 100;
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: ANIMATION.lineDrawDuration,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              once: true,
            },
          });
        });
      }

      // ─────────────────────────────────────────────────────────────────────
      // NODE PULSE ANIMATIONS
      // ─────────────────────────────────────────────────────────────────────

      if (nodeRefs.current && nodeRefs.current.length > 0) {
        nodeRefs.current.forEach((node, index) => {
          gsap.to(node, {
            scale: 1.3,
            duration: ANIMATION.pulseInterval,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.3,
          });
        });
      }

      // Central node pulse
      gsap.to(centralNodeRef.current, {
        scale: 1.2,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // ─────────────────────────────────────────────────────────────────────
      // SCAN LINE ANIMATION
      // ─────────────────────────────────────────────────────────────────────

      gsap.fromTo(
        scanRef.current,
        { top: "0%" },
        {
          top: "100%",
          duration: ANIMATION.scanLineDuration,
          ease: "none",
          repeat: -1,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [
    sectionRef,
    headerRefs,
    cardRefs,
    nodeRefs,
    linesRef,
    centralNodeRef,
    scanRef,
  ]);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function CoreValuesSection({
  id = "core-values",
}: CoreValuesSectionProps): JSX.Element {
  // ─────────────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────────────

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRefs = useRef<HTMLElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const nodeRefs = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<SVGSVGElement | null>(null);
  const centralNodeRef = useRef<HTMLDivElement | null>(null);
  const scanRef = useRef<HTMLDivElement | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // REF HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  const addCardRef = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  }, []);

  const addNodeRef = useCallback((el: HTMLDivElement | null) => {
    if (el && !nodeRefs.current.includes(el)) {
      nodeRefs.current.push(el);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────

  useCoreValuesAnimations({
    sectionRef,
    headerRefs,
    cardRefs,
    nodeRefs,
    linesRef,
    centralNodeRef,
    scanRef,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative w-full overflow-hidden py-24 sm:py-32 lg:py-40"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background layers */}
      <DiagonalGrid />
      <AmbientEffects />
      <SystemMarkers />
      <ScanLine scanRef={scanRef} />

      {/* Content container */}
      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Section header */}
        <SectionHeader headerRefs={headerRefs} />

        {/* Values grid with connection lines */}
        <div className="relative">
          {/* SVG Connection lines (behind cards) */}
          <ConnectionLines linesRef={linesRef} />

          {/* Central network node (desktop only) */}
          <div className="hidden lg:block">
            <CentralNode nodeRef={centralNodeRef} />
          </div>

          {/* Values grid */}
          <div
            className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            role="list"
            aria-label="Our six core values"
          >
            {SECTION_CONTENT.values.map((value, index) => (
              <ValueCard
                key={value.id}
                id={value.id}
                number={value.number}
                title={value.title}
                description={value.description}
                icon={value.icon}
                color={value.color}
                index={index}
                cardRef={addCardRef}
                nodeRef={addNodeRef}
              />
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          aria-hidden="true"
          className="mx-auto mt-16 flex items-center justify-center gap-4 lg:mt-20"
        >
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}40)`,
            }}
          />
          <div className="flex items-center gap-2">
            <span
              className="h-1 w-1"
              style={{ backgroundColor: COLORS.primary }}
            />
            <span
              className="h-1.5 w-1.5"
              style={{ backgroundColor: COLORS.accent }}
            />
            <span
              className="h-1 w-1"
              style={{ backgroundColor: COLORS.secondary }}
            />
          </div>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, ${COLORS.secondary}40, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

CoreValuesSection.displayName = "CoreValuesSection";
