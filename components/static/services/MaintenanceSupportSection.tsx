// ============================================================
// FILE: app/components/MaintenanceSupportSection.tsx
//
// Complete Website Maintenance & Support Section - Production Ready
// All-in-one component with no external dependencies beyond
// React, GSAP, and Tailwind
//
// Features:
// • Floating glass panel architecture
// • GPU-accelerated light streak animations
// • Scroll-triggered entrance animations
// • Full WCAG 2.1 AA accessibility
// • Respects prefers-reduced-motion
// • Mobile-first responsive design
// • Security & trust focused visual language
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
    STAGGER: 0.1,
    EASE: "power2.out",
    Y_OFFSET: 30,
    SCALE_START: 0.98,
  },
  LIGHT_STREAK: {
    DURATION: 14, // Slightly slower for stability feel
    WIDTH_PERCENT: 25,
    OPACITY: 0.035,
  },
  STATUS_PULSE: {
    DURATION: 2.5, // Slower pulse for security/stability
    OPACITY_MIN: 0.4,
    OPACITY_MAX: 1,
  },
  SHIELD_PULSE: {
    DURATION: 3,
    SCALE_MIN: 1,
    SCALE_MAX: 1.02,
    OPACITY_MIN: 0.6,
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
  PRIMARY: "#F59E0B", // Amber — warmth, reliability
  SECONDARY: "#06B6D4", // Cyan — clarity, technical
  ACCENT: "#6D28D9", // Violet — premium, security
  SUCCESS: "#10B981", // Emerald — health, protection
  DARK_BG: "#0B0F19",
} as const;

type AccentColor = "primary" | "secondary" | "accent";

const COLOR_VALUES: Record<AccentColor, string> = {
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  accent: COLORS.ACCENT,
};

const ACCENT_STYLES: Record<
  AccentColor,
  { bullet: string; border: string; gradient: string; icon: string }
