// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/OurApproachSection.tsx
// PURPOSE: Premium methodology showcase - Clean, elegant design
// VERSION: 4.0.0
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import {
  useRef,
  useEffect,
  useState,
  memo,
  type RefObject,
  type JSX,
} from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  background: "#0a0f1a",
  surface: "#0f1525",
  panel: "#111827",
  success: "#10B981",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_CONTENT = {
  eyebrow: "Our Methodology",
  title: "Our Approach to Web Design, SEO, and AI Automation",
  intro:
    "We don't build websites randomly. We follow a structured process that ensures every project is designed for performance, SEO ranking, and conversion.",
  pillarsIntro: "Our approach is based on three pillars:",
  pillars: [
    {
      id: "strategy",
      number: "01",
      title: "Business Strategy Comes First",
      subtitle: "Strategy Before Design",
      description:
        "Before we design anything, we analyze your market, competitors, target audience, and customer journey. This ensures your website is built with a clear purpose: converting visitors into customers.",
      color: COLORS.primary,
      icon: "strategy",
      metrics: [
        { label: "Market Analysis", value: 100 },
        { label: "Conversion Focus", value: 95 },
        { label: "ROI Potential", value: 88 },
      ],
    },
    {
      id: "seo",
      number: "02",
      title: "SEO is Built Into the Structure",
      subtitle: "SEO-Driven Architecture",
      description:
        "Most agencies add SEO after the website is finished. We build SEO from day one. That includes technical SEO, clean code structure, fast loading speed, keyword mapping, and content layout planning.",
      color: COLORS.secondary,
      icon: "search",
      metrics: [
        { label: "Technical SEO", value: 100 },
        { label: "Core Vitals", value: 98 },
        { label: "Ranking Power", value: 92 },
      ],
    },
    {
      id: "ai",
      number: "03",
      title: "Smart AI Tools That Reduce Your Workload",
      subtitle: "AI Automation Integration",
      description:
        "We build custom AI tools that automate repetitive business tasks, improve customer communication, and enhance lead conversion.",
      color: COLORS.accent,
      icon: "ai",
      tools: [
        "AI customer support assistant",
        "Automated lead qualification",
        "Smart booking systems",
        "AI dashboards and reporting",
        "SEO content automation",
      ],
      metrics: [
        { label: "Automation", value: 85 },
        { label: "Efficiency Gain", value: 90 },
        { label: "Intelligence", value: 95 },
      ],
    },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface OurApproachSectionProps {
  id?: string;
}

interface PillarData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  tools?: readonly string[];
  metrics: readonly { label: string; value: number }[];
}

// ═══════════════════════════════════════════════════════════════════════════
// ICON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Icons: Record<string, () => JSX.Element> = {
  strategy: () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  search: () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  ),
  ai: () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      <circle cx="7.5" cy="13" r="1" fill="currentColor" />
      <circle cx="16.5" cy="13" r="1" fill="currentColor" />
      <path d="M9 17h6" />
    </svg>
  ),
  check: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Background - Simple elegant gradient background
 */
const Background = memo(function Background(): JSX.Element {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Main gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, ${COLORS.accent}12, transparent 50%),
            radial-gradient(ellipse 50% 40% at 10% 60%, ${COLORS.primary}08, transparent 40%),
            radial-gradient(ellipse 50% 40% at 90% 50%, ${COLORS.secondary}08, transparent 40%),
            ${COLORS.background}
          `,
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
});

/**
 * MetricBar - Simple animated progress bar
 */
const MetricBar = memo(function MetricBar({
  label,
  value,
  color,
  isVisible,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  isVisible: boolean;
  delay: number;
}): JSX.Element {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{label}</span>
        <span className="font-mono text-xs" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: isVisible ? `${value}%` : "0%",
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}50`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
});

/**
 * ToolItem - Simple tool list item
 */
const ToolItem = memo(function ToolItem({
  tool,
  color,
}: {
  tool: string;
  color: string;
}): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icons.check />
      </span>
      <span className="text-sm text-white/60">{tool}</span>
    </div>
  );
});

/**
 * PillarCard - Clean, always-open pillar card
 */
