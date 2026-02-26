// app/components/sections/PricingIntroSection.tsx
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

interface PricingIntroProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

function PricingIntroSectionComponent({ className = "" }: PricingIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Entrance + Light streak animations
  useEffect(() => {
    if (!panelRef.current || !contentRef.current) return;

    const panel = panelRef.current;
    const content = contentRef.current;
    const light = lightRef.current;
    const children = content.children;

    // Skip animations for reduced motion
    if (reducedMotion) {
      gsap.set([panel, ...Array.from(children)], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(panel, { opacity: 0, y: 40 });
      gsap.set(children, { opacity: 0, y: 24 });

      // Entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 85%",
          once: true,
        },
      });

      tl.to(panel, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      tl.to(
        children,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.5",
      );

      // Light streak — continuous
      if (light) {
        gsap.to(light, {
          xPercent: 300,
          duration: 8,
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
      id="pricing-intro"
      className={`relative overflow-hidden bg-[#0A0D14] py-24 md:py-32 lg:py-40 ${className}`}
      aria-labelledby="pricing-intro-heading"
    >
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #fff 1px, transparent 1px),
            linear-gradient(180deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
        aria-hidden="true"
      />

      {/* Ambient Glow */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-125 w-125 translate-x-1/2 translate-y-1/2 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Glass Panel */}
        <div
          ref={panelRef}
          className="relative overflow-hidden border border-white/[0.08] bg-white/2 backdrop-blur-sm"
          style={{
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.05) inset, 0 25px 50px -12px rgba(0,0,0,0.4)",
          }}
        >
          {/* Top Accent Line */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #F59E0B 30%, #06B6D4 70%, transparent)",
            }}
            aria-hidden="true"
          />

          {/* Light Streak */}
          {!reducedMotion && (
            <div
              ref={lightRef}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(245,158,11,0.04), transparent)",
              }}
              aria-hidden="true"
            />
          )}

          {/* Panel Content */}
          <div
            ref={contentRef}
            className="relative px-8 py-12 md:px-14 md:py-16 lg:px-20 lg:py-16"
          >
            {/* Label */}
            <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Pricing Philosophy
            </div>

            {/* Heading */}
            <h2
              id="pricing-intro-heading"
              className="mb-8 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              Pricing Built for <span className="text-amber-400">Growth</span>
              <span className="text-white/80">,</span>
              <br className="hidden sm:block" /> Not Just Design
            </h2>

            {/* Paragraphs */}
            <div className="max-w-2xl space-y-5 text-base leading-relaxed text-white/55 md:text-lg md:leading-relaxed">
              <p>
                Our pricing is based on one principle:{" "}
                <span className="text-white/80">
                  building systems that generate long-term results.
                </span>
              </p>

              <p>
                We don't sell "cheap websites." We build{" "}
                <span className="text-white/80">high-performance websites</span>{" "}
                with <span className="text-cyan-400">premium design</span>,
                SEO-ready structure, and scalable automation potential.
              </p>

              <p>
                Every plan includes professional consultation, clean
                development, and strategic structure to ensure your investment
                turns into{" "}
                <span className="text-amber-400">real business value</span>.
              </p>
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
        </div>

        {/* System Marker */}
        <div
          className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/20"
          aria-hidden="true"
        >
          SYS::PRICING_001 • v2.4.1
        </div>
      </div>
    </section>
  );
}

export const PricingIntroSection = memo(PricingIntroSectionComponent);
export default PricingIntroSection;
