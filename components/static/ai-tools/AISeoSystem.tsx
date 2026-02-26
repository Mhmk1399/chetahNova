"use client";

import React, { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 CONFIGURATION & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  primary: "#F59E0B", // Amber
  secondary: "#06B6D4", // Cyan
  accent: "#6D28D9", // Violet
  bg: "#0B0F19", // Void
};

const ANIMATION_CONFIG = {
  entranceDuration: 0.6,
  stagger: 0.1,
  ease: "power2.out",
  streakDuration: 12,
};

// ─────────────────────────────────────────────────────────────────────────────
// 🧱 PRIMITIVES & UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

const SystemLabel = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => (
  <span
    aria-hidden="true"
    className={`font-mono text-[10px] tracking-widest text-white/20 select-none ${className}`}
  >
    {text}
  </span>
);

const LightStreak = ({
  color = COLORS.secondary,
  delay = 0,
}: {
  color?: string;
  delay?: number;
}) => {
  const streakRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!streakRef.current) return;
    gsap.set(streakRef.current, { xPercent: -150, opacity: 0 });

    const tl = gsap.timeline({
      repeat: -1,
      delay: delay,
      defaults: { ease: "none" },
    });

    tl.to(streakRef.current, {
      xPercent: 500,
      duration: ANIMATION_CONFIG.streakDuration,
      ease: "none",
      onStart: () => {
        gsap.set(streakRef.current, { opacity: 1 });
      },
    });
  }, []);

  return (
    <div
      ref={streakRef}
      className="absolute top-0 left-0 w-1/3 h-full pointer-events-none z-0 will-change-transform mix-blend-screen"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${color}15 50%, transparent 100%)`,
        transform: "skewX(-20deg)",
      }}
    />
  );
};

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  sysId?: string;
  accentColor?: string;
  delay?: number;
}

const GlassPanel = ({
  children,
  className = "",
  sysId = "SYS::VOID",
  accentColor = COLORS.secondary,
  delay = 0,
}: GlassPanelProps) => {
  const panelRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!panelRef.current) return;

    gsap.fromTo(
      panelRef.current,
      { y: 30, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.entranceDuration,
        delay: delay,
        ease: ANIMATION_CONFIG.ease,
        force3D: true,
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top bottom-=100", // Start animation when 100px into view
          toggleActions: "play none none reverse",
        },
      },
    );
  }, [delay]);

  return (
    <article
      ref={panelRef}
      className={`
        relative group overflow-hidden
        bg-white/[0.03] backdrop-blur-[4px] 
        border border-white/[0.08] hover:border-white/[0.15]
        transition-colors duration-500
        ${className}
      `}
      style={{ borderRadius: 0 }}
    >
      <LightStreak color={accentColor} delay={Math.random() * 5} />
      <div
        className="absolute top-0 left-0 w-full h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
      <div className="absolute top-2 left-2 z-10">
        <SystemLabel text={sysId} />
      </div>
      <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <SystemLabel text="◉ ACTIVE" className="text-emerald-500/60" />
      </div>
      <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
        {children}
      </div>
    </article>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 GLOBAL BACKGROUND (FIXED HERE)
// ─────────────────────────────────────────────────────────────────────────────

const EnvironmentGrid = () => (
  // CHANGED: 'fixed' -> 'absolute', added 'h-full w-full'
  // This ensures the background stays INSIDE this component, not over the whole screen.
  <div className="absolute inset-0 h-full w-full z-0 pointer-events-none select-none overflow-hidden bg-[#0B0F19]">
    {/* Base Grid */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(circle at center, black 40%, transparent 100%)",
      }}
    />

    {/* Ambient Light Orbs */}
    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/5 blur-[120px] animate-pulse-slow" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/3 blur-[140px]" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 📄 SECTIONS & CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const FeatureCard = ({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) => {
  const coords = useMemo(() => {
    const baseLat = 40 + ((index * 7) % 20);
    const baseLon = 2 + ((index * 11) % 10);
    return `${baseLat.toFixed(4)}°N ${baseLon.toFixed(4)}°E`;
  }, [index]);

  return (
    <GlassPanel
      sysId={`MOD::0${index + 1}`}
      delay={0.2 + index * 0.1}
      accentColor={index % 2 === 0 ? COLORS.secondary : COLORS.accent}
      className="h-full"
    >
      <div className="mt-4 mb-auto">
        <h3 className="text-xl font-semibold text-white tracking-tight mb-3">
          {title}
        </h3>
        <p className="text-base text-white/60 leading-relaxed font-light">
          {description}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-end">
        <SystemLabel text={coords} />
        <div className="w-2 h-2 bg-white/10" />
      </div>
    </GlassPanel>
  );
};

export default function AISeoSystem() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    // CHANGED: Removed 'min-h-screen'.
    // Added 'relative' to ensure absolute children stay inside.
    <section
      ref={containerRef}
      className="relative w-full bg-[#0B0F19] text-white overflow-hidden selection:bg-cyan-500/30"
    >
      <EnvironmentGrid />

      <main className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 py-24">
        {/* HEADER SECTION */}
        <div id="ai-seo-intro" className="mb-16 md:mb-24 w-full">
          <GlassPanel sysId="SYS::MAIN_V2.4" accentColor={COLORS.primary}>
            <header className="py-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 bg-amber-500" />
                <SystemLabel
                  text="INTELLIGENCE LAYER // ACTIVE"
                  className="text-amber-500/60"
                />
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter mb-8 leading-[1.1]">
                How AI Can Improve Your{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-600">
                  SEO Performance
                </span>
              </h2>

              <div className="max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed font-light">
                <p className="mb-6">
                  SEO is becoming more competitive every year. Businesses that
                  use AI-driven SEO systems gain a major advantage because they
                  can analyze data faster, produce content more efficiently, and
                  optimize continuously.
                </p>
                <p>
                  Our AI SEO solutions help businesses grow organic traffic
                  while maintaining high-quality content and technical
                  performance.
                </p>
              </div>
            </header>
          </GlassPanel>
        </div>

        {/* FEATURES GRID */}
        <div
          id="ai-seo-features"
          aria-label="AI SEO Capabilities"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          <div className=" ">
            <FeatureCard
              index={0}
              title="1. Faster Content Creation Without Losing Quality"
              description="AI helps generate structured, SEO-friendly content that matches search intent and supports keyword ranking. We ensure tone consistency across thousands of pages instantly."
            />
          </div>

          <FeatureCard
            index={1}
            title="2. Keyword Clustering & Topic Planning"
            description="AI groups keywords into content clusters, helping you build a powerful content strategy faster than manual planning. Identify gaps your competitors are missing."
          />

          <FeatureCard
            index={2}
            title="3. Automated Internal Linking"
            description="We build AI tools that suggest internal links between pages and blog posts to improve SEO authority and crawling, creating a semantic web bots love."
          />

          <FeatureCard
            index={3}
            title="4. Content Optimization & Updates"
            description="AI monitors content performance and recommends updates based on ranking changes, competitor movements, and user behavior signals."
          />

          <div className="lg:col-span-2 md:col-span-2">
            <FeatureCard
              index={4}
              title="5. SEO Reporting & Insights Dashboard"
              description="Instead of reading complex analytics reports, AI can summarize what matters and recommend actions. Get predictive insights on traffic drops before they happen."
            />
          </div>
        </div>

        {/* CTA SECTION */}
        <div id="ai-seo-cta" className="mt-16">
          <GlassPanel
            sysId="SYS::ACTION"
            accentColor={COLORS.primary}
            delay={0.8}
            className="group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 px-4">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Ready to upgrade your infrastructure?
                </h3>
                <p className="text-white/60">
                  Deploy our AI SEO module to your production environment.
                </p>
              </div>

              <button
                className="mt-6 md:mt-0 relative px-8 py-4 bg-white/5 hover:bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 text-amber-500 font-mono text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-3 overflow-hidden"
                aria-label="Get an AI SEO Growth Plan"
              >
                <span className="relative z-10">Get an AI SEO Growth Plan</span>
                <span className="relative z-10 text-lg">→</span>

                {/* Button Hover Fill Effect */}
                <div className="absolute inset-0 bg-amber-500/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 will-change-transform" />
              </button>
            </div>
          </GlassPanel>
        </div>

        {/* FOOTER SYSTEM MARKERS */}
        <div className="mt-24 border-t border-white/[0.1] pt-6 flex justify-between text-xs font-mono text-white/30">
          <span>SYS_STATUS: NOMINAL</span>
          <span>LAT: 34.0522° N // LON: 118.2437° W</span>
          <span>V.2.0.4.BETA</span>
        </div>
      </main>
    </section>
  );
}
