// ============================================================
// FILE: app/components/AIIntegrationSection.tsx
//
// Complete AI Integration Section - Production Ready
// All-in-one component with no external dependencies beyond
// React, GSAP, and Tailwind
//
// Features:
// • Floating glass panel architecture
// • GPU-accelerated light streak animations
// • Scroll-triggered entrance animations
// • Full WCAG 2.1 AA accessibility
// • Respects prefers-reduced-motion
// • Mobile-first responsive design
// ============================================================

"use client";

import React, {
  memo,
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  type ReactNode,
  type RefObject,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ============================================================
// CONSTANTS — Animation Tokens
// ============================================================

const ANIMATION = {
  ENTRANCE: {
    DURATION: 0.6,
    STAGGER: 0.1,
    EASE: "power2.out",
    Y_OFFSET: 30,
    SCALE_START: 0.98,
  },
  LIGHT_STREAK: {
    DURATION: 12,
    WIDTH_PERCENT: 25,
    OPACITY: 0.04,
  },
  STATUS_PULSE: {
    DURATION: 2,
    OPACITY_MIN: 0.3,
    OPACITY_MAX: 1,
  },
  HOVER: {
    DURATION: 0.3,
    EASE: "power2.out",
  },
} as const;

// ============================================================
// CONSTANTS — Color System
// ============================================================

const COLORS = {
  PRIMARY: "#F59E0B",
  SECONDARY: "#06B6D4",
  ACCENT: "#6D28D9",
  DARK_BG: "#0B0F19",
} as const;

type AccentColor = "primary" | "secondary" | "accent";

const COLOR_VALUES: Record<AccentColor, string> = {
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  accent: COLORS.ACCENT,
};

const ACCENT_STYLES: Record<
  AccentColor,
  { bullet: string; border: string; gradient: string }
> = {
  primary: {
    bullet: "bg-amber-500",
    border: "border-amber-500/30",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.PRIMARY}40 50%, transparent 100%)`,
  },
  secondary: {
    bullet: "bg-cyan-500",
    border: "border-cyan-500/30",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.SECONDARY}40 50%, transparent 100%)`,
  },
  accent: {
    bullet: "bg-violet-500",
    border: "border-violet-500/30",
    gradient: `linear-gradient(90deg, transparent 0%, ${COLORS.ACCENT}40 50%, transparent 100%)`,
  },
};

// ============================================================
// CONSTANTS — Content Data
// ============================================================

interface ServiceExample {
  text: string;
}

interface ServiceData {
  id: string;
  systemId: string;
  title: string;
  description: string;
  examples: ServiceExample[];
  outcome: string;
  accentColor: AccentColor;
  coordinates: string;
  version: string;
}

interface HighlightWord {
  word: string;
  color: AccentColor;
}

