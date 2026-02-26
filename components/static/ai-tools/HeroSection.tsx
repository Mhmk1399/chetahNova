// components/HeroSection.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  memo,
  type RefObject,
} from "react";
import { gsap } from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — every magic number has a name and a reason
// ─────────────────────────────────────────────────────────────────────────────

const ENV = {
  BG: "#0B0F19",
  AMBER: "#F59E0B",
  CYAN: "#06B6D4",
  VIOLET: "#6D28D9",
  GRID_SIZE: 72, // px — graph paper under glass, 64–80 per spec
} as const;

const MOTION = {
  ENTRANCE_DURATION: 0.65,
  ENTRANCE_EASE: "power2.out",
  ENTRANCE_Y: 32,
  ENTRANCE_SCALE: 0.98,
  ENTRANCE_STAGGER: 0.1,
  BREATHE_SLOW: 10, // ambient glow cycle, seconds
  BREATHE_FAST: 2.5, // status dot cycle, seconds
  STREAK_DURATION: 12, // light sweep across glass, seconds
  STREAK_PAUSE: 0.3, // fraction of duration paused before next sweep
  SHIMMER_DURATION: 0.6, // CTA hover shimmer, seconds
  SHIMMER_EASE: "power2.out",
  CURSOR_BLINK: 0.6, // AI typing cursor blink, seconds
  BAR_DURATION: 0.7, // chart bar fill, seconds
  STATUS_MIN: 0.4, // opacity floor for ◉ ACTIVE dot
  STATUS_MAX: 0.7, // opacity ceiling for ◉ ACTIVE dot
  GLOW_SCALE_MAX: 1.06, // ambient glow breath ceiling
} as const;

