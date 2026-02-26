// ============================================================
// FILE: app/components/ServicePackagesSection.tsx
//
// Complete Service Packages Section - Production Ready
// All-in-one component with no external dependencies beyond
// React, GSAP, and Tailwind
//
// Features:
// • Floating glass panel architecture
// • GPU-accelerated light streak animations
// • Scroll-triggered entrance animations
// • Featured package highlighting
// • Full WCAG 2.1 AA accessibility
// • Respects prefers-reduced-motion
// • Mobile-first responsive design
// • Sales-focused visual hierarchy
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
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ============================================================
// CONSTANTS — Animation Tokens
// ============================================================

const ANIMATION = {
  ENTRANCE: {
    DURATION: 0.6,
    STAGGER: 0.12,
    EASE: "power2.out",
    Y_OFFSET: 40,
    SCALE_START: 0.96,
  },
  LIGHT_STREAK: {
    DURATION: 10,
    WIDTH_PERCENT: 30,
    OPACITY: 0.05,
  },
  FEATURED_GLOW: {
    DURATION: 4,
    OPACITY_MIN: 0.3,
    OPACITY_MAX: 0.6,
  },
  STATUS_PULSE: {
    DURATION: 2,
    OPACITY_MIN: 0.4,
    OPACITY_MAX: 1,
  },
  HOVER: {
    DURATION: 0.3,
    EASE: "power2.out",
    LIFT: -4,
  },
  CHECKMARK: {
    DURATION: 0.4,
    STAGGER: 0.05,
    EASE: "power2.out",
  },
} as const;

// ============================================================
// CONSTANTS — Color System
// ============================================================

const COLORS = {
  PRIMARY: "#F59E0B", // Amber — warmth, action
  SECONDARY: "#06B6D4", // Cyan — clarity, growth
  ACCENT: "#6D28D9", // Violet — premium, AI
  SUCCESS: "#10B981", // Emerald — included, check
  DARK_BG: "#0B0F19",
} as const;

type AccentColor = "primary" | "secondary" | "accent";
type PackageTier = "starter" | "growth" | "enterprise";

const COLOR_VALUES: Record<AccentColor, string> = {
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  accent: COLORS.ACCENT,
};

const TIER_STYLES: Record<
  PackageTier,
  {
    accentColor: AccentColor;
    gradient: string;
    borderGlow: string;
    checkColor: string;
    badgeClass: string;
    ctaClass: string;
  }
