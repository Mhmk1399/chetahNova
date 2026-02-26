// components/AIToolsOverview.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─────────────────────────────────────────────────────────────────────────────
// GSAP PLUGIN REGISTRATION — done once, at module level
// ─────────────────────────────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ENV = {
  BG: "#0B0F19",
  AMBER: "#F59E0B",
  CYAN: "#06B6D4",
  VIOLET: "#6D28D9",
  GRID_SIZE: 72,
} as const;

const MOTION = {
  ENTRANCE_DURATION: 0.65,
  ENTRANCE_EASE: "power2.out",
  ENTRANCE_Y: 28,
  ENTRANCE_SCALE: 0.98,
  STAGGER_WORD: 0.04, // per-word stagger for headline split
  STAGGER_CARD: 0.1, // per-card stagger
  BREATHE_SLOW: 10,
  GLOW_SCALE_MAX: 1.06,
  STREAK_DURATION: 14,
  STREAK_PAUSE: 0.35,
  COUNTER_DURATION: 2.0, // number counter animation
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  accent: string;
}

interface ProcessStep {
  id: string;
  index: string;
  title: string;
  description: string;
  accent: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────

const STATS: StatItem[] = [
  {
    id: "efficiency",
    value: 73,
    suffix: "%",
    label: "Average efficiency gain",
    accent: ENV.AMBER,
  },
  {
    id: "workload",
    value: 60,
    suffix: "%",
    label: "Reduction in manual workload",
    accent: ENV.CYAN,
  },
  {
    id: "conversion",
    value: 3.4,
    suffix: "×",
    label: "Increase in conversion rate",
    accent: ENV.AMBER,
  },
  {
    id: "deployment",
    value: 14,
    suffix: "d",
    label: "Average deployment time",
    accent: ENV.CYAN,
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "audit",
    index: "01",
    title: "Business Audit",
    description:
      "We map your current workflows, identify bottlenecks, and pinpoint where AI creates the highest leverage.",
    accent: ENV.AMBER,
  },
  {
    id: "design",
    index: "02",
    title: "Custom Architecture",
    description:
      "Every system is designed from zero for your business model — no templates, no generic logic.",
    accent: ENV.CYAN,
  },
  {
    id: "integrate",
    index: "03",
    title: "Deep Integration",
    description:
      "AI is wired directly into your website, CRM, and data pipeline — not bolted on as an afterthought.",
    accent: ENV.VIOLET,
  },
  {
    id: "optimize",
    index: "04",
    title: "Continuous Learning",
    description:
      "Systems improve over time. We monitor, retrain, and optimize based on your live business data.",
    accent: ENV.AMBER,
  },
];

// Headline words with individual accent assignments
// "undefined" = default white — only meaningful words get color
const HEADLINE_TOKENS: { word: string; accent?: string }[] = [
  { word: "What" },
  { word: "AI", accent: ENV.CYAN },
  { word: "Tools" },
  { word: "Do" },
  { word: "We" },
  { word: "Build?", accent: ENV.AMBER },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const c = hex.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ].join(",");
}

function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — scroll-triggered entrance for a container's [data-animate] children
// ─────────────────────────────────────────────────────────────────────────────

function useScrollEntrance(
  ref: RefObject<HTMLElement | null>,
  reduced: boolean,
  stagger: number = MOTION.STAGGER_CARD,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-animate]");
    if (!targets.length) return;

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: MOTION.ENTRANCE_Y,
          scale: MOTION.ENTRANCE_SCALE,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: MOTION.ENTRANCE_DURATION,
          ease: MOTION.ENTRANCE_EASE,
          stagger,
          force3D: true,
          clearProps: "scale",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true, // Fire once — don't reverse on scroll up
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [ref, reduced, stagger]);
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — light streak sweep
// ─────────────────────────────────────────────────────────────────────────────

function useLightStreak(
  ref: RefObject<HTMLDivElement | null>,
  delaySeconds: number,
  reduced: boolean,
): void {
  useEffect(() => {
    if (reduced || !ref.current) return;

    const sweep = (): void => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { xPercent: -150, force3D: true },
        {
          xPercent: 500,
          duration: MOTION.STREAK_DURATION,
          ease: "none",
          delay: MOTION.STREAK_DURATION * MOTION.STREAK_PAUSE,
          onComplete: sweep,
          force3D: true,
        },
      );
    };

    gsap.set(ref.current, { xPercent: -150, force3D: true });
    const id = setTimeout(sweep, delaySeconds * 1000);
    return () => clearTimeout(id);
  }, [ref, delaySeconds, reduced]);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — animated number counter
