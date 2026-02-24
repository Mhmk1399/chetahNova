// ============================================================
// FILE: app/components/FeaturedProjectsSection.tsx
//
// Complete Featured Projects Section - Production Ready
// Creative project showcase with device mockups
//
// Features:
// • Animated project cards with device previews
// • Category filtering with smooth transitions
// • Hover effects with overlay reveal
// • Result highlights with visual indicators
// • GPU-accelerated animations
// • Full WCAG 2.1 AA accessibility
// • Respects prefers-reduced-motion
// • Mobile-first responsive design
// ============================================================

"use client";

import React, {
  memo,
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================
// CONSTANTS — Animation Tokens
// ============================================================

const ANIMATION = {
  ENTRANCE: {
    DURATION: 0.7,
    STAGGER: 0.12,
    EASE: "power2.out",
    Y_OFFSET: 50,
    SCALE_START: 0.92,
  },
  CARD: {
    HOVER_DURATION: 0.4,
    HOVER_LIFT: -8,
    HOVER_EASE: "power2.out",
  },
  IMAGE: {
    HOVER_SCALE: 1.05,
    DURATION: 0.6,
  },
  OVERLAY: {
    DURATION: 0.3,
  },
  FILTER: {
    DURATION: 0.4,
  },
  LIGHT_STREAK: {
    DURATION: 12,
    OPACITY: 0.04,
  },
  PULSE: {
    DURATION: 2,
    OPACITY_MIN: 0.5,
    OPACITY_MAX: 1,
  },
  COUNTER: {
    DURATION: 1.5,
    EASE: "power2.out",
  },
} as const;

// ============================================================
// CONSTANTS — Color System
// ============================================================

const COLORS = {
  PRIMARY: "#F59E0B",
  SECONDARY: "#06B6D4",
  ACCENT: "#6D28D9",
  SUCCESS: "#10B981",
  DARK_BG: "#0B0F19",
} as const;

type AccentColor = "primary" | "secondary" | "accent" | "success";
type IndustryType = "corporate" | "ecommerce" | "local" | "saas";
type ServiceType = "design" | "seo" | "ai" | "development" | "conversion";

const COLOR_VALUES: Record<AccentColor, string> = {
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  accent: COLORS.ACCENT,
  success: COLORS.SUCCESS,
};

const INDUSTRY_COLORS: Record<IndustryType, AccentColor> = {
  corporate: "primary",
  ecommerce: "secondary",
  local: "success",
  saas: "accent",
};

const SERVICE_COLORS: Record<ServiceType, AccentColor> = {
  design: "primary",
  seo: "secondary",
  ai: "accent",
  development: "secondary",
  conversion: "success",
};

// ============================================================
// CONSTANTS — Content Data
// ============================================================

interface ProjectResult {
  metric: string;
  value: string;
  icon: "speed" | "traffic" | "leads" | "time";
}

interface ProjectData {
  id: string;
  name: string;
  industry: IndustryType;
  industryLabel: string;
  services: ServiceType[];
  serviceLabels: string[];
  description: string;
  resultHighlight: string;
  result: ProjectResult;
  caseStudyUrl: string;
  mockupVariant: "corporate" | "ecommerce" | "landing" | "dashboard";
  systemId: string;
  year: string;
}

const CONTENT = {
  sectionId: "featured-projects",
  systemLabel: "SYS::PROJECTS",

  headline: "Featured Projects",

  intro:
    "Here are some of our most recent and high-impact projects across web design, SEO, and AI integration.",

  filters: [
    { id: "all", label: "All Projects" },
    { id: "design", label: "Web Design" },
    { id: "seo", label: "SEO" },
    { id: "ai", label: "AI Integration" },
  ],

  projects: [
    {
      id: "project-1",
      name: "Premium Business Website",
      industry: "corporate" as IndustryType,
      industryLabel: "Corporate / Professional Services",
      services: ["design", "seo"] as ServiceType[],
      serviceLabels: ["Web Design", "UI/UX", "Technical SEO"],
      description:
        "A high-end corporate website designed for trust-building and lead generation, optimized for speed, structure, and Google indexing.",
      resultHighlight: "Faster loading time and improved conversion rate.",
      result: {
        metric: "Page Speed",
        value: "98",
        icon: "speed" as const,
      },
      caseStudyUrl: "#case-study-1",
      mockupVariant: "corporate" as const,
      systemId: "PRJ::001",
      year: "2024",
    },
    {
      id: "project-2",
      name: "E-Commerce Website & SEO Growth",
      industry: "ecommerce" as IndustryType,
      industryLabel: "E-commerce",
      services: ["development", "seo", "conversion"] as ServiceType[],
      serviceLabels: [
        "Web Development",
        "SEO Strategy",
        "Conversion Optimization",
      ],
      description:
        "A modern online store built for scalability, including optimized product structure, checkout flow, and SEO-driven category architecture.",
      resultHighlight: "Increased organic traffic and sales growth.",
      result: {
        metric: "Traffic Growth",
        value: "+285%",
        icon: "traffic" as const,
      },
      caseStudyUrl: "#case-study-2",
      mockupVariant: "ecommerce" as const,
      systemId: "PRJ::002",
      year: "2024",
    },
    {
      id: "project-3",
      name: "Landing Page System for Lead Generation",
      industry: "local" as IndustryType,
      industryLabel: "Local Business / Service Provider",
      services: ["design", "seo", "conversion"] as ServiceType[],
      serviceLabels: ["Landing Page Design", "SEO", "Conversion Funnel"],
      description:
        "A multi-landing-page system designed for Google ranking and lead capture, with a strong CTA structure and trust-building sections.",
      resultHighlight: "Higher lead volume and improved customer inquiries.",
      result: {
        metric: "Leads Generated",
        value: "+340%",
        icon: "leads" as const,
      },
      caseStudyUrl: "#case-study-3",
      mockupVariant: "landing" as const,
      systemId: "PRJ::003",
      year: "2024",
    },
    {
      id: "project-4",
      name: "AI-Powered Website Automation",
      industry: "saas" as IndustryType,
      industryLabel: "SaaS / Business Services",
      services: ["ai", "development"] as ServiceType[],
      serviceLabels: [
        "AI Integration",
        "Automation Tools",
        "Dashboard Development",
      ],
      description:
        "A custom AI automation system integrated into a website, including AI customer support and lead qualification tools.",
      resultHighlight:
        "Reduced support workload and improved customer response time.",
      result: {
        metric: "Response Time",
        value: "-65%",
        icon: "time" as const,
      },
      caseStudyUrl: "#case-study-4",
      mockupVariant: "dashboard" as const,
      systemId: "PRJ::004",
      year: "2024",
    },
  ] as ProjectData[],

  cta: {
    text: "View Full Case Studies",
    href: "#case-studies",
  },
} as const;

// ============================================================
// HOOKS — useReducedMotion
// ============================================================

function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// ============================================================
// SUB-COMPONENT — GridOverlay
// ============================================================

const GridOverlay = memo(function GridOverlay() {
  const gridSize = 64;
  const opacity = 0.02;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, ${opacity}) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, ${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  );
});

