"use client";

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

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

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  color: "primary" | "secondary" | "accent";
  details?: string[];
  duration?: string;
}

interface ProcessSectionProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  steps?: ProcessStep[];
  ctaText?: string;
  ctaHref?: string;
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  strategy: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon
        points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
        fill="currentColor"
        opacity="0.2"
      />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  design: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  development: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  ai: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5" />
      <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-1.32 4.24 3 3 0 0 1-.34 5.58 2.5 2.5 0 0 1-2.96 3.08A2.5 2.5 0 0 1 12 19.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
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
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultSteps: ProcessStep[] = [
  {
    id: "strategy",
    number: "01",
    title: "Strategy & Business Analysis",
    description:
      "We study your business model, competitors, audience behavior, and growth opportunities.",
    icon: Icons.strategy,
    image:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/Strategy+%26+Business+Analysis.webp",
    color: "primary",
    details: [
      "Market Research",
      "Competitor Analysis",
      "User Personas",
      "Growth Roadmap",
    ],
    duration: "Week 1",
  },
  {
    id: "design",
    number: "02",
    title: "Design & UX Planning",
    description:
      "We create wireframes and UI/UX layouts designed for maximum conversion and premium branding.",
    icon: Icons.design,
    image:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/Design+%26+UX+Planning.webp",
    color: "secondary",
    details: ["Wireframing", "UI Design", "Prototyping", "Brand Integration"],
    duration: "Week 2-3",
  },
  {
    id: "development",
    number: "03",
    title: "Development + SEO Foundation",
    description:
      "We build your website with clean code, fast performance, and SEO-ready structure.",
    icon: Icons.development,
    image:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/Development+%2B+SEO+Foundation.webp",
    color: "primary",
    details: ["Clean Code", "Performance", "SEO Setup", "Responsive Build"],
    duration: "Week 4-6",
  },
  {
    id: "ai",
    number: "04",
    title: "AI Integration & Growth System",
    description:
      "We deploy custom AI tools and automation systems tailored to your workflow.",
    icon: Icons.ai,
    image:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/AI+Integration+%26+Growth+System.webp",
    color: "accent",
    details: ["AI Chatbots", "Automation", "Analytics", "Support"],
    duration: "Week 7-8",
  },
];

// ════════════════════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════════════════════

const getColor = (colorKey: "primary" | "secondary" | "accent") =>
  colors[colorKey];

// ════════════════════════════════════════════════════════════════════
// BACKGROUND
// ════════════════════════════════════════════════════════════════════

const Background = memo(function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${colors.dark} 0%, ${colors.darkLighter} 50%, ${colors.dark} 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute left-0 top-1/4 h-150 w-150 -translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-0 h-125 w-125 translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.accent}06 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// STEP CARD - با انیمیشن اسکرول
// ════════════════════════════════════════════════════════════════════

