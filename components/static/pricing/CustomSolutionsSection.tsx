// app/components/sections/CustomSolutionsSection.tsx
"use client";

import { useRef, useEffect, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ════════════════════════════════════════════════════════════════
// REGISTER GSAP
// ════════════════════════════════════════════════════════════════

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════

interface CustomSolutionsProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════

const IDEAL_CLIENTS = [
  { label: "SaaS companies", icon: "◈" },
  { label: "Real estate platforms", icon: "◈" },
  { label: "Marketplaces", icon: "◈" },
  { label: "Large e-commerce stores", icon: "◈" },
  { label: "Agencies and enterprise clients", icon: "◈" },
];

// ════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════

const FloatingOrb = memo(function FloatingOrb({
  color,
  size,
  position,
  delay = 0,
}: {
  color: string;
  size: number;
  position: { x: string; y: string };
  delay?: number;
}) {
  const orbRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!orbRef.current || reducedMotion) return;

    const tween = gsap.to(orbRef.current, {
      y: "+=20",
      x: "+=10",
      duration: 4 + delay,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay,
    });

    return () => {
      tween.kill();
    };
  }, [reducedMotion, delay]);

  return (
    <div
      ref={orbRef}
      className="pointer-events-none absolute rounded-full will-change-transform"
      style={{
        width: size,
        height: size,
        left: position.x,
        top: position.y,
        background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}10, transparent 70%)`,
        filter: "blur(1px)",
      }}
      aria-hidden="true"
    />
  );
});

const DiamondIcon = memo(function DiamondIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 2V22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path
        d="M2 8.5L22 15.5M22 8.5L2 15.5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
});

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

function CustomSolutionsSectionComponent({
  className = "",
}: CustomSolutionsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Animations
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const content = contentRef.current;
    const listItems = listRef.current?.querySelectorAll("li") || [];
    const cta = ctaRef.current;
    const light = lightRef.current;

    if (reducedMotion) {
      gsap.set([content, ...Array.from(listItems), cta], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(content, { opacity: 0, y: 40 });
      gsap.set(listItems, { opacity: 0, x: -20 });
      gsap.set(cta, { opacity: 0, y: 20 });

      // Content entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(content, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      tl.to(
        listItems,
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
        },
        "-=0.4",
      );

      tl.to(
        cta,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3",
      );

      // Light sweep
      if (light) {
        gsap.to(light, {
          xPercent: 300,
          duration: 15,
          ease: "none",
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="custom-solutions"
      className={`relative overflow-hidden bg-[#0A0D14] py-24 md:py-32 lg:py-40 ${className}`}
      aria-labelledby="custom-solutions-heading"
    >
      {/* Background Elements */}
      <div
        className="pointer-events-none absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #fff 1px, transparent 1px),
            linear-gradient(180deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
        aria-hidden="true"
      />

      {/* Floating Orbs */}
      <FloatingOrb
        color="#8B5CF6"
        size={300}
        position={{ x: "10%", y: "20%" }}
        delay={0}
      />
      <FloatingOrb
        color="#F59E0B"
        size={200}
        position={{ x: "80%", y: "60%" }}
        delay={1}
      />
      <FloatingOrb
        color="#06B6D4"
        size={250}
        position={{ x: "70%", y: "10%" }}
        delay={2}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-[99%] md:max-w-[95%] px-4">
        <div
          className="relative overflow-hidden border border-white/[0.08] bg-linear-to-br from-white/[0.04] to-transparent backdrop-blur-sm"
          style={{
            boxShadow:
              "0 0 100px -30px rgba(139, 92, 246, 0.15), 0 25px 50px -12px rgba(0,0,0,0.4)",
          }}
        >
          {/* Top Gradient Line */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #8B5CF6, #F59E0B, #06B6D4, transparent)",
            }}
            aria-hidden="true"
          />

          {/* Light Streak */}
          {!reducedMotion && (
            <div
              ref={lightRef}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full opacity-40"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.08), transparent)",
              }}
              aria-hidden="true"
            />
          )}

          {/* Content Grid */}
          <div className="relative grid gap-12 p-8 md:grid-cols-2 md:gap-16 md:p-12 lg:p-16">
            {/* Left Column */}
            <div ref={contentRef}>
              {/* Label */}
              <div className="mb-6 flex items-center gap-3">
                <DiamondIcon className="h-5 w-5 text-violet-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/80">
                  Enterprise
                </span>
              </div>

              {/* Title */}
              <h2
                id="custom-solutions-heading"
                className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
              >
                Need a{" "}
                <span className="bg-linear-to-r from-violet-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
                  Custom Solution
                </span>
                ?
              </h2>

              {/* Description */}
              <p className="text-base leading-relaxed text-white/55 md:text-lg">
                If your project requires a{" "}
                <span className="text-white/80">full digital ecosystem</span>{" "}
                including website development, SEO growth strategy, AI
                automation tools, dashboards, and integrations — we offer{" "}
                <span className="text-amber-400/80">custom pricing</span> based
                on your exact requirements.
              </p>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-center">
              {/* Ideal For Label */}
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">
                Our custom solutions are ideal for:
              </p>

              {/* Client Types List */}
              <ul ref={listRef} className="mb-8 space-y-3" role="list">
                {IDEAL_CLIENTS.map((client, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center text-xs"
                      style={{
                        color: [
                          "#8B5CF6",
                          "#F59E0B",
                          "#06B6D4",
                          "#8B5CF6",
                          "#F59E0B",
                        ][i],
                      }}
                    >
                      {client.icon}
                    </span>
                    <span className="text-base">{client.label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div
                ref={ctaRef}
                className="flex flex-col gap-3 sm:flex-row sm:gap-4"
              >
                <button
                  className="group relative overflow-hidden bg-linear-to-r from-violet-500 to-violet-600 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:from-violet-400 hover:to-violet-500"
                  aria-label="Request a custom quote"
                >
                  <span
                    className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden="true"
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M13.5 4.5L6.5 11.5L3 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Request a Custom Quote
                  </span>
                </button>

                <button
                  className="group relative overflow-hidden border border-white/20 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
                  aria-label="Schedule a strategy call"
                >
                  <span
                    className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden="true"
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="6.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 4.5V8L10.5 9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Schedule a Strategy Call
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Corner Markers */}
          <div
            className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-white/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-white/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-white/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-white/10"
            aria-hidden="true"
          />
        </div>

        {/* System Marker */}
        <div
          className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/15"
          aria-hidden="true"
        >
          SYS::ENTERPRISE • CUSTOM_SOLUTIONS
        </div>
      </div>
    </section>
  );
}

export const CustomSolutionsSection = memo(CustomSolutionsSectionComponent);
export default CustomSolutionsSection;