// ============================================================
// SUB-COMPONENT — AmbientGlow
// ============================================================

interface GlowConfig {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  color: string;
  size: string;
  opacity: number;
}

const AMBIENT_GLOWS: GlowConfig[] = [
  {
    top: "10%",
    left: "15%",
    color: COLORS.PRIMARY,
    size: "500px",
    opacity: 0.04,
  },
  {
    top: "40%",
    right: "10%",
    color: COLORS.SECONDARY,
    size: "550px",
    opacity: 0.05,
  },
  {
    bottom: "20%",
    left: "40%",
    color: COLORS.ACCENT,
    size: "450px",
    opacity: 0.035,
  },
];

const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {AMBIENT_GLOWS.map((glow, index) => (
        <div
          key={index}
          className="absolute will-change-transform"
          style={{
            top: glow.top,
            bottom: glow.bottom,
            left: glow.left,
            right: glow.right,
            width: glow.size,
            height: glow.size,
            background: `radial-gradient(circle, ${glow.color} 0%, transparent 70%)`,
            opacity: glow.opacity,
            transform: "translate(-50%, -50%)",
            filter: "blur(80px)",
          }}
        />
      ))}
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — SystemMarker
// ============================================================

type MarkerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface SystemMarkerProps {
  text: string;
  position: MarkerPosition;
  showStatus?: boolean;
  statusColor?: string;
  className?: string;
}

