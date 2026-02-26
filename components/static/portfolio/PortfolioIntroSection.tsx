// ============================================================
// FILE: app/components/PortfolioIntroSection.tsx
//
// Complete Portfolio Intro Section - Production Ready
// Creative "System Analysis Dashboard" aesthetic
//
// Features:
// • Animated system modules for principles
// • Radar/pulse visualization
// • Code syntax decorations
// • GPU-accelerated animations
// • Connection lines between elements
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
    STAGGER: 0.1,
    EASE: "power2.out",
    Y_OFFSET: 40,
    SCALE_START: 0.95,
  },
  MODULE: {
    STAGGER: 0.08,
    DURATION: 0.5,
  },
  PULSE: {
    DURATION: 2,
    SCALE_MAX: 1.5,
    OPACITY_END: 0,
  },
  RADAR: {
    DURATION: 4,
    EASE: "none",
  },
  SCAN: {
    DURATION: 2.5,
  },
  CONNECTION: {
    DURATION: 0.8,
    STAGGER: 0.15,
  },
  TYPE: {
    DURATION: 0.03, // Per character
  },
  HOVER: {
    DURATION: 0.3,
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

const COLOR_VALUES: Record<AccentColor, string> = {
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  accent: COLORS.ACCENT,
  success: COLORS.SUCCESS,
};

const COLOR_CLASSES: Record<
  AccentColor,
  { text: string; border: string; bg: string }
> = {
  primary: {
    text: "text-amber-500",
    border: "border-amber-500/30",
    bg: "bg-amber-500",
  },
  secondary: {
    text: "text-cyan-500",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500",
  },
  accent: {
    text: "text-violet-500",
    border: "border-violet-500/30",
    bg: "bg-violet-500",
  },
  success: {
    text: "text-emerald-500",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500",
  },
};

// ============================================================
// CONSTANTS — Content Data
// ============================================================

interface PrincipleData {
  id: string;
  text: string;
  code: string;
  color: AccentColor;
  status: string;
  value: string;
}

interface HighlightWord {
  word: string;
  color: AccentColor;
}

const CONTENT = {
  sectionId: "portfolio-intro",
  systemLabel: "SYS::ANALYSIS",

  headline: {
    text: "Real Projects. Real Results. Smart Execution.",
    highlights: [
      { word: "Real Projects", color: "primary" as AccentColor },
      { word: "Real Results", color: "secondary" as AccentColor },
      { word: "Smart Execution", color: "accent" as AccentColor },
    ],
  },

  paragraphs: [
    "Our portfolio reflects what we believe in: building websites that are not only visually impressive, but strategically engineered for growth.",
    "From high-converting landing pages to full-scale e-commerce platforms and AI-powered automation systems, we deliver solutions that help businesses attract customers and scale efficiently.",
  ],

  introStatement: "Every project you see here is designed with:",

  principles: [
    {
      id: "performance",
      text: "Performance Optimization",
      code: "PERF_OPT",
      color: "primary" as AccentColor,
      status: "ACTIVE",
      value: "98/100",
    },
    {
      id: "seo",
      text: "SEO-Ready Structure",
      code: "SEO_STRUCT",
      color: "secondary" as AccentColor,
      status: "ACTIVE",
      value: "100%",
    },
    {
      id: "uiux",
      text: "Premium UI/UX",
      code: "UI_UX_PRO",
      color: "accent" as AccentColor,
      status: "ACTIVE",
      value: "AAA",
    },
    {
      id: "conversion",
      text: "Conversion Psychology",
      code: "CONV_PSY",
      color: "primary" as AccentColor,
      status: "ACTIVE",
      value: "+340%",
    },
    {
      id: "scalable",
      text: "Scalable Development",
      code: "SCALE_DEV",
      color: "secondary" as AccentColor,
      status: "ACTIVE",
      value: "∞",
    },
    {
      id: "automation",
      text: "Automation Potential",
      code: "AUTO_SYS",
      color: "accent" as AccentColor,
      status: "ACTIVE",
      value: "AI+",
    },
  ] as PrincipleData[],

  systemStatus: {
    label: "ANALYSIS COMPLETE",
    modules: "6/6 MODULES ACTIVE",
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
    top: "20%",
    left: "20%",
    color: COLORS.SECONDARY,
    size: "500px",
    opacity: 0.05,
  },
  {
    bottom: "20%",
    right: "20%",
    color: COLORS.ACCENT,
    size: "450px",
    opacity: 0.04,
  },
  {
    top: "50%",
    left: "60%",
    color: COLORS.PRIMARY,
    size: "400px",
    opacity: 0.03,
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
// SUB-COMPONENT — RadarPulse
// Animated radar effect in background
// ============================================================

const RadarPulse = memo(function RadarPulse() {
  const radarRef = useRef<HTMLDivElement>(null);
  const pulseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!radarRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Rotating radar line
      gsap.to(radarRef.current, {
        rotation: 360,
        duration: ANIMATION.RADAR.DURATION,
        ease: ANIMATION.RADAR.EASE,
        repeat: -1,
        transformOrigin: "left center",
      });

      // Pulse rings
      pulseRefs.current.forEach((pulse, i) => {
        if (!pulse) return;
        gsap.fromTo(
          pulse,
          {
            scale: 0.2,
            opacity: 0.6,
          },
          {
            scale: ANIMATION.PULSE.SCALE_MAX,
            opacity: ANIMATION.PULSE.OPACITY_END,
            duration: ANIMATION.PULSE.DURATION,
            repeat: -1,
            delay: i * 0.6,
            ease: "power1.out",
          },
        );
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-8 top-1/2 hidden h-64 w-64 -translate-y-1/2 lg:block xl:right-16 xl:h-80 xl:w-80"
    >
      {/* Radar circles */}
      <div className="absolute inset-0 rounded-full border border-white/5" />
      <div className="absolute inset-8 rounded-full border border-white/5" />
      <div className="absolute inset-16 rounded-full border border-white/5" />

      {/* Center dot */}
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/60" />

      {/* Radar sweep line */}
      <div
        ref={radarRef}
        className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left -translate-y-1/2 will-change-transform"
        style={{
          background: `linear-gradient(90deg, ${COLORS.SECONDARY}60 0%, transparent 100%)`,
        }}
      />

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/30 will-change-transform"
        />
      ))}

      {/* Data points */}
      <div className="absolute left-[30%] top-[25%] h-1.5 w-1.5 rounded-full bg-amber-500/60" />
      <div className="absolute left-[70%] top-[40%] h-1.5 w-1.5 rounded-full bg-violet-500/60" />
      <div className="absolute left-[45%] top-[70%] h-1.5 w-1.5 rounded-full bg-cyan-500/60" />
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — TypeWriter
// Animated typing effect for code
// ============================================================

interface TypeWriterProps {
  text: string;
  delay?: number;
  className?: string;
}

const TypeWriter = memo(function TypeWriter({
  text,
  delay = 0,
  className = "",
}: TypeWriterProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!textRef.current || prefersReducedMotion) {
      // Show full text immediately if reduced motion
      if (textRef.current) {
        textRef.current.textContent = text;
      }
      return;
    }

    const ctx = gsap.context(() => {
      const element = textRef.current;
      if (!element) return;

      element.textContent = "";

      const chars = text.split("");
      let currentText = "";

      gsap.to(
        {},
        {
          duration: chars.length * ANIMATION.TYPE.DURATION,
          delay,
          onUpdate: function () {
            const progress = this.progress();
            const charIndex = Math.floor(progress * chars.length);
            const newText = chars.slice(0, charIndex + 1).join("");
            if (newText !== currentText) {
              currentText = newText;
              element.textContent = currentText;
            }
          },
        },
      );
    });

    return () => ctx.revert();
  }, [text, delay, prefersReducedMotion]);

  return <span ref={textRef} className={className} />;
});

// ============================================================
// SUB-COMPONENT — CodeBlock
// Decorative code syntax block
// ============================================================

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

const CodeBlock = memo(function CodeBlock({
  children,
  className = "",
}: CodeBlockProps) {
  return (
    <div
      aria-hidden="true"
      className={`
        border border-white/10 bg-white/2
        font-mono text-[10px] text-white/40
        backdrop-blur-sm
        sm:text-xs
        ${className}
      `}
    >
      {/* Code header */}
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500/60" />
        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/60" />
        <div className="h-1.5 w-1.5 rounded-full bg-green-500/60" />
        <span className="ml-2 text-white/30">analysis.config</span>
      </div>

      {/* Code content */}
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — ModuleCard
// Individual principle module with animations
// ============================================================

interface ModuleCardProps {
  data: PrincipleData;
  index: number;
}

const ModuleCard = memo(
  forwardRef<HTMLDivElement, ModuleCardProps>(function ModuleCard(
    { data, index },
    ref,
  ) {
    const cardRef = useRef<HTMLDivElement>(null);
    const scanRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const colors = COLOR_CLASSES[data.color];

    // Hover scan effect
    const handleMouseEnter = useCallback(() => {
      if (prefersReducedMotion || !scanRef.current) return;

      gsap.fromTo(
        scanRef.current,
        { yPercent: -100, opacity: 0.5 },
        {
          yPercent: 200,
          opacity: 0,
          duration: ANIMATION.SCAN.DURATION,
          ease: "power1.out",
        },
      );
    }, [prefersReducedMotion]);

    return (
      <div
        ref={ref}
        className="will-change-transform"
        onMouseEnter={handleMouseEnter}
      >
        <div
          ref={cardRef}
          className={`
            group relative overflow-hidden
            border bg-white/2
            p-3 backdrop-blur-sm
            transition-all duration-300
            hover:bg-white/4
            sm:p-4
            ${colors.border}
          `}
          style={{ borderRadius: 0 }}
        >
          {/* Scan line effect */}
          <div
            ref={scanRef}
            aria-hidden="true"
            className={`
              pointer-events-none absolute inset-x-0 h-8
              bg-linear-to-b from-transparent to-transparent
              opacity-0 will-change-transform
              ${colors.text}
            `}
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${COLOR_VALUES[data.color]}20 50%, transparent 100%)`,
            }}
          />

          {/* Top accent line */}
          <div
            aria-hidden="true"
            className={`absolute left-0 right-0 top-0 h-px ${colors.bg} opacity-40`}
          />

          {/* Module header */}
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.15em] sm:text-[10px] ${colors.text}`}
            >
              {data.code}
            </span>
            <span className="flex items-center gap-1 font-mono text-[8px] text-white/40 sm:text-[9px]">
              <span className={`h-1 w-1 rounded-full ${colors.bg}`} />
              {data.status}
            </span>
          </div>

          {/* Module title */}
          <p className="mb-2 text-sm font-medium text-white/80 sm:text-base">
            {data.text}
          </p>

          {/* Module value */}
          <div className="flex items-center justify-between">
            <span
              className={`font-mono text-lg font-bold sm:text-xl ${colors.text}`}
            >
              {data.value}
            </span>

            {/* Progress indicator */}
            <div className="h-1 w-16 overflow-hidden bg-white/10 sm:w-20">
              <div
                className={`h-full ${colors.bg} opacity-60`}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Corner bracket */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white/10"
            >
              <path d="M16 0V16H0" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>
    );
  }),
);

// ============================================================
// SUB-COMPONENT — HighlightedHeadline
// ============================================================

interface HighlightedHeadlineProps {
  text: string;
  highlights: readonly HighlightWord[];
}

const HIGHLIGHT_CLASSES_TEXT: Record<AccentColor, string> = {
  primary: "text-amber-500",
  secondary: "text-cyan-500",
  accent: "text-violet-500",
  success: "text-emerald-500",
};

const HighlightedHeadline = memo(function HighlightedHeadline({
  text,
  highlights,
}: HighlightedHeadlineProps) {
  // Split by highlight phrases
  const pattern = highlights
    .map((h) => h.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return (
    <h2
      id="portfolio-intro-title"
      className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl"
      style={{ letterSpacing: "-0.02em" }}
    >
      {parts.map((part, index) => {
        const highlight = highlights.find(
          (h) => h.word.toLowerCase() === part.toLowerCase(),
        );

        if (highlight) {
          return (
            <span
              key={index}
              className={HIGHLIGHT_CLASSES_TEXT[highlight.color]}
            >
              {part}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </h2>
  );
});

// ============================================================
// SUB-COMPONENT — StatusBar
// Animated status indicator bar
// ============================================================

interface StatusBarProps {
  label: string;
  modules: string;
}

const StatusBar = memo(function StatusBar({ label, modules }: StatusBarProps) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!dotRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(dotRef.current, {
        opacity: 0.4,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50 sm:text-xs">
        <span
          ref={dotRef}
          className="h-1.5 w-1.5 bg-emerald-500 sm:h-2 sm:w-2"
        />
        {label}
      </span>

      <span
        aria-hidden="true"
        className="hidden h-3 w-px bg-white/20 sm:block"
      />

      <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 sm:text-xs">
        {modules}
      </span>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — ConnectionLines
// SVG connection lines between elements
// ============================================================

const ConnectionLines = memo(function ConnectionLines() {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      pathRefs.current.forEach((path, i) => {
        if (!path) return;

        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: ANIMATION.CONNECTION.DURATION,
          delay: i * ANIMATION.CONNECTION.STAGGER,
          ease: "power2.out",
          scrollTrigger: {
            trigger: path,
            start: "top 90%",
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.SECONDARY} stopOpacity="0" />
          <stop offset="50%" stopColor={COLORS.SECONDARY} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.SECONDARY} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal connecting line */}
      <path
        ref={(el) => {
          pathRefs.current[0] = el;
        }}
        d="M 0 50% L 100% 50%"
        stroke="url(#lineGradient1)"
        strokeWidth="1"
        fill="none"
        className="hidden lg:block"
      />
    </svg>
  );
});

// ============================================================
// SUB-COMPONENT — GlassPanel
// Reusable glass panel container
// ============================================================

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  accentColor?: AccentColor;
}

const GlassPanel = memo(function GlassPanel({
  children,
  className = "",
  accentColor = "secondary",
}: GlassPanelProps) {
  const colors = COLOR_CLASSES[accentColor];

  return (
    <div
      className={`
        relative overflow-hidden
        border border-white/10
        bg-white/3
        backdrop-blur-sm
        ${className}
      `}
      style={{
        boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Top accent line */}
      <div
        aria-hidden="true"
        className={`absolute left-0 right-0 top-0 h-px ${colors.bg} opacity-30`}
      />

      {/* Corner markers */}
      <div aria-hidden="true" className="pointer-events-none">
        <svg
          className="absolute left-0 top-0 h-3 w-3 text-white/15"
          viewBox="0 0 12 12"
        >
          <path
            d="M0 12V0H12"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <svg
          className="absolute right-0 top-0 h-3 w-3 text-white/15"
          viewBox="0 0 12 12"
        >
          <path
            d="M12 12V0H0"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 h-3 w-3 text-white/15"
          viewBox="0 0 12 12"
        >
          <path
            d="M0 0V12H12"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <svg
          className="absolute bottom-0 right-0 h-3 w-3 text-white/15"
          viewBox="0 0 12 12"
        >
          <path
            d="M12 0V12H0"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {children}
    </div>
  );
});

// ============================================================
// MAIN COMPONENT — PortfolioIntroSection
// ============================================================

const PortfolioIntroSection = memo(function PortfolioIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Set module ref
  const setModuleRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      modulesRef.current[index] = el;
    },
    [],
  );

  // Entrance animations
  useEffect(() => {
    if (!contentRef.current || prefersReducedMotion) return;

    const elements = contentRef.current.querySelectorAll(".animate-item");
    const modules = modulesRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      // Main content animation
      gsap.set(elements, {
        opacity: 0,
        y: ANIMATION.ENTRANCE.Y_OFFSET,
        scale: ANIMATION.ENTRANCE.SCALE_START,
      });

      gsap.to(elements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION.ENTRANCE.DURATION,
        stagger: ANIMATION.ENTRANCE.STAGGER,
        ease: ANIMATION.ENTRANCE.EASE,
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Module cards animation
      gsap.set(modules, {
        opacity: 0,
        y: 30,
        scale: 0.95,
      });

      gsap.to(modules, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION.MODULE.DURATION,
        stagger: ANIMATION.MODULE.STAGGER,
        ease: ANIMATION.ENTRANCE.EASE,
        force3D: true,
        scrollTrigger: {
          trigger: modulesRef.current[0],
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={CONTENT.sectionId}
      aria-labelledby="portfolio-intro-title"
      className="relative overflow-hidden bg-[#0B0F19] py-16 sm:py-24 lg:py-16"
    >
      {/* ====== BACKGROUND LAYERS ====== */}
      <GridOverlay />
      <AmbientGlow />

      {/* ====== RADAR VISUALIZATION ====== */}
      <RadarPulse />

      {/* ====== MAIN CONTENT ====== */}
      <div
        ref={contentRef}
        className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* ====== LEFT COLUMN: Content ====== */}
          <div className="max-w-xl lg:max-w-none">
            {/* Status bar */}
            <div className="animate-item mb-6 will-change-transform">
              <StatusBar
                label={CONTENT.systemStatus.label}
                modules={CONTENT.systemStatus.modules}
              />
            </div>

            {/* Headline */}
            <div className="animate-item mb-6 will-change-transform sm:mb-8">
              <HighlightedHeadline
                text={CONTENT.headline.text}
                highlights={CONTENT.headline.highlights}
              />
            </div>

            {/* Paragraphs in glass panel */}
            <div className="animate-item mb-8 will-change-transform sm:mb-10">
              <GlassPanel className="p-4 sm:p-6" accentColor="secondary">
                {CONTENT.paragraphs.map((para, index) => (
                  <p
                    key={index}
                    className={`text-sm leading-relaxed text-white/60 sm:text-base ${
                      index < CONTENT.paragraphs.length - 1 ? "mb-4" : ""
                    }`}
                    style={{ lineHeight: 1.75 }}
                  >
                    {para}
                  </p>
                ))}
              </GlassPanel>
            </div>

            {/* Intro statement with code decoration */}
            <div className="animate-item will-change-transform">
              <CodeBlock className="max-w-md">
                <div className="mb-2 text-cyan-500/60">
                  {"// System configuration"}
                </div>
                <div className="text-white/60">
                  <span className="text-violet-400">const</span>{" "}
                  <span className="text-amber-400">projectConfig</span>{" "}
                  <span className="text-white/40">=</span>{" "}
                  <span className="text-white/40">{"{"}</span>
                </div>
                <div className="ml-4 text-white/50">
                  <span className="text-cyan-400">designedWith</span>
                  <span className="text-white/40">:</span>{" "}
                  <span className="text-emerald-400">[</span>
                </div>
                {CONTENT.principles.slice(0, 3).map((p, i) => (
                  <div key={i} className="ml-8 text-amber-300/80">
                    "{p.text.toLowerCase()}"
                    {i < 2 && <span className="text-white/40">,</span>}
                  </div>
                ))}
                <div className="ml-4 text-white/50">
                  <span className="text-emerald-400">]</span>
                </div>
                <div className="text-white/40">{"}"}</div>
              </CodeBlock>
            </div>
          </div>

          {/* ====== RIGHT COLUMN: Modules Grid ====== */}
          <div className="relative">
            {/* Section label */}
            <div className="mb-4 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-px grow bg-linear-to-r from-white/20 to-transparent"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 sm:text-xs">
                Active Modules
              </span>
              <span
                aria-hidden="true"
                className="h-px w-8 bg-linear-to-l from-white/20 to-transparent"
              />
            </div>

            {/* Modules grid */}
            <div
              className="grid gap-3 sm:grid-cols-2 sm:gap-4"
              role="list"
              aria-label="Project design principles"
            >
              {CONTENT.principles.map((principle, index) => (
                <ModuleCard
                  key={principle.id}
                  ref={setModuleRef(index)}
                  data={principle}
                  index={index}
                />
              ))}
            </div>

            {/* Summary indicator */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 sm:text-xs">
                All systems operational
              </span>
              <div className="flex gap-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 bg-emerald-500/60"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </div>
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

export default PortfolioIntroSection;