> = {
  starter: {
    accentColor: "primary",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.PRIMARY}40 50%, transparent 100%)`,
    borderGlow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    checkColor: "text-amber-500",
    badgeClass: "border-amber-500/30 text-amber-500",
    ctaClass: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
  },
  growth: {
    accentColor: "secondary",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.SECONDARY}50 50%, transparent 100%)`,
    borderGlow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]",
    checkColor: "text-cyan-500",
    badgeClass: "bg-cyan-500 text-black",
    ctaClass:
      "bg-cyan-500 text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
  },
  enterprise: {
    accentColor: "accent",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.ACCENT}40 50%, transparent 100%)`,
    borderGlow: "hover:shadow-[0_0_30px_rgba(109,40,217,0.15)]",
    checkColor: "text-violet-500",
    badgeClass: "border-violet-500/30 text-violet-500",
    ctaClass: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
  },
};

// ============================================================
// CONSTANTS — Content Data
// ============================================================

interface PackageFeature {
  text: string;
  highlighted?: boolean;
}

interface PackageData {
  id: string;
  systemId: string;
  tier: PackageTier;
  name: string;
  tagline: string;
  features: PackageFeature[];
  ctaText: string;
  ctaHref: string;
  badge?: string;
  isFeatured: boolean;
  coordinates: string;
  version: string;
}

interface HighlightWord {
  word: string;
  color: AccentColor;
}

const CONTENT = {
  sectionId: "service-packages",
  systemLabel: "SYS::PACKAGES",

  headline: {
    text: "Choose the Right Service Package for Your Business",
    highlights: [
      { word: "Right", color: "secondary" as AccentColor },
      { word: "Package", color: "primary" as AccentColor },
    ],
  },

  subheadline: "Transparent pricing. Scalable solutions. No hidden fees.",

  packages: [
    {
      id: "starter",
      systemId: "PKG::STARTER",
      tier: "starter" as PackageTier,
      name: "Starter Growth",
      tagline: "Best for small businesses and startups.",
      features: [
        { text: "1 website (up to 5 pages)" },
        { text: "Basic SEO setup" },
        { text: "Responsive design" },
        { text: "Speed optimization" },
        { text: "Mobile-first approach" },
      ],
      ctaText: "Get Started",
      ctaHref: "#contact",
      isFeatured: false,
      coordinates: "52.5200°N 13.4050°E",
      version: "v1.0",
    },
    {
      id: "growth",
      systemId: "PKG::GROWTH",
      tier: "growth" as PackageTier,
      name: "SEO & Conversion Package",
      tagline: "Best for businesses that want more leads.",
      features: [
        { text: "Full website + landing pages", highlighted: true },
        { text: "Full SEO structure" },
        { text: "Conversion-focused UI/UX", highlighted: true },
        { text: "Monthly SEO support" },
        { text: "Analytics & reporting" },
        { text: "A/B testing setup" },
      ],
      ctaText: "Request Pricing",
      ctaHref: "#contact",
      badge: "MOST POPULAR",
      isFeatured: true,
      coordinates: "37.7749°N 122.4194°W",
      version: "v2.0",
    },
    {
      id: "enterprise",
      systemId: "PKG::ENTERPRISE",
      tier: "enterprise" as PackageTier,
      name: "AI Business Automation",
      tagline: "Best for companies that want smart systems.",
      features: [
        { text: "Full website development" },
        { text: "Advanced SEO growth plan", highlighted: true },
        { text: "Custom AI tools integration", highlighted: true },
        { text: "Automation dashboards" },
        { text: "AI customer support system", highlighted: true },
        { text: "Priority support" },
      ],
      ctaText: "Book a Demo",
      ctaHref: "#contact",
      badge: "ADVANCED",
      isFeatured: false,
      coordinates: "35.6762°N 139.6503°E",
      version: "v3.0",
    },
  ] as PackageData[],

  footer: {
    text: "Not sure which package fits your needs?",
    ctaText: "Schedule a Free Consultation",
    ctaHref: "#contact",
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
// Precision grid background (graph paper under glass effect)
// ============================================================

const GridOverlay = memo(function GridOverlay() {
  const gridSize = 72;
  const opacity = 0.025;

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
// Asymmetric radial gradients for volumetric depth
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
    top: "15%",
    left: "20%",
    color: COLORS.PRIMARY,
    size: "500px",
    opacity: 0.04,
  },
  {
    top: "30%",
    left: "50%",
    color: COLORS.SECONDARY,
    size: "600px",
    opacity: 0.05,
  },
  {
    bottom: "20%",
    right: "15%",
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
  "top-left": "top-3 left-3 sm:top-4 sm:left-4",
  "top-right": "top-3 right-3 sm:top-4 sm:right-4",
  "bottom-left": "bottom-3 left-3 sm:bottom-4 sm:left-4",
  "bottom-right": "bottom-3 right-3 sm:bottom-4 sm:right-4",
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
// SUB-COMPONENT — AccentLine
// Top edge gradient for glass panels
// ============================================================

interface AccentLineProps {
  gradient: string;
  isFeatured?: boolean;
}

const AccentLine = memo(function AccentLine({
  gradient,
  isFeatured = false,
}: AccentLineProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute left-0 right-0 top-0 ${isFeatured ? "h-0.5" : "h-px"}`}
      style={{ background: gradient }}
    />
  );
});

// ============================================================
// SUB-COMPONENT — CornerMarkers
// Structural corner brackets
// ============================================================

interface CornerMarkersProps {
  color?: string;
}

