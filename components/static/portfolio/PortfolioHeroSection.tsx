// ============================================================
// FILE: app/components/PortfolioHeroSection.tsx
//
// Complete Portfolio Hero Section - Production Ready
// FIXED: Responsive design, no horizontal overflow
//
// Features:
// • Floating glass panel architecture
// • Device mockup displays (laptop + mobile)
// • GPU-accelerated animations
// • Staggered entrance sequence
// • Full WCAG 2.1 AA accessibility
// • Respects prefers-reduced-motion
// • Mobile-first responsive design
// • Command center aesthetic
// • NO horizontal scroll / overflow
// ============================================================

"use client";

import React, {
  memo,
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { gsap } from "gsap";

// ============================================================
// CONSTANTS — Animation Tokens
// ============================================================

const ANIMATION = {
  HERO_ENTRANCE: {
    DURATION: 0.8,
    STAGGER: 0.08,
    EASE: "power2.out",
    Y_OFFSET: 50,
    SCALE_START: 0.95,
  },
  DEVICE_ENTRANCE: {
    DURATION: 1,
    EASE: "power2.out",
    DELAY: 0.4,
  },
  LIGHT_STREAK: {
    DURATION: 15,
    WIDTH_PERCENT: 35,
    OPACITY: 0.04,
  },
  FLOATING: {
    DURATION: 6,
    Y_AMOUNT: 8,
    EASE: "sine.inOut",
  },
  SCAN_LINE: {
    DURATION: 3,
    OPACITY: 0.15,
  },
  PULSE: {
    DURATION: 2,
    OPACITY_MIN: 0.4,
    OPACITY_MAX: 1,
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

type AccentColor = "primary" | "secondary" | "accent";

// ============================================================
// CONSTANTS — Content Data
// ============================================================

interface HighlightItem {
  text: string;
  color: AccentColor;
}

interface CTAButton {
  text: string;
  href: string;
  variant: "primary" | "secondary";
}

interface HighlightWord {
  word: string;
  color: AccentColor;
}

const CONTENT = {
  sectionId: "portfolio-hero",
  systemLabel: "SYS::PORTFOLIO",

  headline: {
    text: "Our Portfolio: Websites Built to Convert, Rank, and Scale",
    highlights: [
      { word: "Convert", color: "primary" as AccentColor },
      { word: "Rank", color: "secondary" as AccentColor },
      { word: "Scale", color: "accent" as AccentColor },
    ],
  },

  subheadline:
    "Explore a selection of our work across web design, SEO, and AI automation. Every project is built with performance, growth, and real business results in mind.",

  highlights: [
    {
      text: "Custom Web Design & Development",
      color: "primary" as AccentColor,
    },
    {
      text: "SEO Growth  & Google Ranking Strategy",
      color: "secondary" as AccentColor,
    },
    {
      text: "AI Website Automation & Smart Tools",
      color: "accent" as AccentColor,
    },
    {
      text: "Premium UI/UX & Conversion-Focused Design",
      color: "primary" as AccentColor,
    },
  ] as HighlightItem[],

  ctas: [
    {
      text: "Request a Similar Project",
      href: "#contact",
      variant: "primary" as const,
    },
    {
      text: "Book a Free Consultation",
      href: "#consultation",
      variant: "secondary" as const,
    },
  ] as CTAButton[],

  stats: [
    { value: "50+", label: "Projects Delivered" },
    { value: "95%", label: "Client Satisfaction" },
    { value: "3x", label: "Avg. Conversion Lift" },
  ],

  deviceLabels: {
    laptop: "DISPLAY::DESKTOP",
    mobile: "DISPLAY::MOBILE",
    dashboard: "DISPLAY::AI_DASH",
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
// Precision grid background
// ============================================================

const GridOverlay = memo(function GridOverlay() {
  const gridSize = 72;
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
// Volumetric lighting effects
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
    top: "0%",
    left: "30%",
    color: COLORS.PRIMARY,
    size: "600px",
    opacity: 0.06,
  },
  {
    top: "20%",
    right: "10%",
    color: COLORS.SECONDARY,
    size: "500px",
    opacity: 0.05,
  },
  {
    bottom: "10%",
    left: "50%",
    color: COLORS.ACCENT,
    size: "400px",
    opacity: 0.04,
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
            filter: "blur(100px)",
          }}
        />
      ))}
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — SystemMarker
// Atmospheric monospace labels
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
// SUB-COMPONENT — ScanLine
// Animated scan line effect for devices
// ============================================================

interface ScanLineProps {
  color?: string;
}

const ScanLine = memo(function ScanLine({
  color = COLORS.SECONDARY,
}: ScanLineProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!lineRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { yPercent: 0 },
        {
          yPercent: 10000, // Move through the full height
          duration: ANIMATION.SCAN_LINE.DURATION,
          ease: "none",
          repeat: -1,
          force3D: true,
        },
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        ref={lineRef}
        className="absolute left-0 right-0 top-0 h-px will-change-transform"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          opacity: ANIMATION.SCAN_LINE.OPACITY,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — DeviceFrame
// Reusable device mockup frame
// ============================================================

interface DeviceFrameProps {
  type: "laptop" | "mobile" | "dashboard";
  label: string;
  children: ReactNode;
  className?: string;
  floatDelay?: number;
}

const DeviceFrame = memo(function DeviceFrame({
  type,
  label,
  children,
  className = "",
  floatDelay = 0,
}: DeviceFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Floating animation
  useEffect(() => {
    if (!frameRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(frameRef.current, {
        y: ANIMATION.FLOATING.Y_AMOUNT,
        duration: ANIMATION.FLOATING.DURATION,
        ease: ANIMATION.FLOATING.EASE,
        repeat: -1,
        yoyo: true,
        delay: floatDelay,
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, floatDelay]);

  const frameStyles: Record<typeof type, string> = {
    laptop: "aspect-[16/10]",
    mobile: "aspect-[9/19]",
    dashboard: "aspect-[4/3]",
  };

  return (
    <div
      ref={frameRef}
      className={`relative will-change-transform ${className}`}
    >
      {/* Device label */}
      <span
        aria-hidden="true"
        className="absolute -top-5 left-0 font-mono text-[9px] uppercase tracking-[0.15em] text-white/30 lg:-top-6 lg:text-[10px]"
      >
        {label}
      </span>

      {/* Device frame */}
      <div
        className={`
          relative overflow-hidden
          border border-white/20
          bg-white/3
          backdrop-blur-sm
          ${frameStyles[type]}
        `}
        style={{
          boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Top bezel with camera dot */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 z-10 flex h-4 items-center justify-center border-b border-white/10 bg-white/3 lg:h-6"
        >
          <div className="h-1 w-1 rounded-full bg-white/20 lg:h-1.5 lg:w-1.5" />
        </div>

        {/* Screen content */}
        <div className="absolute inset-0 pt-4 lg:pt-6">{children}</div>

        {/* Scan line effect */}
        <ScanLine />

        {/* Corner accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-0 top-4 h-6 w-px bg-linear-to-b from-cyan-500/50 to-transparent lg:top-6 lg:h-8" />
          <div className="absolute right-0 top-4 h-6 w-px bg-linear-to-b from-cyan-500/50 to-transparent lg:top-6 lg:h-8" />
        </div>
      </div>

      {/* Device stand/base for laptop */}
      {type === "laptop" && (
        <div
          aria-hidden="true"
          className="mx-auto h-1.5 w-1/3 bg-linear-to-b from-white/10 to-transparent lg:h-2"
        />
      )}
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — MockupScreen
// Simulated website/dashboard content
// ============================================================

interface MockupScreenProps {
  variant: "website" | "dashboard" | "mobile";
}

const MockupScreen = memo(function MockupScreen({
  variant,
}: MockupScreenProps) {
  if (variant === "dashboard") {
    return (
      <div className="h-full w-full bg-[#0a0e17] p-2 lg:p-3">
        {/* Dashboard header */}
        <div className="mb-2 flex items-center justify-between lg:mb-3">
          <div className="h-1.5 w-12 bg-white/20 lg:h-2 lg:w-16" />
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 bg-emerald-500/60 lg:h-2 lg:w-2" />
            <div className="h-1.5 w-1.5 bg-amber-500/60 lg:h-2 lg:w-2" />
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-2 grid grid-cols-3 gap-1 lg:mb-3 lg:gap-2">
          {[COLORS.PRIMARY, COLORS.SECONDARY, COLORS.ACCENT].map((color, i) => (
            <div
              key={i}
              className="border border-white/10 bg-white/2 p-1 lg:p-2"
            >
              <div
                className="mb-0.5 h-1 w-6 lg:mb-1 lg:h-1.5 lg:w-8"
                style={{ backgroundColor: `${color}60` }}
              />
              <div className="h-0.5 w-8 bg-white/30 lg:h-1 lg:w-12" />
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="h-10 border border-white/10 bg-white/2 p-1 lg:h-16 lg:p-2">
          <div className="flex h-full items-end gap-0.5 lg:gap-1">
            {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-cyan-500/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="h-full w-full bg-[#0a0e17] p-1.5 lg:p-2">
        {/* Mobile header */}
        <div className="mb-1.5 h-2 w-full bg-white/10 lg:mb-2 lg:h-3" />

        {/* Hero image placeholder */}
        <div className="mb-1.5 aspect-video w-full bg-linear-to-br from-cyan-500/20 to-violet-500/20 lg:mb-2" />

        {/* Content lines */}
        <div className="space-y-1 lg:space-y-1.5">
          <div className="h-1 w-full bg-white/20 lg:h-1.5" />
          <div className="h-1 w-4/5 bg-white/15 lg:h-1.5" />
          <div className="h-1 w-3/5 bg-white/10 lg:h-1.5" />
        </div>

        {/* CTA button */}
        <div className="mt-2 h-3 w-full bg-amber-500/40 lg:mt-3 lg:h-4" />
      </div>
    );
  }

  // Default: website variant
  return (
    <div className="h-full w-full bg-[#0a0e17]">
      {/* Navigation bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5 lg:px-4 lg:py-2">
        <div className="h-1.5 w-8 bg-white/30 lg:h-2 lg:w-12" />
        <div className="flex gap-2 lg:gap-3">
          <div className="h-1 w-6 bg-white/20 lg:h-1.5 lg:w-8" />
          <div className="h-1 w-6 bg-white/20 lg:h-1.5 lg:w-8" />
          <div className="hidden h-1.5 w-8 bg-white/20 lg:block" />
        </div>
      </div>

      {/* Hero section */}
      <div className="p-2 lg:p-4">
        <div className="mb-2 h-2 w-3/4 bg-white/30 lg:mb-3 lg:h-3" />
        <div className="mb-1.5 h-1.5 w-full bg-white/15 lg:mb-2 lg:h-2" />
        <div className="mb-3 h-1.5 w-2/3 bg-white/10 lg:mb-4 lg:h-2" />

        {/* CTA buttons */}
        <div className="flex gap-1.5 lg:gap-2">
          <div className="h-2.5 w-12 bg-amber-500/50 lg:h-3 lg:w-16" />
          <div className="h-2.5 w-12 border border-white/20 lg:h-3 lg:w-16" />
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-1.5 px-2 lg:gap-2 lg:px-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square border border-white/10 bg-white/2 p-1 lg:p-2"
          >
            <div className="mb-0.5 h-1/2 bg-linear-to-br from-cyan-500/20 to-transparent lg:mb-1" />
            <div className="h-0.5 w-full bg-white/20 lg:h-1" />
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — MobileDeviceShowcase
// Device display for tablet/mobile screens
// ============================================================

const MobileDeviceShowcase = memo(function MobileDeviceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const devices = containerRef.current.querySelectorAll(".device-item");

    const ctx = gsap.context(() => {
      gsap.set(devices, {
        opacity: 0,
        y: 30,
        scale: 0.95,
      });

      gsap.to(devices, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION.DEVICE_ENTRANCE.DURATION,
        stagger: 0.12,
        ease: ANIMATION.DEVICE_ENTRANCE.EASE,
        delay: ANIMATION.DEVICE_ENTRANCE.DELAY,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative mt-12 block lg:hidden"
      aria-hidden="true"
    >
      {/* Container with proper bounds */}
      <div className="relative mx-auto flex max-w-md items-end justify-center gap-4">
        {/* Laptop - main device */}
        <div className="device-item relative z-20 w-[65%] max-w-70 will-change-transform">
          <DeviceFrame
            type="laptop"
            label={CONTENT.deviceLabels.laptop}
            floatDelay={0}
          >
            <MockupScreen variant="website" />
          </DeviceFrame>
        </div>

        {/* Mobile - secondary device */}
        <div className="device-item relative z-30 w-[20%] max-w-20 will-change-transform">
          <DeviceFrame
            type="mobile"
            label={CONTENT.deviceLabels.mobile}
            floatDelay={0.5}
          >
            <MockupScreen variant="mobile" />
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — DesktopDeviceShowcase
// Device display for desktop screens
// ============================================================

const DesktopDeviceShowcase = memo(function DesktopDeviceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const devices = containerRef.current.querySelectorAll(".device-item");

    const ctx = gsap.context(() => {
      gsap.set(devices, {
        opacity: 0,
        y: 40,
        scale: 0.9,
      });

      gsap.to(devices, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION.DEVICE_ENTRANCE.DURATION,
        stagger: 0.15,
        ease: ANIMATION.DEVICE_ENTRANCE.EASE,
        delay: ANIMATION.DEVICE_ENTRANCE.DELAY,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:block"
      aria-hidden="true"
    >
      {/* Container with proper bounds - prevents overflow */}
      <div className="relative w-full max-w-125 xl:max-w-137.5">
        {/* Main laptop display */}
        <div className="device-item relative z-20 mx-auto w-[85%] will-change-transform">
          <DeviceFrame
            type="laptop"
            label={CONTENT.deviceLabels.laptop}
            floatDelay={0}
          >
            <MockupScreen variant="website" />
          </DeviceFrame>
        </div>

        {/* Mobile device - positioned bottom right, WITHIN container */}
        <div className="device-item absolute -bottom-4 right-0 z-30 w-[22%] max-w-25 will-change-transform xl:w-[24%] xl:max-w-27.5">
          <DeviceFrame
            type="mobile"
            label={CONTENT.deviceLabels.mobile}
            floatDelay={0.5}
          >
            <MockupScreen variant="mobile" />
          </DeviceFrame>
        </div>

        {/* Dashboard preview - positioned top right, WITHIN container */}
        <div className="device-item absolute -top-8 right-0 z-10 w-[40%] max-w-45 will-change-transform xl:w-[42%] xl:max-w-50">
          <DeviceFrame
            type="dashboard"
            label={CONTENT.deviceLabels.dashboard}
            floatDelay={1}
          >
            <MockupScreen variant="dashboard" />
          </DeviceFrame>
        </div>

        {/* Decorative connection lines - contained */}
        <svg
          className="absolute right-[15%] top-1/2 h-24 w-24 -translate-y-1/2 text-white/10"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 50 Q 50 50 50 0"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <path
            d="M0 50 Q 50 50 50 100"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — HighlightedHeadline
// Headline with semantic color highlighting
// ============================================================

interface HighlightedHeadlineProps {
  text: string;
  highlights: readonly HighlightWord[];
}

const HIGHLIGHT_CLASSES: Record<AccentColor, string> = {
  primary: "text-amber-500",
  secondary: "text-cyan-500",
  accent: "text-violet-500",
};

const HighlightedHeadline = memo(function HighlightedHeadline({
  text,
  highlights,
}: HighlightedHeadlineProps) {
  const pattern = highlights.map((h) => h.word).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return (
    <h1
      className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl"
      style={{ letterSpacing: "-0.02em" }}
    >
      {parts.map((part, index) => {
        const highlight = highlights.find(
          (h) => h.word.toLowerCase() === part.toLowerCase(),
        );

        if (highlight) {
          return (
            <span key={index} className={HIGHLIGHT_CLASSES[highlight.color]}>
              {part}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </h1>
  );
});

// ============================================================
// SUB-COMPONENT — HighlightBadge
// Individual highlight item with checkmark
// ============================================================

interface HighlightBadgeProps {
  text: string;
  color: AccentColor;
}

const HighlightBadge = memo(function HighlightBadge({
  text,
  color,
}: HighlightBadgeProps) {
  const colorClasses: Record<AccentColor, string> = {
    primary: "text-amber-500 border-amber-500/30",
    secondary: "text-cyan-500 border-cyan-500/30",
    accent: "text-violet-500 border-violet-500/30",
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Checkmark icon */}
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border sm:h-5 sm:w-5 ${colorClasses[color]}`}
      >
        <svg
          className="h-2.5 w-2.5 sm:h-3 sm:w-3"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="2 6 5 9 10 3" />
        </svg>
      </span>

      {/* Text */}
      <span className="text-xs text-white/70 sm:text-sm">{text}</span>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — CTAButton
// Call-to-action buttons with variants
// ============================================================

interface CTAButtonProps {
  children: ReactNode;
  href: string;
  variant: "primary" | "secondary";
  ariaLabel: string;
}

const CTAButton = memo(function CTAButton({
  children,
  href,
  variant,
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
        duration: ANIMATION.HOVER.DURATION * 2,
        ease: ANIMATION.HOVER.EASE,
      },
    );
  }, [prefersReducedMotion]);

  const variantClasses = {
    primary: `
      bg-amber-500 text-black
      hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]
    `,
    secondary: `
      bg-white/5 text-white border border-white/20
      hover:bg-white/10 hover:border-white/30
    `,
  };

  return (
    <a
      href={href}
      className={`
        group relative inline-flex items-center justify-center gap-2
        overflow-hidden px-4 py-2.5 text-xs font-semibold
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-amber-500
        focus:ring-offset-2 focus:ring-offset-[#0B0F19]
        sm:px-6 sm:py-3 sm:text-sm
        md:px-8 md:py-4 md:text-base
        ${variantClasses[variant]}
      `}
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
    >
      <span
        ref={shimmerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent will-change-transform"
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
// SUB-COMPONENT — StatItem
// Individual statistic display
// ============================================================

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem = memo(function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div
        className="text-lg font-bold text-white sm:text-2xl md:text-3xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-white/40 sm:mt-1 sm:text-[10px]">
        {label}
      </div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — StatusIndicator
// Active status with pulse
// ============================================================

interface StatusIndicatorProps {
  text: string;
}

const StatusIndicator = memo(function StatusIndicator({
  text,
}: StatusIndicatorProps) {
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
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40 sm:text-xs"
    >
      <span
        ref={dotRef}
        className="h-1.5 w-1.5 bg-emerald-500 sm:h-2 sm:w-2"
        style={{ opacity: ANIMATION.PULSE.OPACITY_MAX }}
      />
      {text}
    </span>
  );
});

// ============================================================
// SUB-COMPONENT — ScrollIndicator
// Animated scroll down indicator
// ============================================================

const ScrollIndicator = memo(function ScrollIndicator() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!arrowRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(arrowRef.current, {
        y: 8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex sm:bottom-8"
      aria-hidden="true"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/30 sm:text-[10px]">
        Scroll to Explore
      </span>
      <div ref={arrowRef} className="will-change-transform">
        <svg
          className="h-4 w-4 text-white/30 sm:h-5 sm:w-5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 4v12M5 11l5 5 5-5" />
        </svg>
      </div>
    </div>
  );
});

// ============================================================
// MAIN COMPONENT — PortfolioHeroSection
// ============================================================

const PortfolioHeroSection = memo(function PortfolioHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Entrance animations
  useEffect(() => {
    if (!contentRef.current || prefersReducedMotion) return;

    const elements = contentRef.current.querySelectorAll(".animate-item");

    const ctx = gsap.context(() => {
      gsap.set(elements, {
        opacity: 0,
        y: ANIMATION.HERO_ENTRANCE.Y_OFFSET,
        scale: ANIMATION.HERO_ENTRANCE.SCALE_START,
      });

      gsap.to(elements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION.HERO_ENTRANCE.DURATION,
        stagger: ANIMATION.HERO_ENTRANCE.STAGGER,
        ease: ANIMATION.HERO_ENTRANCE.EASE,
        force3D: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={CONTENT.sectionId}
      aria-labelledby="portfolio-hero-title"
      className="relative min-h-screen overflow-hidden bg-[#0B0F19]"
    >
      {/* ====== BACKGROUND LAYERS ====== */}
      <GridOverlay />
      <AmbientGlow />

      {/* ====== MAIN CONTENT ====== */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div
          ref={contentRef}
          className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 py-20   sm:py-24 md:py-28   lg:py-32"
        >
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            {/* ====== LEFT COLUMN: Content ====== */}
            <div className="max-w-xl lg:max-w-none">
              {/* Status indicator */}
              <div className="animate-item mb-4 will-change-transform sm:mb-6">
                <StatusIndicator text="PORTFOLIO ACTIVE" />
              </div>

              {/* Headline */}
              <div className="animate-item mb-4 will-change-transform sm:mb-6">
                <HighlightedHeadline
                  text={CONTENT.headline.text}
                  highlights={CONTENT.headline.highlights}
                />
              </div>

              {/* Subheadline */}
              <p
                className="animate-item mb-6 text-sm leading-relaxed text-white/60 will-change-transform sm:mb-8 sm:text-base lg:text-lg"
                style={{ lineHeight: 1.7 }}
              >
                {CONTENT.subheadline}
              </p>

              {/* Highlights */}
              <div className="animate-item mb-8 grid gap-2 will-change-transform sm:mb-10 sm:grid-cols-2 sm:gap-3">
                {CONTENT.highlights.map((highlight, index) => (
                  <HighlightBadge
                    key={index}
                    text={highlight.text}
                    color={highlight.color}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="animate-item mb-8 flex flex-col gap-3 will-change-transform sm:mb-12 sm:flex-row sm:gap-4">
                {CONTENT.ctas.map((cta, index) => (
                  <CTAButton
                    key={index}
                    href={cta.href}
                    variant={cta.variant}
                    ariaLabel={cta.text}
                  >
                    {cta.text}
                  </CTAButton>
                ))}
              </div>

              {/* Stats */}
              <div className="animate-item will-change-transform">
                <div className="inline-flex w-full items-center justify-center gap-4 border border-white/10 bg-white/2 px-4 py-3 backdrop-blur-sm sm:w-auto sm:gap-8 sm:px-6 sm:py-4 md:gap-12 md:px-8">
                  {CONTENT.stats.map((stat, index) => (
                    <React.Fragment key={stat.label}>
                      <StatItem value={stat.value} label={stat.label} />
                      {index < CONTENT.stats.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="h-6 w-px bg-white/10 sm:h-8"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Mobile Device Showcase - Shows below content on mobile/tablet */}
              <MobileDeviceShowcase />
            </div>

            {/* ====== RIGHT COLUMN: Desktop Device Showcase ====== */}
            <DesktopDeviceShowcase />
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

export default PortfolioHeroSection;
