// app/components/sections/ContactHeroSection.tsx
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
  success: "#10B981",
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

interface ContactHeroProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

const Icons = {
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" />
      <path
        d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  phone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
      <path
        d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
        strokeLinecap="round"
      />
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
  globe: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
        strokeLinecap="round"
      />
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
  fileText: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="14 2 14 8 20 8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
      <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
    </svg>
  ),
  rocket: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  zap: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// HERO HIGHLIGHTS DATA
// ════════════════════════════════════════════════════════════════════════════

const HERO_HIGHLIGHTS = [
  {
    icon: Icons.calendar,
    text: "Free Consultation Available",
    color: COLORS.success,
  },
  {
    icon: Icons.globe,
    text: "International Clients Welcome",
    color: COLORS.secondary,
  },
  {
    icon: Icons.clock,
    text: "Response Within 24 Hours",
    color: COLORS.primary,
  },
  {
    icon: Icons.fileText,
    text: "Custom Quote & Strategy Roadmap",
    color: COLORS.accent,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// CONTACT METHODS DATA
// ════════════════════════════════════════════════════════════════════════════

const CONTACT_METHODS = [
  {
    icon: Icons.mail,
    label: "Email Us",
    value: "hello@agency.com",
    href: "mailto:hello@agency.com",
    color: COLORS.primary,
  },
  {
    icon: Icons.phone,
    label: "Call Us",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
    color: COLORS.secondary,
  },
  {
    icon: Icons.calendar,
    label: "Book a Call",
    value: "Schedule Meeting",
    href: "#booking",
    color: COLORS.accent,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// BACKGROUND COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkSurface} 50%, ${COLORS.dark} 100%)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="contact-pattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="40" cy="40" r="1.5" fill={COLORS.primary} />
            <circle cx="0" cy="0" r="0.5" fill={COLORS.secondary} />
            <circle cx="80" cy="0" r="0.5" fill={COLORS.accent} />
            <circle cx="0" cy="80" r="0.5" fill={COLORS.accent} />
            <circle cx="80" cy="80" r="0.5" fill={COLORS.secondary} />
            <line
              x1="40"
              y1="40"
              x2="0"
              y2="0"
              stroke={COLORS.primary}
              strokeWidth="0.2"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="40"
              x2="80"
              y2="80"
              stroke={COLORS.accent}
              strokeWidth="0.2"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#contact-pattern)" />
      </svg>

      {/* Ambient orbs */}
      <div
        className="absolute left-1/4 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.primary}15 0%, transparent 60%)`,
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute right-0 top-1/3 h-150 w-150 translate-x-1/4 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.secondary}12 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}10 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Top gradient line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.primary}50, ${COLORS.secondary}40, ${COLORS.accent}50, transparent)`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// FLOATING ELEMENTS
// ════════════════════════════════════════════════════════════════════════════

const FloatingElements = memo(function FloatingElements() {
  const elementsRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!elementsRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(".float-element", {
        y: "+=15",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: "random" },
      });

      gsap.to(".rotate-element", {
        rotation: 360,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }, elementsRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={elementsRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Floating icons */}
      <div className="float-element absolute left-[8%] top-[15%] h-6 w-6 text-white/[0.04]">
        {Icons.mail}
      </div>
      <div className="float-element absolute right-[12%] top-[20%] h-5 w-5 text-white/5">
        {Icons.rocket}
      </div>
      <div className="float-element absolute left-[15%] bottom-[30%] h-8 w-8 text-white/[0.03]">
        {Icons.phone}
      </div>
      <div className="float-element absolute right-[10%] bottom-[25%] h-4 w-4 text-white/[0.04]">
        {Icons.calendar}
      </div>

      {/* Sparkles */}
      <div
        className="rotate-element absolute left-[5%] top-[40%] h-3 w-3"
        style={{ color: `${COLORS.primary}15` }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="rotate-element absolute right-[8%] top-[35%] h-2 w-2"
        style={{ color: `${COLORS.secondary}10` }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="rotate-element absolute left-[20%] bottom-[20%] h-4 w-4"
        style={{ color: `${COLORS.accent}10` }}
      >
        {Icons.sparkle}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// HIGHLIGHT ITEM COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const HighlightItem = memo(function HighlightItem({
  highlight,
  index,
}: {
  highlight: (typeof HERO_HIGHLIGHTS)[number];
  index: number;
}) {
  return (
    <div className="highlight-item flex items-center gap-3">
      {/* Check circle */}
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{
          background: `${highlight.color}15`,
          border: `1px solid ${highlight.color}30`,
        }}
      >
        <span className="h-3 w-3" style={{ color: highlight.color }}>
          {Icons.check}
        </span>
      </div>

      {/* Text */}
      <span className="text-sm text-white/70 md:text-base">
        {highlight.text}
      </span>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// CONTACT METHOD CARD
// ════════════════════════════════════════════════════════════════════════════

const ContactMethodCard = memo(function ContactMethodCard({
  method,
  index,
}: {
  method: (typeof CONTACT_METHODS)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={method.href}
      className="contact-card group relative flex flex-col items-center gap-3 p-5 text-center transition-all duration-300"
      style={{
        background: isHovered ? `${method.color}08` : COLORS.glass.bg,
        border: `1px solid ${isHovered ? `${method.color}30` : COLORS.glass.border}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top accent */}
      <div
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${method.color}, transparent)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Icon */}
      <div
        className="flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `${method.color}15`,
          border: `1px solid ${method.color}25`,
        }}
      >
        <span className="h-6 w-6" style={{ color: method.color }}>
          {method.icon}
        </span>
      </div>

      {/* Label */}
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
        {method.label}
      </span>

      {/* Value */}
      <span
        className="text-sm font-medium transition-colors duration-300"
        style={{ color: isHovered ? method.color : "rgba(255,255,255,0.7)" }}
      >
        {method.value}
      </span>

      {/* Corner marker */}
      <div
        className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r transition-all duration-300"
        style={{ borderColor: isHovered ? method.color : "transparent" }}
      />
    </a>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// AVAILABILITY INDICATOR
