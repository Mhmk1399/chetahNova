// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/ServicesHeroSection.tsx
// PURPOSE: Services page hero - Premium bento-grid layout
// VERSION: 2.0.0
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { useEffect, useState, memo, type JSX } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  background: "#030711",
  surface: "#0a1018",
  card: "#0d1520",
  success: "#10B981",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const HERO_CONTENT = {
  eyebrow: "What We Do",
  title: "Web Design, SEO & AI Automation That Drive Growth",
  subtitle:
    "We build high-performance websites, rank them on Google, and integrate AI tools that automate your business. Everything you need to scale your online presence in one complete solution.",
  services: [
    {
      id: "web",
      label: "01",
      title: "Custom Website Design & Development",
      description:
        "Stunning, conversion-focused websites built with modern technology",
      icon: "code",
      color: COLORS.primary,
      stat: "150+",
      statLabel: "Sites Launched",
    },
    {
      id: "seo",
      label: "02",
      title: "SEO Growth Systems & Google Ranking",
      description: "Data-driven SEO strategies that put you on page one",
      icon: "search",
      color: COLORS.secondary,
      stat: "300%",
      statLabel: "Avg. Traffic Growth",
    },
    {
      id: "ai",
      label: "03",
      title: "AI Automation Tools For Your Business",
      description: "Custom AI solutions that work while you sleep",
      icon: "ai",
      color: COLORS.accent,
      stat: "80%",
      statLabel: "Time Saved",
    },
    {
      id: "support",
      label: "04",
      title: "Ongoing Support, Maintenance & Security",
      description: "24/7 monitoring and continuous optimization",
      icon: "shield",
      color: COLORS.success,
      stat: "99.9%",
      statLabel: "Uptime",
    },
  ],
  cta: {
    primary: { text: "Get a Free Quote", href: "#quote" },
    secondary: { text: "Book a Consultation", href: "#consultation" },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const Icons: Record<string, (props: { size?: number }) => JSX.Element> = {
  code: ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  search: ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  ),
  ai: ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    </svg>
  ),
  shield: ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  arrow: ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Background
 */
const Background = memo(function Background(): JSX.Element {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, ${COLORS.accent}12, transparent 60%),
            radial-gradient(ellipse 60% 50% at 0% 50%, ${COLORS.primary}06, transparent 50%),
            radial-gradient(ellipse 60% 50% at 100% 80%, ${COLORS.secondary}06, transparent 50%),
            ${COLORS.background}
          `,
        }}
      />
    </div>
  );
});

/**
 * ServiceCard - Bento grid service card
 */
const ServiceCard = memo(function ServiceCard({
  service,
  index,
  isVisible,
  isLarge = false,
}: {
  service: (typeof HERO_CONTENT.services)[0];
  index: number;
  isVisible: boolean;
  isLarge?: boolean;
}): JSX.Element {
  const IconComponent = Icons[service.icon] || Icons.code;

  return (
    <div
      className={`
        group relative overflow-hidden border border-white/[0.06] 
        bg-linear-to-br from-white/[0.03] to-transparent
        backdrop-blur-sm transition-all duration-700
        hover:border-white/[0.12] hover:from-white/[0.05]
        ${isLarge ? "p-8 lg:p-10" : "p-6 lg:p-8"}
      `}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${200 + index * 100}ms`,
        minHeight: isLarge
          ? "clamp(280px, 35vh, 380px)"
          : "clamp(140px, 18vh, 180px)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${service.color}60, transparent)`,
        }}
      />

      {/* Corner accent */}
      <div
        className="absolute right-0 top-0 h-16 w-16"
        style={{
          background: `linear-gradient(135deg, ${service.color}10, transparent)`,
        }}
      />

      {/* Label */}
      <span
        className="mb-4 inline-block font-mono text-[10px] tracking-widest"
        style={{ color: service.color }}
      >
        {service.label}
      </span>

      {/* Icon */}
      <div
        className={`
          mb-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110
          ${isLarge ? "h-16 w-16" : "h-12 w-12"}
        `}
        style={{
          background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)`,
          border: `1px solid ${service.color}30`,
        }}
      >
        <span style={{ color: service.color }}>
          <IconComponent size={isLarge ? 28 : 22} />
        </span>
      </div>

      {/* Title */}
      <h3
        className={`
          mb-3 font-medium text-white
          ${isLarge ? "text-xl lg:text-2xl" : "text-base lg:text-lg"}
        `}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p className="mb-6 text-sm leading-relaxed text-white/50">
        {service.description}
      </p>

      {/* Stat */}
      <div className="mt-auto flex items-end justify-between border-t border-white/[0.06] pt-5">
        <div>
          <div
            className={`font-mono font-bold ${isLarge ? "text-3xl" : "text-2xl"}`}
            style={{ color: service.color }}
          >
            {service.stat}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-white/40">
            {service.statLabel}
          </div>
        </div>

        {/* Arrow indicator */}
        <div
          className="flex h-10 w-10 items-center justify-center border border-white/10 opacity-0 transition-all duration-300 group-hover:opacity-100"
          style={{ color: service.color }}
        >
          <Icons.arrow size={16} />
        </div>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at top right, ${service.color}08, transparent 70%)`,
        }}
      />
    </div>
  );
});

