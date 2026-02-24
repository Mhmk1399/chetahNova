// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/WhyTrustUsSection.tsx
// PURPOSE: Trust & Authority section with Trust Score visualization
// VERSION: 2.0.0
// DESIGN: Trust Dashboard with radial meter + verification badges
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useRef, useEffect, useState, memo, type JSX } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  background: "#050810",
  surface: "#0a1018",
  success: "#10B981",
  trust: "#22D3EE",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_CONTENT = {
  eyebrow: "Authority Proof",
  title: "Why Clients Trust Us",
  trustScore: 98,
  trustPoints: [
    {
      id: "results",
      text: "We focus on real business results",
      icon: "target",
      verified: true,
    },
    {
      id: "solution",
      text: "Design + SEO + AI automation in one solution",
      icon: "layers",
      verified: true,
    },
    {
      id: "speed",
      text: "We build fast and scalable websites",
      icon: "zap",
      verified: true,
    },
    {
      id: "communication",
      text: "Clear reporting and communication",
      icon: "message",
      verified: true,
    },
    {
      id: "seo",
      text: "Long-term SEO growth strategies",
      icon: "trending",
      verified: true,
    },
    {
      id: "conversion",
      text: "Websites optimized for conversion",
      icon: "chart",
      verified: true,
    },
  ],
  metrics: [
    { label: "Projects", value: 150, suffix: "+" },
    { label: "Satisfaction", value: 98, suffix: "%" },
    { label: "Countries", value: 40, suffix: "+" },
    { label: "Years", value: 5, suffix: "+" },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ICON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Icons: Record<string, (props: { size?: number }) => JSX.Element> = {
  target: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  layers: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  zap: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  message: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  trending: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  chart: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  shield: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  check: ({ size = 14 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  verified: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Background - Elegant dark gradient
 */
const Background = memo(function Background(): JSX.Element {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Base */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -20%, ${COLORS.trust}08, transparent 50%),
            radial-gradient(ellipse 80% 50% at 0% 50%, ${COLORS.primary}05, transparent 40%),
            radial-gradient(ellipse 80% 50% at 100% 70%, ${COLORS.accent}05, transparent 40%),
            ${COLORS.background}
          `,
        }}
      />
    </div>
  );
});

/**
 * TrustMeter - Central radial trust score visualization
 */
const TrustMeter = memo(function TrustMeter({
  score,
  isVisible,
}: {
  score: number;
  isVisible: boolean;
}): JSX.Element {
  const [displayScore, setDisplayScore] = useState(0);
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    if (isVisible) {
      let current = 0;
      const increment = score / 60; // 60 frames
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isVisible, score]);

  return (
    <div
      className="relative flex items-center justify-center transition-all duration-1000"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.8)",
      }}
    >
      {/* Outer glow */}
      <div
        className="absolute h-72 w-72 rounded-full blur-3xl sm:h-80 sm:w-80"
        style={{ backgroundColor: `${COLORS.trust}10` }}
      />

      {/* SVG Meter */}
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        className="relative sm:h-80 sm:w-[320px]"
      >
        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke={`${COLORS.trust}10`}
          strokeWidth="8"
        />

        {/* Track marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = Number((140 + 105 * Math.cos(angle)).toFixed(6));
          const y1 = Number((140 + 105 * Math.sin(angle)).toFixed(6));
          const x2 = Number((140 + (i % 5 === 0 ? 98 : 102) * Math.cos(angle)).toFixed(6));
          const y2 = Number((140 + (i % 5 === 0 ? 98 : 102) * Math.sin(angle)).toFixed(6));
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 5 === 0 ? `${COLORS.trust}40` : `${COLORS.trust}20`}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          );
        })}

        {/* Progress arc */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke={`url(#trustGradient)`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 140 140)"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 10px ${COLORS.trust}60)` }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.secondary} />
            <stop offset="50%" stopColor={COLORS.trust} />
            <stop offset="100%" stopColor={COLORS.success} />
          </linearGradient>
        </defs>

        {/* Inner decorative circle */}
        <circle
          cx="140"
          cy="140"
          r="85"
          fill="none"
          stroke={`${COLORS.trust}15`}
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        {/* Shield icon */}
        <div className="mb-2" style={{ color: COLORS.trust }}>
          <Icons.shield size={28} />
        </div>

        {/* Score */}
        <div className="flex items-baseline gap-1">
          <span
            className="font-mono text-6xl font-bold tabular-nums sm:text-7xl"
            style={{ color: COLORS.trust }}
          >
            {displayScore}
          </span>
          <span
            className="text-2xl font-light"
            style={{ color: `${COLORS.trust}80` }}
          >
            %
          </span>
        </div>

        {/* Label */}
        <p className="mt-1 text-sm uppercase tracking-widest text-white/40">
          Trust Score
        </p>
      </div>
    </div>
  );
});

/**
 * TrustPoint - Individual trust point with verification badge
 */
const TrustPoint = memo(function TrustPoint({
  text,
  icon,
  index,
  isVisible,
}: {
  text: string;
  icon: string;
  index: number;
  isVisible: boolean;
}): JSX.Element {
  const IconComponent = Icons[icon] || Icons.check;
  const colors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.trust,
    COLORS.success,
    COLORS.accent,
    COLORS.primary,
  ];
  const color = colors[index % colors.length];

  return (
    <div
      className="group relative transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-30px)",
        transitionDelay: `${300 + index * 100}ms`,
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            border: `1px solid ${color}30`,
          }}
        >
          <span style={{ color }}>
            <IconComponent size={22} />
          </span>

          {/* Corner accents */}
          <span
            className="absolute -left-px -top-px h-2 w-2 border-l border-t"
            style={{ borderColor: color }}
          />
          <span
            className="absolute -bottom-px -right-px h-2 w-2 border-b border-r"
            style={{ borderColor: color }}
          />
        </div>

        {/* Text + verification */}
        <div className="flex flex-1 items-center justify-between gap-3">
          <p className="text-base text-white/70 transition-colors duration-300 group-hover:text-white/90 sm:text-lg">
            {text}
          </p>

          {/* Verified badge */}
          <div
            className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1"
            style={{
              background: `${COLORS.success}15`,
              border: `1px solid ${COLORS.success}30`,
            }}
          >
            <span style={{ color: COLORS.success }}>
              <Icons.verified size={14} />
            </span>
            <span
              className="hidden text-[10px] font-medium uppercase tracking-wider sm:inline"
              style={{ color: COLORS.success }}
            >
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Connector line */}
      {index < 5 && (
        <div
          className="ml-6 h-6 w-px"
          style={{
            background: `linear-gradient(180deg, ${color}30, transparent)`,
          }}
        />
      )}
    </div>
  );
});