// ════════════════════════════════════════════════════════════════════════════

const AvailabilityIndicator = memo(function AvailabilityIndicator() {
  return (
    <div
      className="availability-badge inline-flex items-center gap-2 rounded-full px-4 py-2"
      style={{
        background: `${COLORS.success}10`,
        border: `1px solid ${COLORS.success}25`,
      }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: COLORS.success }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: COLORS.success }}
        />
      </span>
      <span className="text-xs font-medium" style={{ color: COLORS.success }}>
        Available for New Projects
      </span>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function ContactHeroSectionComponent({ className = "" }: ContactHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Set initial states
      gsap.set(".availability-badge", { opacity: 0, y: 20 });
      gsap.set(".hero-title", { opacity: 0, y: 40 });
      gsap.set(".hero-subtitle", { opacity: 0, y: 30 });
      gsap.set(".highlight-item", { opacity: 0, x: -20 });
      gsap.set(".hero-cta", { opacity: 0, y: 20 });
      gsap.set(".contact-card", { opacity: 0, y: 30, scale: 0.95 });

      // Animate in sequence
      tl.to(".availability-badge", { opacity: 1, y: 0, duration: 0.5 })
        .to(".hero-title", { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
        .to(".hero-subtitle", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(
          ".highlight-item",
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 },
          "-=0.4",
        )
        .to(
          ".hero-cta",
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.2",
        )
        .to(
          ".contact-card",
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="contact-hero"
      className={`relative min-h-[90vh] overflow-hidden py-16 lg:py-16 ${className}`}
      style={{ backgroundColor: COLORS.dark }}
      aria-labelledby="contact-hero-title"
    >
      <HeroBackground />
      <FloatingElements />

      {/* Content */}
      <div ref={contentRef} className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
     

        {/* Availability Badge */}
        <div className="mb-8 flex justify-center">
          <AvailabilityIndicator />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-[1.3fr,1fr] lg:gap-16 lg:items-center">
          {/* Left Column: Text Content */}
          <div>
            {/* Title */}
            <h1
              id="contact-hero-title"
              className="hero-title mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              Let's Build Your{" "}
              <span
                className="relative inline-block"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Next Website
                <span
                  className="absolute -bottom-1 left-0 h-1 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    opacity: 0.4,
                  }}
                />
              </span>{" "}
              Project
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle mb-8 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
              Have a project in mind? Whether you need a{" "}
              <span className="text-white/75">high-performance website</span>,{" "}
              <span className="text-white/75">SEO growth strategy</span>, or{" "}
              <span className="text-white/75">AI automation tools</span>, our
              team is ready to help.{" "}
              <span style={{ color: COLORS.primary }}>Contact us today</span>{" "}
              and get a response within 24 hours.
            </p>

            {/* Highlights */}
            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              {HERO_HIGHLIGHTS.map((highlight, index) => (
                <HighlightItem
                  key={index}
                  highlight={highlight}
                  index={index}
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="#contact-form"
                className="hero-cta group relative overflow-hidden px-8 py-4 text-center text-sm font-bold uppercase tracking-wider"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}dd)`,
                  color: "#000",
                }}
              >
                <span
                  className="absolute inset-0 -translate-x-full skew-x-12 transition-transform duration-500 group-hover:translate-x-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <span className="h-4 w-4">{Icons.calendar}</span>
                  Request a Free Consultation
                </span>
              </Link>

              <Link
                href="#quote"
                className="hero-cta group flex items-center justify-center gap-2 border px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white"
                style={{ borderColor: COLORS.glass.border }}
              >
                <span className="h-4 w-4">{Icons.fileText}</span>
                Get a Custom Quote
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Cards */}
          <div className="relative">
            {/* Glass container */}
            <div
              className="relative overflow-hidden p-6 md:p-8"
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
                  background: `linear-gradient(90deg, transparent, ${COLORS.secondary}, ${COLORS.accent}, transparent)`,
                }}
              />

              {/* Header */}
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center"
                  style={{
                    background: `${COLORS.secondary}15`,
                    border: `1px solid ${COLORS.secondary}25`,
                  }}
                >
                  <span className="h-5 w-5" style={{ color: COLORS.secondary }}>
                    {Icons.zap}
                  </span>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-white">
                    Get in Touch
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40">
                    Choose your preferred method
                  </span>
                </div>
              </div>

              {/* Contact Cards Grid */}
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {CONTACT_METHODS.map((method, index) => (
                  <ContactMethodCard
                    key={index}
                    method={method}
                    index={index}
                  />
                ))}
              </div>

              {/* Response time note */}
              <div
                className="mt-6 flex items-center justify-center gap-2 rounded-sm p-3"
                style={{
                  background: `${COLORS.success}08`,
                  border: `1px solid ${COLORS.success}15`,
                }}
              >
                <span className="h-4 w-4" style={{ color: COLORS.success }}>
                  {Icons.clock}
                </span>
                <span className="text-xs text-white/60">
                  Average response time:{" "}
                  <span style={{ color: COLORS.success }}>under 2 hours</span>
                </span>
              </div>

              {/* Corner markers */}
              <div
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t"
                style={{ borderColor: `${COLORS.secondary}30` }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t"
                style={{ borderColor: `${COLORS.accent}30` }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l"
                style={{ borderColor: `${COLORS.primary}30` }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r"
                style={{ borderColor: `${COLORS.secondary}30` }}
                aria-hidden="true"
              />
            </div>

            {/* Decorative elements */}
            <div
              className="absolute -right-4 -top-4 h-24 w-24 opacity-20"
              style={{
                background: `radial-gradient(circle, ${COLORS.secondary}40 0%, transparent 70%)`,
                filter: "blur(20px)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-white/5 pt-10 md:gap-12">
          <div className="text-center">
            <span
              className="block text-3xl font-bold"
              style={{ color: COLORS.primary }}
            >
              150+
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              Projects Delivered
            </span>
          </div>
          <div className="hidden h-10 w-px bg-white/10 md:block" />
          <div className="text-center">
            <span
              className="block text-3xl font-bold"
              style={{ color: COLORS.secondary }}
            >
              50+
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              Happy Clients
            </span>
          </div>
          <div className="hidden h-10 w-px bg-white/10 md:block" />
          <div className="text-center">
            <span
              className="block text-3xl font-bold"
              style={{ color: COLORS.accent }}
            >
              24h
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              Response Time
            </span>
          </div>
          <div className="hidden h-10 w-px bg-white/10 md:block" />
          <div className="text-center">
            <span
              className="block text-3xl font-bold"
              style={{ color: COLORS.success }}
            >
              98%
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              Client Satisfaction
            </span>
          </div>
        </div>

       
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.primary}30, ${COLORS.secondary}30, transparent)`,
        }}
      />

      {/* Corner markers */}
      <div
        className="pointer-events-none absolute left-6 top-6 hidden h-10 w-10 border-l border-t md:block"
        style={{ borderColor: `${COLORS.primary}15` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-6 top-6 hidden h-10 w-10 border-r border-t md:block"
        style={{ borderColor: `${COLORS.secondary}15` }}
        aria-hidden="true"
      />
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

export const ContactHeroSection = memo(ContactHeroSectionComponent);
export default ContactHeroSection;
