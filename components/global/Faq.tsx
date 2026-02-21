// components/faq/FAQ.tsx
"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import styles from "./FAQ.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag?: string;
}

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */
const FAQ_ITEMS: FaqItem[] = [
  {
    id: "q1",
    question: "How long does it take to build a website?",
    answer:
      "Most websites take between 2 to 6 weeks depending on the size and complexity. A simple landing page or small business site typically takes 2-3 weeks, while larger e-commerce sites or complex web applications may take 4-6 weeks. We provide a detailed timeline during our initial consultation based on your specific requirements.",
    tag: "TIMELINE",
  },
  {
    id: "q2",
    question: "Do you offer SEO as part of web design?",
    answer:
      "Yes. All websites are built with technical SEO foundations and optimized structure from day one. This includes proper HTML semantics, meta tags, fast loading speeds, mobile optimization, and clean URL structures. We also offer ongoing SEO growth plans for continuous optimization and ranking improvements.",
    tag: "SEO",
  },
  {
    id: "q3",
    question: "Can you integrate AI tools into an existing website?",
    answer:
      "Yes. We can upgrade your current website and add custom AI automation systems without rebuilding everything from scratch. This includes AI chatbots, lead qualification systems, content generators, and analytics dashboards. We'll assess your existing site and recommend the best integration approach.",
    tag: "AI UPGRADE",
  },
  {
    id: "q4",
    question: "Do you provide monthly SEO services?",
    answer:
      "Yes. We offer ongoing SEO growth plans including monthly content creation, technical optimization, backlink building, keyword research, competitor analysis, and detailed reporting. Our SEO packages are customized based on your industry, competition level, and growth goals.",
    tag: "SEO PLANS",
  },
  {
    id: "q5",
    question: "Do you work internationally?",
    answer:
      "Yes. We work with clients worldwide and provide full support remotely through video calls, project management tools, and real-time collaboration platforms. Our team has experience working across different time zones and can accommodate your schedule for meetings and updates.",
    tag: "GLOBAL",
  },
];

