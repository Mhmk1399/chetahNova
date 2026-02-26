"use client";

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

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

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  faqs?: FAQItem[];
  showContactCTA?: boolean;
  contactText?: string;
  contactHref?: string;
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  minus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  message: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultFAQs: FAQItem[] = [
  {
    id: "1",
    question: "How long does it take to build a website?",
    answer:
      "Most websites take between 2 to 6 weeks depending on the size and complexity. A simple landing page might be ready in 1-2 weeks, while a full e-commerce platform or custom web application could take 6-8 weeks. We'll provide a detailed timeline during our initial consultation based on your specific requirements.",
    category: "Timeline",
  },
  {
    id: "2",
    question: "Do you offer SEO as part of web design?",
    answer:
      "Yes. All websites are built with technical SEO foundations and optimized structure. This includes proper heading hierarchy, meta tags, schema markup, fast loading speeds, mobile optimization, and clean URL structures. We ensure your website is ready to rank from day one.",
    category: "SEO",
  },
  {
    id: "3",
    question: "Can you integrate AI tools into an existing website?",
    answer:
      "Yes. We can upgrade your current website and add custom AI automation systems. This includes AI chatbots, automated customer service, smart lead qualification, content generation tools, and workflow automation. We'll analyze your existing setup and implement solutions that integrate seamlessly.",
    category: "AI",
  },
  {
    id: "4",
    question: "Do you provide monthly SEO services?",
    answer:
      "Yes. We offer ongoing SEO growth plans including content creation, technical optimization, link building, and detailed reporting. Our monthly plans are tailored to your goals and include regular strategy calls, keyword tracking, and continuous improvements to keep you ranking higher.",
    category: "SEO",
  },
  {
    id: "5",
    question: "Do you work internationally?",
    answer:
      "Yes. We work with clients worldwide and provide full support remotely. We've successfully delivered projects for businesses across North America, Europe, Asia, and Australia. Communication is handled via video calls, email, and project management tools to ensure smooth collaboration regardless of timezone.",
    category: "General",
  },
  {
    id: "6",
    question: "What is your pricing structure?",
    answer:
      "Our pricing is project-based and depends on your specific needs. We offer transparent quotes after understanding your requirements. Typical website projects range from $3,000 to $15,000+, while ongoing SEO services start at $1,500/month. We'll provide a detailed proposal with no hidden costs.",
    category: "Pricing",
  },
  {
    id: "7",
    question: "Do you offer website maintenance and support?",
    answer:
      "Yes. We offer ongoing maintenance plans that include security updates, performance monitoring, content updates, and technical support. Our clients receive priority support and regular health checks to ensure their websites remain fast, secure, and up-to-date.",
    category: "Support",
  },
  {
    id: "8",
    question: "What technologies do you use?",
    answer:
      "We use modern, industry-leading technologies including React, Next.js, TypeScript, and Tailwind CSS for frontend development. For backend and CMS, we work with Node.js, headless CMS solutions, and various database systems. We choose the best tech stack based on your project requirements.",
    category: "Technical",
  },
];

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
        className="absolute right-0 top-1/4 h-125 w-125 translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.primary}06 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-0 h-125 w-125 -translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}05 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FAQ ACCORDION ITEM
// ════════════════════════════════════════════════════════════════════

