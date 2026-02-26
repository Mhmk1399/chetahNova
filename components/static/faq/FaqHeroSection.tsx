// app/components/sections/FaqHeroSection.tsx
"use client";

import { useRef, useEffect, useState, memo, useCallback } from "react";
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

interface FaqCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

interface FaqHeroProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

const Icons = {
  design: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" strokeLinecap="round" />
    </svg>
  ),
  seo: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      <path d="M11 8v6M8 11h6" strokeLinecap="round" />
    </svg>
  ),
  ai: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  ),
  payment: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <path d="M6 15h4" strokeLinecap="round" />
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
  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
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
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  question: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// FAQ CATEGORIES DATA
// ════════════════════════════════════════════════════════════════════════════

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "design",
    label: "Web Design",
    icon: Icons.design,
    count: 8,
    color: COLORS.primary,
  },
  {
    id: "seo",
    label: "SEO Services",
    icon: Icons.seo,
    count: 6,
    color: COLORS.secondary,
  },
  {
    id: "ai",
    label: "AI Tools",
    icon: Icons.ai,
    count: 5,
    color: COLORS.accent,
  },
  {
    id: "payment",
    label: "Pricing & Payment",
    icon: Icons.payment,
    count: 7,
    color: COLORS.primary,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// BACKGROUND COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const HeroBackground = memo(function HeroBackground() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${COLORS.dark} 0%, ${COLORS.darkSurface} 50%, ${COLORS.dark} 100%)`,
        }}
      />

      {/* Grid pattern */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Neural pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="faq-neural"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="40" cy="40" r="1.5" fill={COLORS.accent} />
            <circle cx="0" cy="0" r="0.5" fill={COLORS.primary} />
            <circle cx="80" cy="0" r="0.5" fill={COLORS.secondary} />
            <circle cx="0" cy="80" r="0.5" fill={COLORS.secondary} />
            <circle cx="80" cy="80" r="0.5" fill={COLORS.primary} />
            <line
              x1="40"
              y1="40"
              x2="0"
              y2="0"
              stroke={COLORS.accent}
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="40"
              x2="80"
              y2="0"
              stroke={COLORS.primary}
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="40"
              x2="0"
              y2="80"
              stroke={COLORS.secondary}
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="40"
              x2="80"
              y2="80"
              stroke={COLORS.accent}
              strokeWidth="0.3"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#faq-neural)" />
      </svg>

      {/* Ambient orbs */}
      <div
        className="absolute left-1/4 top-0 h-175 w-175 -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}15 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute right-1/4 top-1/2 h-125 w-125 translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.primary}10 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-100 w-100 -translate-x-1/2 translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.secondary}08 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Top gradient line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}50, ${COLORS.primary}40, transparent)`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// CATEGORY CARD COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const CategoryCard = memo(function CategoryCard({
  category,
  index,
}: {
  category: FaqCategory;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      ref={cardRef}
      href={`#${category.id}`}
      className="category-card group relative flex flex-col items-center gap-3 p-5 text-center transition-all duration-300"
      style={{
        background: isHovered ? `${category.color}08` : COLORS.glass.bg,
        border: `1px solid ${isHovered ? `${category.color}40` : COLORS.glass.border}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${category.color}, transparent)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Icon */}
      <div
        className="flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `${category.color}15`,
          border: `1px solid ${category.color}30`,
        }}
      >
        <span className="h-6 w-6" style={{ color: category.color }}>
          {category.icon}
        </span>
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-white/80 transition-colors duration-300 group-hover:text-white">
        {category.label}
      </span>

      {/* Count badge */}
      <span
        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        style={{
          background: `${category.color}15`,
          color: category.color,
        }}
      >
        {category.count} Questions
      </span>

      {/* Corner markers */}
      <div
        className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r transition-all duration-300"
        style={{ borderColor: isHovered ? category.color : "transparent" }}
      />
    </a>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// SEARCH BAR COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const SearchBar = memo(function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className="search-bar relative mx-auto max-w-xl transition-all duration-300"
      style={{
        background: isFocused ? `${COLORS.accent}05` : COLORS.glass.bg,
        border: `1px solid ${isFocused ? `${COLORS.accent}40` : COLORS.glass.border}`,
      }}
    >
      {/* Icon */}
      <span className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30">
        {Icons.search}
      </span>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search for answers..."
        className="w-full bg-transparent py-4 pl-12 pr-4 text-sm text-white placeholder-white/30 outline-none"
      />

      {/* Keyboard shortcut hint */}
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 sm:flex">
        <kbd className="rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-white/30">
          ⌘
        </kbd>
        <kbd className="rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-white/30">
          K
        </kbd>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// FLOATING QUESTION MARKS (Decorative)
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
      // Floating animation for question marks
      gsap.to(".floating-q", {
        y: "+=15",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.5,
          from: "random",
        },
      });

      // Rotate sparkles slowly
      gsap.to(".floating-sparkle", {
        rotation: 360,
        duration: 20,
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
      {/* Question marks */}
      <div className="floating-q absolute left-[10%] top-[20%] h-8 w-8 text-white/[0.03]">
        {Icons.question}
      </div>
      <div className="floating-q absolute right-[15%] top-[30%] h-6 w-6 text-white/[0.04]">
        {Icons.question}
      </div>
      <div className="floating-q absolute left-[20%] bottom-[25%] h-10 w-10 text-white/2">
        {Icons.question}
      </div>
      <div className="floating-q absolute right-[10%] bottom-[35%] h-7 w-7 text-white/[0.03]">
        {Icons.question}
      </div>

      {/* Sparkles */}
      <div
        className="floating-sparkle absolute left-[5%] top-[40%] h-4 w-4"
        style={{ color: `${COLORS.primary}20` }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="floating-sparkle absolute right-[8%] top-[15%] h-3 w-3"
        style={{ color: `${COLORS.accent}15` }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="floating-sparkle absolute right-[25%] bottom-[20%] h-5 w-5"
        style={{ color: `${COLORS.secondary}10` }}
      >
        {Icons.sparkle}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// STATS ROW
// ════════════════════════════════════════════════════════════════════════════

const StatsRow = memo(function StatsRow() {
  return (
    <div className="stats-row flex flex-wrap items-center justify-center gap-8 text-center">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>
          26+
        </span>
        <span className="text-xs uppercase tracking-wider text-white/40">
          Questions
          <br />
          Answered
        </span>
      </div>
      <div className="hidden h-8 w-px bg-white/10 sm:block" />
      <div className="flex items-center gap-3">
        <span
          className="text-2xl font-bold"
          style={{ color: COLORS.secondary }}
        >
          4
        </span>
        <span className="text-xs uppercase tracking-wider text-white/40">
          Topic
          <br />
          Categories
        </span>
      </div>
      <div className="hidden h-8 w-px bg-white/10 sm:block" />
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold" style={{ color: COLORS.accent }}>
          24/7
        </span>
        <span className="text-xs uppercase tracking-wider text-white/40">
          Support
          <br />
          Available
        </span>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN HERO COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function FaqHeroSectionComponent({ className = "" }: FaqHeroProps) {
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
      gsap.set(".hero-badge", { opacity: 0, y: 20 });
      gsap.set(".hero-title", { opacity: 0, y: 30 });
      gsap.set(".hero-subtitle", { opacity: 0, y: 20 });
      gsap.set(".search-bar", { opacity: 0, y: 20 });
      gsap.set(".hero-cta", { opacity: 0, y: 20 });
      gsap.set(".category-card", { opacity: 0, y: 30, scale: 0.95 });
      gsap.set(".stats-row", { opacity: 0 });

      // Animate in sequence
      tl.to(".hero-badge", { opacity: 1, y: 0, duration: 0.6 })
        .to(".hero-title", { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .to(".hero-subtitle", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".search-bar", { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
        .to(
          ".hero-cta",
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3",
        )
        .to(
          ".category-card",
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
          "-=0.3",
        )
        .to(".stats-row", { opacity: 1, duration: 0.6 }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="faq-hero"
      className={`relative min-h-[90vh] overflow-hidden py-16   lg:py-16 ${className}`}
      style={{ backgroundColor: COLORS.dark }}
      aria-labelledby="faq-hero-title"
    >
      <HeroBackground />
      <FloatingElements />

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4"
      >
        {/* Badge */}
        <div className="hero-badge mb-6 flex justify-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.primary}10)`,
              border: `1px solid ${COLORS.accent}30`,
            }}
          >
            <span className="h-4 w-4" style={{ color: COLORS.accent }}>
              {Icons.question}
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: COLORS.accent }}
            >
              Help Center
            </span>
          </div>
        </div>

        {/* Title */}
        <h1
          id="faq-hero-title"
          className="hero-title mb-6 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Frequently Asked{" "}
          <span
            className="relative inline-block"
            style={{
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Questions
            {/* Underline decoration */}
            <span
              className="absolute -bottom-2 left-0 h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.primary}, ${COLORS.secondary})`,
                opacity: 0.3,
              }}
            />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed text-white/50 sm:text-lg md:text-xl">
          Have questions about <span className="text-white/70">web design</span>
          , <span className="text-white/70">SEO</span>,{" "}
          <span className="text-white/70">AI tools</span>,{" "}
          <span className="text-white/70">pricing</span>, or{" "}
          <span className="text-white/70">project timelines</span>?
        </p>

        {/* CTA Buttons */}
        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="hero-cta group relative overflow-hidden px-8 py-4 text-sm font-bold uppercase tracking-wider"
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
            <span className="relative flex items-center gap-2">
              <span className="h-4 w-4">{Icons.calendar}</span>
              Book a Free Consultation
            </span>
          </Link>

          <Link
            href="/contact"
            className="hero-cta group flex items-center gap-2 border px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white"
            style={{ borderColor: COLORS.glass.border }}
          >
            <span className="h-4 w-4">{Icons.message}</span>
            Contact Our Team
          </Link>
        </div>

        {/* Category Cards */}
        <div className="mb-16">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Browse by Category
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FAQ_CATEGORIES.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <StatsRow />
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}30, ${COLORS.primary}30, transparent)`,
        }}
      />

      {/* Corner markers */}
      <div
        className="pointer-events-none absolute left-6 top-6 hidden h-8 w-8 border-l border-t md:block"
        style={{ borderColor: `${COLORS.accent}20` }}
      />
      <div
        className="pointer-events-none absolute right-6 top-6 hidden h-8 w-8 border-r border-t md:block"
        style={{ borderColor: `${COLORS.primary}20` }}
      />
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

export const FaqHeroSection = memo(FaqHeroSectionComponent);
export default FaqHeroSection;
