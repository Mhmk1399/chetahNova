// ============================================================
// File: src/components/web-design-section/WebDesignSection.tsx
// Custom Web Design & Development — Main Service Category
// Floating Glass Architecture · 2-Column Grid · GSAP Motion
// ============================================================

"use client";

import React, { useRef, useEffect, memo, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ============================================================
// DESIGN TOKENS
// ============================================================

const TOKENS = {
  ENTRANCE_DURATION: 0.6,
  ENTRANCE_STAGGER: 0.1,
  ENTRANCE_Y_OFFSET: 30,
  ENTRANCE_SCALE: 0.98,
  LIGHT_STREAK_DURATION: 12,
  PULSE_DURATION: 6,
  GLOW_BREATHE_DURATION: 10,

  PANEL_BG_OPACITY: 0.04,
  SYSTEM_LABEL_OPACITY: 0.15,
  GRID_OPACITY: 0.03,
  GRID_SIZE: 72,
  AMBIENT_GLOW_OPACITY: 0.05,

  PRIMARY: "#F59E0B",
  SECONDARY: "#06B6D4",
  ACCENT: "#6D28D9",
  DARK_BG: "#0B0F19",

  MOBILE_MAX: 768,
} as const;

// ============================================================
// TYPES
// ============================================================

interface ServiceBlock {
  readonly id: string;
  readonly coordinate: string;
  readonly title: string;
  readonly description: readonly string[];
  readonly includes: readonly string[];
  readonly footerLabel: string;
  readonly footerValue: string;
  readonly accentColor: string;
  readonly systemStatus: string;
}

interface HighlightedWord {
  readonly text: string;
  readonly color: string;
}

// ============================================================
// CONTENT DATA
// ============================================================

const SECTION_TITLE_PARTS: readonly (string | HighlightedWord)[] = [
  "Custom ",
  { text: "Web Design", color: TOKENS.PRIMARY },
  " & ",
  { text: "Development", color: TOKENS.SECONDARY },
];

const INTRO_P1 =
  "Your website is the foundation of your online business. We design and develop custom websites that are fast, modern, conversion-focused, and built to scale.";

const INTRO_P2 =
  "We don't use generic templates. Every website is designed based on your brand identity, customer behavior, and business goals.";

const SERVICE_BLOCKS: readonly ServiceBlock[] = [
  {
    id: "full-website",
    coordinate: "01",
    title: "Full Website Design",
    description: [
      "We build full websites for businesses that need a strong online presence, professional branding, and high conversion performance.",
      "Whether you need a corporate website, a service website, or a complete e-commerce platform, we deliver premium design with a clean and scalable structure.",
    ],
    includes: [
      "Custom UI design and branding",
      "Website architecture planning",
      "Landing pages for services",
      "E-commerce store setup (if needed)",
      "Payment integration (Stripe, PayPal, etc.)",
      "Speed optimization and mobile-first development",
    ],
    footerLabel: "Best For",
    footerValue:
      "Startups, agencies, local businesses, e-commerce stores, professional brands.",
    accentColor: TOKENS.PRIMARY,
    systemStatus: "◉ CORE",
  },
  {
    id: "responsive-design",
    coordinate: "02",
    title: "Responsive Web Design",
    description: [
      "A modern website must look perfect on every device. We build responsive websites that work flawlessly across mobile, tablet, and desktop.",
    ],
    includes: [
      "Mobile-first layout",
      "Responsive typography and grids",
      "Fast loading experience on mobile",
      "Touch-friendly design and navigation",
      "Optimized images and performance",
    ],
    footerLabel: "Outcome",
    footerValue:
      "A better user experience, higher conversion rate, and improved Google rankings.",
    accentColor: TOKENS.SECONDARY,
    systemStatus: "◉ ACTIVE",
  },
  {
    id: "ui-ux-design",
    coordinate: "03",
    title: "UI/UX Design Services",
    description: [
      "Design is not only about beauty. It's about guiding users toward action.",
      "We create UI/UX systems based on conversion psychology and user behavior.",
    ],
    includes: [
      "Wireframes & user journey mapping",
      "Landing page conversion optimization",
      "High-end UI design (modern agency style)",
      "UX testing and improvement",
      "User flow optimization for lead generation",
    ],
    footerLabel: "Outcome",
    footerValue: "More leads, more sales, lower bounce rate.",
    accentColor: TOKENS.ACCENT,
    systemStatus: "◉ ACTIVE",
  },
];

const CTA_TEXT = "Request a Website Proposal";

// ============================================================
// SUB-COMPONENTS
// ============================================================

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
      className={`absolute font-mono text-[10px] tracking-widest text-white pointer-events-none select-none ${position}`}
      style={{ opacity: TOKENS.SYSTEM_LABEL_OPACITY }}
    >
      {text}
    </span>
  );
});

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