/**
 * MetricCounter - Animated counting metric
 */
const MetricCounter = memo(function MetricCounter({
  value,
  label,
  suffix,
  index,
  isVisible,
}: {
  value: number;
  label: string;
  suffix: string;
  index: number;
  isVisible: boolean;
}): JSX.Element {
  const [displayValue, setDisplayValue] = useState(0);
  const colors = [
    COLORS.primary,
    COLORS.trust,
    COLORS.success,
    COLORS.secondary,
  ];
  const color = colors[index % colors.length];

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(eased * value));
        if (progress >= 1) clearInterval(timer);
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div
      className="group relative text-center transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${800 + index * 100}ms`,
      }}
    >
      {/* Value */}
      <div className="relative mb-2">
        <span
          className="font-mono text-4xl font-bold tabular-nums transition-transform duration-300 group-hover:scale-110 sm:text-5xl"
          style={{ color }}
        >
          {displayValue}
        </span>
        <span className="text-2xl font-light" style={{ color: `${color}80` }}>
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-sm text-white/40">{label}</p>

      {/* Underline */}
      <div
        className="mx-auto mt-3 h-0.5 w-8 transition-all duration-300 group-hover:w-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    </div>
  );
});

/**
 * SectionHeader
 */
const SectionHeader = memo(function SectionHeader({
  isVisible,
}: {
  isVisible: boolean;
}): JSX.Element {
  return (
    <div className="mb-16 text-center lg:mb-20">
      {/* Eyebrow */}
      <p
        className="mb-4 font-mono text-xs uppercase tracking-[0.3em] transition-all duration-700"
        style={{
          color: COLORS.trust,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {SECTION_CONTENT.eyebrow}
      </p>

      {/* Title */}
      <h2
        className="text-4xl font-medium text-white transition-all duration-700 sm:text-5xl lg:text-6xl"
        style={{
          letterSpacing: "-0.02em",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "100ms",
        }}
      >
        {SECTION_CONTENT.title}
      </h2>

      {/* Decorative line */}
      <div
        className="mx-auto mt-6 flex items-center justify-center gap-2 transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: "200ms",
        }}
      >
        <div
          className="h-px w-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${COLORS.trust}50)`,
          }}
        />
        <div
          className="h-2 w-2 rotate-45"
          style={{ backgroundColor: COLORS.trust }}
        />
        <div
          className="h-px w-12"
          style={{
            background: `linear-gradient(90deg, ${COLORS.trust}50, transparent)`,
          }}
        />
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function WhyTrustUsSection({
  id = "why-trust-us",
}: {
  id?: string;
}): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby="trust-heading"
      className="relative w-full overflow-hidden py-24 sm:py-32 lg:py-40"
      style={{ backgroundColor: COLORS.background }}
    >
      <Background />

      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 ">
        {/* Header */}
        <SectionHeader isVisible={isVisible} />

        {/* Main content - Two column layout */}
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left - Trust Meter */}
          <div className="flex justify-center lg:justify-start">
            <TrustMeter
              score={SECTION_CONTENT.trustScore}
              isVisible={isVisible}
            />
          </div>

          {/* Right - Trust Points */}
          <div className="space-y-0">
            {SECTION_CONTENT.trustPoints.map((point, index) => (
              <TrustPoint
                key={point.id}
                text={point.text}
                icon={point.icon}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-24 border-t border-white/5 pt-16">
          <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
            {SECTION_CONTENT.metrics.map((metric, index) => (
              <MetricCounter
                key={metric.label}
                value={metric.value}
                label={metric.label}
                suffix={metric.suffix}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="mx-auto mt-16 flex items-center justify-center gap-3 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: "1200ms",
          }}
        >
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}40)`,
            }}
          />
          <div className="flex gap-1">
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            />
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: COLORS.trust }}
            />
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: COLORS.success }}
            />
          </div>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, ${COLORS.success}40, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

WhyTrustUsSection.displayName = "WhyTrustUsSection";
