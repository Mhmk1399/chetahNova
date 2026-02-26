/*
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPONENT: AIWhyDifferent.tsx
 * ARCHITECT: System Core
 * CONTEXT: USP / Differentiators
 * VISUAL SYSTEM: "Schematic Blueprint" (Technical Precision)
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin if not already done globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 DATA & CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const DIFFERENTIATORS = [
  {
    id: "MOD::TRAIN",
    title: "Custom Training",
    subtitle: "Based on Your Business",
    description:
      "Your AI is trained on your specific services, policies, content, and customer journey. It doesn't guess; it knows.",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="square"
          strokeWidth="1.5"
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        />
      </svg>
    ),
  },
  {
    id: "MOD::CONVERT",
    title: "Designed for Conversion",
    subtitle: "Sales & Lead Gen Focus",
    description:
      "Our AI tools are built to increase sales and lead generation, not just answer questions. Every interaction has a goal.",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="square"
          strokeWidth="1.5"
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        />
      </svg>
    ),
  },
  {
    id: "MOD::INTEG",
    title: "Full Website Integration",
    subtitle: "Deep Structure Access",
    description:
      "We integrate AI tools into your website structure, landing pages, forms, and SEO system. It is not a popup; it is the platform.",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
        <path
          strokeLinecap="square"
          strokeWidth="1.5"
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        />
      </svg>
    ),
  },
  {
    id: "MOD::SCALE",
    title: "Scalable & Expandable",
    subtitle: "Future-Proof Architecture",
    description:
      "Your AI system can grow over time, adding new tools and automation features without rebuilding the core foundation.",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="square"
          strokeWidth="1.5"
          d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
        />
        <path
          strokeLinecap="square"
          strokeWidth="1.5"
          d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
        />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🧱 ATOMIC COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const SystemLabel = ({ text }: { text: string }) => (
  <span className="font-mono text-[9px] tracking-[0.15em] text-white/30 uppercase select-none">
    {text}
  </span>
);

const CornerBracket = ({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) => {
  const styles = {
    tl: "top-0 left-0 border-t border-l rounded-tl-none",
    tr: "top-0 right-0 border-t border-r rounded-tr-none",
    bl: "bottom-0 left-0 border-b border-l rounded-bl-none",
    br: "bottom-0 right-0 border-b border-r rounded-br-none",
  };

  return (
    <div
      className={`absolute w-3 h-3 border-white/40 ${styles[position]} transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-cyan-500/80`}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🗃️ SPEC CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TechSpecCard = ({
  data,
  index,
}: {
  data: (typeof DIFFERENTIATORS)[0];
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.1 * index,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
        },
      },
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative p-8 bg-white/2 hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden"
    >
      {/* 1. Structural Brackets */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {/* 2. Background Grid (Revealed on Hover) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, #06b6d4 25%, #06b6d4 26%, transparent 27%, transparent 74%, #06b6d4 75%, #06b6d4 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #06b6d4 25%, #06b6d4 26%, transparent 27%, transparent 74%, #06b6d4 75%, #06b6d4 76%, transparent 77%, transparent)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* 3. Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="p-2 bg-white/5 rounded-none text-cyan-400 group-hover:text-amber-400 transition-colors duration-300">
            {data.icon}
          </div>
          <SystemLabel text={data.id} />
        </div>

        {/* Titles */}
        <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
          {data.title}
        </h3>
        <span className="text-xs font-mono text-cyan-500/70 mb-4 block uppercase tracking-wide">
          // {data.subtitle}
        </span>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed font-light">
          {data.description}
        </p>

        {/* Status Indicator (Bottom) */}
        <div className="mt-auto pt-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-emerald-500 transition-colors duration-300" />
          <span className="text-[10px] text-white/20 group-hover:text-emerald-500/50 font-mono transition-colors duration-300">
            SYSTEM_INTEGRITY: 100%
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function AIWhyDifferent() {
  const containerRef = useRef<HTMLDivElement>(null);
 
  return (
    <section
      ref={containerRef}
      id="ai-differentiators"
      className="relative w-full py-24 bg-[#0B0F19] text-white overflow-hidden"
    >
      {/* Decorative Crosshair Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.03]" />
        <div className="absolute left-1/2 top-0 w-[1px] h-full h-screen bg-white/[0.03]" />
      </div>

      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              Why Our AI Tools Are{" "}
              <span className="text-cyan-400">Different</span>
            </h2>
            <div className="text-lg text-white/70 font-light leading-relaxed space-y-4">
              <p>
                Many agencies offer AI as a “plugin” or a generic chatbot. We
                build{" "}
                <span className="text-white border-b border-cyan-500/30">
                  Intelligence Systems
                </span>
                .
              </p>
              <p className="text-base text-white/50">
                Customized, scalable, and deeply connected to your business
                workflow. Designed to feel like a real business assistant, not a
                robotic script.
              </p>
            </div>
          </div>

          {/* Abstract Comparison Visual */}
          <div className="hidden md:block text-right">
            <div className="font-mono text-xs text-white/30 mb-2">
              ARCHITECTURAL_COMPARISON
            </div>
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-white/30 line-through decoration-red-500/50">
                GENERIC_PLUGIN
              </span>
              <span className="text-cyan-500">→</span>
              <span className="text-amber-500 bg-amber-500/10 px-2 py-1 border border-amber-500/20">
                CUSTOM_CORE
              </span>
            </div>
          </div>
        </div>

        {/* BLUEPRINT GRID */}
        <div className="relative">
          {/* Connecting Lines (Vertical/Horizontal) for visual cohesion */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/10 to-transparent hidden md:block" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-linear-to-b from-transparent via-white/10 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.1] border border-white/[0.1]">
            {DIFFERENTIATORS.map((item, idx) => (
              <TechSpecCard key={item.id} data={item} index={idx} />
            ))}
          </div>
        </div>

        {/* BOTTOM METADATA */}
        <div className="mt-8 flex justify-between items-center text-xs font-mono text-white/20">
          <div>// SPEC_SHEET_V2.1</div>
          <div className="hidden sm:block">OPTIMIZED_FOR_BUSINESS_LOGIC</div>
        </div>
      </div>
    </section>
  );
}
