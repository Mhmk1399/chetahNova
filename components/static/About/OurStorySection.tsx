// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/OurStorySection.tsx
// PURPOSE: Company history with animated vertical timeline and journey aesthetic
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
  surface: "#0D1117",
  success: "#10B981",
  timeline: "#1E293B",
} as const;

const OPACITY = {
  body: 0.6,
  caption: 0.4,
  decorative: 0.08,
  hexGrid: 0.02,
  glassBg: 0.03,
  timelineLine: 0.3,
  radarSweep: 0.04,
} as const;

const ANIMATION = {
  entranceDuration: 0.7,
  staggerDelay: 0.15,
  timelineNodeDelay: 0.3,
  pulseTravelDuration: 3,
  radarSweepDuration: 6,
  signalPulseDuration: 2,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_CONTENT = {
  systemLabel: "SYS::ORIGIN_LOG",
  version: "LOG.v3.2",
  eyebrow: "Company History",
  title: "Our Story",
  storyParagraphs: [
    {
      highlight: "Our agency was founded with one goal:",
      text: "to bridge the gap between traditional web design and the future of smart digital systems.",
    },
    {
      highlight: null,
      text: "We noticed that many businesses invest in websites that look modern but fail to generate traffic, leads, or sales. At the same time, the rise of artificial intelligence created a massive opportunity for automation, smarter customer experiences, and faster business operations.",
    },
    {
      highlight: "That's why we built a new kind of agency:",
      text: "a team that delivers not only design and development, but also SEO growth systems and custom AI automation tools.",
    },
    {
      highlight: null,
      text: "Today, we work internationally and help businesses build websites that are faster, smarter, and more profitable.",
    },
  ],
  timeline: [
    {
      year: "Y1",
      label: "Year One",
      title: "The Beginning",
      description: "Started as a web design studio",
      status: "COMPLETED",
      signal: 100,
      color: COLORS.primary,
    },
    {
      year: "Y2",
      label: "Year Two",
      title: "SEO Expansion",
      description: "Expanded into full SEO services",
      status: "COMPLETED",
      signal: 100,
      color: COLORS.secondary,
    },
    {
      year: "Y3",
      label: "Year Three",
      title: "AI Integration",
      description: "Built custom AI tools for automation",
      status: "COMPLETED",
      signal: 100,
      color: COLORS.accent,
    },
    {
      year: "NOW",
      label: "Present Day",
      title: "Global Operations",
      description: "Full smart website solutions for international clients",
      status: "ACTIVE",
      signal: 100,
      color: COLORS.success,
    },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface OurStorySectionProps {
  id?: string;
}

interface TimelineNodeProps {
  year: string;
  label: string;
  title: string;
  description: string;
  status: string;
  signal: number;
  color: string;
  index: number;
  isLast: boolean;
  nodeRef: (el: HTMLDivElement | null) => void;
}

interface StoryBlockProps {
  highlight: string | null;
  text: string;
  index: number;
  blockRef: (el: HTMLDivElement | null) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate hexagonal grid pattern
 */
const generateHexGrid = (): string => {
  const size = 30;
  const height = size * Math.sqrt(3);
  return `
    radial-gradient(circle at 0% 50%, rgba(255,255,255,${OPACITY.hexGrid}) 2px, transparent 2px),
    radial-gradient(circle at 100% 50%, rgba(255,255,255,${OPACITY.hexGrid}) 2px, transparent 2px),
    radial-gradient(circle at 50% 0%, rgba(255,255,255,${OPACITY.hexGrid}) 2px, transparent 2px),
    radial-gradient(circle at 50% 100%, rgba(255,255,255,${OPACITY.hexGrid}) 2px, transparent 2px)
  `;
};

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * HexagonalGrid - Unique hexagonal dot pattern
 */
const HexagonalGrid = memo(function HexagonalGrid(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: generateHexGrid(),
        backgroundSize: "60px 52px",
      }}
    />
  );
});

/**
 * RadarSweep - Rotating radar/sonar effect
 */
const RadarSweep = memo(function RadarSweep({
  radarRef,
}: {
  radarRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {/* Radar circles */}
      {[1, 2, 3, 4].map((ring) => (
        <div
          key={ring}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: `${ring * 200}px`,
            height: `${ring * 200}px`,
            borderColor: `${COLORS.secondary}${Math.round(
              (0.1 - ring * 0.02) * 255,
            )
              .toString(16)
              .padStart(2, "0")}`,
          }}
        />
      ))}

      {/* Sweep line */}
      <div
        ref={radarRef}
        className="absolute left-1/2 top-1/2 origin-left will-change-transform"
        style={{
          width: "400px",
          height: "2px",
          background: `linear-gradient(90deg, ${COLORS.secondary}60, transparent)`,
          boxShadow: `0 0 20px ${COLORS.secondary}40`,
        }}
      />
    </div>
  );
});