const MARKER_POSITIONS: Record<MarkerPosition, string> = {
  "top-left": "top-4 left-4 sm:top-6 sm:left-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
};

const SystemMarker = memo(function SystemMarker({
  text,
  position,
  showStatus = false,
  statusColor = "text-cyan-500/60",
  className = "",
}: SystemMarkerProps) {
  return (
    <span
      aria-hidden="true"
      className={`
        pointer-events-none absolute select-none
        font-mono text-[10px] uppercase tracking-[0.15em]
        text-white/15
        ${MARKER_POSITIONS[position]}
        ${className}
      `}
    >
      {showStatus && (
        <span className={`mr-1.5 inline-block ${statusColor}`}>◉</span>
      )}
      {text}
    </span>
  );
});

// ============================================================
// SUB-COMPONENT — LightStreak
// ============================================================

interface LightStreakProps {
  color: string;
}

const LightStreak = memo(function LightStreak({ color }: LightStreakProps) {
  const streakRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!streakRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        streakRef.current,
        { xPercent: -100 },
        {
          xPercent: 400,
          duration: ANIMATION.LIGHT_STREAK.DURATION,
          ease: "none",
          repeat: -1,
          force3D: true,
        },
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const opacityHex = Math.round(ANIMATION.LIGHT_STREAK.OPACITY * 255)
    .toString(16)
    .padStart(2, "0");

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        ref={streakRef}
        className="absolute inset-y-0 w-1/4 will-change-transform"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}${opacityHex} 50%, transparent 100%)`,
        }}
      />
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — DeviceMockup
// Project preview with device frames
// ============================================================

interface DeviceMockupProps {
  variant: "corporate" | "ecommerce" | "landing" | "dashboard";
  accentColor: AccentColor;
}

const DeviceMockup = memo(function DeviceMockup({
  variant,
  accentColor,
}: DeviceMockupProps) {
  const color = COLOR_VALUES[accentColor];

  // Different mockup content based on variant
  const renderMockupContent = () => {
    switch (variant) {
      case "corporate":
        return (
          <div className="h-full w-full bg-linear-to-br from-slate-900 to-slate-800">
            {/* Corporate nav */}
            <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5">
              <div className="h-1.5 w-8 bg-white/30" />
              <div className="flex gap-2">
                <div className="h-1 w-4 bg-white/20" />
                <div className="h-1 w-4 bg-white/20" />
                <div className="h-1 w-4 bg-white/20" />
              </div>
            </div>
            {/* Hero area */}
            <div className="p-3">
              <div className="mb-2 h-3 w-3/4 bg-white/30" />
              <div className="mb-2 h-1.5 w-full bg-white/15" />
              <div className="mb-3 h-1.5 w-2/3 bg-white/10" />
              <div className="h-2 w-16 bg-amber-500/60" />
            </div>
            {/* Cards */}
            <div className="grid grid-cols-3 gap-1.5 px-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-4/3 border border-white/10 bg-white/5 p-1.5"
                >
                  <div className="mb-1 h-1/2 bg-linear-to-br from-amber-500/20 to-transparent" />
                  <div className="h-1 w-full bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        );

      case "ecommerce":
        return (
          <div className="h-full w-full bg-linear-to-br from-slate-900 to-slate-800">
            {/* Nav with cart */}
            <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5">
              <div className="h-1.5 w-8 bg-white/30" />
              <div className="flex items-center gap-2">
                <div className="h-1 w-4 bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-cyan-500/60" />
              </div>
            </div>
            {/* Product grid */}
            <div className="grid grid-cols-2 gap-1.5 p-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-white/10 bg-white/5 p-1.5"
                >
                  <div className="mb-1 aspect-square bg-linear-to-br from-cyan-500/20 to-violet-500/10" />
                  <div className="mb-0.5 h-1 w-full bg-white/20" />
                  <div className="h-1.5 w-8 bg-cyan-500/50" />
                </div>
              ))}
            </div>
          </div>
        );

      case "landing":
        return (
          <div className="h-full w-full bg-linear-to-br from-slate-900 to-slate-800">
            {/* Hero with CTA focus */}
            <div className="p-3">
              <div className="mb-2 h-4 w-4/5 bg-white/30" />
              <div className="mb-2 h-1.5 w-full bg-white/15" />
              <div className="mb-3 flex gap-2">
                <div className="h-3 w-20 bg-emerald-500/60" />
                <div className="h-3 w-16 border border-white/20" />
              </div>
            </div>
            {/* Trust badges */}
            <div className="flex justify-center gap-2 px-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-4 w-8 items-center justify-center border border-white/10 bg-white/5"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-500/40" />
                </div>
              ))}
            </div>
            {/* Form section */}
            <div className="mt-3 mx-3 border border-white/10 bg-white/5 p-2">
              <div className="mb-1.5 h-1.5 w-full bg-white/10" />
              <div className="mb-1.5 h-1.5 w-full bg-white/10" />
              <div className="h-2 w-full bg-emerald-500/50" />
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="h-full w-full bg-linear-to-br from-slate-900 to-slate-800">
            {/* Dashboard header */}
            <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded bg-violet-500/60" />
                <div className="h-1.5 w-12 bg-white/30" />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 bg-emerald-500/60" />
                <div className="h-1.5 w-1.5 bg-amber-500/60" />
              </div>
            </div>
            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-1.5 p-2">
              {[COLORS.PRIMARY, COLORS.SECONDARY, COLORS.ACCENT].map((c, i) => (
                <div
                  key={i}
                  className="border border-white/10 bg-white/5 p-1.5"
                >
                  <div
                    className="mb-1 h-1"
                    style={{ backgroundColor: `${c}60`, width: "60%" }}
                  />
                  <div className="h-2 w-6 bg-white/30" />
                </div>
              ))}
            </div>
            {/* Chart */}
            <div className="mx-2 border border-white/10 bg-white/5 p-1.5">
              <div className="flex h-10 items-end gap-0.5">
                {[40, 65, 45, 80, 55, 70, 90, 75, 60, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-violet-500/50"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Desktop frame */}
      <div
        className="relative overflow-hidden border border-white/20 bg-white/2"
        style={{ aspectRatio: "16/10" }}
      >
        {/* Top bezel */}
        <div className="absolute inset-x-0 top-0 z-10 flex h-4 items-center justify-center border-b border-white/10 bg-white/3">
          <div className="h-1 w-1 rounded-full bg-white/20" />
        </div>
        {/* Screen */}
        <div className="absolute inset-0 pt-4">{renderMockupContent()}</div>
        {/* Reflection overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent"
        />
      </div>
      {/* Stand */}
      <div className="mx-auto h-1 w-1/4 bg-linear-to-b from-white/15 to-transparent" />

      {/* Mobile device preview */}
      <div
        className="absolute -bottom-2 -right-2 overflow-hidden border border-white/20 bg-slate-900 sm:-bottom-4 sm:-right-4"
        style={{ width: "28%", aspectRatio: "9/16" }}
      >
        {/* Mobile bezel */}
        <div className="absolute inset-x-0 top-0 z-10 flex h-2 items-center justify-center bg-black/50">
          <div className="h-0.5 w-4 rounded-full bg-white/20" />
        </div>
        {/* Mobile screen */}
        <div className="absolute inset-0 scale-[1.15] pt-2">
          {renderMockupContent()}
        </div>
      </div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — ResultIndicator
// Animated result metric display
// ============================================================

interface ResultIndicatorProps {
  result: ProjectResult;
  accentColor: AccentColor;
  isVisible: boolean;
}

const ResultIndicator = memo(function ResultIndicator({
  result,
  accentColor,
  isVisible,
}: ResultIndicatorProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Animated counter effect
  useEffect(() => {
    if (!valueRef.current || !isVisible || prefersReducedMotion) return;

    const element = valueRef.current;
    const finalValue = result.value;

    // Check if it's a numeric value
    const numMatch = finalValue.match(/^([+-]?)(\d+)/);
    if (numMatch) {
      const prefix = numMatch[1] || "";
      const suffix = finalValue.replace(/^[+-]?\d+/, "");
      const targetNum = parseInt(numMatch[2], 10);

      gsap.fromTo(
        { val: 0 },
        { val: targetNum },
        {
          val: targetNum,
          duration: ANIMATION.COUNTER.DURATION,
          ease: ANIMATION.COUNTER.EASE,
          onUpdate: function () {
            element.textContent = `${prefix}${Math.round(this.targets()[0].val)}${suffix}`;
          },
        },
      );
    }
  }, [isVisible, result.value, prefersReducedMotion]);

  const colorClass = {
    primary: "text-amber-500",
    secondary: "text-cyan-500",
    accent: "text-violet-500",
    success: "text-emerald-500",
  }[accentColor];

  const bgClass = {
    primary: "bg-amber-500",
    secondary: "bg-cyan-500",
    accent: "bg-violet-500",
    success: "bg-emerald-500",
  }[accentColor];

  const iconMap: Record<string, ReactNode> = {
    speed: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    traffic: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    leads: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    time: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-3">
      {/* Icon */}
      <div
        className={`flex h-8 w-8 items-center justify-center border ${colorClass} border-current/30 bg-current/10`}
      >
        <span className={colorClass}>{iconMap[result.icon]}</span>
      </div>

      {/* Metric */}
      <div>
        <div className={`text-lg font-bold ${colorClass} sm:text-xl`}>
          <span ref={valueRef}>{result.value}</span>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-widest text-white/40 sm:text-[10px]">
          {result.metric}
        </div>
      </div>

      {/* Progress bar */}
      <div className="ml-auto hidden h-1.5 w-16 overflow-hidden bg-white/10 sm:block">
        <div
          className={`h-full ${bgClass} opacity-60 transition-all duration-1000`}
          style={{ width: isVisible ? "100%" : "0%" }}
        />
      </div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — ServiceBadge
// Service tag with color coding
// ============================================================

interface ServiceBadgeProps {
  label: string;
  service: ServiceType;
}

const ServiceBadge = memo(function ServiceBadge({
  label,
  service,
}: ServiceBadgeProps) {
  const color = SERVICE_COLORS[service];
  const colorClass = {
    primary: "border-amber-500/30 text-amber-500/80",
    secondary: "border-cyan-500/30 text-cyan-500/80",
    accent: "border-violet-500/30 text-violet-500/80",
    success: "border-emerald-500/30 text-emerald-500/80",
  }[color];

  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.05em] sm:text-[10px] ${colorClass}`}
    >
      {label}
    </span>
  );
});

