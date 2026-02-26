// app/components/sections/AiFaqSection.tsx
"use client";

import { useRef, useEffect, useState, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Script from "next/script";

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
  hasCustomRender?: boolean;
}

interface AiFaqProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// FAQ DATA
// ════════════════════════════════════════════════════════════════════════════

const AI_FAQS: FaqItem[] = [
  {
    id: "ai-faq-1",
    question: "What kind of AI tools can you build for websites?",
    answer:
      "We build custom AI tools such as AI customer support chatbots, AI lead qualification systems, AI booking assistants, AI SEO automation tools, AI dashboards for analytics and reporting, and workflow automation systems. Everything is customized for your business model.",
    hasCustomRender: true,
  },
  {
    id: "ai-faq-2",
    question: "Can AI tools be integrated into my existing website?",
    answer:
      "Yes. We can integrate AI tools into your current website without needing a full redesign, depending on your website platform and technical structure.",
  },
  {
    id: "ai-faq-3",
    question: "Will AI replace my support team?",
    answer:
      "AI does not replace your team completely, but it can reduce workload dramatically by handling repetitive questions, filtering leads, and automating routine tasks. Your team can focus on high-value customers.",
  },
  {
    id: "ai-faq-4",
    question: "Can AI increase my website conversion rate?",
    answer:
      "Yes. AI improves conversion by answering questions instantly, guiding customers through services, and reducing hesitation. This leads to higher trust and faster decision-making.",
  },
  {
    id: "ai-faq-5",
    question: "Do you build AI chatbots with real business training?",
    answer:
      "Yes. Our AI tools are trained using your website content, services, FAQs, policies, and customer journey. This makes the AI assistant feel professional and accurate.",
  },
  {
    id: "ai-faq-6",
    question: "Can AI help with SEO and content creation?",
    answer:
      "Yes. AI can support SEO by automating keyword research, content planning, internal linking suggestions, and SEO-structured content generation. We also ensure quality control to maintain professional standards.",
  },
  {
    id: "ai-faq-7",
    question: "Are your AI tools subscription-based or one-time payment?",
    answer:
      "We offer both options: One-time AI integration projects and Monthly subscription plans for continuous improvement, training, and support.",
    hasCustomRender: true,
  },
];

// Schema version with plain text
const AI_FAQS_SCHEMA = AI_FAQS.map((faq) => ({
  ...faq,
  answer: faq.answer,
}));

// ════════════════════════════════════════════════════════════════════════════
// GENERATE FAQ SCHEMA (SEO)
// ════════════════════════════════════════════════════════════════════════════

const generateFaqSchema = (faqs: typeof AI_FAQS_SCHEMA) => ({
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
});

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

const Icons = {
  brain: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 2a9 9 0 019 9c0 3.87-2.45 7.17-5.88 8.44M12 2a9 9 0 00-9 9c0 3.87 2.45 7.17 5.88 8.44M12 2v20"
        strokeLinecap="round"
      />
      <path
        d="M4.5 9.5c1.5 0 2.5 1 2.5 2s-1 2-2.5 2M19.5 9.5c-1.5 0-2.5 1-2.5 2s1 2 2.5 2"
        strokeLinecap="round"
      />
      <path d="M8 16c1.5 0 2.5-1 4-1s2.5 1 4 1" strokeLinecap="round" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  robot: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M9 10h.01M15 10h.01" strokeLinecap="round" />
      <path d="M9 14h6" strokeLinecap="round" />
      <path d="M12 2v4" strokeLinecap="round" />
      <path d="M2 10h2M20 10h2" strokeLinecap="round" />
    </svg>
  ),
  chatbot: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="8" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  target: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
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
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  chart: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M18 20V10M12 20V4M6 20v-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  workflow: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="9" y="15" width="6" height="6" rx="1" />
      <path
        d="M6 9v3h6m6-3v3h-6m0 0v3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  zap: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  infinity: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  creditCard: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" strokeLinecap="round" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// AI TOOLS LIST DATA
