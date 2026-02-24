// components/AIBenefits.tsx
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
// GSAP PLUGIN REGISTRATION
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
  STAGGER_ITEM: 0.08,
  BREATHE_SLOW: 10,
  GLOW_SCALE_MAX: 1.06,
  STREAK_DURATION: 14,
  STREAK_PAUSE: 0.38,
  // Quote typewriter — chars per second
  TYPEWRITER_SPEED: 0.03,
  // Progress bar fill duration
  BAR_DURATION: 1.1,
  BAR_EASE: "power3.out",
  // Orbit ring rotation — very slow, atmospheric
  ORBIT_DURATION: 40,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type AccentColor = typeof ENV.AMBER | typeof ENV.CYAN | typeof ENV.VIOLET;

interface Benefit {
  id: string;
  index: string;
  title: string;
  body: string;
  accent: AccentColor;
  metric: string; // Quantified value — makes abstract benefits concrete
  metricLabel: string;
  systemCode: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const BENEFITS: Benefit[] = [
  {
    id: "ux",
    index: "01",
    title: "Better User Experience",
    body: "AI adapts the website experience based on user behavior and needs — creating a personalized journey for every visitor.",
    accent: ENV.CYAN,
    metric: "68%",
    metricLabel: "Avg. engagement lift",
    systemCode: "BNF::UX_ADAPT",
  },
  {
    id: "conversion",
    index: "02",
    title: "Higher Conversion Rates",
    body: "AI guides users, answers questions instantly, and eliminates hesitation — turning browsers into buyers at scale.",
    accent: ENV.AMBER,
    metric: "3.4×",
    metricLabel: "Conversion multiplier",
    systemCode: "BNF::CONV_RATE",
  },
  {
    id: "support",
    index: "03",
    title: "24/7 Customer Support",
    body: "Your business responds to customers instantly — even when your team is offline. Zero response latency, any hour.",
    accent: ENV.CYAN,
    metric: "< 1s",
    metricLabel: "Response time",
    systemCode: "BNF::SUPPORT",
  },
  {
    id: "workload",
    index: "04",
    title: "Less Manual Work",
    body: "Automated processes replace repetitive tasks, freeing your team to focus on high-leverage creative and strategic work.",
    accent: ENV.AMBER,
    metric: "60%",
    metricLabel: "Workload reduction",
    systemCode: "BNF::AUTOMATE",
  },
  {
    id: "decisions",
    index: "05",
    title: "Smarter Business Decisions",
    body: "AI dashboards surface insights that were previously buried in data — helping leadership make faster, better-informed calls.",
    accent: ENV.VIOLET,
    metric: "∞",
    metricLabel: "Data points processed",
    systemCode: "BNF::INSIGHTS",
  },
  {
    id: "journey",
    index: "06",
    title: "Personalized Customer Journey",
    body: "AI recommends services, products, and solutions based on real user intent — making every interaction feel 1-to-1.",
    accent: ENV.VIOLET,
    metric: "91%",
    metricLabel: "Relevance accuracy",
    systemCode: "BNF::JOURNEY",
  },
];

const QUOTE =
  "AI transforms websites from static pages into intelligent business machines.";

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
// HOOK — scroll-triggered entrance
// ─────────────────────────────────────────────────────────────────────────────

function useScrollEntrance(
  ref: RefObject<HTMLElement | null>,
  reduced: boolean,
  stagger: number = MOTION.STAGGER_ITEM,
  start = "top 80%",
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
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [ref, reduced, stagger, start]);
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
// SUB-COMPONENT — Typewriter quote
// Reveals the quote character by character when scrolled into view.
// Uses a GSAP counter proxy — zero DOM node explosion, single text update.
// ─────────────────────────────────────────────────────────────────────────────

interface TypewriterQuoteProps {
  text: string;
  reduced: boolean;
}

const TypewriterQuote = memo(function TypewriterQuote({
  text,
  reduced,
}: TypewriterQuoteProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const textEl = textRef.current;
    const cursorEl = cursorRef.current;
    const lineEl = lineRef.current;
    if (!el || !textEl || !cursorEl || !lineEl) return;

    if (reduced) {
      textEl.textContent = text;
      gsap.set(cursorEl, { opacity: 0 });
      gsap.set(lineEl, { scaleX: 1 });
      return;
    }

    const proxy = { count: 0 };
    const total = text.length;

    const ctx = gsap.context(() => {
      // Cursor blink — starts immediately
      const cursorBlink = gsap.to(cursorEl, {
        opacity: 0,
        duration: 0.55,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
      });

      // Top accent line expands first — then text types
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });

      tl.fromTo(
        lineEl,
        { scaleX: 0, force3D: true },
        { scaleX: 1, duration: 0.6, ease: "power3.out", force3D: true },
      ).fromTo(
        proxy,
        { count: 0 },
        {
          count: total,
          duration: total * MOTION.TYPEWRITER_SPEED,
          ease: "none",
          onUpdate: () => {
            textEl.textContent = text.slice(0, Math.round(proxy.count));
          },
          onComplete: () => {
            // After typing completes, fade out cursor
            cursorBlink.kill();
            gsap.to(cursorEl, {
              opacity: 0,
              duration: 0.4,
              ease: "power1.out",
              force3D: true,
            });
          },
        },
        // Slight overlap — line finishes then text starts
        "-=0.1",
      );
    }, el);

