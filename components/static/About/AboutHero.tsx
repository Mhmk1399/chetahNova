// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/HeroSection.tsx
// PURPOSE: Creative split-layout hero with image showcase
// VERSION: 3.0.0
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  memo,
  type ReactNode,
  type RefObject,
  type JSX,
} from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  background: "#050810",
  surface: "#0a1018",
  success: "#10B981",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const HERO_CONTENT = {
  eyebrow: "About Us",
  title: {
    line1: "We Build Websites That",
    highlights: [
      { text: "Think", color: COLORS.primary },
      { text: "Rank", color: COLORS.secondary },
      { text: "Sell", color: COLORS.accent },
    ],
  },
  subtitle:
    "We are a modern web design and SEO agency focused on building high-performance websites and custom AI tools that help businesses scale faster, generate more leads, and automate their growth.",
 
  cta: {
    primary: { text: "Book a Free Consultation", href: "#contact" },
    secondary: { text: "View Our Services", href: "#services" },
  },
  image: {
    src: "/images/hero-image.jpg",
    alt: "Modern web design showcase",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface HeroSectionProps {
  id: string;
  imageSrc?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Background - Elegant gradient background with grid
 */
const Background = memo(function Background(): JSX.Element {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, ${COLORS.primary}08, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 20%, ${COLORS.secondary}06, transparent 50%),
            radial-gradient(ellipse 50% 30% at 60% 80%, ${COLORS.accent}05, transparent 40%),
            ${COLORS.background}
          `,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Diagonal accent lines */}
      <div
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            ${COLORS.secondary} 80px,
            ${COLORS.secondary} 81px
          )`,
        }}
      />
    </div>
  );
});

/**
 * FloatingOrbs - Decorative floating elements
 */
