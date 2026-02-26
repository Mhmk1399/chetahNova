// app/components/sections/WebDesignFaqSection.tsx
"use client";

import { useRef, useEffect, useState, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ════════════════════════════════════════════════════════════════════════════
// REGISTER GSAP
// ════════════════════════════════════════════════════════════════════════════

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#8B5CF6",
  dark: "#0A0D14",
  darkSurface: "#0F1219",
  glass: {
    bg: "rgba(255, 255, 255, 0.02)",
    bgHover: "rgba(255, 255, 255, 0.04)",
    border: "rgba(255, 255, 255, 0.06)",
    borderHover: "rgba(255, 255, 255, 0.1)",
  },
} as const;

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface WebDesignFaqProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// FAQ DATA
// ════════════════════════════════════════════════════════════════════════════

const WEB_DESIGN_FAQS: FaqItem[] = [
  {
    id: "web-faq-1",
    question: "How long does it take to build a website?",
    answer:
      "Most websites take between 2 to 6 weeks, depending on the number of pages, design complexity, and custom features. Smaller websites can be delivered faster, while premium custom projects may require more time.",
  },
  {
    id: "web-faq-2",
    question: "Do you build custom websites or use templates?",
    answer:
      "We build fully custom websites tailored to your business, brand identity, and goals. We do not rely on generic templates because they limit performance, SEO structure, and conversion potential.",
  },
  {
    id: "web-faq-3",
    question: "Will my website be mobile-friendly and responsive?",
    answer:
      "Yes. Every website we build is fully responsive, meaning it works perfectly on mobile, tablet, and desktop devices. Mobile-first design is a standard part of our process.",
  },
  {
    id: "web-faq-4",
    question: "Can you redesign my existing website?",
    answer:
      "Yes. We can redesign your website while keeping your branding or improving it. We also optimize performance, user experience, and SEO structure during the redesign.",
  },
  {
    id: "web-faq-5",
    question: "Do you build e-commerce websites?",
    answer:
      "Yes. We build modern e-commerce stores optimized for speed, conversion, product SEO, and scalable growth. Payment systems like Stripe or PayPal can be integrated based on your region.",
  },
  {
    id: "web-faq-6",
    question: "Will I be able to edit my website content after delivery?",
    answer:
      "Yes. We can deliver your website with an easy-to-manage system so you can update content, images, and blog posts without needing technical skills.",
  },
  {
    id: "web-faq-7",
    question: "Do you provide hosting and domain services?",
    answer:
      "We can guide you in choosing the best hosting provider, or fully manage hosting for you if you prefer. Domain registration can also be handled based on your needs.",
  },
];

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

