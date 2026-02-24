"use client";

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════
// BRAND COLORS
// ════════════════════════════════════════════════════════════════════

const colors = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  dark: "#0B0F19",
  darkLighter: "#0F1420",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface Feature {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "accent";
  metrics?: {
    value: string;
    label: string;
  };
}

interface WhyChooseUsProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  features?: Feature[];
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  // Performance - Rocket/Speed
  performance: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  // Conversion - Target/Goal
  conversion: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </svg>
  ),
  // SEO - Search/Chart
  seo: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m7 16 4-8 4 5 5-9" />
      <circle cx="20" cy="4" r="2" />
    </svg>
  ),
  // AI/Automation - Brain/Circuit
  ai: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 2.32.64 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0 1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" />
      <path d="M15.7 10.4 12 12l-3.7-1.6" />
      <path d="M12 12v4" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  ),
  // Arrow
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  // Check
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  // Sparkle
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  // Zap
  zap: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultFeatures: Feature[] = [
  {
    id: "performance",
    number: "01",
    title: "Performance-Focused Development",
    description:
      "We optimize speed, Core Web Vitals, and mobile performance to ensure your website loads fast and ranks higher.",
    icon: Icons.performance,
    color: "primary",
    metrics: {
      value: "<2s",
      label: "Load Time",
    },
  },
  {
    id: "conversion",
    number: "02",
    title: "Conversion-Driven Design",
    description:
      "Every section is designed with psychology, trust-building, and lead generation principles.",
    icon: Icons.conversion,
    color: "secondary",
    metrics: {
      value: "3x",
      label: "More Leads",
    },
  },
  {
    id: "seo",
    number: "03",
    title: "SEO From Day One",
    description:
      "We structure the website properly from the beginning to make Google indexing and ranking easier.",
    icon: Icons.seo,
    color: "primary",
    metrics: {
      value: "#1",
      label: "Rankings",
    },
  },
  {
    id: "ai",
    number: "04",
    title: "AI Automation That Saves Time",
    description:
      "We replace repetitive tasks with smart systems so your business scales faster with less manual work.",
    icon: Icons.ai,
    color: "accent",
    metrics: {
      value: "10h+",
      label: "Saved Weekly",
    },
  },
];

// ════════════════════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════════════════════

const getColor = (colorKey: "primary" | "secondary" | "accent") =>
  colors[colorKey];

// ════════════════════════════════════════════════════════════════════
// BACKGROUND
// ════════════════════════════════════════════════════════════════════