// ════════════════════════════════════════════════════════════════════════════

const AI_TOOLS_LIST = [
  {
    icon: Icons.chatbot,
    label: "AI Customer Support Chatbots",
    color: COLORS.accent,
  },
  {
    icon: Icons.target,
    label: "AI Lead Qualification Systems",
    color: COLORS.primary,
  },
  {
    icon: Icons.calendar,
    label: "AI Booking Assistants",
    color: COLORS.secondary,
  },
  {
    icon: Icons.search,
    label: "AI SEO Automation Tools",
    color: COLORS.accent,
  },
  {
    icon: Icons.chart,
    label: "AI Dashboards for Analytics",
    color: COLORS.primary,
  },
  {
    icon: Icons.workflow,
    label: "Workflow Automation Systems",
    color: COLORS.secondary,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// CUSTOM ANSWER: AI TOOLS LIST (Q1)
// ════════════════════════════════════════════════════════════════════════════

const AiToolsListAnswer = memo(function AiToolsListAnswer() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">We build custom AI tools such as:</p>

      {/* Tools grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        {AI_TOOLS_LIST.map((tool, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-sm p-3 transition-all duration-300 hover:bg-white/2 "
            style={{
              background: `${tool.color}05`,
              border: `1px solid ${tool.color}15`,
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0  items-center justify-center"
              style={{ background: `${tool.color}15` }}
            >
              <span className="h-4 w-4" style={{ color: tool.color }}>
                {tool.icon}
              </span>
            </div>
            <span className="text-sm text-white/70">{tool.label}</span>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div className="flex items-center gap-2 pt-2 text-sm text-white/50">
        <span className="h-4 w-4" style={{ color: COLORS.accent }}>
          {Icons.sparkle}
        </span>
        <span>Everything is customized for your business model.</span>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// CUSTOM ANSWER: PRICING OPTIONS (Q7)
// ════════════════════════════════════════════════════════════════════════════

const PricingOptionsAnswer = memo(function PricingOptionsAnswer() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">We offer both options:</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* One-time */}
        <div
          className="relative overflow-hidden p-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}08, transparent)`,
            border: `1px solid ${COLORS.primary}20`,
          }}
        >
          {/* Top accent */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
            }}
          />

          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center"
              style={{ background: `${COLORS.primary}15` }}
            >
              <span className="h-5 w-5" style={{ color: COLORS.primary }}>
                {Icons.zap}
              </span>
            </div>
            <div>
              <span className="mb-1 block text-sm font-semibold text-white/80">
                One-Time Integration
              </span>
              <p className="text-xs leading-relaxed text-white/50">
                Complete AI integration projects with fixed pricing
              </p>
            </div>
          </div>

          {/* Corner marker */}
          <div
            className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r"
            style={{ borderColor: `${COLORS.primary}30` }}
          />
        </div>

        {/* Subscription */}
        <div
          className="relative overflow-hidden p-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}08, transparent)`,
            border: `1px solid ${COLORS.accent}20`,
          }}
        >
          {/* Top accent */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
            }}
          />

          {/* Popular badge */}
          <div
            className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider"
            style={{ background: `${COLORS.accent}20`, color: COLORS.accent }}
          >
            Popular
          </div>

          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center"
              style={{ background: `${COLORS.accent}15` }}
            >
              <span className="h-5 w-5" style={{ color: COLORS.accent }}>
                {Icons.infinity}
              </span>
            </div>
            <div>
              <span className="mb-1 block text-sm font-semibold text-white/80">
                Monthly Subscription
              </span>
              <p className="text-xs leading-relaxed text-white/50">
                Continuous improvement, training, and support
              </p>
            </div>
          </div>

          {/* Corner marker */}
          <div
            className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r"
            style={{ borderColor: `${COLORS.accent}30` }}
          />
        </div>
      </div>

      {/* CTA hint */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span className="h-3 w-3" style={{ color: COLORS.accent }}>
          {Icons.check}
        </span>
        <span>Choose the option that fits your business needs</span>
      </div>
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

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.to(contentRef.current, {
      height: isOpen ? contentHeight : 0,
      duration: 0.4,
      ease: "power2.inOut",
    });
  }, [isOpen, contentHeight]);

  // Custom render logic
  const renderAnswer = () => {
    if (faq.id === "ai-faq-1") {
      return <AiToolsListAnswer />;
    }
    if (faq.id === "ai-faq-7") {
      return <PricingOptionsAnswer />;
    }
    return (
      <>
        <p className="text-sm leading-relaxed text-white/55 md:text-base md:leading-relaxed">
          {faq.answer}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
          <span className="h-3 w-3" style={{ color: accentColor }}>
            {Icons.check}
          </span>
          <span>Helpful answer</span>
        </div>
      </>
    );
  };

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
          <div className="pl-12">{renderAnswer()}</div>
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
          className="relative flex h-12 w-12 items-center justify-center overflow-hidden"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
          }}
        >
          <span className="h-6 w-6" style={{ color: accentColor }}>
            {Icons.brain}
          </span>

          {/* Animated sparkle */}
          <span
            className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse"
            style={{ color: accentColor }}
          >
            {Icons.sparkle}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2
            className="text-xl font-bold tracking-tight text-white md:text-2xl lg:text-3xl"
            id="ai-faqs-title"
          >
            AI Tools & Automation FAQs
          </h2>
          <p className="mt-1 text-xs text-white/40">
            {AI_FAQS.length} frequently asked questions
          </p>
        </div>
      </div>

      {/* Right: Category badge */}
      <div
        className="flex items-center gap-2 rounded-full px-4 py-2"
        style={{
          background: `linear-gradient(135deg, ${accentColor}15, ${COLORS.primary}10)`,
          border: `1px solid ${accentColor}25`,
        }}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          AI Category
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
// AI CAPABILITIES BAR
// ════════════════════════════════════════════════════════════════════════════

