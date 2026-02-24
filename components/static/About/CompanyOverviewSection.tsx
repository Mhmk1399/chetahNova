// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/CompanyOverviewSection.tsx
// PURPOSE: Company overview section with glass panel architecture
// VERSION: 2.4.1
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import {
  useRef,
  useEffect,
  useCallback,
  memo,
  type RefObject,
  JSX,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
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
} as const;

const OPACITY = {
  headline: 1,
  body: 0.6,
  caption: 0.4,
  decorative: 0.15,
  grid: 0.025,
  glassBg: 0.04,
  glassBorder: 0.1,
  ambientGlow: 0.06,
  lightStreak: 0.04,
  systemMarker: 0.12,
  bulletIcon: 0.8,
} as const;

const SPACING = {
  gridSize: 64,
  cornerMarkerSize: 10,
  cornerMarkerOffset: 12,
} as const;

const ANIMATION = {
  entranceDuration: 0.6,
  staggerDelay: 0.08,
  entranceOffset: 28,
  entranceScale: 0.98,
  lightStreakDuration: 14,
  statusPulseDuration: 4,
  bulletStagger: 0.12,
} as const;

const EASING = {
  entrance: "power2.out",
  linear: "none",
  breathe: "sine.inOut",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_CONTENT = {
  systemLabel: "SYS::OVERVIEW_002",
  version: "v2.4.1",
  coordinates: "51.5074°N 0.1278°W",
  eyebrow: "Company Overview",
  title: "Who We Are",
  paragraphs: [
    "We are a digital agency specializing in custom website design, advanced SEO systems, and AI-powered automation tools. We work with startups, growing brands, and established businesses worldwide to build websites that don't just look beautiful, but actually generate revenue.",
    "We combine design, development, SEO strategy, and artificial intelligence into one complete solution. Our goal is to create websites that bring long-term results and reduce business workload through smart automation.",
  ],
  highlights: [
    { text: "Modern custom website development", icon: "code" },
    { text: "SEO strategy built for Google rankings", icon: "search" },
    { text: "AI tools customized for each business model", icon: "ai" },
    {
      text: "Performance-first and conversion-driven design",
      icon: "performance",
    },
    { text: "International remote collaboration and support", icon: "global" },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface CompanyOverviewSectionProps {
  id?: string;
}

interface BulletItemProps {
  text: string;
  icon: string;
  index: number;
  addRef: (el: HTMLLIElement | null) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const generateGridBackground = (): string => `
  linear-gradient(to right, rgba(255,255,255,${OPACITY.grid}) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255,255,255,${OPACITY.grid}) 1px, transparent 1px)
`;

const generateRadialGlow = (color: string, opacity: number): string => {
  const opacityHex = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return `radial-gradient(circle, ${color}${opacityHex} 0%, transparent 70%)`;
};

const generateLightStreakGradient = (color: string): string => {
  const opacityHex = Math.round(OPACITY.lightStreak * 255)
    .toString(16)
    .padStart(2, "0");
  return `linear-gradient(90deg, transparent, ${color}${opacityHex}, transparent)`;
};

// ═══════════════════════════════════════════════════════════════════════════
// ICON COMPONENTS
// Minimal, purposeful icons that communicate meaning
// ═══════════════════════════════════════════════════════════════════════════

const Icons = {
  code: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  search: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ai: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M9 15h6" />
    </svg>
  ),
  performance: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  global: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GridOverlay - Precision grid background
 */
const GridOverlay = memo(function GridOverlay(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: generateGridBackground(),
        backgroundSize: `${SPACING.gridSize}px ${SPACING.gridSize}px`,
      }}
    />
  );
});

/**
 * AmbientBackground - Atmospheric glow effects
 */
const AmbientBackground = memo(function AmbientBackground({
  glowRef,
}: {
  glowRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Primary glow - asymmetric positioning */}
      <div
        ref={glowRef}
        className="absolute -left-32 top-1/4 h-125 w-125 will-change-transform"
        style={{
          background: generateRadialGlow(COLORS.secondary, OPACITY.ambientGlow),
        }}
      />
      {/* Secondary glow */}
      <div
        className="absolute -right-48 bottom-0 h-100 w-100"
        style={{
          background: generateRadialGlow(
            COLORS.accent,
            OPACITY.ambientGlow * 0.6,
          ),
        }}
      />
    </div>
  );
});

/**
 * SystemMarkers - Atmospheric system labels
 */
const SystemMarkers = memo(function SystemMarkers({
  statusDotRef,
}: {
  statusDotRef: RefObject<HTMLSpanElement | null>;
}): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none font-mono text-[10px] text-white"
      style={{
        letterSpacing: "0.15em",
        opacity: OPACITY.systemMarker,
      }}
    >
      <span className="absolute left-4 top-4 sm:left-6 sm:top-6">
        {SECTION_CONTENT.systemLabel}
      </span>
      <span className="absolute right-4 top-4 sm:right-6 sm:top-6">
        {SECTION_CONTENT.version}
      </span>
      <span className="absolute bottom-4 left-4 flex items-center gap-2 sm:bottom-6 sm:left-6">
        <span
          ref={statusDotRef}
          className="inline-block h-1.5 w-1.5 will-change-[opacity]"
          style={{ backgroundColor: COLORS.success, opacity: 0.7 }}
        />
        ACTIVE
      </span>
      <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
        {SECTION_CONTENT.coordinates}
      </span>
    </div>
  );
});