const CornerMarkers = memo(function CornerMarkers({
  color = "rgba(255, 255, 255, 0.15)",
}: CornerMarkersProps) {
  const size = 12;

  const corners: Array<{
    style: CSSProperties;
    path: string;
  }> = [
    { style: { top: -1, left: -1 }, path: "M0 12V0H12" },
    { style: { top: -1, right: -1 }, path: "M12 12V0H0" },
    { style: { bottom: -1, left: -1 }, path: "M0 0V12H12" },
    { style: { bottom: -1, right: -1 }, path: "M12 0V12H0" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none">
      {corners.map((corner, index) => (
        <svg
          key={index}
          className="absolute"
          style={{ ...corner.style, width: size, height: size }}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d={corner.path} stroke={color} strokeWidth="1" fill="none" />
        </svg>
      ))}
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — LightStreak
// Animated horizontal light sweep (GPU-accelerated)
// ============================================================

interface LightStreakProps {
  color: string;
  speed?: number;
}

const LightStreak = memo(function LightStreak({
  color,
  speed = ANIMATION.LIGHT_STREAK.DURATION,
}: LightStreakProps) {
  const streakRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!streakRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(streakRef.current, { xPercent: -100 });

      gsap.to(streakRef.current, {
        xPercent: 400,
        duration: speed,
        ease: "none",
        repeat: -1,
        force3D: true,
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, speed]);

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
        className="absolute inset-y-0 will-change-transform"
        style={{
          width: `${ANIMATION.LIGHT_STREAK.WIDTH_PERCENT}%`,
          background: `linear-gradient(90deg, transparent 0%, ${color}${opacityHex} 50%, transparent 100%)`,
        }}
      />
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — FeaturedGlow
// Animated glow effect for featured package
// ============================================================

interface FeaturedGlowProps {
  color: string;
}

const FeaturedGlow = memo(function FeaturedGlow({ color }: FeaturedGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!glowRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        opacity: ANIMATION.FEATURED_GLOW.OPACITY_MIN,
        duration: ANIMATION.FEATURED_GLOW.DURATION,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none absolute -inset-px will-change-transform"
      style={{
        background: `linear-gradient(135deg, ${color}20 0%, transparent 50%, ${color}20 100%)`,
        opacity: ANIMATION.FEATURED_GLOW.OPACITY_MAX,
      }}
    />
  );
});

// ============================================================
// SUB-COMPONENT — CheckIcon
// Animated checkmark for features
// ============================================================

interface CheckIconProps {
  className?: string;
}

const CheckIcon = memo(function CheckIcon({ className = "" }: CheckIconProps) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3.5 8 6.5 11 12.5 5" />
    </svg>
  );
});

// ============================================================
// SUB-COMPONENT — PackageBadge
// Badge for package tier
// ============================================================

interface PackageBadgeProps {
  text: string;
  className: string;
  isFeatured?: boolean;
}

const PackageBadge = memo(function PackageBadge({
  text,
  className,
  isFeatured = false,
}: PackageBadgeProps) {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!badgeRef.current || !isFeatured || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(badgeRef.current, {
        opacity: ANIMATION.STATUS_PULSE.OPACITY_MIN,
        duration: ANIMATION.STATUS_PULSE.DURATION,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, [isFeatured, prefersReducedMotion]);

  return (
    <span
      ref={badgeRef}
      className={`
        inline-flex items-center px-2 py-0.5
        font-mono text-[10px] uppercase tracking-widest
        ${isFeatured ? "" : "border"}
        ${className}
      `}
    >
      {isFeatured && (
        <span className="mr-1.5 h-1 w-1 animate-pulse rounded-full bg-current" />
      )}
      {text}
    </span>
  );
});

// ============================================================
// SUB-COMPONENT — PackageCTA
// Call-to-action button for packages
// ============================================================

interface PackageCTAProps {
  children: ReactNode;
  href: string;
  className: string;
  ariaLabel: string;
}

const PackageCTA = memo(function PackageCTA({
  children,
  href,
  className,
  ariaLabel,
}: PackageCTAProps) {
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

  return (
    <a
      href={href}
      className={`
        group relative inline-flex w-full items-center justify-center gap-2
        overflow-hidden px-6 py-3 text-sm font-semibold
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-cyan-500
        focus:ring-offset-2 focus:ring-offset-[#0B0F19]
        ${className}
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
// SUB-COMPONENT — FeatureItem
// Individual feature list item
// ============================================================

interface FeatureItemProps {
  text: string;
  highlighted?: boolean;
  checkColor: string;
}

const FeatureItem = memo(function FeatureItem({
  text,
  highlighted = false,
  checkColor,
}: FeatureItemProps) {
  return (
    <li className="flex items-start gap-3">
      <CheckIcon className={`mt-0.5 ${checkColor}`} />
      <span
        className={`text-sm ${
          highlighted ? "font-medium text-white" : "text-white/60"
        }`}
      >
        {text}
      </span>
    </li>
  );
});

// ============================================================
// SUB-COMPONENT — PackageCard
// Individual package pricing card
// ============================================================

interface PackageCardProps {
  data: PackageData;
}

const PackageCard = memo(
  forwardRef<HTMLElement, PackageCardProps>(function PackageCard(
    { data },
    ref,
  ) {
    const styles = TIER_STYLES[data.tier];
    const cardRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Hover lift effect
    const handleMouseEnter = useCallback(() => {
      if (prefersReducedMotion || !cardRef.current) return;
      gsap.to(cardRef.current, {
        y: ANIMATION.HOVER.LIFT,
        duration: ANIMATION.HOVER.DURATION,
        ease: ANIMATION.HOVER.EASE,
      });
    }, [prefersReducedMotion]);

    const handleMouseLeave = useCallback(() => {
      if (prefersReducedMotion || !cardRef.current) return;
      gsap.to(cardRef.current, {
        y: 0,
        duration: ANIMATION.HOVER.DURATION,
        ease: ANIMATION.HOVER.EASE,
      });
    }, [prefersReducedMotion]);

    return (
      <article
        ref={ref}
        className="will-change-transform"
        aria-labelledby={`package-title-${data.id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          className={`
            relative h-full
            border bg-white/4
            backdrop-blur-sm
            transition-shadow duration-300
            will-change-transform
            ${
              data.isFeatured
                ? "border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]"
                : "border-white/10"
            }
            ${styles.borderGlow}
          `}
          style={{
            borderRadius: 0,
            boxShadow: data.isFeatured
              ? "0 8px 32px -4px rgba(0, 0, 0, 0.4), 0 0 40px rgba(6, 182, 212, 0.1)"
              : "0 4px 24px -2px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Featured glow effect */}
          {data.isFeatured && (
            <FeaturedGlow color={COLOR_VALUES[styles.accentColor]} />
          )}

          {/* Accent line */}
          <AccentLine gradient={styles.gradient} isFeatured={data.isFeatured} />

          {/* Light streak */}
          <LightStreak
            color={COLOR_VALUES[styles.accentColor]}
            speed={data.isFeatured ? 8 : 12}
          />

          {/* Corner markers */}
          <CornerMarkers
            color={
              data.isFeatured
                ? "rgba(6, 182, 212, 0.3)"
                : "rgba(255, 255, 255, 0.15)"
            }
          />

          {/* System markers */}
          <SystemMarker
            text={data.systemId}
            position="top-left"
            showStatus
            statusColor={data.isFeatured ? "text-cyan-500/80" : "text-white/40"}
          />
          <SystemMarker text={data.version} position="bottom-right" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col p-6 pt-10 sm:p-8 sm:pt-12">
            {/* Badge */}
            {data.badge && (
              <div className="mb-4">
                <PackageBadge
                  text={data.badge}
                  className={styles.badgeClass}
                  isFeatured={data.isFeatured}
                />
              </div>
            )}

            {/* Package name */}
            <h3
              id={`package-title-${data.id}`}
              className={`mb-2 text-xl font-bold sm:text-2xl ${
                data.isFeatured ? "text-cyan-400" : "text-white"
              }`}
              style={{ letterSpacing: "-0.01em" }}
            >
              {data.name}
            </h3>

            {/* Tagline */}
            <p className="mb-6 text-sm text-white/50">{data.tagline}</p>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="mb-6 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent"
            />

            {/* Features */}
            <ul
              className="mb-8 grow space-y-3"
              aria-label={`${data.name} includes`}
            >
              {data.features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  text={feature.text}
                  highlighted={feature.highlighted}
                  checkColor={styles.checkColor}
                />
              ))}
            </ul>

            {/* CTA */}
            <PackageCTA
              href={data.ctaHref}
              className={styles.ctaClass}
              ariaLabel={`${data.ctaText} - ${data.name} package`}
            >
              {data.ctaText}
            </PackageCTA>
          </div>
        </div>
      </article>
    );
  }),
);

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
    <h2
      id="packages-section-title"
      className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
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
    </h2>
  );
});

// ============================================================
// SUB-COMPONENT — ConsultationCTA
// Footer consultation call-to-action
// ============================================================

interface ConsultationCTAProps {
  text: string;
  ctaText: string;
  href: string;
}

const ConsultationCTA = memo(
  forwardRef<HTMLDivElement, ConsultationCTAProps>(function ConsultationCTA(
    { text, ctaText, href },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center gap-4 text-center will-change-transform sm:flex-row sm:justify-center sm:gap-6"
      >
        <span className="text-white/50">{text}</span>
        <a
          href={href}
          className="
            group inline-flex items-center gap-2
            font-medium text-cyan-400
            transition-colors duration-300
            hover:text-cyan-300
            focus:outline-none focus:ring-2 focus:ring-cyan-500
            focus:ring-offset-2 focus:ring-offset-[#0B0F19]
          "
          aria-label="Schedule a free consultation"
        >
          {ctaText}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>
    );
  }),
);

// ============================================================
// SUB-COMPONENT — ComparisonIndicator
// Visual indicator showing package progression
// ============================================================

const ComparisonIndicator = memo(function ComparisonIndicator() {
  return (
    <div
      aria-hidden="true"
      className="mb-12 hidden items-center justify-center gap-3 lg:flex"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-white/30">
        Essential
      </span>
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-px w-8 bg-linear-to-r from-amber-500/50 via-cyan-500/50 to-violet-500/50"
          />
        ))}
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-white/30">
        Advanced
      </span>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — StatusIndicator
// Active status indicator
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
        opacity: ANIMATION.STATUS_PULSE.OPACITY_MIN,
        duration: ANIMATION.STATUS_PULSE.DURATION,
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
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40"
    >
      <span
        ref={dotRef}
        className="h-2 w-2 bg-cyan-500"
        style={{ opacity: ANIMATION.STATUS_PULSE.OPACITY_MAX }}
      />
      {text}
    </span>
  );
});