const AiCapabilitiesBar = memo(function AiCapabilitiesBar({
  accentColor,
}: {
  accentColor: string;
}) {
  const capabilities = [
    {
      icon: Icons.robot,
      value: "Custom",
      label: "AI Training",
      color: accentColor,
    },
    {
      icon: Icons.zap,
      value: "24/7",
      label: "Automation",
      color: COLORS.primary,
    },
    {
      icon: Icons.chart,
      value: "Smart",
      label: "Analytics",
      color: COLORS.secondary,
    },
  ];

  return (
    <div
      className="mb-8 grid grid-cols-3 divide-x divide-white/5"
      style={{
        background: `linear-gradient(135deg, ${accentColor}08, ${COLORS.primary}05, transparent)`,
        border: `1px solid ${accentColor}15`,
      }}
    >
      {capabilities.map((cap, index) => (
        <div key={index} className="flex flex-col items-center gap-1 py-4">
          <span className="h-5 w-5 text-white/30">{cap.icon}</span>
          <span className="text-lg font-bold" style={{ color: cap.color }}>
            {cap.value}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            {cap.label}
          </span>
        </div>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// FLOATING AI ELEMENTS (Decorative)
// ════════════════════════════════════════════════════════════════════════════

const FloatingAiElements = memo(function FloatingAiElements() {
  const elementsRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!elementsRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(".float-ai", {
        y: "+=10",
        duration: 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.3, from: "random" },
      });
    }, elementsRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={elementsRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Floating sparkles */}
      <div
        className="float-ai absolute left-[8%] top-[20%] h-3 w-3 opacity-20"
        style={{ color: COLORS.accent }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="float-ai absolute right-[12%] top-[30%] h-2 w-2 opacity-15"
        style={{ color: COLORS.primary }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="float-ai absolute left-[15%] bottom-[25%] h-4 w-4 opacity-10"
        style={{ color: COLORS.secondary }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="float-ai absolute right-[8%] bottom-[35%] h-2.5 w-2.5 opacity-15"
        style={{ color: COLORS.accent }}
      >
        {Icons.sparkle}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function AiFaqSectionComponent({ className = "" }: AiFaqProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const accentColor = COLORS.accent; // Violet for AI

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleQuickNavSelect = useCallback((index: number) => {
    setOpenIndex(index);
    const item = document.getElementById(AI_FAQS[index].id);
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
          duration: 12,
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
        id="ai"
        className={`relative overflow-hidden py-16 md:py-24 lg:py-16 ${className}`}
        style={{ backgroundColor: COLORS.dark }}
        aria-labelledby="ai-faqs-title"
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

        {/* Neural pattern background */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="ai-neural"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="40" cy="40" r="1.5" fill={accentColor} />
              <circle cx="0" cy="0" r="0.5" fill={COLORS.primary} />
              <circle cx="80" cy="0" r="0.5" fill={COLORS.secondary} />
              <circle cx="0" cy="80" r="0.5" fill={COLORS.secondary} />
              <circle cx="80" cy="80" r="0.5" fill={COLORS.primary} />
              <line
                x1="40"
                y1="40"
                x2="0"
                y2="0"
                stroke={accentColor}
                strokeWidth="0.3"
                opacity="0.5"
              />
              <line
                x1="40"
                y1="40"
                x2="80"
                y2="0"
                stroke={COLORS.primary}
                strokeWidth="0.3"
                opacity="0.5"
              />
              <line
                x1="40"
                y1="40"
                x2="0"
                y2="80"
                stroke={COLORS.secondary}
                strokeWidth="0.3"
                opacity="0.5"
              />
              <line
                x1="40"
                y1="40"
                x2="80"
                y2="80"
                stroke={accentColor}
                strokeWidth="0.3"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ai-neural)" />
        </svg>

        {/* Ambient glows - Violet theme */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-175 w-175 -translate-x-1/2 -translate-y-1/3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColor}15 0%, transparent 60%)`,
            filter: "blur(80px)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-40 bottom-1/4 h-125 w-125 rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.primary}10 0%, transparent 60%)`,
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-40 bottom-1/3 h-100 w-100 rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.secondary}08 0%, transparent 60%)`,
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        {/* Floating elements */}
        <FloatingAiElements />

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
            {/* Top accent line - gradient */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}, ${COLORS.primary}, ${COLORS.secondary}, transparent)`,
              }}
              aria-hidden="true"
            />

            {/* Light streak */}
            {!reducedMotion && (
              <div
                ref={lightRef}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}06, transparent)`,
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

              {/* Capabilities bar */}
              <AiCapabilitiesBar accentColor={accentColor} />

              {/* Quick navigation */}
              <QuickNav
                faqs={AI_FAQS}
                activeIndex={openIndex}
                onSelect={handleQuickNavSelect}
                accentColor={accentColor}
              />

              {/* FAQ List */}
              <div ref={listRef} className="space-y-3" role="list">
                {AI_FAQS.map((faq, index) => (
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
                      {AI_FAQS.length}
                    </span>
                    <span className="text-xs text-white/40">Questions</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="h-3 w-3" style={{ color: accentColor }}>
                      {Icons.sparkle}
                    </span>
                    Custom AI solutions
                  </div>
                </div>

                <a
                  href="/contact"
                  className="group flex items-center gap-2   px-5 py-2 text-sm font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}20, ${COLORS.primary}15)`,
                    border: `1px solid ${accentColor}30`,
                    color: accentColor,
                  }}
                >
                  <span className="h-4 w-4">{Icons.brain}</span>
                  Get AI Consultation
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
              style={{ borderColor: `${COLORS.primary}30` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l"
              style={{ borderColor: `${COLORS.secondary}30` }}
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
            SYS::FAQ_AI_TOOLS • 7 ENTRIES • NEURAL_ENABLED
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-0 left-1/2 h-px w-2/3 max-w-2xl -translate-x-1/2"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}20, ${COLORS.primary}15, transparent)`,
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

export const AiFaqSection = memo(AiFaqSectionComponent);
export default AiFaqSection;