// ============================================================
// SUB-COMPONENT — IndustryTag
// Industry label with icon
// ============================================================

interface IndustryTagProps {
  industry: IndustryType;
  label: string;
}

const IndustryTag = memo(function IndustryTag({
  industry,
  label,
}: IndustryTagProps) {
  const color = INDUSTRY_COLORS[industry];
  const bgClass = {
    primary: "bg-amber-500",
    secondary: "bg-cyan-500",
    accent: "bg-violet-500",
    success: "bg-emerald-500",
  }[color];

  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 ${bgClass}`} aria-hidden="true" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 sm:text-xs">
        {label}
      </span>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — ProjectCard
// Main project card component
// ============================================================

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  isVisible: boolean;
}

const ProjectCard = memo(
  forwardRef<HTMLElement, ProjectCardProps>(function ProjectCard(
    { project, index, isVisible },
    ref,
  ) {
    const cardRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const accentColor = INDUSTRY_COLORS[project.industry];

    // Hover animations
    const handleMouseEnter = useCallback(() => {
      if (prefersReducedMotion) return;

      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: ANIMATION.CARD.HOVER_LIFT,
          duration: ANIMATION.CARD.HOVER_DURATION,
          ease: ANIMATION.CARD.HOVER_EASE,
        });
      }

      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: ANIMATION.OVERLAY.DURATION,
        });
      }
    }, [prefersReducedMotion]);

    const handleMouseLeave = useCallback(() => {
      if (prefersReducedMotion) return;

      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: 0,
          duration: ANIMATION.CARD.HOVER_DURATION,
          ease: ANIMATION.CARD.HOVER_EASE,
        });
      }

      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: ANIMATION.OVERLAY.DURATION,
        });
      }
    }, [prefersReducedMotion]);

    const borderColorClass = {
      primary: "border-amber-500/20 hover:border-amber-500/40",
      secondary: "border-cyan-500/20 hover:border-cyan-500/40",
      accent: "border-violet-500/20 hover:border-violet-500/40",
      success: "border-emerald-500/20 hover:border-emerald-500/40",
    }[accentColor];

    const glowClass = {
      primary: "hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]",
      secondary: "hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]",
      accent: "hover:shadow-[0_0_40px_rgba(109,40,217,0.1)]",
      success: "hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]",
    }[accentColor];

    return (
      <article
        ref={ref}
        className="will-change-transform"
        aria-labelledby={`project-title-${project.id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          className={`
            group relative overflow-hidden
            border bg-white/2
            backdrop-blur-sm
            transition-colors duration-300
            will-change-transform
            ${borderColorClass}
            ${glowClass}
          `}
          style={{ boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.3)" }}
        >
          {/* Light streak */}
          <LightStreak color={COLOR_VALUES[accentColor]} />

          {/* System markers */}
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 z-20 font-mono text-[9px] uppercase tracking-[0.15em] text-white/20 sm:right-4 sm:top-4 sm:text-[10px]"
          >
            {project.systemId}
          </span>

          {/* Top accent line */}
          <div
            aria-hidden="true"
            className={`absolute left-0 right-0 top-0 h-px ${
              {
                primary: "bg-amber-500/40",
                secondary: "bg-cyan-500/40",
                accent: "bg-violet-500/40",
                success: "bg-emerald-500/40",
              }[accentColor]
            }`}
          />

          {/* Image/Mockup area */}
          <div className="relative overflow-hidden bg-linear-to-br from-white/2 to-transparent p-4 sm:p-6">
            <DeviceMockup
              variant={project.mockupVariant}
              accentColor={accentColor}
            />

            {/* Hover overlay */}
            <div
              ref={overlayRef}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity"
            >
              <a
                href={project.caseStudyUrl}
                className={`
                  group/btn flex items-center gap-2 border px-4 py-2 font-semibold
                  transition-all duration-300
                  ${
                    {
                      primary:
                        "border-amber-500 bg-amber-500 text-black hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]",
                      secondary:
                        "border-cyan-500 bg-cyan-500 text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
                      accent:
                        "border-violet-500 bg-violet-500 text-white hover:shadow-[0_0_20px_rgba(109,40,217,0.5)]",
                      success:
                        "border-emerald-500 bg-emerald-500 text-black hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]",
                    }[accentColor]
                  }
                `}
                aria-label={`View case study for ${project.name}`}
              >
                <span>View Case Study</span>
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Content area */}
          <div className="relative z-10 border-t border-white/10 p-4 sm:p-6">
            {/* Industry tag */}
            <div className="mb-3">
              <IndustryTag
                industry={project.industry}
                label={project.industryLabel}
              />
            </div>

            {/* Project name */}
            <h3
              id={`project-title-${project.id}`}
              className="mb-2 text-lg font-bold text-white sm:text-xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              {project.name}
            </h3>

            {/* Service badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {project.serviceLabels.map((label, i) => (
                <ServiceBadge
                  key={i}
                  label={label}
                  service={
                    project.services[Math.min(i, project.services.length - 1)]
                  }
                />
              ))}
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-white/60 line-clamp-2">
              {project.description}
            </p>

            {/* Result highlight */}
            <div className="mb-4 border-l-2 border-white/20 py-1 pl-3">
              <p className="text-xs text-white/50 sm:text-sm">
                <span className="mr-1 text-white/30">→</span>
                {project.resultHighlight}
              </p>
            </div>

            {/* Result indicator */}
            <div className="border-t border-white/10 pt-4">
              <ResultIndicator
                result={project.result}
                accentColor={accentColor}
                isVisible={isVisible}
              />
            </div>
          </div>

          {/* Corner brackets */}
          <div aria-hidden="true" className="pointer-events-none">
            <svg
              className="absolute bottom-0 right-0 h-4 w-4 text-white/10"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 0V16H0"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </article>
    );
  }),
);