// ============================================================
// MAIN COMPONENT — ServicePackagesSection
// ============================================================

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ServicePackagesSection = memo(function ServicePackagesSection() {
  // Refs for animated elements
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const packagesRef = useRef<(HTMLElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();

  // Ref callback for package cards
  const setPackageRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      packagesRef.current[index] = el;
    },
    [],
  );

  // Entrance animation effect
  useEffect(() => {
    // Collect all animated elements
    const elements = [
      headerRef.current,
      comparisonRef.current,
      ...packagesRef.current.filter(Boolean),
      footerRef.current,
    ].filter(Boolean) as HTMLElement[];

    // If reduced motion, ensure visibility without animation
    if (prefersReducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(elements, {
        opacity: 0,
        y: ANIMATION.ENTRANCE.Y_OFFSET,
        scale: ANIMATION.ENTRANCE.SCALE_START,
      });

      // Animate on scroll
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
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={CONTENT.sectionId}
      aria-labelledby="packages-section-title"
      className="relative min-h-screen overflow-hidden bg-[#0B0F19] py-16 sm:py-24 lg:py-16"
    >
      {/* ====== BACKGROUND LAYERS ====== */}
      <GridOverlay />
      <AmbientGlow />

      {/* ====== SECTION SYSTEM MARKERS ====== */}
      <SystemMarker
        text={CONTENT.systemLabel}
        position="top-left"
        showStatus
        statusColor="text-cyan-500/60"
        className="hidden sm:block"
      />
      <SystemMarker
        text="SECTION::005"
        position="top-right"
        className="hidden sm:block"
      />

      {/* ====== CONTENT CONTAINER ====== */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* ====== HEADER ====== */}
        <header
          ref={headerRef}
          className="mb-12 text-center will-change-transform sm:mb-16"
        >
          <div className="mb-6">
            <StatusIndicator text="PACKAGES ACTIVE" />
          </div>

          <HighlightedHeadline
            text={CONTENT.headline.text}
            highlights={CONTENT.headline.highlights}
          />

          <p className="mx-auto mt-6 max-w-2xl text-base text-white/50 sm:text-lg">
            {CONTENT.subheadline}
          </p>
        </header>

        {/* ====== COMPARISON INDICATOR ====== */}
        <div ref={comparisonRef} className="will-change-transform">
          <ComparisonIndicator />
        </div>

        {/* ====== PACKAGES GRID ====== */}
        <div
          className="mb-16 grid gap-6 sm:mb-20 sm:gap-8 lg:grid-cols-3"
          role="list"
          aria-label="Service Packages"
        >
          {CONTENT.packages.map((pkg, index) => (
            <PackageCard key={pkg.id} ref={setPackageRef(index)} data={pkg} />
          ))}
        </div>

        {/* ====== FOOTER CTA ====== */}
        <ConsultationCTA
          ref={footerRef}
          text={CONTENT.footer.text}
          ctaText={CONTENT.footer.ctaText}
          href={CONTENT.footer.ctaHref}
        />

        {/* ====== TRUST INDICATORS ====== */}
        <div
          aria-hidden="true"
          className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:mt-20"
        >
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/20">
            <span className="h-1.5 w-1.5 bg-cyan-500/60" />
            No Hidden Fees
          </span>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/20">
            <span className="h-1.5 w-1.5 bg-cyan-500/60" />
            Cancel Anytime
          </span>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/20">
            <span className="h-1.5 w-1.5 bg-cyan-500/60" />
            Money-Back Guarantee
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

export default ServicePackagesSection;