/**
 * TravelingPulse - Animated pulse that travels along the timeline
 */
const TravelingPulse = memo(function TravelingPulse({
  pulseRef,
}: {
  pulseRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  return (
    <div
      ref={pulseRef}
      aria-hidden="true"
      className="absolute left-1/2 top-0 z-10 -translate-x-1/2 will-change-transform"
    >
      <div
        className="h-4 w-4 -translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${COLORS.secondary} 0%, transparent 70%)`,
          boxShadow: `0 0 20px ${COLORS.secondary}, 0 0 40px ${COLORS.secondary}60`,
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
      <span className="absolute right-4 top-4 flex items-center gap-2 sm:right-8 sm:top-8">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
        TRANSMITTING
      </span>
      <span className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
        {SECTION_CONTENT.version}
      </span>
      <span className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8">
        SIGNAL.STRENGTH.100%
      </span>
    </div>
  );
});

/**
 * AmbientEffects - Background glow effects
 */
const AmbientEffects = memo(function AmbientEffects(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Left story area glow */}
      <div
        className="absolute -left-40 top-1/4 h-150 w-150"
        style={{
          background: `radial-gradient(circle, ${COLORS.primary}06 0%, transparent 60%)`,
        }}
      />
      {/* Right timeline glow */}
      <div
        className="absolute -right-40 top-1/2 h-200 w-100 -translate-y-1/2"
        style={{
          background: `radial-gradient(ellipse, ${COLORS.secondary}08 0%, transparent 70%)`,
        }}
      />
      {/* Bottom accent */}
      <div
        className="absolute -bottom-40 left-1/2 h-100 w-200 -translate-x-1/2"
        style={{
          background: `radial-gradient(ellipse, ${COLORS.accent}05 0%, transparent 70%)`,
        }}
      />
    </div>
  );
});

/**
 * StoryBlock - Individual story paragraph with transmission styling
 */
