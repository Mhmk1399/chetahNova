// components/AISolutionsGrid.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  type RefObject,
  type PointerEvent as ReactPointerEvent,
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
  ENTRANCE_DURATION: 0.6,
  ENTRANCE_EASE: "power2.out",
  ENTRANCE_Y: 24,
  ENTRANCE_SCALE: 0.98,
  STAGGER_CARD: 0.07,
  STREAK_DURATION: 13,
  STREAK_PAUSE: 0.4,
  MAGNETIC_STRENGTH: 0.18, // how far the card tilts toward cursor — keep subtle
  MAGNETIC_DURATION: 0.5,
  MAGNETIC_EASE: "power2.out",
  FEATURE_STAGGER: 0.04, // feature pill reveal stagger on card expand
  BREATHE_SLOW: 11,
  GLOW_SCALE_MAX: 1.07,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type AccentColor = typeof ENV.AMBER | typeof ENV.CYAN | typeof ENV.VIOLET;

interface AITool {
  id: string;
  index: string; // "01" – "08" — system index label
  title: string;
  description: string;
  features: string[];
  accent: AccentColor;
  systemCode: string; // atmospheric monospace identifier
  category: string; // used in card label
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA — 8 AI tool cards
// Accent colors assigned by semantic meaning:
// AMBER = action/conversion tools, CYAN = data/intelligence, VIOLET = content/creative
// ─────────────────────────────────────────────────────────────────────────────

const AI_TOOLS: AITool[] = [
  {
    id: "chatbot",
    index: "01",
    title: "AI Customer Support Chatbot",
    description:
      "An AI assistant trained on your services, FAQs, and business policies to answer customers instantly — 24 hours a day, 7 days a week.",
    features: [
      "Instant responses",
      "Multilingual support",
      "FAQ automation",
      "Lead capture integration",
      "Human handoff option",
    ],
    accent: ENV.AMBER,
    systemCode: "SVC::CHAT_SUP",
    category: "Support",
  },
  {
    id: "leads",
    title: "AI Lead Qualification System",
    index: "02",
    description:
      "Automatically identifies high-quality leads, filters low-value inquiries, and organizes your pipeline into a structured, actionable format.",
    features: [
      "Lead scoring",
      "Automated follow-ups",
      "CRM integration",
      "Form intelligence",
      "Business rules automation",
    ],
    accent: ENV.CYAN,
    systemCode: "SVC::LEAD_QUAL",
    category: "Conversion",
  },
  {
    id: "booking",
    title: "AI Booking & Appointment Assistant",
    index: "03",
    description:
      "An AI-powered booking system that schedules appointments, sends reminders, and reduces no-shows through smart automation.",
    features: [
      "Calendar integration",
      "Automated reminders",
      "Smart scheduling",
      "Time-slot optimization",
      "Customer confirmation flows",
    ],
    accent: ENV.AMBER,
    systemCode: "SVC::BOOK_SYS",
    category: "Scheduling",
  },
  {
    id: "sales",
    title: "AI Sales Assistant",
    index: "04",
    description:
      "An AI agent that guides visitors through your services, handles objections, and converts prospects into paying customers.",
    features: [
      "Service recommendation",
      "Objection handling",
      "Upsell & cross-sell logic",
      "Smart CTA triggers",
    ],
    accent: ENV.CYAN,
    systemCode: "SVC::SALES_AGT",
    category: "Revenue",
  },
  {
    id: "content",
    title: "AI Content Generator",
    index: "05",
    description:
      "AI tools that generate website content — service pages, landing pages, and FAQs — while keeping your brand tone perfectly consistent.",
    features: [
      "SEO-ready generation",
      "Tone matching",
      "Multilingual content",
      "Structured headings & metadata",
    ],
    accent: ENV.VIOLET,
    systemCode: "SVC::CONT_GEN",
    category: "Content",
  },
  {
    id: "seo",
    title: "AI SEO Automation System",
    index: "06",
    description:
      "A system that creates SEO content faster, tracks keyword performance, and automates optimization tasks across your entire site.",
    features: [
      "Keyword clustering",
      "Internal linking automation",
      "SEO content planning",
      "Performance reporting",
    ],
    accent: ENV.VIOLET,
    systemCode: "SVC::SEO_AUTO",
    category: "Growth",
  },
  {
    id: "analytics",
    title: "AI Business Analytics Dashboard",
    index: "07",
    description:
      "An intelligent dashboard that analyzes your website traffic, leads, customer behavior, and conversion data in one unified view.",
    features: [
      "AI-powered insights",
      "Conversion tracking",
      "Lead performance reporting",
      "User behavior analysis",
      "Actionable growth recommendations",
    ],
    accent: ENV.CYAN,
    systemCode: "SVC::ANALYTICS",
    category: "Intelligence",
  },
  {
    id: "workflow",
    title: "AI Workflow Automation",
    index: "08",
    description:
      "We automate repetitive business processes — onboarding, document processing, email responses, and task distribution — at scale.",
    features: [
      "Workflow automation",
      "Email & WhatsApp integration",
      "AI-generated summaries",
      "Automated task routing",
    ],
    accent: ENV.AMBER,
    systemCode: "SVC::WORK_AUTO",
    category: "Operations",
  },
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
// HOOK — light streak sweep, identical to previous sections for consistency
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
// SUB-COMPONENT — Feature pill (inside expanded card)
// ─────────────────────────────────────────────────────────────────────────────

interface FeaturePillProps {
  label: string;
  accent: AccentColor;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const FeaturePill = memo(function FeaturePill({
  label,
  accent,
  index,
  visible,
  reduced,
}: FeaturePillProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { opacity: visible ? 1 : 0, y: 0 });
      return;
    }

    if (visible) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 8, force3D: true },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: MOTION.ENTRANCE_EASE,
          delay: index * MOTION.FEATURE_STAGGER,
          force3D: true,
        },
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        y: 4,
        duration: 0.2,
        ease: "power1.in",
        force3D: true,
      });
    }
  }, [visible, index, reduced]);

  const rgb = hexToRgb(accent);

  return (
    <span
      ref={ref}
      className="will-change-transform inline-flex items-center gap-1.5 px-2.5 py-1 opacity-0"
      style={{
        border: `1px solid rgba(${rgb}, 0.25)`,
        backgroundColor: `rgba(${rgb}, 0.07)`,
      }}
    >
      <span
        aria-hidden="true"
        className="w-1 h-1 rounded-full shrink-0"
        style={{ backgroundColor: accent, opacity: 0.7 }}
      />
      <span
        className="font-mono text-[9px] tracking-widest uppercase"
        style={{ color: accent, opacity: 0.85 }}
      >
        {label}
      </span>
    </span>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — The AI tool card
//
// Design mechanics:
// 1. Magnetic cursor tilt — card surface slightly rotates toward pointer
//    using CSS perspective + rotateX/Y transforms. GPU only. No layout change.
// 2. Expanded state — clicking reveals feature pills with staggered entrance
// 3. Light streak — sweeps across glass surface on independent delay
// 4. Active state shows a glowing border and fills the accent line
// ─────────────────────────────────────────────────────────────────────────────

interface ToolCardProps {
  tool: AITool;
  globalIndex: number;
  isActive: boolean;
  onActivate: (id: string) => void;
  reduced: boolean;
}

const ToolCard = memo(function ToolCard({
  tool,
  globalIndex,
  isActive,
  onActivate,
  reduced,
}: ToolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null); // magnetic tilt target
  const streakRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Stagger streak start by card index — no two cards sweep simultaneously
  useLightStreak(streakRef, globalIndex * 1.8, reduced);

  // ── Accent line + glow respond to active state ─────────────────────────
  useEffect(() => {
    if (!accentLineRef.current || !glowRef.current) return;
    if (reduced) {
      gsap.set(accentLineRef.current, { scaleX: isActive ? 1 : 0 });
      gsap.set(glowRef.current, { opacity: isActive ? 0.12 : 0 });
      return;
    }

    gsap.to(accentLineRef.current, {
      scaleX: isActive ? 1 : 0,
      duration: 0.45,
      ease: isActive ? "power2.out" : "power2.in",
      force3D: true,
    });
    gsap.to(glowRef.current, {
      opacity: isActive ? 0.12 : 0,
      duration: 0.5,
      ease: "power2.out",
      force3D: true,
    });
  }, [isActive, reduced]);

  // ── Magnetic pointer tilt ─────────────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduced || !cardRef.current || !innerRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      // Normalize cursor position to -0.5 … +0.5 relative to card center
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      // rotateY responds to horizontal cursor, rotateX to vertical
      // Signs chosen so the surface "leans toward" the cursor
      gsap.to(innerRef.current, {
        rotateY: nx * MOTION.MAGNETIC_STRENGTH * 12,
        rotateX: -ny * MOTION.MAGNETIC_STRENGTH * 8,
        duration: MOTION.MAGNETIC_DURATION,
        ease: MOTION.MAGNETIC_EASE,
        force3D: true,
      });
    },
    [reduced],
  );

  const handlePointerLeave = useCallback(() => {
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "power3.out",
      force3D: true,
    });
  }, []);

  const handleClick = useCallback(() => {
    onActivate(tool.id);
  }, [onActivate, tool.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate(tool.id);
      }
    },
    [onActivate, tool.id],
  );

  const rgb = hexToRgb(tool.accent);

  return (
    // Outer wrapper: provides perspective for the 3D magnetic tilt
    <div
      ref={cardRef}
      data-animate
      className="will-change-transform opacity-0"
      style={{ perspective: "800px" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Inner — receives the tilt transform */}
      <div
        ref={innerRef}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
        aria-label={`${tool.title} — click to ${isActive ? "collapse" : "expand"} details`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="
          will-change-transform
          relative overflow-hidden
          bg-white/3 border border-white/8
          backdrop-blur-xs
          p-5 sm:p-6 flex flex-col gap-4
          cursor-pointer select-none
          transition-colors duration-300
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          focus-visible:ring-offset-[#0B0F19]
          min-h-55
        "
        style={{
          boxShadow: isActive
            ? `0 0 0 1px rgba(${rgb}, 0.3), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`
            : "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
          // Focus ring color matches accent dynamically
          "--tw-ring-color": tool.accent,
          transition: "box-shadow 0.4s ease",
        }}
      >
        {/* Ambient glow — fills when active */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="will-change-transform pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 30%, rgba(${rgb}, 0.15) 0%, transparent 65%)`,
            opacity: 0,
          }}
        />

        {/* Top accent edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${tool.accent}80 40%, ${tool.accent}30 70%, transparent)`,
          }}
        />

        {/* Light streak */}
        <div
          ref={streakRef}
          aria-hidden="true"
          className="pointer-events-none will-change-transform absolute inset-y-0 left-0 z-20"
          style={{
            width: "28%",
            background: `linear-gradient(to right, transparent, rgba(${rgb}, 0.04) 50%, transparent)`,
          }}
        />

        {/* ── Card header row ─────────────────────────────────────────── */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            {/* Index + category */}
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[9px] tracking-[0.18em] opacity-50"
                style={{ color: tool.accent }}
                aria-hidden="true"
              >
                {tool.index}
              </span>
              <span
                aria-hidden="true"
                className="w-3 h-px opacity-30"
                style={{ backgroundColor: tool.accent }}
              />
              <span
                className="font-mono text-[9px] tracking-[0.14em] uppercase opacity-35"
                style={{ color: tool.accent }}
                aria-hidden="true"
              >
                {tool.category}
              </span>
            </div>

            {/* Title */}
            <h3
              className="font-sans font-semibold text-white/90 tracking-[-0.015em] leading-tight"
              style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1.0625rem)" }}
            >
              {tool.title}
            </h3>
          </div>

          {/* Expand indicator — rotates 45° when active */}
          <div
            aria-hidden="true"
            className="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5 transition-transform duration-300"
            style={{ transform: isActive ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line
                x1="5"
                y1="0"
                x2="5"
                y2="10"
                stroke={tool.accent}
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <line
                x1="0"
                y1="5"
                x2="10"
                y2="5"
                stroke={tool.accent}
                strokeWidth="1"
                strokeOpacity="0.6"
              />
            </svg>
          </div>
        </div>

        {/* ── Description ─────────────────────────────────────────────── */}
        <div className="relative z-10">
          <p className="font-sans text-[0.8125rem] leading-[1.7] text-white/45">
            {tool.description}
          </p>
        </div>

        {/* ── Feature pills — revealed when active ────────────────────── */}
        <div
          className="relative z-10 flex flex-wrap gap-1.5 overflow-hidden"
          style={{
            // Pre-allocate height to prevent layout shift when pills appear
            minHeight: isActive
              ? `${Math.ceil(tool.features.length / 3) * 28}px`
              : "0px",
            transition: "min-height 0.35s ease",
          }}
          aria-label={`${tool.title} key features`}
        >
          {isActive &&
            tool.features.map((feature, i) => (
              <FeaturePill
                key={feature}
                label={feature}
                accent={tool.accent}
                index={i}
                visible={isActive}
                reduced={reduced}
              />
            ))}
        </div>

        {/* ── Bottom accent line — expands on active ──────────────────── */}
        <div
          ref={accentLineRef}
          aria-hidden="true"
          className="will-change-transform absolute bottom-0 left-0 h-px w-full origin-left"
          style={{
            background: `linear-gradient(to right, ${tool.accent}, transparent)`,
            opacity: 0.6,
            transform: "scaleX(0)",
          }}
        />

        {/* System code — bottom-right atmospheric label */}
        <p
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-3 right-4 font-mono text-[8px] tracking-[0.14em] text-white/15"
        >
          {tool.systemCode}
        </p>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — Section intro block
// ─────────────────────────────────────────────────────────────────────────────

interface IntroBlockProps {
  reduced: boolean;
}

const IntroBlock = memo(function IntroBlock({ reduced }: IntroBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

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
          stagger: 0.1,
          force3D: true,
          clearProps: "scale",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={ref} className="flex flex-col gap-6 max-w-170">
      {/* Section label */}
      <div data-animate className="will-change-transform opacity-0">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[#06B6D4]/60">
          <span
            aria-hidden="true"
            className="inline-block w-4 h-px bg-[#06B6D4] opacity-60"
          />
          Main Services
          <span
            aria-hidden="true"
            className="inline-block w-4 h-px bg-[#06B6D4] opacity-60"
          />
        </p>
      </div>

      {/* H2 */}
      <div data-animate className="will-change-transform opacity-0">
        <h2
          id="solutions-headline"
          className="font-sans font-bold leading-[1.1] tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          Our <span style={{ color: ENV.AMBER }}>AI Website</span> Solutions
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

      {/* Intro paragraph */}
      <div data-animate className="will-change-transform opacity-0">
        <p
          className="font-sans leading-[1.75] text-white/55"
          style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}
        >
          Below are the most common AI tools we build for businesses. Each
          solution can be{" "}
          <span style={{ color: ENV.CYAN, opacity: 0.9 }}>customized</span> and{" "}
          <span style={{ color: ENV.AMBER, opacity: 0.9 }}>combined</span> based
          on your exact needs and growth stage.
        </p>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — CTA button at the bottom of the grid
// ─────────────────────────────────────────────────────────────────────────────

interface GridCtaProps {
  reduced: boolean;
}

const GridCta = memo(function GridCta({ reduced }: GridCtaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20, force3D: true },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.ENTRANCE_DURATION,
          ease: MOTION.ENTRANCE_EASE,
          force3D: true,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  const handleEnter = useCallback(() => {
    if (!shimmerRef.current || !arrowRef.current) return;
    gsap.fromTo(
      shimmerRef.current,
      { xPercent: -100, force3D: true },
      { xPercent: 200, duration: 0.6, ease: "power2.out", force3D: true },
    );
    gsap.to(arrowRef.current, {
      x: 5,
      duration: 0.3,
      ease: "power2.out",
      force3D: true,
    });
  }, []);

  const handleLeave = useCallback(() => {
    if (!arrowRef.current) return;
    gsap.to(arrowRef.current, {
      x: 0,
      duration: 0.4,
      ease: "power3.out",
      force3D: true,
    });
  }, []);

  return (
    <div
      ref={ref}
      className="will-change-transform opacity-0 flex justify-center  "
    >
      <button
        type="button"
        aria-label="Tell us what you want to automate — start a project conversation"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        className="
          group relative overflow-hidden
          inline-flex items-center gap-3
          min-h-13 px-8 py-3.5
          font-sans font-semibold text-sm tracking-[-0.01em]
          text-[#0B0F19] bg-[#F59E0B]
          border border-[#F59E0B]
          transition-opacity duration-200
          hover:opacity-90 active:opacity-100
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2
          focus-visible:ring-offset-[#0B0F19]
          will-change-transform
        "
      >
        {/* Shimmer */}
        <span
          ref={shimmerRef}
          aria-hidden="true"
          className="pointer-events-none will-change-transform absolute inset-y-0 left-0 w-1/3"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.3) 50%, transparent)",
          }}
        />
        Tell Us What You Want to Automate
        {/* Arrow — translates on hover */}
        <span
          ref={arrowRef}
          aria-hidden="true"
          className="will-change-transform font-sans font-bold text-base text-[#0B0F19]/70"
        >
          →
        </span>
      </button>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT — filter tab bar
// Allows filtering cards by accent color / domain
// ─────────────────────────────────────────────────────────────────────────────

type FilterKey = "all" | "amber" | "cyan" | "violet";

interface FilterTab {
  key: FilterKey;
  label: string;
  accent?: AccentColor;
}

const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "All Systems" },
  { key: "amber", label: "Conversion & Ops", accent: ENV.AMBER },
  { key: "cyan", label: "Data & Intelligence", accent: ENV.CYAN },
  { key: "violet", label: "Content & Growth", accent: ENV.VIOLET },
];

interface FilterBarProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}

const FilterBar = memo(function FilterBar({
  active,
  onChange,
}: FilterBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter AI solutions by category"
      className="flex flex-wrap gap-2"
    >
      {FILTER_TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            aria-controls="solutions-grid"
            type="button"
            onClick={() => onChange(tab.key)}
            className="
              relative overflow-hidden
              inline-flex items-center gap-2
              px-4 py-2 min-h-9
              font-mono text-[10px] tracking-[0.12em] uppercase
              border transition-colors duration-200
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-white/40 focus-visible:ring-offset-1
              focus-visible:ring-offset-[#0B0F19]
              will-change-transform
            "
            style={{
              backgroundColor: isActive
                ? tab.accent
                  ? `rgba(${hexToRgb(tab.accent)}, 0.12)`
                  : "rgba(255,255,255,0.07)"
                : "rgba(255,255,255,0.02)",
              borderColor: isActive
                ? tab.accent
                  ? `rgba(${hexToRgb(tab.accent)}, 0.4)`
                  : "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.07)",
              color: isActive
                ? (tab.accent ?? "#ffffff")
                : "rgba(255,255,255,0.4)",
            }}
          >
            {tab.accent && (
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor: tab.accent,
                  opacity: isActive ? 0.9 : 0.4,
                }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT — AISolutionsGrid
// ─────────────────────────────────────────────────────────────────────────────

const AISolutionsGrid = memo(function AISolutionsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const amberGlowRef = useRef<HTMLDivElement>(null);
  const cyanGlowRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();

  // Track which card is expanded (accordion: only one at a time)
  const [activeId, setActiveId] = useState<string | null>(null);
  // Track filter selection
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  // Filtered tool list derived from filter state
  const filteredTools = AI_TOOLS.filter((tool) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "amber") return tool.accent === ENV.AMBER;
    if (activeFilter === "cyan") return tool.accent === ENV.CYAN;
    if (activeFilter === "violet") return tool.accent === ENV.VIOLET;
    return true;
  });

  // Toggle active card — clicking same card collapses it
  const handleActivate = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  // Card entrance — triggered once on scroll into view
  useEffect(() => {
    const el = gridRef.current;
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
          stagger: MOTION.STAGGER_CARD,
          force3D: true,
          clearProps: "scale",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
    // Re-run when filter changes so newly rendered cards also animate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, activeFilter]);

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
      gsap.to(cyanGlowRef.current, {
        scale: MOTION.GLOW_SCALE_MAX,
        duration: MOTION.BREATHE_SLOW * 1.25,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true,
        delay: MOTION.BREATHE_SLOW * 0.5,
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="ai-solutions"
      aria-labelledby="solutions-headline"
      className="relative w-full overflow-hidden bg-[#0B0F19]   py-24   xl:py-16"
    >
      {/* ── Grid overlay ───────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 opacity-2"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: `${ENV.GRID_SIZE}px ${ENV.GRID_SIZE}px`,
          }}
        />
        {/* Horizontal structural lines — top and bottom */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-[0.07]"
          style={{
            background: `linear-gradient(to right, transparent, ${ENV.CYAN}99 40%, ${ENV.AMBER}99 60%, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-5"
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
          className="will-change-transform absolute -left-[15%] top-[10%] w-[50vw] h-[50vw] max-w-162.5 max-h-162.5 rounded-full opacity-[0.04]"
          style={{
            background: `radial-gradient(circle, ${ENV.AMBER} 0%, transparent 70%)`,
          }}
        />
        <div
          ref={cyanGlowRef}
          className="will-change-transform absolute -right-[10%] bottom-[10%] w-[45vw] h-[45vw] max-w-150 max-h-150 rounded-full opacity-[0.045]"
          style={{
            background: `radial-gradient(circle, ${ENV.CYAN} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 flex flex-col gap-4 xl:gap-8">
        {/* Intro block */}
        <IntroBlock reduced={reduced} />

        {/* Filter bar + card count */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar active={activeFilter} onChange={setActiveFilter} />
          {/* Live card count — system readout */}
          <p
            aria-live="polite"
            aria-atomic="true"
            className="font-mono text-[10px] tracking-[0.14em] text-white/25 shrink-0"
          >
            {filteredTools.length.toString().padStart(2, "0")} MODULE
            {filteredTools.length !== 1 ? "S" : ""} LOADED
          </p>
        </div>

        {/* ── Card grid ────────────────────────────────────────────────── */}
        <div
          ref={gridRef}
          id="solutions-grid"
          role="tabpanel"
          aria-label={`AI solutions — ${activeFilter === "all" ? "all categories" : activeFilter} filter active`}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4"
        >
          {filteredTools.map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              globalIndex={i}
              isActive={activeId === tool.id}
              onActivate={handleActivate}
              reduced={reduced}
            />
          ))}
        </div>

        {/* ── Horizontal rule before CTA ───────────────────────────────── */}
        <div
          aria-hidden="true"
          className="h-px w-full opacity-[0.07]"
          style={{
            background: `linear-gradient(to right, transparent, ${ENV.AMBER}80 30%, ${ENV.CYAN}80 70%, transparent)`,
          }}
        />

        {/* CTA */}
        <GridCta reduced={reduced} />
      </div>
    </section>
  );
});

export default AISolutionsGrid;
