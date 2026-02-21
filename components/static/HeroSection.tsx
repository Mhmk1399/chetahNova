// components/hero-section/HeroSection.tsx
"use client";

import { useEffect, useRef, useMemo } from "react";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

/* ════════════════════════════════════════
   PARTICLE GENERATORS (همان قبلی)
════════════════════════════════════════ */
function generateParticles(count: number) {
  const particles: {
    angle: number;
    radiusOffset: number;
    size: number;
    opacity: number;
    layer: number;
  }[] = [];
  const phi = 137.508;
  for (let i = 0; i < count; i++) {
    const angle = (i * phi) % 360;
    const radiusOffset = Number((Math.sin(i * 0.5) * 12 + Math.cos(i * 0.3) * 8).toFixed(4));
    const size = Number((0.4 + ((i * 7) % 18) / 10).toFixed(2));
    const opacity = Number((0.15 + ((i * 13) % 10) / 10).toFixed(2));
    const layer = i % 4;
    particles.push({ angle, radiusOffset, size, opacity, layer });
  }
  return particles;
}

function generateInnerParticles(count: number) {
  const particles: {
    angle: number;
    radius: number;
    size: number;
    opacity: number;
  }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 360) / count + ((i * 17) % 30);
    const radius = 50 + ((i * 11) % 35);
    const size = Number((0.25 + ((i * 5) % 10) / 10).toFixed(2));
    const opacity = Number((0.1 + ((i * 7) % 6) / 10).toFixed(2));
    particles.push({ angle, radius, size, opacity });
  }
  return particles;
}

function generateOuterParticles(count: number) {
  const particles: {
    angle: number;
    radius: number;
    size: number;
    opacity: number;
  }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 222.5) % 360;
    const radius = 150 + ((i * 13) % 25);
    const size = Number((0.3 + ((i * 3) % 8) / 10).toFixed(2));
    const opacity = Number((0.08 + ((i * 9) % 5) / 10).toFixed(2));
    particles.push({ angle, radius, size, opacity });
  }
  return particles;
}

const MAIN_PARTICLES = generateParticles(200);
const INNER_PARTICLES = generateInnerParticles(45);
const OUTER_PARTICLES = generateOuterParticles(70);
const RING_RADIUS = 125;