const StoryBlock = memo(function StoryBlock({
  highlight,
  text,
  index,
  blockRef,
}: StoryBlockProps): JSX.Element {
  const isEven = index % 2 === 0;

  return (
    <div
      ref={blockRef}
      className="relative mb-8 opacity-0 will-change-transform last:mb-0"
    >
      {/* Transmission indicator */}
      <div
        aria-hidden="true"
        className="absolute -left-4 top-0 flex h-full flex-col items-center sm:-left-8"
      >
        <div
          className="h-2 w-2"
          style={{
            backgroundColor: isEven ? COLORS.primary : COLORS.secondary,
            boxShadow: `0 0 8px ${isEven ? COLORS.primary : COLORS.secondary}`,
          }}
        />
        <div
          className="w-px flex-1"
          style={{
            background: `linear-gradient(180deg, ${isEven ? COLORS.primary : COLORS.secondary}40, transparent)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="pl-4 sm:pl-8">
        {/* Line number / index */}
        <span
          className="mb-2 block font-mono text-[10px] uppercase tracking-widest"
          style={{ color: `rgba(255, 255, 255, 0.3)` }}
        >
          LOG.{String(index + 1).padStart(2, "0")}
        </span>

        {/* Text content */}
        <p
          className="text-base leading-relaxed sm:text-lg"
          style={{
            color: `rgba(255, 255, 255, ${OPACITY.body})`,
            lineHeight: 1.8,
          }}
        >
          {highlight && (
            <span
              className="font-medium"
              style={{ color: isEven ? COLORS.primary : COLORS.secondary }}
            >
              {highlight}{" "}
            </span>
          )}
          {text}
        </p>
      </div>
    </div>
  );
});

/**
 * SignalStrength - Visual signal indicator
 */
const SignalStrength = memo(function SignalStrength({
  strength,
  color,
}: {
  strength: number;
  color: string;
}): JSX.Element {
  const bars = 4;
  const activeBars = Math.ceil((strength / 100) * bars);

  return (
    <div
      className="flex items-end gap-0.5"
      aria-label={`Signal strength ${strength}%`}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-1 transition-all duration-300"
          style={{
            height: `${(i + 1) * 3 + 4}px`,
            backgroundColor: i < activeBars ? color : `${color}30`,
            boxShadow: i < activeBars ? `0 0 4px ${color}60` : "none",
          }}
        />
      ))}
    </div>
  );
});

/**
 * TimelineNode - Individual timeline milestone
 */
const TimelineNode = memo(function TimelineNode({
  year,
  label,
  title,
  description,
  status,
  signal,
  color,
  index,
  isLast,
  nodeRef,
}: TimelineNodeProps): JSX.Element {
  const isActive = status === "ACTIVE";

  return (
    <div
      ref={nodeRef}
      className="relative flex gap-6 pb-12 opacity-0 will-change-transform last:pb-0"
    >
      {/* Timeline spine */}
      <div className="relative flex flex-col items-center">
        {/* Node */}
        <div className="relative z-10">
          {/* Outer ring (for active state) */}
          {isActive && (
            <div
              className="absolute -inset-3 animate-ping"
              style={{
                border: `1px solid ${color}`,
                opacity: 0.3,
              }}
            />
          )}

          {/* Main node */}
          <div
            className="relative flex h-12 w-12 items-center justify-center border-2"
            style={{
              borderColor: color,
              backgroundColor: `${color}15`,
              boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}10`,
            }}
          >
            {/* Year label */}
            <span className="font-mono text-xs font-bold" style={{ color }}>
              {year}
            </span>

            {/* Corner accents */}
            <span
              className="absolute -left-1 -top-1 h-2 w-2 border-l-2 border-t-2"
              style={{ borderColor: color }}
            />
            <span
              className="absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2"
              style={{ borderColor: color }}
            />
            <span
              className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2"
              style={{ borderColor: color }}
            />
            <span
              className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2"
              style={{ borderColor: color }}
            />
          </div>
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div
            className="mt-2 w-px flex-1"
            style={{
              background: `linear-gradient(180deg, ${color}, ${COLORS.timeline})`,
            }}
          />
        )}
      </div>

      {/* Content card */}
      <div className="flex-1 pt-1">
        <div
          className="group relative overflow-hidden border transition-all duration-300 hover:-translate-y-0.5"
          style={{
            borderColor: `${color}30`,
            backgroundColor: `rgba(255, 255, 255, ${OPACITY.glassBg})`,
            boxShadow: `0 4px 20px rgba(0, 0, 0, 0.2)`,
          }}
        >
          {/* Top accent */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, ${color}, transparent)`,
            }}
          />

          {/* Hover glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at 0% 0%, ${color}08, transparent 60%)`,
            }}
          />

          {/* Content */}
          <div className="relative p-5 sm:p-6">
            {/* Header row */}
            <div className="mb-3 flex items-center justify-between">
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: `rgba(255, 255, 255, 0.4)` }}
              >
                {label}
              </span>
              <div className="flex items-center gap-3">
                <SignalStrength strength={signal} color={color} />
                <span
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
                  style={{
                    color: isActive
                      ? COLORS.success
                      : `rgba(255, 255, 255, 0.3)`,
                  }}
                >
                  {isActive && (
                    <span
                      className="h-1.5 w-1.5 animate-pulse"
                      style={{ backgroundColor: COLORS.success }}
                    />
                  )}
                  {status}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3
              className="mb-2 text-lg font-medium text-white sm:text-xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className="text-sm sm:text-base"
              style={{
                color: `rgba(255, 255, 255, ${OPACITY.body})`,
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>

            {/* Progress bar (for visual interest) */}
            <div
              aria-hidden="true"
              className="mt-4 h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${color}60, ${color}20, transparent)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * SectionHeader - Title with transmission styling
 */
const SectionHeader = memo(function SectionHeader({
  headerRefs,
}: {
  headerRefs: RefObject<HTMLElement[]>;
}): JSX.Element {
  const addRef = useCallback(
    (el: HTMLElement | null) => {
      if (el && headerRefs.current && !headerRefs.current.includes(el)) {
        headerRefs.current.push(el);
      }
    },
    [headerRefs],
  );

  return (
    <div className="mb-12 lg:mb-0">
      {/* Eyebrow */}
      <p
        ref={addRef}
        className="mb-4 font-mono text-xs uppercase opacity-0 will-change-transform"
        style={{
          color: COLORS.secondary,
          letterSpacing: "0.25em",
        }}
      >
        {SECTION_CONTENT.eyebrow}
      </p>

      {/* Title with decorative elements */}
      <div className="relative">
        <h2
          ref={addRef}
          className="text-4xl font-bold text-white opacity-0 will-change-transform sm:text-5xl lg:text-6xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          {SECTION_CONTENT.title}
        </h2>

        {/* Decorative underline */}
        <div
          ref={addRef}
          aria-hidden="true"
          className="mt-4 flex items-center gap-3 opacity-0 will-change-transform"
        >
          <div
            className="h-1 w-16"
            style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
            }}
          />
          <div
            className="h-2 w-2"
            style={{
              backgroundColor: COLORS.accent,
              boxShadow: `0 0 10px ${COLORS.accent}`,
            }}
          />
          <div
            className="h-px flex-1 max-w-25"
            style={{
              background: `linear-gradient(90deg, ${COLORS.accent}60, transparent)`,
            }}
          />
        </div>
      </div>

      {/* Transmission info */}
      <div
        ref={addRef}
        className="mt-6 flex items-center gap-4 opacity-0 will-change-transform"
      >
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: `rgba(255, 255, 255, 0.3)` }}
        >
          ORIGIN.TRANSMISSION
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-3 w-0.5"
              style={{
                backgroundColor:
                  i <= 4 ? COLORS.success : `${COLORS.success}30`,
                animation:
                  i <= 4
                    ? `pulse ${1 + i * 0.2}s ease-in-out infinite`
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * StoryContent - Left side story text
 */
const StoryContent = memo(function StoryContent({
  storyRefs,
}: {
  storyRefs: RefObject<HTMLDivElement[]>;
}): JSX.Element {
  const addRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el && storyRefs.current && !storyRefs.current.includes(el)) {
        storyRefs.current.push(el);
      }
    },
    [storyRefs],
  );

  return (
    <div className="relative">
      {/* Decorative bracket */}
      <div
        aria-hidden="true"
        className="absolute -left-4 -top-4 h-8 w-8 border-l-2 border-t-2 sm:-left-6"
        style={{ borderColor: `${COLORS.primary}40` }}
      />

      {/* Story blocks */}
      <div className="relative">
        {SECTION_CONTENT.storyParagraphs.map((paragraph, index) => (
          <StoryBlock
            key={index}
            highlight={paragraph.highlight}
            text={paragraph.text}
            index={index}
            blockRef={addRef}
          />
        ))}
      </div>

      {/* Bottom bracket */}
      <div
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 h-8 w-8 border-b-2 border-r-2 sm:-right-6"
        style={{ borderColor: `${COLORS.secondary}40` }}
      />
    </div>
  );
});

