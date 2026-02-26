// app/components/sections/SeoFaqSection.tsx
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
  answer: string | React.ReactNode;
  hasHtml?: boolean;
}

interface SeoFaqProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// FAQ DATA
// ════════════════════════════════════════════════════════════════════════════

const SEO_FAQS: FaqItem[] = [
  {
    id: "seo-faq-1",
    question: "What is SEO and why is it important?",
    answer:
      "SEO (Search Engine Optimization) helps your website rank higher on Google, bringing in organic traffic without paying for ads. Strong SEO means long-term growth, visibility, and consistent customer leads.",
  },
  {
    id: "seo-faq-2",
    question: "How long does it take to see SEO results?",
    answer:
      "SEO is a long-term strategy. Most businesses start seeing improvements within 2 to 4 months, while stronger ranking results often take 4 to 8 months, depending on competition and website condition.",
  },
  {
    id: "seo-faq-3",
    question: "Do you guarantee Google rankings?",
    answer:
      "No ethical SEO agency can guarantee exact rankings, because Google's algorithm constantly changes. However, we guarantee a professional strategy, technical optimization, and measurable progress through transparent reporting.",
  },
  {
    id: "seo-faq-4",
    question: "What is the difference between On-Page SEO and Off-Page SEO?",
    answer: "", // Will use custom render
    hasHtml: true,
  },
  {
    id: "seo-faq-5",
    question: "Do you provide technical SEO services?",
    answer:
      "Yes. We provide full technical SEO including website speed optimization, crawl and index fixes, Core Web Vitals improvement, schema markup, and site structure optimization.",
  },
  {
    id: "seo-faq-6",
    question: "Do you offer Local SEO and Google Maps optimization?",
    answer:
      "Yes. We help local businesses rank higher on Google Maps through Local SEO strategies including Google Business Profile optimization, local keyword targeting, and location-based landing pages.",
  },
  {
    id: "seo-faq-7",
    question: "Can you do SEO for a new website?",
    answer:
      "Yes. In fact, starting SEO from day one is the best approach. We build the website structure in a way that Google can crawl, index, and rank faster.",
  },
];

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

const Icons = {
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      <path d="M11 8v6M8 11h6" strokeLinecap="round" />
    </svg>
  ),
  trendUp: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M23 6l-9.5 9.5-5-5L1 18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M5 12h14M12 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  globe: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
        strokeLinecap="round"
      />
    </svg>
  ),
  layers: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  link: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// CUSTOM ANSWER FOR Q4 (On-Page vs Off-Page)
// ════════════════════════════════════════════════════════════════════════════