const CornerBrackets = memo(function CornerBrackets() {
  const b = "absolute w-3 h-3 pointer-events-none border-white/[0.12]";
  return (
    <div aria-hidden="true">
      <div className={`${b} top-0 left-0 border-t border-l`} />
      <div className={`${b} top-0 right-0 border-t border-r`} />
      <div className={`${b} bottom-0 left-0 border-b border-l`} />
      <div className={`${b} bottom-0 right-0 border-b border-r`} />
    </div>
  );
});

// ============================================================
// GLASS PANEL — Reusable wrapper
// ============================================================

const GlassPanel = memo(function GlassPanel({
  children,
  panelRef,
  streakRef,
  accentColor1 = TOKENS.PRIMARY,
  accentColor2,
  className = "",
  systemLeft,
  systemRight,
}: {
  readonly children: React.ReactNode;
  readonly panelRef: React.RefObject<HTMLDivElement | null>;
  readonly streakRef: React.RefObject<HTMLDivElement | null>;
  readonly accentColor1?: string;
  readonly accentColor2?: string;
  readonly className?: string;
  readonly systemLeft?: string;
  readonly systemRight?: string;
}) {
  const c2 = accentColor2 ?? accentColor1;

  return (
    <div
      ref={panelRef}
      className={`relative border border-white/[0.08] backdrop-blur-sm will-change-transform ${className}`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${TOKENS.PANEL_BG_OPACITY})`,
        opacity: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "1px",
          background: `linear-gradient(90deg, ${accentColor1}00 0%, ${accentColor1}66 30%, ${c2}66 70%, ${c2}00 100%)`,
        }}
      />
      <CornerBrackets />
      <LightStreak streakRef={streakRef} color={accentColor1} />
      {systemLeft && (
        <SystemMarker text={systemLeft} position="bottom-2 left-3" />
      )}
      {systemRight && (
        <SystemMarker text={systemRight} position="top-2 right-3" />
      )}
      {children}
    </div>
  );
});

// ============================================================
// SERVICE CARD — Individual service block in grid
// ============================================================

const ServiceCard = memo(function ServiceCard({
  block,
  cardRef,
  streakRef,
  dotRef,
  includesRef,
  footerRef,
  isWide = false,
}: {
  readonly block: ServiceBlock;
  readonly cardRef: React.RefObject<HTMLDivElement | null>;
  readonly streakRef: React.RefObject<HTMLDivElement | null>;
  readonly dotRef: React.RefObject<HTMLSpanElement | null>;
  readonly includesRef: React.RefObject<HTMLUListElement | null>;
  readonly footerRef: React.RefObject<HTMLDivElement | null>;
  readonly isWide?: boolean;
}) {
  return (
    <article
      ref={cardRef}
      id={`service-${block.id}`}
      aria-labelledby={`service-title-${block.id}`}
      className={`relative border border-white/[0.08] backdrop-blur-sm will-change-transform h-full ${
        isWide ? "lg:col-span-2" : ""
      }`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${TOKENS.PANEL_BG_OPACITY})`,
        opacity: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Top accent */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${block.accentColor}66 50%, transparent 100%)`,
        }}
      />

      <CornerBrackets />
      <LightStreak streakRef={streakRef} color={block.accentColor} />

      <SystemMarker
        text={`${block.coordinate}::${block.id.toUpperCase().replace(/-/g, "_")}`}
        position="top-2 right-3"
      />
      <SystemMarker text={block.systemStatus} position="bottom-2 right-3" />

      {/* Content */}
      <div className="relative z-10 p-5 md:p-7 lg:p-8 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4 md:mb-5">
          <span
            ref={dotRef}
            aria-hidden="true"
            className="mt-2 inline-block w-1.5 h-1.5 shrink-0 will-change-[opacity]"
            style={{ backgroundColor: block.accentColor, opacity: 0.5 }}
          />
          <div className="flex-1 min-w-0">
            <p
              className="font-mono text-[10px] tracking-widest mb-1.5"
              style={{ color: `${block.accentColor}88` }}
              aria-hidden="true"
            >
              SERVICE_{block.coordinate}
            </p>
            <h3
              id={`service-title-${block.id}`}
              className="text-base md:text-lg lg:text-xl font-semibold text-white leading-[1.25] tracking-[-0.015em]"
            >
              {block.title}
            </h3>
          </div>
        </div>

        {/* Separator */}
        <div
          aria-hidden="true"
          className="mb-4 md:mb-5"
          style={{
            height: "1px",
            background: `linear-gradient(90deg, ${block.accentColor}22, transparent)`,
          }}
        />

        {/* Description */}
        <div className="space-y-2.5 mb-5 md:mb-6">
          {block.description.map((p, i) => (
            <p key={i} className="text-sm text-white/55 leading-[1.7]">
              {p}
            </p>
          ))}
        </div>

        {/* Includes */}
        <div className="mb-5 md:mb-6 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div
              aria-hidden="true"
              className="w-3"
              style={{
                height: "1px",
                backgroundColor: `${block.accentColor}44`,
              }}
            />
            <p
              className="font-mono text-[10px] tracking-[0.08em] uppercase"
              style={{ color: `${block.accentColor}99` }}
            >
              Includes
            </p>
          </div>
          <ul
            ref={includesRef}
            className="space-y-1 pl-0"
            aria-label={`What's included in ${block.title}`}
          >
            {block.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 py-0.5">
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 font-mono text-[10px] leading-none"
                  style={{ color: block.accentColor }}
                >
                  ＋
                </span>
                <span className="text-[13px] text-white/55 leading-[1.6]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div
          ref={footerRef}
          className="mt-auto relative border-l-2 pl-3.5 py-1.5 will-change-transform"
          style={{ borderColor: `${block.accentColor}44`, opacity: 0 }}
        >
          <p
            className="font-mono text-[10px] tracking-[0.08em] uppercase mb-0.5"
            style={{ color: `${block.accentColor}88` }}
          >
            {block.footerLabel}
          </p>
          <p className="text-[13px] text-white/65 leading-[1.55]">
            {block.footerValue}
          </p>
        </div>
      </div>
    </article>
  );
});

