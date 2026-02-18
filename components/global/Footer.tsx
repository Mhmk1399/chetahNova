// components/footer/Footer.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Footer.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

/* ════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════ */
const COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: "#" },
      { label: "Edge Network", href: "#" },
      { label: "Observability", href: "#" },
      { label: "Security", href: "#" },
      { label: "Changelog", href: "#", badge: "NEW" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "SDKs", href: "#" },
      { label: "Status Page", href: "#" },
      { label: "Open Source", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#", badge: "5 OPEN" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "DPA", href: "#" },
      { label: "SLA", href: "#" },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
];

const SYSTEM_STATS = [
  { label: "API", status: "operational" },
  { label: "EDGE", status: "operational" },
  { label: "CDN", status: "operational" },
  { label: "AUTH", status: "degraded" },
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
    className="relative inline-flex flex-shrink-0"
    style={{ width: size, height: size }}
  >
    {pulse && (
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: `${color}55` }}
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
   NEWSLETTER INPUT
════════════════════════════════════════ */
const NewsletterForm = () => {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !value.includes("@")) {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
      return;
    }
    setState("loading");
    setTimeout(() => {
      setState("success");
      setValue("");
    }, 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
      aria-label="Newsletter subscription"
      noValidate
    >
      <p
        className="font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: "#2E5868" }}
      >
        Stay in the loop
      </p>

      <div className={`${styles.inputWrap} relative`}>
        <Bracket pos="tl" />
        <Bracket pos="br" />

        <input
          ref={inputRef}
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="you@company.io"
          className={`${styles.input} w-full`}
          aria-label="Email address"
          aria-invalid={state === "error"}
          disabled={state === "loading" || state === "success"}
          autoComplete="email"
        />

        <button
          type="submit"
          className={`${styles.inputBtn} ${state === "success" ? styles.inputBtnSuccess : ""}`}
          disabled={state === "loading" || state === "success"}
          aria-label="Subscribe"
        >
          {state === "loading" ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : state === "success" ? (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path
                d="M3 8l3.5 3.5 6.5-7"
                stroke="#30C0C0"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* feedback */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[14px]">
        {state === "error" && (
          <p
            className="font-mono text-[9.5px] tracking-[0.12em]"
            style={{ color: "#C05050" }}
          >
            ▸ enter a valid email address
          </p>
        )}
        {state === "success" && (
          <p
            className="font-mono text-[9.5px] tracking-[0.12em]"
            style={{ color: "#30C0C0" }}
          >
            ▸ you're on the list — welcome aboard
          </p>
        )}
      </div>
    </form>
  );
};

/* ════════════════════════════════════════
   SYSTEM STATUS BAR
════════════════════════════════════════ */
const SystemStatus = () => {
  const allOperational = SYSTEM_STATS.every((s) => s.status === "operational");
  return (
    <div
      className={`${styles.statusBar} flex items-center gap-4 flex-wrap`}
      role="status"
      aria-label="System status"
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        <TealDot
          size={5}
          pulse={allOperational}
          color={allOperational ? "#30C0C0" : "#C09030"}
        />
        <span
          className="font-mono text-[9px] tracking-[0.22em] uppercase"
          style={{ color: allOperational ? "#2A6878" : "#7A5820" }}
        >
          {allOperational ? "All systems go" : "Partial degradation"}
        </span>
      </div>

      <div className={styles.statusDivider} aria-hidden="true" />

      <div className="flex items-center gap-3 flex-wrap">
        {SYSTEM_STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{
                background: s.status === "operational" ? "#30C0C0" : "#C09030",
                boxShadow:
                  s.status === "operational"
                    ? "0 0 4px #30C0C0"
                    : "0 0 4px #C09030",
              }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-[8.5px] tracking-[0.18em]"
              style={{
                color: s.status === "operational" ? "#1E4858" : "#5A4018",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   LOGO MARK
════════════════════════════════════════ */
const LogoMark = () => (
  <div className="flex items-center gap-3">
    {/* mini orb SVG */}
    <div className={styles.logoOrbWrap} aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="fOrb" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#70E8E8" />
            <stop offset="50%" stopColor="#30C0C0" />
            <stop offset="100%" stopColor="#0B3848" stopOpacity="0" />
          </radialGradient>
          <filter id="fOrbGlow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="#183858"
          strokeWidth="0.6"
          strokeDasharray="2 5"
          fill="none"
          opacity="0.7"
        />
        <circle
          cx="18"
          cy="18"
          r="9"
          fill="url(#fOrb)"
          filter="url(#fOrbGlow)"
        />
        <ellipse
          cx="15"
          cy="15"
          rx="3"
          ry="2"
          fill="white"
          opacity="0.08"
          transform="rotate(-20 18 18)"
        />
        <circle
          cx="18"
          cy="18"
          r="9"
          fill="none"
          stroke="#40D8D8"
          strokeWidth="0.4"
          opacity="0.3"
        />
        {/* satellite */}
        <g
          className={styles.footerSat}
          style={{ transformOrigin: "18px 18px" }}
        >
          <circle
            cx="18"
            cy="2"
            r="2"
            fill="#60DFDF"
            filter="url(#fOrbGlow)"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>

    <div className="flex flex-col">
      <span
        className="font-mono font-semibold tracking-[0.22em] uppercase leading-none"
        style={{
          fontSize: 15,
          color: "#C8DDE8",
          textShadow: "0 0 20px rgba(48,192,192,0.25)",
        }}
      >
        AXON
      </span>
      <span
        className="font-mono text-[8px] tracking-[0.25em] uppercase"
        style={{ color: "#30C0C0", opacity: 0.6, marginTop: 2 }}
      >
        SYS · VER 2.4.1
      </span>
    </div>
  </div>
);

/* ════════════════════════════════════════
   DECORATIVE GRID LINES (background SVG)
════════════════════════════════════════ */
const DecorLines = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="lineGradV" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#30C0C0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lineGradH" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#30C0C0" stopOpacity="0" />
        <stop offset="30%" stopColor="#30C0C0" stopOpacity="0.1" />
        <stop offset="70%" stopColor="#30C0C0" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#30C0C0" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* vertical accent lines */}
    <line
      x1="0"
      y1="0"
      x2="0"
      y2="100%"
      stroke="url(#lineGradV)"
      strokeWidth="1"
    />
    <line
      x1="100%"
      y1="0"
      x2="100%"
      y2="100%"
      stroke="url(#lineGradV)"
      strokeWidth="1"
    />
    {/* horizontal top line */}
    <line
      x1="0"
      y1="1"
      x2="100%"
      y2="1"
      stroke="url(#lineGradH)"
      strokeWidth="1"
    />
  </svg>
);

/* ════════════════════════════════════════
   FOOTER COLUMN
════════════════════════════════════════ */
const FooterCol = ({ col }: { col: FooterColumn }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <span
        className="w-1 h-1 rounded-full flex-shrink-0"
        style={{ background: "#30C0C0", boxShadow: "0 0 4px #30C0C0" }}
        aria-hidden="true"
      />
      <h3
        className="font-mono text-[9.5px] tracking-[0.28em] uppercase"
        style={{ color: "#30C0C0", opacity: 0.7 }}
      >
        {col.heading}
      </h3>
    </div>

    <ul className="flex flex-col gap-1" role="list">
      {col.links.map((link) => (
        <li key={link.label} role="listitem">
          <a
            href={link.href}
            className={`${styles.footerLink} flex items-center gap-2 py-1`}
          >
            <span
              className={`${styles.footerLinkDash} font-mono text-[10px]`}
              aria-hidden="true"
            >
              —
            </span>
            <span className="font-mono text-[11.5px] tracking-[0.06em]">
              {link.label}
            </span>
            {link.badge && <span className={styles.badge}>{link.badge}</span>}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

/* ════════════════════════════════════════
   SOCIAL BUTTON
════════════════════════════════════════ */
const SocialBtn = ({ link }: { link: SocialLink }) => (
  <a
    href={link.href}
    className={`${styles.socialBtn} relative flex items-center justify-center`}
    aria-label={link.label}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    {link.icon}
  </a>
);

/* ════════════════════════════════════════
   LIVE CLOCK
════════════════════════════════════════ */
const LiveClock = () => {
  const [time, setTime] = useState("——:——:——");
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(
        [n.getUTCHours(), n.getUTCMinutes(), n.getUTCSeconds()]
          .map((x) => String(x).padStart(2, "0"))
          .join(":"),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2" aria-label={`UTC time: ${time}`}>
      <TealDot size={4} pulse />
      <span
        className="font-mono text-[9px] tracking-[0.18em]"
        style={{ color: "#1E4858", fontVariantNumeric: "tabular-nums" }}
      >
        UTC {time}
      </span>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN FOOTER COMPONENT
════════════════════════════════════════ */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`${styles.footer} relative w-full overflow-hidden`}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* ── background layers ── */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <DecorLines />

      {/* top scan border */}
      <div className={styles.topScan} aria-hidden="true" />

      {/* ══════════════════════════════════════
          UPPER: brand + newsletter + social
      ══════════════════════════════════════ */}
      <div
        className="relative z-10 w-full max-w-[1280px] mx-auto
                   px-5 sm:px-10 lg:px-16 pt-16 sm:pt-20"
      >
        {/* top row */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[280px_1fr_280px]
                     gap-10 lg:gap-8 pb-14 sm:pb-16"
          style={{ borderBottom: "1px solid #0D1C2E" }}
        >
          {/* LEFT: brand */}
          <div className="flex flex-col gap-6">
            <LogoMark />
            <p
              className="font-mono text-[11px] leading-relaxed"
              style={{
                color: "#2A4E60",
                letterSpacing: "0.04em",
                maxWidth: 240,
              }}
            >
              Infrastructure for teams who ship fast and sleep well.
              Edge-native, zero-trust, always-on.
            </p>
            {/* social icons */}
            <div
              className="flex items-center gap-2"
              role="list"
              aria-label="Social links"
            >
              {SOCIAL_LINKS.map((s) => (
                <div key={s.label} role="listitem">
                  <SocialBtn link={s} />
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: link columns */}
          <nav
            className="grid grid-cols-2 sm:grid-cols-4 gap-8"
            aria-label="Footer navigation"
          >
            {COLUMNS.map((col) => (
              <FooterCol key={col.heading} col={col} />
            ))}
          </nav>

          {/* RIGHT: newsletter */}
          <div
            className={`${styles.newsletterPanel} relative p-6 flex flex-col gap-5`}
          >
            <Bracket pos="tl" />
            <Bracket pos="br" />

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <TealDot size={5} />
                <span
                  className="font-mono text-[9.5px] tracking-[0.25em] uppercase"
                  style={{ color: "#30C0C0", opacity: 0.8 }}
                >
                  Newsletter
                </span>
              </div>
              <p
                className="font-mono text-[12.5px] leading-snug"
                style={{
                  color: "#7AAABB",
                  letterSpacing: "0.02em",
                  marginTop: 6,
                }}
              >
                Deep dives on infra, security, and developer experience.
              </p>
            </div>

            <NewsletterForm />

            <p
              className="font-mono text-[8.5px] tracking-[0.1em]"
              style={{ color: "#1A3848", lineHeight: 1.5 }}
            >
              No spam. Unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            BOTTOM BAR
        ══════════════════════════════════════ */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center
                     justify-between gap-5 py-6"
        >
          {/* left: copyright + links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span
              className="font-mono text-[9.5px] tracking-[0.14em]"
              style={{ color: "#1A3848" }}
            >
              © {year} Axon Systems, Inc.
            </span>

            <div className={styles.bottomDivider} aria-hidden="true" />

            <nav
              className="flex items-center gap-4 flex-wrap"
              aria-label="Legal links"
            >
              {["Privacy", "Terms", "Cookies"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="font-mono text-[9.5px] tracking-[0.14em]
                             transition-colors duration-200"
                  style={{ color: "#1A3848" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#30C0C0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#1A3848")
                  }
                >
                  {l}
                </a>
              ))}
            </nav>
          </div>

          {/* center: status */}
          <SystemStatus />

          {/* right: UTC clock */}
          <LiveClock />
        </div>
      </div>

      {/* bottom scan border */}
      <div className={styles.bottomScan} aria-hidden="true" />
    </footer>
  );
}