    return () => ctx.revert();
  }, [text, reduced]);

  return (
    <div
      ref={wrapRef}
      className="
        relative overflow-hidden
        bg-white/2.5 border border-white/[0.07]
        px-8 py-10 sm:px-12 sm:py-14
      "
      style={{
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Accent line — top, expands via scaleX */}
      <div
        ref={lineRef}
        aria-hidden="true"
        className="will-change-transform absolute top-0 left-0 right-0 h-px origin-left"
        style={{
          background: `linear-gradient(to right, ${ENV.AMBER}, ${ENV.CYAN})`,
          opacity: 0.7,
          transform: "scaleX(0)",
        }}
      />

      {/* Large decorative quote mark */}
      <div
        aria-hidden="true"
        className="absolute top-6 left-8 font-sans font-bold text-[6rem] leading-none select-none pointer-events-none opacity-[0.04]"
        style={{ color: ENV.AMBER, lineHeight: 1 }}
      >
        "
      </div>

      {/* Quote text */}
      <blockquote className="relative">
        <p
          className="font-sans font-semibold leading-normal tracking-[-0.015em] text-white/90"
          style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}
        >
          <span
            aria-hidden="true"
            className="text-[#F59E0B] mr-1 opacity-70 font-sans"
          >
            "
          </span>
          <span ref={textRef} />
          <span
            ref={cursorRef}
            aria-hidden="true"
            className="will-change-transform inline-block ml-0.5 font-mono font-light"
            style={{ color: ENV.AMBER }}
          >
            ▌
          </span>
          <span aria-hidden="true" className="text-[#F59E0B] ml-0.5 opacity-70">
            "
          </span>
          {/* Visually hidden full text for screen readers — typewriter is decorative */}
          <span className="sr-only">{text}</span>
        </p>

        <footer className="mt-6 flex items-center gap-3">
          <div
            aria-hidden="true"
            className="w-8 h-px opacity-40"
            style={{ backgroundColor: ENV.AMBER }}
          />
          <cite className="not-italic font-mono text-[10px] tracking-[0.18em] uppercase text-white/35">
            AI Platform — Core Principle
          </cite>
        </footer>
      </blockquote>

      {/* Corner bracket — bottom right */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 right-4 w-5 h-5 opacity-[0.12]"
      >
        <div
          className="absolute bottom-0 right-0 w-full h-px"
          style={{ backgroundColor: ENV.CYAN }}
        />
        <div
          className="absolute bottom-0 right-0 w-px h-full"
          style={{ backgroundColor: ENV.CYAN }}
        />
      </div>

      {/* System label */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-3.5 left-6 font-mono text-[8px] tracking-[0.14em] text-white/15"
      >
        QT::CORE_PRINCIPLE
      </p>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — Orbit visualization
// A central "AI core" with orbiting benefit labels.
// Pure CSS + GSAP rotation — zero layout impact.
// Only shown on xl screens — decorative, aria-hidden.
// ─────────────────────────────────────────────────────────────────────────────

interface OrbitVisualizationProps {
  reduced: boolean;
}

const ORBIT_LABELS = [
  { label: "Support", angle: 0, color: ENV.CYAN },
  { label: "Conversion", angle: 60, color: ENV.AMBER },
  { label: "Automation", angle: 120, color: ENV.AMBER },
  { label: "Insights", angle: 180, color: ENV.VIOLET },
  { label: "Content", angle: 240, color: ENV.VIOLET },
  { label: "Experience", angle: 300, color: ENV.CYAN },
];

const ORBIT_RADIUS = 120; // px from center to label

const OrbitVisualization = memo(function OrbitVisualization({
  reduced,
}: OrbitVisualizationProps) {
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const corePulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Outer ring rotates clockwise
      gsap.to(outerRingRef.current, {
        rotate: 360,
        duration: MOTION.ORBIT_DURATION,
        ease: "none",
        repeat: -1,
        force3D: true,
      });

      // Inner ring counter-rotates — creates visual complexity from simplicity
      gsap.to(innerRingRef.current, {
        rotate: -360,
        duration: MOTION.ORBIT_DURATION * 0.65,
        ease: "none",
        repeat: -1,
        force3D: true,
      });

      // Core pulse — breathes like a living system
      gsap.to(corePulseRef.current, {
        scale: 1.15,
        opacity: 0.5,
        duration: 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
      });
    });

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      className="relative w-[320px] h-80 shrink-0 flex items-center justify-center"
    >
      {/* Outer orbit ring */}
      <div
        ref={outerRingRef}
        className="will-change-transform absolute inset-0 rounded-full"
        style={{
          border: `1px solid rgba(${hexToRgb(ENV.CYAN)}, 0.12)`,
        }}
      >
        {/* Dash marker on ring */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: ENV.CYAN, opacity: 0.6 }}
        />
      </div>

      {/* Inner orbit ring */}
      <div
        ref={innerRingRef}
        className="will-change-transform absolute rounded-full"
        style={{
          inset: "32px",
          border: `1px solid rgba(${hexToRgb(ENV.AMBER)}, 0.10)`,
        }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: ENV.AMBER, opacity: 0.6 }}
        />
      </div>

      {/* Orbit nodes — positioned by polar coordinates */}
      {ORBIT_LABELS.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = Math.cos(rad) * ORBIT_RADIUS;
        const y = Math.sin(rad) * ORBIT_RADIUS;

        return (
          <div
            key={node.label}
            className="absolute flex items-center justify-center"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Node dot */}
            <div
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: node.color, opacity: 0.7 }}
            />
            {/* Label — positioned outward from center */}
            <span
              className="absolute font-mono text-[8px] tracking-widest uppercase whitespace-nowrap"
              style={{
                color: node.color,
                opacity: 0.5,
                // Push label further out than the dot
                left: x > 0 ? "12px" : undefined,
                right: x < 0 ? "12px" : undefined,
                textAlign: x < 0 ? "right" : "left",
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Core — the AI nucleus */}
      <div className="relative flex items-center justify-center">
        {/* Pulse ring */}
        <div
          ref={corePulseRef}
          className="will-change-transform absolute w-16 h-16 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(${hexToRgb(ENV.AMBER)}, 0.2) 0%, transparent 70%)`,
          }}
        />
        {/* Core surface */}
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, rgba(${hexToRgb(ENV.AMBER)}, 0.25) 0%, rgba(${hexToRgb(ENV.CYAN)}, 0.1) 100%)`,
            border: `1px solid rgba(${hexToRgb(ENV.AMBER)}, 0.35)`,
            boxShadow: `0 0 20px rgba(${hexToRgb(ENV.AMBER)}, 0.15)`,
          }}
        >
          <span className="font-mono text-[8px] tracking-widest text-white/60">
            AI
          </span>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — Benefit row item
// Each benefit renders as a horizontal row with:
// - Index + accent line
// - Title + body
// - Animated metric bar + value (reveals on scroll)
// - Hover: left accent border expands
// ─────────────────────────────────────────────────────────────────────────────

interface BenefitRowProps {
  benefit: Benefit;
  rowIndex: number;
  reduced: boolean;
}

const BenefitRow = memo(function BenefitRow({
  benefit,
  rowIndex,
  reduced,
}: BenefitRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useLightStreak(streakRef, rowIndex * 2.3, reduced);

  // Bar fill — animates scaleX from 0 to 1 on scroll into view
  useEffect(() => {
    const bar = barFillRef.current;
    if (!bar) return;

    if (reduced) {
      gsap.set(bar, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0, force3D: true },
        {
          scaleX: 1,
          duration: MOTION.BAR_DURATION,
          ease: MOTION.BAR_EASE,
          force3D: true,
          scrollTrigger: {
            trigger: bar,
            start: "top 88%",
            once: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [reduced]);

  // Left border accent — expands on hover
  const handleEnter = useCallback(() => {
    setHovered(true);
    if (!borderRef.current || reduced) return;
    gsap.to(borderRef.current, {
      scaleY: 1,
      duration: 0.35,
      ease: "power2.out",
      force3D: true,
    });
  }, [reduced]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    if (!borderRef.current || reduced) return;
    gsap.to(borderRef.current, {
      scaleY: 0,
      duration: 0.25,
      ease: "power2.in",
      force3D: true,
    });
  }, [reduced]);

  const rgb = hexToRgb(benefit.accent);

  return (
    <div
      ref={rowRef}
      data-animate
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="
        will-change-transform opacity-0
        relative overflow-hidden
        flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-8
        px-6 py-6
        bg-white/2.5 border border-white/[0.07]
        backdrop-blur-xs
        transition-colors duration-300
        hover:bg-white/4 hover:border-white/11
        group
      "
      style={{
        boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
      }}
    >
      {/* Top accent edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, ${benefit.accent}70, transparent 50%)`,
          opacity: hovered ? 0.8 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Left border accent — scaleY from top on hover */}
      <div
        ref={borderRef}
        aria-hidden="true"
        className="will-change-transform pointer-events-none absolute top-0 left-0 bottom-0 w-px origin-top"
        style={{
          backgroundColor: benefit.accent,
          opacity: 0.6,
          transform: "scaleY(0)",
        }}
      />

      {/* Light streak */}
      <div
        ref={streakRef}
        aria-hidden="true"
        className="pointer-events-none will-change-transform absolute inset-y-0 left-0 z-10"
        style={{
          width: "30%",
          background: `linear-gradient(to right, transparent, rgba(${rgb}, 0.03) 50%, transparent)`,
        }}
      />

      {/* ── Left: index + metric ───────────────────────────────────────── */}
      <div className="shrink-0 flex sm:flex-col items-start gap-4 sm:gap-3 sm:w-28">
        {/* Index */}
        <span
          className="font-mono text-[11px] tracking-[0.2em] font-medium"
          style={{ color: benefit.accent, opacity: 0.5 }}
          aria-hidden="true"
        >
          {benefit.index}
        </span>

        {/* Metric display */}
        <div className="flex flex-col gap-1">
          <span
            className="font-sans font-bold tracking-[-0.03em] leading-none"
            style={{
              color: benefit.accent,
              fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
              opacity: 0.9,
            }}
          >
            {benefit.metric}
          </span>
          <span className="font-mono text-[8px] tracking-widest uppercase text-white/25 leading-tight">
            {benefit.metricLabel}
          </span>
        </div>
      </div>

      {/* Vertical separator — desktop only */}
      <div
        aria-hidden="true"
        className="hidden sm:block w-px self-stretch opacity-[0.08]"
        style={{ backgroundColor: benefit.accent }}
      />

      {/* ── Center: title + body ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-2.5">
        <h3
          className="font-sans font-semibold text-white/90 tracking-[-0.015em] leading-snug"
          style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1.0625rem)" }}
        >
          {benefit.title}
        </h3>
        <p className="font-sans text-[0.8125rem] leading-[1.75] text-white/45">
          {benefit.body}
        </p>

        {/* Progress bar — visual representation of impact */}
        <div className="mt-1 flex items-center gap-3">
          {/* Track */}
          <div
            ref={barRef}
            className="flex-1 h-0.5 bg-white/6 overflow-hidden max-w-50"
          >
            {/* Fill */}
            <div
              ref={barFillRef}
              className="will-change-transform h-full w-full origin-left"
              style={{
                background: `linear-gradient(to right, ${benefit.accent}, rgba(${rgb}, 0.3))`,
                opacity: 0.7,
                transform: "scaleX(0)",
              }}
            />
          </div>
          <span className="font-mono text-[8px] tracking-widest text-white/20 uppercase">
            {benefit.metricLabel}
          </span>
        </div>
      </div>

      {/* System code — bottom right atmospheric */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-2.5 right-4 font-mono text-[8px] tracking-[0.14em] text-white/12"
      >
        {benefit.systemCode}
      </p>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — Intro block
// ─────────────────────────────────────────────────────────────────────────────

interface IntroBlockProps {
  reduced: boolean;
}

const IntroBlock = memo(function IntroBlock({ reduced }: IntroBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollEntrance(ref, reduced, 0.1, "top 84%");

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_auto] xl:gap-16 items-end"
    >
      {/* Text block */}
      <div className="flex flex-col gap-6 max-w-160">
        {/* Section label */}
        <div data-animate className="will-change-transform opacity-0">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[#06B6D4]/60">
            <span
              aria-hidden="true"
              className="inline-block w-4 h-px bg-[#06B6D4] opacity-60"
            />
            Value Framework
            <span
              aria-hidden="true"
              className="inline-block w-4 h-px bg-[#06B6D4] opacity-60"
            />
          </p>
        </div>

        {/* H2 */}
        <div data-animate className="will-change-transform opacity-0">
          <h2
            id="benefits-headline"
            className="font-sans font-bold leading-[1.1] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Benefits of <span style={{ color: ENV.CYAN }}>AI</span> in Modern{" "}
            <span style={{ color: ENV.AMBER }}>Web Design</span>
          </h2>
        </div>

        {/* Divider */}
        <div data-animate className="will-change-transform opacity-0">
          <div
            aria-hidden="true"
            className="w-16 h-px"
            style={{
              background: `linear-gradient(to right, ${ENV.AMBER}, ${ENV.CYAN})`,
            }}
          />
        </div>

        {/* Intro paragraphs */}
        <div
          data-animate
          className="will-change-transform opacity-0 flex flex-col gap-3"
        >
          <p
            className="font-sans leading-[1.75] text-white/55"
            style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}
          >
            AI is not just a trend. When integrated correctly, it transforms a
            website into a system that can{" "}
            <span style={{ color: ENV.AMBER, opacity: 0.9 }}>
              operate and grow your business automatically.
            </span>
          </p>
          <p
            className="font-sans leading-[1.75] text-white/45"
            style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}
          >
            AI helps websites become faster, smarter, and more personalized —
            leading to better customer experience and higher conversion rates.
          </p>
        </div>
      </div>

      {/* Orbit visualization — desktop only, purely atmospheric */}
      <div
        data-animate
        aria-hidden="true"
        className="will-change-transform opacity-0 hidden xl:flex items-center justify-center"
      >
        <OrbitVisualization reduced={reduced} />
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT — AIBenefits
// ─────────────────────────────────────────────────────────────────────────────

const AIBenefits = memo(function AIBenefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const amberGlowRef = useRef<HTMLDivElement>(null);
  const violetGlowRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();

  // Scroll-triggered list entrance
  useScrollEntrance(listRef, reduced, MOTION.STAGGER_ITEM, "top 78%");

  // Ambient glow breathing
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
      gsap.to(violetGlowRef.current, {
        scale: MOTION.GLOW_SCALE_MAX,
        duration: MOTION.BREATHE_SLOW * 1.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
        delay: MOTION.BREATHE_SLOW * 0.4,
      });
    });

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="ai-benefits"
      aria-labelledby="benefits-headline"
      className="relative w-full overflow-hidden bg-[#0B0F19]  py-24  xl:py-32"
    >
      {/* ── Grid overlay ───────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: `${ENV.GRID_SIZE}px ${ENV.GRID_SIZE}px`,
          }}
        />
        {/* Structural lines */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-[0.07]"
          style={{
            background: `linear-gradient(to right, transparent, ${ENV.VIOLET}99 40%, ${ENV.CYAN}99 60%, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-[0.05]"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.3) 50%, transparent)",
          }}
        />
      </div>

      {/* ── Ambient glows ──────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          ref={amberGlowRef}
          className="will-change-transform absolute -right-[15%] top-[5%] w-[55vw] h-[55vw] max-w-175 max-h-175 rounded-full opacity-[0.04]"
          style={{
            background: `radial-gradient(circle, ${ENV.AMBER} 0%, transparent 70%)`,
          }}
        />
        <div
          ref={violetGlowRef}
          className="will-change-transform absolute -left-[10%] bottom-[10%] w-[45vw] h-[45vw] max-w-150 max-h-150 rounded-full opacity-[0.04]"
          style={{
            background: `radial-gradient(circle, ${ENV.VIOLET} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4  flex flex-col gap-16 xl:gap-20">
        {/* Intro */}
        <IntroBlock reduced={reduced} />

        {/* Horizontal rule */}
        <div
          aria-hidden="true"
          className="h-px w-full opacity-[0.07]"
          style={{
            background: `linear-gradient(to right, transparent, ${ENV.CYAN}80 30%, ${ENV.VIOLET}80 70%, transparent)`,
          }}
        />

        {/* ── Benefits list — 2 column grid on large screens ─────────────── */}
        <div ref={listRef} className="flex flex-col gap-4">
          {/* Column grid label */}
          <div
            data-animate
            className="will-change-transform opacity-0 flex items-center gap-4"
          >
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/20">
              Six core business advantages
            </p>
            <div
              aria-hidden="true"
              className="flex-1 h-px opacity-15"
              style={{ backgroundColor: ENV.CYAN }}
            />
            <p className="font-mono text-[10px] tracking-[0.14em] text-white/15">
              06 / 06
            </p>
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {BENEFITS.map((benefit, i) => (
              <BenefitRow
                key={benefit.id}
                benefit={benefit}
                rowIndex={i}
                reduced={reduced}
              />
            ))}
          </div>
        </div>

        {/* Horizontal rule */}
        <div
          aria-hidden="true"
          className="h-px w-full opacity-[0.07]"
          style={{
            background: `linear-gradient(to right, transparent, ${ENV.AMBER}80 30%, ${ENV.CYAN}80 70%, transparent)`,
          }}
        />

        {/* ── Quote block ────────────────────────────────────────────────── */}
        <TypewriterQuote text={QUOTE} reduced={reduced} />
      </div>
    </section>
  );
});

export default AIBenefits;