// ============================================================
// MAIN COMPONENT
// ============================================================

function WebDesignSection() {
  // ── Refs ────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);

  // Intro panel
  const introRef = useRef<HTMLDivElement>(null);
  const introStreakRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introP1Ref = useRef<HTMLParagraphElement>(null);
  const introP2Ref = useRef<HTMLParagraphElement>(null);

  // Grid container
  const gridRef = useRef<HTMLDivElement>(null);

  // Block 0 — Full Website (wide card, spans 2 cols on lg)
  const card0Ref = useRef<HTMLDivElement>(null);
  const streak0Ref = useRef<HTMLDivElement>(null);
  const dot0Ref = useRef<HTMLSpanElement>(null);
  const includes0Ref = useRef<HTMLUListElement>(null);
  const footer0Ref = useRef<HTMLDivElement>(null);

  // Block 1 — Responsive
  const card1Ref = useRef<HTMLDivElement>(null);
  const streak1Ref = useRef<HTMLDivElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);
  const includes1Ref = useRef<HTMLUListElement>(null);
  const footer1Ref = useRef<HTMLDivElement>(null);

  // Block 2 — UI/UX
  const card2Ref = useRef<HTMLDivElement>(null);
  const streak2Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);
  const includes2Ref = useRef<HTMLUListElement>(null);
  const footer2Ref = useRef<HTMLDivElement>(null);

  // Ambient
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const glow3Ref = useRef<HTMLDivElement>(null);

  // CTA
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaStreakRef = useRef<HTMLDivElement>(null);
  const ctaShimmerRef = useRef<HTMLDivElement>(null);
  const ctaDotRef = useRef<HTMLSpanElement>(null);

  // Indexed arrays for GSAP loops
  const cardRefs = [card0Ref, card1Ref, card2Ref] as const;
  const streakRefs = [streak0Ref, streak1Ref, streak2Ref] as const;
  const dotRefs = [dot0Ref, dot1Ref, dot2Ref] as const;
  const includesRefs = [includes0Ref, includes1Ref, includes2Ref] as const;
  const footerRefs = [footer0Ref, footer1Ref, footer2Ref] as const;

  // CTA hover
  const [ctaHovered, setCtaHovered] = useState(false);
  const onCtaEnter = useCallback(() => setCtaHovered(true), []);
  const onCtaLeave = useCallback(() => setCtaHovered(false), []);

  // ── GSAP ────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const noMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.innerWidth <= TOKENS.MOBILE_MAX;

    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════════════════
      // INTRO PANEL
      // ═══════════════════════════════════════════════════
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
            introP1Ref.current,
            introP2Ref.current,
          ],
          { opacity: 1 },
        );
      } else {
        introTl
          .fromTo(
            introRef.current,
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
          )
          .fromTo(
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
          )
          .fromTo(
            [introP1Ref.current, introP2Ref.current].filter(Boolean),
            { opacity: 0, y: TOKENS.ENTRANCE_Y_OFFSET * 0.5 },
            {
              opacity: 1,
              y: 0,
              duration: TOKENS.ENTRANCE_DURATION,
              ease: "power2.out",
              stagger: TOKENS.ENTRANCE_STAGGER,
              force3D: true,
            },
            "-=0.3",
          );
      }

      // Intro streak
      if (!noMotion && introStreakRef.current) {
        gsap.fromTo(
          introStreakRef.current,
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

      // ═══════════════════════════════════════════════════
      // SERVICE CARDS — Each triggered independently
      // ═══════════════════════════════════════════════════
      cardRefs.forEach((ref, i) => {
        const card = ref.current;
        const includes = includesRefs[i].current;
        const footer = footerRefs[i].current;
        if (!card) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 84%",
            toggleActions: "play none none none",
          },
        });

        if (noMotion) {
          tl.set([card, footer].filter(Boolean), { opacity: 1 });
          if (includes) {
            tl.set(includes.querySelectorAll("li"), { opacity: 1 });
          }
          return;
        }

        // Card entrance
        tl.fromTo(
          card,
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

        // List items stagger
        if (includes) {
          const items = includes.querySelectorAll("li");
          if (items.length > 0) {
            tl.fromTo(
              items,
              { opacity: 0, x: -10 },
              {
                opacity: 1,
                x: 0,
                duration: 0.35,
                ease: "power2.out",
                stagger: 0.05,
                force3D: true,
              },
              "-=0.25",
            );
          }
        }

        // Footer
        if (footer) {
          tl.fromTo(
            footer,
            { opacity: 0, y: 10 },
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

      // ═══════════════════════════════════════════════════
      // CTA
      // ═══════════════════════════════════════════════════
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
            { opacity: 0, y: TOKENS.ENTRANCE_Y_OFFSET * 0.5 },
            {
              opacity: 1,
              y: 0,
              duration: TOKENS.ENTRANCE_DURATION,
              ease: "power2.out",
              force3D: true,
            },
          );
        }
      }

      // ═══════════════════════════════════════════════════
      // PERSISTENT ANIMATIONS
      // ═══════════════════════════════════════════════════
      if (!noMotion) {
        // Card light streaks
        streakRefs.forEach((ref, i) => {
          if (ref.current) {
            gsap.fromTo(
              ref.current,
              { xPercent: -100 },
              {
                xPercent: 500,
                duration: TOKENS.LIGHT_STREAK_DURATION + i * 3,
                ease: "none",
                repeat: -1,
                delay: i * 2,
                force3D: true,
              },
            );
          }
        });

        // CTA streak
        if (ctaStreakRef.current) {
          gsap.fromTo(
            ctaStreakRef.current,
            { xPercent: -100 },
            {
              xPercent: 500,
              duration: TOKENS.LIGHT_STREAK_DURATION * 0.8,
              ease: "none",
              repeat: -1,
              force3D: true,
            },
          );
        }

        // CTA shimmer
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
        [...dotRefs.map((r) => r.current), ctaDotRef.current]
          .filter(Boolean)
          .forEach((el, i) => {
            gsap.to(el!, {
              opacity: 0.9,
              duration: TOKENS.PULSE_DURATION / 2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 0.5,
            });
          });

        // Ambient glow breathing (desktop only)
        if (!isMobile) {
          [glow1Ref.current, glow2Ref.current, glow3Ref.current]
            .filter(Boolean)
            .forEach((el, i) => {
              gsap.to(el!, {
                scale: 1.05,
                opacity: TOKENS.AMBIENT_GLOW_OPACITY * 1.4,
                duration: TOKENS.GLOW_BREATHE_DURATION,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: i * 2.5,
                force3D: true,
              });
            });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Title JSX ───────────────────────────────────────────
  const titleJSX = SECTION_TITLE_PARTS.map((part, i) =>
    typeof part === "string" ? (
      <React.Fragment key={i}>{part}</React.Fragment>
    ) : (
      <span key={i} style={{ color: part.color }}>
        {part.text}
      </span>
    ),
  );

  // ============================================================
  // JSX
  // ============================================================

  return (
    <section
      ref={sectionRef}
      id="web-design"
      aria-labelledby="web-design-title"
      className="relative w-full overflow-hidden py-16 md:py-28 lg:py-36"
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
          top: "2%",
          right: "5%",
          background: `radial-gradient(circle, ${TOKENS.PRIMARY}0D 0%, transparent 70%)`,
          opacity: TOKENS.AMBIENT_GLOW_OPACITY,
        }}
      />
      <div
        ref={glow2Ref}
        aria-hidden="true"
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: "480px",
          height: "480px",
          top: "45%",
          left: "3%",
          background: `radial-gradient(circle, ${TOKENS.SECONDARY}0D 0%, transparent 70%)`,
          opacity: TOKENS.AMBIENT_GLOW_OPACITY,
        }}
      />
      <div
        ref={glow3Ref}
        aria-hidden="true"
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: "420px",
          height: "420px",
          bottom: "8%",
          right: "12%",
          background: `radial-gradient(circle, ${TOKENS.ACCENT}0D 0%, transparent 70%)`,
          opacity: TOKENS.AMBIENT_GLOW_OPACITY,
        }}
      />

      

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* ═══════════════════════════════════════════════════
            INTRO PANEL — Full width
            ═══════════════════════════════════════════════════ */}
        <GlassPanel
          panelRef={introRef}
          streakRef={introStreakRef}
          accentColor1={TOKENS.PRIMARY}
          accentColor2={TOKENS.SECONDARY}
          systemRight="PANEL::OVERVIEW"
          systemLeft="PRI::001"
        >
          <div className="relative z-10 p-6 md:p-10 lg:p-12">
            {/* Category label */}
            <p
              className="font-mono text-[11px] tracking-widest uppercase mb-4"
              style={{ color: `${TOKENS.PRIMARY}88` }}
              aria-hidden="true"
            >
              Service Category 01
            </p>

            <h2
              ref={titleRef}
              id="web-design-title"
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
                background: `linear-gradient(90deg, ${TOKENS.PRIMARY}33, ${TOKENS.SECONDARY}22, transparent)`,
              }}
            />

            {/* Two-column intro text on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <p
                ref={introP1Ref}
                className="text-sm md:text-[15px] text-white/55 leading-[1.75] will-change-transform"
                style={{ opacity: 0 }}
              >
                Your website is the{" "}
                <span className="text-white/90 font-medium">foundation</span> of
                your online business. We design and develop custom websites that
                are <span style={{ color: TOKENS.PRIMARY }}>fast</span>,{" "}
                <span style={{ color: TOKENS.SECONDARY }}>modern</span>,
                conversion-focused, and built to scale.
              </p>
              <p
                ref={introP2Ref}
                className="text-sm md:text-[15px] text-white/55 leading-[1.75] will-change-transform"
                style={{ opacity: 0 }}
              >
                We don&rsquo;t use generic templates. Every website is designed
                based on your{" "}
                <span className="text-white/90 font-medium">
                  brand identity
                </span>
                , customer behavior, and business goals.
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* ═══════════════════════════════════════════════════
            SERVICE CARDS GRID
            ─────────────────────────────────────────────────
            Layout:
            ┌──────────────────────────────────────────────┐
            │          Full Website Design (wide)          │
            ├───────────────────────┬──────────────────────┤
            │  Responsive Design    │   UI/UX Design       │
            └───────────────────────┴──────────────────────┘
            
            Mobile: single column stack
            Tablet (md): 2-col grid, first card spans 2
            Desktop (lg): same, more padding
            ═══════════════════════════════════════════════════ */}
        <div
          ref={gridRef}
          className="mt-5 md:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6"
        >
          {/* Card 0: Full Website — spans full width */}
          <div className="md:col-span-2">
            <ServiceCard
              block={SERVICE_BLOCKS[0]}
              cardRef={card0Ref}
              streakRef={streak0Ref}
              dotRef={dot0Ref}
              includesRef={includes0Ref}
              footerRef={footer0Ref}
              isWide
            />
          </div>

          {/* Card 1: Responsive — left column */}
          <div className="md:col-span-1">
            <ServiceCard
              block={SERVICE_BLOCKS[1]}
              cardRef={card1Ref}
              streakRef={streak1Ref}
              dotRef={dot1Ref}
              includesRef={includes1Ref}
              footerRef={footer1Ref}
            />
          </div>

          {/* Card 2: UI/UX — right column */}
          <div className="md:col-span-1">
            <ServiceCard
              block={SERVICE_BLOCKS[2]}
              cardRef={card2Ref}
              streakRef={streak2Ref}
              dotRef={dot2Ref}
              includesRef={includes2Ref}
              footerRef={footer2Ref}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            CTA PANEL
            ═══════════════════════════════════════════════════ */}
        <div
          ref={ctaRef}
          className="mt-5 md:mt-6 lg:mt-8 will-change-transform"
          style={{ opacity: 0 }}
        >
          <div
            className="relative border border-white/[0.08] backdrop-blur-sm"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${TOKENS.PANEL_BG_OPACITY})`,
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Multi-color top accent */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                height: "1px",
                background: `linear-gradient(90deg, ${TOKENS.PRIMARY}00, ${TOKENS.PRIMARY}88 25%, ${TOKENS.SECONDARY}88 50%, ${TOKENS.ACCENT}88 75%, ${TOKENS.ACCENT}00)`,
              }}
            />

            <CornerBrackets />
            <LightStreak streakRef={ctaStreakRef} color={TOKENS.PRIMARY} />

            <SystemMarker text="ACTION::PROPOSAL" position="top-2 right-3" />

            <div className="relative z-10 p-5 md:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              {/* Context */}
              <div className="flex items-center gap-3">
                <span
                  ref={ctaDotRef}
                  aria-hidden="true"
                  className="inline-block w-1.5 h-1.5 shrink-0 will-change-[opacity]"
                  style={{ backgroundColor: TOKENS.PRIMARY, opacity: 0.5 }}
                />
                <div>
                  <p
                    className="font-mono text-[10px] tracking-widest text-white/25 mb-1"
                    aria-hidden="true"
                  >
                    NEXT_STEP
                  </p>
                  <p className="text-sm md:text-base text-white/55 leading-[1.5]">
                    Ready to build something{" "}
                    <span className="text-white/90 font-medium">
                      exceptional
                    </span>
                    ?
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="#contact"
                aria-label="Request a website proposal — opens contact form"
                className="group relative inline-flex items-center gap-2.5 border px-6 py-3 md:px-8 md:py-3.5 font-medium text-sm md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 will-change-transform min-h-[44px] min-w-[44px] transition-colors duration-200"
                style={{
                  borderColor: ctaHovered
                    ? `${TOKENS.PRIMARY}88`
                    : `${TOKENS.PRIMARY}44`,
                  color: ctaHovered ? TOKENS.PRIMARY : "rgba(255,255,255,0.9)",
                  outlineColor: TOKENS.PRIMARY,
                   "--tw-ring-color": TOKENS.PRIMARY,
                  "--tw-ring-offset-color": TOKENS.DARK_BG,
                }}
                onMouseEnter={onCtaEnter}
                onMouseLeave={onCtaLeave}
                onFocus={onCtaEnter}
                onBlur={onCtaLeave}
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
                      background: `linear-gradient(90deg, transparent 0%, ${TOKENS.PRIMARY}0A 40%, ${TOKENS.PRIMARY}14 50%, ${TOKENS.PRIMARY}0A 60%, transparent 100%)`,
                    }}
                  />
                </div>

                {/* Hover fill */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{
                    backgroundColor: `${TOKENS.PRIMARY}08`,
                    opacity: ctaHovered ? 1 : 0,
                  }}
                />

                <span className="relative z-10">{CTA_TEXT}</span>

                {/* Arrow */}
                <span
                  className="relative z-10 inline-block transition-transform duration-200"
                  style={{
                    transform: ctaHovered ? "translateX(4px)" : "translateX(0)",
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

export default memo(WebDesignSection);