> = {
  primary: {
    bullet: "bg-amber-500",
    border: "border-amber-500/30",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.PRIMARY}40 50%, transparent 100%)`,
    icon: "text-amber-500",
  },
  secondary: {
    bullet: "bg-cyan-500",
    border: "border-cyan-500/30",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.SECONDARY}40 50%, transparent 100%)`,
    icon: "text-cyan-500",
  },
  accent: {
    bullet: "bg-violet-500",
    border: "border-violet-500/30",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.ACCENT}40 50%, transparent 100%)`,
    icon: "text-violet-500",
  },
};

// ============================================================
// CONSTANTS — Content Data
// ============================================================

interface ServiceFeature {
  text: string;
}

interface ServiceData {
  id: string;
  systemId: string;
  title: string;
  description: string;
  features: ServiceFeature[];
  outcome: string;
  accentColor: AccentColor;
  coordinates: string;
  version: string;
  statusLabel: string;
}

interface HighlightWord {
  word: string;
  color: AccentColor;
}

const CONTENT = {
  sectionId: "maintenance-support",
  systemLabel: "SYS::MAINTENANCE_CORE",

  headline: {
    text: "Website Maintenance & Ongoing Support",
    highlights: [
      { word: "Maintenance", color: "primary" as AccentColor },
      { word: "Support", color: "secondary" as AccentColor },
    ],
  },

  intro: [
    "A website is not a one-time project. To stay secure, fast, and competitive, your website needs regular updates and monitoring.",
    "We offer professional maintenance and support plans to keep your website running smoothly.",
  ],

  services: [
    {
      id: "updates",
      systemId: "MODULE::UPDATES",
      title: "Website Updates & Enhancements",
      description:
        "We keep your website updated and improve it over time based on performance and user behavior.",
      features: [
        { text: "Adding new pages and features" },
        { text: "Design improvements" },
        { text: "Content updates" },
        { text: "Plugin and system updates" },
        { text: "UI enhancements and conversion improvements" },
      ],
      outcome: "Your website stays modern and competitive.",
      accentColor: "primary" as AccentColor,
      coordinates: "51.5074°N 0.1278°W",
      version: "v2.4.0",
      statusLabel: "ACTIVE",
    },
    {
      id: "debugging",
      systemId: "MODULE::DIAGNOSTICS",
      title: "Troubleshooting & Debugging",
      description:
        "If your website has bugs, loading issues, broken pages, or technical errors, we quickly diagnose and fix the problem.",
      features: [
        { text: "Bug fixing" },
        { text: "Server and hosting troubleshooting" },
        { text: "Broken form and checkout fixes" },
        { text: "Performance debugging" },
        { text: "API and integration troubleshooting" },
      ],
      outcome: "Stable website experience and fewer lost customers.",
      accentColor: "secondary" as AccentColor,
      coordinates: "40.7128°N 74.0060°W",
      version: "v3.1.2",
      statusLabel: "MONITORING",
    },
    {
      id: "security",
      systemId: "MODULE::SECURITY",
      title: "Security Audits & Protection",
      description:
        "Security is critical for modern businesses. We protect your website against attacks, vulnerabilities, and data leaks.",
      features: [
        { text: "Website vulnerability scanning" },
        { text: "Malware removal and protection" },
        { text: "SSL setup and security configuration" },
        { text: "Database security and backups" },
        { text: "Firewall setup (if needed)" },
      ],
      outcome: "Your business stays protected and trusted.",
      accentColor: "accent" as AccentColor,
      coordinates: "48.8566°N 2.3522°E",
      version: "v4.0.0",
      statusLabel: "PROTECTED",
    },
  ] as ServiceData[],

  cta: {
    text: "Get a Website Maintenance Plan",
    systemStatus: "◉ PLANS AVAILABLE",
  },

  stats: [
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "<2hr", label: "Response Time" },
    { value: "24/7", label: "Monitoring" },
  ],
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
// Security-themed positioning (more grounded, protective feel)
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
    left: "10%",
    color: COLORS.SUCCESS, // Emerald for protection
    size: "500px",
    opacity: 0.04,
  },
  {
    bottom: "15%",
    right: "15%",
    color: COLORS.SECONDARY,
    size: "550px",
    opacity: 0.035,
  },
  {
    top: "60%",
    left: "50%",
    color: COLORS.ACCENT,
    size: "400px",
    opacity: 0.025,
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
// Atmospheric monospace labels (command center aesthetic)
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
  statusColor = "text-emerald-500/60",
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
  accentColor: AccentColor;
}

const AccentLine = memo(function AccentLine({ accentColor }: AccentLineProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 right-0 top-0 h-px"
      style={{ background: ACCENT_STYLES[accentColor].gradient }}
    />
  );
});

// ============================================================
// SUB-COMPONENT — CornerMarkers
// Structural corner brackets
// ============================================================

const CornerMarkers = memo(function CornerMarkers() {
  const size = 12;
  const color = "rgba(255, 255, 255, 0.15)";

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
  accentColor: AccentColor;
}

const LightStreak = memo(function LightStreak({
  accentColor,
}: LightStreakProps) {
  const streakRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!streakRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(streakRef.current, { xPercent: -100 });

      gsap.to(streakRef.current, {
        xPercent: 400,
        duration: ANIMATION.LIGHT_STREAK.DURATION,
        ease: "none",
        repeat: -1,
        force3D: true,
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const color = COLOR_VALUES[accentColor];
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
// SUB-COMPONENT — GlassPanel
// Core visual building block with all decorative elements
// ============================================================

interface GlassPanelProps {
  children: ReactNode;
  accentColor?: AccentColor;
  systemId?: string;
  coordinates?: string;
  version?: string;
  className?: string;
}

const GlassPanel = memo(function GlassPanel({
  children,
  accentColor = "primary",
  systemId,
  coordinates,
  version,
  className = "",
}: GlassPanelProps) {
  return (
    <div
      className={`
        relative
        border border-white/10
        bg-white/4
        backdrop-blur-sm
        will-change-transform
        ${className}
      `}
      style={{
        borderRadius: 0,
        boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.3)",
      }}
    >
      <AccentLine accentColor={accentColor} />
      <LightStreak accentColor={accentColor} />
      <CornerMarkers />

      {systemId && (
        <SystemMarker text={systemId} position="top-left" showStatus />
      )}
      {coordinates && <SystemMarker text={coordinates} position="top-right" />}
      {version && <SystemMarker text={version} position="bottom-right" />}

      <div className="relative z-10">{children}</div>
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
    <h2
      id="maintenance-section-title"
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
// SUB-COMPONENT — StatusIndicator
// Animated status dot with pulsing effect
// ============================================================

interface StatusIndicatorProps {
  text: string;
  active?: boolean;
  color?: string;
}

const StatusIndicator = memo(function StatusIndicator({
  text,
  active = true,
  color = "bg-emerald-500",
}: StatusIndicatorProps) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!dotRef.current || !active || prefersReducedMotion) return;

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
  }, [active, prefersReducedMotion]);

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40"
    >
      <span
        ref={dotRef}
        className={`h-2 w-2 ${color}`}
        style={{ opacity: ANIMATION.STATUS_PULSE.OPACITY_MAX }}
      />
      {text}
    </span>
  );
});

// ============================================================
// SUB-COMPONENT — ShieldIcon
// Animated security shield icon
// ============================================================

interface ShieldIconProps {
  className?: string;
  animated?: boolean;
}

const ShieldIcon = memo(function ShieldIcon({
  className = "",
  animated = true,
}: ShieldIconProps) {
  const iconRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!iconRef.current || !animated || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(iconRef.current, {
        scale: ANIMATION.SHIELD_PULSE.SCALE_MAX,
        opacity: ANIMATION.SHIELD_PULSE.OPACITY_MIN,
        duration: ANIMATION.SHIELD_PULSE.DURATION,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center center",
      });
    });

    return () => ctx.revert();
  }, [animated, prefersReducedMotion]);

  return (
    <svg
      ref={iconRef}
      className={`will-change-transform ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
});

