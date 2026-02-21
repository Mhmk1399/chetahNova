// components/ai-solutions/AISolutions.tsx
"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import styles from "./AISolutions.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface AISolution {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  stat: string;
  statLabel: string;
}

/* ════════════════════════════════════════
   ICONS
════════════════════════════════════════ */
const ChatbotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" strokeLinecap="round" />
  </svg>
);

const LeadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="m19 8 2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path
      d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
      strokeLinecap="round"
    />
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3v18h18" />
    <path d="M18 17V9M13 17V5M8 17v-3" strokeLinecap="round" />
    <circle cx="18" cy="6" r="2" />
  </svg>
);

const ContentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.375-9.375Z" />
    <path d="M7 10h4M7 14h6" strokeLinecap="round" />
  </svg>
);

const SalesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
    <path d="M12 6v12" />
  </svg>
);

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */
const AI_SOLUTIONS: AISolution[] = [
  {
    id: "chatbot",
    icon: <ChatbotIcon />,
    title: "AI Customer Support Agent",
    description:
      "Automated chatbot trained for your business that answers customer questions instantly.",
    tag: "SUPPORT",
    stat: "24/7",
    statLabel: "Available",
  },
  {
    id: "lead",
    icon: <LeadIcon />,
    title: "AI Lead Qualification",
    description:
      "Filters leads automatically and identifies high-value customers for your sales team.",
    tag: "LEADS",
    stat: "85%",
    statLabel: "Accuracy",
  },
  {
    id: "booking",
    icon: <BookingIcon />,
    title: "AI Booking System",
    description:
      "Turns your website into a booking machine with automated scheduling and reminders.",
    tag: "AUTOMATION",
    stat: "100%",
    statLabel: "Automated",
  },
  {
    id: "analytics",
    icon: <AnalyticsIcon />,
    title: "AI Analytics Dashboard",
    description:
      "Tracks performance, customer behavior, conversions, and growth insights in real-time.",
    tag: "ANALYTICS",
    stat: "+247%",
    statLabel: "Insights",
  },
  {
    id: "content",
    icon: <ContentIcon />,
    title: "AI Content Generator",
    description:
      "Generates SEO-friendly content based on your services, location, and keyword strategy.",
    tag: "CONTENT",
    stat: "10x",
    statLabel: "Faster",
  },
  {
    id: "sales",
    icon: <SalesIcon />,
    title: "AI Sales Assistant",
    description:
      "Guides visitors through your services and helps convert them into paying clients.",
    tag: "SALES",
    stat: "+35%",
    statLabel: "Conversion",
  },
];

/* ════════════════════════════════════════
   PARTICLE GENERATOR
════════════════════════════════════════ */
function generateOrbitParticles(count: number) {
  const particles: {
    angle: number;
    radius: number;
    size: number;
    opacity: number;
  }[] = [];
  const phi = 137.508;
  for (let i = 0; i < count; i++) {
    const angle = (i * phi) % 360;
    const radius = Number((75 + Math.sin(i * 0.5) * 10).toFixed(4));
    const size = Number((0.5 + ((i * 7) % 12) / 10).toFixed(2));
    const opacity = Number((0.15 + ((i * 13) % 8) / 10).toFixed(2));
    particles.push({ angle, radius, size, opacity });
  }
  return particles;
}

const ORBIT_PARTICLES = generateOrbitParticles(48);

