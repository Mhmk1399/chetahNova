"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════
// BRAND COLORS
// ════════════════════════════════════════════════════════════════════

const colors = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  dark: "#0B0F19",
  darkLighter: "#0F1420",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface CTAButton {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  icon?: React.ReactNode;
}

interface CTASectionProps {
  headline?: string;
  highlightedText?: string;
  description?: string;
  primaryButton?: CTAButton;
  secondaryButton?: CTAButton;
  showTrustBadges?: boolean;
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
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
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  ),
  quote: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8M8 13h6" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  zap: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultPrimaryButton: CTAButton = {
  label: "Book a Free Consultation",
  href: "/contact",
  variant: "primary",
  icon: Icons.calendar,
};

const defaultSecondaryButton: CTAButton = {
  label: "Get a Quote",
  href: "/quote",
  variant: "secondary",
  icon: Icons.quote,
};

// ════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND
// ════════════════════════════════════════════════════════════════════

const AnimatedBackground = memo(function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;

    const orbs = bgRef.current.querySelectorAll(".floating-orb");

    const ctx = gsap.context(() => {
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          scale: "random(0.9, 1.1)",
          duration: "random(4, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.5,
        });
      });
    }, bgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={bgRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Base Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            ${colors.dark} 0%, 
            ${colors.darkLighter} 50%, 
            ${colors.dark} 100%
          )`,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating Orbs */}
      <div
        className="floating-orb absolute left-1/4 top-0 h-125 w-125 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="floating-orb absolute right-1/4 top-1/2 h-100 w-100 translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}12 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="floating-orb absolute bottom-0 left-1/2 h-150 w-150 -translate-x-1/2 translate-y-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.accent}10 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Animated Lines */}
      <div
        className="absolute left-0 top-1/4 h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.primary}20, transparent)`,
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-0 top-3/4 h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.secondary}15, transparent)`,
          animation: "pulse 4s ease-in-out infinite 2s",
        }}
      />

      {/* Corner Decorations */}
      <div className="absolute left-8 top-8 md:left-12 md:top-12">
        <div
          className="h-24 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}50, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-px w-24"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}50, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-3 w-3 rotate-45 border-2"
          style={{ borderColor: colors.primary, backgroundColor: colors.dark }}
        />
      </div>

      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <div
          className="h-24 w-px"
          style={{
            background: `linear-gradient(0deg, ${colors.accent}40, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-px w-24"
          style={{
            background: `linear-gradient(270deg, ${colors.accent}40, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-3 w-3 rotate-45 border-2"
          style={{ borderColor: colors.accent, backgroundColor: colors.dark }}
        />
      </div>

      {/* Sparkles */}
      <div
        className="absolute left-[15%] top-[20%] h-2 w-2"
        style={{
          color: colors.primary,
          animation: "twinkle 3s ease-in-out infinite",
        }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="absolute right-[20%] top-[30%] h-3 w-3"
        style={{
          color: colors.secondary,
          animation: "twinkle 3s ease-in-out infinite 1s",
        }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="absolute bottom-[25%] left-[25%] h-2 w-2"
        style={{
          color: colors.accent,
          animation: "twinkle 3s ease-in-out infinite 2s",
        }}
      >
        {Icons.sparkle}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TRUST BADGES
// ════════════════════════════════════════════════════════════════════

const TrustBadges = memo(function TrustBadges() {
  const badges = [
    { icon: Icons.shield, label: "Secure Process", color: colors.secondary },
    { icon: Icons.clock, label: "Quick Response", color: colors.primary },
    { icon: Icons.zap, label: "Fast Delivery", color: colors.accent },
  ];

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-sm text-white/50"
        >
          <span className="h-4 w-4" style={{ color: badge.color }}>
            {badge.icon}
          </span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA BUTTON
// ════════════════════════════════════════════════════════════════════

const CTAButtonComponent = memo(function CTAButtonComponent({
  button,
  index,
}: {
  button: CTAButton;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const isPrimary = button.variant === "primary";

  return (
    <Link
      href={button.href}
      className="group relative flex items-center justify-center gap-3 overflow-hidden px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-500 md:px-10 md:py-5"
      style={{
        backgroundColor: isPrimary ? colors.primary : "transparent",
        border: isPrimary ? "none" : `1px solid ${colors.primary}40`,
        color: isPrimary ? colors.dark : colors.primary,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered
          ? isPrimary
            ? `0 20px 40px -10px ${colors.primary}50`
            : `0 20px 40px -10px ${colors.primary}20`
          : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      {button.icon && (
        <span
          className="h-5 w-5 transition-transform duration-300"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          {button.icon}
        </span>
      )}

      {/* Label */}
      <span className="relative z-10">{button.label}</span>

      {/* Arrow */}
      <span
        className="h-5 w-5 transition-transform duration-300"
        style={{
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
        }}
      >
        {Icons.arrow}
      </span>

      {/* Shine Effect */}
      <span
        className="absolute inset-0 -translate-x-full skew-x-12 transition-transform duration-700 group-hover:translate-x-full"
        style={{
          background: isPrimary
            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
            : `linear-gradient(90deg, transparent, ${colors.primary}15, transparent)`,
        }}
      />

      {/* Hover Fill for Secondary */}
      {!isPrimary && (
        <span
          className="absolute inset-0 origin-left transition-transform duration-500"
          style={{
            backgroundColor: `${colors.primary}10`,
            transform: isHovered ? "scaleX(1)" : "scaleX(0)",
          }}
        />
      )}

      {/* Corner Accents */}
      <span
        className="absolute left-0 top-0 h-2 w-2 border-l border-t transition-colors duration-300"
        style={{
          borderColor: isPrimary
            ? isHovered
              ? "rgba(0,0,0,0.3)"
              : "rgba(0,0,0,0.15)"
            : isHovered
              ? colors.primary
              : `${colors.primary}50`,
        }}
      />
      <span
        className="absolute bottom-0 right-0 h-2 w-2 border-b border-r transition-colors duration-300"
        style={{
          borderColor: isPrimary
            ? isHovered
              ? "rgba(0,0,0,0.3)"
              : "rgba(0,0,0,0.15)"
            : isHovered
              ? colors.primary
              : `${colors.primary}50`,
        }}
      />
    </Link>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const CTASection: React.FC<CTASectionProps> = ({
  headline = "Ready to Build a Website That Works Like a",
  highlightedText = "Sales Machine?",
  description = "Let's build your website with modern design, advanced SEO, and custom AI tools that automate your business and generate customers 24/7.",
  primaryButton = defaultPrimaryButton,
  secondaryButton = defaultSecondaryButton,
  showTrustBadges = true,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP Animation
  useEffect(() => {
    if (!contentRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const elements = contentRef.current?.querySelectorAll(".cta-anim");
      if (!elements || elements.length === 0) return;

      gsap.fromTo(
        elements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: colors.dark }}
    >
      <AnimatedBackground />

      {/* Content Container */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        {/* Label */}
        <div className="cta-anim mb-6 flex items-center justify-center gap-3">
          <span
            className="h-px w-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.primary})`,
            }}
          />
          <span
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: colors.primary }}
          >
            <span className="h-3 w-3">{Icons.sparkle}</span>
            Let's Get Started
          </span>
          <span
            className="h-px w-12"
            style={{
              background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
            }}
          />
        </div>

        {/* Headline */}
        <h2 className="cta-anim mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl xl:text-6xl">
          {headline}{" "}
          <span
            className="relative bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
            }}
          >
            {highlightedText}

            {/* Underline Effect */}
            <span
              className="absolute -bottom-2 left-0 h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                opacity: 0.5,
              }}
            />
          </span>
        </h2>

        {/* Description */}
        <p className="cta-anim mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          {description}
        </p>

        {/* Buttons */}
        <div className="cta-anim flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <CTAButtonComponent button={primaryButton} index={0} />
          <CTAButtonComponent button={secondaryButton} index={1} />
        </div>

        {/* Trust Badges */}
        {showTrustBadges && (
          <div className="cta-anim">
            <TrustBadges />
          </div>
        )}

        {/* No Commitment Text */}
        <p className="cta-anim mt-8 flex items-center justify-center gap-2 text-sm text-white/40">
          <span className="h-4 w-4" style={{ color: colors.secondary }}>
            {Icons.check}
          </span>
          Free consultation • No commitment • Quick response
        </p>
      </div>

      {/* Bottom Gradient Line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${colors.primary}50 25%, ${colors.secondary}50 50%, ${colors.accent}50 75%, transparent 100%)`,
        }}
      />
    </section>
  );
};

export default memo(CTASection);
export type { CTASectionProps, CTAButton };