const Background = memo(function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: colors.dark }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient Orbs */}
      <div
        className="absolute -left-40 top-1/3 h-150 w-150"
        style={{
          background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute -right-40 top-1/2 h-125 w-125"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}06 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-100 w-200 -translate-x-1/2"
        style={{
          background: `radial-gradient(ellipse, ${colors.accent}05 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// ANIMATED LINES
// ════════════════════════════════════════════════════════════════════

const AnimatedLines = memo(function AnimatedLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Vertical Lines */}
      <div
        className="absolute left-1/4 top-0 h-full w-px opacity-[0.03]"
        style={{
          background:
            "linear-gradient(180deg, transparent, white, transparent)",
        }}
      />
      <div
        className="absolute left-1/2 top-0 h-full w-px opacity-[0.03]"
        style={{
          background:
            "linear-gradient(180deg, transparent, white, transparent)",
        }}
      />
      <div
        className="absolute left-3/4 top-0 h-full w-px opacity-[0.03]"
        style={{
          background:
            "linear-gradient(180deg, transparent, white, transparent)",
        }}
      />

      {/* Animated Dot */}
      <div
        className="absolute left-1/4 h-2 w-2 rounded-full"
        style={{
          background: colors.primary,
          boxShadow: `0 0 20px ${colors.primary}`,
          animation: "moveDot 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-3/4 h-2 w-2 rounded-full"
        style={{
          background: colors.secondary,
          boxShadow: `0 0 20px ${colors.secondary}`,
          animation: "moveDot 8s ease-in-out infinite reverse",
          animationDelay: "2s",
        }}
      />

      <style jsx>{`
        @keyframes moveDot {
          0%,
          100% {
            top: 10%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 90%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// COMPARISON INDICATOR
// ════════════════════════════════════════════════════════════════════

const ComparisonIndicator = memo(function ComparisonIndicator({
  isVisible,
}: {
  isVisible: boolean;
}) {
  return (
    <div
      className="mb-12 flex justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="flex items-center gap-6 rounded-full border border-white/6 bg-white/2 px-6 py-3 backdrop-blur-sm">
        {/* Others */}
        <div className="flex items-center gap-2 text-white/40">
          <div className="h-3 w-3 rounded-full border border-white/20" />
          <span className="text-sm">Others</span>
        </div>

        {/* VS */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-white/30">
          VS
        </div>

        {/* Us */}
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: colors.primary,
              boxShadow: `0 0 10px ${colors.primary}50`,
            }}
          />
          <span className="text-sm font-medium text-white">Our Approach</span>
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FEATURE CARD
// ════════════════════════════════════════════════════════════════════

const FeatureCard = memo(function FeatureCard({
  feature,
  index,
  isVisible,
  isActive,
  onHover,
}: {
  feature: Feature;
  index: number;
  isVisible: boolean;
  isActive: boolean;
  onHover: (id: string | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const color = getColor(feature.color);

  useEffect(() => {
    if (!cardRef.current || !isVisible) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.15,
        ease: "power3.out",
      },
    );
  }, [isVisible, index]);

  return (
    <div
      ref={cardRef}
      className="feature-card group relative"
      style={{ opacity: 0 }}
      onMouseEnter={() => onHover(feature.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Card Container */}
      <div
        className="relative h-full overflow-hidden border p-6 transition-all duration-500 md:p-8"
        style={{
          borderColor: isActive ? `${color}40` : "rgba(255,255,255,0.06)",
          background: isActive
            ? `linear-gradient(135deg, ${color}08, transparent 60%)`
            : "rgba(255,255,255,0.02)",
          transform: isActive ? "translateY(-8px)" : "translateY(0)",
          boxShadow: isActive ? `0 25px 50px -12px ${color}20` : "none",
        }}
      >
        {/* Top Row */}
        <div className="mb-6 flex items-start justify-between">
          {/* Number */}
          <span
            className="font-mono text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
            style={{ color: isActive ? color : "rgba(255,255,255,0.2)" }}
          >
            {feature.number}
          </span>

          {/* Metric Badge */}
          {feature.metrics && (
            <div
              className="flex items-center gap-2 border px-3 py-1.5 transition-all duration-300"
              style={{
                borderColor: isActive ? `${color}30` : "rgba(255,255,255,0.08)",
                background: isActive ? `${color}10` : "transparent",
              }}
            >
              <span
                className="text-lg font-bold transition-colors duration-300"
                style={{ color: isActive ? color : "rgba(255,255,255,0.6)" }}
              >
                {feature.metrics.value}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                {feature.metrics.label}
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center border transition-all duration-500 md:h-20 md:w-20"
          style={{
            borderColor: isActive ? `${color}40` : "rgba(255,255,255,0.08)",
            background: isActive
              ? `linear-gradient(135deg, ${color}20, ${color}05)`
              : "rgba(255,255,255,0.02)",
          }}
        >
          <div
            className="h-8 w-8 transition-all duration-300 md:h-10 md:w-10"
            style={{
              color: isActive ? color : "rgba(255,255,255,0.5)",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
          >
            {feature.icon}
          </div>

          {/* Pulse Ring */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              border: `1px solid ${color}`,
              opacity: isActive ? 0.2 : 0,
              animation: isActive ? "pulse-ring 2s ease-out infinite" : "none",
            }}
          />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-lg font-bold text-white transition-colors duration-300 md:text-xl">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="mb-6 text-sm leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/70 md:text-base">
          {feature.description}
        </p>

        {/* Learn More Link */}
        <div
          className="flex items-center gap-2 text-sm font-medium transition-all duration-300"
          style={{
            color: isActive ? color : "rgba(255,255,255,0.4)",
          }}
        >
          <span>Learn more</span>
          <span
            className="h-4 w-4 transition-transform duration-300"
            style={{
              transform: isActive ? "translateX(4px)" : "translateX(0)",
            }}
          >
            {Icons.arrow}
          </span>
        </div>

        {/* Bottom Accent Line */}
        <div
          className="absolute bottom-0 left-0 h-1 transition-all duration-500"
          style={{
            width: isActive ? "100%" : "0%",
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />

        {/* Corner Glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${color}15, transparent 70%)`,
            opacity: isActive ? 1 : 0,
          }}
        />

        {/* Decorative Corner */}
        <div
          className="absolute right-4 top-4 h-8 w-8 transition-opacity duration-300"
          style={{
            opacity: isActive ? 1 : 0,
          }}
        >
          <div
            className="absolute right-0 top-0 h-full w-px"
            style={{
              background: `linear-gradient(180deg, ${color}40, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 h-px w-full"
            style={{
              background: `linear-gradient(270deg, ${color}40, transparent)`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FEATURE HIGHLIGHT BAR
// ════════════════════════════════════════════════════════════════════

const FeatureHighlightBar = memo(function FeatureHighlightBar({
  isVisible,
}: {
  isVisible: boolean;
}) {
  const highlights = [
    { icon: Icons.zap, text: "Fast Loading", color: colors.primary },
    { icon: Icons.check, text: "SEO Optimized", color: colors.secondary },
    { icon: Icons.check, text: "Mobile First", color: colors.primary },
    { icon: Icons.check, text: "Conversion Ready", color: colors.accent },
  ];

  return (
    <div
      className="mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.6s",
      }}
    >
      {highlights.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-sm text-white/60"
        >
          <span className="h-4 w-4" style={{ color: item.color }}>
            {item.icon}
          </span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA SECTION
// ════════════════════════════════════════════════════════════════════

const CTASection = memo(function CTASection({
  isVisible,
}: {
  isVisible: boolean;
}) {
  return (
    <div
      className="mt-20 flex flex-col items-center gap-6 text-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.8s",
      }}
    >
      {/* Text */}
      <p className="max-w-xl text-white/50">
        Ready to build a website that actually works for your business?
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Primary */}
        <Link
          href="/contact"
          className="group relative overflow-hidden px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-300"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Get Started
            <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
              {Icons.arrow}
            </span>
          </span>
          <span className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        {/* Secondary */}
        <Link
          href="/work"
          className="group flex items-center justify-center gap-2 border border-white/10 bg-white/2 px-8 py-4 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/4 hover:text-white"
        >
          View Our Work
          <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5">
            {Icons.arrow}
          </span>
        </Link>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({
  headline = "Why Businesses Choose Us",
  subheadline = "The Difference That Drives Results",
  description = "Most websites look good but fail to generate results. We build websites with performance, SEO, and automation in mind. Your website will not only represent your brand, it will actively work for your business.",
  features = defaultFeatures,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleFeatureHover = useCallback((id: string | null) => {
    setActiveFeature(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-20"
      style={{ backgroundColor: colors.dark }}
      aria-labelledby="why-choose-us-heading"
    >
      <Background />
      <AnimatedLines />

      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          {/* Headline */}
          <h2
            id="why-choose-us-heading"
            className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s",
            }}
          >
            {headline.split(" ").map((word, i) => (
              <span key={i}>
                {word === "Choose" ? (
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    {word}
                  </span>
                ) : (
                  word
                )}{" "}
              </span>
            ))}
          </h2>

          {/* Description */}
          <p
            className="text-base leading-relaxed text-white/50 md:text-lg"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
            }}
          >
            {description}
          </p>
        </div>

        {/* Comparison Indicator */}
        <ComparisonIndicator isVisible={isVisible} />

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              isVisible={isVisible}
              isActive={activeFeature === feature.id}
              onHover={handleFeatureHover}
            />
          ))}
        </div>

        {/* Feature Highlights */}
        <FeatureHighlightBar isVisible={isVisible} />

        {/* CTA Section */}
        <CTASection isVisible={isVisible} />
      </div>

      <div className="pointer-events-none absolute bottom-8 right-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(0deg, ${colors.accent}30, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-px w-20"
          style={{
            background: `linear-gradient(270deg, ${colors.accent}30, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default memo(WhyChooseUs);
export type { WhyChooseUsProps, Feature };