/**
 * Header Section
 */
const HeaderSection = memo(function HeaderSection({
  isVisible,
}: {
  isVisible: boolean;
}): JSX.Element {
  return (
    <div className="mb-12 max-w-3xl lg:mb-16">
      {/* Eyebrow */}
      <div
        className="mb-5 flex items-center gap-3 transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div
          className="h-px w-8"
          style={{ backgroundColor: COLORS.secondary }}
        />
        <span
          className="font-mono text-xs uppercase tracking-[0.2em]"
          style={{ color: COLORS.secondary }}
        >
          {HERO_CONTENT.eyebrow}
        </span>
      </div>

      {/* Title */}
      <h1
        className="mb-6 text-3xl font-bold leading-[1.15] tracking-tight text-white transition-all duration-700 sm:text-4xl lg:text-5xl xl:text-6xl"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "100ms",
        }}
      >
        {HERO_CONTENT.title}
      </h1>

      {/* Subtitle */}
      <p
        className="text-base leading-relaxed text-white/55 transition-all duration-700 sm:text-lg lg:text-xl"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "200ms",
        }}
      >
        {HERO_CONTENT.subtitle}
      </p>
    </div>
  );
});

/**
 * CTA Section
 */
const CTASection = memo(function CTASection({
  isVisible,
}: {
  isVisible: boolean;
}): JSX.Element {
  return (
    <div
      className="mt-12 flex flex-col gap-4 transition-all duration-700 sm:flex-row sm:items-center sm:gap-6 lg:mt-16"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: "700ms",
      }}
    >
      {/* Primary CTA */}
      <Link
        href={HERO_CONTENT.cta.primary.href}
        className="group relative inline-flex min-h-[56px] items-center justify-center gap-3 overflow-hidden px-10 py-4 text-base font-medium text-black transition-all duration-300"
        style={{ backgroundColor: COLORS.primary }}
      >
        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        <span className="relative">{HERO_CONTENT.cta.primary.text}</span>
        <span className="relative transition-transform duration-300 group-hover:translate-x-1">
          <Icons.arrow size={18} />
        </span>
      </Link>

      {/* Secondary CTA */}
      <Link
        href={HERO_CONTENT.cta.secondary.href}
        className="group inline-flex min-h-[56px] items-center justify-center gap-3 border border-white/20 px-10 py-4 text-base font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
      >
        <span>{HERO_CONTENT.cta.secondary.text}</span>
      </Link>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ServicesHeroSection({
  id = "services-hero",
}: {
  id?: string;
}): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative w-full overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-40"
      style={{ backgroundColor: COLORS.background }}
    >
      <Background />

      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Header */}
        <HeaderSection isVisible={isVisible} />

        {/* Bento Grid */}
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          style={{
            minHeight: "clamp(350px, 50vh, 500px)",
          }}
        >
          {/* Large card - Web Design */}
          <div className=" ">
            <ServiceCard
              service={HERO_CONTENT.services[0]}
              index={0}
              isVisible={isVisible}
            />
          </div>

          {/* SEO */}
          <div className=" ">
            <ServiceCard
              service={HERO_CONTENT.services[1]}
              index={1}
              isVisible={isVisible}
            />
          </div>

          {/* AI */}
          <div>
            <ServiceCard
              service={HERO_CONTENT.services[2]}
              index={2}
              isVisible={isVisible}
            />
          </div>

          {/* Support */}
          <div>
            <ServiceCard
              service={HERO_CONTENT.services[3]}
              index={3}
              isVisible={isVisible}
            />
          </div>
        </div>

        {/* CTAs */}
        <CTASection isVisible={isVisible} />
      </div>

      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.secondary}30, transparent)`,
        }}
      />
    </section>
  );
}

ServicesHeroSection.displayName = "ServicesHeroSection";