const CONTENT = {
  sectionId: "ai-integration",
  systemLabel: "SYS::AI_CORE",

  headline: {
    text: "AI Integration & Smart Website Automation",
    highlights: [
      { word: "AI", color: "primary" as AccentColor },
      { word: "Smart", color: "secondary" as AccentColor },
      { word: "Automation", color: "accent" as AccentColor },
    ],
  },

  intro: [
    "AI is changing how businesses operate. We help companies integrate AI into their websites to automate tasks, improve customer experience, and increase conversion rates.",
    "We don't provide generic AI tools. We build custom AI systems designed around your business workflow.",
  ],

  services: [
    {
      id: "ai-tools",
      systemId: "MODULE::AUTOMATION",
      title: "AI Tools for Website Automation",
      description:
        "We create AI-powered tools that automate repetitive processes and improve customer interaction.",
      examples: [
        { text: "AI chatbot for customer support" },
        { text: "AI appointment booking assistant" },
        { text: "Automated FAQ responder" },
        { text: "Lead form automation and smart routing" },
        { text: "AI email reply assistant" },
      ],
      outcome:
        "Lower support cost, faster response time, better user satisfaction.",
      accentColor: "primary" as AccentColor,
      coordinates: "52.5200°N 13.4050°E",
      version: "v3.2.1",
    },
    {
      id: "custom-ai",
      systemId: "MODULE::CUSTOM_SYS",
      title: "Custom AI Solutions for Businesses",
      description:
        "Every business has unique needs. We develop custom AI tools tailored specifically to your industry, services, and customer journey.",
      examples: [
        { text: "AI sales assistant trained on your services" },
        { text: "AI lead scoring system" },
        { text: "AI dashboard for performance tracking" },
        { text: "Custom automation workflows" },
        { text: "Business process AI optimization" },
      ],
      outcome: "A smarter business system that scales faster.",
      accentColor: "secondary" as AccentColor,
      coordinates: "37.7749°N 122.4194°W",
      version: "v2.8.4",
    },
    {
      id: "ai-seo",
      systemId: "MODULE::SEO_ENGINE",
      title: "AI-Driven SEO Tools",
      description:
        "We integrate AI-powered SEO systems that speed up content creation, keyword planning, and SEO optimization while keeping content high quality and structured.",
      examples: [
        { text: "AI SEO content strategy generator" },
        { text: "Automated blog outline generation" },
        { text: "Internal linking automation" },
        { text: "AI keyword clustering system" },
        { text: "SEO performance tracking dashboard" },
      ],
      outcome: "Faster content production + stronger SEO results.",
      accentColor: "accent" as AccentColor,
      coordinates: "35.6762°N 139.6503°E",
      version: "v4.1.0",
    },
  ] as ServiceData[],

  cta: {
    text: "Request an AI Automation Demo",
   },
} as const;

// ============================================================
// HOOKS — useReducedMotion
// ============================================================

function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// ============================================================
// SUB-COMPONENT — GridOverlay
// Precision grid background (graph paper under glass effect)
// ============================================================

const GridOverlay = memo(function GridOverlay() {
  const gridSize = 72;
  const opacity = 0.025;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, ${opacity}) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, ${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  );
});

// ============================================================
// SUB-COMPONENT — AmbientGlow
// Asymmetric radial gradients for volumetric depth
// ============================================================

interface GlowConfig {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  color: string;
  size: string;
  opacity: number;
}

const AMBIENT_GLOWS: GlowConfig[] = [
  {
    top: "10%",
    left: "15%",
    color: COLORS.PRIMARY,
    size: "600px",
    opacity: 0.05,
  },
  {
    bottom: "20%",
    right: "10%",
    color: COLORS.SECONDARY,
    size: "500px",
    opacity: 0.04,
  },
];

const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {AMBIENT_GLOWS.map((glow, index) => (
        <div
          key={index}
          className="absolute will-change-transform"
          style={{
            top: glow.top,
            bottom: glow.bottom,
            left: glow.left,
            right: glow.right,
            width: glow.size,
            height: glow.size,
            background: `radial-gradient(circle, ${glow.color} 0%, transparent 70%)`,
            opacity: glow.opacity,
            transform: "translate(-50%, -50%)",
            filter: "blur(80px)",
          }}
        />
      ))}
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — SystemMarker
// Atmospheric monospace labels (command center aesthetic)
// ============================================================

type MarkerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface SystemMarkerProps {
  text: string;
  position: MarkerPosition;
  showStatus?: boolean;
  className?: string;
}

const MARKER_POSITIONS: Record<MarkerPosition, string> = {
  "top-left": "top-3 left-3 sm:top-4 sm:left-4",
  "top-right": "top-3 right-3 sm:top-4 sm:right-4",
  "bottom-left": "bottom-3 left-3 sm:bottom-4 sm:left-4",
  "bottom-right": "bottom-3 right-3 sm:bottom-4 sm:right-4",
};

const SystemMarker = memo(function SystemMarker({
  text,
  position,
  showStatus = false,
  className = "",
}: SystemMarkerProps) {
  return (
    <span
      aria-hidden="true"
      className={`
        pointer-events-none absolute select-none
        font-mono text-[10px] uppercase tracking-[0.15em]
        text-white/15
        ${MARKER_POSITIONS[position]}
        ${className}
      `}
    >
      {showStatus && (
        <span className="mr-1.5 inline-block text-amber-500/60">◉</span>
      )}
      {text}
    </span>
  );
});

