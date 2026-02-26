// ============================================================
// File: src/components/seo-section/SEOSection.tsx
// SEO Services & Google Ranking Strategy — Main Category 2
// Floating Glass Architecture · 2×2 Grid · Growth System UI
// ============================================================

"use client";

import React, { useRef, useEffect, memo, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ============================================================
// DESIGN TOKENS
// ============================================================

const T = {
  // Motion
  ENTER_DUR: 0.6,
  ENTER_STAGGER: 0.1,
  ENTER_Y: 30,
  ENTER_SCALE: 0.98,
  STREAK_DUR: 12,
  PULSE_DUR: 6,
  GLOW_DUR: 10,

  // Visual
  GLASS_BG: 0.04,
  SYS_OPACITY: 0.15,
  GRID_OPACITY: 0.03,
  GRID_SIZE: 72,
  GLOW_OPACITY: 0.05,

  // Palette
  PRIMARY: "#F59E0B",
  SECONDARY: "#06B6D4",
  ACCENT: "#6D28D9",
  BG: "#0B0F19",

  // Responsive
  MD: 768,
  LG: 1024,
} as const;

// ============================================================
// TYPES
// ============================================================

interface SEOBlock {
  readonly id: string;
  readonly coord: string;
  readonly title: string;
  readonly description: string;
  readonly includes: readonly string[];
  readonly outcome: string;
  readonly color: string;
  readonly status: string;
  /** Numeric rank metric for the visual gauge — 0 to 100 */
  readonly gauge: number;
}

interface TitleSegment {
  readonly text: string;
  readonly color?: string;
}

// ============================================================
// CONTENT
// ============================================================

const TITLE_SEGMENTS: readonly TitleSegment[] = [
  { text: "SEO Services", color: T.SECONDARY },
  { text: " & " },
  { text: "Google Ranking", color: T.PRIMARY },
  { text: " Strategy" },
];

const INTRO_P1 =
  "A website without SEO is like a luxury store hidden in the middle of nowhere. We help your business rank on Google through advanced SEO strategies that drive consistent traffic and long-term growth.";

const INTRO_P2 = "Our SEO services focus on real results, not vanity metrics.";

const SEO_BLOCKS: readonly SEOBlock[] = [
  {
    id: "on-page-seo",
    coord: "01",
    title: "On-Page SEO Optimization",
    description:
      "We optimize every page of your website to ensure Google understands your content and ranks it for the right keywords.",
    includes: [
      "Keyword research and keyword mapping",
      "SEO-friendly headings structure (H1–H3)",
      "Meta titles and meta descriptions",
      "Image optimization (ALT tags)",
      "Internal linking strategy",
      "Content optimization for conversion",
    ],
    outcome: "Higher rankings and more qualified traffic.",
    color: T.SECONDARY,
    status: "◉ CORE",
    gauge: 92,
  },
  {
    id: "off-page-seo",
    coord: "02",
    title: "Off-Page SEO & Link Building",
    description:
      "Google trusts websites that have authority. We help you build strong authority through ethical and effective off-page SEO.",
    includes: [
      "High-quality backlink strategy",
      "Guest posting campaigns (if required)",
      "Brand mention strategy",
      "Content distribution and outreach",
      "Competitor backlink analysis",
    ],
    outcome: "Higher domain authority and stronger long-term rankings.",
    color: T.PRIMARY,
    status: "◉ ACTIVE",
    gauge: 87,
  },
  {
    id: "technical-seo",
    coord: "03",
    title: "Technical SEO & Performance",
    description:
      "Technical SEO is the hidden engine behind high rankings. We optimize your website's structure, performance, and code to meet Google's standards.",
    includes: [
      "Core Web Vitals optimization",
      "Website speed improvement",
      "Crawl & index issue fixing",
      "Mobile SEO optimization",
      "Sitemap & robots.txt setup",
      "Schema markup implementation",
      "Broken links & redirect cleanup",
    ],
    outcome: "Faster indexing, better performance, higher ranking potential.",
    color: T.ACCENT,
    status: "◉ ACTIVE",
    gauge: 95,
  },
  {
    id: "seo-audits",
    coord: "04",
    title: "SEO Audits & Strategy Reports",
    description:
      "If you already have a website but your rankings are weak, we provide deep SEO audits to identify the exact problems holding you back.",
    includes: [
      "Full website SEO analysis",
      "Keyword opportunities report",
      "Technical issue breakdown",
      "Competitor analysis",
      "Step-by-step improvement roadmap",
    ],
    outcome: "Clear plan to fix your SEO and increase organic growth.",
    color: T.SECONDARY,
    status: "◉ READY",
    gauge: 88,
  },
];

const CTA_LABEL = "Get a Free SEO Audit Consultation";

// Total number of cards — used to size ref arrays
const CARD_COUNT = SEO_BLOCKS.length;

// ============================================================
// PRIMITIVES
// ============================================================

const SysLabel = memo(function SysLabel({
  text,
  pos,
}: {
  readonly text: string;
  readonly pos: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute font-mono text-[10px] tracking-widest text-white pointer-events-none select-none ${pos}`}
      style={{ opacity: T.SYS_OPACITY }}
    >
      {text}
    </span>
  );
});

const Streak = memo(function Streak({
  r,
  color = T.SECONDARY,
}: {
  readonly r: React.RefObject<HTMLDivElement | null>;
  readonly color?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        ref={r}
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

const Corners = memo(function Corners() {
  const c = "absolute w-3 h-3 pointer-events-none border-white/[0.12]";
  return (
    <div aria-hidden="true">
      <div className={`${c} top-0 left-0 border-t border-l`} />
      <div className={`${c} top-0 right-0 border-t border-r`} />
      <div className={`${c} bottom-0 left-0 border-b border-l`} />
      <div className={`${c} bottom-0 right-0 border-b border-r`} />
    </div>
  );
});

/** Horizontal thin line gauge — shows a "score" bar at the card top */
const GaugeLine = memo(function GaugeLine({
  gaugeRef,
  value,
  color,
}: {
  readonly gaugeRef: React.RefObject<HTMLDivElement | null>;
  readonly value: number;
  readonly color: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
      style={{ backgroundColor: `${color}11` }}
    >
      <div
        ref={gaugeRef}
        className="h-full will-change-transform origin-left"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}00 0%, ${color}88 40%, ${color}CC 100%)`,
          transform: "scaleX(0)",
        }}
      />
    </div>
  );
});