const OnPageOffPageAnswer = memo(function OnPageOffPageAnswer({
  accentColor,
}: {
  accentColor: string;
}) {
  return (
    <div className="space-y-4">
      {/* On-Page SEO */}
      <div
        className="flex items-start gap-3 rounded-sm p-4"
        style={{
          background: `${accentColor}08`,
          border: `1px solid ${accentColor}20`,
        }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center"
          style={{ background: `${accentColor}15` }}
        >
          <span className="h-4 w-4" style={{ color: accentColor }}>
            {Icons.layers}
          </span>
        </div>
        <div>
          <span className="mb-1 block text-sm font-semibold text-white/80">
            On-Page SEO
          </span>
          <p className="text-sm leading-relaxed text-white/55">
            Focuses on optimizing your website content, structure, headings,
            keywords, and metadata.
          </p>
        </div>
      </div>

      {/* Off-Page SEO */}
      <div
        className="flex items-start gap-3 rounded-sm p-4"
        style={{
          background: `${COLORS.accent}08`,
          border: `1px solid ${COLORS.accent}20`,
        }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center"
          style={{ background: `${COLORS.accent}15` }}
        >
          <span className="h-4 w-4" style={{ color: COLORS.accent }}>
            {Icons.link}
          </span>
        </div>
        <div>
          <span className="mb-1 block text-sm font-semibold text-white/80">
            Off-Page SEO
          </span>
          <p className="text-sm leading-relaxed text-white/55">
            Focuses on authority building through backlinks, content marketing,
            and brand signals.
          </p>
        </div>
      </div>

      {/* Conclusion */}
      <p className="flex items-center gap-2 text-sm text-white/60">
        <span className="h-4 w-4" style={{ color: COLORS.primary }}>
          {Icons.check}
        </span>
        Both are essential for strong rankings.
      </p>
    </div>
  );
});

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
      const resizeObserver = new ResizeObserver(() => {
        if (answerRef.current) {
          setContentHeight(answerRef.current.scrollHeight);
        }
      });
      resizeObserver.observe(answerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

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

          {/* Answer */}
          <div className="pl-12">
            {faq.hasHtml ? (
              <OnPageOffPageAnswer accentColor={accentColor} />
            ) : (
              <>
                <p className="text-sm leading-relaxed text-white/55 md:text-base md:leading-relaxed">
                  {faq.answer}
                </p>

                {/* Helpful indicator */}
                <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                  <span className="h-3 w-3" style={{ color: accentColor }}>
                    {Icons.check}
                  </span>
                  <span>Helpful answer</span>
                </div>
              </>
            )}
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
// SECTION HEADER
// ════════════════════════════════════════════════════════════════════════════

const SectionHeader = memo(function SectionHeader({
  accentColor,
}: {
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
            {Icons.search}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2
            className="text-xl font-bold tracking-tight text-white md:text-2xl lg:text-3xl"
            id="seo-faqs-title"
          >
            SEO FAQs
          </h2>
          <p className="mt-1 text-xs text-white/40">
            {SEO_FAQS.length} frequently asked questions
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
          SEO Category
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
// SEO STATS BAR
// ════════════════════════════════════════════════════════════════════════════

const SeoStatsBar = memo(function SeoStatsBar({
  accentColor,
}: {
  accentColor: string;
}) {
  return (
    <div
      className="mb-8 grid grid-cols-3 divide-x divide-white/5"
      style={{
        background: `linear-gradient(135deg, ${accentColor}08, transparent)`,
        border: `1px solid ${accentColor}15`,
      }}
    >
      <div className="flex flex-col items-center gap-1 py-4">
        <span className="h-5 w-5 text-white/30">{Icons.trendUp}</span>
        <span className="text-lg font-bold" style={{ color: accentColor }}>
          2-4
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/40">
          Months to Results
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 py-4">
        <span className="h-5 w-5 text-white/30">{Icons.globe}</span>
        <span className="text-lg font-bold" style={{ color: COLORS.primary }}>
          100%
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/40">
          White-Hat SEO
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 py-4">
        <span className="h-5 w-5 text-white/30">{Icons.layers}</span>
        <span className="text-lg font-bold" style={{ color: COLORS.accent }}>
          Full
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/40">
          Technical SEO
        </span>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function SeoFaqSectionComponent({ className = "" }: SeoFaqProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const accentColor = COLORS.secondary; // Cyan for SEO

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
    const item = document.getElementById(SEO_FAQS[index].id);
    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
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
        id="seo"
        className={`relative overflow-hidden py-16 md:py-24 lg:py-16 ${className}`}
        style={{ backgroundColor: COLORS.dark }}
        aria-labelledby="seo-faqs-title"
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

        {/* Ambient glows - Cyan theme */}
        <div
          className="pointer-events-none absolute -right-40 top-1/4 h-175 w-175 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColor}12 0%, transparent 60%)`,
            filter: "blur(80px)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-40 bottom-1/4 h-125 w-125 rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.accent}08 0%, transparent 60%)`,
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
                background: `linear-gradient(90deg, transparent, ${accentColor}, ${COLORS.accent}, transparent)`,
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

            {/* Inner content */}
            <div className="relative p-6 md:p-8 lg:p-10">
              {/* Header */}
              <div ref={headerRef}>
                <SectionHeader accentColor={accentColor} />
              </div>

              {/* Stats bar */}
              <SeoStatsBar accentColor={accentColor} />

              {/* Quick navigation */}
              <QuickNav
                faqs={SEO_FAQS}
                activeIndex={openIndex}
                onSelect={handleQuickNavSelect}
                accentColor={accentColor}
              />

              {/* FAQ List */}
              <div ref={listRef} className="space-y-3" role="list">
                {SEO_FAQS.map((faq, index) => (
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

              {/* Bottom CTA */}
              <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-lg font-bold"
                      style={{ color: accentColor }}
                    >
                      {SEO_FAQS.length}
                    </span>
                    <span className="text-xs text-white/40">Questions</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="h-3 w-3" style={{ color: accentColor }}>
                      {Icons.trendUp}
                    </span>
                    Long-term growth strategy
                  </div>
                </div>

                <a
                  href="/contact"
                  className="group flex items-center gap-2 text-sm font-semibold transition-colors duration-300"
                  style={{ color: accentColor }}
                >
                  Get SEO Consultation
                  <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    {Icons.arrow}
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
              style={{ borderColor: `${COLORS.accent}30` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l"
              style={{ borderColor: `${COLORS.primary}30` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r"
              style={{ borderColor: `${accentColor}30` }}
              aria-hidden="true"
            />
          </div>

          {/* System marker */}
          <div
            className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-white/10"
            aria-hidden="true"
          >
            SYS::FAQ_SEO • 7 ENTRIES
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

export const SeoFaqSection = memo(SeoFaqSectionComponent);
export default SeoFaqSection;
