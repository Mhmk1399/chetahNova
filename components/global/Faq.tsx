// components/faq/Faq.tsx
"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import styles from "./Faq.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag?: string;
}

export interface FaqCategory {
  label: string;
  items: FaqItem[];
}

export interface FaqProps {
  title?: string;
  subtitle?: string;
  categories?: FaqCategory[];
  items?: FaqItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
}

/* ════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════ */
const MOCK_CATEGORIES: FaqCategory[] = [
  {
    label: "General",
    items: [
      {
        id: "g1",
        question: "What exactly does Axon provide?",
        answer:
          "Axon is an infrastructure platform built for high-scale engineering teams. We provide six core services — Edge Compute, Mesh Networking, Threat Shield, Data Pipeline, Observe & Trace, and Vault & Secrets — all managed through a single unified control plane. Think of it as the foundation layer your team never has to rebuild again.",
        tag: "OVERVIEW",
      },
      {
        id: "g2",
        question: "How long does onboarding typically take?",
        answer:
          "Most teams are fully operational within 48 hours. The first 30 minutes covers connecting your first environment via our CLI or Terraform provider. A dedicated senior engineer is assigned to your account from day one — they handle the heavy lifting so your team can stay focused on shipping.",
        tag: "ONBOARDING",
      },
      {
        id: "g3",
        question: "Do you support multi-cloud and hybrid setups?",
        answer:
          "Yes — this is a core use case. Axon's mesh network was designed specifically to span AWS, GCP, Azure, and on-prem nodes in a single encrypted fabric. You get a unified control plane regardless of where your workloads actually run. No vendor lock-in, no separate VPN stacks.",
        tag: "ARCHITECTURE",
      },
    ],
  },
  {
    label: "Security",
    items: [
      {
        id: "s1",
        question: "What compliance standards do you meet?",
        answer:
          "Axon is SOC 2 Type II certified, GDPR compliant, and HIPAA-eligible. We also maintain FIPS 140-2 validated cryptographic modules for regulated industries. Our compliance documentation package — including our latest penetration test report and audit logs — is available under NDA.",
        tag: "COMPLIANCE",
      },
      {
        id: "s2",
        question: "How does zero-trust work in practice?",
        answer:
          "Every service-to-service request is verified at both the perimeter and at each internal hop using mutual TLS. Credentials are short-lived, machine-generated, and automatically rotated — no static API keys, no implicit trust based on network location. If a token is compromised, it's expired before it can be misused.",
        tag: "ZERO-TRUST",
      },
      {
        id: "s3",
        question: "Where is our data stored and processed?",
        answer:
          "Data residency is configurable at the account level. You choose which regions are permitted for storage and processing — we enforce those constraints at the infrastructure layer, not just in policy documents. Metadata and telemetry can also be pinned to a specific geography if required by your legal team.",
        tag: "DATA RESIDENCY",
      },
    ],
  },
  {
    label: "Pricing",
    items: [
      {
        id: "p1",
        question: "How is pricing structured?",
        answer:
          "Pricing is usage-based with no minimum commitments on our Growth tier. You pay for what you consume — compute seconds, data transferred, secrets rotations, and observability ingestion. Enterprise contracts include reserved capacity discounts, a named account engineer, and custom SLA terms. We publish a pricing calculator so there are no surprises.",
        tag: "BILLING",
      },
      {
        id: "p2",
        question: "Is there a free tier or trial period?",
        answer:
          "Yes. Every new account includes a 14-day full-featured trial with $500 in credits — no credit card required. After the trial, the free tier covers up to 100k edge requests per day, 1GB of logs, and one secrets vault. It's enough to run a real side project or evaluate Axon against your staging environment.",
        tag: "TRIAL",
      },
      {
        id: "p3",
        question: "Can we negotiate custom terms for our enterprise?",
        answer:
          "Absolutely. Enterprise agreements typically include volume discounts, custom data processing addenda, dedicated infrastructure tenancy, priority support SLAs with guaranteed response times, and multi-year pricing locks. Reach out to our solutions team — we respond to enterprise inquiries within one business day.",
        tag: "ENTERPRISE",
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        id: "su1",
        question: "What does support actually look like?",
        answer:
          "On Growth plans, you get access to our community forum, documentation, and a shared Slack channel with typical 4-hour response times. On Enterprise plans, a named senior engineer is embedded in your team's Slack or Teams workspace. P0 incidents get a response in under 15 minutes, with a root-cause analysis delivered within 2 hours and a full post-mortem within 24.",
        tag: "SLA",
      },
      {
        id: "su2",
        question: "Do you offer professional services or implementation help?",
        answer:
          "Yes. Our solutions engineering team offers architecture reviews, migration sprints, and custom integration work. We've helped teams migrate off legacy VPNs, re-architect monoliths for edge deployment, and build internal developer platforms on top of Axon's APIs. Engagements are scoped and priced separately from your platform subscription.",
        tag: "SERVICES",
      },
    ],
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
   — measures real content height and
     transitions max-height smoothly
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

    /* measure on open */
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
  isFirst,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
  isFirst: boolean;
}) => {
  const uid = useId();
  const btnId = `faq-btn-${uid}`;
  const panelId = `faq-panel-${uid}`;

  return (
    <div
      className={`
        ${styles.faqRow}
        ${open ? styles.faqRowOpen : ""}
        ${isFirst ? styles.faqRowFirst : ""}
        relative
      `}
    >
      {/* left active stripe */}
      <div
        className={styles.rowStripe}
        style={{ opacity: open ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* active glow */}
      <div
        className={styles.rowGlow}
        style={{ opacity: open ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* ── QUESTION BUTTON ── */}
      <button
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        className={`${styles.faqBtn} w-full flex items-start gap-4 text-left`}
        onClick={onToggle}
      >
        {/* index + tag col */}
        <div className="flex flex-col items-start gap-1 shrink-0 pt-0.5 w-16 sm:w-20">
          <span
            className="font-mono text-[9px] tracking-[0.18em]"
            style={{
              color: open ? "#30C0C0" : "#1A3848",
              transition: "color 0.3s",
            }}
          >
            {item.id.toUpperCase()}
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

        {/* question text */}
        <span
          className={`${styles.questionText} flex-1 font-mono leading-snug`}
          style={{
            color: open ? "#C0DDE8" : "#4A7A8A",
            transition: "color 0.3s",
          }}
        >
          {item.question}
        </span>

        {/* icon */}
        <div
          className={`${styles.iconWrap} relative flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Bracket pos="tl" />
          <Bracket pos="br" />

          {/* plus → minus morphing icon */}
          <div className={styles.iconInner}>
            {/* horizontal bar (always visible) */}
            <span
              className={styles.iconBar}
              style={{
                background: open ? "#30C0C0" : "#1E4058",
                boxShadow: open ? "0 0 8px rgba(48,192,192,0.6)" : "none",
                transition: "background 0.3s, box-shadow 0.3s",
              }}
            />
            {/* vertical bar (rotates out) */}
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

      {/* ── ANSWER PANEL ── */}
      <AnimateHeight open={open}>
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId}
          className={styles.answerPanel}
        >
          {/* left accent line inside answer */}
          <div className={styles.answerAccentLine} aria-hidden="true" />

          <div className="pl-20 sm:pl-24 pr-16 sm:pr-20 pb-7">
            {/* answer text */}
            <p
              className="font-mono text-[12px] leading-[1.85] mb-5"
              style={{ color: "#2E5C70", letterSpacing: "0.03em" }}
            >
              {item.answer}
            </p>

            {/* bottom row: tag + cta */}
            <div className="flex items-center gap-4 flex-wrap">
              {item.tag && (
                <div className="flex items-center gap-1.5">
                  <TealDot size={3} color="#1E4860" />
                  <span
                    className="font-mono text-[8.5px] tracking-[0.2em] uppercase"
                    style={{ color: "#1A3848" }}
                  >
                    {item.tag}
                  </span>
                </div>
              )}
              <a
                href="#"
                className={`${styles.learnMore} flex items-center gap-1.5`}
                aria-label={`Learn more about: ${item.question}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="font-mono text-[9px] tracking-[0.18em] uppercase"
                  style={{ color: "#1E5060" }}
                >
                  Learn more
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
                    opacity="0.6"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
};

/* ════════════════════════════════════════
   CATEGORY TAB
════════════════════════════════════════ */
const CategoryTab = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    role="tab"
    aria-selected={active}
    className={`${styles.catTab} ${active ? styles.catTabActive : ""} relative flex items-center gap-2`}
    onClick={onClick}
  >
    {active && (
      <>
        <span className={styles.catTabDot} aria-hidden="true" />
      </>
    )}
    <span className="font-mono text-[10px] tracking-[0.18em] uppercase whitespace-nowrap">
      {label}
    </span>
    <span
      className={`${styles.catCount} font-mono text-[8px] tracking-widest`}
      style={{
        color: active ? "#30C0C0" : "#112030",
        background: active ? "rgba(48,192,192,0.1)" : "rgba(8,14,24,0.8)",
        borderColor: active ? "rgba(48,192,192,0.25)" : "#0C1828",
      }}
    >
      {count}
    </span>
    {/* active bottom bar */}
    <span
      className={styles.catTabBar}
      style={{ transform: active ? "scaleX(1)" : "scaleX(0)" }}
      aria-hidden="true"
    />
  </button>
);

/* ════════════════════════════════════════
   DECORATIVE SIDE ORB
════════════════════════════════════════ */
const SideOrb = () => (
  <div className={styles.sideOrbWrap} aria-hidden="true">
    <svg viewBox="0 0 120 340" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id="faqOrb" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#104060" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="faqGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* vertical spine */}
      <line
        x1="60"
        y1="20"
        x2="60"
        y2="320"
        stroke="#0E1E30"
        strokeWidth="0.6"
      />

      {/* tick marks along spine */}
      {[60, 100, 140, 180, 220, 260].map((y, i) => (
        <g key={y}>
          <line
            x1={i % 2 === 0 ? 52 : 55}
            y1={y}
            x2={68}
            y2={y}
            stroke={i % 2 === 0 ? "#183858" : "#0E1E2E"}
            strokeWidth="0.5"
          />
          {i % 2 === 0 && (
            <circle cx="60" cy={y} r="1.5" fill="#183858" opacity="0.6" />
          )}
        </g>
      ))}

      {/* mini orb at top */}
      <circle cx="60" cy="40" r="24" fill="url(#faqOrb)" />
      <circle
        cx="60"
        cy="40"
        r="12"
        fill="none"
        stroke="#183858"
        strokeWidth="0.5"
        strokeDasharray="1.5 4"
        opacity="0.6"
      />
      <circle
        cx="60"
        cy="40"
        r="6"
        fill="none"
        stroke="#1A4060"
        strokeWidth="0.4"
        opacity="0.5"
      />
      <circle
        cx="60"
        cy="40"
        r="2.5"
        fill="#30C0C0"
        opacity="0.5"
        filter="url(#faqGlow)"
      />

      {/* orbiting dot */}
      <g className={styles.sideOrbSat} style={{ transformOrigin: "60px 40px" }}>
        <circle
          cx="60"
          cy="28"
          r="1.5"
          fill="#60DFDF"
          opacity="0.8"
          filter="url(#faqGlow)"
        />
      </g>

      {/* bottom accent */}
      <circle
        cx="60"
        cy="300"
        r="4"
        fill="none"
        stroke="#0E1E30"
        strokeWidth="0.5"
      />
      <circle cx="60" cy="300" r="1.5" fill="#183858" opacity="0.5" />
    </svg>
  </div>
);

/* ════════════════════════════════════════
   SEARCH BAR
════════════════════════════════════════ */
const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className={`${styles.searchWrap} relative flex items-center`}>
    <Bracket pos="tl" />
    <Bracket pos="br" />

    {/* search icon */}
    <div
      className="absolute left-4 flex items-center pointer-events-none"
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
        <circle cx="7" cy="7" r="4.5" stroke="#1E4058" strokeWidth="1" />
        <path
          d="M10.5 10.5L13 13"
          stroke="#1E4058"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>

    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search questions…"
      className={styles.searchInput}
      aria-label="Search FAQ questions"
    />

    {/* clear button */}
    {value && (
      <button
        className={`${styles.searchClear} absolute right-3`}
        onClick={() => onChange("")}
        aria-label="Clear search"
      >
        <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
          <path
            d="M2 2l8 8M10 2l-8 8"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    )}
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Faq({
  title = "Frequently asked questions.",
  subtitle = "Everything your team needs to know before signing up — answered honestly.",
  categories = MOCK_CATEGORIES,
  items,
  defaultOpenId,
  allowMultiple = false,
}: FaqProps) {
  /* flatten all items if flat list passed */
  const allCategories: FaqCategory[] = items
    ? [{ label: "All", items }]
    : categories;

  const [activeCategory, setActiveCategory] = useState(
    allCategories[0]?.label ?? "",
  );
  const [openIds, setOpenIds] = useState<Set<string>>(
    defaultOpenId ? new Set([defaultOpenId]) : new Set(),
  );
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* intersection reveal */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* toggle open/close */
  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  /* current category items, filtered by search */
  const currentItems =
    allCategories.find((c) => c.label === activeCategory)?.items ?? [];

  const filteredItems = search.trim()
    ? allCategories
        .flatMap((c) => c.items)
        .filter(
          (item) =>
            item.question.toLowerCase().includes(search.toLowerCase()) ||
            item.answer.toLowerCase().includes(search.toLowerCase()) ||
            item.tag?.toLowerCase().includes(search.toLowerCase()),
        )
    : currentItems;

  /* total count */
  const totalCount = allCategories.reduce((a, c) => a + c.items.length, 0);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="faq-heading"
    >
      {/* bg */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_56px] gap-8 lg:gap-12">
          {/* ══ MAIN COLUMN ══ */}
          <div className="flex flex-col gap-12">
            {/* ── HEADER ── */}
            <div
              className={`${styles.headerBlock} ${revealed ? styles.headerBlockRevealed : ""} flex flex-col gap-5`}
            >
              <SectionLabel>FAQ</SectionLabel>

              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <h2
                  id="faq-heading"
                  className="font-mono leading-tight max-w-xl"
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 44px)",
                    color: "#B8D8E4",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title.includes(".") ? (
                    <>
                      {title.split(".")[0]}.
                      <br />
                      <span
                        style={{
                          color: "#30C0C0",
                          textShadow: "0 0 32px rgba(48,192,192,0.4)",
                        }}
                      >
                        {title.split(".").slice(1).join(".").trim()}
                      </span>
                    </>
                  ) : (
                    <span style={{ color: "#30C0C0" }}>{title}</span>
                  )}
                </h2>

                <div className="flex flex-col gap-2 lg:items-end">
                  <p
                    className="font-mono text-[11.5px] leading-relaxed lg:text-right max-w-xs"
                    style={{ color: "#2A5060", letterSpacing: "0.03em" }}
                  >
                    {subtitle}
                  </p>
                  <div className="flex items-center gap-2">
                    <TealDot size={4} />
                    <span
                      className="font-mono text-[9px] tracking-[0.2em] uppercase"
                      style={{ color: "#1A3848" }}
                    >
                      {totalCount} questions answered
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.headerDivider} aria-hidden="true" />
            </div>

            {/* ── SEARCH + FILTERS ROW ── */}
            <div
              className={`${styles.controlsRow} ${revealed ? styles.controlsRevealed : ""} flex flex-col sm:flex-row gap-4 items-start sm:items-center`}
            >
              <SearchBar value={search} onChange={setSearch} />

              {!search && (
                <div
                  className="flex items-center gap-1.5 overflow-x-auto shrink-0"
                  role="tablist"
                  aria-label="FAQ categories"
                  style={{ scrollbarWidth: "none" }}
                >
                  {allCategories.map((cat) => (
                    <CategoryTab
                      key={cat.label}
                      label={cat.label}
                      count={cat.items.length}
                      active={activeCategory === cat.label}
                      onClick={() => {
                        setActiveCategory(cat.label);
                        if (!allowMultiple) setOpenIds(new Set());
                      }}
                    />
                  ))}
                </div>
              )}

              {search && (
                <div className="flex items-center gap-2 shrink-0">
                  <TealDot size={4} color="#1E4860" />
                  <span
                    className="font-mono text-[9.5px] tracking-[0.16em] uppercase whitespace-nowrap"
                    style={{ color: "#1A3848" }}
                  >
                    {filteredItems.length} result
                    {filteredItems.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* ── FAQ LIST ── */}
            <div
              className={`${styles.faqList} ${revealed ? styles.faqListRevealed : ""}`}
              role="list"
              aria-label="FAQ list"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, i) => (
                  <div
                    key={item.id}
                    role="listitem"
                    style={{
                      transitionDelay: revealed ? `${i * 55}ms` : "0ms",
                    }}
                    className={`${styles.faqItemWrap} ${revealed ? styles.faqItemWrapRevealed : ""}`}
                  >
                    <FaqRow
                      item={item}
                      open={openIds.has(item.id)}
                      onToggle={() => toggle(item.id)}
                      isFirst={i === 0}
                    />
                  </div>
                ))
              ) : (
                /* empty search state */
                <div
                  className={`${styles.emptyState} flex flex-col items-center gap-5 py-16`}
                >
                  <svg
                    viewBox="0 0 80 80"
                    fill="none"
                    className="w-16 h-16 opacity-30"
                    aria-hidden="true"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#183858"
                      strokeWidth="0.6"
                      strokeDasharray="2 5"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="20"
                      fill="none"
                      stroke="#1A4060"
                      strokeWidth="0.4"
                    />
                    <circle cx="40" cy="40" r="6" fill="#183858" />
                    <line
                      x1="40"
                      y1="20"
                      x2="40"
                      y2="30"
                      stroke="#183858"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="40"
                      y1="50"
                      x2="40"
                      y2="60"
                      stroke="#183858"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="20"
                      y1="40"
                      x2="30"
                      y2="40"
                      stroke="#183858"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="50"
                      y1="40"
                      x2="60"
                      y2="40"
                      stroke="#183858"
                      strokeWidth="0.5"
                    />
                  </svg>
                  <div className="flex flex-col items-center gap-2">
                    <p
                      className="font-mono text-[11px] tracking-[0.16em] uppercase"
                      style={{ color: "#1A3848" }}
                    >
                      No results for &ldquo;{search}&rdquo;
                    </p>
                    <p
                      className="font-mono text-[10px] tracking-widest"
                      style={{ color: "#112030" }}
                    >
                      Try a different keyword or browse by category
                    </p>
                  </div>
                  <button
                    className={styles.clearBtn}
                    onClick={() => setSearch("")}
                    aria-label="Clear search and show all questions"
                  >
                    <Bracket pos="tl" />
                    <Bracket pos="br" />
                    <span
                      className="font-mono text-[9.5px] tracking-[0.18em] uppercase"
                      style={{ color: "#30C0C0" }}
                    >
                      Clear search
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* ── STILL HAVE QUESTIONS CTA ── */}
            <div
              className={`${styles.ctaBlock} ${revealed ? styles.ctaBlockRevealed : ""} relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8`}
            >
              <Bracket pos="tl" />
              <Bracket pos="tr" />
              <Bracket pos="bl" />
              <Bracket pos="br" />

              {/* glow */}
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
                  Our engineering team responds to every inquiry — usually
                  within a few hours.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#"
                  className={`${styles.ctaSecondary} relative flex items-center gap-2 px-5 py-2.5`}
                  aria-label="Browse documentation"
                >
                  <Bracket pos="tl" />
                  <Bracket pos="br" />
                  <span
                    className="font-mono text-[9.5px] tracking-[0.18em] uppercase"
                    style={{ color: "#1E5060" }}
                  >
                    Docs
                  </span>
                </a>
                <a
                  href="#"
                  className={`${styles.ctaPrimary} relative flex items-center gap-2 px-5 py-2.5`}
                  aria-label="Contact our team"
                >
                  <Bracket pos="tl" />
                  <Bracket pos="br" />
                  <span
                    className="font-mono text-[9.5px] tracking-[0.18em] uppercase"
                    style={{ color: "#7ABFCF" }}
                  >
                    Contact us
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
          </div>

          {/* ══ DECORATIVE SIDE ORB (desktop only) ══ */}
          <div className="hidden lg:block">
            <SideOrb />
          </div>
        </div>

        {/* bottom strip */}
        <div className={`${styles.bottomStrip} mt-16 sm:mt-20`}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Updated regularly
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              {totalCount} answers · {allCategories.length} categories
            </span>
            <TealDot size={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
