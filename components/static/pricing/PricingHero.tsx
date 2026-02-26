/**
 * @file PricingHero.tsx
 * @description
 * "Engineered Atmosphere" Pricing Hero.
 *
 * ARCHITECTURE:
 * - Standalone: No tailwind.config.js dependencies.
 * - Visuals: Uses arbitrary values (e.g., bg-[#0B0F19]) for the "Void" palette.
 * - Motion: GSAP-driven entrance and atmospheric loops.
 * - Icons: React Icons (Feather + Simple Icons).
 */

"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ICONS
// Fi: Feather Icons (Structural/UI) - chosen for thin 1px strokes
// Si: Simple Icons (Brands) - chosen for realism
import {
  FiArrowRight,
  FiTerminal,
  FiCpu,
  FiShield,
  FiActivity,
  FiCode,
} from "react-icons/fi";
import { SiNextdotjs, SiVercel, SiStripe, SiOpenai } from "react-icons/si";

// Register GSAP safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

// -----------------------------------------------------------------------------
// 🎨 DESIGN TOKENS (Internal Constants for Consistency)
// -----------------------------------------------------------------------------
const COLORS = {
  VOID: "#0B0F19", // Deep Navy Background
  VOID_LIGHT: "#131825", // Surface Level
  AMBER: "#F59E0B", // Action / Energy
  CYAN: "#06B6D4", // Data / Tech
  VIOLET: "#6D28D9", // Atmosphere
  WHITE_10: "rgba(255, 255, 255, 0.1)",
  WHITE_05: "rgba(255, 255, 255, 0.05)",
  WHITE_02: "rgba(255, 255, 255, 0.02)",
};

// -----------------------------------------------------------------------------
// 🧱 MICRO-COMPONENTS
// -----------------------------------------------------------------------------

/**
 * SystemLabel
 * Renders technical monospace text for the "HUD" aesthetic.
 */