/**
 * Timeline - Right side vertical timeline
 */
const Timeline = memo(function Timeline({
  timelineRefs,
  pulseRef,
}: {
  timelineRefs: RefObject<HTMLDivElement[]>;
  pulseRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  const addRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el && timelineRefs.current && !timelineRefs.current.includes(el)) {
        timelineRefs.current.push(el);
      }
    },
    [timelineRefs],
  );

  return (
    <div className="relative">
      {/* Timeline header */}
      <div className="mb-8 flex items-center gap-4">
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: COLORS.secondary }}
        >
          Journey.Log
        </span>
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${COLORS.secondary}40, transparent)`,
          }}
        />
      </div>

      {/* Timeline content */}
      <div className="relative">
        {/* Background line */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-6 top-0 w-px"
          style={{
            background: `linear-gradient(180deg, ${COLORS.timeline}, ${COLORS.timeline}80, ${COLORS.success})`,
          }}
        />

        {/* Traveling pulse */}
        <TravelingPulse pulseRef={pulseRef} />

        {/* Timeline nodes */}
        <div>
          {SECTION_CONTENT.timeline.map((item, index) => (
            <TimelineNode
              key={item.year}
              year={item.year}
              label={item.label}
              title={item.title}
              description={item.description}
              status={item.status}
              signal={item.signal}
              color={item.color}
              index={index}
              isLast={index === SECTION_CONTENT.timeline.length - 1}
              nodeRef={addRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useStoryAnimations(refs: {
  sectionRef: RefObject<HTMLElement | null>;
  headerRefs: RefObject<HTMLElement[]>;
  storyRefs: RefObject<HTMLDivElement[]>;
  timelineRefs: RefObject<HTMLDivElement[]>;
  radarRef: RefObject<HTMLDivElement | null>;
  pulseRef: RefObject<HTMLDivElement | null>;
}): void {
  const {
    sectionRef,
    headerRefs,
    storyRefs,
    timelineRefs,
    radarRef,
    pulseRef,
  } = refs;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (headerRefs.current) gsap.set(headerRefs.current, { opacity: 1 });
        if (storyRefs.current) gsap.set(storyRefs.current, { opacity: 1 });
        if (timelineRefs.current)
          gsap.set(timelineRefs.current, { opacity: 1 });
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // HEADER ENTRANCE
      // ─────────────────────────────────────────────────────────────────────

      if (headerRefs.current && headerRefs.current.length > 0) {
        gsap.fromTo(
          headerRefs.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: ANIMATION.entranceDuration,
            ease: "power2.out",
            stagger: ANIMATION.staggerDelay,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // ─────────────────────────────────────────────────────────────────────
      // STORY BLOCKS ENTRANCE (typewriter-like reveal)
      // ─────────────────────────────────────────────────────────────────────

      if (storyRefs.current && storyRefs.current.length > 0) {
        gsap.fromTo(
          storyRefs.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: storyRefs.current[0],
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // ─────────────────────────────────────────────────────────────────────
      // TIMELINE NODES ENTRANCE (cascade from top)
      // ─────────────────────────────────────────────────────────────────────

      if (timelineRefs.current && timelineRefs.current.length > 0) {
        gsap.fromTo(
          timelineRefs.current,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            stagger: ANIMATION.timelineNodeDelay,
            scrollTrigger: {
              trigger: timelineRefs.current[0],
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // ─────────────────────────────────────────────────────────────────────
      // PERSISTENT ANIMATIONS
      // ─────────────────────────────────────────────────────────────────────

      // Radar sweep rotation
      gsap.to(radarRef.current, {
        rotation: 360,
        duration: ANIMATION.radarSweepDuration,
        ease: "none",
        repeat: -1,
        transformOrigin: "left center",
      });

      // Traveling pulse along timeline
      gsap.to(pulseRef.current, {
        top: "100%",
        duration: ANIMATION.pulseTravelDuration,
        ease: "none",
        repeat: -1,
        repeatDelay: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, headerRefs, storyRefs, timelineRefs, radarRef, pulseRef]);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function OurStorySection({
  id = "our-story",
}: OurStorySectionProps): JSX.Element {
  // ─────────────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────────────

  const sectionRef = useRef<HTMLElement>(null);
  const headerRefs = useRef<HTMLElement[]>([]);
  const storyRefs = useRef<HTMLDivElement[]>([]);
  const timelineRefs = useRef<HTMLDivElement[]>([]);
  const radarRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────

  useStoryAnimations({
    sectionRef,
    headerRefs,
    storyRefs,
    timelineRefs,
    radarRef,
    pulseRef,
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
      {/* Background layers */}
      <HexagonalGrid />
      <AmbientEffects />
      <SystemMarkers />

      {/* Radar sweep (hidden on mobile for performance) */}
      <div className="hidden lg:block">
        <RadarSweep radarRef={radarRef} />
      </div>

      {/* Content container */}
      <div className="relative mx-auto max-w-[99%] md:max-w-[90%] px-4">
        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - Story */}
          <div>
            <SectionHeader headerRefs={headerRefs} />
            <div className="mt-10 lg:mt-12">
              <StoryContent storyRefs={storyRefs} />
            </div>
          </div>

          {/* Right column - Timeline */}
          <div className="lg:pl-8">
            <Timeline timelineRefs={timelineRefs} pulseRef={pulseRef} />
          </div>
        </div>

        {/* Bottom accent */}
        <div
          aria-hidden="true"
          className="mx-auto mt-20 flex items-center justify-center gap-3"
        >
          <div
            className="h-px w-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}50)`,
            }}
          />
          <div className="flex items-center gap-1.5">
            <span
              className="h-1 w-1"
              style={{ backgroundColor: COLORS.primary }}
            />
            <span
              className="h-2 w-2"
              style={{
                backgroundColor: COLORS.secondary,
                boxShadow: `0 0 10px ${COLORS.secondary}`,
              }}
            />
            <span
              className="h-1 w-1"
              style={{ backgroundColor: COLORS.accent }}
            />
          </div>
          <div
            className="h-px w-20"
            style={{
              background: `linear-gradient(90deg, ${COLORS.secondary}50, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

OurStorySection.displayName = "OurStorySection";