/**
 * CornerMarkers - Structural corner accents
 */
const CornerMarkers = memo(function CornerMarkers(): JSX.Element {
  const style = {
    width: SPACING.cornerMarkerSize,
    height: SPACING.cornerMarkerSize,
  };
  const offset = SPACING.cornerMarkerOffset;

  return (
    <div aria-hidden="true" className="pointer-events-none">
      <span
        className="absolute border-l border-t border-white/20"
        style={{ ...style, left: offset, top: offset }}
      />
      <span
        className="absolute border-r border-t border-white/20"
        style={{ ...style, right: offset, top: offset }}
      />
      <span
        className="absolute border-b border-l border-white/20"
        style={{ ...style, left: offset, bottom: offset }}
      />
      <span
        className="absolute border-b border-r border-white/20"
        style={{ ...style, right: offset, bottom: offset }}
      />
    </div>
  );
});

/**
 * LightStreak - Animated light reflection
 */
const LightStreak = memo(function LightStreak({
  streakRef,
}: {
  streakRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  return (
    <div
      ref={streakRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 w-1/4 will-change-transform"
      style={{
        background: generateLightStreakGradient(COLORS.secondary),
      }}
    />
  );
});

/**
 * BulletItem - Individual highlight item with icon
 */
const BulletItem = memo(function BulletItem({
  text,
  icon,
  addRef,
}: BulletItemProps): JSX.Element {
  const IconComponent = Icons[icon as keyof typeof Icons] || Icons.code;

  return (
    <li
      ref={addRef}
      className="flex items-start gap-4 opacity-0 will-change-transform"
    >
      {/* Icon container with accent border */}
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center border"
        style={{
          borderColor: `rgba(6, 182, 212, 0.3)`,
          color: COLORS.secondary,
        }}
        aria-hidden="true"
      >
        <IconComponent />
      </span>
      {/* Text content */}
      <span
        className="pt-1.5 text-sm sm:text-base"
        style={{
          color: `rgba(255, 255, 255, ${OPACITY.body})`,
          lineHeight: 1.6,
        }}
      >
        {text}
      </span>
    </li>
  );
});

/**
 * SectionDivider - Decorative divider between content blocks
 */
const SectionDivider = memo(function SectionDivider(): JSX.Element {
  return (
    <div aria-hidden="true" className="my-8 flex items-center gap-4">
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
        }}
      />
      <span
        className="h-1.5 w-1.5"
        style={{ backgroundColor: COLORS.secondary, opacity: 0.5 }}
      />
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
        }}
      />
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useOverviewAnimations(refs: {
  sectionRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  streakRef: RefObject<HTMLDivElement | null>;
  statusDotRef: RefObject<HTMLSpanElement | null>;
  glowRef: RefObject<HTMLDivElement | null>;
  contentRefs: RefObject<HTMLElement[] | null>;
  bulletRefs: RefObject<HTMLLIElement[] | null>;
}): void {
  const {
    sectionRef,
    panelRef,
    streakRef,
    statusDotRef,
    glowRef,
    contentRefs,
    bulletRefs,
  } = refs;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(panelRef.current, { opacity: 1 });
        if (contentRefs.current) gsap.set(contentRefs.current, { opacity: 1 });
        if (bulletRefs.current) gsap.set(bulletRefs.current, { opacity: 1 });
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // SCROLL-TRIGGERED ENTRANCE ANIMATIONS
      // ─────────────────────────────────────────────────────────────────────

      // Panel entrance
      gsap.fromTo(
        panelRef.current,
        {
          opacity: 0,
          y: ANIMATION.entranceOffset,
          scale: ANIMATION.entranceScale,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: ANIMATION.entranceDuration,
          ease: EASING.entrance,
          force3D: true,
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      // Content elements stagger
      if (contentRefs.current && contentRefs.current.length > 0) {
        gsap.fromTo(
          contentRefs.current,
          { opacity: 0, y: ANIMATION.entranceOffset * 0.7 },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION.entranceDuration,
            ease: EASING.entrance,
            stagger: ANIMATION.staggerDelay,
            force3D: true,
            scrollTrigger: {
              trigger: panelRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // Bullet items stagger (delayed from content)
      if (bulletRefs.current && bulletRefs.current.length > 0) {
        gsap.fromTo(
          bulletRefs.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: ANIMATION.entranceDuration,
            ease: EASING.entrance,
            stagger: ANIMATION.bulletStagger,
            force3D: true,
            scrollTrigger: {
              trigger: bulletRefs.current[0],
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // ─────────────────────────────────────────────────────────────────────
      // PERSISTENT ANIMATIONS
      // ─────────────────────────────────────────────────────────────────────

      // Light streak sweep
      gsap.fromTo(
        streakRef.current,
        { xPercent: -100 },
        {
          xPercent: 200,
          duration: ANIMATION.lightStreakDuration,
          ease: EASING.linear,
          repeat: -1,
          force3D: true,
        },
      );

      // Status dot pulse
      gsap.to(statusDotRef.current, {
        opacity: 0.3,
        duration: ANIMATION.statusPulseDuration,
        ease: EASING.breathe,
        yoyo: true,
        repeat: -1,
      });

      // Ambient glow breathing
      gsap.to(glowRef.current, {
        scale: 1.08,
        duration: 10,
        ease: EASING.breathe,
        yoyo: true,
        repeat: -1,
        force3D: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [
    sectionRef,
    panelRef,
    streakRef,
    statusDotRef,
    glowRef,
    contentRefs,
    bulletRefs,
  ]);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function CompanyOverviewSection({
  id = "company-overview",
}: CompanyOverviewSectionProps): JSX.Element {
  // ─────────────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────────────

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const statusDotRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<HTMLElement[]>([]);
  const bulletRefs = useRef<HTMLLIElement[]>([]);

  // ─────────────────────────────────────────────────────────────────────────
  // REF HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  const addContentRef = useCallback((el: HTMLElement | null) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  }, []);

  const addBulletRef = useCallback((el: HTMLLIElement | null) => {
    if (el && !bulletRefs.current.includes(el)) {
      bulletRefs.current.push(el);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────

  useOverviewAnimations({
    sectionRef,
    panelRef,
    streakRef,
    statusDotRef,
    glowRef,
    contentRefs,
    bulletRefs,
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
      {/* ═══════════════════════════════════════════════════════════════════
          BACKGROUND LAYERS
          ═══════════════════════════════════════════════════════════════════ */}
      <GridOverlay />
      <AmbientBackground glowRef={glowRef} />
      <SystemMarkers statusDotRef={statusDotRef} />

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENT CONTAINER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Glass Panel */}
        <div
          ref={panelRef}
          className="relative opacity-0 will-change-transform"
          style={{ boxShadow: "0 4px 40px rgba(0, 0, 0, 0.4)" }}
        >
          {/* Top accent gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent})`,
            }}
          />

          {/* Glass surface */}
          <div
            className="relative overflow-hidden border border-white/10 backdrop-blur-sm"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${OPACITY.glassBg})`,
              borderTopColor: "transparent",
            }}
          >
            <LightStreak streakRef={streakRef} />
            <CornerMarkers />

            {/* Content */}
            <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              {/* Eyebrow */}
              <p
                ref={addContentRef}
                className="mb-4 font-mono text-xs uppercase opacity-0 will-change-transform"
                style={{
                  color: COLORS.secondary,
                  letterSpacing: "0.2em",
                }}
              >
                {SECTION_CONTENT.eyebrow}
              </p>

              {/* Section Title */}
              <h2
                id={`${id}-heading`}
                ref={addContentRef}
                className="mb-8 text-2xl font-semibold text-white opacity-0 will-change-transform sm:text-3xl lg:text-4xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {SECTION_CONTENT.title}
              </h2>

              {/* Paragraphs */}
              <div className="mb-8 max-w-3xl space-y-6">
                {SECTION_CONTENT.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    ref={addContentRef}
                    className="text-base opacity-0 will-change-transform sm:text-lg"
                    style={{
                      color: `rgba(255, 255, 255, ${OPACITY.body})`,
                      lineHeight: 1.75,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Divider */}
              <SectionDivider />

              {/* Highlights List */}
              <div
                ref={addContentRef}
                className="opacity-0 will-change-transform"
              >
                <h3
                  className="mb-6 font-mono text-xs uppercase"
                  style={{
                    color: `rgba(255, 255, 255, ${OPACITY.caption})`,
                    letterSpacing: "0.15em",
                  }}
                >
                  What We Deliver
                </h3>
                <ul role="list" className="grid gap-5 sm:grid-cols-2 lg:gap-6">
                  {SECTION_CONTENT.highlights.map((highlight, index) => (
                    <BulletItem
                      key={index}
                      text={highlight.text}
                      icon={highlight.icon}
                      index={index}
                      addRef={addBulletRef}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom structural accent */}
        <div
          aria-hidden="true"
          className="mx-auto mt-10 flex items-center justify-center gap-3"
        >
          <div
            className="h-px w-8"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.secondary}50)`,
            }}
          />
          <div
            className="h-1 w-1"
            style={{ backgroundColor: COLORS.secondary, opacity: 0.4 }}
          />
          <div
            className="h-px w-8"
            style={{
              background: `linear-gradient(90deg, ${COLORS.secondary}50, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

CompanyOverviewSection.displayName = "CompanyOverviewSection";
