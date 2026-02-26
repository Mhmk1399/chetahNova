// app/components/sections/FaqIntroSection.tsx
"use client";

import { useRef, useEffect, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// ════════════════════════════════════════════════════════════════════════════
// REGISTER GSAP
// ════════════════════════════════════════════════════════════════════════════

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#8B5CF6",
  dark: "#0A0D14",
  darkSurface: "#0F1219",
  glass: {
    bg: "rgba(255, 255, 255, 0.02)",
    border: "rgba(255, 255, 255, 0.06)",
  },
} as const;

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

interface FaqIntroProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

const Icons = {
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  ),
  message: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M5 12h14M12 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline
        points="20 6 9 17 4 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  lightbulb: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 18h6M10 22h4" strokeLinecap="round" />
      <path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// TRUST BADGES DATA
// ════════════════════════════════════════════════════════════════════════════

const TRUST_BADGES = [
  {
    icon: Icons.shield,
    label: "Transparent Process",
    color: COLORS.primary,
  },
  {
    icon: Icons.clock,
    label: "24h Response Time",
    color: COLORS.secondary,
  },
  {
    icon: Icons.message,
    label: "Direct Support",
    color: COLORS.accent,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function FaqIntroSectionComponent({ className = "" }: FaqIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current || !panelRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(panelRef.current, { opacity: 0, y: 30 });
      gsap.set(".trust-badge", { opacity: 0, scale: 0.9 });

      // Entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(panelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      }).to(
        ".trust-badge",
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4",
      );

      // Light streak animation
      if (lightRef.current) {
        gsap.to(lightRef.current, {
          xPercent: 400,
          duration: 12,
          ease: "none",
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="faq-intro"
      className={`relative overflow-hidden py-16 md:py-16 ${className}`}
      style={{ backgroundColor: COLORS.dark }}
      aria-labelledby="faq-intro-title"
    >
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(ellipse, ${COLORS.secondary}08 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Main Panel */}
        <div
          ref={panelRef}
          className="relative overflow-hidden"
          style={{
            background: COLORS.glass.bg,
            border: `1px solid ${COLORS.glass.border}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.secondary}, ${COLORS.primary}, transparent)`,
            }}
            aria-hidden="true"
          />

          {/* Light streak */}
          {!reducedMotion && (
            <div
              ref={lightRef}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.secondary}06, transparent)`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Panel content */}
          <div className="relative grid gap-8 p-8 md:grid-cols-[1fr,auto] md:items-center md:gap-12 md:p-10 lg:p-12">
            {/* Left: Text content */}
            <div>
              {/* Badge */}
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  background: `${COLORS.secondary}15`,
                  border: `1px solid ${COLORS.secondary}30`,
                }}
              >
                <span className="h-4 w-4" style={{ color: COLORS.secondary }}>
                  {Icons.lightbulb}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: COLORS.secondary }}
                >
                  Before You Start
                </span>
              </div>

              {/* Title */}
              <h2
                id="faq-intro-title"
                className="mb-4 text-2xl font-bold tracking-tight text-white md:text-3xl"
              >
                Quick Answers to Help You{" "}
                <span style={{ color: COLORS.primary }}>Get Started</span>
              </h2>

              {/* Description */}
              <p className="mb-6 text-sm leading-relaxed text-white/50 md:text-base">
                We believe{" "}
                <span className="text-white/70">transparency is key</span>.
                That's why we created this FAQ page to answer the most common
                questions about our{" "}
                <span className="text-white/70">services</span>,{" "}
                <span className="text-white/70">process</span>,{" "}
                <span className="text-white/70">pricing</span>, and{" "}
                <span className="text-white/70">delivery</span>.
              </p>

              {/* Secondary note with CTA */}
              <div
                className="flex flex-col gap-4 rounded-sm p-4 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}08, ${COLORS.accent}05)`,
                  border: `1px solid ${COLORS.primary}20`,
                }}
              >
                <p className="text-sm text-white/60">
                  Can't find your question?{" "}
                  <span className="text-white/80">
                    We'll respond within 24 hours.
                  </span>
                </p>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors duration-300"
                  style={{ color: COLORS.primary }}
                >
                  Contact Us
                  <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    {Icons.arrow}
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: Trust badges */}
            <div className="flex flex-row gap-3 md:flex-col">
              {TRUST_BADGES.map((badge, index) => (
                <div
                  key={index}
                  className="trust-badge flex flex-1 flex-col items-center gap-2 p-4 text-center transition-all duration-300 hover:bg-white/2 md:flex-row md:gap-3 md:text-left"
                  style={{
                    background: COLORS.glass.bg,
                    border: `1px solid ${COLORS.glass.border}`,
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center"
                    style={{
                      background: `${badge.color}15`,
                      border: `1px solid ${badge.color}30`,
                    }}
                  >
                    <span className="h-5 w-5" style={{ color: badge.color }}>
                      {badge.icon}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-white/70 md:text-sm">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Corner markers */}
          <div
            className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t"
            style={{ borderColor: `${COLORS.secondary}30` }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t"
            style={{ borderColor: `${COLORS.primary}30` }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l"
            style={{ borderColor: `${COLORS.accent}30` }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r"
            style={{ borderColor: `${COLORS.secondary}30` }}
            aria-hidden="true"
          />
        </div>

      
      </div>

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-0 left-1/2 h-px w-1/2 max-w-xl -translate-x-1/2"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.glass.border}, transparent)`,
        }}
        aria-hidden="true"
      />
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

export const FaqIntroSection = memo(FaqIntroSectionComponent);
export default FaqIntroSection;