/* ════════════════════════════════════════
   ATOMS
════════════════════════════════════════ */
const TealDot = ({
  size = 6,
  pulse = false,
  color = "#30C0C0",
}: {
  size?: number;
  pulse?: boolean;
  color?: string;
}) => (
  <span
    className="relative inline-flex shrink-0"
    style={{ width: size, height: size }}
  >
    {pulse && (
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: `${color}44`,
          animation: "ping 2s cubic-bezier(0,0,.2,1) infinite",
        }}
      />
    )}
    <span
      className="relative rounded-full block"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size + 2}px ${color}, 0 0 ${size * 3}px ${color}44`,
      }}
    />
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2.5">
    <TealDot size={5} />
    <span
      className="font-mono text-[10px] tracking-[0.28em] uppercase"
      style={{ color: "#30C0C0", opacity: 0.8 }}
    >
      {children}
    </span>
  </div>
);

const Bracket = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const map = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`absolute w-2.5 h-2.5 pointer-events-none ${map[pos]}`}
      style={{ borderColor: "rgba(48,192,192,0.35)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   ANIMATED HEIGHT WRAPPER
════════════════════════════════════════ */
const AnimateHeight = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    if (open) {
      const ro = new ResizeObserver(() => {
        setHeight(el.scrollHeight);
      });
      ro.observe(el);
      setHeight(el.scrollHeight);
      return () => ro.disconnect();
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div
      className={styles.animHeight}
      style={{ height: open ? height : 0 }}
      aria-hidden={!open}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
};

/* ════════════════════════════════════════
   FAQ ITEM ROW
════════════════════════════════════════ */
const FaqRow = ({
  item,
  open,
  onToggle,
  index,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const uid = useId();
  const btnId = `faq-btn-${uid}`;
  const panelId = `faq-panel-${uid}`;

  return (
    <div
      className={`${styles.faqRow} ${open ? styles.faqRowOpen : ""} relative`}
    >
      {/* Left active stripe */}
      <div
        className={styles.rowStripe}
        style={{ opacity: open ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Active glow */}
      <div
        className={styles.rowGlow}
        style={{ opacity: open ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Top scan line */}
      <div
        className={`${styles.rowScanTop} ${open ? styles.rowScanTopActive : ""}`}
        aria-hidden="true"
      />

      {/* QUESTION BUTTON */}
      <button
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        className={`${styles.faqBtn} w-full flex items-start gap-4 text-left`}
        onClick={onToggle}
      >
        {/* Index + Tag column */}
        <div className="flex flex-col items-start gap-2 shrink-0 pt-1 w-16 sm:w-20">
          <span
            className="font-mono text-[9px] tracking-[0.18em] uppercase"
            style={{
              color: open ? "#30C0C0" : "#1A3848",
              transition: "color 0.3s",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {item.tag && (
            <span
              className={`${styles.rowTag} font-mono text-[7.5px] tracking-[0.16em] uppercase`}
              style={{
                color: open ? "#30C0C0" : "#112030",
                borderColor: open ? "rgba(48,192,192,0.25)" : "#0C1828",
                background: open
                  ? "rgba(48,192,192,0.05)"
                  : "rgba(8,14,24,0.6)",
                transition: "color 0.3s, border-color 0.3s, background 0.3s",
              }}
            >
              {item.tag}
            </span>
          )}
        </div>

        {/* Question text */}
        <span
          className={`${styles.questionText} flex-1 font-mono leading-snug`}
          style={{
            color: open ? "#C0DDE8" : "#4A7A8A",
            transition: "color 0.3s",
          }}
        >
          {item.question}
        </span>

        {/* Plus/Minus icon */}
        <div
          className={`${styles.iconWrap} relative flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Bracket pos="tl" />
          <Bracket pos="br" />

          <div className={styles.iconInner}>
            {/* Horizontal bar (always visible) */}
            <span
              className={styles.iconBar}
              style={{
                background: open ? "#30C0C0" : "#1E4058",
                boxShadow: open ? "0 0 8px rgba(48,192,192,0.6)" : "none",
                transition: "background 0.3s, box-shadow 0.3s",
              }}
            />
            {/* Vertical bar (rotates out) */}
            <span
              className={styles.iconBar}
              style={{
                background: open ? "#30C0C0" : "#1E4058",
                transform: open
                  ? "rotate(90deg) scaleY(0)"
                  : "rotate(90deg) scaleY(1)",
                transition:
                  "transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s, box-shadow 0.3s",
              }}
            />
          </div>
        </div>
      </button>

      {/* ANSWER PANEL */}
      <AnimateHeight open={open}>
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId}
          className={styles.answerPanel}
        >
          {/* Accent line */}
          <div className={styles.answerAccentLine} aria-hidden="true" />

          <div className="pl-20 sm:pl-24 pr-16 sm:pr-20 pb-6">
            {/* Answer text */}
            <p
              className="font-mono text-[12px] leading-[1.85]"
              style={{ color: "#2E5C70", letterSpacing: "0.03em" }}
            >
              {item.answer}
            </p>
          </div>
        </div>
      </AnimateHeight>

      {/* Bottom line */}
      <div className={styles.rowBottomLine} aria-hidden="true" />
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function FAQ() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="faq-heading"
    >
      {/* Background layers */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        {/* HEADER */}
        <div
          className={`${styles.headerBlock} ${revealed ? styles.headerBlockRevealed : ""} flex flex-col gap-5 mb-12 sm:mb-16`}
        >
          <SectionLabel>Support</SectionLabel>

          <div className="flex flex-col gap-6">
            <h2
              id="faq-heading"
              className="font-mono text-center leading-tight"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 32px rgba(48,192,192,0.4)",
                }}
              >
                Frequently Asked
              </span>
              <br />
              Questions
            </h2>

            <div className="flex items-center justify-center gap-2">
              <TealDot size={4} />
              <span
                className="font-mono text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "#1A3848" }}
              >
                {FAQ_ITEMS.length} Common Questions
              </span>
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* FAQ LIST */}
        <div
          className={`${styles.faqList} ${revealed ? styles.faqListRevealed : ""}`}
          role="list"
          aria-label="Frequently asked questions"
        >
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.id}
              role="listitem"
              style={{ transitionDelay: revealed ? `${i * 60}ms` : "0ms" }}
              className={`${styles.faqItemWrap} ${revealed ? styles.faqItemWrapRevealed : ""}`}
            >
              <FaqRow
                item={item}
                open={openIds.has(item.id)}
                onToggle={() => toggle(item.id)}
                index={i}
              />
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div
          className={`${styles.ctaBlock} ${revealed ? styles.ctaBlockRevealed : ""} relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8 mt-12`}
        >
          <Bracket pos="tl" />
          <Bracket pos="tr" />
          <Bracket pos="bl" />
          <Bracket pos="br" />

          {/* Glow */}
          <div className={styles.ctaGlow} aria-hidden="true" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <TealDot size={5} pulse />
              <span
                className="font-mono text-[9px] tracking-[0.22em] uppercase"
                style={{ color: "#30C0C0", opacity: 0.8 }}
              >
                Still have questions?
              </span>
            </div>
            <p
              className="font-mono text-[12px] leading-relaxed"
              style={{ color: "#2A5060", letterSpacing: "0.03em" }}
            >
              We're here to help. Contact us for personalized answers to your
              specific needs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              className={`${styles.ctaPrimary} relative flex items-center gap-2 px-5 py-2.5`}
              aria-label="Contact our team"
            >
              <Bracket pos="tl" />
              <Bracket pos="br" />
              <span
                className="font-mono text-[9.5px] tracking-[0.18em] uppercase"
                style={{ color: "#7ABFCF" }}
              >
                Contact Us
              </span>
              <svg
                viewBox="0 0 12 12"
                fill="none"
                className="w-2.5 h-2.5"
                aria-hidden="true"
              >
                <path
                  d="M2 6h8M6 2l4 4-4 4"
                  stroke="#30C0C0"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className={`${styles.bottomStrip} mt-12`}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Updated{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              {FAQ_ITEMS.length} Answers
            </span>
            <TealDot size={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