/* ════════════════════════════════════════
   ATOMS
════════════════════════════════════════ */
const TealDot = ({
  size = 6,
  pulse = false,
}: {
  size?: number;
  pulse?: boolean;
}) => (
  <span
    className="relative inline-flex shrink-0"
    style={{ width: size, height: size }}
  >
    {pulse && (
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "#30C0C044",
          animation: "ping 2s cubic-bezier(0,0,.2,1) infinite",
        }}
      />
    )}
    <span
      className="relative rounded-full block"
      style={{
        width: size,
        height: size,
        background: "#30C0C0",
        boxShadow: `0 0 ${size + 2}px #30C0C0, 0 0 ${size * 3}px #30C0C044`,
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
      style={{ borderColor: "rgba(48,192,192,0.4)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   CENTRAL AI ORB
════════════════════════════════════════ */
const CentralAIOrb = () => {
  const particleElements = useMemo(() => {
    return ORBIT_PARTICLES.map((p, i) => {
      const rad = ((p.angle - 90) * Math.PI) / 180;
      const cx = Number((100 + p.radius * Math.cos(rad)).toFixed(4));
      const cy = Number((100 + p.radius * Math.sin(rad)).toFixed(4));
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={p.size}
          fill={`rgba(48, 192, 192, ${p.opacity})`}
        />
      );
    });
  }, []);

  return (
    <div className={styles.orbWrapper} aria-hidden="true">
      {/* Corner brackets */}
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      <svg viewBox="0 0 200 200" className={styles.orbSvg} fill="none">
        <defs>
          <radialGradient id="aiOrbGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#60E8E8" />
            <stop offset="40%" stopColor="#30C0C0" />
            <stop offset="100%" stopColor="#1A5060" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aiBloomGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.15" />
            <stop offset="60%" stopColor="#1A5060" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Outer bloom */}
        <circle cx="100" cy="100" r="90" fill="url(#aiBloomGrad)" />

        {/* Particle ring */}
        <g className={styles.particleRing}>{particleElements}</g>

        {/* Orbit rings */}
        <circle
          cx="100"
          cy="100"
          r="75"
          stroke="rgba(48,192,192,0.08)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r="60"
          stroke="rgba(48,192,192,0.05)"
          strokeWidth="0.5"
          strokeDasharray="2 8"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r="45"
          stroke="rgba(48,192,192,0.04)"
          strokeWidth="0.5"
          strokeDasharray="1 6"
          fill="none"
        />

        {/* Satellite */}
        <g className={styles.satellite}>
          <circle cx="100" cy="25" r="3" fill="#50C8D0" />
          <circle
            cx="100"
            cy="25"
            r="5"
            fill="none"
            stroke="#30C0C0"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </g>

        {/* Core */}
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="url(#aiOrbGrad)"
          className={styles.orbCore}
        />

        {/* Core ring */}
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke="#30C0C0"
          strokeWidth="0.5"
          opacity="0.4"
        />

        {/* Center text */}
        <g className={styles.aiSymbol}>
          <rect
            x="88"
            y="92"
            width="24"
            height="16"
            rx="2"
            fill="rgba(8,14,26,0.8)"
            stroke="rgba(48,192,192,0.3)"
            strokeWidth="0.5"
          />
          <text
            x="100"
            y="103"
            textAnchor="middle"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
            fill="#60E8E8"
          >
            AI
          </text>
        </g>

        {/* Crosshair */}
        <line
          x1="92"
          y1="100"
          x2="75"
          y2="100"
          stroke="#1A3848"
          strokeWidth="0.5"
        />
        <line
          x1="108"
          y1="100"
          x2="125"
          y2="100"
          stroke="#1A3848"
          strokeWidth="0.5"
        />
        <line
          x1="100"
          y1="92"
          x2="100"
          y2="75"
          stroke="#1A3848"
          strokeWidth="0.5"
        />
        <line
          x1="100"
          y1="108"
          x2="100"
          y2="125"
          stroke="#1A3848"
          strokeWidth="0.5"
        />
      </svg>

      {/* Status indicator */}
      <div className={styles.orbStatus}>
        <TealDot size={4} pulse />
        <span
          className="font-mono text-[8px] tracking-[0.2em] uppercase"
          style={{ color: "#1A3848" }}
        >
          ACTIVE
        </span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   AI SOLUTION CARD
════════════════════════════════════════ */
const AISolutionCard = ({
  solution,
  index,
  revealed,
}: {
  solution: AISolution;
  index: number;
  revealed: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.solutionCard} ${revealed ? styles.cardRevealed : ""} relative`}
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* Card glow */}
      <div
        className={styles.cardGlow}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Top scan line */}
      <div
        className={`${styles.cardScanTop} ${hovered ? styles.cardScanTopActive : ""}`}
        aria-hidden="true"
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className={styles.tagBadge}>
          <TealDot size={3} />
          <span
            className="font-mono text-[7.5px] tracking-[0.2em] uppercase"
            style={{
              color: hovered ? "#30C0C0" : "#1A3848",
              transition: "color 0.3s",
            }}
          >
            {solution.tag}
          </span>
        </div>
        <span
          className="font-mono text-[8px] tracking-[0.15em]"
          style={{ color: "#1A3848" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Main content */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={styles.iconBox}>
          <div
            className={styles.iconInner}
            style={{
              color: hovered ? "#60E8E8" : "#30C0C0",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {solution.icon}
          </div>
          <Bracket pos="tl" />
          <Bracket pos="br" />
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <h3
            className="font-mono text-[13px] font-semibold leading-tight"
            style={{
              color: hovered ? "#C0E0E8" : "#5A8898",
              letterSpacing: "0.01em",
              transition: "color 0.3s",
            }}
          >
            {solution.title}
          </h3>
          <p
            className="font-mono text-[11px] leading-relaxed"
            style={{ color: "#3A6070", letterSpacing: "0.01em" }}
          >
            {solution.description}
          </p>
        </div>
      </div>

      {/* Stat row */}
      <div className={styles.statRow}>
        <div className={styles.statDivider} />
        <div className="flex items-baseline gap-2">
          <span
            className="font-mono font-bold"
            style={{
              fontSize: "16px",
              color: hovered ? "#70E8E8" : "#50C8D0",
              letterSpacing: "-0.02em",
              transition: "color 0.3s",
            }}
          >
            {solution.stat}
          </span>
          <span
            className="font-mono text-[8px] tracking-[0.15em] uppercase"
            style={{ color: "#1E4058" }}
          >
            {solution.statLabel}
          </span>
        </div>
      </div>

      {/* Bottom line */}
      <div className={styles.cardBottomLine} aria-hidden="true" />
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function AISolutions() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const map = cardRefs.current;
    const observers: IntersectionObserver[] = [];

    map.forEach((el, id) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed((p) => new Set([...p, id]));
            obs.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const setRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(id, el);
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="ai-solutions-heading"
    >
      {/* Background layers */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
        {/* ══ HEADER ══ */}
        <div className="flex flex-col gap-4 mb-10 sm:mb-14">
          <SectionLabel>AI Solutions</SectionLabel>

          <div className="flex flex-col gap-5 max-w-3xl">
            <h2
              id="ai-solutions-heading"
              className="font-mono leading-tight"
              style={{
                fontSize: "clamp(22px, 3.5vw, 38px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              AI Tools Built Specifically
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 28px rgba(48,192,192,0.4)",
                }}
              >
                for Your Business
              </span>
            </h2>

            <p
              className="font-mono text-[13px] leading-relaxed max-w-2xl"
              style={{ color: "#3A6070", letterSpacing: "0.01em" }}
            >
              Every business has different customers, different workflows, and
              different needs. That's why we design and develop AI tools that
              match your exact industry and customer journey.
            </p>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ TOP CARDS ROW ══ */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6"
          role="list"
        >
          {AI_SOLUTIONS.slice(0, 3).map((solution, i) => (
            <div key={solution.id} role="listitem" ref={setRef(solution.id)}>
              <AISolutionCard
                solution={solution}
                index={i}
                revealed={revealed.has(solution.id)}
              />
            </div>
          ))}
        </div>

        {/* ══ ORB SECTION ══ */}
        <div className={styles.orbSection}>
          <div className={styles.orbLine} />
          <CentralAIOrb />
          <div className={styles.orbLine} />
        </div>

        {/* ══ BOTTOM CARDS ROW ══ */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10 sm:mb-12"
          role="list"
        >
          {AI_SOLUTIONS.slice(3, 6).map((solution, i) => (
            <div key={solution.id} role="listitem" ref={setRef(solution.id)}>
              <AISolutionCard
                solution={solution}
                index={i + 3}
                revealed={revealed.has(solution.id)}
              />
            </div>
          ))}
        </div>

        {/* ══ DIVIDER ══ */}
        <div className={styles.sectionDivider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerNode}>
            <TealDot size={6} pulse />
          </div>
          <div className={styles.dividerLine} />
        </div>

        {/* ══ BOTTOM STRIP ══ */}
        <div className={styles.bottomStrip}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Want to see AI in action for your business?
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <a
            href="#demo"
            className={`${styles.ctaLink} relative flex items-center gap-2`}
          >
            <Bracket pos="tl" />
            <Bracket pos="br" />
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-3 h-3"
              style={{ color: "#30C0C0" }}
            >
              <polygon points="4,2 14,8 4,14" fill="currentColor" />
            </svg>
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "#7ABFCF" }}
            >
              Request AI Demo
            </span>
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="#30C0C0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* ══ TRUST INDICATORS ══ */}
        <div className={styles.trustRow}>
          {["Free consultation", "Custom solutions", "Fast delivery"].map(
            (text, i) => (
              <div key={i} className="flex items-center gap-2">
                <TealDot size={3} />
                <span
                  className="font-mono text-[8px] tracking-[0.15em] uppercase"
                  style={{ color: "#1A3848" }}
                >
                  {text}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