const FAQAccordionItem = memo(function FAQAccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const colorIndex = index % 3;
  const accentColors: ("primary" | "secondary" | "accent")[] = [
    "primary",
    "secondary",
    "accent",
  ];
  const color = colors[accentColors[colorIndex]];

  // Measure content height
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [faq.answer]);

  // Entrance animation
  useEffect(() => {
    if (!itemRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }, itemRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={itemRef} className="group relative" style={{ opacity: 0 }}>
      <div
        className="relative overflow-hidden border transition-all duration-300"
        style={{
          borderColor: isOpen ? `${color}40` : "rgba(255,255,255,0.06)",
          backgroundColor: isOpen ? `${color}05` : "rgba(255,255,255,0.02)",
        }}
      >
        {/* Question Button */}
        <button
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors duration-300 md:p-6"
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${faq.id}`}
        >
          {/* Number & Question */}
          <div className="flex items-start gap-4">
            {/* Number */}
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-bold transition-all duration-300"
              style={{
                borderColor: isOpen ? color : "rgba(255,255,255,0.1)",
                backgroundColor: isOpen ? `${color}15` : "transparent",
                color: isOpen ? color : "rgba(255,255,255,0.3)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Question */}
            <span
              className="pt-1 text-base font-medium transition-colors duration-300 md:text-lg"
              style={{ color: isOpen ? "white" : "rgba(255,255,255,0.8)" }}
            >
              {faq.question}
            </span>
          </div>

          {/* Toggle Icon */}
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center border transition-all duration-300"
            style={{
              borderColor: isOpen ? color : "rgba(255,255,255,0.1)",
              backgroundColor: isOpen ? color : "transparent",
              color: isOpen ? colors.dark : "rgba(255,255,255,0.4)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <span className="h-4 w-4">{isOpen ? Icons.minus : Icons.plus}</span>
          </span>
        </button>

        {/* Answer */}
        <div
          id={`faq-answer-${faq.id}`}
          className="overflow-hidden transition-all duration-500 ease-out"
          style={{
            maxHeight: isOpen ? `${contentHeight + 40}px` : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div
            ref={contentRef}
            className="border-t px-5 pb-5 pt-4 md:px-6 md:pb-6"
            style={{ borderColor: `${color}20` }}
          >
            {/* Answer Text */}
            <div className="pl-12">
              <p className="text-sm leading-relaxed text-white/60 md:text-base">
                {faq.answer}
              </p>

              {/* Category Tag */}
              {faq.category && (
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider"
                    style={{
                      borderColor: `${color}30`,
                      backgroundColor: `${color}10`,
                      color: color,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {faq.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Left Accent Line */}
        <div
          className="absolute bottom-0 left-0 top-0 w-1 transition-all duration-300"
          style={{
            backgroundColor: color,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "top",
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SEARCH BAR
// ════════════════════════════════════════════════════════════════════

const SearchBar = memo(function SearchBar({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-10">
      <div
        className="relative mx-auto max-w-xl overflow-hidden border transition-all duration-300"
        style={{
          borderColor: isFocused
            ? `${colors.primary}40`
            : "rgba(255,255,255,0.08)",
          backgroundColor: isFocused
            ? `${colors.primary}05`
            : "rgba(255,255,255,0.02)",
        }}
      >
        {/* Search Icon */}
        <span
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300"
          style={{
            color: isFocused ? colors.primary : "rgba(255,255,255,0.3)",
          }}
        >
          {Icons.search}
        </span>

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search questions..."
          className="w-full bg-transparent py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/30"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors duration-200"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <span className="text-xs text-white/50">✕</span>
          </button>
        )}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// QUICK LINKS
// ════════════════════════════════════════════════════════════════════

const QuickLinks = memo(function QuickLinks({
  categories,
  activeCategory,
  onCategoryClick,
}: {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onCategoryClick("All")}
        className="border px-4 py-2 text-sm font-medium transition-all duration-300"
        style={{
          borderColor:
            activeCategory === "All"
              ? `${colors.primary}50`
              : "rgba(255,255,255,0.08)",
          backgroundColor:
            activeCategory === "All"
              ? `${colors.primary}15`
              : "rgba(255,255,255,0.02)",
          color:
            activeCategory === "All" ? colors.primary : "rgba(255,255,255,0.5)",
        }}
      >
        All Questions
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryClick(category)}
          className="border px-4 py-2 text-sm font-medium transition-all duration-300"
          style={{
            borderColor:
              activeCategory === category
                ? `${colors.primary}50`
                : "rgba(255,255,255,0.08)",
            backgroundColor:
              activeCategory === category
                ? `${colors.primary}15`
                : "rgba(255,255,255,0.02)",
            color:
              activeCategory === category
                ? colors.primary
                : "rgba(255,255,255,0.5)",
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CONTACT CTA
// ════════════════════════════════════════════════════════════════════

const ContactCTA = memo(function ContactCTA({
  text = "Still have questions? We're here to help.",
  href = "/contact",
}: {
  text?: string;
  href?: string;
}) {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ctaRef} className="mt-16 text-center" style={{ opacity: 0 }}>
      <div
        className="mx-auto max-w-2xl border p-8 md:p-10"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: `linear-gradient(135deg, ${colors.primary}05, transparent, ${colors.secondary}05)`,
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border"
          style={{
            borderColor: `${colors.primary}30`,
            backgroundColor: `${colors.primary}10`,
          }}
        >
          <span className="h-6 w-6" style={{ color: colors.primary }}>
            {Icons.message}
          </span>
        </div>

        {/* Text */}
        <p className="mb-6 text-lg text-white/70">{text}</p>

        {/* Button */}
        <Link
          href={href}
          className="group inline-flex items-center gap-3 border px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300"
          style={{
            borderColor: `${colors.primary}40`,
            backgroundColor: `${colors.primary}10`,
            color: colors.primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.color = colors.dark;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${colors.primary}40`;
            e.currentTarget.style.backgroundColor = `${colors.primary}10`;
            e.currentTarget.style.color = colors.primary;
          }}
        >
          <span>Contact Us</span>
          <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
            {Icons.arrow}
          </span>
        </Link>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SCHEMA MARKUP (for SEO)