// Depth → box-shadow — physical weight through shadow layering
const PANEL_SHADOWS: Record<1 | 2 | 3, string> = {
  1: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
  2: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
  3: "0 12px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type AccentColor = typeof ENV.AMBER | typeof ENV.CYAN | typeof ENV.VIOLET;
type PanelDepth = 1 | 2 | 3;

interface FeatureBullet {
  id: string;
  label: string;
  accent: AccentColor;
  code: string;
}

interface MetricBar {
  id: string;
  label: string;
  value: number; // 0–100
  color: AccentColor;
}

interface KpiStat {
  id: string;
  label: string;
  value: string;
  delta: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}

interface FlowNode {
  id: string;
  label: string;
  status: "done" | "active" | "pending";
}

interface SeoMetric {
  id: string;
  label: string;
  value: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA — typed, co-located, no prop-drilling
// ─────────────────────────────────────────────────────────────────────────────

const FEATURE_BULLETS: FeatureBullet[] = [
  {
    id: "support",
    label: "AI Customer Support & Chatbots",
    accent: ENV.AMBER,
    code: "MOD::01",
  },
  {
    id: "leads",
    label: "AI Lead Qualification & Automation",
    accent: ENV.CYAN,
    code: "MOD::02",
  },
  {
    id: "analytics",
    label: "AI Dashboards & Business Analytics",
    accent: ENV.AMBER,
    code: "MOD::03",
  },
  {
    id: "seo",
    label: "AI SEO Content Systems & Optimization",
    accent: ENV.CYAN,
    code: "MOD::04",
  },
];

const KPI_STATS: KpiStat[] = [
  { id: "rev", label: "Revenue", value: "$124.8K", delta: "+18.4%" },
  { id: "conv", label: "Conv. Rate", value: "7.3%", delta: "+2.1%" },
  { id: "leads", label: "Leads / Mo", value: "2,340", delta: "+31.7%" },
];

const METRIC_BARS: MetricBar[] = [
  { id: "conv", label: "Conversions", value: 78, color: ENV.AMBER },
  { id: "leads", label: "Leads", value: 91, color: ENV.CYAN },
  { id: "engage", label: "Engagement", value: 64, color: ENV.VIOLET },
  { id: "ret", label: "Retention", value: 83, color: ENV.AMBER },
];

const CHAT_MESSAGES: ChatMessage[] = [
  { id: "m1", role: "user", text: "What's my best performing product?" },
  {
    id: "m2",
    role: "ai",
    text: "Pro Plan — 340% ROI. Shall I generate a full report?",
  },
  { id: "m3", role: "user", text: "Yes, and flag any churn risks." },
];

const FLOW_NODES: FlowNode[] = [
  { id: "n1", label: "Lead Captured", status: "done" },
  { id: "n2", label: "AI Scored", status: "done" },
  { id: "n3", label: "Routed", status: "active" },
  { id: "n4", label: "Converted", status: "pending" },
];

const FLOW_NODE_COLORS: Record<FlowNode["status"], string> = {
  done: ENV.CYAN,
  active: ENV.AMBER,
  pending: "rgba(255,255,255,0.15)",
};

const SEO_METRICS: SeoMetric[] = [
  { id: "rank", label: "Avg. Rank", value: "#2.4" },
  { id: "traffic", label: "Organic", value: "+142%" },
  { id: "kw", label: "Keywords", value: "1,847" },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY — hex to rgb string for rgba() construction
// ─────────────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — prefers-reduced-motion, evaluated once on mount
// ─────────────────────────────────────────────────────────────────────────────

function useReducedMotion(): boolean {
  // We read this synchronously so GSAP never starts forbidden animations.
  // SSR-safe: window check inside effect, default false for server.
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — light streak sweep, GPU only (translateX)
// ─────────────────────────────────────────────────────────────────────────────

function useLightStreak(
  ref: RefObject<HTMLDivElement | null>,
  delaySeconds: number,
  reduced: boolean,
): void {
  useEffect(() => {
    if (reduced || !ref.current) return;

    // Self-referential recursion — never uses setInterval, no drift
    const sweep = (): void => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { xPercent: -150, force3D: true },
        {
          xPercent: 500,
          duration: MOTION.STREAK_DURATION,
          ease: "none", // Constant velocity — physics of light
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
// HOOK — shimmer on CTA hover
// ─────────────────────────────────────────────────────────────────────────────

function useShimmer(ref: RefObject<HTMLSpanElement | null>) {
  return useCallback(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { xPercent: -100, force3D: true },
      {
        xPercent: 200,
        duration: MOTION.SHIMMER_DURATION,
        ease: MOTION.SHIMMER_EASE,
        force3D: true,
      },
    );
  }, [ref]);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — GlassPanel
// A self-contained floating glass surface with light streak, accent geometry.
// ─────────────────────────────────────────────────────────────────────────────

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  accent: AccentColor;
  systemId: string;
  depth: PanelDepth;
  streakDelay: number; // seconds — offsets sweeps so panels don't sync
  reduced: boolean;
}

const GlassPanel = memo(function GlassPanel({
  children,
  className = "",
  accent,
  systemId,
  depth,
  streakDelay,
  reduced,
}: GlassPanelProps) {
  const streakRef = useRef<HTMLDivElement>(null);
  useLightStreak(streakRef, streakDelay, reduced);

  const rgb = hexToRgb(accent);

  return (
    <article
      aria-label={`${systemId.replace("PANEL::", "")} interface panel`}
      className={`relative overflow-hidden bg-white/4 border border-white/10 backdrop-blur-xs ${className}`}
      style={{
        boxShadow: PANEL_SHADOWS[depth],
        // Elevate by depth — simulates physical hover above background plane
        transform: `translateY(-${depth + 1}px)`,
        zIndex: depth * 10,
      }}
    >
      {/* Top-edge accent gradient — catches ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background: `linear-gradient(to right, transparent, ${accent}80 40%, ${accent}40 70%, transparent)`,
        }}
      />

      {/* Corner bracket — top-left structural marker */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-2 left-2 w-3 h-3 z-10 opacity-30"
      >
        <div
          className="absolute top-0 left-0 w-full h-px"
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute top-0 left-0 w-px h-full"
          style={{ backgroundColor: accent }}
        />
      </div>

      {/* System ID — atmospheric monospace tag */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-2.5 right-2.5 z-10 font-mono text-[8px] tracking-[0.14em] opacity-20"
        style={{ color: accent }}
      >
        {systemId}
      </p>

      {/* Light streak — glass reflection sweep, GPU only */}
      <div
        ref={streakRef}
        aria-hidden="true"
        className="pointer-events-none will-change-transform absolute inset-y-0 left-0 z-20"
        style={{
          width: "25%",
          background: `linear-gradient(to right, transparent, rgba(${rgb},0.04) 50%, transparent)`,
        }}
      />

      <div className="relative z-10 w-full h-full">{children}</div>
    </article>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — Dashboard panel mockup
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardPanelProps {
  reduced: boolean;
}

const DashboardPanel = memo(function DashboardPanel({
  reduced,
}: DashboardPanelProps) {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const targets = barRefs.current.filter(Boolean);
    if (reduced) {
      // Reveal immediately — no layout shift, just set final state
      targets.forEach((bar, i) => {
        gsap.set(bar, { scaleX: METRIC_BARS[i].value / 100 });
      });
      return;
    }

    // Staggered bar reveal — data appearing, not loading
    targets.forEach((bar, i) => {
      if (!bar) return;
      gsap.fromTo(
        bar,
        { scaleX: 0, force3D: true },
        {
          scaleX: METRIC_BARS[i].value / 100,
          duration: MOTION.BAR_DURATION,
          ease: MOTION.ENTRANCE_EASE,
          // After parent panel entrance completes (~0.8s) + stagger
          delay: 0.9 + i * 0.08,
          force3D: true,
        },
      );
    });
  }, [reduced]);

  return (
    <div className="w-full h-full p-4 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[8px] tracking-[0.14em] text-white/30 uppercase mb-0.5">
            AI Analytics
          </p>
          <h3 className="font-sans font-semibold text-[11px] text-white/80 tracking-[-0.01em]">
            Business Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-1.5" aria-label="Live data feed">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] opacity-80 animate-pulse"
            aria-hidden="true"
          />
          <span className="font-mono text-[8px] text-[#06B6D4]/60 tracking-[0.12em]">
            LIVE
          </span>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-3 gap-1.5">
        {KPI_STATS.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col gap-0.5 p-2 bg-white/3border border-white/6"
          >
            <span className="font-mono text-[7px] text-white/30 tracking-widest uppercase">
              {stat.label}
            </span>
            <span className="font-sans font-bold text-sm text-white/90 tracking-[-0.02em]">
              {stat.value}
            </span>
            <span className="font-mono text-[8px] text-[#06B6D4] opacity-70">
              {stat.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex flex-col justify-end gap-2 flex-1">
        {METRIC_BARS.map((bar, i) => (
          <div key={bar.id} className="flex items-center gap-2">
            <span className="font-mono text-[7px] text-white/30 w-16 shrink-0 tracking-[0.07em]">
              {bar.label}
            </span>
            {/* Track */}
            <div className="flex-1 h-1.5 bg-white/5 overflow-hidden">
              {/* Fill — scaleX animates from origin:left */}
              <div
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className="will-change-transform h-full origin-left"
                style={{
                  backgroundColor: bar.color,
                  opacity: 0.7,
                  transform: "scaleX(0)", // Pre-allocated — prevents CLS
                }}
              />
            </div>
            <span className="font-mono text-[7px] text-white/40 w-6 text-right">
              {bar.value}%
            </span>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="h-8 overflow-hidden" aria-hidden="true">
        <svg
          viewBox="0 0 200 32"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hsg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ENV.AMBER} stopOpacity="0.5" />
              <stop offset="100%" stopColor={ENV.AMBER} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points="0,28 20,22 40,18 60,24 80,14 100,10 120,8 140,14 160,6 180,4 200,2 200,32 0,32"
            fill="url(#hsg)"
            opacity="0.15"
          />
          <polyline
            points="0,28 20,22 40,18 60,24 80,14 100,10 120,8 140,14 160,6 180,4 200,2"
            fill="none"
            stroke={ENV.AMBER}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — Chatbot panel mockup
// ─────────────────────────────────────────────────────────────────────────────

interface ChatbotPanelProps {
  reduced: boolean;
}

const ChatbotPanel = memo(function ChatbotPanel({
  reduced,
}: ChatbotPanelProps) {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced || !cursorRef.current) return;
    // Blinking cursor — vital sign of active AI processing
    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: MOTION.CURSOR_BLINK,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      force3D: true,
    });
    return () => {
      tween.kill();
    };
  }, [reduced]);

  return (
    <div className="w-full h-full p-3 flex flex-col gap-2">
      {/* Chat header */}
      <div className="flex items-center gap-2 pb-2 border-b border-white/6">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] opacity-80 animate-pulse"
          aria-hidden="true"
        />
        <span className="font-mono text-[8px] tracking-[0.12em] text-[#06B6D4]/60 uppercase">
          AI Support Agent
        </span>
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {CHAT_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[80%] px-2 py-1.5 font-sans text-[9px] leading-normal ${
                msg.role === "user"
                  ? "bg-[#F59E0B]/15 border border-[#F59E0B]/20 text-white/70"
                  : "bg-[#06B6D4]/10 border border-[#06B6D4]/15 text-white/70"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}

        {/* Typing indicator */}
        <div className="flex justify-start">
          <div className="px-2 py-1.5 bg-[#06B6D4]/10 border border-[#06B6D4]/15">
            <span className="font-mono text-[8px] text-[#06B6D4]/60">
              Analyzing
              <span
                ref={cursorRef}
                className="will-change-transform ml-0.5"
                aria-hidden="true"
              >
                ▌
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — SEO metrics chip
// ─────────────────────────────────────────────────────────────────────────────

const SeoPanel = memo(function SeoPanel() {
  return (
    <div className="w-full h-full px-3 py-2 flex items-center gap-4">
      <p className="font-mono text-[8px] tracking-[0.12em] text-[#06B6D4]/50 uppercase shrink-0">
        SEO Intel
      </p>
      <div className="flex-1 flex items-center justify-around">
        {SEO_METRICS.map((m) => (
          <div key={m.id} className="flex flex-col items-center gap-0.5">
            <span className="font-sans font-bold text-sm text-white/80 tracking-[-0.02em]">
              {m.value}
            </span>
            <span className="font-mono text-[7px] text-white/30 tracking-[0.08em]">
              {m.label}
            </span>
            <span
              aria-hidden="true"
              className="text-[#06B6D4] text-[8px] opacity-70"
            >
              ↑
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT — HeroSection
// Owns all GSAP contexts, all layout, all orchestration.
// ─────────────────────────────────────────────────────────────────────────────

const HeroSection = memo(function HeroSection() {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const amberGlowRef = useRef<HTMLDivElement>(null);
  const cyanGlowRef = useRef<HTMLDivElement>(null);
  const statusDotRef = useRef<HTMLSpanElement>(null);
  const primaryShimmerRef = useRef<HTMLSpanElement>(null);
  const secondaryShimmerRef = useRef<HTMLSpanElement>(null);
  // Panel streak refs — indexed to PANEL_STREAK_DELAYS below
  const streakDashRef = useRef<HTMLDivElement>(null);
  const streakChatRef = useRef<HTMLDivElement>(null);
  const streakAutoRef = useRef<HTMLDivElement>(null);
  const streakSeoRef = useRef<HTMLDivElement>(null);
  // GSAP context — owns all non-streak, non-shimmer animations
  const ctxRef = useRef<gsap.Context | null>(null);

  const reduced = useReducedMotion();

  // ── Light streaks — each panel offset so they never sweep in sync ─────────
  useLightStreak(streakDashRef, 0, reduced);
  useLightStreak(streakChatRef, 2.5, reduced);
  useLightStreak(streakAutoRef, 5.0, reduced);
  useLightStreak(streakSeoRef, 3.5, reduced);

  // ── CTA shimmer handlers ──────────────────────────────────────────────────
  const handlePrimaryShimmer = useShimmer(primaryShimmerRef);
  const handleSecondaryShimmer = useShimmer(secondaryShimmerRef);

  // ── Entrance + persistent animations ─────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    ctxRef.current = gsap.context(() => {
      if (reduced) {
        // Reveal without motion — accessibility compliance
        gsap.set("[data-animate]", { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // ── Entrance: fog clearing to reveal what was always there ────────────
      gsap.fromTo(
        "[data-animate]",
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
          stagger: MOTION.ENTRANCE_STAGGER,
          force3D: true,
          clearProps: "scale", // Release after animation — reduces memory
        },
      );

      // ── Amber glow — breathes slowly, creates warmth in top-left ─────────
      gsap.to(amberGlowRef.current, {
        scale: MOTION.GLOW_SCALE_MAX,
        duration: MOTION.BREATHE_SLOW,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
      });

      // ── Cyan glow — out of phase, creates visual tension ─────────────────
      gsap.to(cyanGlowRef.current, {
        scale: MOTION.GLOW_SCALE_MAX,
        duration: MOTION.BREATHE_SLOW * 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
        delay: MOTION.BREATHE_SLOW * 0.5, // Half-cycle offset
      });

      // ── Status dot — vital sign of a living system ────────────────────────
      gsap.to(statusDotRef.current, {
        opacity: MOTION.STATUS_MAX,
        duration: MOTION.BREATHE_FAST,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
        startAt: { opacity: MOTION.STATUS_MIN },
      });
    }, section);

    return () => {
      ctxRef.current?.revert();
    };
  }, [reduced]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-headline"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center  py-16  bg-[#0B0F19]"
    >
      {/* ── LAYER 1: Precision grid — graph paper under glass ─────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 opacity-25]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: `${ENV.GRID_SIZE}px ${ENV.GRID_SIZE}px`,
          }}
        />
        {/* Top structural line — catches ambient light */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-[0.08]"
          style={{
            background: `linear-gradient(to right, transparent, ${ENV.AMBER}99 30%, ${ENV.CYAN}99 70%, transparent)`,
          }}
        />
        {/* Bottom structural line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-5"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.4) 50%, transparent)",
          }}
        />
      </div>

      {/* ── LAYER 2: Ambient light sources ────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Amber — top-left, energy, warmth */}
        <div
          ref={amberGlowRef}
          className="will-change-transform absolute -left-[20%] -top-[20%] w-[60vw] h-[60vw] max-w-200 max-h-200 rounded-full opacity-4"
          style={{
            background: `radial-gradient(circle, ${ENV.AMBER} 0%, transparent 70%)`,
          }}
        />
        {/* Cyan — bottom-right, technology, depth */}
        <div
          ref={cyanGlowRef}
          className="will-change-transform absolute -right-[15%] -bottom-[15%] w-[50vw] h-[50vw] max-w-175 max-h-175 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${ENV.CYAN} 0%, transparent 70%)`,
          }}
        />
        {/* Violet — mid-left, intelligence, tertiary depth */}
        <div
          className="absolute left-[30%] top-[60%] w-[30vw] h-[30vw] max-w-100 max-h-100 rounded-full opacity-[0.03]"
          style={{
            background: `radial-gradient(circle, ${ENV.VIOLET} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ── LAYER 4: Content — the reason this exists ─────────────────────── */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
        {/* ── LEFT: Hero copy ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:gap-9">
          {/* Pre-headline — system language label */}
          <div data-animate className="will-change-transform opacity-0">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[#06B6D4]/60">
              <span
                aria-hidden="true"
                className="inline-block w-4 h-px bg-[#06B6D4] opacity-60"
              />
              AI Platform Infrastructure
              <span
                aria-hidden="true"
                className="inline-block w-4 h-px bg-[#06B6D4] opacity-60"
              />
            </p>
          </div>

          {/* H1 — single per page, color-coded keywords carry meaning */}
          <div data-animate className="will-change-transform opacity-0">
            <h1
              id="hero-headline"
              className="font-sans font-bold leading-[1.1] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              AI Tools That Turn Your Website Into a{" "}
              {/* Amber = action, energy — this is the value proposition */}
              <span style={{ color: ENV.AMBER }}>Smart Business System</span>
            </h1>
          </div>

          {/* Gradient divider — visual breath between headline and body */}
          <div data-animate className="will-change-transform opacity-0">
            <div
              aria-hidden="true"
              className="w-16 h-px"
              style={{
                background: `linear-gradient(to right, ${ENV.AMBER}, ${ENV.CYAN})`,
              }}
            />
          </div>

          {/* Subheadline */}
          <div data-animate className="will-change-transform opacity-0">
            <p
              className="font-sans leading-[1.7] text-white/60 max-w-[52ch]"
              style={{ fontSize: "clamp(1rem, 1.8vw, 1.125rem)" }}
            >
              We develop custom AI tools that automate your workflow, improve
              customer experience, increase conversions, and help your business
              scale faster. Your website becomes more than a design —{" "}
              {/* Cyan = technology, clarity — earned color usage */}
              <span style={{ color: `${ENV.CYAN}E6` }}>
                it becomes an intelligent platform.
              </span>
            </p>
          </div>

          {/* Feature bullets — module index with system codes */}
          <ul
            data-animate
            className="will-change-transform opacity-0 flex flex-col gap-3"
            aria-label="Core AI capabilities"
          >
            {FEATURE_BULLETS.map((bullet) => (
              <li key={bullet.id} className="flex items-center gap-3 group">
                {/* System code — decorative, hidden from small screens */}
                <span
                  aria-hidden="true"
                  className="hidden sm:inline-block font-mono text-[9px] tracking-[0.12em] text-white/20 w-12 shrink-0 text-right"
                >
                  {bullet.code}
                </span>
                {/* Accent marker */}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-sm opacity-80"
                  style={{ color: bullet.accent }}
                >
                  ✦
                </span>
                {/* Label */}
                <span className="font-sans text-[0.9375rem] leading-normal text-white/75 transition-colors duration-300 group-hover:text-white/95">
                  {bullet.label}
                </span>
                {/* Trailing rule — structural, not decorative */}
                <span
                  aria-hidden="true"
                  className="hidden sm:block flex-1 h-px bg-white/4"
                />
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div
            data-animate
            className="will-change-transform opacity-0 flex flex-col sm:flex-row gap-3 sm:gap-4"
            role="group"
            aria-label="Primary actions"
          >
            {/* Primary CTA — amber, action, highest priority */}
            <button
              type="button"
              aria-label="Request an AI Demo — opens demo request flow"
              onMouseEnter={handlePrimaryShimmer}
              onFocus={handlePrimaryShimmer}
              className="
                group relative overflow-hidden
                inline-flex items-center justify-center gap-2
                min-h-12 px-8 py-3
                font-sans font-semibold text-sm tracking-[-0.01em]
                text-[#0B0F19] bg-[#F59E0B] border border-[#F59E0B]
                transition-opacity duration-200
                hover:opacity-90 active:opacity-100
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2
                focus-visible:ring-offset-[#0B0F19]
                will-change-transform
              "
            >
              {/* Shimmer — light reflecting off amber surface */}
              <span
                ref={primaryShimmerRef}
                aria-hidden="true"
                className="pointer-events-none will-change-transform absolute inset-y-0 left-0 w-1/3"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.35) 50%, transparent)",
                }}
              />
              <span aria-hidden="true" className="text-[#0B0F19]/60 text-xs">
                ◆
              </span>
              Request an AI Demo
            </button>

            {/* Secondary CTA — glass surface, structural */}
            <button
              type="button"
              aria-label="Book a free consultation with our AI team"
              onMouseEnter={handleSecondaryShimmer}
              onFocus={handleSecondaryShimmer}
              className="
                group relative overflow-hidden
                inline-flex items-center justify-center gap-2
                min-h-12 px-8 py-3
                font-sans font-medium text-sm tracking-[-0.01em]
                text-white/80
                bg-white/4 border border-white/10
                backdrop-blur-xs
                transition-colors duration-200
                hover:bg-white/[0.07] hover:border-white/16 hover:text-white
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-white/40 focus-visible:ring-offset-2
                focus-visible:ring-offset-[#0B0F19]
                will-change-transform
              "
            >
              {/* Shimmer — light on glass */}
              <span
                ref={secondaryShimmerRef}
                aria-hidden="true"
                className="pointer-events-none will-change-transform absolute inset-y-0 left-0 w-1/3"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.08) 50%, transparent)",
                }}
              />
              Book a Free Consultation
              <span
                aria-hidden="true"
                className="text-white/40 text-xs transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </button>
          </div>
        </div>

        {/* ── RIGHT: Visual mockup cluster ──────────────────────────────────── */}
        <div
          data-animate
          aria-hidden="true" // Decorative UI visualization — not content
          className="will-change-transform opacity-0 relative w-full aspect-4/3 lg:aspect-auto lg:h-140 xl:h-150"
        >
          {/* ── Dashboard — dominant, full background panel ──────────────── */}
          <article
            className="absolute inset-0 lg:inset-auto lg:top-0 lg:left-0 lg:right-8 lg:bottom-16 overflow-hidden bg-white/4 border border-white/10 backdrop-blur-xs"
            style={{
              boxShadow: PANEL_SHADOWS[1],
              transform: "translateY(-2px)",
              zIndex: 10,
            }}
            aria-label="Dashboard interface panel"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10"
              style={{
                background: `linear-gradient(to right, transparent, ${ENV.AMBER}80 40%, ${ENV.AMBER}40 70%, transparent)`,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-2 w-3 h-3 z-10 opacity-30"
            >
              <div
                className="absolute top-0 left-0 w-full h-px"
                style={{ backgroundColor: ENV.AMBER }}
              />
              <div
                className="absolute top-0 left-0 w-px h-full"
                style={{ backgroundColor: ENV.AMBER }}
              />
            </div>
            <p
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-2.5 right-2.5 z-10 font-mono text-[8px] tracking-[0.14em] opacity-20"
              style={{ color: ENV.AMBER }}
            >
              PANEL::DASH
            </p>
            {/* Streak */}
            <div
              ref={streakDashRef}
              aria-hidden="true"
              className="pointer-events-none will-change-transform absolute inset-y-0 left-0 z-20"
              style={{
                width: "25%",
                background: `linear-gradient(to right, transparent, rgba(${hexToRgb(ENV.AMBER)},0.04) 50%, transparent)`,
              }}
            />
            <div className="relative z-10 w-full h-full">
              <DashboardPanel reduced={reduced} />
            </div>
          </article>

          {/* ── Chatbot — bottom-right, overlaps dashboard for depth ─────── */}
          <article
            className="hidden lg:block absolute bottom-0 right-0 w-[52%] h-[48%] overflow-hidden bg-white/4 border border-white/10 backdrop-blur-xs"
            style={{
              boxShadow: PANEL_SHADOWS[2],
              transform: "translateY(-3px)",
              zIndex: 20,
            }}
            aria-label="Chatbot interface panel"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10"
              style={{
                background: `linear-gradient(to right, transparent, ${ENV.CYAN}80 40%, ${ENV.CYAN}40 70%, transparent)`,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-2 w-3 h-3 z-10 opacity-30"
            >
              <div
                className="absolute top-0 left-0 w-full h-px"
                style={{ backgroundColor: ENV.CYAN }}
              />
              <div
                className="absolute top-0 left-0 w-px h-full"
                style={{ backgroundColor: ENV.CYAN }}
              />
            </div>
            <p
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-2.5 right-2.5 z-10 font-mono text-[8px] tracking-[0.14em] opacity-20"
              style={{ color: ENV.CYAN }}
            >
              PANEL::CHAT
            </p>
            <div
              ref={streakChatRef}
              aria-hidden="true"
              className="pointer-events-none will-change-transform absolute inset-y-0 left-0 z-20"
              style={{
                width: "25%",
                background: `linear-gradient(to right, transparent, rgba(${hexToRgb(ENV.CYAN)},0.04) 50%, transparent)`,
              }}
            />
            <div className="relative z-10 w-full h-full">
              <ChatbotPanel reduced={reduced} />
            </div>
          </article>

          {/* ── SEO chip — bottom-left floating metric strip ─────────────── */}
          <article
            className="hidden lg:flex items-center absolute -bottom-4 left-4 w-[40%] h-[16%] overflow-hidden bg-white/4 border border-white/10 backdrop-blur-xs"
            style={{
              boxShadow: PANEL_SHADOWS[2],
              transform: "translateY(-3px)",
              zIndex: 20,
            }}
            aria-label="SEO metrics panel"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10"
              style={{
                background: `linear-gradient(to right, transparent, ${ENV.CYAN}80 40%, ${ENV.CYAN}40 70%, transparent)`,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-2 w-3 h-3 z-10 opacity-30"
            >
              <div
                className="absolute top-0 left-0 w-full h-px"
                style={{ backgroundColor: ENV.CYAN }}
              />
              <div
                className="absolute top-0 left-0 w-px h-full"
                style={{ backgroundColor: ENV.CYAN }}
              />
            </div>
            <p
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-2.5 right-2.5 z-10 font-mono text-[8px] tracking-[0.14em] opacity-20"
              style={{ color: ENV.CYAN }}
            >
              PANEL::SEO
            </p>
            <div
              ref={streakSeoRef}
              aria-hidden="true"
              className="pointer-events-none will-change-transform absolute inset-y-0 left-0 z-20"
              style={{
                width: "25%",
                background: `linear-gradient(to right, transparent, rgba(${hexToRgb(ENV.CYAN)},0.04) 50%, transparent)`,
              }}
            />
            <div className="relative z-10 w-full h-full">
              <SeoPanel />
            </div>
          </article>
        </div>
        {/* end mockup cluster */}
      </div>
      {/* end content grid */}
    </section>
  );
});

export default HeroSection;
