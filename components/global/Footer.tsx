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
   CONTENT DATA
════════════════════════════════════════ */
const COLUMNS: FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Web Design", href: "#web-design" },
      { label: "SEO", href: "#seo" },
      { label: "AI Integration", href: "#ai", badge: "NEW" },
      { label: "Website Maintenance", href: "#maintenance" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms & Conditions", href: "#terms" },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
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
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <p
        className="font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: "#2E5868" }}
      >
        Stay Updated
      </p>

      <div className={`${styles.inputWrap} relative`}>
        <Bracket pos="tl" />
        <Bracket pos="br" />

        <input
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="you@company.io"
          className={`${styles.input} w-full`}
          aria-label="Email address"
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

      <div aria-live="polite" className="min-h-3.5">
        {state === "error" && (
          <p
            className="font-mono text-[9.5px] tracking-[0.12em]"
            style={{ color: "#C05050" }}
          >
            ▸ enter a valid email
          </p>
        )}
        {state === "success" && (
          <p
            className="font-mono text-[9.5px] tracking-[0.12em]"
            style={{ color: "#30C0C0" }}
          >
            ▸ subscribed successfully
          </p>
        )}
      </div>
    </form>
  );
};

/* ════════════════════════════════════════
   LOGO MARK
════════════════════════════════════════ */
const LogoMark = () => (
  <div className="flex items-center gap-3">
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
        YOUR BRAND
      </span>
      <span
        className="font-mono text-[8px] tracking-[0.25em] uppercase"
        style={{ color: "#30C0C0", opacity: 0.6, marginTop: 2 }}
      >
        INNOVATION · 2026
      </span>
    </div>
  </div>
);

/* ════════════════════════════════════════
   DECORATIVE GRID LINES
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
        className="w-1 h-1 rounded-full shrink-0"
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
   LIVE CLOCK (UTC)
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pt-16 sm:pt-20">
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
              Transforming digital experiences through innovative design,
              cutting-edge AI, and strategic solutions.
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
            className="grid grid-cols-2 sm:grid-cols-3 gap-8"
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
                Get insights on design, tech trends & AI innovations.
              </p>
            </div>

            <NewsletterForm />

            <p
              className="font-mono text-[8.5px] tracking-widest"
              style={{ color: "#1A3848", lineHeight: 1.5 }}
            >
              No spam. Unsubscribe anytime. Privacy first.
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
          {/* left: copyright */}
          <span
            className="font-mono text-[9.5px] tracking-[0.14em]"
            style={{ color: "#1A3848" }}
          >
            © {year} Your Brand Name. All rights reserved.
          </span>

          {/* center: legal links */}
          <nav
            className="flex items-center gap-4 flex-wrap"
            aria-label="Legal links"
          >
            {["Privacy Policy", "Terms & Conditions"].map((l) => (
              <a
                key={l}
                href={l === "Privacy Policy" ? "#privacy" : "#terms"}
                className="font-mono text-[9.5px] tracking-[0.14em]
                         transition-colors duration-200"
                style={{ color: "#1A3848" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#30C0C0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1A3848")}
              >
                {l}
              </a>
            ))}
          </nav>

          {/* right: UTC clock */}
          <LiveClock />
        </div>
      </div>

      {/* bottom scan border */}
      <div className={styles.bottomScan} aria-hidden="true" />
    </footer>
  );
}
