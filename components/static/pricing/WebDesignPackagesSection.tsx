// app/components/sections/WebDesignPackagesSection.tsx
'use client';

import { useRef, useEffect, useState, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ════════════════════════════════════════════════════════════════
// REGISTER GSAP
// ════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════

interface PricingPlan {
  id: string;
  badge: string;
  badgeIcon: string;
  name: string;
  price: string;
  priceNote: string;
  bestFor: string;
  features: string[];
  deliveryTime: string;
  cta: string;
  highlighted?: boolean;
  accentColor: string;
}

interface WebDesignPackagesProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════

const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    badge: 'Starter',
    badgeIcon: '✅',
    name: 'Starter Website',
    price: '$1,200',
    priceNote: 'Starting from',
    bestFor: 'Small businesses & personal brands',
    features: [
      'Up to 5 pages',
      'Responsive design (mobile/tablet/desktop)',
      'Basic UI/UX structure',
      'Contact form integration',
      'Speed optimization',
      'Basic SEO structure (meta + headings)',
      '2 rounds of revisions',
    ],
    deliveryTime: '7 to 14 business days',
    cta: 'Get Started',
    accentColor: '#6B7280', // Gray
  },
  {
    id: 'business',
    badge: 'Popular',
    badgeIcon: '🚀',
    name: 'Business Growth Website',
    price: '$2,500',
    priceNote: 'Starting from',
    bestFor: 'Companies that want a high-converting website',
    features: [
      'Up to 10 pages',
      'Premium UI/UX design',
      'Conversion-focused landing page structure',
      'Advanced responsive design',
      'Performance optimization (Core Web Vitals)',
      'SEO-ready architecture',
      'Blog setup (optional)',
      'Lead capture system',
      '3 rounds of revisions',
    ],
    deliveryTime: '14 to 21 business days',
    cta: 'Choose This Plan',
    highlighted: true,
    accentColor: '#F59E0B', // Amber
  },
  {
    id: 'premium',
    badge: 'Premium',
    badgeIcon: '👑',
    name: 'Premium Custom Website',
    price: '$5,000+',
    priceNote: 'Starting from',
    bestFor: 'Brands, startups, and scalable businesses',
    features: [
      'Fully custom website (unlimited pages)',
      'Custom animations & premium UI design',
      'Full UX planning & user journey mapping',
      'Advanced conversion strategy',
      'Technical SEO setup + schema markup',
      'API integrations (CRM, booking, payments)',
      'Custom dashboards (optional)',
      'Multi-language setup (optional)',
    ],
    deliveryTime: '3 to 6 weeks',
    cta: 'Request a Quote',
    accentColor: '#8B5CF6', // Violet
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

const PricingCard = memo(function PricingCard({
  plan,
  index,
}: {
  plan: PricingPlan;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Light streak animation
  useEffect(() => {
    if (!lightRef.current || reducedMotion) return;

    const tween = gsap.to(lightRef.current, {
      xPercent: 400,
      duration: 10 + index * 2,
      ease: 'none',
      repeat: -1,
      delay: index * 1.5,
    });

    return () => { tween.kill(); };
  }, [reducedMotion, index]);

  return (
    <article
      ref={cardRef}
      className={`
        pricing-card relative flex flex-col overflow-hidden
        border bg-white/2 backdrop-blur-sm
        transition-transform duration-500 ease-out
        ${plan.highlighted
          ? 'border-amber-500/30 lg:-my-4 lg:py-4'
          : 'border-white/[0.08]'
        }
        ${isHovered ? 'scale-[1.02]' : 'scale-100'}
      `}
      style={{
        boxShadow: plan.highlighted
          ? '0 0 60px -12px rgba(245,158,11,0.15), 0 25px 50px -12px rgba(0,0,0,0.4)'
          : '0 25px 50px -12px rgba(0,0,0,0.3)',
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
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${plan.accentColor}08, transparent)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Content */}
      <div className="relative flex flex-1 flex-col p-6 md:p-8">
        {/* Badge */}
        <div className="mb-6 flex items-center justify-between">
          <span
            className={`
              inline-flex items-center gap-1.5 rounded-full px-3 py-1
              text-xs font-medium uppercase tracking-wider
              ${plan.highlighted
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-white/5 text-white/50'
              }
            `}
          >
            <span>{plan.badgeIcon}</span>
            {plan.badge}
          </span>

          {plan.highlighted && (
            <span className="text-xs font-medium uppercase tracking-wider text-amber-400/60">
              Most Popular
            </span>
          )}
        </div>

        {/* Plan Name */}
        <h3 className="mb-4 text-xl font-semibold text-white md:text-2xl">
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <span className="text-xs uppercase tracking-wider text-white/40">
            {plan.priceNote}
          </span>
          <div
            className="mt-1 text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: plan.highlighted ? '#F59E0B' : '#fff' }}
          >
            {plan.price}
          </div>
        </div>

        {/* Best For */}
        <p className="mb-6 text-sm text-white/50">
          <span className="text-white/30">Best for:</span>{' '}
          {plan.bestFor}
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

        {/* Delivery Time */}
        <div className="mb-6 flex items-center gap-2 text-xs text-white/40">
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" />
            <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span>Delivery: {plan.deliveryTime}</span>
        </div>

        {/* CTA Button */}
        <button
          className={`
            group relative w-full overflow-hidden py-3.5 text-sm font-semibold uppercase tracking-wider
            transition-all duration-300
            ${plan.highlighted
              ? 'bg-amber-500 text-black hover:bg-amber-400'
              : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5'
            }
          `}
          aria-label={`${plan.cta} - ${plan.name}`}
        >
          {/* Button Shimmer */}
          <span
            className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            aria-hidden="true"
          />
          <span className="relative">{plan.cta}</span>
        </button>
      </div>

      {/* Corner Markers */}
      <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-white/10" aria-hidden="true" />
      <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-white/10" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-white/10" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/10" aria-hidden="true" />
    </article>
  );
});

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

function WebDesignPackagesSectionComponent({ className = '' }: WebDesignPackagesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return;

    const header = headerRef.current;
    const cards = cardsRef.current.querySelectorAll('.pricing-card');
    const note = noteRef.current;

    if (reducedMotion) {
      gsap.set([header, ...Array.from(cards), note], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(header, { opacity: 0, y: 30 });
      gsap.set(cards, { opacity: 0, y: 50 });
      gsap.set(note, { opacity: 0 });

      // Header entrance
      gsap.to(header, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
        },
      });

      // Cards stagger entrance
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      // Note fade in
      gsap.to(note, {
        opacity: 1,
        duration: 0.6,
        delay: 0.3,
        scrollTrigger: {
          trigger: note,
          start: 'top 90%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="web-design-packages"
      className={`relative overflow-hidden bg-[#0A0D14] py-24 md:py-32 lg:py-40 ${className}`}
      aria-labelledby="packages-heading"
    >
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #fff 1px, transparent 1px),
            linear-gradient(180deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      {/* Ambient Glows */}
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-[800px] w-[800px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 60%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/4 h-150 w-150 rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 60%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          {/* Label */}
          <div className="mb-4 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            <span className="h-px w-8 bg-linear-to-r from-transparent to-white/20" />
            Our Services
            <span className="h-px w-8 bg-linear-to-l from-transparent to-white/20" />
          </div>

          {/* Title */}
          <h2
            id="packages-heading"
            className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            Web Design{' '}
            <span className="text-amber-400">Packages</span>
          </h2>

          {/* Intro Text */}
          <p className="text-base leading-relaxed text-white/50 md:text-lg">
            Perfect for businesses that want a professional website built for{' '}
            <span className="text-white/70">speed</span>,{' '}
            <span className="text-white/70">branding</span>, and{' '}
            <span className="text-white/70">lead generation</span>.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          ref={cardsRef}
          className="grid gap-6 md:gap-8 lg:grid-cols-3 lg:items-start"
        >
          {PLANS.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* E-commerce Note */}
        <div
          ref={noteRef}
          className="mt-12 flex items-center justify-center gap-3 md:mt-16"
        >
          <div className="h-px w-12 bg-linear-to-r from-transparent to-white/20" />
          <p className="text-center text-sm text-white/40">
            Need an <span className="text-cyan-400">e-commerce website</span>?{' '}
            <a
              href="#contact"
              className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/40"
            >
              Contact us for custom store pricing
            </a>
          </p>
          <div className="h-px w-12 bg-linear-to-l from-transparent to-white/20" />
        </div>

        {/* System Marker */}
        <div
          className="mt-16 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/15"
          aria-hidden="true"
        >
          SYS::PACKAGES_WEB • 3 PLANS ACTIVE
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div
        className="absolute bottom-0 left-1/2 h-px w-2/3 max-w-4xl -translate-x-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════

export const WebDesignPackagesSection = memo(WebDesignPackagesSectionComponent);
export default WebDesignPackagesSection;