// ============================================================
// SUB-COMPONENT — FilterTabs
// Category filter buttons
// ============================================================

interface FilterTabsProps {
  filters: typeof CONTENT.filters;
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const FilterTabs = memo(function FilterTabs({
  filters,
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Animate indicator on filter change
  useEffect(() => {
    const activeIndex = filters.findIndex((f) => f.id === activeFilter);
    const activeTab = tabRefs.current[activeIndex];

    if (!indicatorRef.current || !activeTab || prefersReducedMotion) return;

    gsap.to(indicatorRef.current, {
      x: activeTab.offsetLeft,
      width: activeTab.offsetWidth,
      duration: ANIMATION.FILTER.DURATION,
      ease: "power2.out",
    });
  }, [activeFilter, filters, prefersReducedMotion]);

  return (
    <div className="relative mb-8 inline-flex border border-white/10 bg-white/2  p-1 sm:mb-12">
      {/* Sliding indicator */}
      <div
        ref={indicatorRef}
        aria-hidden="true"
        className="absolute left-1 top-1 h-[calc(100%-8px)] bg-white/10"
        style={{ width: tabRefs.current[0]?.offsetWidth || 100 }}
      />

      {/* Filter buttons */}
      {filters.map((filter, index) => (
        <button
          key={filter.id}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          onClick={() => onFilterChange(filter.id)}
          className={`
            relative z-10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest
            transition-colors duration-300
            sm:px-4 sm:text-xs
            ${
              activeFilter === filter.id
                ? "text-white"
                : "text-white/40 hover:text-white/60"
            }
          `}
          aria-pressed={activeFilter === filter.id}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — CTAButton
// ============================================================

interface CTAButtonProps {
  children: ReactNode;
  href: string;
  ariaLabel: string;
}

const CTAButton = memo(function CTAButton({
  children,
  href,
  ariaLabel,
}: CTAButtonProps) {
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion || !shimmerRef.current) return;

    gsap.fromTo(
      shimmerRef.current,
      { xPercent: -100 },
      {
        xPercent: 100,
        duration: 0.6,
        ease: "power2.out",
      },
    );
  }, [prefersReducedMotion]);

  return (
    <a
      href={href}
      className="
        group relative inline-flex items-center gap-3
        overflow-hidden border border-cyan-500/30 bg-cyan-500/10
        px-6 py-3 font-semibold text-cyan-400
        transition-all duration-300
        hover:border-cyan-500/50 hover:bg-cyan-500/20
        hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]
        focus:outline-none focus:ring-2 focus:ring-cyan-500
        focus:ring-offset-2 focus:ring-offset-[#0B0F19]
        sm:px-8 sm:py-4
      "
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
    >
      <span
        ref={shimmerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/20 to-transparent will-change-transform"
        style={{ transform: "translateX(-100%)" }}
      />
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
});

// ============================================================
// SUB-COMPONENT — StatusBar
// ============================================================

const StatusBar = memo(function StatusBar() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!dotRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(dotRef.current, {
        opacity: ANIMATION.PULSE.OPACITY_MIN,
        duration: ANIMATION.PULSE.DURATION,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="flex items-center gap-2">
      <span
        ref={dotRef}
        className="h-1.5 w-1.5 bg-cyan-500 sm:h-2 sm:w-2"
        aria-hidden="true"
      />
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
        {CONTENT.projects.length} Projects Loaded
      </span>
    </div>
  );
});

// ============================================================
// MAIN COMPONENT — FeaturedProjectsSection
// ============================================================

const FeaturedProjectsSection = memo(function FeaturedProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(
    new Set(),
  );
  const prefersReducedMotion = useReducedMotion();

  // Filter projects based on active filter
  const filteredProjects =
    activeFilter === "all"
      ? CONTENT.projects
      : CONTENT.projects.filter((p) =>
          p.services.includes(activeFilter as ServiceType),
        );

  // Set project refs
  const setProjectRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      projectRefs.current[index] = el;
    },
    [],
  );

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        const headerElements =
          headerRef.current.querySelectorAll(".animate-item");
        gsap.set(headerElements, {
          opacity: 0,
          y: 30,
        });

        gsap.to(headerElements, {
          opacity: 1,
          y: 0,
          duration: ANIMATION.ENTRANCE.DURATION,
          stagger: ANIMATION.ENTRANCE.STAGGER,
          ease: ANIMATION.ENTRANCE.EASE,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Project cards animation
      projectRefs.current.forEach((el, index) => {
        if (!el) return;

        gsap.set(el, {
          opacity: 0,
          y: ANIMATION.ENTRANCE.Y_OFFSET,
          scale: ANIMATION.ENTRANCE.SCALE_START,
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: ANIMATION.ENTRANCE.DURATION,
              delay: index * 0.1,
              ease: ANIMATION.ENTRANCE.EASE,
              onComplete: () => {
                setVisibleProjects(
                  (prev) => new Set([...prev, CONTENT.projects[index]?.id]),
                );
              },
            });
          },
        });
      });

      // CTA animation
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: ctaRef.current,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(ctaRef.current, {
              opacity: 1,
              y: 0,
              duration: ANIMATION.ENTRANCE.DURATION,
              ease: ANIMATION.ENTRANCE.EASE,
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Handle filter animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    projectRefs.current.forEach((el) => {
      if (!el) return;

      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: ANIMATION.FILTER.DURATION,
          ease: "power2.out",
        },
      );
    });
  }, [activeFilter, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={CONTENT.sectionId}
      aria-labelledby="featured-projects-title"
      className="relative overflow-hidden bg-[#0B0F19] py-16 sm:py-24 lg:py-32"
    >
      {/* ====== BACKGROUND LAYERS ====== */}
      <GridOverlay />
      <AmbientGlow />

      {/* ====== CONTENT ====== */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* ====== HEADER ====== */}
        <div ref={headerRef} className="mb-8 sm:mb-12">
          {/* Status bar */}
          <div className="animate-item mb-4 will-change-transform">
            <StatusBar />
          </div>

          {/* Title */}
          <h2
            id="featured-projects-title"
            className="animate-item mb-4 text-3xl font-bold text-white will-change-transform sm:mb-6 sm:text-4xl lg:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="text-cyan-500">Featured</span> Projects
          </h2>

          {/* Intro text */}
          <p className="animate-item mb-6 max-w-2xl text-sm text-white/60 will-change-transform sm:mb-8 sm:text-base">
            {CONTENT.intro}
          </p>

          {/* Filter tabs */}
          <div className="animate-item will-change-transform">
            <FilterTabs
              filters={CONTENT.filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>

        {/* ====== PROJECTS GRID ====== */}
        <div
          className="mb-12 grid gap-6 sm:mb-16 sm:gap-8 md:grid-cols-2"
          role="list"
          aria-label="Featured projects"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              ref={setProjectRef(index)}
              project={project}
              index={index}
              isVisible={visibleProjects.has(project.id)}
            />
          ))}
        </div>

        {/* ====== CTA ====== */}
        <div ref={ctaRef} className="flex justify-center will-change-transform">
          <CTAButton href={CONTENT.cta.href} ariaLabel="View all case studies">
            {CONTENT.cta.text}
          </CTAButton>
        </div>

        {/* ====== BOTTOM INFO ====== */}
        <div
          aria-hidden="true"
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:mt-16"
        >
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/20 sm:text-xs">
            <span className="h-1.5 w-1.5 bg-cyan-500/60" />
            Updated Weekly
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/20 sm:text-xs">
            <span className="h-1.5 w-1.5 bg-cyan-500/60" />
            Real Client Work
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/20 sm:text-xs">
            <span className="h-1.5 w-1.5 bg-cyan-500/60" />
            Verified Results
          </span>
        </div>
      </div>

      {/* ====== BOTTOM DECORATIVE LINE ====== */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
      />
    </section>
  );
});

export default FeaturedProjectsSection;
