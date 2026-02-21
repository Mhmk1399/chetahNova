"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

interface NavbarProps {
  logo?: string;
  items?: NavItem[];
}

interface HoverPillStyle {
  left: number;
  width: number;
  opacity: number;
}

const DEFAULT_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

/* ════════════════════════════════════════
   ANIMATED ORB LOGO
════════════════════════════════════════ */
const AnimatedOrb = () => (
  <div className={styles.orbContainer}>
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={styles.orbSvg}
    >
      <defs>
        <radialGradient id="navOrb" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#80F0F0" />
          <stop offset="40%" stopColor="#40D0D0" />
          <stop offset="80%" stopColor="#20A0A0" />
          <stop offset="100%" stopColor="#0B3848" stopOpacity="0" />
        </radialGradient>
        <filter id="navOrbGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#60E0E0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#30C0C0" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle
        cx="18"
        cy="18"
        r="16"
        stroke="url(#ringGrad)"
        strokeWidth="0.5"
        fill="none"
        className={styles.orbRingOuter}
      />

      {/* Middle dashed ring */}
      <circle
        cx="18"
        cy="18"
        r="13"
        stroke="#30C0C0"
        strokeWidth="0.4"
        strokeDasharray="2 4"
        fill="none"
        opacity="0.4"
        className={styles.orbRingMiddle}
      />

      {/* Core orb */}
      <circle
        cx="18"
        cy="18"
        r="8"
        fill="url(#navOrb)"
        filter="url(#navOrbGlow)"
      />

      {/* Inner glow ring */}
      <circle
        cx="18"
        cy="18"
        r="8"
        fill="none"
        stroke="#60E0E0"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Highlight */}
      <ellipse
        cx="15"
        cy="15"
        rx="3"
        ry="2"
        fill="white"
        opacity="0.15"
        transform="rotate(-25 18 18)"
      />

      {/* Orbiting satellite */}
      <g className={styles.satellite}>
        <circle cx="18" cy="2" r="2" fill="#60EFEF" filter="url(#navOrbGlow)" />
      </g>

      {/* Second satellite (opposite) */}
      <g className={styles.satelliteReverse}>
        <circle cx="18" cy="34" r="1.5" fill="#40C0C0" opacity="0.7" />
      </g>
    </svg>

    {/* Pulse ring effect */}
    <div className={styles.orbPulse} />
  </div>
);

/* ════════════════════════════════════════
   STATUS INDICATOR
════════════════════════════════════════ */
const StatusIndicator = ({
  status = "online",
}: {
  status?: "online" | "busy" | "offline";
}) => {
  const colors = {
    online: "#30C0C0",
    busy: "#F0A030",
    offline: "#C05050",
  };

  return (
    <span className={styles.statusDot}>
      <span
        className={styles.statusPing}
        style={{ backgroundColor: `${colors[status]}40` }}
      />
      <span
        className={styles.statusCore}
        style={{ backgroundColor: colors[status] }}
      />
    </span>
  );
};

/* ════════════════════════════════════════
   LIVE CLOCK
════════════════════════════════════════ */
const LiveClock = () => {
  const [time, setTime] = useState("00:00:00");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        [now.getHours(), now.getMinutes(), now.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":"),
      );
      setDate(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.clockWrapper}>
      <StatusIndicator status="online" />
      <div className={styles.clockContent}>
        <span className={styles.clockTime}>{time}</span>
        <span className={styles.clockDate}>{date}</span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN NAVBAR COMPONENT