const FloatingOrbs = memo(function FloatingOrbs(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Primary orb */}
      <div
        className="absolute -right-20 top-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${COLORS.primary}08` }}
      />
      {/* Secondary orb */}
      <div
        className="absolute -left-32 bottom-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: `${COLORS.secondary}06` }}
      />
      {/* Accent orb */}
      <div
        className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${COLORS.accent}05` }}
      />
    </div>
  );
});

/**
 * SystemMarkers - Corner atmospheric labels
 */
const SystemMarkers = memo(function SystemMarkers(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none font-mono text-[10px] tracking-widest text-white/10"
    >
      <span className="absolute left-4 top-4 flex items-center gap-2 sm:left-8 sm:top-8">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        SYS::HERO_ACTIVE
      </span>
      <span className="absolute right-4 top-4 sm:right-8 sm:top-8">v3.0.1</span>
      <span className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
        40.7128°N 74.0060°W
      </span>
      <span className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8">
        ONLINE
      </span>
    </div>
  );
});

/**
 * ImageFrame - Creative image container with overlays
 */
const ImageFrame = memo(function ImageFrame({
  src,
  alt,
  isVisible,
}: {
  src: string;
  alt: string;
  isVisible: boolean;
}): JSX.Element {
  return (
    <div
      className="relative transition-all duration-1000"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateX(0) scale(1)"
          : "translateX(50px) scale(0.95)",
      }}
    >
      {/* Outer frame with accent border */}
      <div className="relative">
        {/* Background glow */}
        <div
          className="absolute -inset-4 blur-2xl"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.secondary}15, ${COLORS.accent}10)`,
          }}
        />

        {/* Main image container */}
        <div className="relative overflow-hidden border border-white/10 bg-white/2">
          {/* Top accent line */}
          <div
            className="absolute inset-x-0 top-0 z-10 h-px"
            style={{
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary}, ${COLORS.accent})`,
            }}
          />

          {/* Corner brackets */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <span
              className="absolute -left-px -top-px h-8 w-8 border-l-2 border-t-2"
              style={{ borderColor: COLORS.primary }}
            />
            <span
              className="absolute -right-px -top-px h-8 w-8 border-r-2 border-t-2"
              style={{ borderColor: COLORS.secondary }}
            />
            <span
              className="absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2"
              style={{ borderColor: COLORS.secondary }}
            />
            <span
              className="absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2"
              style={{ borderColor: COLORS.accent }}
            />
          </div>

          {/* Image */}
          <div className="aspect-4/5 w-full overflow-hidden sm:aspect-3/4 lg:aspect-4/5">
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="eager"
            />

            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 40%, ${COLORS.background}90 100%)`,
              }}
            />

            {/* Scan line effect */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.03) 2px,
                  rgba(255,255,255,0.03) 4px
                )`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * ContentSection - Left side content with animations
 */
const ContentSection = memo(function ContentSection({
  isVisible,
}: {
  isVisible: boolean;
}): JSX.Element {
  return (
    <div className="relative">
      {/* Eyebrow */}
      <div
        className="mb-6 flex items-center gap-3 transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <span
          className="h-px w-8"
          style={{ backgroundColor: COLORS.secondary }}
        />
        <span
          className="font-mono text-xs uppercase tracking-[0.3em]"
          style={{ color: COLORS.secondary }}
        >
          {HERO_CONTENT.eyebrow}
        </span>
      </div>

      {/* Main Title */}
      <h1
        className="mb-8 text-3xl font-bold leading-[1.1] text-white transition-all duration-700 sm:text-4xl lg:text-5xl xl:text-6"
        style={{
          letterSpacing: "-0.03em",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transitionDelay: "100ms",
        }}
      >
        {HERO_CONTENT.title.line1}
        <br />
        <span className="mt-2 inline-flex flex-wrap gap-x-3">
          {HERO_CONTENT.title.highlights.map((highlight, index) => (
            <span key={highlight.text}>
              <span style={{ color: highlight.color }}>{highlight.text}</span>
              {index < HERO_CONTENT.title.highlights.length - 1 && (
                <span className="text-white/30">,</span>
              )}
            </span>
          ))}
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="mb-6 max-w-xl text-base leading-relaxed text-white/60 transition-all duration-700 sm:text-lg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "200ms",
        }}
      >
        {HERO_CONTENT.subtitle}
      </p>

     

      {/* CTAs */}
      <div
        className="flex flex-col gap-4 transition-all duration-700 sm:flex-row sm:gap-5"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "400ms",
        }}
      >
        {/* Primary CTA */}
        <a
          href={HERO_CONTENT.cta.primary.href}
          className="group relative inline-flex min-h-13 items-center justify-center overflow-hidden px-8 py-4 text-sm font-medium text-white transition-all duration-300"
          style={{
            backgroundColor: COLORS.primary,
          }}
        >
          {/* Shimmer effect */}
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

          {/* Corner accents */}
          <span className="absolute -left-px -top-px h-2 w-2 border-l border-t border-white/50" />
          <span className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-white/50" />

          <span className="relative flex items-center gap-2">
            {HERO_CONTENT.cta.primary.text}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </a>

        {/* Secondary CTA */}
        <a
          href={HERO_CONTENT.cta.secondary.href}
          className="group relative inline-flex min-h-13 items-center justify-center overflow-hidden border border-white/20 bg-transparent px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
        >
          {/* Corner accents */}
          <span
            className="absolute -left-px -top-px h-2 w-2 border-l border-t transition-colors duration-300 group-hover:border-current"
            style={{ borderColor: COLORS.secondary }}
          />
          <span
            className="absolute -bottom-px -right-px h-2 w-2 border-b border-r transition-colors duration-300 group-hover:border-current"
            style={{ borderColor: COLORS.secondary }}
          />

          <span className="relative">{HERO_CONTENT.cta.secondary.text}</span>
        </a>
      </div>
    </div>
  );
});

/**
 * DecoGrid - Decorative grid overlay
 */
const DecoGrid = memo(function DecoGrid(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {/* Vertical center line */}
      <div
        className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2"
        style={{
          background: `linear-gradient(180deg, transparent, ${COLORS.secondary}20, transparent)`,
        }}
      />

      {/* Horizontal lines */}
      <div
        className="absolute left-0 right-0 top-1/3 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.primary}15, transparent)`,
        }}
      />
      <div
        className="absolute bottom-1/3 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}15, transparent)`,
        }}
      />

      {/* Corner decorations */}
      <div className="absolute left-8 top-8 h-20 w-20 border-l border-t border-white/5" />
      <div className="absolute bottom-8 right-8 h-20 w-20 border-b border-r border-white/5" />
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HeroSection({
  id,
  imageSrc = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
}: HeroSectionProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background layers */}
      <Background />
      <FloatingOrbs />
      <DecoGrid />
      <SystemMarkers />

      {/* Main content */}
      <div className="  flex min-h-screen relative mx-auto max-w-[99%] md:max-w-[95%] px-4  flex-col  py-20   lg:flex-row lg:items-center lg:gap-16   lg:py-0 xl:gap-24">
        {/* Image - First on mobile */}
        <div className="order-1 mb-12 shrink-0 lg:order-2 lg:mb-0 lg:w-[45%]">
          <ImageFrame
            src={imageSrc}
            alt={HERO_CONTENT.image.alt}
            isVisible={isVisible}
          />
        </div>

        {/* Content - Second on mobile */}
        <div className="order-2 flex-1 lg:order-1">
          <ContentSection isVisible={isVisible} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.secondary}30, transparent)`,
        }}
      />
    </section>
  );
}

HeroSection.displayName = "HeroSection";