// Counts from 0 to target when scrolled into view
// ─────────────────────────────────────────────────────────────────────────────

interface CounterProps {
  target: number;
  suffix: string;
  accent: string;
  reduced: boolean;
}

const AnimatedCounter = memo(function AnimatedCounter({
  target,
  suffix,
  accent,
  reduced,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasDecimals = !Number.isInteger(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Proxy object lets GSAP tween a number without touching the DOM
    const proxy = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        val: target,
        duration: reduced ? 0 : MOTION.COUNTER_DURATION,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = hasDecimals
            ? proxy.val.toFixed(1)
            : Math.round(proxy.val).toString();
        },
        onComplete: () => {
          // Ensure exact final value — no floating point drift
          el.textContent = hasDecimals ? target.toFixed(1) : target.toString();
        },
      });
    });

    return () => ctx.revert();
  }, [target, hasDecimals, reduced]);

  return (
    <span
      className="font-sans font-bold tracking-[-0.03em]"
      style={{
        color: accent,
        fontSize: "clamp(2.25rem, 4vw, 3rem)",
      }}
    >
      <span ref={ref} aria-label={`${target}${suffix}`}>
        {reduced ? (hasDecimals ? target.toFixed(1) : target) : "0"}
      </span>
      <span className="text-[0.6em] ml-0.5 opacity-80" aria-hidden="true">
        {suffix}
      </span>
    </span>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — process step card with hover micro-interaction
// ─────────────────────────────────────────────────────────────────────────────

interface StepCardProps {
  step: ProcessStep;
  reduced: boolean;
  streakDelay: number;
}

const StepCard = memo(function StepCard({
  step,
  reduced,
  streakDelay,
}: StepCardProps) {
  const streakRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  useLightStreak(streakRef, streakDelay, reduced);

  // Hover: accent line expands width — pure transform, GPU only
  const handleEnter = useCallback(() => {
    if (reduced || !lineRef.current) return;
    gsap.to(lineRef.current, {
      scaleX: 1,
      duration: 0.4,
      ease: "power2.out",
      force3D: true,
    });
  }, [reduced]);

  const handleLeave = useCallback(() => {
    if (reduced || !lineRef.current) return;
    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.in",
      force3D: true,
    });
  }, [reduced]);

  const rgb = hexToRgb(step.accent);

  return (
    <div
      ref={cardRef}
      data-animate
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="
        will-change-transform opacity-0
        relative overflow-hidden
        bg-white/3 border border-white/8
        backdrop-blur-xs
        p-6 flex flex-col gap-4
        group cursor-default
        transition-colors duration-300
        hover:bg-white/5.5 hover:border-white/13
      "
      style={{
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Top accent edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${step.accent}70 40%, ${step.accent}30 70%, transparent)`,
        }}
      />

      {/* Light streak */}
      <div
        ref={streakRef}
        aria-hidden="true"
        className="pointer-events-none will-change-transform absolute inset-y-0 left-0 z-10"
        style={{
          width: "30%",
          background: `linear-gradient(to right, transparent, rgba(${rgb},0.035) 50%, transparent)`,
        }}
      />

      {/* Index + accent dot */}
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-[11px] tracking-[0.2em] opacity-40"
          style={{ color: step.accent }}
          aria-hidden="true"
        >
          {step.index}
        </span>
        {/* Separator rule */}
        <div
          aria-hidden="true"
          className="flex-1 h-px opacity-20"
          style={{ backgroundColor: step.accent }}
        />
        {/* Corner bracket — top-right */}
        <div aria-hidden="true" className="w-3 h-3 opacity-20 relative">
          <div
            className="absolute top-0 right-0 w-full h-px"
            style={{ backgroundColor: step.accent }}
          />
          <div
            className="absolute top-0 right-0 w-px h-full"
            style={{ backgroundColor: step.accent }}
          />
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-sans font-semibold text-white/90 tracking-[-0.015em] leading-tight"
        style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
      >
        {step.title}
      </h3>

      {/* Description */}
      <p className="font-sans text-sm leading-[1.7] text-white/50 flex-1">
        {step.description}
      </p>

      {/* Bottom accent line — expands on hover, scaleX from left */}
      <div
        ref={lineRef}
        aria-hidden="true"
        className="will-change-transform absolute bottom-0 left-0 h-px w-full origin-left"
        style={{
          backgroundColor: step.accent,
          opacity: 0.5,
          transform: "scaleX(0)", // Pre-set — no layout shift
        }}
      />
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — stat card
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  stat: StatItem;
  reduced: boolean;
}

const StatCard = memo(function StatCard({ stat, reduced }: StatCardProps) {
  return (
    <div
      data-animate
      className="
        will-change-transform opacity-0
        relative overflow-hidden
        bg-white/2.5 border border-white/[0.07]
        p-5 flex flex-col gap-2
      "
      style={{
        boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
      }}
    >
      {/* Top edge accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, ${stat.accent}60, transparent 60%)`,
        }}
      />

      <AnimatedCounter
        target={stat.value}
        suffix={stat.suffix}
        accent={stat.accent}
        reduced={reduced}
      />

      <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/35 leading-normal">
        {stat.label}
      </p>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — split headline with per-word animation
// Each word is a span — stagger reveals word by word, not char by char
// (char-level would cause too many DOM nodes)
// ─────────────────────────────────────────────────────────────────────────────

interface SplitHeadlineProps {
  reduced: boolean;
}

const SplitHeadline = memo(function SplitHeadline({
  reduced,
}: SplitHeadlineProps) {
  const wrapRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!words.length) return;

    if (reduced) {
      gsap.set(words, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0, y: 20, force3D: true },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: MOTION.ENTRANCE_EASE,
          stagger: MOTION.STAGGER_WORD,
          force3D: true,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 82%",
            once: true,
          },
        },
      );
    }, wrapRef.current ?? undefined);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <h2
      ref={wrapRef}
      id="ai-tools-headline"
      className="font-sans font-bold leading-[1.1] tracking-[-0.02em] text-white"
      style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
    >
      {HEADLINE_TOKENS.map((token, i) => (
        <React.Fragment key={i}>
          <span
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="inline-block will-change-transform opacity-0"
            style={token.accent ? { color: token.accent } : undefined}
          >
            {token.word}
          </span>
          {/* Space between words — non-breaking for layout */}
          {i < HEADLINE_TOKENS.length - 1 && (
            <span aria-hidden="true" className="inline-block w-[0.28em]" />
          )}
        </React.Fragment>
      ))}
    </h2>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — the central "terminal" text block
