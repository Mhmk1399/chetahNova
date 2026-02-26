// app/components/sections/PaymentFaqSection.tsx
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
  success: "#10B981", // Emerald for trust/security
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

interface PaymentFaqProps {
  className?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// FAQ DATA
// ════════════════════════════════════════════════════════════════════════════

const PAYMENT_FAQS: FaqItem[] = [
  {
    id: "payment-faq-1",
    question: "How does the payment process work?",
    answer:
      "Typically, we require a deposit to start the project, and the remaining payment is divided into milestones depending on project size.",
    hasCustomRender: true,
  },
  {
    id: "payment-faq-2",
    question: "Do you offer monthly payment options?",
    answer:
      "Yes. For larger projects, we can offer milestone-based payments or monthly plans depending on the scope of work.",
  },
  {
    id: "payment-faq-3",
    question: "Do you offer refunds?",
    answer:
      "Refund policies depend on the project stage. Once development begins, time and resources are invested. However, we ensure full transparency and clear deliverables before starting any work.",
  },
  {
    id: "payment-faq-4",
    question: "Do you provide a contract or service agreement?",
    answer:
      "Yes. Every project includes a clear agreement outlining scope, timeline, deliverables, payment terms, and support conditions. This protects both sides and ensures clarity.",
    hasCustomRender: true,
  },
  {
    id: "payment-faq-5",
    question: "Are there any hidden fees?",
    answer:
      "No. All pricing is transparent. If extra features or additional pages are requested beyond the original scope, we provide a clear quote before implementation.",
  },
  {
    id: "payment-faq-6",
    question: "What happens if I want extra features after the project starts?",
    answer:
      "That's completely normal. If you request additional features, we can add them as a separate milestone or upgrade plan with clear pricing and timeline updates.",
  },
  {
    id: "payment-faq-7",
    question: "Do you offer support after the website is delivered?",
    answer:
      "Yes. We offer maintenance and support plans for updates, troubleshooting, and security monitoring.",
    hasCustomRender: true,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

const Icons = {
  creditCard: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <path d="M6 15h4M14 15h4" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  document: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="14 2 14 8 20 8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
      <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
      <polyline
        points="10 9 9 9 8 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  checkCircle: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path
        d="M7 11V7a5 5 0 0110 0v4"
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
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M5 12h14M12 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  dollarSign: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
      <path
        d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  milestone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" strokeLinecap="round" />
    </svg>
  ),
  handshake: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M11 17.5l-3-3 5.5-5.5L17 12.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12l-8.5 8.5c-.83.83-2.17.83-3 0l-3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12l8.5-8.5c.83-.83 2.17-.83 3 0l3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 10h4M18 10h4M2 14h4M18 14h4" strokeLinecap="round" />
    </svg>
  ),
  wrench: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  refresh: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M1 4v6h6M23 20v-6h-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  shieldCheck: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// CUSTOM ANSWER: PAYMENT PROCESS (Q1)
// ════════════════════════════════════════════════════════════════════════════

const PaymentProcessAnswer = memo(function PaymentProcessAnswer() {
  const steps = [
    {
      step: "01",
      title: "Initial Deposit",
      description: "Project kickoff with deposit payment",
      percentage: "30-50%",
      color: COLORS.success,
    },
    {
      step: "02",
      title: "Milestone Payments",
      description: "Payments tied to deliverables",
      percentage: "Based on scope",
      color: COLORS.primary,
    },
    {
      step: "03",
      title: "Final Payment",
      description: "Upon project completion",
      percentage: "Remaining balance",
      color: COLORS.secondary,
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">
        We require a deposit to start the project, and the remaining payment is
        divided into milestones:
      </p>

      {/* Payment timeline */}
      <div className="relative">
        {/* Connecting line */}
        <div
          className="absolute left-[19px] top-8 h-[calc(100%-64px)] w-px"
          style={{
            background: `linear-gradient(180deg, ${COLORS.success}, ${COLORS.primary}, ${COLORS.secondary})`,
          }}
        />

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex items-start gap-4 rounded-sm p-3 transition-all duration-300"
              style={{
                background: `${step.color}05`,
                border: `1px solid ${step.color}15`,
              }}
            >
              {/* Step number */}
              <div
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center font-mono text-xs font-bold"
                style={{
                  background: COLORS.dark,
                  border: `2px solid ${step.color}`,
                  color: step.color,
                }}
              >
                {step.step}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/80">
                    {step.title}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: `${step.color}15`, color: step.color }}
                  >
                    {step.percentage}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/50">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust indicator */}
      <div className="flex items-center gap-2 pt-2 text-xs text-white/40">
        <span className="h-4 w-4" style={{ color: COLORS.success }}>
          {Icons.shield}
        </span>
        <span>Secure payments with clear milestones</span>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// CUSTOM ANSWER: CONTRACT FEATURES (Q4)
// ════════════════════════════════════════════════════════════════════════════

const ContractFeaturesAnswer = memo(function ContractFeaturesAnswer() {
  const features = [
    {
      icon: Icons.document,
      label: "Clear Scope Definition",
      color: COLORS.success,
    },
    {
      icon: Icons.milestone,
      label: "Timeline & Milestones",
      color: COLORS.primary,
    },
    {
      icon: Icons.checkCircle,
      label: "Detailed Deliverables",
      color: COLORS.secondary,
    },
    { icon: Icons.dollarSign, label: "Payment Terms", color: COLORS.success },
    { icon: Icons.wrench, label: "Support Conditions", color: COLORS.primary },
    { icon: Icons.lock, label: "Legal Protection", color: COLORS.accent },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">
        Every project includes a clear agreement outlining:
      </p>

      {/* Features grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-sm p-3 transition-all duration-300 hover:bg-white/2"
            style={{
              background: `${feature.color}05`,
              border: `1px solid ${feature.color}15`,
            }}
          >
            <span className="h-4 w-4" style={{ color: feature.color }}>
              {feature.icon}
            </span>
            <span className="text-sm text-white/70">{feature.label}</span>
          </div>
        ))}
      </div>

      {/* Trust note */}
      <div
        className="flex items-center gap-3 rounded-sm p-3"
        style={{
          background: `${COLORS.success}08`,
          border: `1px solid ${COLORS.success}20`,
        }}
      >
        <span className="h-5 w-5" style={{ color: COLORS.success }}>
          {Icons.handshake}
        </span>
        <span className="text-sm text-white/60">
          This protects both sides and ensures complete clarity.
        </span>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// CUSTOM ANSWER: SUPPORT PLANS (Q7)
// ════════════════════════════════════════════════════════════════════════════

const SupportPlansAnswer = memo(function SupportPlansAnswer() {
  const supportFeatures = [
    {
      icon: Icons.refresh,
      label: "Regular Updates",
      desc: "Keep your site current",
    },
    {
      icon: Icons.wrench,
      label: "Troubleshooting",
      desc: "Fix issues quickly",
    },
    {
      icon: Icons.shieldCheck,
      label: "Security Monitoring",
      desc: "24/7 protection",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">
        Yes. We offer maintenance and support plans including:
      </p>

      {/* Support features */}
      <div className="grid gap-3 sm:grid-cols-3">
        {supportFeatures.map((feature, index) => (
          <div
            key={index}
            className="relative overflow-hidden p-4 text-center"
            style={{
              background: `linear-gradient(135deg, ${COLORS.success}08, transparent)`,
              border: `1px solid ${COLORS.success}15`,
            }}
          >
            {/* Top accent */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.success}50, transparent)`,
              }}
            />

            <div
              className="mx-auto mb-2 flex h-10 w-10 items-center justify-center"
              style={{ background: `${COLORS.success}15` }}
            >
              <span className="h-5 w-5" style={{ color: COLORS.success }}>
                {feature.icon}
              </span>
            </div>
            <span className="block text-sm font-medium text-white/80">
              {feature.label}
            </span>
            <span className="mt-1 block text-[11px] text-white/40">
              {feature.desc}
            </span>
          </div>
        ))}
      </div>

      {/* CTA hint */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span className="h-3 w-3" style={{ color: COLORS.success }}>
          {Icons.check}
        </span>
        <span>Flexible plans to fit your needs</span>
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
    if (faq.id === "payment-faq-1") {
      return <PaymentProcessAnswer />;
    }
    if (faq.id === "payment-faq-4") {
      return <ContractFeaturesAnswer />;
    }
    if (faq.id === "payment-faq-7") {
      return <SupportPlansAnswer />;
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
            {Icons.creditCard}
          </span>

          {/* Security badge */}
          <span
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full"
            style={{ background: accentColor }}
          >
            <span className="h-2.5 w-2.5 text-white">{Icons.check}</span>
          </span>
        </div>

        {/* Title */}
        <div>
          <h2
            className="text-xl font-bold tracking-tight text-white md:text-2xl lg:text-3xl"
            id="payment-faqs-title"
          >
            Payment & Contract FAQs
          </h2>
          <p className="mt-1 text-xs text-white/40">
            {PAYMENT_FAQS.length} frequently asked questions
          </p>
        </div>
      </div>

      {/* Right: Trust badge */}
      <div
        className="flex items-center gap-2 rounded-full px-4 py-2"
        style={{
          background: `linear-gradient(135deg, ${accentColor}15, ${COLORS.primary}10)`,
          border: `1px solid ${accentColor}25`,
        }}
      >
        <span className="h-4 w-4" style={{ color: accentColor }}>
          {Icons.shield}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          Secure & Transparent
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
// TRUST INDICATORS BAR
// ════════════════════════════════════════════════════════════════════════════

const TrustIndicatorsBar = memo(function TrustIndicatorsBar({
  accentColor,
}: {
  accentColor: string;
}) {
  const indicators = [
    {
      icon: Icons.dollarSign,
      value: "0",
      label: "Hidden Fees",
      color: accentColor,
    },
    {
      icon: Icons.document,
      value: "Clear",
      label: "Contracts",
      color: COLORS.primary,
    },
    {
      icon: Icons.shield,
      value: "100%",
      label: "Secure Payments",
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
      {indicators.map((ind, index) => (
        <div key={index} className="flex flex-col items-center gap-1 py-4">
          <span className="h-5 w-5 text-white/30">{ind.icon}</span>
          <span className="text-lg font-bold" style={{ color: ind.color }}>
            {ind.value}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            {ind.label}
          </span>
        </div>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function PaymentFaqSectionComponent({ className = "" }: PaymentFaqProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const accentColor = COLORS.success; // Emerald for trust/financial

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
    const item = document.getElementById(PAYMENT_FAQS[index].id);
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
        id="payment"
        className={`relative overflow-hidden py-16 md:py-24 lg:py-16 ${className}`}
        style={{ backgroundColor: COLORS.dark }}
        aria-labelledby="payment-faqs-title"
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

        {/* Ambient glows - Green/Emerald theme */}
        <div
          className="pointer-events-none absolute -left-40 top-1/4 h-150 w-150 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColor}12 0%, transparent 60%)`,
            filter: "blur(80px)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-40 bottom-1/3 h-[500px] w-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.primary}10 0%, transparent 60%)`,
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-100 w-100 -translate-x-1/2 rounded-full"
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
                background: `linear-gradient(90deg, transparent, ${accentColor}, ${COLORS.primary}, transparent)`,
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

              {/* Trust indicators bar */}
              <TrustIndicatorsBar accentColor={accentColor} />

              {/* Quick navigation */}
              <QuickNav
                faqs={PAYMENT_FAQS}
                activeIndex={openIndex}
                onSelect={handleQuickNavSelect}
                accentColor={accentColor}
              />

              {/* FAQ List */}
              <div ref={listRef} className="space-y-3" role="list">
                {PAYMENT_FAQS.map((faq, index) => (
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
                      {PAYMENT_FAQS.length}
                    </span>
                    <span className="text-xs text-white/40">Questions</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="h-3 w-3" style={{ color: accentColor }}>
                      {Icons.shield}
                    </span>
                    Transparent pricing
                  </div>
                </div>

                <a
                  href="/contact"
                  className="group flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}20, ${COLORS.primary}15)`,
                    border: `1px solid ${accentColor}30`,
                    color: accentColor,
                  }}
                >
                  <span className="h-4 w-4">{Icons.document}</span>
                  Request a Quote
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
            SYS::FAQ_PAYMENT • 7 ENTRIES • TRUST_VERIFIED
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

export const PaymentFaqSection = memo(PaymentFaqSectionComponent);
export default PaymentFaqSection;