/** Vertical rank position indicator — decorative */
const RankBadge = memo(function RankBadge({
  coord,
  color,
}: {
  readonly coord: string;
  readonly color: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute top-5 right-5 md:top-6 md:right-6 flex flex-col items-center gap-0.5 pointer-events-none select-none"
    >
      <span
        className="font-mono text-[28px] md:text-[32px] font-bold leading-none"
        style={{ color: `${color}18` }}
      >
        {coord}
      </span>
    </div>
  );
});

// ============================================================
// SEO CARD COMPONENT
// ============================================================

const SEOCard = memo(function SEOCard({
  block,
  cardRef,
  streakRef,
  dotRef,
  includesRef,
  footerRef,
  gaugeRef,
}: {
  readonly block: SEOBlock;
  readonly cardRef: React.RefObject<HTMLDivElement | null>;
  readonly streakRef: React.RefObject<HTMLDivElement | null>;
  readonly dotRef: React.RefObject<HTMLSpanElement | null>;
  readonly includesRef: React.RefObject<HTMLUListElement | null>;
  readonly footerRef: React.RefObject<HTMLDivElement | null>;
  readonly gaugeRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <article
      ref={cardRef}
      id={`seo-${block.id}`}
      aria-labelledby={`seo-title-${block.id}`}
      className="relative border border-white/[0.08] backdrop-blur-sm will-change-transform h-full flex flex-col"
      style={{
        backgroundColor: `rgba(255,255,255,${T.GLASS_BG})`,
        opacity: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Gauge line — animated score indicator */}
      <GaugeLine gaugeRef={gaugeRef} value={block.gauge} color={block.color} />

      <Corners />
      <Streak r={streakRef} color={block.color} />

      {/* Large background coordinate */}
      <RankBadge coord={block.coord} color={block.color} />

      <SysLabel
        text={`SEO::${block.id.toUpperCase().replace(/-/g, "_")}`}
        pos="top-2 left-3"
      />
      <SysLabel text={block.status} pos="bottom-2 right-3" />

      {/* ── Content ──────────────────────────────────── */}
      <div className="relative z-10 p-5 md:p-6 lg:p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-2.5 mb-4">
          <span
            ref={dotRef}
            aria-hidden="true"
            className="mt-2 inline-block w-1.5 h-1.5 shrink-0 will-change-[opacity]"
            style={{ backgroundColor: block.color, opacity: 0.5 }}
          />
          <div className="flex-1 min-w-0">
            <p
              className="font-mono text-[10px] tracking-widest mb-1"
              style={{ color: `${block.color}77` }}
              aria-hidden="true"
            >
              MODULE_{block.coord}
            </p>
            <h3
              id={`seo-title-${block.id}`}
              className="text-base md:text-lg font-semibold text-white leading-[1.3] tracking-[-0.01em] pr-8"
            >
              {block.title}
            </h3>
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="mb-4"
          style={{
            height: "1px",
            background: `linear-gradient(90deg, ${block.color}22, transparent 80%)`,
          }}
        />

        {/* Description */}
        <p className="text-[13px] md:text-sm text-white/50 leading-[1.7] mb-5">
          {block.description}
        </p>

        {/* Includes */}
        <div className="mb-5 flex-1">
          <div className="flex items-center gap-2 mb-2.5">
            <div
              aria-hidden="true"
              className="w-3"
              style={{ height: "1px", backgroundColor: `${block.color}44` }}
            />
            <p
              className="font-mono text-[10px] tracking-[0.08em] uppercase"
              style={{ color: `${block.color}88` }}
            >
              Includes
            </p>
          </div>
          <ul
            ref={includesRef}
            className="space-y-0.5"
            aria-label={`What's included in ${block.title}`}
          >
            {block.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 py-[3px]">
                <span
                  aria-hidden="true"
                  className="mt-[5px] shrink-0 w-1 h-1"
                  style={{ backgroundColor: `${block.color}66` }}
                />
                <span className="text-[12px] md:text-[13px] text-white/50 leading-[1.6]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outcome footer */}
        <div
          ref={footerRef}
          className="mt-auto relative border-l-2 pl-3 py-1.5 will-change-transform"
          style={{ borderColor: `${block.color}44`, opacity: 0 }}
        >
          <p
            className="font-mono text-[10px] tracking-[0.08em] uppercase mb-0.5"
            style={{ color: `${block.color}77` }}
          >
            Outcome
          </p>
          <p className="text-[12px] md:text-[13px] text-white/60 leading-[1.55] font-medium">
            {block.outcome}
          </p>
        </div>
      </div>
    </article>
  );
});

// ============================================================
// RANKING FLOW VISUALIZATION — Decorative system between
// intro and grid showing the "growth system" metaphor
// ============================================================

const RankingFlow = memo(function RankingFlow({
  flowRef,
}: {
  readonly flowRef: React.RefObject<HTMLDivElement | null>;
}) {
  const steps = [
    { label: "AUDIT", color: T.SECONDARY },
    { label: "OPTIMIZE", color: T.PRIMARY },
    { label: "BUILD", color: T.ACCENT },
    { label: "RANK", color: T.PRIMARY },
  ] as const;

  return (
    <div
      ref={flowRef}
      aria-hidden="true"
      className="relative flex items-center justify-between py-4 md:py-5 px-2 will-change-transform"
      style={{ opacity: 0 }}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          {/* Node */}
          <div className="flex flex-col items-center gap-1.5 relative z-10">
            <div
              className="w-2 h-2"
              style={{
                backgroundColor: `${step.color}44`,
                boxShadow: `0 0 8px ${step.color}22`,
              }}
            />
            <span
              className="font-mono text-[9px] md:text-[10px] tracking-widest"
              style={{ color: `${step.color}66` }}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line (not after last) */}
          {i < steps.length - 1 && (
            <div
              className="flex-1 mx-2 md:mx-3 relative"
              style={{ height: "1px" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, ${steps[i].color}33, ${steps[i + 1].color}33)`,
                }}
              />
              {/* Directional chevron */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[8px]"
                style={{ color: `${steps[i + 1].color}44` }}
              >
                ›
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

// ============================================================
// MAIN COMPONENT
// ============================================================

function SEOSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Intro
  const introRef = useRef<HTMLDivElement>(null);
  const introStreakRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);

  // Ranking flow
  const flowRef = useRef<HTMLDivElement>(null);

  // Card refs — 4 cards
  const card0 = useRef<HTMLDivElement>(null);
  const card1 = useRef<HTMLDivElement>(null);
  const card2 = useRef<HTMLDivElement>(null);
  const card3 = useRef<HTMLDivElement>(null);

  const streak0 = useRef<HTMLDivElement>(null);
  const streak1 = useRef<HTMLDivElement>(null);
  const streak2 = useRef<HTMLDivElement>(null);
  const streak3 = useRef<HTMLDivElement>(null);

  const dot0 = useRef<HTMLSpanElement>(null);
  const dot1 = useRef<HTMLSpanElement>(null);
  const dot2 = useRef<HTMLSpanElement>(null);
  const dot3 = useRef<HTMLSpanElement>(null);

  const inc0 = useRef<HTMLUListElement>(null);
  const inc1 = useRef<HTMLUListElement>(null);
  const inc2 = useRef<HTMLUListElement>(null);
  const inc3 = useRef<HTMLUListElement>(null);

  const foot0 = useRef<HTMLDivElement>(null);
  const foot1 = useRef<HTMLDivElement>(null);
  const foot2 = useRef<HTMLDivElement>(null);
  const foot3 = useRef<HTMLDivElement>(null);

  const gauge0 = useRef<HTMLDivElement>(null);
  const gauge1 = useRef<HTMLDivElement>(null);
  const gauge2 = useRef<HTMLDivElement>(null);
  const gauge3 = useRef<HTMLDivElement>(null);

  const cardRefs = [card0, card1, card2, card3] as const;
  const streakRefs = [streak0, streak1, streak2, streak3] as const;
  const dotRefs = [dot0, dot1, dot2, dot3] as const;
  const incRefs = [inc0, inc1, inc2, inc3] as const;
  const footRefs = [foot0, foot1, foot2, foot3] as const;
  const gaugeRefs = [gauge0, gauge1, gauge2, gauge3] as const;

  // Ambient
  const glow1 = useRef<HTMLDivElement>(null);
  const glow2 = useRef<HTMLDivElement>(null);

  // CTA
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaStreakRef = useRef<HTMLDivElement>(null);
  const ctaShimmerRef = useRef<HTMLDivElement>(null);
  const ctaDot = useRef<HTMLSpanElement>(null);

  const [hovered, setHovered] = useState(false);
  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => setHovered(false), []);

  // ── GSAP ────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const noMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile = window.innerWidth <= T.MD;

    const ctx = gsap.context(() => {
      // ═══ INTRO ═════════════════════════════════════════
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      if (noMotion) {
        introTl.set(
          [
            introRef.current,
            titleRef.current,
            p1Ref.current,
            p2Ref.current,
            flowRef.current,
          ],
          { opacity: 1 },
        );
      } else {
        introTl
          .fromTo(
            introRef.current,
            { opacity: 0, y: T.ENTER_Y, scale: T.ENTER_SCALE },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: T.ENTER_DUR,
              ease: "power2.out",
              force3D: true,
            },
          )
          .fromTo(
            titleRef.current,
            { opacity: 0, y: T.ENTER_Y * 0.7 },
            {
              opacity: 1,
              y: 0,
              duration: T.ENTER_DUR,
              ease: "power2.out",
              force3D: true,
            },
            "-=0.35",
          )
          .fromTo(
            [p1Ref.current, p2Ref.current].filter(Boolean),
            { opacity: 0, y: T.ENTER_Y * 0.5 },
            {
              opacity: 1,
              y: 0,
              duration: T.ENTER_DUR,
              ease: "power2.out",
              stagger: T.ENTER_STAGGER,
              force3D: true,
            },
            "-=0.3",
          )
          .fromTo(
            flowRef.current,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              force3D: true,
            },
            "-=0.2",
          );
      }

      // Intro streak
      if (!noMotion && introStreakRef.current) {
        gsap.fromTo(
          introStreakRef.current,
          { xPercent: -100 },
          {
            xPercent: 500,
            duration: T.STREAK_DUR,
            ease: "none",
            repeat: -1,
            force3D: true,
          },
        );
      }

      // ═══ SERVICE CARDS ═════════════════════════════════
      cardRefs.forEach((ref, i) => {
        const card = ref.current;
        const inc = incRefs[i].current;
        const foot = footRefs[i].current;
        const gauge = gaugeRefs[i].current;
        if (!card) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 84%",
            toggleActions: "play none none none",
          },
        });

        if (noMotion) {
          tl.set([card, foot].filter(Boolean), { opacity: 1 });
          if (inc) tl.set(inc.querySelectorAll("li"), { opacity: 1 });
          if (gauge) tl.set(gauge, { scaleX: 1 });
          return;
        }

        // Card entrance
        tl.fromTo(
          card,
          { opacity: 0, y: T.ENTER_Y, scale: T.ENTER_SCALE },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: T.ENTER_DUR,
            ease: "power2.out",
            force3D: true,
          },
        );

        // Gauge line fill
        if (gauge) {
          tl.to(
            gauge,
            {
              scaleX: 1,
              duration: 0.8,
              ease: "power2.out",
              force3D: true,
            },
            "-=0.3",
          );
        }

        // List items
        if (inc) {
          const items = inc.querySelectorAll("li");
          if (items.length > 0) {
            tl.fromTo(
              items,
              { opacity: 0, x: -8 },
              {
                opacity: 1,
                x: 0,
                duration: 0.35,
                ease: "power2.out",
                stagger: 0.04,
                force3D: true,
              },
              "-=0.4",
            );
          }
        }

        // Footer
        if (foot) {
          tl.fromTo(
            foot,
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
              force3D: true,
            },
            "-=0.15",
          );
        }
      });

      // ═══ CTA ═══════════════════════════════════════════
      if (ctaRef.current) {
        const ctaTl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
        if (noMotion) {
          ctaTl.set(ctaRef.current, { opacity: 1 });
        } else {
          ctaTl.fromTo(
            ctaRef.current,
            { opacity: 0, y: T.ENTER_Y * 0.5 },
            {
              opacity: 1,
              y: 0,
              duration: T.ENTER_DUR,
              ease: "power2.out",
              force3D: true,
            },
          );
        }
      }

      // ═══ PERSISTENT ════════════════════════════════════
      if (!noMotion) {
        // Card streaks
        streakRefs.forEach((ref, i) => {
          if (ref.current) {
            gsap.fromTo(
              ref.current,
              { xPercent: -100 },
              {
                xPercent: 500,
                duration: T.STREAK_DUR + i * 2.5,
                ease: "none",
                repeat: -1,
                delay: i * 1.5,
                force3D: true,
              },
            );
          }
        });

        // CTA streak + shimmer
        if (ctaStreakRef.current) {
          gsap.fromTo(
            ctaStreakRef.current,
            { xPercent: -100 },
            {
              xPercent: 500,
              duration: T.STREAK_DUR * 0.75,
              ease: "none",
              repeat: -1,
              force3D: true,
            },
          );
        }
        if (ctaShimmerRef.current) {
          gsap.fromTo(
            ctaShimmerRef.current,
            { xPercent: -100 },
            {
              xPercent: 400,
              duration: 8,
              ease: "none",
              repeat: -1,
              force3D: true,
            },
          );
        }

        // Dot pulses
        [...dotRefs.map((r) => r.current), ctaDot.current]
          .filter(Boolean)
          .forEach((el, i) => {
            gsap.to(el!, {
              opacity: 0.9,
              duration: T.PULSE_DUR / 2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 0.4,
            });
          });

        // Glow breathing (desktop)
        if (!mobile) {
          [glow1.current, glow2.current].filter(Boolean).forEach((el, i) => {
            gsap.to(el!, {
              scale: 1.05,
              opacity: T.GLOW_OPACITY * 1.4,
              duration: T.GLOW_DUR,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 3,
              force3D: true,
            });
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Title ───────────────────────────────────────────────
  const titleJSX = TITLE_SEGMENTS.map((seg, i) =>
    seg.color ? (
      <span key={i} style={{ color: seg.color }}>
        {seg.text}
      </span>
    ) : (
      <React.Fragment key={i}>{seg.text}</React.Fragment>
    ),
  );

  // ============================================================
  // JSX
  // ============================================================

  return (
    <section
      ref={sectionRef}
      id="seo-services"
      aria-labelledby="seo-title"
      className="relative w-full overflow-hidden py-16 md:py-28 lg:py-36"
      style={{ backgroundColor: T.BG }}
    >
      {/* ── Grid Background ──────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,${T.GRID_OPACITY}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,${T.GRID_OPACITY}) 1px, transparent 1px)`,
          backgroundSize: `${T.GRID_SIZE}px ${T.GRID_SIZE}px`,
        }}
      />

      {/* ── Ambient Glows ────────────────────────────────── */}
      <div
        ref={glow1}
        aria-hidden="true"
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: "580px",
          height: "580px",
          top: "8%",
          left: "8%",
          background: `radial-gradient(circle, ${T.SECONDARY}0D 0%, transparent 70%)`,
          opacity: T.GLOW_OPACITY,
        }}
      />
      <div
        ref={glow2}
        aria-hidden="true"
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: "500px",
          height: "500px",
          bottom: "5%",
          right: "6%",
          background: `radial-gradient(circle, ${T.ACCENT}0D 0%, transparent 70%)`,
          opacity: T.GLOW_OPACITY,
        }}
      />

      {/* ── System Markers ───────────────────────────────── */}
      <SysLabel text="SYS::SEO_MODULE" pos="top-4 left-4 md:top-6 md:left-6" />
      <SysLabel text="CAT::RANKING" pos="top-4 right-4 md:top-6 md:right-6" />
      <SysLabel
        text="GROWTH::ENGINE"
        pos="bottom-4 left-4 md:bottom-6 md:left-6"
      />
      <SysLabel text="v3.2.0" pos="bottom-4 right-4 md:bottom-6 md:right-6" />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* ═══════════════════════════════════════════════════
            INTRO PANEL
            ═══════════════════════════════════════════════════ */}
        <div
          ref={introRef}
          className="relative border border-white/[0.08] backdrop-blur-sm will-change-transform"
          style={{
            backgroundColor: `rgba(255,255,255,${T.GLASS_BG})`,
            opacity: 0,
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Top accent */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: "1px",
              background: `linear-gradient(90deg, ${T.SECONDARY}00, ${T.SECONDARY}66 30%, ${T.PRIMARY}66 70%, ${T.PRIMARY}00)`,
            }}
          />

          <Corners />
          <Streak r={introStreakRef} color={T.SECONDARY} />

          <SysLabel text="PANEL::SEO_OVERVIEW" pos="top-2 right-3" />
          <SysLabel text="PRI::002" pos="bottom-2 left-3" />

          <div className="relative z-10 p-6 md:p-10 lg:p-12">
            {/* Category */}
            <p
              className="font-mono text-[11px] tracking-widest uppercase mb-4"
              style={{ color: `${T.SECONDARY}88` }}
              aria-hidden="true"
            >
              Service Category 02
            </p>

            <h2
              ref={titleRef}
              id="seo-title"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.15] tracking-[-0.02em] will-change-transform"
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
                background: `linear-gradient(90deg, ${T.SECONDARY}33, ${T.PRIMARY}22, transparent)`,
              }}
            />

            {/* Intro text — two columns on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-8">
              <p
                ref={p1Ref}
                className="text-sm md:text-[15px] text-white/55 leading-[1.75] will-change-transform"
                style={{ opacity: 0 }}
              >
                A website without SEO is like a{" "}
                <span className="text-white/90 font-medium">
                  luxury store hidden
                </span>{" "}
                in the middle of nowhere. We help your business{" "}
                <span style={{ color: T.SECONDARY }}>rank on Google</span>{" "}
                through advanced SEO strategies that drive consistent traffic
                and <span style={{ color: T.PRIMARY }}>long-term growth</span>.
              </p>
              <p
                ref={p2Ref}
                className="text-sm md:text-[15px] text-white/55 leading-[1.75] will-change-transform md:border-l md:border-white/[0.06] md:pl-6"
                style={{ opacity: 0 }}
              >
                Our SEO services focus on{" "}
                <span className="text-white/90 font-medium">real results</span>,
                not vanity metrics.
              </p>
            </div>

            {/* Ranking Flow Visualization */}
            <RankingFlow flowRef={flowRef} />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            2×2 SERVICE GRID
            ─────────────────────────────────────────────────
            ┌────────────────┬────────────────┐
            │  On-Page SEO   │  Off-Page SEO  │
            ├────────────────┼────────────────┤
            │ Technical SEO  │  SEO Audits    │
            └────────────────┴────────────────┘
            ═══════════════════════════════════════════════════ */}
        <div className="mt-5 md:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
          {SEO_BLOCKS.map((block, i) => (
            <SEOCard
              key={block.id}
              block={block}
              cardRef={cardRefs[i]}
              streakRef={streakRefs[i]}
              dotRef={dotRefs[i]}
              includesRef={incRefs[i]}
              footerRef={footRefs[i]}
              gaugeRef={gaugeRefs[i]}
            />
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
            CTA
            ═══════════════════════════════════════════════════ */}
        <div
          ref={ctaRef}
          className="mt-5 md:mt-6 lg:mt-8 will-change-transform"
          style={{ opacity: 0 }}
        >
          <div
            className="relative border border-white/[0.08] backdrop-blur-sm"
            style={{
              backgroundColor: `rgba(255,255,255,${T.GLASS_BG})`,
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Top accent — secondary dominant */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                height: "1px",
                background: `linear-gradient(90deg, ${T.SECONDARY}00, ${T.SECONDARY}88 30%, ${T.PRIMARY}88 60%, ${T.ACCENT}66 80%, ${T.ACCENT}00)`,
              }}
            />

            <Corners />
            <Streak r={ctaStreakRef} color={T.SECONDARY} />

            <SysLabel text="ACTION::FREE_AUDIT" pos="top-2 right-3" />

            <div className="relative z-10 p-5 md:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              {/* Left context */}
              <div className="flex items-center gap-3">
                <span
                  ref={ctaDot}
                  aria-hidden="true"
                  className="inline-block w-1.5 h-1.5 shrink-0 will-change-[opacity]"
                  style={{ backgroundColor: T.SECONDARY, opacity: 0.5 }}
                />
                <div>
                  <p
                    className="font-mono text-[10px] tracking-widest text-white/25 mb-1"
                    aria-hidden="true"
                  >
                    FREE_CONSULTATION
                  </p>
                  <p className="text-sm md:text-base text-white/55 leading-[1.5]">
                    Discover why your{" "}
                    <span
                      style={{ color: T.SECONDARY }}
                      className="font-medium"
                    >
                      rankings
                    </span>{" "}
                    aren&rsquo;t where they should be.
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="#contact"
                aria-label="Get a free SEO audit consultation — opens contact form"
                className="group relative inline-flex items-center gap-2.5 border px-5 py-3 md:px-7 md:py-3.5 font-medium text-sm md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 will-change-transform min-h-[44px] min-w-[44px] transition-colors duration-200 whitespace-nowrap"
                style={{
                  borderColor: hovered
                    ? `${T.SECONDARY}88`
                    : `${T.SECONDARY}44`,
                  color: hovered ? T.SECONDARY : "rgba(255,255,255,0.9)",
                   "--tw-ring-color": T.SECONDARY,
                  "--tw-ring-offset-color": T.BG,
                }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onFocus={onEnter}
                onBlur={onLeave}
              >
                {/* Shimmer */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                >
                  <div
                    ref={ctaShimmerRef}
                    className="absolute top-0 h-full will-change-transform"
                    style={{
                      width: "25%",
                      left: "-25%",
                      background: `linear-gradient(90deg, transparent 0%, ${T.SECONDARY}0A 40%, ${T.SECONDARY}14 50%, ${T.SECONDARY}0A 60%, transparent 100%)`,
                    }}
                  />
                </div>

                {/* Hover bg */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{
                    backgroundColor: `${T.SECONDARY}08`,
                    opacity: hovered ? 1 : 0,
                  }}
                />

                <span className="relative z-10">{CTA_LABEL}</span>
                <span
                  className="relative z-10 inline-block transition-transform duration-200"
                  style={{
                    transform: hovered ? "translateX(4px)" : "translateX(0)",
                  }}
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(SEOSection);
