// app/components/sections/SeoServicePlansSection.tsx
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

interface SeoPlan {
  id: string;
  badge: string;
  badgeIcon: string;
  name: string;
  price: string;
  period: string;
  bestFor: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  accentColor: string;
}

interface SeoServicePlansProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════

const SEO_PLANS: SeoPlan[] = [
  {
    id: "seo-starter",
    badge: "Starter",
    badgeIcon: "🔹",
    name: "SEO Starter Plan",
    price: "$600",
    period: "/ month",
    bestFor: "Local businesses & small websites",
    features: [
      "Keyword research & mapping",
      "On-page SEO optimization (up to 5 pages/month)",
      "Technical SEO checkup",
      "Basic internal linking strategy",
      "Monthly performance report",
    ],
    cta: "Start SEO",
    accentColor: "#06B6D4", // Cyan
  },
  {
    id: "seo-growth",
    badge: "Popular",
    badgeIcon: "🔥",
    name: "SEO Growth Plan",
    price: "$1,200",
    period: "/ month",
    bestFor: "Competitive industries & scaling brands",
    features: [
      "Full technical SEO monitoring",
      "Content strategy & blog planning",
      "On-page SEO optimization (up to 12 pages/month)",
      "Competitor analysis",
      "Internal linking optimization",
      "Monthly reporting + growth roadmap",
    ],
    cta: "Choose Growth Plan",
    highlighted: true,
    accentColor: "#F59E0B", // Amber
  },
  {
    id: "seo-authority",
    badge: "Authority",
    badgeIcon: "🏆",
    name: "SEO Authority Plan",
    price: "$2,500+",
    period: "/ month",
    bestFor: "Brands that want top rankings fast",
    features: [
      "Full SEO strategy system",
      "Advanced technical SEO audits",
      "High-volume content production plan",
      "Conversion optimization for SEO pages",
      "Link-building strategy (optional add-on)",
      "Weekly reporting & strategy calls",
    ],
    cta: "Request Custom SEO Plan",
    accentColor: "#8B5CF6", // Violet
  },
];

// ════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════