// ════════════════════════════════════════════════════════════════════

const FAQSchema = memo(function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const FAQSection: React.FC<FAQSectionProps> = ({
  headline = "Frequently Asked Questions",
  subheadline = "FAQ",
  description = "Find answers to common questions about our services, process, and pricing.",
  faqs = defaultFAQs,
  showContactCTA = true,
  contactText = "Still have questions? We're here to help.",
  contactHref = "/contact",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Get unique categories
  const categories = [
    ...new Set(faqs.map((faq) => faq.category).filter(Boolean)),
  ] as string[];

  // Filter FAQs
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Header Animation
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerElement.querySelectorAll(".header-anim"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerElement,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setOpenIndex(null);
  }, []);

  const handleCategoryClick = useCallback((category: string) => {
    setActiveCategory(category);
    setOpenIndex(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-16"
      style={{ backgroundColor: colors.dark }}
      aria-labelledby="faq-heading"
    >
      {/* Schema Markup for SEO */}
      <FAQSchema faqs={faqs} />

      <Background />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-12 text-center lg:mb-16">
          {/* Label */}
          <div className="header-anim mb-6 flex items-center justify-center gap-3">
            <span
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.primary})`,
              }}
            />
            <span
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: colors.primary }}
            >
              <span className="h-3 w-3">{Icons.sparkle}</span>
              {subheadline}
            </span>
            <span
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
              }}
            />
          </div>

          {/* Headline */}
          <h2
            id="faq-heading"
            className="header-anim mb-6 text-3xl font-black text-white md:text-4xl lg:text-5xl"
          >
            Frequently Asked{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Questions
            </span>
          </h2>

          {/* Description */}
          <p className="header-anim mx-auto max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
            {description}
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Category Filter */}
        {categories.length > 0 && (
          <QuickLinks
            categories={categories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <FAQAccordionItem
              key={faq.id}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-white/50">
              No questions found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 text-sm underline"
              style={{ color: colors.primary }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 flex items-center justify-center gap-8 text-center">
          <div>
            <div
              className="text-2xl font-bold"
              style={{ color: colors.primary }}
            >
              {faqs.length}+
            </div>
            <div className="text-xs text-white/40">Questions Answered</div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <div
              className="text-2xl font-bold"
              style={{ color: colors.secondary }}
            >
              24/7
            </div>
            <div className="text-xs text-white/40">Support Available</div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <div
              className="text-2xl font-bold"
              style={{ color: colors.accent }}
            >
              &lt;2h
            </div>
            <div className="text-xs text-white/40">Response Time</div>
          </div>
        </div>

        {/* Contact CTA */}
        {showContactCTA && <ContactCTA text={contactText} href={contactHref} />}
      </div>

      {/* Decorative Corners */}
      <div className="pointer-events-none absolute left-8 top-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}40, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-px w-20"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}40, transparent)`,
          }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(0deg, ${colors.secondary}30, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-px w-20"
          style={{
            background: `linear-gradient(270deg, ${colors.secondary}30, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default memo(FAQSection);
export type { FAQSectionProps, FAQItem };
