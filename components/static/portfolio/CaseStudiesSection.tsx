// ============================================================
// FILE: app/components/CaseStudiesSection.tsx
//
// Complete Case Studies Section - Production Ready
// FIXED: Timeline animation runs once per page refresh
//
// Features:
// • Timeline animation triggers once per page load
// • Challenge → Solution → Outcome flow
// • Animated progress indicators
// • Result metrics with counters
// • GPU-accelerated animations
// • Full WCAG 2.1 AA accessibility
// • SEO-optimized structure
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
    STAGGER: 0.1,
    EASE: "power2.out",
    Y_OFFSET: 40,
  },
  TIMELINE: {
    PHASE_DELAY: 600, // ms between phases
    INITIAL_DELAY: 400, // ms before first phase
  },
  COUNTER: {
    DURATION: 1.5,
    EASE: "power2.out",
  },
  PROGRESS: {
    DURATION: 1.2,
    EASE: "power2.out",
  },
  PULSE: {
    DURATION: 2,
    OPACITY_MIN: 0.4,
    OPACITY_MAX: 1,
  },
  LIGHT_STREAK: {
    DURATION: 14,
    OPACITY: 0.035,
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
  WARNING: "#EF4444",
  DARK_BG: "#0B0F19",
} as const;

type AccentColor = "primary" | "secondary" | "accent" | "success";
type PhaseType = "challenge" | "solution" | "outcome";
type ServiceType = "design" | "seo" | "ai" | "maintenance" | "development";

const COLOR_VALUES: Record<AccentColor, string> = {
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  accent: COLORS.ACCENT,
  success: COLORS.SUCCESS,
};

const PHASE_COLORS: Record<PhaseType, AccentColor> = {
  challenge: "primary",
  solution: "secondary",
  outcome: "success",
};

const PHASE_ICONS: Record<PhaseType, string> = {
  challenge: "⚠",
  solution: "⚙",
  outcome: "✓",
};

// ============================================================
// CONSTANTS — Content Data
// ============================================================

interface OutcomeMetric {
  label: string;
  value: string;
  suffix?: string;
  icon: "speed" | "traffic" | "time" | "conversion" | "ranking";
}

interface CaseStudyData {
  id: string;
  number: string;
  title: string;
  clientType: string;
  clientDescription: string;
  challenge: {
    summary: string;
    points: string[];
  };
  solution: {
    summary: string;
    steps: string[];
  };
  outcome: {
    summary: string;
    metrics: OutcomeMetric[];
  };
  services: ServiceType[];
  serviceLabels: string[];
  caseStudyUrl: string;
  accentColor: AccentColor;
  systemId: string;
  duration: string;
}

