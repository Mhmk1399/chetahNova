/*
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPONENT: AICaseStudies.tsx
 * ARCHITECT: System Core
 * CONTEXT: Social Proof / Case Studies
 * VISUAL SYSTEM: "Floating Glass" v2 (Data Density Variant)
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 DATA & CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  primary: "#F59E0B", // Amber (Action)
  secondary: "#06B6D4", // Cyan (System)
  accent: "#6D28D9", // Violet (Deep Data)
  success: "#10B981", // Emerald (Outcome Positive)
};

interface CaseStudy {
  id: string;
  project: string;
  industry: string;
  challenge: string;
  solution: string;
  outcome: string;
  link: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "CS_LOG::0142",
    project: "Service Bot Alpha",
    industry: "Service Business",
    challenge: "High volume of redundant inquiries; response latency > 4hrs.",
    solution:
      "Integrated LLM-based neural agent trained on pricing/service vectors.",
    outcome:
      "Response time reduced by 98%. Customer satisfaction metrics +42%.",
    link: "#case-study-1",
  },
  {
    id: "CS_LOG::0143",
    project: "Lead Scoring Matrix",
    industry: "Real Estate",
    challenge: "Sales team bandwidth saturated by low-intent leads (noise).",
    solution: "Deployed predictive lead scoring algorithm into intake forms.",
    outcome:
      "Conversion rate doubled. 100% of sales focus shifted to high-value targets.",
    link: "#case-study-2",
  },
  {
    id: "CS_LOG::0144",
    project: "SEO Auto-Pilot",
    industry: "E-commerce",
    challenge: "Inconsistent content velocity; keyword gaps in catalog.",
    solution: "Built automated clustering engine + semantic content generator.",
    outcome: "Organic traffic +150% YoY. Indexed pages increased by 5x.",
    link: "#case-study-3",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🧱 ATOMIC COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const SystemLabel = ({
  text,
  color = "text-white/20",
}: {
  text: string;
  color?: string;
}) => (
  <span
    className={`font-mono text-[10px] tracking-[0.2em] uppercase ${color} select-none`}
  >
    {text}
  </span>
);

const AnimatedSeparator = ({ delay = 0 }: { delay?: number }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1,
        duration: 1.5,
        delay: delay,
        ease: "expo.out",
        scrollTrigger: { trigger: lineRef.current },
      },
    );
  }, []);
  return <div ref={lineRef} className="h-[1px] w-full bg-white/[0.08] my-6" />;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🗃️ CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const CaseStudyCard = ({ data, index }: { data: CaseStudy; index: number }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    // Entrance Animation
    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
      },
    );
  }, []);

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group h-full bg-[#0B0F19] border-l border-white/[0.1] hover:border-l-cyan-500/50 transition-colors duration-500 pl-6 md:pl-8 pr-4 py-2"
    >
      {/* Dynamic Hover Background (Very Subtle) */}
      <div className="absolute inset-0 bg-linear-to-r from-cyan-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header: ID & Industry */}
      <div className="flex justify-between items-baseline mb-6">
        <SystemLabel text={data.id} color="text-cyan-500/40" />
        <span className="font-mono text-xs text-cyan-400 bg-cyan-900/10 px-2 py-1 border border-cyan-500/20">
          {data.industry.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-2xl text-white font-medium tracking-tight mb-6 group-hover:text-cyan-50 transition-colors">
        {data.project}
      </h3>

      {/* Data Grid: Challenge vs Solution */}
      <div className="grid grid-cols-1 gap-6 text-sm leading-relaxed text-white/60 mb-6 relative">
        {/* Vertical Connector Line */}
        <div className="absolute left-[-17px] top-2 bottom-2 w-[1px] bg-white/5">
          <div
            className={`absolute top-0 left-[-1px] w-[3px] h-[3px] bg-white/20 ${isHovered ? "bg-amber-500" : ""} transition-colors duration-300`}
          />
          <div
            className={`absolute bottom-0 left-[-1px] w-[3px] h-[3px] bg-white/20 ${isHovered ? "bg-emerald-500" : ""} transition-colors duration-300`}
          />
        </div>

        <div>
          <span className="block text-white/30 text-xs mb-1 font-mono">
            :: CHALLENGE
          </span>
          {data.challenge}
        </div>
        <div>
          <span className="block text-white/30 text-xs mb-1 font-mono">
            :: ARCHITECTED SOLUTION
          </span>
          {data.solution}
        </div>
      </div>

      {/* Outcome Block (Highlighted) */}
      <div className="relative bg-white/[0.03] border border-white/5 p-4 mt-auto group-hover:border-emerald-500/30 transition-colors duration-500">
        <div className="absolute top-0 left-0 w-[2px] h-full bg-emerald-500/50 opacity-50 group-hover:opacity-100 transition-opacity" />
        <span className="block text-emerald-400 text-xs mb-2 font-mono tracking-wide">
          ► SYSTEM_OUTCOME
        </span>
        <p className="text-white/90 text-sm font-light">{data.outcome}</p>
      </div>

      {/* CTA Link */}
      <div className="mt-6 flex items-center gap-2 group/btn cursor-pointer">
        <span className="font-mono text-xs text-cyan-500/70 group-hover/btn:text-cyan-400 transition-colors">
          VIEW_FULL_LOG
        </span>
        <div className="h-[1px] w-8 bg-cyan-500/30 group-hover/btn:w-12 transition-all duration-300" />
      </div>
    </article>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 MAIN SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AICaseStudies() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="ai-case-studies"
      ref={sectionRef}
      className="relative w-full py-24 bg-[#0B0F19] overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Section Header */}
        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
            <SystemLabel text="PROOF_OF_WORK // DEPLOYED" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6">
            Engineered Results: <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-white/40">
              AI Tool Case Studies
            </span>
          </h2>

          <p className="text-lg text-white/60 font-light max-w-2xl leading-relaxed">
            Theoretical performance means nothing. Here are system logs from
            live environments where our AI architecture reduced workload and
            increased conversion efficiency.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 border-t border-white/[0.08] pt-12">
          {CASE_STUDIES.map((study, idx) => (
            <CaseStudyCard key={study.id} data={study} index={idx} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 flex flex-col items-center justify-center text-center">
          <AnimatedSeparator delay={0.5} />

          <div className="relative group cursor-pointer inline-block mt-8">
            <div className="absolute inset-0 bg-linear-to-r from-amber-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

            <button
              className="relative px-10 py-5 bg-[#0B0F19] border border-white/20 hover:border-white/50 text-white font-mono text-sm tracking-widest uppercase transition-all duration-300"
              aria-label="Request a Custom AI Tool Proposal"
            >
              <span className="absolute top-0 left-0 w-1 h-1 bg-white transition-all group-hover:w-full group-hover:h-full group-hover:bg-white/5" />
              <span className="absolute bottom-0 right-0 w-1 h-1 bg-white transition-all group-hover:w-full group-hover:h-full group-hover:bg-transparent" />

              <span className="relative z-10 flex items-center gap-3">
                Request Custom Protocol{" "}
                <span className="text-amber-500">→</span>
              </span>
            </button>

            <div className="mt-4 text-xs font-mono text-white/30">
              INITIATE_HANDSHAKE_PROTOCOL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
