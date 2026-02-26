// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/MissionVisionSection.tsx
// PURPOSE: Split-layout Mission & Vision section with dual glass panels
// VERSION: 2.4.1
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useRef, useEffect, useCallback, memo, type RefObject, JSX } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  body: 0.6,
  caption: 0.4,
  decorative: 0.08,
  grid: 0.02,
  glassBg: 0.035,
  number: 0.04,
  ambientGlow: 0.05,
  lightStreak: 0.035,
} as const;

const ANIMATION = {
  entranceDuration: 0.7,
  staggerDelay: 0.15,
  entranceOffset: 40,
  lightStreakDuration: 16,
  numberPulseDuration: 6,
  panelDelay: 0.2,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_CONTENT = {
  systemLabel: "SYS::CORE_VALUES",
  mission: {
    number: "01",
    label: "Mission",
    title: "Our Mission",
    text: "To help businesses grow faster by building websites that combine premium design, powerful SEO, and intelligent automation. We believe your website should work like a full-time employee, generating leads, answering customers, and driving sales every day.",
    status: "ACTIVE",
    color: COLORS.primary,
  },
  vision: {
    number: "02",
    label: "Vision",
    title: "Our Vision",
    text: "To become a leading global agency in AI-powered web development, helping businesses worldwide turn their websites into smart platforms that compete in the future digital economy.",
    status: "PROJECTED",
    color: COLORS.secondary,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface MissionVisionSectionProps {
  id?: string;
}

interface PanelProps {
  number: string;
  label: string;
  title: string;
  text: string;
  status: string;
  color: string;
  variant: "left" | "right";
  panelRef: RefObject<HTMLDivElement | null>;
  streakRef: RefObject<HTMLDivElement | null>;
  numberRef: RefObject<HTMLSpanElement | null>;
  contentRefs: RefObject<HTMLElement[]>;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const generateGridBackground = (): string => `
  linear-gradient(to right, rgba(255,255,255,${OPACITY.grid}) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255,255,255,${OPACITY.grid}) 1px, transparent 1px)
`;

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GridOverlay - Subtle precision grid
 */
const GridOverlay = memo(function GridOverlay(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: generateGridBackground(),
        backgroundSize: "80px 80px",
      }}
    />
  );
});

/**
 * CenterDivider - Vertical glowing line between panels
 */
const CenterDivider = memo(function CenterDivider({
  dividerRef,
}: {
  dividerRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  return (
    <div
      ref={dividerRef}
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 hidden h-32 w-px -translate-x-1/2 -translate-y-1/2 opacity-0 will-change-transform lg:block"
      style={{
        background: `linear-gradient(180deg, transparent, ${COLORS.accent}40, transparent)`,
      }}
    >
      {/* Center node */}
      <span
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2"
        style={{
          backgroundColor: COLORS.accent,
          boxShadow: `0 0 20px ${COLORS.accent}60`,
        }}
      />
    </div>
  );
});

/**
 * LargeNumber - Decorative background number
 */
const LargeNumber = memo(function LargeNumber({
  number,
  color,
  numberRef,
  position,
}: {
  number: string;
  color: string;
  numberRef: RefObject<HTMLSpanElement | null>;
  position: "left" | "right";
}): JSX.Element {
  return (
    <span
      ref={numberRef}
      aria-hidden="true"
      className={`pointer-events-none absolute select-none font-mono text-[180px] font-bold leading-none will-change-[opacity] sm:text-[220px] lg:text-[280px] ${
        position === "left" ? "-left-4 -top-8" : "-right-4 -top-8"
      }`}
      style={{
        color,
        opacity: OPACITY.number,
        WebkitTextStroke: `1px ${color}15`,
      }}
    >
      {number}
    </span>
  );
});

/**
 * PanelCorners - L-shaped corner accents
 */
const PanelCorners = memo(function PanelCorners({
  color,
  variant,
}: {
  color: string;
  variant: "left" | "right";
}): JSX.Element {
  const cornerStyle = { borderColor: `${color}30` };

  return (
    <div aria-hidden="true" className="pointer-events-none">
      {/* Only show corners on the "outer" edges for visual cohesion */}
      {variant === "left" ? (
        <>
          <span
            className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2"
            style={cornerStyle}
          />
          <span
            className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2"
            style={cornerStyle}
          />
        </>
      ) : (
        <>
          <span
            className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2"
            style={cornerStyle}
          />
          <span
            className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2"
            style={cornerStyle}
          />
        </>
      )}
    </div>
  );
});

/**
 * StatusIndicator - Animated status label
 */
const StatusIndicator = memo(function StatusIndicator({
  status,
  color,
}: {
  status: string;
  color: string;
}): JSX.Element {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"
      style={{ color: `${color}90` }}
    >
      <span
        className="h-1.5 w-1.5 animate-pulse"
        style={{ backgroundColor: color }}
      />
      {status}
    </span>
  );
});

/**
 * LightStreak - Horizontal sweeping light
 */
const LightStreak = memo(function LightStreak({
  streakRef,
  color,
  reverse = false,
}: {
  streakRef: RefObject<HTMLDivElement | null>;
  color: string;
  reverse?: boolean;
}): JSX.Element {
  return (
    <div
      ref={streakRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 w-1/3 will-change-transform"
      style={{
        background: `linear-gradient(${reverse ? "270deg" : "90deg"}, transparent, ${color}${Math.round(
          OPACITY.lightStreak * 255,
        )
          .toString(16)
          .padStart(2, "0")}, transparent)`,
        left: reverse ? "auto" : 0,
        right: reverse ? 0 : "auto",
      }}
    />
  );
});

/**
 * ContentPanel - Individual mission/vision panel
 */
const ContentPanel = memo(function ContentPanel({
  number,
  label,
  title,
  text,
  status,
  color,
  variant,
  panelRef,
  streakRef,
  numberRef,
  contentRefs,
}: PanelProps): JSX.Element {
  const addRef = useCallback(
    (el: HTMLElement | null) => {
      if (el && contentRefs.current && !contentRefs.current.includes(el)) {
        contentRefs.current.push(el);
      }
    },
    [contentRefs],
  );

  const isLeft = variant === "left";

  return (
    <article
      ref={panelRef}
      className="relative flex-1 opacity-0 will-change-transform"
      style={{
        boxShadow: `0 8px 40px rgba(0, 0, 0, 0.3)`,
      }}
    >
      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: isLeft
            ? `linear-gradient(90deg, ${color}, transparent)`
            : `linear-gradient(90deg, transparent, ${color})`,
        }}
      />

      {/* Panel surface */}
      <div
        className="relative min-h-100 overflow-hidden border border-white/10 backdrop-blur-sm lg:min-h-120"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${OPACITY.glassBg})`,
          borderTopColor: "transparent",
          borderLeftColor: isLeft ? undefined : "transparent",
          borderRightColor: isLeft ? "transparent" : undefined,
        }}
      >
        {/* Background number */}
        <LargeNumber
          number={number}
          color={color}
          numberRef={numberRef}
          position={variant}
        />

        {/* Light streak */}
        <LightStreak streakRef={streakRef} color={color} reverse={!isLeft} />

        {/* Corner accents */}
        <PanelCorners color={color} variant={variant} />

        {/* Content */}
        <div
          className={`relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10 ${
            isLeft
              ? "items-start text-left"
              : "items-start text-left lg:items-end lg:text-right"
          }`}
        >
          {/* Top section */}
          <div
            className={`w-full ${isLeft ? "" : "lg:flex lg:flex-col lg:items-end"}`}
          >
            {/* Label */}
            <p
              ref={addRef}
              className="mb-3 font-mono text-xs uppercase opacity-0 will-change-transform"
              style={{
                color,
                letterSpacing: "0.2em",
              }}
            >
              {label}
            </p>

            {/* Title */}
            <h2
              ref={addRef}
              className="mb-6 text-2xl font-semibold text-white opacity-0 will-change-transform sm:text-3xl lg:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {title}
            </h2>

            {/* Decorative line */}
            <div
              ref={addRef}
              aria-hidden="true"
              className="mb-6 h-px w-16 opacity-0 will-change-transform"
              style={{
                background: `linear-gradient(90deg, ${color}, transparent)`,
              }}
            />

            {/* Text */}
            <p
              ref={addRef}
              className="max-w-md text-base opacity-0 will-change-transform sm:text-lg"
              style={{
                color: `rgba(255, 255, 255, ${OPACITY.body})`,
                lineHeight: 1.75,
              }}
            >
              {text}
            </p>
          </div>

          {/* Status indicator */}
          <div
            ref={addRef}
            className={`mt-8 opacity-0 will-change-transform ${isLeft ? "" : "lg:self-end"}`}
          >
            <StatusIndicator status={status} color={color} />
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: isLeft
            ? `linear-gradient(90deg, ${color}40, transparent)`
            : `linear-gradient(90deg, transparent, ${color}40)`,
        }}
      />
    </article>
  );
});

/**
 * AmbientGlows - Background atmospheric effects
 */
const AmbientGlows = memo(function AmbientGlows(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Mission glow (left) */}
      <div
        className="absolute -left-40 top-1/4 h-100 w-100"
        style={{
          background: `radial-gradient(circle, ${COLORS.primary}${Math.round(
            OPACITY.ambientGlow * 255,
          )
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />
      {/* Vision glow (right) */}
      <div
        className="absolute -right-40 bottom-1/4 h-100 w-100"
        style={{
          background: `radial-gradient(circle, ${COLORS.secondary}${Math.round(
            OPACITY.ambientGlow * 255,
          )
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />
      {/* Center accent glow */}
      <div
        className="absolute left-1/2 top-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}${Math.round(
            OPACITY.ambientGlow * 0.5 * 255,
          )
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
});

/**
 * SystemMarkers - Corner atmospheric labels
 */
const SystemMarkers = memo(function SystemMarkers(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none font-mono text-[10px] tracking-widest text-white/10"
    >
      <span className="absolute left-4 top-4 sm:left-8 sm:top-8">
        {SECTION_CONTENT.systemLabel}
      </span>
      <span className="absolute right-4 top-4 sm:right-8 sm:top-8">
        NODE::DUAL_PANEL
      </span>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useMissionVisionAnimations(refs: {
  sectionRef: RefObject<HTMLElement | null>;
  leftPanelRef: RefObject<HTMLDivElement | null>;
  rightPanelRef: RefObject<HTMLDivElement | null>;
  leftStreakRef: RefObject<HTMLDivElement | null>;
  rightStreakRef: RefObject<HTMLDivElement | null>;
  leftNumberRef: RefObject<HTMLSpanElement | null>;
  rightNumberRef: RefObject<HTMLSpanElement | null>;
  dividerRef: RefObject<HTMLDivElement | null>;
  leftContentRefs: RefObject<HTMLElement[]>;
  rightContentRefs: RefObject<HTMLElement[]>;
}): void {
  const {
    sectionRef,
    leftPanelRef,
    rightPanelRef,
    leftStreakRef,
    rightStreakRef,
    leftNumberRef,
    rightNumberRef,
    dividerRef,
    leftContentRefs,
    rightContentRefs,
  } = refs;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [leftPanelRef.current, rightPanelRef.current, dividerRef.current],
          {
            opacity: 1,
          },
        );
        if (leftContentRefs.current)
          gsap.set(leftContentRefs.current, { opacity: 1 });
        if (rightContentRefs.current)
          gsap.set(rightContentRefs.current, { opacity: 1 });
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // SCROLL-TRIGGERED ENTRANCE
      // ─────────────────────────────────────────────────────────────────────

      // Left panel entrance (from left)
      gsap.fromTo(
        leftPanelRef.current,
        { opacity: 0, x: -ANIMATION.entranceOffset, scale: 0.98 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: ANIMATION.entranceDuration,
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Right panel entrance (from right, delayed)
      gsap.fromTo(
        rightPanelRef.current,
        { opacity: 0, x: ANIMATION.entranceOffset, scale: 0.98 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: ANIMATION.entranceDuration,
          ease: "power2.out",
          delay: ANIMATION.panelDelay,
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Center divider entrance
      gsap.fromTo(
        dividerRef.current,
        { opacity: 0, scaleY: 0 },
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: ANIMATION.panelDelay * 2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Left content stagger
      if (leftContentRefs.current && leftContentRefs.current.length > 0) {
        gsap.fromTo(
          leftContentRefs.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: ANIMATION.staggerDelay,
            delay: 0.3,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
      }

      // Right content stagger (delayed more)
      if (rightContentRefs.current && rightContentRefs.current.length > 0) {
        gsap.fromTo(
          rightContentRefs.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: ANIMATION.staggerDelay,
            delay: 0.5,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
      }

      // ─────────────────────────────────────────────────────────────────────
      // PERSISTENT ANIMATIONS
      // ─────────────────────────────────────────────────────────────────────

      // Light streaks - opposite directions
      gsap.fromTo(
        leftStreakRef.current,
        { xPercent: -100 },
        {
          xPercent: 300,
          duration: ANIMATION.lightStreakDuration,
          ease: "none",
          repeat: -1,
          force3D: true,
        },
      );

      gsap.fromTo(
        rightStreakRef.current,
        { xPercent: 100 },
        {
          xPercent: -300,
          duration: ANIMATION.lightStreakDuration * 1.2,
          ease: "none",
          repeat: -1,
          force3D: true,
        },
      );

      // Number opacity pulse
      gsap.to([leftNumberRef.current, rightNumberRef.current], {
        opacity: OPACITY.number * 1.5,
        duration: ANIMATION.numberPulseDuration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 1.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [
    sectionRef,
    leftPanelRef,
    rightPanelRef,
    leftStreakRef,
    rightStreakRef,
    leftNumberRef,
    rightNumberRef,
    dividerRef,
    leftContentRefs,
    rightContentRefs,
  ]);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function MissionVisionSection({
  id = "mission-vision",
}: MissionVisionSectionProps): JSX.Element {
  // ─────────────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────────────

  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftStreakRef = useRef<HTMLDivElement>(null);
  const rightStreakRef = useRef<HTMLDivElement>(null);
  const leftNumberRef = useRef<HTMLSpanElement>(null);
  const rightNumberRef = useRef<HTMLSpanElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const leftContentRefs = useRef<HTMLElement[]>([]);
  const rightContentRefs = useRef<HTMLElement[]>([]);

  // ─────────────────────────────────────────────────────────────────────────
  // ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────

  useMissionVisionAnimations({
    sectionRef,
    leftPanelRef,
    rightPanelRef,
    leftStreakRef,
    rightStreakRef,
    leftNumberRef,
    rightNumberRef,
    dividerRef,
    leftContentRefs,
    rightContentRefs,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label="Our Mission and Vision"
      className="relative w-full overflow-hidden py-16 sm:py-16 lg:py-36"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background layers */}
      <GridOverlay />
      <AmbientGlows />
      <SystemMarkers />

      {/* Content */}
      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Section header */}
        <div className="mb-12 text-center lg:mb-16">
          <p
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: COLORS.accent }}
          >
            Core Values
          </p>
        </div>

        {/* Split panels container */}
        <div className="relative flex flex-col gap-6 lg:flex-row lg:gap-0">
          {/* Mission Panel (Left) */}
          <ContentPanel
            number={SECTION_CONTENT.mission.number}
            label={SECTION_CONTENT.mission.label}
            title={SECTION_CONTENT.mission.title}
            text={SECTION_CONTENT.mission.text}
            status={SECTION_CONTENT.mission.status}
            color={SECTION_CONTENT.mission.color}
            variant="left"
            panelRef={leftPanelRef}
            streakRef={leftStreakRef}
            numberRef={leftNumberRef}
            contentRefs={leftContentRefs}
          />

          {/* Center divider (desktop only) */}
          <CenterDivider dividerRef={dividerRef} />

          {/* Vision Panel (Right) */}
          <ContentPanel
            number={SECTION_CONTENT.vision.number}
            label={SECTION_CONTENT.vision.label}
            title={SECTION_CONTENT.vision.title}
            text={SECTION_CONTENT.vision.text}
            status={SECTION_CONTENT.vision.status}
            color={SECTION_CONTENT.vision.color}
            variant="right"
            panelRef={rightPanelRef}
            streakRef={rightStreakRef}
            numberRef={rightNumberRef}
            contentRefs={rightContentRefs}
          />
        </div>

        {/* Bottom connector line */}
        <div
          aria-hidden="true"
          className="mx-auto mt-12 flex items-center justify-center gap-2 lg:mt-16"
        >
          <div
            className="h-px w-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}50)`,
            }}
          />
          <div
            className="h-2 w-2"
            style={{
              backgroundColor: COLORS.accent,
              boxShadow: `0 0 12px ${COLORS.accent}60`,
            }}
          />
          <div
            className="h-px w-12"
            style={{
              background: `linear-gradient(90deg, ${COLORS.secondary}50, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

MissionVisionSection.displayName = "MissionVisionSection";