// ============================================================
// SUB-COMPONENT — ServiceIcon
// Icons for each service type
// ============================================================

interface ServiceIconProps {
  type: "updates" | "debugging" | "security";
  className?: string;
}

const ServiceIcon = memo(function ServiceIcon({
  type,
  className = "",
}: ServiceIconProps) {
  const iconPaths: Record<string, ReactNode> = {
    updates: (
      <>
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </>
    ),
    debugging: (
      <>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    security: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[type]}
    </svg>
  );
});

// ============================================================
// SUB-COMPONENT — StatBlock
// Statistics display for trust building
// ============================================================

interface StatBlockProps {
  value: string;
  label: string;
  index: number;
}

const StatBlock = memo(
  forwardRef<HTMLDivElement, StatBlockProps>(function StatBlock(
    { value, label, index },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center will-change-transform"
      >
        <span
          className="text-2xl font-bold text-white sm:text-3xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {value}
        </span>
        <span className="mt-1 font-mono text-xs uppercase tracking-widest text-white/40">
          {label}
        </span>
      </div>
    );
  }),
);

// ============================================================
// SUB-COMPONENT — ServiceBlock
// Individual service card with all features
// ============================================================

interface ServiceBlockProps {
  data: ServiceData;
}

const ServiceBlock = memo(
  forwardRef<HTMLElement, ServiceBlockProps>(function ServiceBlock(
    { data },
    ref,
  ) {
    const styles = ACCENT_STYLES[data.accentColor];

    // Map service ID to icon type
    const iconType = data.id as "updates" | "debugging" | "security";

    return (
      <article
        ref={ref}
        className="will-change-transform"
        aria-labelledby={`service-title-${data.id}`}
      >
        <GlassPanel
          accentColor={data.accentColor}
          systemId={data.systemId}
          coordinates={data.coordinates}
          version={data.version}
          className="h-full p-6 pt-10 sm:p-8 sm:pt-12 lg:p-10 lg:pt-14"
        >
          {/* Service Header with Icon */}
          <div className="mb-4 flex items-start gap-3">
            <div
              className={`mt-0.5 rounded-none border border-current p-2 ${styles.icon} opacity-60`}
            >
              <ServiceIcon type={iconType} />
            </div>
            <div className="flex-1">
              <h3
                id={`service-title-${data.id}`}
                className="text-xl font-semibold text-white sm:text-2xl"
                style={{ letterSpacing: "-0.01em" }}
              >
                {data.title}
              </h3>
              {/* Status Badge */}
              <span
                aria-hidden="true"
                className={`mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${styles.icon} opacity-60`}
              >
                <span className="h-1 w-1 rounded-full bg-current" />
                {data.statusLabel}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-6 text-base leading-relaxed text-white/60">
            {data.description}
          </p>

          {/* Features List */}
          <ul className="mb-6 space-y-3" aria-label={`${data.title} includes`}>
            {data.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-white/60"
              >
                <span
                  aria-hidden="true"
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 ${styles.bullet}`}
                />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>

          {/* Outcome */}
          <div className={`border-l-2 py-2 pl-4 ${styles.border}`}>
            <p className="text-sm font-medium text-white/80">
              <span className="mr-2 text-white/40" aria-hidden="true">
                →
              </span>
              {data.outcome}
            </p>
          </div>
        </GlassPanel>
      </article>
    );
  }),
);

// ============================================================
// SUB-COMPONENT — CTAButton
// Call-to-action with shimmer hover effect
// ============================================================

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
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
        duration: ANIMATION.HOVER.DURATION * 2,
        ease: ANIMATION.HOVER.EASE,
      },
    );
  }, [prefersReducedMotion]);

  const className = `
    group relative inline-flex items-center gap-3
    overflow-hidden bg-amber-500 px-6 py-3
    text-sm font-semibold text-black
    transition-shadow duration-300
    hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]
    focus:outline-none focus:ring-2 focus:ring-amber-500
    focus:ring-offset-2 focus:ring-offset-[#0B0F19]
    sm:px-8 sm:py-4 sm:text-base
  `;

  const content = (
    <>
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
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
    >
      {content}
    </button>
  );
});

// ============================================================
// SUB-COMPONENT — TrustBadge
// Visual indicator of reliability
// ============================================================

const TrustBadge = memo(function TrustBadge() {
  return (
    <div
      aria-hidden="true"
      className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5"
    >
      <ShieldIcon className="h-4 w-4 text-emerald-500" animated={false} />
      <span className="font-mono text-xs uppercase tracking-widest text-emerald-500">
        Trusted Partner
      </span>
    </div>
  );
});

// ============================================================
// MAIN COMPONENT — MaintenanceSupportSection
// ============================================================

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MaintenanceSupportSection = memo(function MaintenanceSupportSection() {
  // Refs for animated elements
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<(HTMLElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();

  // Ref callback for service blocks
  const setServiceRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      servicesRef.current[index] = el;
    },
    [],
  );

  // Entrance animation effect
  useEffect(() => {
    // Collect all animated elements
    const elements = [
      headerRef.current,
      introRef.current,
      statsRef.current,
      ...servicesRef.current.filter(Boolean),
      ctaRef.current,
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
      aria-labelledby="maintenance-section-title"
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
        statusColor="text-emerald-500/60"
        className="hidden sm:block"
      />
      <SystemMarker
        text="SECTION::004"
        position="top-right"
        className="hidden sm:block"
      />

      {/* ====== CONTENT CONTAINER ====== */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* ====== HEADER ====== */}
        <header
          ref={headerRef}
          className="mb-12 max-w-4xl will-change-transform sm:mb-16"
        >
          {/* Trust Badge */}
          <div className="mb-6">
            <TrustBadge />
          </div>

          <HighlightedHeadline
            text={CONTENT.headline.text}
            highlights={CONTENT.headline.highlights}
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <StatusIndicator text="SYSTEMS HEALTHY" color="bg-emerald-500" />
            <span
              aria-hidden="true"
              className="hidden h-4 w-px bg-white/20 sm:block"
            />
            <StatusIndicator text="ALL SERVICES ACTIVE" color="bg-cyan-500" />
          </div>
        </header>

        {/* ====== INTRO PANEL ====== */}
        <div
          ref={introRef}
          className="mb-12 max-w-full will-change-transform sm:mb-16"
        >
          <GlassPanel
            accentColor="secondary"
            systemId="CORE::OVERVIEW"
            className="p-6 pt-10 sm:p-8 sm:pt-12"
          >
            <div className="flex items-start gap-4">
              <ShieldIcon
                className="hidden h-10 w-10 shrink-0 text-emerald-500/60 sm:block"
                animated
              />
              <div>
                {CONTENT.intro.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-base leading-relaxed text-white/60 sm:text-lg ${
                      index < CONTENT.intro.length - 1 ? "mb-4" : ""
                    }`}
                    style={{ lineHeight: 1.7 }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* ====== STATS BAR ====== */}
        <div ref={statsRef} className="mb-12 will-change-transform sm:mb-16">
          <GlassPanel
            accentColor="primary"
            systemId="METRICS::LIVE"
            className="p-6 sm:p-8"
          >
            <div className="flex flex-col items-center justify-around gap-6 sm:flex-row sm:gap-4">
              {CONTENT.stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  <StatBlock
                    value={stat.value}
                    label={stat.label}
                    index={index}
                  />
                  {index < CONTENT.stats.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden h-12 w-px bg-white/10 sm:block"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* ====== SERVICES GRID ====== */}
        <div
          className="mb-16 grid gap-6 sm:mb-20 sm:gap-8 lg:grid-cols-3 lg:gap-6"
          role="list"
          aria-label="Maintenance Services"
        >
          {CONTENT.services.map((service, index) => (
            <ServiceBlock
              key={service.id}
              ref={setServiceRef(index)}
              data={service}
            />
          ))}
        </div>

        {/* ====== CTA SECTION ====== */}
        <div
          ref={ctaRef}
          className="flex flex-col items-center gap-4 text-center will-change-transform sm:flex-row sm:justify-center sm:gap-6"
        >
          <CTAButton
            href="#contact"
            ariaLabel="Get a website maintenance plan - opens contact form"
          >
            {CONTENT.cta.text}
          </CTAButton>

          <span
            aria-hidden="true"
            className="font-mono text-xs uppercase tracking-[0.15em] text-white/30"
          >
            {CONTENT.cta.systemStatus}
          </span>
        </div>

        {/* ====== BOTTOM TRUST INDICATORS ====== */}
        <div
          aria-hidden="true"
          className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:mt-20"
        >
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/20">
            <span className="h-1.5 w-1.5 bg-emerald-500/60" />
            SSL Protected
          </span>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/20">
            <span className="h-1.5 w-1.5 bg-emerald-500/60" />
            GDPR Compliant
          </span>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/20">
            <span className="h-1.5 w-1.5 bg-emerald-500/60" />
            Daily Backups
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

export default MaintenanceSupportSection;