const CONTENT = {
  sectionId: "case-studies",
  systemLabel: "SYS::CASE_STUDIES",

  headline: {
    main: "Case Studies",
    sub: "Strategy, Execution & Outcomes",
  },

  intro:
    "Every successful project starts with a challenge. Our case studies show how we solve real business problems using smart design, advanced SEO systems, and custom AI automation.",

  journeyLabels: {
    challenge: "The Challenge",
    solution: "Our Solution",
    outcome: "The Outcome",
  },

  caseStudies: [
    {
      id: "case-1",
      number: "01",
      title: "SEO + Website Performance Upgrade",
      clientType: "Service-Based Business",
      clientDescription:
        "A growing service provider struggling to compete in search results and convert website visitors into qualified leads.",
      challenge: {
        summary:
          "The client had a slow website, low Google rankings, and poor conversion rates.",
        points: [
          "Page load time exceeding 8 seconds",
          "Ranking on page 3+ for key terms",
          "Conversion rate below 1%",
          "Poor mobile experience",
        ],
      },
      solution: {
        summary:
          "We redesigned the website structure, improved speed, implemented technical SEO fixes, and optimized content based on keyword mapping.",
        steps: [
          "Complete performance audit & optimization",
          "Technical SEO implementation",
          "Content restructuring with keyword mapping",
          "Conversion-focused UX redesign",
          "Mobile-first responsive rebuild",
        ],
      },
      outcome: {
        summary:
          "The website became faster, more user-friendly, and SEO-ready, leading to increased visibility and higher lead generation.",
        metrics: [
          {
            label: "Page Speed",
            value: "94",
            suffix: "/100",
            icon: "speed" as const,
          },
          {
            label: "Organic Traffic",
            value: "+185",
            suffix: "%",
            icon: "traffic" as const,
          },
          {
            label: "Load Time",
            value: "1.2",
            suffix: "s",
            icon: "time" as const,
          },
          {
            label: "Conversion Rate",
            value: "+240",
            suffix: "%",
            icon: "conversion" as const,
          },
        ],
      },
      services: ["design", "seo", "development"] as ServiceType[],
      serviceLabels: [
        "Web Design",
        "Technical SEO",
        "Performance Optimization",
      ],
      caseStudyUrl: "#case-study-1",
      accentColor: "primary" as AccentColor,
      systemId: "CASE::001",
      duration: "8 weeks",
    },
    {
      id: "case-2",
      number: "02",
      title: "Full Website + AI Automation Integration",
      clientType: "Business Platform",
      clientDescription:
        "A B2B platform handling high volumes of customer inquiries needed smarter systems to scale support operations.",
      challenge: {
        summary:
          "The client struggled with high customer support volume and slow lead response.",
        points: [
          "24+ hour average response time",
          "Support team overwhelmed with repetitive questions",
          "Lost leads due to slow follow-up",
          "No qualification system for inquiries",
        ],
      },
      solution: {
        summary:
          "We built an AI assistant inside the website to answer FAQs, guide users, and automate lead qualification.",
        steps: [
          "AI chatbot development & training",
          "Knowledge base integration",
          "Automated lead scoring system",
          "Smart routing & escalation",
          "Analytics dashboard implementation",
        ],
      },
      outcome: {
        summary:
          "Support workload decreased significantly, and lead response time improved dramatically.",
        metrics: [
          {
            label: "Response Time",
            value: "-65",
            suffix: "%",
            icon: "time" as const,
          },
          {
            label: "Support Tickets",
            value: "-45",
            suffix: "%",
            icon: "traffic" as const,
          },
          {
            label: "Lead Qualification",
            value: "+90",
            suffix: "%",
            icon: "conversion" as const,
          },
          {
            label: "Customer Satisfaction",
            value: "4.8",
            suffix: "/5",
            icon: "ranking" as const,
          },
        ],
      },
      services: ["ai", "development", "maintenance"] as ServiceType[],
      serviceLabels: [
        "AI Integration",
        "Automation Tools",
        "Dashboard Development",
      ],
      caseStudyUrl: "#case-study-2",
      accentColor: "accent" as AccentColor,
      systemId: "CASE::002",
      duration: "12 weeks",
    },
    {
      id: "case-3",
      number: "03",
      title: "E-Commerce SEO & Conversion System",
      clientType: "Online Store",
      clientDescription:
        "An e-commerce business with a large product catalog but minimal organic visibility and abandoned cart issues.",
      challenge: {
        summary:
          "Low organic traffic, weak product SEO structure, and poor checkout conversion.",
        points: [
          "Only 12% of products indexed by Google",
          "Zero first-page rankings",
          "Cart abandonment rate over 80%",
          "Confusing navigation structure",
        ],
      },
      solution: {
        summary:
          "We rebuilt the category architecture, optimized product pages, improved technical SEO, and redesigned the checkout experience.",
        steps: [
          "Category architecture restructuring",
          "Product page SEO optimization",
          "Schema markup implementation",
          "Checkout flow redesign",
          "Trust signal integration",
        ],
      },
      outcome: {
        summary:
          "More indexed pages, improved rankings, and a stronger conversion rate.",
        metrics: [
          {
            label: "Pages Indexed",
            value: "98",
            suffix: "%",
            icon: "ranking" as const,
          },
          {
            label: "Organic Traffic",
            value: "+320",
            suffix: "%",
            icon: "traffic" as const,
          },
          {
            label: "Cart Abandonment",
            value: "-35",
            suffix: "%",
            icon: "conversion" as const,
          },
          {
            label: "Revenue Growth",
            value: "+180",
            suffix: "%",
            icon: "speed" as const,
          },
        ],
      },
      services: ["seo", "design", "development"] as ServiceType[],
      serviceLabels: ["SEO Strategy", "UX Redesign", "Conversion Optimization"],
      caseStudyUrl: "#case-study-3",
      accentColor: "secondary" as AccentColor,
      systemId: "CASE::003",
      duration: "10 weeks",
    },
  ] as CaseStudyData[],

  cta: {
    text: "Request a Case Study PDF",
    href: "#contact",
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
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    />
  );
});