/* ════════════════════════════════════════
   ATOMS (مشابه TrustBar)
════════════════════════════════════════ */
const TealDot = ({
  size = 6,
  pulse = false,
}: {
  size?: number;
  pulse?: boolean;
}) => (
  <span
    className="relative inline-flex shrink-0"
    style={{ width: size, height: size }}
  >
    {pulse && (
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "#30C0C044",
          animation: "ping 2s cubic-bezier(0,0,.2,1) infinite",
        }}
      />
    )}
    <span
      className="relative rounded-full block"
      style={{
        width: size,
        height: size,
        background: "#30C0C0",
        boxShadow: `0 0 ${size + 2}px #30C0C0, 0 0 ${size * 3}px #30C0C044`,
      }}
    />
  </span>
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
      className={`absolute w-2.5 h-2.5 pointer-events-none ${map[pos]}`}
      style={{ borderColor: "rgba(48,192,192,0.4)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function HeroSection({
  title = "AI-Powered Web Design & SEO That Turns Visitors Into Customers",
  subtitle = "We build high-converting websites, advanced SEO systems, and custom AI automation tools tailored to your business, so your website becomes a growth machine, not just an online brochure.",
}: HeroSectionProps) {
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const mainParticleElements = useMemo(() => {
    return MAIN_PARTICLES.map((p, i) => {
      const rad = ((p.angle - 90) * Math.PI) / 180;
      const r = RING_RADIUS + p.radiusOffset;
      const cx = Number((180 + r * Math.cos(rad)).toFixed(4));
      const cy = Number((180 + r * Math.sin(rad)).toFixed(4));
      const pulseClass = p.layer === 0 ? styles.particlePulse : "";
      return (
        <circle
          key={`main-${i}`}
          cx={cx}
          cy={cy}
          r={p.size}
          fill={`rgba(48, 192, 192, ${p.opacity})`}
          className={pulseClass || undefined}
        />
      );
    });
  }, []);

  const innerParticleElements = useMemo(() => {
    return INNER_PARTICLES.map((p, i) => {
      const rad = ((p.angle - 90) * Math.PI) / 180;
      const cx = Number((180 + p.radius * Math.cos(rad)).toFixed(4));
      const cy = Number((180 + p.radius * Math.sin(rad)).toFixed(4));
      return (
        <circle
          key={`inner-${i}`}
          cx={cx}
          cy={cy}
          r={p.size}
          fill={`rgba(48, 160, 208, ${p.opacity})`}
        />
      );
    });
  }, []);

  const outerParticleElements = useMemo(() => {
    return OUTER_PARTICLES.map((p, i) => {
      const rad = ((p.angle - 90) * Math.PI) / 180;
      const cx = Number((180 + p.radius * Math.cos(rad)).toFixed(4));
      const cy = Number((180 + p.radius * Math.sin(rad)).toFixed(4));
      return (
        <circle
          key={`outer-${i}`}
          cx={cx}
          cy={cy}
          r={p.size}
          fill={`rgba(48, 192, 192, ${p.opacity})`}
        />
      );
    });
  }, []);

  const features = [
    "Custom Website Design for Any Industry",
    "SEO That Ranks You on Google & Drives Organic Leads",
    "AI Automation Tools Built for Your Business Workflow",
  ];

  return (
    <section
      className={`${styles.hero} relative w-full overflow-hidden`}
      aria-label="Hero section"
    >
      {/* ── Background Layers ── */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      {/* ── Floating Elements ── */}
      <div className={styles.floatingElements} aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={styles.floatingDot}
            style={{
              left: `${10 + ((i * 23) % 80)}%`,
              top: `${15 + ((i * 19) % 70)}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${18 + (i % 8)}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen px-5 sm:px-10 lg:px-16 py-20 sm:py-24 gap-0">
        {/* ══════════════════════════════════════════
             ORB SCENE (همان قبلی با تغییرات جزئی)
        ═══════════════════════════════════════════ */}
        <div
          className={`${styles.sceneWrapper} relative flex items-center justify-center w-full`}
        >
          {/* ═══ LEFT PANEL ═══ */}
          <div
            className={`${styles.servicePanel} ${styles.servicePanelLeft}`}
            aria-hidden="true"
          >
            <div className={styles.panelCard}>
              <Bracket pos="tl" />
              <Bracket pos="tr" />
              <Bracket pos="bl" />
              <Bracket pos="br" />

              <div className={styles.panelHeader}>
                <div className={styles.tagBadge}>
                  <TealDot size={3} />
                  <span className={styles.tagText}>DESIGN</span>
                </div>
                <span className={styles.panelIndex}>01</span>
              </div>

              <div className={styles.codeEditor}>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>1</span>
                  <span className={styles.codeKeyword}>import</span>
                  <span className={styles.codeText}>
                    {" "}
                    {"{"} Design {"}"}
                  </span>
                  <span className={styles.codeKeyword}>from</span>
                  <span className={styles.codeString}> 'cheetahNova'</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>2</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>3</span>
                  <span className={styles.codeKeyword}>const</span>
                  <span className={styles.codeFunc}> website</span>
                  <span className={styles.codeText}> = </span>
                  <span className={styles.codeKeyword}>new</span>
                  <span className={styles.codeFunc}> Design</span>
                  <span className={styles.codeText}>()</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>4</span>
                  <span className={styles.codeText}> .responsive()</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>5</span>
                  <span className={styles.codeText}> .modern()</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>6</span>
                  <span className={styles.codeText}> .converting()</span>
                  <span className={styles.cursor}>|</span>
                </div>
              </div>

              <div className={styles.browserPreview}>
                <div className={styles.browserBar}>
                  <div className={styles.browserDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.browserUrl}>
                    <span className={styles.lockIcon}>🔒</span>
                    <span>yoursite.com</span>
                  </div>
                </div>
                <div className={styles.browserContent}>
                  <div className={styles.browserNav} />
                  <div className={styles.browserHero}>
                    <div className={styles.browserTitle} />
                    <div className={styles.browserText} />
                    <div className={styles.browserBtn} />
                  </div>
                </div>
              </div>

              <div className={styles.serviceLabel}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 9h6M9 13h6M9 17h4" />
                </svg>
                <span>Web Design</span>
              </div>

              <div className={styles.cardBottomLine} />
            </div>

            <div className={styles.connectionLine}>
              <div className={styles.connectionDot} />
              <div className={styles.connectionPath} />
            </div>
          </div>

          {/* ═══ RIGHT PANEL ═══ */}
          <div
            className={`${styles.servicePanel} ${styles.servicePanelRight}`}
            aria-hidden="true"
          >
            <div className={styles.panelCard}>
              <Bracket pos="tl" />
              <Bracket pos="tr" />
              <Bracket pos="bl" />
              <Bracket pos="br" />

              <div className={styles.panelHeader}>
                <div className={styles.tagBadge}>
                  <TealDot size={3} />
                  <span className={styles.tagText}>GROWTH</span>
                </div>
                <span className={styles.panelIndex}>02</span>
              </div>

              <div className={styles.seoSection}>
                <div className={styles.searchBar}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <span className={styles.searchText}>your business</span>
                  <span className={styles.searchCursor}>|</span>
                </div>

                <div className={styles.rankings}>
                  <div className={`${styles.rankItem} ${styles.rankFirst}`}>
                    <span className={styles.rankPosition}>#1</span>
                    <span className={styles.rankSite}>yoursite.com</span>
                    <span className={styles.rankBadge}>⭐ TOP</span>
                  </div>
                  <div className={styles.rankItem}>
                    <span className={styles.rankPosition}>#2</span>
                    <span className={styles.rankSite}>competitor1.com</span>
                  </div>
                  <div className={styles.rankItem}>
                    <span className={styles.rankPosition}>#3</span>
                    <span className={styles.rankSite}>competitor2.com</span>
                  </div>
                </div>
              </div>

              <div className={styles.aiSection}>
                <div className={styles.aiHeader}>
                  <div className={styles.aiIcon}>
                    <div className={styles.aiCore} />
                    <div className={styles.aiRing} />
                  </div>
                  <span>AI Processing</span>
                  <span className={styles.aiStatus}>ACTIVE</span>
                </div>

                <div className={styles.aiTasks}>
                  <div className={styles.aiTask}>
                    <span className={styles.taskCheck}>✓</span>
                    <span>Content Optimization</span>
                  </div>
                  <div className={styles.aiTask}>
                    <span className={styles.taskCheck}>✓</span>
                    <span>Keyword Analysis</span>
                  </div>
                  <div className={`${styles.aiTask} ${styles.taskActive}`}>
                    <span className={styles.taskSpinner} />
                    <span>Lead Generation</span>
                  </div>
                </div>

                <div className={styles.growthChart}>
                  <div className={styles.chartLabel}>Traffic Growth</div>
                  <svg viewBox="0 0 100 30" className={styles.chartSvg}>
                    <path
                      d="M0 28 Q15 25, 25 22 T45 15 T65 10 T85 5 T100 2"
                      stroke="url(#growthGradient)"
                      strokeWidth="2"
                      fill="none"
                      className={styles.chartLine}
                    />
                    <defs>
                      <linearGradient
                        id="growthGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#30c0c0" />
                        <stop offset="100%" stopColor="#60e8e8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className={styles.chartValue}>+247%</div>
                </div>
              </div>

              <div className={styles.serviceLabel}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <span>SEO & AI</span>
              </div>

              <div className={styles.cardBottomLine} />
            </div>

            <div
              className={`${styles.connectionLine} ${styles.connectionLineRight}`}
            >
              <div className={styles.connectionPath} />
              <div className={styles.connectionDot} />
            </div>
          </div>

          {/* ── Glass Panel ── */}
          <div className={styles.glassPanel} aria-hidden="true" />

          {/* ── Orb Container ── */}
          <div
            className={`${styles.orbContainer} relative flex items-center justify-center`}
          >
            <div className={styles.orbOuterGlow} aria-hidden="true" />

            <svg
              width="400"
              height="400"
              viewBox="0 0 360 360"
              className={`${styles.particleRingOuter} absolute`}
              aria-hidden="true"
            >
              {outerParticleElements}
            </svg>

            <svg
              width="400"
              height="400"
              viewBox="0 0 360 360"
              className={`${styles.particleRing} absolute`}
              aria-hidden="true"
            >
              <circle
                cx="180"
                cy="180"
                r={RING_RADIUS}
                stroke="rgba(48,192,192,0.08)"
                strokeWidth="1"
                fill="none"
              />
              <circle
                cx="180"
                cy="180"
                r={RING_RADIUS + 18}
                stroke="rgba(48,160,208,0.05)"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2 8"
              />
              <circle
                cx="180"
                cy="180"
                r={RING_RADIUS - 18}
                stroke="rgba(48,192,192,0.04)"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="1 6"
              />
              {mainParticleElements}
            </svg>

            <svg
              width="400"
              height="400"
              viewBox="0 0 360 360"
              className={`${styles.particleRingInner} absolute`}
              aria-hidden="true"
            >
              {innerParticleElements}
            </svg>

            <div className={styles.energyRing} aria-hidden="true" />

            <div className={styles.satelliteWrapper} aria-hidden="true">
              <div className={styles.satellite}>
                <div className={styles.satelliteGlow} />
              </div>
            </div>

            <div className={styles.satelliteWrapper2} aria-hidden="true">
              <div className={styles.satellite2} />
            </div>

            <div className={styles.orbBloom} aria-hidden="true" />

            {/* ═══ BRAND LOGO ═══ */}
            <div className={styles.brandContainer} aria-label="CheetahNova">
              <div className={styles.brandGlow} aria-hidden="true" />

              <div className={styles.brandLogo}>
                <div className={styles.brandIconWrapper}>
                  <svg
                    viewBox="0 0 44 44"
                    className={styles.brandIcon}
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="speedGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#a0f8f8" />
                        <stop offset="50%" stopColor="#40d8d8" />
                        <stop offset="100%" stopColor="#1898a8" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M8 30 Q14 22, 22 22 T36 14"
                      stroke="url(#speedGrad)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 24 Q18 18, 26 18 T38 12"
                      stroke="url(#speedGrad)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                    <circle cx="36" cy="14" r="4" fill="url(#speedGrad)" />
                    <circle cx="38" cy="12" r="1.5" fill="#c0ffff" />
                  </svg>
                </div>

                <span className={styles.brandCheetah}>CHEETAH</span>
                <span className={styles.brandNova}>NOVA</span>
              </div>

              <div className={styles.brandUnderline} aria-hidden="true">
                <div className={styles.underlineLeft} />
                <div className={styles.underlineDiamond} />
                <div className={styles.underlineRight} />
              </div>

              <div className={styles.brandTagline}>
                <span>DIGITAL VELOCITY</span>
              </div>
            </div>

            <div className={styles.brandRing} aria-hidden="true" />
            <div className={styles.brandRingOuter} aria-hidden="true" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
             TEXT CONTENT (استایل جدید TrustBar)
        ═══════════════════════════════════════════════════════════════ */}
        <div className={`${styles.textBlock} w-full max-w-4xl mx-auto`}>
          {/* Section Label */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <TealDot size={5} pulse />
            <span
              className="font-mono text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "#30C0C0", opacity: 0.8 }}
            >
              AI-Powered Growth Systems
            </span>
          </div>

          {/* Title */}
          {title && (
            <h1
              className="font-mono text-center leading-tight mb-4"
              style={{
                fontSize: "clamp(22px, 4.5vw, 44px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              {title.split("Visitors Into Customers")[0]}
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 28px rgba(48,192,192,0.4)",
                }}
              >
                Visitors Into Customers
              </span>
            </h1>
          )}

          {/* Divider */}
          <div className={styles.sectionDivider}>
            <div className={styles.dividerLine} />
            <div className={styles.dividerNode}>
              <TealDot size={6} />
            </div>
            <div className={styles.dividerLine} />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="font-mono text-center leading-relaxed max-w-2xl mx-auto mb-8"
              style={{
                fontSize: "clamp(12px, 1.5vw, 14px)",
                color: "#3A6070",
                letterSpacing: "0.01em",
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Features List */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 max-w-3xl mx-auto"
            role="list"
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`${styles.featureCard} relative`}
                role="listitem"
              >
                <Bracket pos="tl" />
                <Bracket pos="br" />

                <div className="flex items-center gap-2.5 mb-2">
                  <div className={styles.tagBadge}>
                    <TealDot size={3} />
                    <span className={styles.tagText}>
                      {idx === 0 ? "DESIGN" : idx === 1 ? "SEO" : "AI"}
                    </span>
                  </div>
                  <span
                    className="font-mono text-[8px] tracking-[0.15em]"
                    style={{ color: "#1A3848" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="shrink-0 mt-0.5"
                    style={{ color: "#30C0C0" }}
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.4"
                    />
                    <path
                      d="M5.5 8L7 9.5L10.5 6"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="font-mono text-[11px] leading-snug"
                    style={{ color: "#5A8898", letterSpacing: "0.01em" }}
                  >
                    {feature}
                  </span>
                </div>

                <div className={styles.cardBottomLine} />
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className={styles.ctaRow}>
            <a
              href="#contact"
              className={`${styles.ctaPrimary} relative flex items-center gap-2`}
            >
              <Bracket pos="tl" />
              <Bracket pos="tr" />
              <Bracket pos="bl" />
              <Bracket pos="br" />
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase">
                Get a Free Strategy Call
              </span>
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href="#portfolio"
              className={`${styles.ctaSecondary} relative flex items-center gap-2`}
            >
              <Bracket pos="tl" />
              <Bracket pos="br" />
              <span
                className="font-mono text-[10px] tracking-[0.18em] uppercase"
                style={{ color: "#7ABFCF" }}
              >
                View Our Work
              </span>
            </a>
          </div>

          {/* Bottom Strip */}
          <div className={styles.bottomStrip}>
            <div className={styles.bottomLine} aria-hidden="true" />
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {["No contracts", "Results-focused", "Free consultation"].map(
                (text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <TealDot size={4} />
                    <span
                      className="font-mono text-[9px] tracking-[0.18em] uppercase"
                      style={{ color: "#1E4858" }}
                    >
                      {text}
                    </span>
                  </div>
                ),
              )}
            </div>
            <div className={styles.bottomLine} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