const PillarCard = memo(function PillarCard({
  pillar,
  index,
  isVisible,
}: {
  pillar: PillarData;
  index: number;
  isVisible: boolean;
}): JSX.Element {
  const IconComponent = Icons[pillar.icon] || Icons.strategy;

  return (
    <article
      className="group relative transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Card */}
      <div
        className="relative h-full overflow-hidden border border-white/6 bg-white/2 backdrop-blur-sm transition-all duration-500 hover:border-white/1 hover:bg-white/3"
        style={{
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
          }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at top, ${pillar.color}08, transparent 60%)`,
          }}
        />

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            {/* Number + Icon */}
            <div className="flex items-center gap-4">
              {/* Icon container */}
              <div
                className="flex h-14 w-14 items-center justify-center border transition-colors duration-300 group-hover:border-opacity-60"
                style={{
                  borderColor: `${pillar.color}30`,
                  background: `linear-gradient(135deg, ${pillar.color}10, transparent)`,
                }}
              >
                <span style={{ color: pillar.color }}>
                  <IconComponent />
                </span>
              </div>

              {/* Number */}
              <div>
                <span
                  className="font-mono text-3xl font-light"
                  style={{ color: `${pillar.color}60` }}
                >
                  {pillar.number}
                </span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: COLORS.success,
                  boxShadow: `0 0 8px ${COLORS.success}`,
                }}
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                Active
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p
            className="mb-2 font-mono text-[11px] uppercase tracking-widest"
            style={{ color: pillar.color }}
          >
            {pillar.subtitle}
          </p>

          {/* Title */}
          <h3 className="mb-4 text-xl font-medium text-white">
            {pillar.title}
          </h3>

          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed text-white/55">
            {pillar.description}
          </p>

          {/* Tools (for AI pillar) */}
          {pillar.tools && (
            <div className="mb-6">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-white/30">
                Capabilities
              </p>
              <div className="grid gap-2">
                {pillar.tools.map((tool) => (
                  <ToolItem key={tool} tool={tool} color={pillar.color} />
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="border-t border-white/5 pt-6">
            <p className="mb-4 text-[10px] uppercase tracking-widest text-white/30">
              Performance
            </p>
            <div className="space-y-3">
              {pillar.metrics.map((metric, i) => (
                <MetricBar
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  color={pillar.color}
                  isVisible={isVisible}
                  delay={index * 150 + i * 100 + 400}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute inset-x-0 bottom-0 h-px opacity-50"
          style={{
            background: `linear-gradient(90deg, transparent, ${pillar.color}40, transparent)`,
          }}
        />
      </div>
    </article>
  );
});

/**
 * SectionHeader - Clean header with subtle animations
 */
const SectionHeader = memo(function SectionHeader({
  isVisible,
}: {
  isVisible: boolean;
}): JSX.Element {
  return (
    <div className="relative mx-auto mb-16 max-w-3xl text-center lg:mb-20">
      {/* Eyebrow */}
      <p
        className="mb-4 font-mono text-xs uppercase tracking-[0.2em] transition-all duration-700"
        style={{
          color: COLORS.secondary,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {SECTION_CONTENT.eyebrow}
      </p>

      {/* Title */}
      <h2
        className="mb-6 text-3xl font-medium text-white transition-all duration-700 sm:text-4xl lg:text-5xl"
        style={{
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "100ms",
        }}
      >
        {SECTION_CONTENT.title}
      </h2>

      {/* Intro */}
      <p
        className="mx-auto mb-8 max-w-2xl text-base text-white/55 transition-all duration-700 sm:text-lg"
        style={{
          lineHeight: 1.7,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "200ms",
        }}
      >
        {SECTION_CONTENT.intro}
      </p>

      {/* Pillars intro + indicators */}
      <div
        className="transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "300ms",
        }}
      >
        <p className="mb-6 text-white/70">{SECTION_CONTENT.pillarsIntro}</p>

        {/* Pillar indicators */}
        <div className="flex items-center justify-center gap-4">
          {SECTION_CONTENT.pillars.map((pillar, index) => (
            <div key={pillar.id} className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center border font-mono text-sm transition-all duration-300 hover:scale-110"
                style={{
                  borderColor: pillar.color,
                  color: pillar.color,
                  background: `linear-gradient(135deg, ${pillar.color}10, transparent)`,
                }}
              >
                {pillar.number}
              </div>
              {index < 2 && (
                <div
                  className="h-px w-8"
                  style={{
                    background: `linear-gradient(90deg, ${pillar.color}80, ${SECTION_CONTENT.pillars[index + 1].color}80)`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function OurApproachSection({
  id = "our-approach",
}: OurApproachSectionProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
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
      aria-labelledby="approach-heading"
      className="relative w-full overflow-hidden py-24 sm:py-32 lg:py-40"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background */}
      <Background />

      {/* Content */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 ">
        {/* Header */}
        <SectionHeader isVisible={isVisible} />

        {/* Pillar cards */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {SECTION_CONTENT.pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.id}
              pillar={pillar}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom accent */}
        <div
          className="mx-auto mt-16 flex items-center justify-center gap-3 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: "800ms",
          }}
        >
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}50)`,
            }}
          />
          <div className="flex items-center gap-1.5">
            {SECTION_CONTENT.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: pillar.color }}
              />
            ))}
          </div>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, ${COLORS.accent}50, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

OurApproachSection.displayName = "OurApproachSection";
