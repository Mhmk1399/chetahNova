// ============================================================
// File: src/components/services-intro/ServicesIntro.tsx
// Services Intro Section — "A Complete Digital Growth System"
// Floating Glass Architecture · Breathing Interface · GSAP Motion
// ============================================================

"use client";

import React, { useRef, useEffect, useCallback, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ============================================================
// DESIGN TOKENS — Named constants, no magic numbers
// ============================================================

const TOKENS = {
  // Timing
  ENTRANCE_DURATION: 0.6,
  ENTRANCE_STAGGER: 0.1,
  ENTRANCE_Y_OFFSET: 30,
  ENTRANCE_SCALE: 0.98,
  LIGHT_STREAK_DURATION: 12,
  PULSE_DURATION: 6,
  GLOW_BREATHE_DURATION: 10,

  // Visual
  PANEL_BG_OPACITY: 0.04,
  PANEL_BORDER_OPACITY: 0.1,
  ACCENT_LINE_HEIGHT: 1,
  SYSTEM_LABEL_OPACITY: 0.15,
  GRID_OPACITY: 0.03,
  GRID_SIZE: 72,
  AMBIENT_GLOW_OPACITY: 0.05,

  // Colors
  PRIMARY: "#F59E0B",
  SECONDARY: "#06B6D4",
  ACCENT: "#6D28D9",
  DARK_BG: "#0B0F19",

  // Breakpoints
  MOBILE_MAX: 768,
} as const;

// ============================================================
// TYPES
// ============================================================

interface ServicePillar {
  readonly id: string;
  readonly label: string;
  readonly status: string;
  readonly coordinate: string;
}

interface HighlightedWord {
  readonly text: string;
  readonly color: string;
}

// ============================================================
// CONTENT DATA — Separated from presentation
// ============================================================

const SERVICE_PILLARS: readonly ServicePillar[] = [
  {
    id: "web-design",
    label: "Modern Web Design",
    status: "◉ ACTIVE",
    coordinate: "01",
  },
  {
    id: "seo-strategy",
    label: "SEO Strategy",
    status: "◉ ACTIVE",
    coordinate: "02",
  },
  {
    id: "ai-automation",
    label: "Intelligent Automation",
    status: "◉ ACTIVE",
    coordinate: "03",
  },
] as const;

const SECTION_TITLE_PARTS: readonly (string | HighlightedWord)[] = [
  "A Complete ",
  { text: "Digital Growth", color: TOKENS.PRIMARY },
  " System, Not Just a ",
  { text: "Website", color: TOKENS.SECONDARY },
] as const;

const HIGHLIGHT_LINE = {
  prefix: "Our services are built for one goal:",
  keywords: ["more visibility", "more conversions", "more revenue"],
} as const;

// ============================================================
// SUB-COMPONENTS
// ============================================================

/**
 * SystemMarker — Atmospheric monospace labels
 * Purely decorative: aria-hidden, pointer-events-none
 */
const SystemMarker = memo(function SystemMarker({
  text,
  position,
}: {
  readonly text: string;
  readonly position: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute font-mono text-[10px] tracking-widest  text-white pointer-events-none select-none ${position}`}
      style={{ opacity: TOKENS.SYSTEM_LABEL_OPACITY }}
    >
      {text}
    </span>
  );
});

/**
 * LightStreak — Horizontal light sweep across glass panel
 * GPU-accelerated via translateX only
 */
const LightStreak = memo(function LightStreak({
  streakRef,
  color = TOKENS.PRIMARY,
}: {
  readonly streakRef: React.RefObject<HTMLDivElement | null>;
  readonly color?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        ref={streakRef}
        className="absolute top-0 h-full will-change-transform"
        style={{
          width: "25%",
          left: "-25%",
          background: `linear-gradient(90deg, transparent 0%, ${color}08 40%, ${color}0D 50%, ${color}08 60%, transparent 100%)`,
        }}
      />
    </div>
  );
});

/**
 * AccentTopLine — 1px gradient line at top edge of panel
 */
const AccentTopLine = memo(function AccentTopLine() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 pointer-events-none"
      style={{
        height: `${TOKENS.ACCENT_LINE_HEIGHT}px`,
        background: `linear-gradient(90deg, ${TOKENS.PRIMARY}00 0%, ${TOKENS.PRIMARY}66 30%, ${TOKENS.SECONDARY}66 70%, ${TOKENS.SECONDARY}00 100%)`,
      }}
    />
  );
});

/**
 * CornerBrackets — Structural corner markers for glass panel
 */
const CornerBrackets = memo(function CornerBrackets() {
  const bracketStyle = "absolute w-3 h-3 pointer-events-none";
  const borderColor = "border-white/[0.12]";

  return (
    <div aria-hidden="true">
      <div
        className={`${bracketStyle} top-0 left-0 border-t border-l ${borderColor}`}
      />
      <div
        className={`${bracketStyle} top-0 right-0 border-t border-r ${borderColor}`}
      />
      <div
        className={`${bracketStyle} bottom-0 left-0 border-b border-l ${borderColor}`}
      />
      <div
        className={`${bracketStyle} bottom-0 right-0 border-b border-r ${borderColor}`}
      />
    </div>
  );
});

/**
 * StatusDot — Animated pulsing status indicator
 */
const StatusDot = memo(function StatusDot({
  dotRef,
  color = TOKENS.PRIMARY,
}: {
  readonly dotRef: React.RefObject<HTMLSpanElement | null>;
  readonly color?: string;
}) {
  return (
    <span
      ref={dotRef}
      aria-hidden="true"
      className="inline-block w-1.5 h-1.5 will-change-[opacity]"
      style={{
        backgroundColor: color,
        opacity: 0.5,
      }}
    />
  );
});

/**
 * PillarCard — Individual service pillar display
 */
const PillarCard = memo(function PillarCard({
  pillar,
  index,
  cardRef,
  dotRef,
  streakRef,
}: {
  readonly pillar: ServicePillar;
  readonly index: number;
  readonly cardRef: React.RefObject<HTMLDivElement | null>;
  readonly dotRef: React.RefObject<HTMLSpanElement | null>;
  readonly streakRef: React.RefObject<HTMLDivElement | null>;
}) {
  const colors = [TOKENS.PRIMARY, TOKENS.SECONDARY, TOKENS.ACCENT] as const;
  const pillarColor = colors[index % colors.length];

  return (
    <div
      ref={cardRef}
      className="relative border border-white/8 backdrop-blur-sm p-5 md:p-6 will-change-transform"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${TOKENS.PANEL_BG_OPACITY})`,
        opacity: 0,
        // Pre-allocate space to prevent CLS
        minHeight: "88px",
      }}
    >
      {/* Accent top edge */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${pillarColor}88 50%, transparent 100%)`,
        }}
      />

      {/* Light streak */}
      <LightStreak streakRef={streakRef} color={pillarColor} />

      {/* Corner brackets */}
      <CornerBrackets />

      {/* System coordinate */}
      <SystemMarker
        text={`${pillar.coordinate}::${pillar.id.toUpperCase()}`}
        position="top-1.5 right-2"
      />

      {/* Content */}
      <div className="flex items-center gap-3">
        <StatusDot dotRef={dotRef} color={pillarColor} />
        <div>
          <p className="text-sm md:text-base font-medium text-white/90 tracking-[-0.01em]">
            {pillar.label}
          </p>
          <p
            className="font-mono text-[10px] tracking-widest text-white/30 mt-0.5"
            aria-hidden="true"
          >
            {pillar.status}
          </p>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// MAIN COMPONENT
// ============================================================

function ServicesIntroSection() {
  // ── Refs ────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mainStreakRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const pillarsContainerRef = useRef<HTMLDivElement>(null);
  const ambientGlow1Ref = useRef<HTMLDivElement>(null);
  const ambientGlow2Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Pillar refs — one per pillar for entrance animation
  const pillarCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillarDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pillarStreakRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Ref callbacks for dynamic arrays
  const setPillarCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      pillarCardRefs.current[index] = el;
    },
    [],
  );
  const setPillarDotRef = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      pillarDotRefs.current[index] = el;
    },
    [],
  );
  const setPillarStreakRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      pillarStreakRefs.current[index] = el;
    },
    [],
  );

  // ── GSAP Setup ──────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const isMobile = window.innerWidth <= TOKENS.MOBILE_MAX;

    const ctx = gsap.context(() => {
      // ── Entrance Timeline ─────────────────────────────
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });

      if (prefersReducedMotion) {
        // Reduced motion: simple fade, no transforms
        const entranceTargets = [
          panelRef.current,
          titleRef.current,
          paragraph1Ref.current,
          paragraph2Ref.current,
          highlightRef.current,
          ...pillarCardRefs.current.filter(Boolean),
        ].filter(Boolean);

        entranceTl.set(entranceTargets, { opacity: 1 });
      } else {
        // Full entrance animation sequence
        // Panel entrance
        entranceTl.fromTo(
          panelRef.current,
          {
            opacity: 0,
            y: TOKENS.ENTRANCE_Y_OFFSET,
            scale: TOKENS.ENTRANCE_SCALE,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: TOKENS.ENTRANCE_DURATION,
            ease: "power2.out",
            force3D: true,
          },
        );

        // Title entrance
        entranceTl.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: TOKENS.ENTRANCE_Y_OFFSET * 0.7,
          },
          {
            opacity: 1,
            y: 0,
            duration: TOKENS.ENTRANCE_DURATION,
            ease: "power2.out",
            force3D: true,
          },
          `-=${TOKENS.ENTRANCE_DURATION * 0.6}`,
        );

        // Paragraphs entrance (staggered)
        entranceTl.fromTo(
          [paragraph1Ref.current, paragraph2Ref.current].filter(Boolean),
          {
            opacity: 0,
            y: TOKENS.ENTRANCE_Y_OFFSET * 0.5,
          },
          {
            opacity: 1,
            y: 0,
            duration: TOKENS.ENTRANCE_DURATION,
            ease: "power2.out",
            stagger: TOKENS.ENTRANCE_STAGGER,
            force3D: true,
          },
          `-=${TOKENS.ENTRANCE_DURATION * 0.4}`,
        );

        // Highlight line entrance
        entranceTl.fromTo(
          highlightRef.current,
          {
            opacity: 0,
            y: TOKENS.ENTRANCE_Y_OFFSET * 0.4,
          },
          {
            opacity: 1,
            y: 0,
            duration: TOKENS.ENTRANCE_DURATION,
            ease: "power2.out",
            force3D: true,
          },
          `-=${TOKENS.ENTRANCE_DURATION * 0.3}`,
        );

        // Pillar cards entrance (staggered)
        const pillarCards = pillarCardRefs.current.filter(Boolean);
        if (pillarCards.length > 0) {
          entranceTl.fromTo(
            pillarCards,
            {
              opacity: 0,
              y: TOKENS.ENTRANCE_Y_OFFSET * 0.6,
              scale: TOKENS.ENTRANCE_SCALE,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: TOKENS.ENTRANCE_DURATION,
              ease: "power2.out",
              stagger: TOKENS.ENTRANCE_STAGGER,
              force3D: true,
            },
            `-=${TOKENS.ENTRANCE_DURATION * 0.2}`,
          );
        }
      }

      // ── Persistent Animations ───────────────────────────
      // Only run persistent animations if motion is not reduced
      if (!prefersReducedMotion) {
        // Main panel light streak
        if (mainStreakRef.current) {
          gsap.fromTo(
            mainStreakRef.current,
            { xPercent: -100 },
            {
              xPercent: 500, // Sweep fully across (25% width → needs 500% to traverse)
              duration: TOKENS.LIGHT_STREAK_DURATION,
              ease: "none",
              repeat: -1,
              force3D: true,
            },
          );
        }

        // Pillar card light streaks
        pillarStreakRefs.current.forEach((streakEl, i) => {
          if (streakEl) {
            gsap.fromTo(
              streakEl,
              { xPercent: -100 },
              {
                xPercent: 500,
                duration: TOKENS.LIGHT_STREAK_DURATION + i * 2, // Offset each pillar
                ease: "none",
                repeat: -1,
                delay: i * 1.5,
                force3D: true,
              },
            );
          }
        });

        // Status dot pulse
        const dotEls = pillarDotRefs.current.filter(Boolean);
        dotEls.forEach((dot, i) => {
          if (dot) {
            gsap.to(dot, {
              opacity: 0.9,
              duration: TOKENS.PULSE_DURATION / 2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 0.8,
            });
          }
        });

        // Ambient glow breathing (only on desktop for performance)
        if (!isMobile) {
          [ambientGlow1Ref.current, ambientGlow2Ref.current]
            .filter(Boolean)
            .forEach((glow, i) => {
              if (glow) {
                gsap.to(glow, {
                  scale: 1.05,
                  opacity: TOKENS.AMBIENT_GLOW_OPACITY * 1.4,
                  duration: TOKENS.GLOW_BREATHE_DURATION,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                  delay: i * 3,
                  force3D: true,
                });
              }
            });
        }
      }
    }, sectionRef);

    // Cleanup GSAP context on unmount
    return () => ctx.revert();
  }, []);

  // ── Render Title with Highlighted Words ─────────────────
  const renderTitle = useCallback(() => {
    return SECTION_TITLE_PARTS.map((part, i) => {
      if (typeof part === "string") {
        return <React.Fragment key={i}>{part}</React.Fragment>;
      }
      return (
        <span key={i} style={{ color: part.color }}>
          {part.text}
        </span>
      );
    });
  }, []);

  // ── Render Highlight Keywords ───────────────────────────
  const renderHighlightKeywords = useCallback(() => {
    const keywordColors = [
      TOKENS.PRIMARY,
      TOKENS.SECONDARY,
      TOKENS.ACCENT,
    ] as const;

    return HIGHLIGHT_LINE.keywords.map((keyword, i) => (
      <React.Fragment key={keyword}>
        {i > 0 && (
          <span className="text-white/30 mx-1" aria-hidden="true">
            ·
          </span>
        )}
        <span
          className="font-medium"
          style={{ color: keywordColors[i % keywordColors.length] }}
        >
          {keyword}
        </span>
      </React.Fragment>
    ));
  }, []);

  // ============================================================
  // JSX
  // ============================================================

  return (
    <section
      ref={sectionRef}
      id="services-intro"
      aria-labelledby="services-intro-title"
      className="relative w-full overflow-hidden py-16 md:py-28 lg:py-36"
      style={{ backgroundColor: TOKENS.DARK_BG }}
    >
      {/* ── Layer 1: Precision Grid ──────────────────────── */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,${TOKENS.GRID_OPACITY}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,${TOKENS.GRID_OPACITY}) 1px, transparent 1px)
          `,
          backgroundSize: `${TOKENS.GRID_SIZE}px ${TOKENS.GRID_SIZE}px`,
        }}
      />

      {/* ── Layer 2: Ambient Light Sources ───────────────── */}
      <div
        ref={ambientGlow1Ref}
        aria-hidden="true"
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: "600px",
          height: "600px",
          top: "-10%",
          right: "15%",
          background: `radial-gradient(circle, ${TOKENS.PRIMARY}0D 0%, transparent 70%)`,
          opacity: TOKENS.AMBIENT_GLOW_OPACITY,
        }}
      />
      <div
        ref={ambientGlow2Ref}
        aria-hidden="true"
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-5%",
          left: "10%",
          background: `radial-gradient(circle, ${TOKENS.ACCENT}0D 0%, transparent 70%)`,
          opacity: TOKENS.AMBIENT_GLOW_OPACITY,
        }}
      />

      {/* ── Section System Markers ───────────────────────── */}
      <SystemMarker
        text="SYS::SERVICES_OVERVIEW"
        position="top-4 left-4 md:top-6 md:left-6"
      />
      <SystemMarker
        text="48.8566°N 2.3522°E"
        position="top-4 right-4 md:top-6 md:right-6"
      />
      <SystemMarker
        text="v2.4.1"
        position="bottom-4 right-4 md:bottom-6 md:right-6"
      />

      {/* ── Main Content Container ───────────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 md:px-8">
        {/* ── Glass Panel ──────────────────────────────── */}
        <div
          ref={panelRef}
          className="relative border border-white/8 backdrop-blur-sm will-change-transform"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${TOKENS.PANEL_BG_OPACITY})`,
            opacity: 0, // Pre-set for GSAP entrance; prevents CLS with fixed dimensions
            // Shadow to create the "hovering 2-4px above" feeling
            boxShadow: `
              0 2px 8px rgba(0, 0, 0, 0.3),
              0 0 1px rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          {/* Accent top line */}
          <AccentTopLine />

          {/* Corner brackets */}
          <CornerBrackets />

          {/* Main light streak */}
          <LightStreak streakRef={mainStreakRef} color={TOKENS.PRIMARY} />

          {/* Panel system markers */}
          <SystemMarker text="PANEL::GROWTH_SYSTEM" position="top-2 right-3" />
          <SystemMarker text="REF::002-A" position="bottom-2 left-3" />

          {/* ── Panel Content ────────────────────────── */}
          <div className="relative z-10 p-6 md:p-10 lg:p-14">
            {/* Section Title */}
            <h2
              ref={titleRef}
              id="services-intro-title"
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-[1.2] tracking-[-0.02em] will-change-transform"
              style={{ opacity: 0 }}
            >
              {renderTitle()}
            </h2>

            {/* ── Thin separator line ──────────────────── */}
            <div
              aria-hidden="true"
              className="mt-6 md:mt-8 mb-6 md:mb-8"
              style={{
                height: "1px",
                background: `linear-gradient(90deg, ${TOKENS.PRIMARY}33 0%, ${TOKENS.SECONDARY}33 50%, transparent 100%)`,
              }}
            />

            {/* ── Paragraph 1 ──────────────────────────── */}
            <p
              ref={paragraph1Ref}
              className="text-sm md:text-base text-white/60 leading-[1.7] max-w-2xl will-change-transform"
              style={{ opacity: 0 }}
            >
              Most agencies offer either web design or SEO. Some offer AI as a
              &ldquo;feature.&rdquo; We provide a{" "}
              <span className="text-white/90 font-medium">
                complete growth system
              </span>{" "}
              that includes modern web design, SEO strategy, and intelligent
              automation tailored to your business model.
            </p>

            {/* ── Paragraph 2 ──────────────────────────── */}
            <p
              ref={paragraph2Ref}
              className="mt-4 text-sm md:text-base text-white/60 leading-[1.7] max-w-2xl will-change-transform"
              style={{ opacity: 0 }}
            >
              Whether you&rsquo;re a startup, a service-based business, an
              e-commerce store, or a global brand, we build digital solutions
              that are designed to generate{" "}
              <span className="text-white/90 font-medium">
                leads, sales, and long-term growth
              </span>
              .
            </p>

            {/* ── Highlight Line ───────────────────────── */}
            <div
              ref={highlightRef}
              className="mt-8 md:mt-10 relative border-l-2 pl-4 md:pl-5 py-2 will-change-transform"
              style={{
                borderColor: `${TOKENS.PRIMARY}66`,
                opacity: 0,
              }}
            >
              <p className="text-xs md:text-sm text-white/50 leading-[1.6]">
                {HIGHLIGHT_LINE.prefix}
              </p>
              <p className="mt-1 text-sm md:text-base font-medium leading-[1.6]">
                {renderHighlightKeywords()}
              </p>
            </div>

            {/* ── Service Pillars Grid ──────────────────── */}
            <div
              ref={pillarsContainerRef}
              className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
              role="list"
              aria-label="Core service pillars"
            >
              {SERVICE_PILLARS.map((pillar, index) => (
                <div key={pillar.id} role="listitem">
                  <PillarCard
                    pillar={pillar}
                    index={index}
                    cardRef={
                      {
                        current: pillarCardRefs.current[index] ?? null,
                      } as React.RefObject<HTMLDivElement | null>
                    }
                    dotRef={
                      {
                        current: pillarDotRefs.current[index] ?? null,
                      } as React.RefObject<HTMLSpanElement | null>
                    }
                    streakRef={
                      {
                        current: pillarStreakRefs.current[index] ?? null,
                      } as React.RefObject<HTMLDivElement | null>
                    }
                  />
                  {/*
                    Using callback refs to populate the arrays.
                    The PillarCard receives object refs but we actually
                    need the callback pattern for array population.
                    Solving this with hidden ref-setter divs:
                  */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FIXED VERSION — Using callback refs properly for pillar arrays
// The above has a ref issue. Let me rebuild this correctly.
// ============================================================

/**
 * ServicesIntro — Production component
 * A Complete Digital Growth System section
 */
function ServicesIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mainStreakRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  // Use individual refs for each pillar to avoid array ref issues
  const pillarCard0 = useRef<HTMLDivElement>(null);
  const pillarCard1 = useRef<HTMLDivElement>(null);
  const pillarCard2 = useRef<HTMLDivElement>(null);
  const pillarDot0 = useRef<HTMLSpanElement>(null);
  const pillarDot1 = useRef<HTMLSpanElement>(null);
  const pillarDot2 = useRef<HTMLSpanElement>(null);
  const pillarStreak0 = useRef<HTMLDivElement>(null);
  const pillarStreak1 = useRef<HTMLDivElement>(null);
  const pillarStreak2 = useRef<HTMLDivElement>(null);

  const cardRefs = [pillarCard0, pillarCard1, pillarCard2] as const;
  const dotRefs = [pillarDot0, pillarDot1, pillarDot2] as const;
  const streakRefs = [pillarStreak0, pillarStreak1, pillarStreak2] as const;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.innerWidth <= TOKENS.MOBILE_MAX;

    const ctx = gsap.context(() => {
      // ────────────────────────────────────────────────────
      // ENTRANCE ANIMATIONS
      // ────────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      const allCards = cardRefs
        .map((r) => r.current)
        .filter(Boolean) as HTMLDivElement[];

      if (prefersReducedMotion) {
        // Instant reveal for reduced motion
        const targets = [
          panelRef.current,
          titleRef.current,
          p1Ref.current,
          p2Ref.current,
          highlightRef.current,
          ...allCards,
        ].filter(Boolean);
        tl.set(targets, { opacity: 1 });
        return;
      }

      // Panel
      tl.fromTo(
        panelRef.current,
        {
          opacity: 0,
          y: TOKENS.ENTRANCE_Y_OFFSET,
          scale: TOKENS.ENTRANCE_SCALE,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: TOKENS.ENTRANCE_DURATION,
          ease: "power2.out",
          force3D: true,
        },
      );

      // Title
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: TOKENS.ENTRANCE_Y_OFFSET * 0.7 },
        {
          opacity: 1,
          y: 0,
          duration: TOKENS.ENTRANCE_DURATION,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.35",
      );

      // Paragraphs
      tl.fromTo(
        [p1Ref.current, p2Ref.current].filter(Boolean),
        { opacity: 0, y: TOKENS.ENTRANCE_Y_OFFSET * 0.5 },
        {
          opacity: 1,
          y: 0,
          duration: TOKENS.ENTRANCE_DURATION,
          ease: "power2.out",
          stagger: TOKENS.ENTRANCE_STAGGER,
          force3D: true,
        },
        "-=0.25",
      );

      // Highlight
      tl.fromTo(
        highlightRef.current,
        { opacity: 0, y: TOKENS.ENTRANCE_Y_OFFSET * 0.4 },
        {
          opacity: 1,
          y: 0,
          duration: TOKENS.ENTRANCE_DURATION,
          ease: "power2.out",
          force3D: true,
        },
        "-=0.2",
      );

      // Pillar cards
      if (allCards.length > 0) {
        tl.fromTo(
          allCards,
          {
            opacity: 0,
            y: TOKENS.ENTRANCE_Y_OFFSET * 0.6,
            scale: TOKENS.ENTRANCE_SCALE,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: TOKENS.ENTRANCE_DURATION,
            ease: "power2.out",
            stagger: TOKENS.ENTRANCE_STAGGER,
            force3D: true,
          },
          "-=0.15",
        );
      }

      // ────────────────────────────────────────────────────
      // PERSISTENT ANIMATIONS
      // ────────────────────────────────────────────────────

      // Main panel light streak
      if (mainStreakRef.current) {
        gsap.fromTo(
          mainStreakRef.current,
          { xPercent: -100 },
          {
            xPercent: 500,
            duration: TOKENS.LIGHT_STREAK_DURATION,
            ease: "none",
            repeat: -1,
            force3D: true,
          },
        );
      }

      // Pillar streaks
      streakRefs.forEach((ref, i) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { xPercent: -100 },
            {
              xPercent: 500,
              duration: TOKENS.LIGHT_STREAK_DURATION + i * 2.5,
              ease: "none",
              repeat: -1,
              delay: i * 1.8,
              force3D: true,
            },
          );
        }
      });

      // Status dot pulses
      dotRefs.forEach((ref, i) => {
        if (ref.current) {
          gsap.to(ref.current, {
            opacity: 0.9,
            duration: TOKENS.PULSE_DURATION / 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.7,
          });
        }
      });

      // Ambient glow breathing (desktop only)
      if (!isMobile) {
        [glow1Ref.current, glow2Ref.current].forEach((el, i) => {
          if (el) {
            gsap.to(el, {
              scale: 1.05,
              opacity: TOKENS.AMBIENT_GLOW_OPACITY * 1.4,
              duration: TOKENS.GLOW_BREATHE_DURATION,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 3.5,
              force3D: true,
            });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Render Helpers ──────────────────────────────────────
  const titleJSX = SECTION_TITLE_PARTS.map((part, i) => {
    if (typeof part === "string") {
      return <React.Fragment key={i}>{part}</React.Fragment>;
    }
    return (
      <span key={i} style={{ color: part.color }}>
        {part.text}
      </span>
    );
  });

  const keywordColors = [TOKENS.PRIMARY, TOKENS.SECONDARY, TOKENS.ACCENT];

  return (
    <section
      ref={sectionRef}
      id="services-intro"
      aria-labelledby="services-intro-title"
      className="relative w-full overflow-hidden py-16 md:py-28 lg:py-16"
      style={{ backgroundColor: TOKENS.DARK_BG }}
    >
      {/* ── Background Grid ──────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,${TOKENS.GRID_OPACITY}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,${TOKENS.GRID_OPACITY}) 1px, transparent 1px)
          `,
          backgroundSize: `${TOKENS.GRID_SIZE}px ${TOKENS.GRID_SIZE}px`,
        }}
      />

      {/* ── Ambient Glows ────────────────────────────────── */}
      <div
        ref={glow1Ref}
        aria-hidden="true"
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: "550px",
          height: "550px",
          top: "-8%",
          right: "12%",
          background: `radial-gradient(circle, ${TOKENS.PRIMARY}0D 0%, transparent 70%)`,
          opacity: TOKENS.AMBIENT_GLOW_OPACITY,
        }}
      />
      <div
        ref={glow2Ref}
        aria-hidden="true"
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: "450px",
          height: "450px",
          bottom: "-5%",
          left: "8%",
          background: `radial-gradient(circle, ${TOKENS.ACCENT}0D 0%, transparent 70%)`,
          opacity: TOKENS.AMBIENT_GLOW_OPACITY,
        }}
      />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* ── Glass Panel ──────────────────────────────── */}
        <div
          ref={panelRef}
          className="relative border border-white/8 backdrop-blur-sm will-change-transform"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${TOKENS.PANEL_BG_OPACITY})`,
            opacity: 0,
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <AccentTopLine />
          <CornerBrackets />
          <LightStreak streakRef={mainStreakRef} />

          <SystemMarker text="PANEL::GROWTH_SYSTEM" position="top-2 right-3" />
          <SystemMarker text="REF::002-A" position="bottom-2 left-3" />

          {/* ── Inner Content ────────────────────────── */}
          <div className="relative z-10 p-6 md:p-10 lg:p-14">
            {/* Title */}
            <h2
              ref={titleRef}
              id="services-intro-title"
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-[1.2] tracking-[-0.02em] will-change-transform"
              style={{ opacity: 0 }}
            >
              {titleJSX}
            </h2>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="my-6 md:my-8"
              style={{
                height: "1px",
                background: `linear-gradient(90deg, ${TOKENS.PRIMARY}33, ${TOKENS.SECONDARY}33, transparent)`,
              }}
            />

            {/* Paragraph 1 */}
            <p
              ref={p1Ref}
              className="text-sm md:text-base text-white/60 leading-[1.7] max-w-2xl will-change-transform"
              style={{ opacity: 0 }}
            >
              Most agencies offer either web design or SEO. Some offer AI as a
              &ldquo;feature.&rdquo; We provide a{" "}
              <span className="text-white/90 font-medium">
                complete growth system
              </span>{" "}
              that includes modern web design, SEO strategy, and intelligent
              automation tailored to your business model.
            </p>

            {/* Paragraph 2 */}
            <p
              ref={p2Ref}
              className="mt-4 text-sm md:text-base text-white/60 leading-[1.7] max-w-2xl will-change-transform"
              style={{ opacity: 0 }}
            >
              Whether you&rsquo;re a startup, a service-based business, an
              e-commerce store, or a global brand, we build digital solutions
              that are designed to generate{" "}
              <span className="text-white/90 font-medium">
                leads, sales, and long-term growth
              </span>
              .
            </p>

            {/* Highlight Line */}
            <div
              ref={highlightRef}
              className="mt-8 md:mt-10 relative border-l-2 pl-4 md:pl-5 py-2 will-change-transform"
              style={{ borderColor: `${TOKENS.PRIMARY}66`, opacity: 0 }}
            >
              <p className="text-xs md:text-sm text-white/50 leading-[1.6]">
                {HIGHLIGHT_LINE.prefix}
              </p>
              <p className="mt-1 text-sm md:text-base font-medium leading-[1.6]">
                {HIGHLIGHT_LINE.keywords.map((kw, i) => (
                  <React.Fragment key={kw}>
                    {i > 0 && (
                      <span className="text-white/30 mx-1" aria-hidden="true">
                        ·
                      </span>
                    )}
                    <span style={{ color: keywordColors[i] }}>{kw}</span>
                  </React.Fragment>
                ))}
              </p>
            </div>

            {/* Service Pillars */}
            <div
              className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
              role="list"
              aria-label="Core service pillars"
            >
              {SERVICE_PILLARS.map((pillar, index) => {
                const colors = [
                  TOKENS.PRIMARY,
                  TOKENS.SECONDARY,
                  TOKENS.ACCENT,
                ];
                const c = colors[index];
                return (
                  <div
                    key={pillar.id}
                    ref={cardRefs[index]}
                    role="listitem"
                    className="relative border border-white/8 backdrop-blur-sm p-5 md:p-6 will-change-transform"
                    style={{
                      backgroundColor: `rgba(255,255,255,${TOKENS.PANEL_BG_OPACITY})`,
                      opacity: 0,
                      minHeight: "88px",
                    }}
                  >
                    {/* Top accent */}
                    <div
                      aria-hidden="true"
                      className="absolute top-0 left-0 right-0 pointer-events-none"
                      style={{
                        height: "1px",
                        background: `linear-gradient(90deg, transparent, ${c}88, transparent)`,
                      }}
                    />

                    {/* Light streak */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                    >
                      <div
                        ref={streakRefs[index]}
                        className="absolute top-0 h-full will-change-transform"
                        style={{
                          width: "25%",
                          left: "-25%",
                          background: `linear-gradient(90deg, transparent 0%, ${c}08 40%, ${c}0D 50%, ${c}08 60%, transparent 100%)`,
                        }}
                      />
                    </div>

                    {/* Corner brackets */}
                    <CornerBrackets />

                    {/* System label */}
                    <SystemMarker
                      text={`${pillar.coordinate}::${pillar.id.toUpperCase()}`}
                      position="top-1.5 right-2"
                    />

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3">
                      <span
                        ref={dotRefs[index]}
                        aria-hidden="true"
                        className="inline-block w-1.5 h-1.5 shrink-0 will-change-[opacity]"
                        style={{ backgroundColor: c, opacity: 0.5 }}
                      />
                      <div>
                        <p className="text-sm md:text-base font-medium text-white/90 tracking-[-0.01em]">
                          {pillar.label}
                        </p>
                        <p
                          className="font-mono text-[10px] tracking-widest text-white/30 mt-0.5"
                          aria-hidden="true"
                        >
                          {pillar.status}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ServicesIntro);
