// components/cta-section/CTASection.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./CTASection.module.css";

/* ════════════════════════════════════════
   PARTICLE GENERATOR
════════════════════════════════════════ */
function generateParticles(count: number) {
  const particles: {
    x: number;
    y: number;
    size: number;
    opacity: number;
    delay: number;
  }[] = [];
  for (let i = 0; i < count; i++) {
    // Use deterministic values based on index to avoid hydration mismatch
    const x = Number(((i * 17.23 + i * i * 3.7) % 100).toFixed(2));
    const y = Number(((i * 23.17 + i * i * 5.3) % 100).toFixed(2));
    const size = Number((0.5 + ((i * 7) % 15) / 10).toFixed(2));
    const opacity = Number((0.1 + ((i * 13) % 30) / 100).toFixed(2));
    const delay = Number(((i * 17) % 50) / 10).toFixed(2);
    particles.push({ x, y, size, opacity, delay: Number(delay) });
  }
  return particles;
}

const PARTICLES = generateParticles(30);

/* ════════════════════════════════════════
   ATOMS
════════════════════════════════════════ */
const TealDot = ({
  size = 6,
  pulse = false,
  color = "#30C0C0",
}: {
  size?: number;
  pulse?: boolean;
  color?: string;
}) => (
  <span
    className="relative inline-flex shrink-0"
    style={{ width: size, height: size }}
  >
    {pulse && (
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: `${color}44`,
          animation: "ping 2s cubic-bezier(0,0,.2,1) infinite",
        }}
      />
    )}
    <span
      className="relative rounded-full block"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size + 2}px ${color}, 0 0 ${size * 3}px ${color}44`,
      }}
    />
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2.5">
    <TealDot size={5} pulse />
    <span
      className="font-mono text-[10px] tracking-[0.28em] uppercase"
      style={{ color: "#30C0C0", opacity: 0.8 }}
    >
      {children}
    </span>
  </div>
);

const Bracket = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const map = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`absolute w-3 h-3 pointer-events-none ${map[pos]}`}
      style={{ borderColor: "rgba(48,192,192,0.5)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   DECORATIVE ORB
════════════════════════════════════════ */
const DecorativeOrb = ({ side }: { side: "left" | "right" }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * 360;
      const rad = ((angle - 90) * Math.PI) / 180;
      const r = 45;
      const x = Number((50 + r * Math.cos(rad)).toFixed(4));
      const y = Number((50 + r * Math.sin(rad)).toFixed(4));
      const size = Number((0.8 + (i % 3) * 0.3).toFixed(2));
      const opacity = Number((0.2 + (i % 4) * 0.1).toFixed(2));
      return { x, y, size, opacity };
    });
  }, []);

  return (
    <div
      className={`${styles.decorativeOrb} ${styles[`orb${side.charAt(0).toUpperCase() + side.slice(1)}`]}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id={`orbGrad${side}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#30C0C0" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(48,192,192,0.1)"
          strokeWidth="0.5"
          strokeDasharray="2 6"
          fill="none"
          className={styles.orbRing}
        />

        {/* Particles */}
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill="#30C0C0"
            opacity={p.opacity}
          />
        ))}

        {/* Core */}
        <circle cx="50" cy="50" r="30" fill={`url(#orbGrad${side})`} />

        {/* Center */}
        <circle cx="50" cy="50" r="3" fill="#50C8D0" opacity="0.6" />
      </svg>
    </div>
  );
};

/* ════════════════════════════════════════
   FLOATING PARTICLES
════════════════════════════════════════ */
const FloatingParticles = () => (
  <div className={styles.floatingParticles} aria-hidden="true">
    {PARTICLES.map((p, i) => (
      <div
        key={i}
        className={styles.particle}
        style={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size,
          height: p.size,
          opacity: p.opacity,
          animationDelay: `${p.delay}s`,
        }}
      />
    ))}
  </div>
);

/* ════════════════════════════════════════
   GRID LINES (animated)
════════════════════════════════════════ */
const AnimatedGrid = () => (
  <div className={styles.animatedGrid} aria-hidden="true">
    <div className={styles.gridLineH} style={{ top: "25%" }} />
    <div className={styles.gridLineH} style={{ top: "50%" }} />
    <div className={styles.gridLineH} style={{ top: "75%" }} />
    <div className={styles.gridLineV} style={{ left: "25%" }} />
    <div className={styles.gridLineV} style={{ left: "50%" }} />
    <div className={styles.gridLineV} style={{ left: "75%" }} />
  </div>
);