const SystemLabel = ({
  children,
  className = "",
  color = "text-white/30",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) => (
  <div
    className={`font-mono text-[10px] tracking-[0.2em] uppercase select-none flex items-center gap-2 ${color} ${className}`}
  >
    {children}
  </div>
);

// -----------------------------------------------------------------------------
// 🚀 MAIN COMPONENT
// -----------------------------------------------------------------------------

export default function PricingHero() {
  const container = useRef<HTMLElement>(null);

  // Animation Targets
  const glassPanel = useRef<HTMLDivElement>(null);
  const reflection = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLElement | null)[]>([]);

  // Helper to collect refs
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  useGSAP(
    () => {
      // 1. SETUP: Initial states (prevent FOUC)
      // We explicitly set visibility to hidden to ensure screen readers don't announce too early
      gsap.set(contentRefs.current, {
        autoAlpha: 0,
        y: 20,
        willChange: "transform, opacity",
      });

      gsap.set(glassPanel.current, {
        autoAlpha: 0,
        scale: 0.98,
        willChange: "transform, opacity",
      });

      // 2. TIMELINE: "System Boot" Sequence
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Panel expands from void
      tl.to(glassPanel.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
      })
        // Content flows in sequentially
        .to(
          contentRefs.current,
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6,
          },
          "-=0.8",
        );

      // 3. AMBIENT: Infinite Light Reflection Loop
      // This runs on GPU (xPercent) for zero main-thread impact
      if (reflection.current) {
        gsap.to(reflection.current, {
          xPercent: 500, // Move 500% of its own width
          duration: 15, // Slow, heavy feel
          ease: "none",
          repeat: -1,
          delay: 2,
        });
      }
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative w-full min-h-dvh  flex items-center justify-center overflow-hidden py-36 -mt-20 "
      style={{ backgroundColor: COLORS.VOID, color: "white" }}
    >
      {/* ────────────────────────────────────────────────────────────────
          LAYER 0: THE VOID (Background Environment)
      ──────────────────────────────────────────────────────────────── */}

      {/* Precision Grid: Generated via inline CSS to avoid config dependency */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none select-none z-0"
        style={{
          backgroundSize: "64px 64px",
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
        }}
      />

      {/* Volumetric Glow (Violet): Top Left */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] mix-blend-screen pointer-events-none opacity-20"
        style={{ backgroundColor: COLORS.AMBER }}
      />

      {/* Volumetric Glow (Cyan): Bottom Right */}
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] mix-blend-screen pointer-events-none opacity-10"
        style={{ backgroundColor: COLORS.VIOLET }}
      />

      {/* ────────────────────────────────────────────────────────────────
          LAYER 1: THE GLASS ARTIFACT
      ──────────────────────────────────────────────────────────────── */}

      <div
        ref={glassPanel}
        className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 "
      >
        {/* The Panel: No border radius, glass morphism via standard tailwind classes */}
        <div className="relative backdrop-blur-xs  border border-white/8 bg-white/2 shadow-2xl group overflow-hidden">
          {/* Animated Reflection Streak (GPU Optimized) */}
          <div
            ref={reflection}
            className="absolute top-0 left-[-25%] w-1/4 h-full bg-linear-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none z-0 will-change-transform"
          />

          {/* Technical Corner Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#F59E0B]/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#F59E0B]/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#F59E0B]/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#F59E0B]/50" />

          {/* ──────────────────────────────────────────────────────────
              CONTENT CONTAINER
          ────────────────────────────────────────────────────────── */}
          <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center ">
            {/* -- HEADER SECTION -- */}
            <div ref={addToRefs} className="max-w-4xl mb-16">
              <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
                <div className="h-px w-12 bg-linear-to-r from-transparent to-[#F59E0B]" />
                <span className="text-[#F59E0B] font-mono text-xs tracking-[0.2em] uppercase">
                  Deployment Configuration
                </span>
                <div className="h-px w-12 bg-linear-to-l from-transparent to-[#F59E0B]" />
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
                Transparent Pricing for
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#06B6D4] via-white to-[#6D28D9]">
                  Intelligent Systems
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light max-w-2xl mx-auto">
                Select your operational capacity. Whether you require
                high-performance rendering,
                <span className="text-white decoration-1 underline underline-offset-4 decoration-[#06B6D4]/50">
                  {" "}
                  SEO growth vectors
                </span>
                , or
                <span className="text-white decoration-1 underline underline-offset-4 decoration-[#6D28D9]/50">
                  {" "}
                  automated intelligence
                </span>
                .
              </p>
            </div>

            {/* -- FEATURE GRID (The "Cards") -- */}
            {/* Uses a grid with 1px gaps (bg-white/10) to create thin separator lines */}
            <div
              ref={addToRefs}
              className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.08] border border-white/[0.08] w-full max-w-5xl mb-16"
            >
              {[
                {
                  icon: <FiCpu size={24} />,
                  title: "Scalable Core",
                  desc: "Flexible compute packages for any business size.",
                  color: "#06B6D4", // Cyan
                },
                {
                  icon: <FiShield size={24} />,
                  title: "Transparent Logic",
                  desc: "Clear pricing algorithms with zero hidden variables.",
                  color: "#F59E0B", // Amber
                },
                {
                  icon: <FiActivity size={24} />,
                  title: "Custom Velocity",
                  desc: "Tailored acceleration plans for enterprise demands.",
                  color: "#6D28D9", // Violet
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group/card relative bg-[#0B0F19]/90 p-8 md:p-10 text-left hover:bg-white/[0.03] transition-colors duration-500"
                >
                  <div
                    className="mb-6 p-3 w-fit border transition-all duration-300"
                    style={{
                      borderColor: `${item.color}33`, // 20% opacity
                      backgroundColor: `${item.color}10`, // ~6% opacity
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>

                  <h3 className="text-xl text-white font-medium mb-3 flex items-center gap-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-white/50 font-mono leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Hover Accent Line */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover/card:w-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              ))}
            </div>

            {/* -- CTA CLUSTER -- */}
            <div
              ref={addToRefs}
              className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center mb-16"
            >
              {/* Primary Action: Solid Amber */}
              <a href="#quote" className="relative group w-full sm:w-auto">
                <button
                  className="relative w-full sm:w-auto px-10 py-5 font-bold text-sm tracking-widest uppercase transition-transform duration-200 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                  style={{ backgroundColor: COLORS.AMBER, color: COLORS.VOID }}
                >
                  {/* Button Hover Shine */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                  <span className="relative z-10 flex items-center gap-2">
                    Initialize Quote
                    <FiArrowRight strokeWidth={3} />
                  </span>
                </button>
              </a>

              {/* Secondary Action: Ghost / Wireframe */}
              <button className="group relative w-full sm:w-auto px-10 py-5 text-white font-medium text-sm tracking-wide border border-white/20 hover:border-[#06B6D4]/50 hover:text-[#06B6D4] transition-all duration-300 flex items-center justify-center gap-3 bg-transparent">
                <FiTerminal />
                <span>System Consultation</span>
                {/* Subtle Background Fill on Hover */}
                <div className="absolute inset-0 bg-[#06B6D4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
