// components/navbar/navbar.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./navbar.module.css";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: string;
  items?: NavItem[];
}

const DEFAULT_ITEMS: NavItem[] = [
  { label: "Overview", href: "#" },
  { label: "Systems", href: "#" },
  { label: "Interface", href: "#" },
  { label: "Deploy", href: "#" },
];

/* ── tiny SVG orb for logo area ── */
const OrbIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="nOrb" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#60DFDF" />
        <stop offset="55%" stopColor="#30C0C0" />
        <stop offset="100%" stopColor="#0B3848" stopOpacity="0" />
      </radialGradient>
      <filter id="nOrbGlow">
        <feGaussianBlur stdDeviation="2.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* orbit ring */}
    <circle
      cx="14"
      cy="14"
      r="12"
      stroke="#183858"
      strokeWidth="0.6"
      strokeDasharray="2 5"
      fill="none"
      opacity="0.8"
    />
    {/* orb */}
    <circle cx="14" cy="14" r="7" fill="url(#nOrb)" filter="url(#nOrbGlow)" />
    {/* highlight */}
    <ellipse
      cx="11.5"
      cy="11.5"
      rx="2.5"
      ry="1.5"
      fill="white"
      opacity="0.12"
      transform="rotate(-20 14 14)"
    />
    {/* satellite */}
    <circle
      cx="14"
      cy="2"
      r="1.5"
      fill="#60DFDF"
      opacity="0.9"
      filter="url(#nOrbGlow)"
    />
  </svg>
);

/* ── animated satellite ring for logo ── */
const LogoOrbit = () => (
  <div className={styles.logoOrbitWrap} aria-hidden="true">
    <OrbIcon />
    <div className={styles.logoSatellite} />
  </div>
);

/* ── status ping dot ── */
const PingDot = () => (
  <span className="relative flex h-2 w-2" aria-hidden="true">
    <span
      className={`${styles.pingRing} absolute inline-flex h-full w-full rounded-full`}
    />
    <span
      className="relative inline-flex rounded-full h-2 w-2"
      style={{ background: "#30C0C0" }}
    />
  </span>
);

export default function Navbar({
  logo = "AXON",
  items = DEFAULT_ITEMS,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [time, setTime] = useState("00:00:00");
  const menuRef = useRef<HTMLDivElement>(null);

  /* live clock */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        [now.getHours(), now.getMinutes(), now.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":"),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close menu on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* ── top border scan line ── */}
      <div className={styles.topScan} aria-hidden="true" />

      <header
        className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
        role="banner"
      >
        {/* corner accent tl */}
        <span
          className={`${styles.corner} ${styles.cornerTL}`}
          aria-hidden="true"
        />
        {/* corner accent tr */}
        <span
          className={`${styles.corner} ${styles.cornerTR}`}
          aria-hidden="true"
        />

        <nav
          className="relative z-10 w-full max-w-[1440px] mx-auto
                     flex items-center justify-between
                     px-4 sm:px-8 lg:px-14 h-full"
          aria-label="Main navigation"
        >
          {/* ══ LEFT: Logo ══ */}
          <a
            href="/"
            className={`${styles.logo} flex items-center gap-2.5 select-none`}
            aria-label={`${logo} — home`}
          >
            <LogoOrbit />
            <span className={styles.logoText}>{logo}</span>
            <span className={styles.logoDivider} aria-hidden="true" />
            <span className={styles.logoSub}>SYS</span>
          </a>

          {/* ══ CENTER: Nav links (desktop) ══ */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {items.map((item, i) => (
              <li key={item.href + i}>
                <a
                  href={item.href}
                  className={`${styles.navLink} ${activeIndex === i ? styles.navLinkActive : ""}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  aria-current={activeIndex === i ? "page" : undefined}
                >
                  {/* index badge */}
                  <span className={styles.navIndex}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                  {/* underline bar */}
                  <span className={styles.navUnderline} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          {/* ══ RIGHT: Status + CTA + hamburger ══ */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* live clock (desktop only) */}
            <div
              className="hidden lg:flex items-center gap-2"
              aria-label="Current time"
            >
              <PingDot />
              <span className={styles.clockText}>{time}</span>
            </div>

            {/* thin separator */}
            <div
              className={`hidden lg:block ${styles.vDivider}`}
              aria-hidden="true"
            />

            {/* CTA button */}
            <a
              href="#"
              className={`hidden sm:flex ${styles.ctaBtn}`}
              aria-label="Launch interface"
            >
              <span className={styles.ctaBtnInner}>Launch</span>
              <span className={styles.ctaCornerTL} aria-hidden="true" />
              <span className={styles.ctaCornerBR} aria-hidden="true" />
            </a>

            {/* Hamburger (mobile) */}
            <button
              className={`md:hidden ${styles.burger}`}
              onClick={() => setOpen((p) => !p)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span
                className={`${styles.burgerBar} ${open ? styles.burgerBar1Open : ""}`}
              />
              <span
                className={`${styles.burgerBar} ${open ? styles.burgerBarMidOpen : ""}`}
              />
              <span
                className={`${styles.burgerBar} ${open ? styles.burgerBar3Open : ""}`}
              />
            </button>
          </div>
        </nav>

        {/* ── bottom border line with glow ── */}
        <div className={styles.bottomLine} aria-hidden="true" />
      </header>

      {/* ══ Mobile menu overlay ══ */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""} md:hidden`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* bg grid */}
        <div className={styles.mobileGrid} aria-hidden="true" />

        <ul className="flex flex-col gap-1 p-6 pt-8" role="list">
          {items.map((item, i) => (
            <li key={item.href + i}>
              <a
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                <span className={styles.mobileNavIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
                <span className={styles.mobileNavArrow} aria-hidden="true">
                  ›
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* mobile bottom status */}
        <div className={styles.mobileStatus}>
          <PingDot />
          <span className={styles.clockText}>{time}</span>
          <span className={styles.logoDivider} aria-hidden="true" />
          <span className={styles.logoSub} style={{ fontSize: "9px" }}>
            ONLINE
          </span>
        </div>

        {/* mobile CTA */}
        <div className="px-6 pb-6">
          <a
            href="#"
            className={`flex w-full ${styles.ctaBtn} ${styles.ctaBtnFull}`}
            tabIndex={open ? 0 : -1}
          >
            <span className={styles.ctaBtnInner}>Launch Interface</span>
            <span className={styles.ctaCornerTL} aria-hidden="true" />
            <span className={styles.ctaCornerBR} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* mobile backdrop */}
      {open && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