const CheckIcon = memo(function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.5 4.5L6.5 11.5L3 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const TrendIcon = memo(function TrendIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 17L9 11L12 14L17 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 7H17V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const SeoPricingCard = memo(function SeoPricingCard({
  plan,
  index,
}: {
  plan: SeoPlan;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Light streak animation
  useEffect(() => {
    if (!lightRef.current || reducedMotion) return;

    const tween = gsap.to(lightRef.current, {
      xPercent: 400,
      duration: 12 + index * 2,
      ease: "none",
      repeat: -1,
      delay: index * 2,
    });

    return () => {
      tween.kill();
    };
  }, [reducedMotion, index]);

  return (
    <article
      ref={cardRef}
      className={`
        seo-card relative flex flex-col overflow-hidden
        border bg-white/2 backdrop-blur-sm
        transition-all duration-500 ease-out
        ${
          plan.highlighted
            ? "border-amber-500/30 lg:-my-4 lg:py-4"
            : "border-white/[0.08]"
        }
        ${isHovered ? "scale-[1.02] border-white/[0.15]" : "scale-100"}
      `}
      style={{
        boxShadow: plan.highlighted
          ? "0 0 80px -20px rgba(245,158,11,0.2), 0 25px 50px -12px rgba(0,0,0,0.4)"
          : "0 25px 50px -12px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Accent Line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${plan.accentColor}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Light Streak */}
      {!reducedMotion && (
        <div
          ref={lightRef}
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full opacity-50"
          style={{
            background: `linear-gradient(90deg, transparent, ${plan.accentColor}0A, transparent)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Content */}
      <div className="relative flex flex-1 flex-col p-6 md:p-8">
        {/* Badge Row */}
        <div className="mb-6 flex items-center justify-between">
          <span
            className={`
              inline-flex items-center gap-1.5 rounded-full px-3 py-1
              text-xs font-medium uppercase tracking-wider
              ${
                plan.highlighted
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-white/5 text-white/50"
              }
            `}
          >
            <span>{plan.badgeIcon}</span>
            {plan.badge}
          </span>

          {plan.highlighted && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400/70">
              <TrendIcon />
              Best Value
            </span>
          )}
        </div>

        {/* Plan Name */}
        <h3 className="mb-4 text-xl font-semibold text-white md:text-2xl">
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span
              className="text-4xl font-bold tracking-tight md:text-5xl"
              style={{ color: plan.highlighted ? "#F59E0B" : "#fff" }}
            >
              {plan.price}
            </span>
            <span className="text-base text-white/40">{plan.period}</span>
          </div>
        </div>

        {/* Best For */}
        <p className="mb-6 text-sm text-white/50">
          <span className="text-white/30">Best for:</span> {plan.bestFor}
        </p>

        {/* Divider */}
        <div className="mb-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Features */}
        <ul className="mb-8 flex-1 space-y-3" role="list">
          {plan.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-white/60"
            >
              <CheckIcon color={plan.accentColor} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className={`
            group relative w-full overflow-hidden py-3.5 text-sm font-semibold uppercase tracking-wider
            transition-all duration-300
            ${
              plan.highlighted
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : "border border-white/20 text-white hover:border-white/40 hover:bg-white/5"
            }
          `}
          aria-label={`${plan.cta} - ${plan.name}`}
        >
          {/* Button Shimmer */}
          <span
            className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            aria-hidden="true"
          />
          <span className="relative">{plan.cta}</span>
        </button>
      </div>

      {/* Corner Markers */}
      <div
        className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/10"
        aria-hidden="true"
      />
    </article>
  );
});

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

function SeoServicePlansSectionComponent({
  className = "",
}: SeoServicePlansProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return;

    const header = headerRef.current;
    const cards = cardsRef.current.querySelectorAll(".seo-card");
    const note = noteRef.current;

    if (reducedMotion) {
      gsap.set([header, ...Array.from(cards), note], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(header, { opacity: 0, y: 30 });
      gsap.set(cards, { opacity: 0, y: 50 });
      gsap.set(note, { opacity: 0, y: 20 });

      // Header entrance
      gsap.to(header, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          once: true,
        },
      });

      // Cards stagger entrance
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Note entrance
      gsap.to(note, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: note,
          start: "top 95%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="seo-service-plans"
      className={`relative overflow-hidden bg-[#0A0D14] py-24 md:py-32 lg:py-40 ${className}`}
      aria-labelledby="seo-plans-heading"
    >
      {/* Background Grid */}
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

      {/* Ambient Glows - Cyan theme for SEO */}
      <div
        className="pointer-events-none absolute -right-48 top-1/3 h-[900px] w-[900px] rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-1/4 h-150 w-150 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #F59E0B 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/3 top-0 h-100 w-100 -translate-y-1/2 rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="mx-auto mb-16 max-w-2xl text-center md:mb-20"
        >
          {/* Label */}
          <div className="mb-4 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            <span className="h-px w-8 bg-linear-to-r from-transparent to-cyan-500/30" />
            <span className="text-cyan-400/70">Monthly Plans</span>
            <span className="h-px w-8 bg-linear-to-l from-transparent to-cyan-500/30" />
          </div>

          {/* Title */}
          <h2
            id="seo-plans-heading"
            className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            SEO Service <span className="text-cyan-400">Plans</span>
          </h2>

          {/* Intro Text */}
          <p className="text-base leading-relaxed text-white/50 md:text-lg">
            SEO is a{" "}
            <span className="text-white/70">long-term growth engine</span>. Our
            SEO plans are designed to build consistent rankings and{" "}
            <span className="text-cyan-400/80">
              organic traffic that converts
            </span>
            .
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          ref={cardsRef}
          className="grid gap-6 md:gap-8 lg:grid-cols-3 lg:items-start"
        >
          {SEO_PLANS.map((plan, index) => (
            <SeoPricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* Transparency Note */}
        <div ref={noteRef} className="mx-auto mt-12 max-w-2xl md:mt-16">
          <div className="relative overflow-hidden border border-white/[0.06] bg-white/2 p-6 md:p-8">
            {/* Note accent */}
            <div
              className="absolute left-0 top-0 h-full w-px"
              style={{
                background:
                  "linear-gradient(180deg, transparent, #06B6D4, transparent)",
              }}
              aria-hidden="true"
            />

            <div className="flex items-start gap-4">
              {/* Info icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
                <svg
                  className="h-4 w-4 text-cyan-400"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 7V11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="5" r="0.5" fill="currentColor" />
                </svg>
              </div>

              {/* Note text */}
              <p className="text-sm leading-relaxed text-white/50">
                <span className="font-medium text-white/70">
                  Transparency matters.
                </span>{" "}
                SEO results depend on industry competition and website
                condition. We provide{" "}
                <span className="text-cyan-400/80">realistic timelines</span>{" "}
                and{" "}
                <span className="text-cyan-400/80">transparent reporting</span>{" "}
                — no false promises.
              </p>
            </div>

            {/* Corner markers */}
            <div
              className="pointer-events-none absolute right-3 top-3 h-2 w-2 border-r border-t border-white/10"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 border-b border-r border-white/10"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* System Marker */}
        <div
          className="mt-16 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/15"
          aria-hidden="true"
        >
          SYS::SEO_SERVICES • MONTHLY RECURRING
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div
        className="absolute bottom-0 left-1/2 h-px w-2/3 max-w-4xl -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6,182,212,0.2), transparent)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════

export const SeoServicePlansSection = memo(SeoServicePlansSectionComponent);
export default SeoServicePlansSection;