/* ════════════════════════════════════════
   CTA BUTTON
════════════════════════════════════════ */
const CTAButton = ({
  href,
  variant,
  children,
  icon,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className={`${styles.ctaButton} ${styles[`cta${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* Button glow */}
      <div className={styles.buttonGlow} style={{ opacity: hovered ? 1 : 0 }} />

      {/* Scan line */}
      <div
        className={styles.buttonScan}
        style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
      />

      {/* Content */}
      <div className={styles.buttonContent}>
        {icon && <span className={styles.buttonIcon}>{icon}</span>}
        <span className={styles.buttonText}>{children}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={styles.buttonArrow}
          style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Status indicator */}
      <div className={styles.buttonStatus}>
        <TealDot
          size={4}
          pulse={hovered}
          color={variant === "primary" ? "#60E8E8" : "#30C0C0"}
        />
      </div>
    </a>
  );
};

/* ════════════════════════════════════════
   TRUST BADGES
════════════════════════════════════════ */
const TrustBadges = () => {
  const badges = [
    { icon: "🔒", text: "SSL Secured" },
    { icon: "⚡", text: "Fast Response" },
    { icon: "✓", text: "No Obligation" },
  ];

  return (
    <div className={styles.trustBadges}>
      {badges.map((badge, i) => (
        <div key={i} className={styles.trustBadge}>
          <span className={styles.badgeIcon}>{badge.icon}</span>
          <span className={styles.badgeText}>{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="cta-heading"
    >
      {/* Background layers */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      {/* Animated elements */}
      <AnimatedGrid />
      <FloatingParticles />

      {/* Decorative orbs */}
      <DecorativeOrb side="left" />
      <DecorativeOrb side="right" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        {/* ══ MAIN CARD ══ */}
        <div
          className={`${styles.ctaCard} ${isVisible ? styles.ctaCardVisible : ""} relative`}
        >
          <Bracket pos="tl" />
          <Bracket pos="tr" />
          <Bracket pos="bl" />
          <Bracket pos="br" />

          {/* Card glow */}
          <div className={styles.cardGlow} aria-hidden="true" />

          {/* Top scan line */}
          <div className={styles.cardScanTop} aria-hidden="true" />

          {/* Content */}
          <div className={styles.cardContent}>
            {/* Label */}
            <div className="flex justify-center mb-6">
              <SectionLabel>Let's Work Together</SectionLabel>
            </div>

            {/* Heading */}
            <h2
              id="cta-heading"
              className="font-mono text-center leading-tight mb-6"
              style={{
                fontSize: "clamp(24px, 4.5vw, 44px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              Ready to Build a Website That
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 40px rgba(48,192,192,0.5)",
                }}
              >
                Works Like a Sales Machine?
              </span>
            </h2>

            {/* Divider */}
            <div className={styles.headingDivider}>
              <div className={styles.dividerLine} />
              <div className={styles.dividerNode}>
                <TealDot size={6} pulse />
              </div>
              <div className={styles.dividerLine} />
            </div>

            {/* Description */}
            <p
              className="font-mono text-center leading-relaxed max-w-2xl mx-auto mb-10"
              style={{
                fontSize: "clamp(12px, 1.4vw, 14px)",
                color: "#3A6070",
                letterSpacing: "0.02em",
              }}
            >
              Let's build your website with modern design, advanced SEO, and
              custom AI tools that automate your business and generate customers
              24/7.
            </p>

            {/* CTA Buttons */}
            <div className={styles.buttonGroup}>
              <CTAButton
                href="#consultation"
                variant="primary"
                icon={
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <path
                      d="M17 10c0 3.866-3.134 7-7 7a6.97 6.97 0 01-4-1.25L3 17l1.25-3A6.97 6.97 0 013 10c0-3.866 3.134-7 7-7s7 3.134 7 7z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7 9h6M7 12h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              >
                Book a Free Consultation
              </CTAButton>

              <CTAButton
                href="#quote"
                variant="secondary"
                icon={
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <rect
                      x="3"
                      y="3"
                      width="14"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7 8h6M7 11h4M7 14h5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              >
                Get a Quote
              </CTAButton>
            </div>

            {/* Trust badges */}
            <TrustBadges />

            {/* Bottom info */}
            <div className={styles.bottomInfo}>
              <div className={styles.infoLine} />
              <div className={styles.infoContent}>
                {[
                  { label: "Response Time", value: "< 24hrs" },
                  { label: "Consultation", value: "Free" },
                  { label: "Projects Completed", value: "150+" },
                ].map((item, i) => (
                  <React.Fragment key={item.label}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoValue}>{item.value}</span>
                      <span className={styles.infoLabel}>{item.label}</span>
                    </div>
                    {i < 2 && <div className={styles.infoSeparator} />}
                  </React.Fragment>
                ))}
              </div>
              <div className={styles.infoLine} />
            </div>
          </div>

          {/* Bottom line */}
          <div className={styles.cardBottomLine} aria-hidden="true" />
        </div>

        {/* ══ ADDITIONAL INFO ══ */}
        <div className={styles.additionalInfo}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Worldwide service · Remote collaboration
            </span>
          </div>
          <div className={styles.infoLine} />
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              {new Date().getFullYear()} · CheetahNova
            </span>
            <TealDot size={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
