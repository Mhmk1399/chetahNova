// app/components/sections/AiToolsPricingSection.tsx
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

interface AiPlan {
  id: string;
  badge: string;
  badgeIcon: string;
  name: string;
  price: string;
  priceType: "one-time" | "subscription";
  priceLabel: string;
  bestFor: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  accentColor: string;
}

interface AiToolsPricingProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════

const AI_PLANS: AiPlan[] = [
  {
    id: "ai-starter",
    badge: "Starter",
    badgeIcon: "🤖",
    name: "AI Starter Tool",
    price: "$900",
    priceType: "one-time",
    priceLabel: "Starting from • One-time",
    bestFor: "Businesses that need 1 AI feature",
    features: [
      "AI chatbot setup (basic)",
      "FAQ training + business info setup",
      "Website integration",
      "Lead capture form connection",
      "7 days support after delivery",
    ],
    cta: "Get AI Tool",
    accentColor: "#8B5CF6", // Violet
  },
  {
    id: "ai-automation",
    badge: "Advanced",
    badgeIcon: "⚡",
    name: "AI Automation System",
    price: "$2,500",
    priceType: "one-time",
    priceLabel: "Starting from • One-time",
    bestFor: "Businesses that need automation workflows",
    features: [
      "AI lead qualification system",
      "AI support assistant + routing logic",
      "Automated booking assistant (optional)",
      "Workflow automation setup",
      "Dashboard reporting (basic)",
    ],
    cta: "Request AI Automation",
    accentColor: "#F59E0B", // Amber
  },
  {
    id: "ai-subscription",
    badge: "Smart Growth",
    badgeIcon: "🧠",
    name: "AI Subscription Plan",
    price: "$600",
    priceType: "subscription",
    priceLabel: "Monthly subscription",
    bestFor: "Companies that want continuous AI upgrades",
    features: [
      "Continuous AI improvements & updates",
      "Monthly AI training + optimization",
      "AI performance analytics",
      "Support & troubleshooting",
      "Automation scaling options",
      "Custom features added monthly",
    ],
    cta: "Start Subscription",
    highlighted: true,
    accentColor: "#06B6D4", // Cyan
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

const AiIcon = memo(function AiIcon({
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
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const NeuralPattern = memo(function NeuralPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="neural-grid"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="30" cy="30" r="1" fill="#8B5CF6" />
          <circle cx="0" cy="0" r="1" fill="#8B5CF6" />
          <circle cx="60" cy="0" r="1" fill="#8B5CF6" />
          <circle cx="0" cy="60" r="1" fill="#8B5CF6" />
          <circle cx="60" cy="60" r="1" fill="#8B5CF6" />
          <line
            x1="30"
            y1="30"
            x2="0"
            y2="0"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            opacity="0.5"
          />
          <line
            x1="30"
            y1="30"
            x2="60"
            y2="0"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            opacity="0.5"
          />
          <line
            x1="30"
            y1="30"
            x2="0"
            y2="60"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            opacity="0.5"
          />
          <line
            x1="30"
            y1="30"
            x2="60"
            y2="60"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#neural-grid)" />
    </svg>
  );
});

const PriceTypeBadge = memo(function PriceTypeBadge({
  type,
  color,
}: {
  type: "one-time" | "subscription";
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {type === "subscription" ? (
        <>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          Monthly
        </>
      ) : (
        <>
          <span className="h-1 w-1 rounded-full bg-current" />
          One-time
        </>
      )}
    </span>
  );
});

const AiPricingCard = memo(function AiPricingCard({
  plan,
  index,
}: {
  plan: AiPlan;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Light streak + pulse animations
  useEffect(() => {
    if (reducedMotion) return;

    const tweens: gsap.core.Tween[] = [];

    if (lightRef.current) {
      tweens.push(
        gsap.to(lightRef.current, {
          xPercent: 400,
          duration: 10 + index * 3,
          ease: "none",
          repeat: -1,
          delay: index * 1.5,
        }),
      );
    }

    // Ambient glow pulse for highlighted card
    if (pulseRef.current && plan.highlighted) {
      tweens.push(
        gsap.to(pulseRef.current, {
          opacity: 0.08,
          scale: 1.1,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }),
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [reducedMotion, index, plan.highlighted]);

  return (
    <article
      ref={cardRef}
      className={`
        ai-card relative flex flex-col overflow-hidden
        border bg-white/2 backdrop-blur-sm
        transition-all duration-500 ease-out
        ${
          plan.highlighted
            ? "border-cyan-500/30 lg:-my-6 lg:py-6"
            : "border-white/[0.08]"
        }
        ${isHovered ? "scale-[1.02] border-white/[0.15]" : "scale-100"}
      `}
      style={{
        boxShadow: plan.highlighted
          ? "0 0 100px -20px rgba(6,182,212,0.2), 0 25px 50px -12px rgba(0,0,0,0.4)"
          : "0 25px 50px -12px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow for highlighted */}
      {plan.highlighted && (
        <div
          ref={pulseRef}
          className="pointer-events-none absolute -inset-4 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle at center, ${plan.accentColor} 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

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
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${plan.accentColor}0A, transparent)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Content */}
      <div className="relative flex flex-1 flex-col p-6 md:p-8">
        {/* Badge Row */}
        <div className="mb-5 flex items-center justify-between gap-2">
          <span
            className={`
              inline-flex items-center gap-1.5 rounded-full px-3 py-1
              text-xs font-medium uppercase tracking-wider
              ${
                plan.highlighted
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "bg-white/5 text-white/50"
              }
            `}
          >
            <span>{plan.badgeIcon}</span>
            {plan.badge}
          </span>

          <PriceTypeBadge type={plan.priceType} color={plan.accentColor} />
        </div>

        {/* Plan Name */}
        <h3 className="mb-4 text-xl font-semibold text-white md:text-2xl">
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl font-bold tracking-tight md:text-5xl"
              style={{ color: plan.highlighted ? plan.accentColor : "#fff" }}
            >
              {plan.price}
            </span>
            {plan.priceType === "subscription" && (
              <span className="text-base text-white/40">/ month</span>
            )}
          </div>
          <span className="mt-1 block text-xs uppercase tracking-wider text-white/30">
            {plan.priceLabel}
          </span>
        </div>

        {/* Best For */}
        <p className="mb-6 text-sm text-white/50">
          <span className="text-white/30">Best for:</span> {plan.bestFor}
        </p>

        {/* Divider */}
        <div
          className="mb-6 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${plan.accentColor}30, transparent)`,
          }}
        />

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
                ? "bg-cyan-500 text-black hover:bg-cyan-400"
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
          <span className="relative flex items-center justify-center gap-2">
            {plan.priceType === "subscription" && (
              <AiIcon className="h-4 w-4" />
            )}
            {plan.cta}
          </span>
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

function AiToolsPricingSectionComponent({
  className = "",
}: AiToolsPricingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const enterpriseRef = useRef<HTMLDivElement>(null);

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
    const cards = cardsRef.current.querySelectorAll(".ai-card");
    const enterprise = enterpriseRef.current;

    if (reducedMotion) {
      gsap.set([header, ...Array.from(cards), enterprise], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(header, { opacity: 0, y: 30 });
      gsap.set(cards, { opacity: 0, y: 50 });
      gsap.set(enterprise, { opacity: 0, y: 20 });

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

      // Enterprise CTA entrance
      gsap.to(enterprise, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: enterprise,
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
      id="ai-tools-pricing"
      className={`relative overflow-hidden bg-[#0A0D14] py-24 md:py-32 lg:py-40 ${className}`}
      aria-labelledby="ai-pricing-heading"
    >
      {/* Neural Pattern Background */}
      <NeuralPattern />

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

      {/* Ambient Glows - Violet/Purple theme for AI */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-150 w-150 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/4 h-125 w-125 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #F59E0B 0%, transparent 60%)",
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
          <div className="mb-4 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            <span className="h-px w-8 bg-linear-to-r from-transparent to-violet-500/30" />
            <span className="flex items-center gap-2 text-violet-400/70">
              <AiIcon className="h-3.5 w-3.5" />
              AI Solutions
            </span>
            <span className="h-px w-8 bg-linear-to-l from-transparent to-violet-500/30" />
          </div>

          {/* Title */}
          <h2
            id="ai-pricing-heading"
            className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            AI Tools{" "}
            <span className="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>

          {/* Intro Text */}
          <p className="text-base leading-relaxed text-white/50 md:text-lg">
            Our AI tools can be delivered as{" "}
            <span className="text-violet-400/80">one-time integrations</span> or
            as{" "}
            <span className="text-cyan-400/80">
              monthly subscription systems
            </span>{" "}
            with continuous training and upgrades.
          </p>

          {/* Pricing Type Legend */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/40">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500/50" />
              One-time payment
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
              Monthly subscription
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div
          ref={cardsRef}
          className="grid gap-6 md:gap-8 lg:grid-cols-3 lg:items-start"
        >
          {AI_PLANS.map((plan, index) => (
            <AiPricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* Enterprise CTA */}
        <div ref={enterpriseRef} className="mx-auto mt-12 max-w-3xl md:mt-16">
          <div
            className="relative overflow-hidden border border-violet-500/20 bg-linear-to-r from-violet-500/5 via-transparent to-cyan-500/5 p-8 md:p-10"
            style={{
              boxShadow: "0 0 60px -20px rgba(139, 92, 246, 0.15)",
            }}
          >
            {/* Accent lines */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #8B5CF6, #06B6D4, transparent)",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #06B6D4, #8B5CF6, transparent)",
              }}
              aria-hidden="true"
            />

            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              {/* Icon */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500/20 to-cyan-500/20">
                <AiIcon className="h-8 w-8 text-violet-400" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-white md:text-xl">
                  Want a fully custom AI platform?
                </h3>
                <p className="text-sm text-white/50 md:text-base">
                  We offer{" "}
                  <span className="text-violet-400">
                    enterprise AI solutions
                  </span>{" "}
                  for scalable businesses with unique requirements and
                  high-volume needs.
                </p>
              </div>

              {/* CTA */}
              <button
                className="group relative shrink-0 overflow-hidden border border-violet-500/30 bg-violet-500/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-violet-400 transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/20"
                aria-label="Contact us for enterprise AI solutions"
              >
                <span
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-violet-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden="true"
                />
                <span className="relative">Contact Enterprise</span>
              </button>
            </div>

            {/* Corner markers */}
            <div
              className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-violet-500/30"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-violet-500/30"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-violet-500/30"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-violet-500/30"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* System Marker */}
        <div
          className="mt-16 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/15"
          aria-hidden="true"
        >
          SYS::AI_TOOLS • ONE-TIME + SUBSCRIPTION
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div
        className="absolute bottom-0 left-1/2 h-px w-2/3 max-w-4xl -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2), transparent)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════

export const AiToolsPricingSection = memo(AiToolsPricingSectionComponent);
export default AiToolsPricingSection;
