// components/process/ProcessSection.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ProcessSection.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface ProcessStep {
  id: string;
  index: string;
  title: string;
  description: string;
  tag: string;
  capacity: number;
  duration: string;
  deliverables: string[];
}

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */
const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "p1",
    index: "01",
    title: "Strategy & Business Analysis",
    tag: "RESEARCH",
    description:
      "We study your business model, competitors, audience behavior, and growth opportunities to build a winning strategy.",
    capacity: 100,
    duration: "3-5 days",
    deliverables: [
      "Competitor analysis report",
      "Target audience profiling",
      "Growth opportunity map",
      "Strategic roadmap",
    ],
  },
  {
    id: "p2",
    index: "02",
    title: "Design & UX Planning",
    tag: "DESIGN",
    description:
      "We create wireframes and UI/UX layouts designed for maximum conversion and premium branding that stands out.",
    capacity: 85,
    duration: "5-7 days",
    deliverables: [
      "Wireframes & mockups",
      "Interactive prototypes",
      "Brand style guide",
      "Conversion-focused layouts",
    ],
  },
  {
    id: "p3",
    index: "03",
    title: "Development + SEO Foundation",
    tag: "BUILD",
    description:
      "We build your website with clean code, fast performance, and SEO-ready structure that ranks from day one.",
    capacity: 92,
    duration: "10-14 days",
    deliverables: [
      "Production-ready website",
      "SEO optimization",
      "Performance tuning",
      "Mobile responsiveness",
    ],
  },
  {
    id: "p4",
    index: "04",
    title: "AI Integration & Growth System",
    tag: "AUTOMATION",
    description:
      "We deploy custom AI tools and automation systems tailored to your workflow for maximum efficiency and growth.",
    capacity: 78,
    duration: "7-10 days",
    deliverables: [
      "Custom AI chatbot",
      "Lead automation system",
      "Analytics dashboard",
      "Growth tracking tools",
    ],
  },
];

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
    <TealDot size={5} />
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
      className={`absolute w-2.5 h-2.5 pointer-events-none ${map[pos]}`}
      style={{ borderColor: "rgba(48,192,192,0.35)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   CAPACITY BAR
════════════════════════════════════════ */
const CapacityBar = ({
  value,
  animate,
}: {
  value: number;
  animate: boolean;
}) => {
  const color =
    value >= 90
      ? "#30C0A0"
      : value >= 70
        ? "#30C0C0"
        : value >= 50
          ? "#3090C0"
          : "#305890";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[8.5px] tracking-[0.2em] uppercase"
          style={{ color: "#1E4058" }}
        >
          Progress
        </span>
        <span
          className="font-mono text-[9px] tracking-widest"
          style={{ color }}
        >
          {value}%
        </span>
      </div>
      <div
        className="relative h-px w-full overflow-hidden rounded-full"
        style={{ background: "#0E1E30" }}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress ${value}%`}
      >
        <div className="absolute inset-0 flex gap-px">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              style={{ background: "#0A1828" }}
            />
          ))}
        </div>
        <div
          className={styles.capacityFill}
          style={{
            width: animate ? `${value}%` : "0%",
            background: `linear-gradient(to right, #183858, ${color})`,
            boxShadow: `0 0 6px ${color}88`,
            transitionDelay: "0.3s",
          }}
        />
        <div
          className={styles.capacityTip}
          style={{
            left: animate ? `calc(${value}% - 2px)` : "0%",
            background: color,
            boxShadow: `0 0 8px ${color}`,
            transitionDelay: "0.3s",
          }}
        />
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   STEP HEX ICON
════════════════════════════════════════ */
const StepHex = ({ index, active }: { index: string; active: boolean }) => (
  <div
    className={`${styles.hexWrap} relative flex items-center justify-center shrink-0`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 52 60"
      fill="none"
      className="absolute inset-0 w-full h-full"
    >
      <path
        d="M26 2L50 16V44L26 58L2 44V16L26 2Z"
        stroke={active ? "rgba(48,192,192,0.5)" : "rgba(24,56,88,0.7)"}
        strokeWidth="0.8"
        fill={active ? "rgba(48,192,192,0.04)" : "rgba(8,18,32,0.5)"}
        style={{ transition: "stroke 0.4s, fill 0.4s" }}
      />
      <path
        d="M26 8L44 18.5V39.5L26 50L8 39.5V18.5L26 8Z"
        stroke={active ? "rgba(48,192,192,0.2)" : "rgba(18,40,64,0.5)"}
        strokeWidth="0.4"
        fill="none"
        style={{ transition: "stroke 0.4s" }}
      />
    </svg>
    <span
      className="relative font-mono text-[11px] tracking-widest z-10"
      style={{
        color: active ? "#30C0C0" : "#1E4058",
        textShadow: active ? "0 0 12px rgba(48,192,192,0.6)" : "none",
        transition: "color 0.4s, text-shadow 0.4s",
      }}
    >
      {index}
    </span>
  </div>
);

/* ════════════════════════════════════════
   PROCESS STEP CARD
════════════════════════════════════════ */
const ProcessStepCard = ({
  step,
  active,
  onSelect,
  revealed,
}: {
  step: ProcessStep;
  active: boolean;
  onSelect: () => void;
  revealed: boolean;
}) => {
  return (
    <article
      className={`
        ${styles.stepCard}
        ${active ? styles.stepCardActive : ""}
        ${revealed ? styles.stepCardRevealed : ""}
        relative flex flex-col cursor-pointer
      `}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      tabIndex={0}
      role="button"
      aria-pressed={active}
      aria-label={`${step.title} — ${step.tag}`}
    >
      <div className={styles.cardTopLine} aria-hidden="true" />
      <div
        className={styles.cardLeftStripe}
        style={{ opacity: active ? 1 : 0 }}
        aria-hidden="true"
      />

      <Bracket pos="tl" />
      <Bracket pos="br" />

      <div
        className={styles.cardGlow}
        style={{ opacity: active ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* HEADER */}
      <div className="flex items-start gap-3 p-5 pb-4">
        <StepHex index={step.index} active={active} />

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span
            className="font-mono text-[8.5px] tracking-[0.26em] uppercase"
            style={{
              color: active ? "#30C0C0" : "#1A3848",
              transition: "color 0.3s",
            }}
          >
            {step.tag}
          </span>
          <h3
            className="font-mono leading-snug"
            style={{
              fontSize: "clamp(13px, 1.6vw, 15px)",
              color: active ? "#C8E8F0" : "#3A6878",
              letterSpacing: "0.04em",
              transition: "color 0.3s",
            }}
          >
            {step.title}
          </h3>
        </div>

        <TealDot
          size={5}
          pulse={active}
          color={active ? "#30C0C0" : "#183848"}
        />
      </div>

      {/* DESCRIPTION */}
      <p
        className="font-mono text-[11px] leading-relaxed px-5 pb-4"
        style={{
          color: active ? "#3A6878" : "#1A3040",
          letterSpacing: "0.03em",
          transition: "color 0.3s",
        }}
      >
        {step.description}
      </p>

      {/* CAPACITY BAR */}
      <div className="px-5 pb-4">
        <CapacityBar value={step.capacity} animate={active} />
      </div>

      {/* EXPANDABLE CONTENT */}
      <div
        className={styles.cardExpand}
        style={{ maxHeight: active ? "400px" : "0px" }}
        aria-hidden={!active}
      >
        <div className="px-5 pb-4 flex flex-col gap-4">
          {/* Duration pill */}
          <div
            className={`${styles.durationPill} relative flex items-center justify-center gap-2 py-2`}
          >
            <Bracket pos="tl" />
            <Bracket pos="br" />
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-3.5 h-3.5"
              style={{ color: "#30C0C0" }}
            >
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M8 4v4l3 2"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="font-mono text-[11px] tracking-widest uppercase"
              style={{ color: "#60C8D0" }}
            >
              {step.duration}
            </span>
          </div>

          {/* Deliverables */}
          <div className="flex flex-col gap-2">
            <span
              className="font-mono text-[8.5px] tracking-[0.2em] uppercase"
              style={{ color: "#1E4058" }}
            >
              Deliverables
            </span>
            <ul className="flex flex-col gap-1.5" aria-label="Deliverables">
              {step.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="font-mono text-[10px] shrink-0 mt-0.5"
                    style={{ color: "#30C0C0", opacity: 0.7 }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                  <span
                    className="font-mono text-[11px] leading-snug"
                    style={{ color: "#2A5868", letterSpacing: "0.03em" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.cardBottomLine} aria-hidden="true" />
    </article>
  );
};

 

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ProcessSection() {
  const [activeId, setActiveId] = useState<string>("p1");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const cards = cardRefs.current;
    const observers: IntersectionObserver[] = [];

    cards.forEach((el, id) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => new Set([...prev, id]));
            obs.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? "" : id));
  }, []);

  const activeStep = PROCESS_STEPS.find((s) => s.id === activeId);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="process-heading"
    >
      {/* Background layers */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />

      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        {/* HEADER */}
        <div className="flex flex-col gap-5 mb-16 sm:mb-20">
          <SectionLabel>Our Process</SectionLabel>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              id="process-heading"
              className="font-mono leading-tight max-w-2xl"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              From Strategy to
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 32px rgba(48,192,192,0.4)",
                }}
              >
                Scalable Results
              </span>
            </h2>

            <div className="flex flex-col gap-3 lg:items-end">
              <p
                className="font-mono text-[12px] leading-relaxed max-w-xs lg:text-right"
                style={{ color: "#2E5868", letterSpacing: "0.04em" }}
              >
                Four proven steps. One streamlined workflow. Zero guesswork.
              </p>
              <div
                className={`${styles.activePill} flex items-center gap-2 px-3 py-1.5`}
              >
                <TealDot size={4} pulse />
                <span
                  className="font-mono text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: "#30C0C0" }}
                >
                  {activeStep ? activeStep.title : "Select a step"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* PROCESS FLOW */}
        <div className="grid grid-cols-2 gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <div
                ref={(el) => {
                  if (el) cardRefs.current.set(step.id, el);
                }}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <ProcessStepCard
                  step={step}
                  active={activeId === step.id}
                  onSelect={() => handleSelect(step.id)}
                  revealed={revealed.has(step.id)}
                />
              </div>
             </React.Fragment>
          ))}
        </div>

        {/* BOTTOM STRIP */}
        <div className={`${styles.bottomStrip} mt-16 sm:mt-20`}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Ready to transform your digital presence?
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <a
            href="#contact"
            className={`${styles.ctaLink} relative flex items-center gap-2`}
          >
            <Bracket pos="tl" />
            <Bracket pos="br" />
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "#7ABFCF" }}
            >
              Start Your Project Today
            </span>
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="#30C0C0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