// Renders body copy with inline code-style highlight for the key phrase
// ─────────────────────────────────────────────────────────────────────────────

const TerminalBlock = memo(function TerminalBlock() {
  return (
    <div
      className="
        relative overflow-hidden
        bg-white/2.5] border border-white/[0.07]
        p-6 sm:p-8
      "
      style={{
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Terminal chrome bar — top decoration */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-8 border-b border-white/6 flex items-center px-4 gap-2"
      >
        {/* Traffic-light dots — purely atmospheric, inverted for dark theme */}
        {[ENV.AMBER, ENV.CYAN, ENV.VIOLET].map((color, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full opacity-30"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
        <span className="flex-1" />
        <span className="font-mono text-[8px] tracking-[0.15em] text-white/20 uppercase">
          AI::OVERVIEW
        </span>
      </div>

      {/* Content — shifted below chrome bar */}
      <div className="mt-8 flex flex-col gap-6">
        {/* Left accent bar + paragraph block */}
        <div className="flex gap-4">
          {/* Vertical accent rule */}
          <div
            aria-hidden="true"
            className="w-px shrink-0 self-stretch opacity-30"
            style={{
              background: `linear-gradient(to bottom, ${ENV.AMBER}, ${ENV.CYAN})`,
            }}
          />

          <div className="flex flex-col gap-4">
            <p
              className="font-sans leading-[1.75] text-white/60"
              style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}
            >
              Artificial Intelligence is changing how businesses operate.
              Instead of hiring more staff for repetitive tasks, businesses can
              automate processes using AI systems integrated directly into their
              websites.
            </p>

            <p
              className="font-sans leading-[1.75] text-white/60"
              style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}
            >
              We build AI-powered tools that improve efficiency, increase sales,
              and reduce operational workload. Every AI solution we develop is
              tailored to your{" "}
              <span style={{ color: ENV.AMBER }} className="opacity-90">
                business model
              </span>
              ,{" "}
              <span style={{ color: ENV.CYAN }} className="opacity-90">
                customer behavior
              </span>
              , and{" "}
              <span style={{ color: ENV.AMBER }} className="opacity-90">
                growth strategy
              </span>
              .
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="h-px opacity-10"
          style={{
            background: `linear-gradient(to right, ${ENV.AMBER}, ${ENV.CYAN})`,
          }}
        />

        {/* Highlight line — the key differentiator */}
        <div className="flex items-start gap-3">
          {/* Marker */}
          <span
            aria-hidden="true"
            className="shrink-0 mt-0.5 font-mono text-xs"
            style={{ color: ENV.AMBER }}
          >
            ◆
          </span>

          <p
            className="font-sans font-medium leading-[1.6] text-white/85 tracking-[-0.005em]"
            style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}
          >
            We don&apos;t sell generic AI systems.{" "}
            <span className="font-semibold" style={{ color: ENV.CYAN }}>
              We build custom AI automation tools designed specifically for your
              business.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — inline process diagram connector
// Thin horizontal line connecting the 4 step cards
// Only visible on lg+ where cards are in a row
// ─────────────────────────────────────────────────────────────────────────────

const ProcessConnector = memo(function ProcessConnector() {
  return (
    <div
      aria-hidden="true"
      className="hidden lg:block absolute top-13 left-[12.5%] right-[12.5%] h-px pointer-events-none"
      style={{
        background: `linear-gradient(to right, ${ENV.AMBER}40, ${ENV.CYAN}40, ${ENV.VIOLET}40, ${ENV.AMBER}40)`,
      }}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT — AIToolsOverview
// ─────────────────────────────────────────────────────────────────────────────

const AIToolsOverview = memo(function AIToolsOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const amberGlowRef = useRef<HTMLDivElement>(null);
  const cyanGlowRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();

  // Scroll-triggered entrances for each region
  useScrollEntrance(contentRef, reduced, 0.12);
  useScrollEntrance(statsRef, reduced, 0.08);
  useScrollEntrance(processRef, reduced, MOTION.STAGGER_CARD);

  // Ambient glow breathing — persistent atmosphere
  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.to(amberGlowRef.current, {
        scale: MOTION.GLOW_SCALE_MAX,
        duration: MOTION.BREATHE_SLOW,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
      });
      gsap.to(cyanGlowRef.current, {
        scale: MOTION.GLOW_SCALE_MAX,
        duration: MOTION.BREATHE_SLOW * 1.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
        delay: MOTION.BREATHE_SLOW * 0.6,
      });
    });

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="ai-tools-overview"
      aria-labelledby="ai-tools-headline"
      className="relative w-full overflow-hidden bg-[#0B0F19] py-24 xl:py-32"
    >
      {/* ── Grid overlay ────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 opacity-22]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: `${ENV.GRID_SIZE}px ${ENV.GRID_SIZE}px`,
          }}
        />
      </div>

      {/* ── Ambient glows ────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          ref={amberGlowRef}
          className="will-change-transform absolute right-[-10%] top-[-10%] w-[55vw] h-[55vw] max-w-175 max-h-175 rounded-full opacity-[0.04]"
          style={{
            background: `radial-gradient(circle, ${ENV.AMBER} 0%, transparent 70%)`,
          }}
        />
        <div
          ref={cyanGlowRef}
          className="will-change-transform absolute left-[-10%] bottom-[-10%] w-[45vw] h-[45vw] max-w-150 max-h-150 rounded-full opacity-[0.045]"
          style={{
            background: `radial-gradient(circle, ${ENV.CYAN} 0%, transparent 70%)`,
          }}
        />
      </div>

     

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 flex flex-col gap-16 xl:gap-20">
        {/* ── REGION 1: Section label + headline + body ──────────────────── */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 xl:gap-20 items-start"
        >
          {/* Left column — headline block */}
          <div className="flex flex-col gap-6">
            {/* Section label */}
            <div data-animate className="will-change-transform opacity-0">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[#F59E0B]/60">
                <span
                  aria-hidden="true"
                  className="inline-block w-4 h-px opacity-60"
                  style={{ backgroundColor: ENV.AMBER }}
                />
                Core Introduction
                <span
                  aria-hidden="true"
                  className="inline-block w-4 h-px opacity-60"
                  style={{ backgroundColor: ENV.AMBER }}
                />
              </p>
            </div>

            {/* Split-word animated headline */}
            <div data-animate className="will-change-transform opacity-0">
              <SplitHeadline reduced={reduced} />
            </div>

            {/* Gradient divider */}
            <div data-animate className="will-change-transform opacity-0">
              <div
                aria-hidden="true"
                className="w-16 h-px"
                style={{
                  background: `linear-gradient(to right, ${ENV.AMBER}, ${ENV.CYAN})`,
                }}
              />
            </div>

            {/* Short paragraph for left column on large screens */}
            <div data-animate className="will-change-transform opacity-0">
              <p
                className="font-sans leading-[1.7] text-white/50 max-w-[42ch]"
                style={{ fontSize: "clamp(0.875rem, 1.3vw, 1rem)" }}
              >
                From automating support queues to qualifying leads in real-time,
                every tool we engineer is a precision instrument — not a product
                you configure from a dashboard.
              </p>
            </div>

            {/* System spec list — purely atmospheric detail */}
            <div data-animate className="will-change-transform opacity-0">
              <ul
                className="flex flex-col gap-2"
                aria-label="AI system specifications"
              >
                {[
                  {
                    label: "Integration depth",
                    value: "Full-stack",
                    accent: ENV.AMBER,
                  },
                  {
                    label: "Model type",
                    value: "Custom-trained",
                    accent: ENV.CYAN,
                  },
                  {
                    label: "Deployment",
                    value: "14-day average",
                    accent: ENV.AMBER,
                  },
                  {
                    label: "Ongoing learning",
                    value: "Continuous",
                    accent: ENV.CYAN,
                  },
                ].map((spec) => (
                  <li
                    key={spec.label}
                    className="flex items-center gap-3 group"
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-[9px] tracking-widest text-white/20 w-28 shrink-0"
                    >
                      {spec.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex-1 h-px bg-white/5"
                    />
                    <span
                      className="font-mono text-[10px] tracking-[0.08em]"
                      style={{ color: spec.accent, opacity: 0.8 }}
                    >
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column — terminal body copy */}
          <div data-animate className="will-change-transform opacity-0">
            <TerminalBlock />
          </div>
        </div>

        {/* ── Horizontal section rule ─────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="h-px w-full opacity-[0.07]"
          style={{
            background: `linear-gradient(to right, transparent, ${ENV.AMBER}80 30%, ${ENV.CYAN}80 70%, transparent)`,
          }}
        />

        {/* ── REGION 2: Stats strip ──────────────────────────────────────── */}
        <div ref={statsRef} className="flex flex-col gap-6">
          {/* Label */}
          <div data-animate className="will-change-transform opacity-0">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/25">
              By the numbers — measured across active deployments
            </p>
          </div>

          {/* Stat cards grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {STATS.map((stat) => (
              <StatCard key={stat.id} stat={stat} reduced={reduced} />
            ))}
          </div>
        </div>

        {/* ── Horizontal section rule ─────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="h-px w-full opacity-[0.07]"
          style={{
            background: `linear-gradient(to right, transparent, ${ENV.CYAN}80 30%, ${ENV.VIOLET}80 70%, transparent)`,
          }}
        />

        {/* ── REGION 3: Process steps ────────────────────────────────────── */}
        <div ref={processRef} className="flex flex-col gap-8">
          {/* Label */}
          <div data-animate className="will-change-transform opacity-0">
            <div className="flex items-center gap-4">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/25">
                How we build — the four-phase method
              </p>
              <div
                aria-hidden="true"
                className="flex-1 h-px opacity-20"
                style={{ backgroundColor: ENV.CYAN }}
              />
            </div>
          </div>

          {/* Step cards — relative wrapper needed for the connector line */}
          <div className="relative">
            <ProcessConnector />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
              {PROCESS_STEPS.map((step, i) => (
                <StepCard
                  key={step.id}
                  step={step}
                  reduced={reduced}
                  // Stagger streak start times so they never sync across cards
                  streakDelay={i * 3.5}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* end max-width container */}
    </section>
  );
});

export default AIToolsOverview;