// ============================================================
// SUB-COMPONENT — AmbientGlow
// ============================================================

const AmbientGlow = memo(function AmbientGlow() {
  const glows = [
    {
      top: "15%",
      left: "10%",
      color: COLORS.PRIMARY,
      size: "500px",
      opacity: 0.04,
    },
    {
      top: "50%",
      right: "5%",
      color: COLORS.SECONDARY,
      size: "550px",
      opacity: 0.045,
    },
    {
      bottom: "10%",
      left: "30%",
      color: COLORS.ACCENT,
      size: "450px",
      opacity: 0.035,
    },
    {
      top: "70%",
      right: "25%",
      color: COLORS.SUCCESS,
      size: "400px",
      opacity: 0.03,
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {glows.map((glow, index) => (
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
// SUB-COMPONENT — PhaseIndicator
// ============================================================

interface PhaseIndicatorProps {
  phase: PhaseType;
  number: number;
  isActive: boolean;
  isComplete: boolean;
}

const PhaseIndicator = memo(function PhaseIndicator({
  phase,
  number,
  isActive,
  isComplete,
}: PhaseIndicatorProps) {
  const color = PHASE_COLORS[phase];
  const icon = PHASE_ICONS[phase];

  const colorClasses = {
    primary: {
      bg: "bg-amber-500",
      border: "border-amber-500",
      text: "text-amber-500",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    },
    secondary: {
      bg: "bg-cyan-500",
      border: "border-cyan-500",
      text: "text-cyan-500",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.4)]",
    },
    accent: {
      bg: "bg-violet-500",
      border: "border-violet-500",
      text: "text-violet-500",
      glow: "shadow-[0_0_20px_rgba(109,40,217,0.4)]",
    },
    success: {
      bg: "bg-emerald-500",
      border: "border-emerald-500",
      text: "text-emerald-500",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    },
  }[color];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          flex h-10 w-10 items-center justify-center
          border-2 text-lg font-bold
          transition-all duration-500
          sm:h-12 sm:w-12 sm:text-xl
          ${
            isActive || isComplete
              ? `${colorClasses.bg} ${colorClasses.border} text-black ${colorClasses.glow}`
              : "border-white/20 bg-white/5 text-white/40"
          }
        `}
      >
        {isComplete ? icon : number}
      </div>

      <span
        className={`
          font-mono text-[9px] uppercase tracking-widest
          transition-colors duration-300
          sm:text-[10px]
          ${isActive || isComplete ? colorClasses.text : "text-white/40"}
        `}
      >
        {CONTENT.journeyLabels[phase]}
      </span>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — TimelineConnector
// ============================================================

interface TimelineConnectorProps {
  isActive: boolean;
  color: AccentColor;
}

const TimelineConnector = memo(function TimelineConnector({
  isActive,
  color,
}: TimelineConnectorProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!lineRef.current || prefersReducedMotion) {
      // For reduced motion, show immediately if active
      if (lineRef.current && isActive) {
        lineRef.current.style.transform = "scaleX(1)";
      }
      return;
    }

    // Only animate once when becoming active
    if (isActive && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      gsap.to(lineRef.current, {
        scaleX: 1,
        duration: ANIMATION.PROGRESS.DURATION,
        ease: ANIMATION.PROGRESS.EASE,
      });
    }
  }, [isActive, prefersReducedMotion]);

  const colorClass = {
    primary: "bg-amber-500",
    secondary: "bg-cyan-500",
    accent: "bg-violet-500",
    success: "bg-emerald-500",
  }[color];

  return (
    <div className="relative mx-2 hidden h-0.5 flex-1 bg-white/10 sm:mx-4 sm:block">
      <div
        ref={lineRef}
        className={`absolute inset-0 origin-left ${colorClass}`}
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — ChallengeCard
// ============================================================

interface ChallengeCardProps {
  challenge: CaseStudyData["challenge"];
  isVisible: boolean;
}

const ChallengeCard = memo(function ChallengeCard({
  challenge,
  isVisible,
}: ChallengeCardProps) {
  return (
    <div
      className={`
        border border-amber-500/20 bg-amber-500/5
        p-4 backdrop-blur-sm
        transition-all duration-500
        sm:p-6
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-amber-500/30 bg-amber-500/10">
          <span className="text-amber-500">⚠</span>
        </div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-amber-500">
          The Challenge
        </h4>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-white/70 sm:text-base">
        {challenge.summary}
      </p>

      <ul className="space-y-2">
        {challenge.points.map((point, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-white/60"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-red-500/60" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — SolutionCard
// ============================================================

interface SolutionCardProps {
  solution: CaseStudyData["solution"];
  isVisible: boolean;
}

const SolutionCard = memo(function SolutionCard({
  solution,
  isVisible,
}: SolutionCardProps) {
  const stepsRef = useRef<(HTMLLIElement | null)[]>([]);
  const hasAnimatedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Only animate once when becoming visible
    if (!isVisible || hasAnimatedRef.current || prefersReducedMotion) return;

    hasAnimatedRef.current = true;

    stepsRef.current.forEach((step, i) => {
      if (!step) return;

      gsap.fromTo(
        step,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          delay: i * 0.1 + 0.3,
          ease: "power2.out",
        },
      );
    });
  }, [isVisible, prefersReducedMotion]);

  return (
    <div
      className={`
        border border-cyan-500/20 bg-cyan-500/5
        p-4 backdrop-blur-sm
        transition-all duration-500
        sm:p-6
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-cyan-500/30 bg-cyan-500/10">
          <span className="text-cyan-500">⚙</span>
        </div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-500">
          Our Solution
        </h4>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-white/70 sm:text-base">
        {solution.summary}
      </p>

      <ol className="space-y-2">
        {solution.steps.map((step, index) => (
          <li
            key={index}
            ref={(el) => {
              stepsRef.current[index] = el;
            }}
            className="flex items-start gap-3 text-sm text-white/60"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-cyan-500/30 bg-cyan-500/10 font-mono text-[10px] text-cyan-500">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — OutcomeCard
// ============================================================

interface OutcomeCardProps {
  outcome: CaseStudyData["outcome"];
  isVisible: boolean;
}

const OutcomeCard = memo(function OutcomeCard({
  outcome,
  isVisible,
}: OutcomeCardProps) {
  return (
    <div
      className={`
        border border-emerald-500/20 bg-emerald-500/5
        p-4 backdrop-blur-sm
        transition-all duration-500
        sm:p-6
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-emerald-500/30 bg-emerald-500/10">
          <span className="text-emerald-500">✓</span>
        </div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-500">
          The Outcome
        </h4>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-white/70 sm:text-base">
        {outcome.summary}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {outcome.metrics.map((metric, index) => (
          <MetricDisplay
            key={index}
            metric={metric}
            isVisible={isVisible}
            delay={index * 0.15}
          />
        ))}
      </div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — MetricDisplay
// ============================================================

interface MetricDisplayProps {
  metric: OutcomeMetric;
  isVisible: boolean;
  delay: number;
}

const MetricDisplay = memo(function MetricDisplay({
  metric,
  isVisible,
  delay,
}: MetricDisplayProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Only animate once when becoming visible
    if (
      !valueRef.current ||
      !isVisible ||
      hasAnimatedRef.current ||
      prefersReducedMotion
    ) {
      // For reduced motion, show final value immediately
      if (valueRef.current && prefersReducedMotion && isVisible) {
        valueRef.current.textContent = metric.value;
      }
      return;
    }

    hasAnimatedRef.current = true;

    const element = valueRef.current;
    const finalValue = metric.value;

    const numMatch = finalValue.match(/^([+-]?)(\d+(?:\.\d+)?)/);
    if (numMatch) {
      const prefix = numMatch[1] || "";
      const numValue = parseFloat(numMatch[2]);

      gsap.fromTo(
        { val: 0 },
        { val: numValue },
        {
          val: numValue,
          duration: ANIMATION.COUNTER.DURATION,
          delay: delay + 0.5,
          ease: ANIMATION.COUNTER.EASE,
          onUpdate: function () {
            const current = this.targets()[0].val;
            const formatted =
              numValue % 1 === 0 ? Math.round(current) : current.toFixed(1);
            element.textContent = `${prefix}${formatted}`;
          },
        },
      );
    }
  }, [isVisible, metric.value, delay, prefersReducedMotion]);

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
    conversion: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 20V10M18 20V4M6 20v-4" />
      </svg>
    ),
    ranking: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  };

  return (
    <div className="border border-emerald-500/10 bg-emerald-500/5 p-3 text-center">
      <div className="mb-2 flex justify-center text-emerald-500/60">
        {iconMap[metric.icon]}
      </div>

      <div className="mb-1 text-xl font-bold text-emerald-400 sm:text-2xl">
        <span ref={valueRef}>{prefersReducedMotion ? metric.value : "0"}</span>
        <span className="text-emerald-400/60">{metric.suffix}</span>
      </div>

      <div className="font-mono text-[9px] uppercase tracking-widest text-white/40 sm:text-[10px]">
        {metric.label}
      </div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — ServiceTag
// ============================================================

interface ServiceTagProps {
  label: string;
  service: ServiceType;
}

const ServiceTag = memo(function ServiceTag({
  label,
  service,
}: ServiceTagProps) {
  const colorMap: Record<ServiceType, string> = {
    design: "border-amber-500/30 text-amber-500/80 bg-amber-500/5",
    seo: "border-cyan-500/30 text-cyan-500/80 bg-cyan-500/5",
    ai: "border-violet-500/30 text-violet-500/80 bg-violet-500/5",
    maintenance: "border-emerald-500/30 text-emerald-500/80 bg-emerald-500/5",
    development: "border-cyan-500/30 text-cyan-500/80 bg-cyan-500/5",
  };

  return (
    <span
      className={`
        inline-flex items-center border px-2 py-1
        font-mono text-[9px] uppercase tracking-[0.05em]
        sm:text-[10px]
        ${colorMap[service]}
      `}
    >
      {label}
    </span>
  );
});

// ============================================================
// SUB-COMPONENT — CaseStudyCard
// FIXED: Animation runs once per page refresh
// ============================================================

interface CaseStudyCardProps {
  caseStudy: CaseStudyData;
  index: number;
}

const CaseStudyCard = memo(
  forwardRef<HTMLElement, CaseStudyCardProps>(function CaseStudyCard(
    { caseStudy, index },
    ref,
  ) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [activePhase, setActivePhase] = useState<number>(0);
    const hasAnimatedRef = useRef(false);
    const timersRef = useRef<NodeJS.Timeout[]>([]);
    const prefersReducedMotion = useReducedMotion();

    // Timeline animation - runs ONCE when card enters viewport
    useEffect(() => {
      if (!cardRef.current) return;

      // If already animated, don't set up observer
      if (hasAnimatedRef.current) {
        setActivePhase(3);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Only animate if entering viewport AND not already animated
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            // Mark as animated immediately to prevent re-triggering
            hasAnimatedRef.current = true;

            if (prefersReducedMotion) {
              // Skip animation, show final state
              setActivePhase(3);
            } else {
              // Run the timeline animation sequence
              const timer1 = setTimeout(() => {
                setActivePhase(1);
              }, ANIMATION.TIMELINE.INITIAL_DELAY);

              const timer2 = setTimeout(() => {
                setActivePhase(2);
              }, ANIMATION.TIMELINE.INITIAL_DELAY + ANIMATION.TIMELINE.PHASE_DELAY);

              const timer3 = setTimeout(
                () => {
                  setActivePhase(3);
                },
                ANIMATION.TIMELINE.INITIAL_DELAY +
                  ANIMATION.TIMELINE.PHASE_DELAY * 2,
              );

              // Store timers for cleanup
              timersRef.current = [timer1, timer2, timer3];
            }

            // Disconnect observer after triggering animation
            observer.disconnect();
          }
        },
        { threshold: 0.3 },
      );

      observer.observe(cardRef.current);

      // Cleanup function
      return () => {
        observer.disconnect();
        // Clear any pending timers
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current = [];
      };
    }, [prefersReducedMotion]);

    const accentColorClass = {
      primary: "border-amber-500/20",
      secondary: "border-cyan-500/20",
      accent: "border-violet-500/20",
      success: "border-emerald-500/20",
    }[caseStudy.accentColor];

    const glowClass = {
      primary: "hover:shadow-[0_0_50px_rgba(245,158,11,0.1)]",
      secondary: "hover:shadow-[0_0_50px_rgba(6,182,212,0.1)]",
      accent: "hover:shadow-[0_0_50px_rgba(109,40,217,0.1)]",
      success: "hover:shadow-[0_0_50px_rgba(16,185,129,0.1)]",
    }[caseStudy.accentColor];

    return (
      <article
        ref={ref}
        className="will-change-transform"
        aria-labelledby={`case-study-title-${caseStudy.id}`}
      >
        <div
          ref={cardRef}
          className={`
            relative overflow-hidden
            border bg-white/2
            backdrop-blur-sm
            transition-all duration-500
            ${accentColorClass}
            ${glowClass}
          `}
          style={{ boxShadow: "0 4px 32px -4px rgba(0, 0, 0, 0.3)" }}
        >
          {/* Light streak effect */}
          <LightStreak color={COLOR_VALUES[caseStudy.accentColor]} />

          {/* Top accent line */}
          <div
            aria-hidden="true"
            className={`absolute left-0 right-0 top-0 h-px ${
              {
                primary:
                  "bg-linear-to-r from-transparent via-amber-500/50 to-transparent",
                secondary:
                  "bg-linear-to-r from-transparent via-cyan-500/50 to-transparent",
                accent:
                  "bg-linear-to-r from-transparent via-violet-500/50 to-transparent",
                success:
                  "bg-linear-to-r from-transparent via-emerald-500/50 to-transparent",
              }[caseStudy.accentColor]
            }`}
          />

          {/* ====== HEADER SECTION ====== */}
          <header className="relative z-10 border-b border-white/10 p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 sm:text-xs">
                {caseStudy.systemId}
              </span>
              <span
                className={`
                  text-4xl font-bold sm:text-5xl lg:text-6xl
                  ${
                    {
                      primary: "text-amber-500/20",
                      secondary: "text-cyan-500/20",
                      accent: "text-violet-500/20",
                      success: "text-emerald-500/20",
                    }[caseStudy.accentColor]
                  }
                `}
              >
                {caseStudy.number}
              </span>
            </div>

            <h3
              id={`case-study-title-${caseStudy.id}`}
              className="mb-3 text-xl font-bold text-white sm:text-2xl lg:text-3xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              {caseStudy.title}
            </h3>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`
                  flex items-center gap-2
                  font-mono text-[10px] uppercase tracking-widest
                  sm:text-xs
                  ${
                    {
                      primary: "text-amber-500/80",
                      secondary: "text-cyan-500/80",
                      accent: "text-violet-500/80",
                      success: "text-emerald-500/80",
                    }[caseStudy.accentColor]
                  }
                `}
              >
                <span
                  className={`h-1.5 w-1.5 ${
                    {
                      primary: "bg-amber-500",
                      secondary: "bg-cyan-500",
                      accent: "bg-violet-500",
                      success: "bg-emerald-500",
                    }[caseStudy.accentColor]
                  }`}
                />
                {caseStudy.clientType}
              </span>
              <span className="hidden text-white/20 sm:inline">|</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
                Duration: {caseStudy.duration}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-white/60 sm:text-base">
              {caseStudy.clientDescription}
            </p>
          </header>

          {/* ====== JOURNEY TIMELINE ====== */}
          <div className="relative z-10 border-b border-white/10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {/* Timeline indicators */}
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <PhaseIndicator
                phase="challenge"
                number={1}
                isActive={activePhase >= 1}
                isComplete={activePhase > 1}
              />
              <TimelineConnector
                isActive={activePhase >= 2}
                color="secondary"
              />
              <PhaseIndicator
                phase="solution"
                number={2}
                isActive={activePhase >= 2}
                isComplete={activePhase > 2}
              />
              <TimelineConnector isActive={activePhase >= 3} color="success" />
              <PhaseIndicator
                phase="outcome"
                number={3}
                isActive={activePhase >= 3}
                isComplete={activePhase >= 3}
              />
            </div>

            {/* Phase content cards */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <ChallengeCard
                challenge={caseStudy.challenge}
                isVisible={activePhase >= 1}
              />
              <SolutionCard
                solution={caseStudy.solution}
                isVisible={activePhase >= 2}
              />
              <OutcomeCard
                outcome={caseStudy.outcome}
                isVisible={activePhase >= 3}
              />
            </div>
          </div>

          {/* ====== FOOTER SECTION ====== */}
          <footer className="relative z-10 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:p-8">
            <div className="flex flex-wrap gap-2">
              {caseStudy.serviceLabels.map((label, i) => (
                <ServiceTag
                  key={i}
                  label={label}
                  service={
                    caseStudy.services[
                      Math.min(i, caseStudy.services.length - 1)
                    ]
                  }
                />
              ))}
            </div>

            <a
              href={caseStudy.caseStudyUrl}
              className={`
                group inline-flex items-center justify-center gap-2
                border px-4 py-2 font-semibold
                transition-all duration-300
                sm:px-6 sm:py-3
                ${
                  {
                    primary:
                      "border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/50",
                    secondary:
                      "border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-500/50",
                    accent:
                      "border-violet-500/30 text-violet-500 hover:bg-violet-500/10 hover:border-violet-500/50",
                    success:
                      "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/50",
                  }[caseStudy.accentColor]
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19]
                ${
                  {
                    primary: "focus:ring-amber-500",
                    secondary: "focus:ring-cyan-500",
                    accent: "focus:ring-violet-500",
                    success: "focus:ring-emerald-500",
                  }[caseStudy.accentColor]
                }
              `}
              aria-label={`View full case study for ${caseStudy.title}`}
            >
              <span>View Full Case Study</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </footer>

          {/* Corner brackets */}
          <div aria-hidden="true" className="pointer-events-none">
            <svg
              className="absolute bottom-0 right-0 h-4 w-4 text-white/10 sm:h-5 sm:w-5"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 0V16H0"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
            <svg
              className="absolute left-0 top-0 h-4 w-4 text-white/10 sm:h-5 sm:w-5"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 16V0H16"
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
        className="h-1.5 w-1.5 bg-emerald-500 sm:h-2 sm:w-2"
        aria-hidden="true"
      />
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
        {CONTENT.caseStudies.length} Success Stories
      </span>
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
        overflow-hidden bg-emerald-500 px-6 py-3
        font-semibold text-black
        transition-all duration-300
        hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]
        focus:outline-none focus:ring-2 focus:ring-emerald-500
        focus:ring-offset-2 focus:ring-offset-[#0B0F19]
        sm:px-8 sm:py-4
      "
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
    >
      <span
        ref={shimmerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent will-change-transform"
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
// SUB-COMPONENT — SectionHeadline
// ============================================================

const SectionHeadline = memo(function SectionHeadline() {
  return (
    <h2
      id="case-studies-title"
      className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
      style={{ letterSpacing: "-0.02em" }}
    >
      <span className="text-emerald-500">{CONTENT.headline.main}</span>
      <span className="mt-1 block text-2xl text-white/80 sm:mt-2 sm:text-3xl lg:text-4xl">
        {CONTENT.headline.sub}
      </span>
    </h2>
  );
});

// ============================================================
// MAIN COMPONENT — CaseStudiesSection
// ============================================================

const CaseStudiesSection = memo(function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const caseStudyRefs = useRef<(HTMLElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const setCaseStudyRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      caseStudyRefs.current[index] = el;
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

      // Case study cards animation
      caseStudyRefs.current.forEach((el) => {
        if (!el) return;

        gsap.set(el, {
          opacity: 0,
          y: ANIMATION.ENTRANCE.Y_OFFSET,
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: ANIMATION.ENTRANCE.DURATION,
              ease: ANIMATION.ENTRANCE.EASE,
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

  return (
    <section
      ref={sectionRef}
      id={CONTENT.sectionId}
      aria-labelledby="case-studies-title"
      className="relative overflow-hidden bg-[#0B0F19] py-16 sm:py-24 lg:py-16"
    >
      {/* ====== BACKGROUND LAYERS ====== */}
      <GridOverlay />
      <AmbientGlow />

      {/* ====== SYSTEM MARKERS ====== */}
      <SystemMarker
        text={CONTENT.systemLabel}
        position="top-left"
        showStatus
        statusColor="text-emerald-500/60"
        className="hidden sm:block"
      />
      <SystemMarker
        text="SECTION::004"
        position="top-right"
        className="hidden sm:block"
      />

      {/* ====== CONTENT ====== */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* ====== HEADER ====== */}
        <div ref={headerRef} className="mb-12 sm:mb-16 lg:mb-20">
          <div className="animate-item mb-4 will-change-transform">
            <StatusBar />
          </div>

          <div className="animate-item mb-6 will-change-transform">
            <SectionHeadline />
          </div>

          <p className="animate-item max-w-3xl text-sm leading-relaxed text-white/60 will-change-transform sm:text-base lg:text-lg">
            {CONTENT.intro}
          </p>
        </div>

        {/* ====== CASE STUDIES ====== */}
        <div
          className="mb-12 space-y-8 sm:mb-16 sm:space-y-12 lg:mb-20"
          role="list"
          aria-label="Case studies"
        >
          {CONTENT.caseStudies.map((caseStudy, index) => (
            <CaseStudyCard
              key={caseStudy.id}
              ref={setCaseStudyRef(index)}
              caseStudy={caseStudy}
              index={index}
            />
          ))}
        </div>

        {/* ====== CTA ====== */}
        <div
          ref={ctaRef}
          className="flex flex-col items-center gap-4 text-center will-change-transform"
        >
          <CTAButton
            href={CONTENT.cta.href}
            ariaLabel="Request case study PDF download"
          >
            {CONTENT.cta.text}
          </CTAButton>

          <span
            aria-hidden="true"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 sm:text-xs"
          >
            ◉ PDF Available
          </span>
        </div>

        {/* ====== BOTTOM INFO ====== */}
        <div
          aria-hidden="true"
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:mt-16"
        >
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/20 sm:text-xs">
            <span className="h-1.5 w-1.5 bg-emerald-500/60" />
            Real Client Results
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/20 sm:text-xs">
            <span className="h-1.5 w-1.5 bg-emerald-500/60" />
            Verified Data
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/20 sm:text-xs">
            <span className="h-1.5 w-1.5 bg-emerald-500/60" />
            Measurable ROI
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

export default CaseStudiesSection;