════════════════════════════════════════ */
export default function Navbar({
  logo = "YOUR BRAND",
  items = DEFAULT_ITEMS,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // ⭐ Hover pill state - موقعیت و عرض دقیق
  const [hoverPillStyle, setHoverPillStyle] = useState<HoverPillStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navLinksContainerRef = useRef<HTMLDivElement>(null);

  // ⭐ Refs برای هر لینک
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const pathname = usePathname();

  // Scroll detection
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        navRef.current &&
        !navRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Set active index based on current path
  useEffect(() => {
    const index = items.findIndex((item) => item.href === pathname);
    setActiveIndex(index >= 0 ? index : null);
  }, [pathname, items]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // ⭐ هندلر برای هاور روی لینک‌ها
  const handleLinkHover = useCallback((index: number) => {
    const linkEl = linkRefs.current[index];
    const containerEl = navLinksContainerRef.current;

    if (linkEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();

      setHoverPillStyle({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    }
  }, []);

  // ⭐ هندلر برای خروج موس از لینک‌ها
  const handleLinkLeave = useCallback(() => {
    setHoverPillStyle((prev) => ({
      ...prev,
      opacity: 0,
    }));
  }, []);

  // Hide on admin dashboard
  if (pathname === "/adminDashboard") {
    return null;
  }

  return (
    <>
      {/* ── Animated top border ── */}
      <div className={styles.topBorder} aria-hidden="true">
        <div className={styles.topBorderGlow} />
      </div>

      {/* ── Main Header ── */}
      <header
        ref={navRef}
        className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""} ${isOpen ? styles.navbarMenuOpen : ""}`}
        role="banner"
      >
        {/* Glass layers */}
        <div className={styles.glassLayer} aria-hidden="true" />
        <div className={styles.glassShine} aria-hidden="true" />
        <div className={styles.glassNoise} aria-hidden="true" />

        {/* Corner brackets */}
        <span
          className={`${styles.bracket} ${styles.bracketTL}`}
          aria-hidden="true"
        />
        <span
          className={`${styles.bracket} ${styles.bracketTR}`}
          aria-hidden="true"
        />
        <span
          className={`${styles.bracket} ${styles.bracketBL}`}
          aria-hidden="true"
        />
        <span
          className={`${styles.bracket} ${styles.bracketBR}`}
          aria-hidden="true"
        />

        <nav className={styles.navInner} aria-label="Main navigation">
          {/* ══ LEFT: Logo ══ */}
          <Link
            href="/"
            className={styles.logoLink}
            aria-label={`${logo} — home`}
          >
            <AnimatedOrb />
            <div className={styles.logoText}>
              <span className={styles.logoMain}>{logo}</span>
              <span className={styles.logoSub}>DIGITAL AGENCY</span>
            </div>
          </Link>

          {/* ══ CENTER: Nav Links (Desktop) ══ */}
          <div
            ref={navLinksContainerRef}
            className={styles.navLinksWrapper}
            onMouseLeave={handleLinkLeave}
          >
            {/* ⭐ Hover Pill - با موقعیت دقیق */}
            <div
              className={styles.hoverPill}
              style={{
                left: `${hoverPillStyle.left}px`,
                width: `${hoverPillStyle.width}px`,
                opacity: hoverPillStyle.opacity,
              }}
              aria-hidden="true"
            />

            <ul className={styles.navLinks} role="list">
              {items.map((item, i) => (
                <li key={item.href + i}>
                  <Link
                    href={item.href}
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    className={`${styles.navLink} ${activeIndex === i ? styles.navLinkActive : ""}`}
                    onMouseEnter={() => handleLinkHover(i)}
                    aria-current={activeIndex === i ? "page" : undefined}
                  >
                    <span className={styles.navLinkIndex}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.navLinkLabel}>{item.label}</span>
                    {item.badge && (
                      <span className={styles.navLinkBadge}>{item.badge}</span>
                    )}
                    <span
                      className={styles.navLinkUnderline}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ══ RIGHT: Actions ══ */}
          <div className={styles.navActions}>
            {/* Clock (desktop) */}
            <div className={styles.clockContainer}>
              <LiveClock />
            </div>

            {/* Divider */}
            <div className={styles.divider} aria-hidden="true" />

            {/* CTA Button */}
            <Link href="/login" className={styles.ctaButton}>
              <span className={styles.ctaButtonBg} aria-hidden="true" />
              <span className={styles.ctaButtonContent}>
                <span className={styles.ctaButtonText}>Login</span>
                <svg
                  className={styles.ctaButtonIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.ctaCornerTL} aria-hidden="true" />
              <span className={styles.ctaCornerBR} aria-hidden="true" />
            </Link>

            {/* Hamburger (mobile) */}
            <button
              className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`}
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <span className={styles.hamburgerBox}>
                <span className={styles.hamburgerLine} />
                <span className={styles.hamburgerLine} />
                <span className={styles.hamburgerLine} />
              </span>
            </button>
          </div>
        </nav>

        {/* Bottom border glow */}
        <div className={styles.bottomBorder} aria-hidden="true" />
      </header>

      {/* ══ Mobile Menu Panel ══ */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Background effects */}
        <div className={styles.mobileMenuBg} aria-hidden="true" />
        <div className={styles.mobileMenuGrid} aria-hidden="true" />
        <div className={styles.mobileMenuGlow} aria-hidden="true" />

        {/* Menu content */}
        <div className={styles.mobileMenuContent}>
          {/* Header */}
          <div className={styles.mobileMenuHeader}>
            <span className={styles.mobileMenuTitle}>Navigation</span>
            <span className={styles.mobileMenuSubtitle}>
              {items.length} SECTIONS
            </span>
          </div>

          {/* Links */}
          <ul className={styles.mobileNavLinks} role="list">
            {items.map((item, i) => (
              <li
                key={item.href + i}
                style={{ animationDelay: `${i * 0.05}s` }}
                className={styles.mobileNavItem}
              >
                <Link
                  href={item.href}
                  className={`${styles.mobileNavLink} ${activeIndex === i ? styles.mobileNavLinkActive : ""}`}
                  onClick={() => setIsOpen(false)}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span className={styles.mobileNavIndex}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.mobileNavLabel}>{item.label}</span>
                  {item.badge && (
                    <span className={styles.mobileNavBadge}>{item.badge}</span>
                  )}
                  <span className={styles.mobileNavArrow}>
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M6 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className={styles.mobileNavGlow} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Bottom section */}
          <div className={styles.mobileMenuFooter}>
            {/* Status */}
            <div className={styles.mobileStatus}>
              <StatusIndicator status="online" />
              <span className={styles.mobileStatusText}>System Online</span>
              <LiveClock />
            </div>

            {/* CTA */}
            <Link
              href="/login"
              className={styles.mobileCta}
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
            >
              <span className={styles.mobileCtaBg} aria-hidden="true" />
              <span className={styles.mobileCtaContent}>
                <span>Login to Dashboard</span>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>

            {/* Social links */}
            <div className={styles.mobileSocials}>
              {["LinkedIn", "Instagram", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className={styles.mobileSocialLink}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ Backdrop ══ */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