const StepCard = memo(function StepCard({
  step,
  isActive,
  side,
}: {
  step: ProcessStep;
  isActive: boolean;
  side: "left" | "right";
}) {
  const color = getColor(step.color);

  return (
    <div
      className={`
        relative overflow-hidden border p-6 transition-all duration-300 md:p-8
        ${side === "left" ? "lg:text-right" : "lg:text-left"}
      `}
      style={{
        borderColor: isActive ? `${color}50` : "rgba(255,255,255,0.06)",
        background: isActive
          ? `linear-gradient(${side === "left" ? "135deg" : "225deg"}, ${color}12, transparent 60%)`
          : "rgba(255,255,255,0.02)",
        boxShadow: isActive ? `0 25px 50px -12px ${color}30` : "none",
      }}
    >
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover transition-transform duration-700"
          style={{
            filter: isActive ? "blur(2px)" : "blur(8px)",
            transform: isActive ? "scale(1.05)" : "scale(1)",
            opacity: isActive ? 0.9 : 0.15,
          }}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Dark overlay for text readability */}

        {/* Color tint overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: isActive
              ? `linear-gradient(${side === "left" ? "135deg" : "225deg"}, ${color}30, transparent 70%)`
              : `linear-gradient(${side === "left" ? "135deg" : "225deg"}, ${color}10, transparent 50%)`,
            opacity: isActive ? 1 : 0.6,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Duration Badge */}
        {step.duration && (
          <div
            className={`mb-4 flex ${side === "left" ? "lg:justify-end" : "lg:justify-start"}`}
          >
            <div
              className="inline-flex items-center gap-1.5 border px-3 py-1 text-xs transition-all duration-300 backdrop-blur-sm"
              style={{
                borderColor: isActive ? `${color}60` : "rgba(255,255,255,0.1)",
                backgroundColor: isActive ? `${color}25` : "rgba(0,0,0,0.4)",
                color: isActive ? color : "rgba(255,255,255,0.5)",
              }}
            >
              <span className="h-3 w-3">{Icons.clock}</span>
              {step.duration}
            </div>
          </div>
        )}

        {/* Icon */}
        <div
          className={`mb-4 flex ${side === "left" ? "lg:justify-end" : "lg:justify-start"}`}
        >
          <div
            className="flex h-14 w-14 items-center justify-center border transition-all duration-300 backdrop-blur-sm"
            style={{
              borderColor: isActive ? `${color}60` : "rgba(255,255,255,0.1)",
              background: isActive
                ? `linear-gradient(135deg, ${color}35, ${color}15)`
                : "rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="h-7 w-7 transition-all duration-300"
              style={{
                color: isActive ? color : "rgba(255,255,255,0.5)",
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
            >
              {step.icon}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          className="mb-3 text-lg text-left font-bold transition-colors duration-300 md:text-xl"
          style={{
            color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
            textShadow: isActive ? `0 2px 20px ${color}40` : "none",
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          className="mb-6 text-sm text-left leading-relaxed transition-colors duration-300 md:text-base"
          style={{
            color: isActive
              ? "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0.55)",
          }}
        >
          {step.description}
        </p>

        {/* Details */}
        {step.details && (
          <div
            className={`flex flex-wrap  gap-2 ${side === "left" ? "lg:justify-start" : "lg:justify-start"}`}
          >
            {step.details.map((detail, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-all duration-300 backdrop-blur-sm"
                style={{
                  borderColor: isActive
                    ? `${color}40`
                    : "rgba(255,255,255,0.08)",
                  backgroundColor: isActive ? `${color}20` : "rgba(0,0,0,0.3)",
                  color: isActive
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.6)",
                }}
              >
                <span
                  className="h-1.5 w-1.5  rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: isActive ? color : "rgba(255,255,255,0.4)",
                  }}
                />
                {detail}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Accent */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 z-10`}
        style={{
          width: isActive ? "100%" : "0%",
          background: `linear-gradient(${side === "left" ? "270deg" : "90deg"}, ${color}, transparent)`,
        }}
      />

      {/* Active Glow */}
      {isActive && (
        <div
          className={`pointer-events-none absolute h-32 w-32 ${
            side === "left" ? "-right-16 -top-16" : "-left-16 -top-16"
          }`}
          style={{
            background: `radial-gradient(circle, ${color}25, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TIMELINE NODE
// ════════════════════════════════════════════════════════════════════

const TimelineNode = memo(function TimelineNode({
  step,
  isActive,
  isCompleted,
}: {
  step: ProcessStep;
  isActive: boolean;
  isCompleted: boolean;
}) {
  const color = getColor(step.color);
  const isHighlighted = isActive || isCompleted;

  return (
    <div className="relative flex flex-col items-center">
      {/* Number */}
      <div
        className="mb-3 text-xs font-bold tracking-wider transition-all duration-300"
        style={{
          color: isHighlighted ? color : "rgba(255,255,255,0.15)",
          transform: isActive ? "scale(1.2)" : "scale(1)",
        }}
      >
        {step.number}
      </div>

      {/* Node */}
      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* Outer Ring */}
        <div
          className="absolute inset-0 rotate-45 border-2 transition-all duration-300"
          style={{
            borderColor: isActive
              ? color
              : isCompleted
                ? `${color}70`
                : "rgba(255,255,255,0.08)",
            backgroundColor: isActive
              ? `${color}25`
              : isCompleted
                ? `${color}10`
                : "transparent",
            transform: isActive
              ? "rotate(45deg) scale(1.1)"
              : "rotate(45deg) scale(1)",
          }}
        />

        {/* Inner Dot */}
        <div
          className="relative z-10 rounded-full transition-all duration-300"
          style={{
            width: isActive ? "14px" : "10px",
            height: isActive ? "14px" : "10px",
            backgroundColor: isHighlighted ? color : "rgba(255,255,255,0.15)",
            boxShadow: isActive
              ? `0 0 25px ${color}, 0 0 50px ${color}50`
              : "none",
          }}
        />

        {/* Pulse Animation - Only on Active */}
        {isActive && (
          <>
            <div
              className="absolute inset-0 rotate-45 border-2"
              style={{
                borderColor: color,
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
            <div
              className="absolute inset-0 rotate-45 border-2"
              style={{
                borderColor: color,
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s",
              }}
            />
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes ping {
          0% {
            transform: rotate(45deg) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: rotate(45deg) scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// DESKTOP TIMELINE - با ScrollTrigger
// ════════════════════════════════════════════════════════════════════

const DesktopTimeline = memo(function DesktopTimeline({
  steps,
  onStepChange,
}: {
  steps: ProcessStep[];
  onStepChange: (index: number) => void;
}) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const stepElements = timelineRef.current.querySelectorAll(".step-row");
    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.fromTo(
        stepElements,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Each Step ScrollTrigger
      stepElements.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => {
            setActiveIndex(index);
            onStepChange(index);
          },
          onEnterBack: () => {
            setActiveIndex(index);
            onStepChange(index);
          },
        });
      });

      // Progress Line Animation
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 0.5,
          },
        });
      }
    }, timelineRef);

    return () => ctx.revert();
  }, [onStepChange]);

  return (
    <div ref={timelineRef} className="relative hidden lg:block">
      {/* Center Progress Line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2">
        {/* Background Line */}
        <div className="absolute inset-0 bg-white/[0.06]" />

        {/* Progress Line */}
        <div
          ref={progressRef}
          className="absolute left-0 top-0 w-full origin-top"
          style={{
            height: "100%",
            background: `linear-gradient(180deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
            transform: "scaleY(0)",
          }}
        />
      </div>

      {/* Steps */}
      <div className="relative space-y-8">
        {steps.map((step, index) => {
          const isLeft = index % 2 === 0;
          const isActive = activeIndex === index;
          const isCompleted = activeIndex > index;
          const color = getColor(step.color);

          return (
            <div key={step.id} className="step-row relative">
              <div className="grid grid-cols-[1fr_100px_1fr] items-center gap-6">
                {/* Left Side */}
                <div className={isLeft ? "" : "pointer-events-none opacity-0"}>
                  {isLeft && (
                    <StepCard step={step} isActive={isActive} side="left" />
                  )}
                </div>

                {/* Center Timeline */}
                <div className="flex justify-center">
                  <TimelineNode
                    step={step}
                    isActive={isActive}
                    isCompleted={isCompleted}
                  />
                </div>

                {/* Right Side */}
                <div className={!isLeft ? "" : "pointer-events-none opacity-0"}>
                  {!isLeft && (
                    <StepCard step={step} isActive={isActive} side="right" />
                  )}
                </div>
              </div>

              {/* Connector Line Effect */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-4">
                  <div
                    className="h-16 w-px transition-colors duration-500"
                    style={{
                      backgroundColor: isCompleted
                        ? color
                        : "rgba(255,255,255,0.06)",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MOBILE TIMELINE - با ScrollTrigger
// ════════════════════════════════════════════════════════════════════

const MobileTimeline = memo(function MobileTimeline({
  steps,
  onStepChange,
}: {
  steps: ProcessStep[];
  onStepChange: (index: number) => void;
}) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!timelineRef.current) return;

    const stepElements = timelineRef.current.querySelectorAll(".mobile-step");

    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.fromTo(
        stepElements,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Each Step ScrollTrigger
      stepElements.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => {
            setActiveIndex(index);
            onStepChange(index);
          },
          onEnterBack: () => {
            setActiveIndex(index);
            onStepChange(index);
          },
        });
      });
    }, timelineRef);

    return () => ctx.revert();
  }, [onStepChange]);

  return (
    <div ref={timelineRef} className="relative lg:hidden">
      {steps.map((step, index) => {
        const color = getColor(step.color);
        const isActive = activeIndex === index;
        const isCompleted = activeIndex > index;
        const isLast = index === steps.length - 1;
        const isHighlighted = isActive || isCompleted;

        return (
          <div key={step.id} className="mobile-step relative flex gap-5">
            {/* Timeline Column */}
            <div className="flex flex-col items-center">
              {/* Node */}
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div
                  className="absolute inset-0 rotate-45 border-2 transition-all duration-300"
                  style={{
                    borderColor: isActive
                      ? color
                      : isCompleted
                        ? `${color}60`
                        : "rgba(255,255,255,0.08)",
                    backgroundColor: isActive ? `${color}20` : "transparent",
                    transform: isActive
                      ? "rotate(45deg) scale(1.1)"
                      : "rotate(45deg)",
                  }}
                />
                <span
                  className="relative z-10 text-xs font-bold transition-all duration-300"
                  style={{
                    color: isHighlighted ? color : "rgba(255,255,255,0.25)",
                    transform: isActive ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  {step.number}
                </span>

                {/* Active Pulse */}
                {isActive && (
                  <div
                    className="absolute inset-0 rotate-45 animate-ping border-2"
                    style={{ borderColor: color, animationDuration: "1.5s" }}
                  />
                )}
              </div>

              {/* Vertical Line */}
              {!isLast && (
                <div
                  className="relative w-px flex-1"
                  style={{ minHeight: "100px" }}
                >
                  <div className="absolute inset-0 bg-white/[0.06]" />
                  <div
                    className="absolute left-0 top-0 w-full origin-top transition-transform duration-500"
                    style={{
                      height: "100%",
                      backgroundColor: color,
                      transform: isCompleted
                        ? "scaleY(1)"
                        : isActive
                          ? "scaleY(0.5)"
                          : "scaleY(0)",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Card */}
            <div className="flex-1 pb-6">
              <StepCard step={step} isActive={isActive} side="right" />
            </div>
          </div>
        );
      })}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// STEP INDICATORS (Top Mini Progress)
// ════════════════════════════════════════════════════════════════════

const StepIndicators = memo(function StepIndicators({
  steps,
  activeIndex,
}: {
  steps: ProcessStep[];
  activeIndex: number;
}) {
  return (
    <div className="mb-12 flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const color = getColor(step.color);
        const isActive = activeIndex === index;
        const isCompleted = activeIndex > index;
        const isHighlighted = isActive || isCompleted;

        return (
          <React.Fragment key={step.id}>
            {/* Step Dot */}
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div
                className="absolute inset-0 rotate-45 border transition-all duration-300"
                style={{
                  borderColor: isHighlighted ? color : "rgba(255,255,255,0.1)",
                  backgroundColor: isActive ? `${color}20` : "transparent",
                  transform: isActive
                    ? "rotate(45deg) scale(1.1)"
                    : "rotate(45deg)",
                }}
              />
              <span
                className="relative z-10 text-xs font-bold transition-colors duration-300"
                style={{
                  color: isHighlighted ? color : "rgba(255,255,255,0.3)",
                }}
              >
                {index + 1}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className="h-px w-8 transition-colors duration-300 md:w-12"
                style={{
                  backgroundColor: isCompleted
                    ? color
                    : "rgba(255,255,255,0.1)",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA SECTION
// ════════════════════════════════════════════════════════════════════

const CTASection = memo(function CTASection({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ctaRef}
      className="mt-20 flex flex-col items-center gap-6 text-center lg:mt-24"
    >
      {/* Decorative */}
      <div className="flex items-center gap-4">
        <div
          className="h-px w-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}40)`,
          }}
        />
        <div
          className="h-3 w-3 rotate-45 border"
          style={{ borderColor: colors.primary }}
        />
        <div
          className="h-px w-12"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}40, transparent)`,
          }}
        />
      </div>

      <p className="max-w-md text-white/50">
        Ready to transform your digital presence?
      </p>

      <Link
        href={href}
        className="group relative overflow-hidden px-10 py-5 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-300"
        style={{ backgroundColor: colors.primary }}
      >
        <span className="relative z-10 flex items-center gap-3">
          {text}
          <span className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
            {Icons.arrow}
          </span>
        </span>
        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Link>

      <p className="flex items-center gap-2 text-xs text-white/30">
        <span className="h-4 w-4" style={{ color: colors.secondary }}>
          {Icons.check}
        </span>
        Free consultation • No commitment required
      </p>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const ProcessSection: React.FC<ProcessSectionProps> = ({
  headline = "Our Process: From Strategy to Scalable Results",
  subheadline = "How We Work",
  description = "A proven methodology that transforms your vision into a high-performing digital asset.",
  steps = defaultSteps,
  ctaText = "Start Your Project Today",
  ctaHref = "/contact",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  // Header Animation
  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      if (!headerRef.current) return;
      gsap.fromTo(
        headerRef.current.querySelectorAll(".header-anim"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const handleStepChange = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: colors.dark }}
    >
      <Background />

      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Header */}
        <div
          ref={headerRef}
          className="mx-auto mb-16 max-w-3xl text-center lg:mb-20"
        >
        

          {/* Headline */}
          <h2 className="header-anim mb-6 text-3xl font-black text-white md:text-4xl lg:text-5xl">
            Our Process: From{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Strategy
            </span>{" "}
            to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`,
              }}
            >
              Scalable Results
            </span>
          </h2>

          {/* Description */}
          <p className="header-anim text-base leading-relaxed text-white/50 md:text-lg">
            {description}
          </p>
        </div>

        {/* Step Indicators */}
        <StepIndicators steps={steps} activeIndex={activeStep} />

        {/* Desktop Timeline */}
        <DesktopTimeline steps={steps} onStepChange={handleStepChange} />

        {/* Mobile Timeline */}
        <MobileTimeline steps={steps} onStepChange={handleStepChange} />

        {/* CTA */}
        <CTASection text={ctaText} href={ctaHref} />
      </div>

      {/* Decorative Corners */}
      <div className="pointer-events-none absolute left-8 top-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.secondary}40, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-px w-20"
          style={{
            background: `linear-gradient(90deg, ${colors.secondary}40, transparent)`,
          }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(0deg, ${colors.accent}30, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-px w-20"
          style={{
            background: `linear-gradient(270deg, ${colors.accent}30, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default memo(ProcessSection);
export type { ProcessSectionProps, ProcessStep };