// ============================================================
// SUB-COMPONENT — AccentLine
// Top edge gradient for glass panels
// ============================================================

interface AccentLineProps {
  accentColor: AccentColor;
}

const AccentLine = memo(function AccentLine({ accentColor }: AccentLineProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 right-0 top-0 h-px"
      style={{ background: ACCENT_STYLES[accentColor].gradient }}
    />
  );
});

// ============================================================
// SUB-COMPONENT — CornerMarkers
// Structural corner brackets
// ============================================================

const CornerMarkers = memo(function CornerMarkers() {
  const size = 12;
  const color = "rgba(255, 255, 255, 0.15)";

  const corners: Array<{
    style: CSSProperties;
    path: string;
  }> = [
    { style: { top: -1, left: -1 }, path: "M0 12V0H12" },
    { style: { top: -1, right: -1 }, path: "M12 12V0H0" },
    { style: { bottom: -1, left: -1 }, path: "M0 0V12H12" },
    { style: { bottom: -1, right: -1 }, path: "M12 0V12H0" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none">
      {corners.map((corner, index) => (
        <svg
          key={index}
          className="absolute"
          style={{ ...corner.style, width: size, height: size }}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d={corner.path} stroke={color} strokeWidth="1" fill="none" />
        </svg>
      ))}
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — LightStreak
// Animated horizontal light sweep (GPU-accelerated)
// ============================================================

interface LightStreakProps {
  accentColor: AccentColor;
}

const LightStreak = memo(function LightStreak({
  accentColor,
}: LightStreakProps) {
  const streakRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!streakRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(streakRef.current, { xPercent: -100 });

      gsap.to(streakRef.current, {
        xPercent: 400,
        duration: ANIMATION.LIGHT_STREAK.DURATION,
        ease: "none",
        repeat: -1,
        force3D: true,
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const color = COLOR_VALUES[accentColor];
  const opacityHex = Math.round(ANIMATION.LIGHT_STREAK.OPACITY * 255)
    .toString(16)
    .padStart(2, "0");

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        ref={streakRef}
        className="absolute inset-y-0 will-change-transform"
        style={{
          width: `${ANIMATION.LIGHT_STREAK.WIDTH_PERCENT}%`,
          background: `linear-gradient(90deg, transparent 0%, ${color}${opacityHex} 50%, transparent 100%)`,
        }}
      />
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — GlassPanel
// Core visual building block with all decorative elements
// ============================================================

interface GlassPanelProps {
  children: ReactNode;
  accentColor?: AccentColor;
  systemId?: string;
  coordinates?: string;
  version?: string;
  className?: string;
}

const GlassPanel = memo(function GlassPanel({
  children,
  accentColor = "primary",
  systemId,
  coordinates,
  version,
  className = "",
}: GlassPanelProps) {
  return (
    <div
      className={`
        relative
        border border-white/10
        bg-white/4
        backdrop-blur-sm
        will-change-transform
        ${className}
      `}
      style={{
        borderRadius: 0,
        boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.3)",
      }}
    >
      <AccentLine accentColor={accentColor} />
      <LightStreak accentColor={accentColor} />
      <CornerMarkers />

      {systemId && (
        <SystemMarker text={systemId} position="top-left" showStatus />
      )}
      {coordinates && <SystemMarker text={coordinates} position="top-right" />}
      {version && <SystemMarker text={version} position="bottom-right" />}

      <div className="relative z-10">{children}</div>
    </div>
  );
});

// ============================================================
// SUB-COMPONENT — HighlightedHeadline
// Headline with semantic color highlighting
// ============================================================

interface HighlightedHeadlineProps {
  text: string;
  highlights: readonly HighlightWord[];
}

const HIGHLIGHT_CLASSES: Record<AccentColor, string> = {
  primary: "text-amber-500",
  secondary: "text-cyan-500",
  accent: "text-violet-500",
};

const HighlightedHeadline = memo(function HighlightedHeadline({
  text,
  highlights,
}: HighlightedHeadlineProps) {
  const pattern = highlights.map((h) => h.word).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return (
    <h2
      className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
      style={{ letterSpacing: "-0.02em" }}
    >
      {parts.map((part, index) => {
        const highlight = highlights.find(
          (h) => h.word.toLowerCase() === part.toLowerCase(),
        );

        if (highlight) {
          return (
            <span key={index} className={HIGHLIGHT_CLASSES[highlight.color]}>
              {part}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </h2>
  );
});

// ============================================================
// SUB-COMPONENT — StatusIndicator
// Animated status dot with pulsing effect
// ============================================================

interface StatusIndicatorProps {
  text: string;
  active?: boolean;
}

const StatusIndicator = memo(function StatusIndicator({
  text,
  active = true,
}: StatusIndicatorProps) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!dotRef.current || !active || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(dotRef.current, {
        opacity: ANIMATION.STATUS_PULSE.OPACITY_MIN,
        duration: ANIMATION.STATUS_PULSE.DURATION,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, [active, prefersReducedMotion]);

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40"
    >
      <span
        ref={dotRef}
        className="h-2 w-2 bg-emerald-500"
        style={{ opacity: ANIMATION.STATUS_PULSE.OPACITY_MAX }}
      />
      {text}
    </span>
  );
});

// ============================================================
// SUB-COMPONENT — ServiceBlock
// Individual service card with all features
// ============================================================

interface ServiceBlockProps {
  data: ServiceData;
}

const ServiceBlock = memo(
  forwardRef<HTMLElement, ServiceBlockProps>(function ServiceBlock(
    { data },
    ref,
  ) {
    const styles = ACCENT_STYLES[data.accentColor];

    return (
      <article
        ref={ref}
        className="will-change-transform"
        aria-labelledby={`service-title-${data.id}`}
      >
        <GlassPanel
          accentColor={data.accentColor}
          systemId={data.systemId}
          coordinates={data.coordinates}
          version={data.version}
          className="h-full p-6 pt-10 sm:p-8 sm:pt-12 lg:p-10 lg:pt-14"
        >
          <h3
            id={`service-title-${data.id}`}
            className="mb-4 text-xl font-semibold text-white sm:text-2xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            {data.title}
          </h3>

          <p className="mb-6 text-base leading-relaxed text-white/60">
            {data.description}
          </p>

          <ul className="mb-6 space-y-3" aria-label={`${data.title} features`}>
            {data.examples.map((example, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-white/60"
              >
                <span
                  aria-hidden="true"
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 ${styles.bullet}`}
                />
                <span>{example.text}</span>
              </li>
            ))}
          </ul>

          <div className={`border-l-2 py-2 pl-4 ${styles.border}`}>
            <p className="text-sm font-medium text-white/80">
              <span className="mr-2 text-white/40" aria-hidden="true">
                →
              </span>
              {data.outcome}
            </p>
          </div>
        </GlassPanel>
      </article>
    );
  }),
);

// ============================================================
// SUB-COMPONENT — CTAButton
// Call-to-action with shimmer hover effect
// ============================================================

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  ariaLabel: string;
}

const CTAButton = memo(function CTAButton({
  children,
  href,
  ariaLabel,
}: CTAButtonProps) {
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion || !shimmerRef.current) return;

    gsap.fromTo(
      shimmerRef.current,
      { xPercent: -100 },
      {
        xPercent: 100,
        duration: ANIMATION.HOVER.DURATION * 2,
        ease: ANIMATION.HOVER.EASE,
      },
    );
  }, [prefersReducedMotion]);

  const className = `
    group relative inline-flex items-center gap-3
    overflow-hidden bg-amber-500 px-6 py-3
    text-sm font-semibold text-black
    transition-shadow duration-300
    hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]
    focus:outline-none focus:ring-2 focus:ring-amber-500
    focus:ring-offset-2 focus:ring-offset-[#0B0F19]
    sm:px-8 sm:py-4 sm:text-base
  `;

  const content = (
    <>
      <span
        ref={shimmerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent will-change-transform"
        style={{ transform: "translateX(-100%)" }}
      />
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
    >
      {content}
    </button>
  );
});

// ============================================================
// MAIN COMPONENT — AIIntegrationSection
// ============================================================

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AIIntegrationSection = memo(function AIIntegrationSection() {
  // Refs for animated elements
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<(HTMLElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();

  // Ref callback for service blocks
  const setServiceRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      servicesRef.current[index] = el;
    },
    [],
  );

  // Entrance animation effect
  useEffect(() => {
    // Collect all animated elements
    const elements = [
      headerRef.current,
      introRef.current,
      ...servicesRef.current.filter(Boolean),
      ctaRef.current,
    ].filter(Boolean) as HTMLElement[];

    // If reduced motion, ensure visibility without animation
    if (prefersReducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(elements, {
        opacity: 0,
        y: ANIMATION.ENTRANCE.Y_OFFSET,
        scale: ANIMATION.ENTRANCE.SCALE_START,
      });

      // Animate on scroll
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION.ENTRANCE.DURATION,
        stagger: ANIMATION.ENTRANCE.STAGGER,
        ease: ANIMATION.ENTRANCE.EASE,
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={CONTENT.sectionId}
      aria-labelledby="ai-section-title"
      className="relative min-h-screen overflow-hidden bg-[#0B0F19] py-16 sm:py-24 lg:py-16"
    >
      {/* ====== BACKGROUND LAYERS ====== */}
      <GridOverlay />
      <AmbientGlow />

      {/* ====== SECTION SYSTEM MARKERS ====== */}
      <SystemMarker
        text={CONTENT.systemLabel}
        position="top-left"
        showStatus
        className="hidden sm:block"
      />
      <SystemMarker
        text="SECTION::003"
        position="top-right"
        className="hidden sm:block"
      />

      {/* ====== CONTENT CONTAINER ====== */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* ====== HEADER ====== */}
        <header
          ref={headerRef}
          className="mb-12 max-w-4xl will-change-transform sm:mb-16"
        >
          <HighlightedHeadline
            text={CONTENT.headline.text}
            highlights={CONTENT.headline.highlights}
          />

          <div className="mt-6">
            <StatusIndicator text="AI SYSTEMS OPERATIONAL" />
          </div>
        </header>

        {/* ====== INTRO PANEL ====== */}
        <div
          ref={introRef}
          className="mb-16 w-full will-change-transform sm:mb-20"
        >
          <GlassPanel
            accentColor="secondary"
            systemId="CORE::OVERVIEW"
            className="p-6 pt-10 sm:p-8 sm:pt-12"
          >
            {CONTENT.intro.map((paragraph, index) => (
              <p
                key={index}
                className={`text-base leading-relaxed text-white/60 sm:text-lg ${
                  index < CONTENT.intro.length - 1 ? "mb-4" : ""
                }`}
                style={{ lineHeight: 1.7 }}
              >
                {paragraph}
              </p>
            ))}
          </GlassPanel>
        </div>

        {/* ====== SERVICES GRID ====== */}
        <div
          className="mb-16 grid gap-6 sm:mb-20 sm:gap-8 lg:grid-cols-3 lg:gap-6"
          role="list"
          aria-label="AI Services"
        >
          {CONTENT.services.map((service, index) => (
            <ServiceBlock
              key={service.id}
              ref={setServiceRef(index)}
              data={service}
            />
          ))}
        </div>

        {/* ====== CTA SECTION ====== */}
        <div
          ref={ctaRef}
          className="flex flex-col items-center gap-4 text-center will-change-transform sm:flex-row sm:justify-center sm:gap-6"
        >
          <CTAButton
            href="#contact"
            ariaLabel="Request an AI automation demo - opens contact form"
          >
            {CONTENT.cta.text}
          </CTAButton>

         
        </div>
      </div>

      {/* ====== BOTTOM DECORATIVE LINE ====== */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
      />
    </section>
  );
});

export default AIIntegrationSection;