const Icons = {
  design: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" strokeLinecap="round" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  minus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline
        points="20 6 9 17 4 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// ACCORDION ITEM COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const AccordionItem = memo(function AccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
  accentColor,
}: {
  faq: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure content height
  useEffect(() => {
    if (answerRef.current) {
      setContentHeight(answerRef.current.scrollHeight);
    }
  }, [faq.answer]);

  // Animate open/close
  useEffect(() => {
    if (!contentRef.current) return;

    gsap.to(contentRef.current, {
      height: isOpen ? contentHeight : 0,
      duration: 0.4,
      ease: "power2.inOut",
    });
  }, [isOpen, contentHeight]);

  return (
    <div
      className="accordion-item group relative overflow-hidden transition-all duration-300"
      style={{
        background: isOpen ? COLORS.glass.bgHover : COLORS.glass.bg,
        border: `1px solid ${isOpen ? COLORS.glass.borderHover : COLORS.glass.border}`,
      }}
    >
      {/* Left accent line */}
      <div
        className="absolute left-0 top-0 h-full w-1 transition-all duration-300"
        style={{
          background: isOpen
            ? `linear-gradient(180deg, ${accentColor}, ${accentColor}80)`
            : "transparent",
        }}
        aria-hidden="true"
      />

      {/* Question button */}
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors duration-300 md:p-6"
        aria-expanded={isOpen}
        aria-controls={`${faq.id}-answer`}
        id={`${faq.id}-question`}
      >
        {/* Question number */}
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center font-mono text-xs font-bold transition-all duration-300"
          style={{
            background: isOpen ? `${accentColor}20` : "rgba(255,255,255,0.05)",
            color: isOpen ? accentColor : "rgba(255,255,255,0.4)",
            border: `1px solid ${isOpen ? `${accentColor}40` : "rgba(255,255,255,0.08)"}`,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Question text */}
        <span
          className="flex-1 pt-1 text-sm font-medium leading-relaxed transition-colors duration-300 md:text-base"
          style={{ color: isOpen ? "#fff" : "rgba(255,255,255,0.7)" }}
        >
          {faq.question}
        </span>

        {/* Toggle icon */}
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center transition-all duration-300"
          style={{
            background: isOpen ? `${accentColor}15` : "transparent",
            color: isOpen ? accentColor : "rgba(255,255,255,0.3)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <span className="h-5 w-5">{Icons.chevronDown}</span>
        </span>
      </button>

      {/* Answer content */}
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0 }}
        role="region"
        id={`${faq.id}-answer`}
        aria-labelledby={`${faq.id}-question`}
      >
        <div ref={answerRef} className="px-5 pb-6 md:px-6">
          {/* Divider */}
          <div
            className="mb-4 h-px"
            style={{
              background: `linear-gradient(90deg, ${accentColor}30, transparent)`,
            }}
          />

          {/* Answer text */}
          <div className="pl-12">
            <p className="text-sm leading-relaxed text-white/55 md:text-base md:leading-relaxed">
              {faq.answer}
            </p>

            {/* Answer indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
              <span className="h-3 w-3" style={{ color: accentColor }}>
                {Icons.check}
              </span>
              <span>Helpful answer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent (when open) */}
      {isOpen && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, ${accentColor}40, transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// SECTION HEADER COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const SectionHeader = memo(function SectionHeader({
  title,
  icon,
  count,
  accentColor,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  accentColor: string;
}) {
  return (
    <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Title with icon */}
      <div className="flex items-center gap-4">
        {/* Icon box */}
        <div
          className="flex h-12 w-12 items-center justify-center"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
          }}
        >
          <span className="h-6 w-6" style={{ color: accentColor }}>
            {icon}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2
            className="text-xl font-bold tracking-tight text-white md:text-2xl lg:text-3xl"
            id="web-design-faqs-title"
          >
            {title}
          </h2>
          <p className="mt-1 text-xs text-white/40">
            {count} frequently asked questions
          </p>
        </div>
      </div>

      {/* Right: Category badge */}
      <div
        className="flex items-center gap-2 rounded-full px-4 py-2"
        style={{
          background: `${accentColor}10`,
          border: `1px solid ${accentColor}25`,
        }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          Design Category
        </span>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// QUICK NAVIGATION
// ════════════════════════════════════════════════════════════════════════════

const QuickNav = memo(function QuickNav({
  faqs,
  activeIndex,
  onSelect,
  accentColor,
}: {
  faqs: FaqItem[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
  accentColor: string;
}) {
  return (
    <div
      className="mb-6 overflow-hidden"
      style={{
        background: COLORS.glass.bg,
        border: `1px solid ${COLORS.glass.border}`,
      }}
    >
      <div className="flex items-center gap-2 overflow-x-auto p-3 scrollbar-hide">
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-white/30">
          Jump to:
        </span>
        {faqs.map((faq, index) => (
          <button
            key={faq.id}
            onClick={() => onSelect(index)}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300"
            style={{
              background:
                activeIndex === index
                  ? `${accentColor}20`
                  : "rgba(255,255,255,0.03)",
              color:
                activeIndex === index ? accentColor : "rgba(255,255,255,0.5)",
              border: `1px solid ${activeIndex === index ? `${accentColor}40` : "transparent"}`,
            }}
          >
            Q{index + 1}
          </button>
        ))}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function WebDesignFaqSectionComponent({ className = "" }: WebDesignFaqProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default
  const [reducedMotion, setReducedMotion] = useState(false);

  const accentColor = COLORS.primary;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Toggle handler
  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  // Quick nav select
  const handleQuickNavSelect = useCallback((index: number) => {
    setOpenIndex(index);
    // Scroll to item
    const item = document.getElementById(WEB_DESIGN_FAQS[index].id);
    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Accordion items entrance
      gsap.fromTo(
        ".accordion-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      // Light streak
      if (lightRef.current) {
        gsap.to(lightRef.current, {
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
    <>
      <section
        ref={sectionRef}
        id="design"
        className={`relative overflow-hidden py-16 md:py-24 lg:py-16 ${className}`}
        style={{ backgroundColor: COLORS.dark }}
        aria-labelledby="web-design-faqs-title"
      >
        {/* Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-2"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        {/* Ambient glows */}
        <div
          className="pointer-events-none absolute -left-40 top-1/4 h-150 w-150 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColor}10 0%, transparent 60%)`,
            filter: "blur(80px)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-40 bottom-1/4 h-125 w-125 rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.secondary}08 0%, transparent 60%)`,
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4">
          {/* Main container */}
          <div
            className="relative overflow-hidden"
            style={{
              background: COLORS.glass.bg,
              border: `1px solid ${COLORS.glass.border}`,
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}, ${COLORS.secondary}, transparent)`,
              }}
              aria-hidden="true"
            />

            {/* Light streak */}
            {!reducedMotion && (
              <div
                ref={lightRef}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}05, transparent)`,
                }}
                aria-hidden="true"
              />
            )}

            {/* Inner padding */}
            <div className="relative p-6 md:p-8 lg:p-10">
              {/* Header */}
              <div ref={headerRef}>
                <SectionHeader
                  title="Web Design FAQs"
                  icon={Icons.design}
                  count={WEB_DESIGN_FAQS.length}
                  accentColor={accentColor}
                />
              </div>

              {/* Quick navigation */}
              <QuickNav
                faqs={WEB_DESIGN_FAQS}
                activeIndex={openIndex}
                onSelect={handleQuickNavSelect}
                accentColor={accentColor}
              />

              {/* FAQ List */}
              <div ref={listRef} className="space-y-3" role="list">
                {WEB_DESIGN_FAQS.map((faq, index) => (
                  <div key={faq.id} id={faq.id} role="listitem">
                    <AccordionItem
                      faq={faq}
                      index={index}
                      isOpen={openIndex === index}
                      onToggle={() => handleToggle(index)}
                      accentColor={accentColor}
                    />
                  </div>
                ))}
              </div>

              {/* Bottom stats */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-lg font-bold"
                      style={{ color: accentColor }}
                    >
                      {WEB_DESIGN_FAQS.length}
                    </span>
                    <span className="text-xs text-white/40">Questions</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white/60">2-6</span>
                    <span className="text-xs text-white/40">Week delivery</span>
                  </div>
                </div>

                <a
                  href="/contact"
                  className="group flex items-center gap-2 text-sm font-medium transition-colors duration-300"
                  style={{ color: accentColor }}
                >
                  Have more questions?
                  <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            {/* Corner markers */}
            <div
              className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t"
              style={{ borderColor: `${accentColor}30` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t"
              style={{ borderColor: `${COLORS.secondary}30` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l"
              style={{ borderColor: `${COLORS.accent}30` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r"
              style={{ borderColor: `${accentColor}30` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-0 left-1/2 h-px w-2/3 max-w-2xl -translate-x-1/2"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}20, transparent)`,
          }}
          aria-hidden="true"
        />
      </section>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

export const WebDesignFaqSection = memo(WebDesignFaqSectionComponent);
export default WebDesignFaqSection;
