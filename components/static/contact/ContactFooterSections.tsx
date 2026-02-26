// ─────────────────────────────────────────────────────────
// File: components/contact/ContactFooterSections.tsx
// ─────────────────────────────────────────────────────────
"use client";

import {
  useEffect,
  useRef,
  useCallback,
  type MouseEvent as ReactMouseEvent,
  JSX,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ═══════════════════════════════════════════════════════════
   GSAP PLUGIN REGISTRATION
   ───────────────────────────────────────────────────────────
   Guarded for SSR. Runs once at module level to prevent
   duplicate registration across hot reloads.
   ═══════════════════════════════════════════════════════════ */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
   ───────────────────────────────────────────────────────────
   Centralized constants — no magic numbers in JSX.
   Mirror the tokens from ContactSection.tsx so both files
   share the same visual language.
   ═══════════════════════════════════════════════════════════ */
const COLOR = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  bg: "#0B0F19",
} as const;

const MOTION = {
  ENTRANCE_DURATION: 0.6,
  ENTRANCE_Y: 30,
  ENTRANCE_SCALE: 0.98,
  ENTRANCE_STAGGER: 0.1,
  ENTRANCE_EASE: "power2.out",
  STREAK_DURATION: 12,
  PULSE_HALF: 3,
  TRIGGER_START: "top 88%",
} as const;

/* ═══════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════ */
interface ContactChannel {
  readonly id: string;
  readonly icon: JSX.Element;
  readonly label: string;
  readonly value: string;
  readonly href: string;
  /** Accessible description for screen readers */
  readonly ariaLabel: string;
}

interface SocialLink {
  readonly id: string;
  readonly name: string;
  readonly href: string;
  readonly icon: JSX.Element;
  readonly ariaLabel: string;
}

/* ═══════════════════════════════════════════════════════════
   SVG ICON COMPONENTS
   ───────────────────────────────────────────────────────────
   Minimal, hand-crafted SVG paths.
   24×24 viewport, stroke-based for consistency.
   Every icon uses currentColor for theme inheritance.
   ═══════════════════════════════════════════════════════════ */

/** Mail icon — envelope shape */
function IconMail() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="0" />
      <polyline points="22,4 12,13 2,4" />
    </svg>
  );
}

/** Phone icon — handset shape */
function IconPhone() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/** WhatsApp icon — simplified chat bubble */
function IconWhatsApp() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

/** Map pin icon — location marker */
function IconLocation() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** LinkedIn icon */
function IconLinkedIn() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

/** Instagram icon */
function IconInstagram() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="0" />
      <circle cx="12" cy="12" r="5" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/** X (Twitter) icon */
function IconX() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

/** YouTube icon — play triangle in rectangle */
function IconYouTube() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="0" />
      <polygon points="10,8 16,12 10,16" />
    </svg>
  );
}

/** Behance icon — simplified B mark */
function IconBehance() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5h6a3 3 0 010 6H3V5z" />
      <path d="M3 11h7a3.5 3.5 0 010 7H3v-7z" />
      <line x1="15" y1="5" x2="21" y2="5" />
      <path d="M15 10.5a4 4 0 108 0 4 4 0 00-8 0z" />
    </svg>
  );
}

/** Arrow-right icon — used in CTA buttons */
function IconArrowRight() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-150 group-hover:translate-x-0.5"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATIC DATA
   ───────────────────────────────────────────────────────────
   Defined outside the component to avoid re-creation.
   Replace placeholder values with real data before deploy.
   ═══════════════════════════════════════════════════════════ */
const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: "email",
    icon: <IconMail />,
    label: "Email",
    value: "contact@yourdomain.com",
    href: "mailto:contact@yourdomain.com",
    ariaLabel: "Send an email to contact@yourdomain.com",
  },
  
  {
    id: "whatsapp",
    icon: <IconWhatsApp />,
    label: "WhatsApp",
    value: "+44 XXX XXX XXXX",
    href: "https://wa.me/44XXXXXXXXXX",
    ariaLabel: "Message us on WhatsApp at +44 XXX XXX XXXX",
  },
 
] as const;

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    href: "https://linkedin.com/company/yourbrand",
    icon: <IconLinkedIn />,
    ariaLabel: "Follow us on LinkedIn",
  },
  {
    id: "instagram",
    name: "Instagram",
    href: "https://instagram.com/yourbrand",
    icon: <IconInstagram />,
    ariaLabel: "Follow us on Instagram",
  },
  {
    id: "x",
    name: "X / Twitter",
    href: "https://x.com/yourbrand",
    icon: <IconX />,
    ariaLabel: "Follow us on X (formerly Twitter)",
  },
  {
    id: "youtube",
    name: "YouTube",
    href: "https://youtube.com/@yourbrand",
    icon: <IconYouTube />,
    ariaLabel: "Subscribe to our YouTube channel",
  },
 
] as const;

/* ═══════════════════════════════════════════════════════════
   REUSABLE SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/**
 * Corner Brackets
 * ─────────────────────────────────────────────────────────
 * Structural glass markers at each corner of a panel.
 * Two perpendicular 1px lines, 14px each, forming an
 * open bracket shape that communicates precision.
 */
function CornerBrackets() {
  const bar = "absolute bg-white/[0.07]";
  const w = "w-3.5";
  const h = "h-3.5";

  return (
    <div aria-hidden="true" className="pointer-events-none">
      <span className={`${bar} top-0 left-0 h-px ${w}`} />
      <span className={`${bar} top-0 left-0 w-px ${h}`} />
      <span className={`${bar} top-0 right-0 h-px ${w}`} />
      <span className={`${bar} top-0 right-0 w-px ${h}`} />
      <span className={`${bar} bottom-0 left-0 h-px ${w}`} />
      <span className={`${bar} bottom-0 left-0 w-px ${h}`} />
      <span className={`${bar} bottom-0 right-0 h-px ${w}`} />
      <span className={`${bar} bottom-0 right-0 w-px ${h}`} />
    </div>
  );
}

/**
 * Panel Connector
 * ─────────────────────────────────────────────────────────
 * Thin vertical gradient line between panels.
 * Communicates visual continuity — the panels are part of
 * one system, not isolated cards.
 */
function PanelConnector() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex flex-col items-center"
    >
      <span className="block h-6 w-px bg-linear-to-b from-white/[0.08] to-transparent" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ContactFooterSections() {
  /* ─── Refs ───────────────────────────────────────────── */
  const wrapperRef = useRef<HTMLDivElement>(null);
  const streakDetailsRef = useRef<HTMLDivElement>(null);
  const streakSocialRef = useRef<HTMLDivElement>(null);
  const streakCtaRef = useRef<HTMLDivElement>(null);
  const ctaPulseRef = useRef<HTMLDivElement>(null);
  const ctaShimmer1Ref = useRef<HTMLDivElement>(null);
  const ctaShimmer2Ref = useRef<HTMLDivElement>(null);

  /* ─── Status dots for contact channels ───────────────── */
  const channelDotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* ─── GSAP Lifecycle ─────────────────────────────────── */
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const animElements =
        gsap.utils.toArray<HTMLElement>("[data-anim-footer]");

      if (prefersReduced) {
        gsap.set(animElements, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      /* ── Set initial hidden state ──────────────────── */
      gsap.set(animElements, {
        opacity: 0,
        y: MOTION.ENTRANCE_Y,
        scale: MOTION.ENTRANCE_SCALE,
      });

      /* ── Batched scroll-triggered entrance ─────────── */
      ScrollTrigger.batch(animElements, {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: MOTION.ENTRANCE_DURATION,
            ease: MOTION.ENTRANCE_EASE,
            stagger: MOTION.ENTRANCE_STAGGER,
            force3D: true,
          });
        },
        start: MOTION.TRIGGER_START,
        once: true,
      });

      /* ── Light streak sweeps (GPU-only: xPercent) ──── */
      const streaks = [
        { el: streakDetailsRef.current, delay: 0, extra: 0 },
        { el: streakSocialRef.current, delay: 3, extra: 2 },
        { el: streakCtaRef.current, delay: 6, extra: 1 },
      ];

      streaks.forEach(({ el, delay, extra }) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { xPercent: -120 },
          {
            xPercent: 420,
            duration: MOTION.STREAK_DURATION + extra,
            ease: "none",
            repeat: -1,
            force3D: true,
            delay,
          },
        );
      });

      /* ── Channel status dot pulse ──────────────────── */
      channelDotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        gsap.to(dot, {
          opacity: 0.3,
          duration: MOTION.PULSE_HALF,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.6,
        });
      });

      /* ── CTA section ambient pulse ─────────────────── */
      if (ctaPulseRef.current) {
        gsap.to(ctaPulseRef.current, {
          scale: 1.04,
          opacity: 0.04,
          duration: 6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          force3D: true,
        });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  /* ─── CTA button shimmer on hover ────────────────────── */
  const triggerShimmer = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>) => () => {
      if (!ref.current) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      gsap.fromTo(
        ref.current,
        { xPercent: -120 },
        {
          xPercent: 260,
          duration: 0.55,
          ease: "power2.out",
          force3D: true,
        },
      );
    },
    [],
  );

  /* ─── Contact channel hover — border glow ────────────── */
  const channelHover = useCallback((e: ReactMouseEvent<HTMLAnchorElement>) => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    gsap.to(e.currentTarget, {
      borderColor: "rgba(255,255,255,0.14)",
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const channelLeave = useCallback((e: ReactMouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      borderColor: "rgba(255,255,255,0.06)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  /* ─── Social link hover — subtle scale ───────────────── */
  const socialHover = useCallback((e: ReactMouseEvent<HTMLAnchorElement>) => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    gsap.to(e.currentTarget, {
      scale: 1.06,
      duration: 0.2,
      ease: "power2.out",
      force3D: true,
    });
  }, []);

  const socialLeave = useCallback((e: ReactMouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
      force3D: true,
    });
  }, []);

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div ref={wrapperRef} className="relative grid grid-cols-1 lg:grid-cols-2 justify-center ">
      {/* ═════════════════════════════════════════════════
          SECTION 4 — DIRECT CONTACT DETAILS
          ═════════════════════════════════════════════════ */}
      <section
        id="contact-details"
        aria-labelledby="contact-details-heading"
        className="relative overflow-hidden"
        style={{ backgroundColor: COLOR.bg }}
      >
        {/* ── Background grid (continues from above) ─── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            ].join(","),
            backgroundSize: "72px 72px",
          }}
        />

        {/* ── Ambient light — asymmetric cyan ────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-[-12%] h-[480px] w-[480px]"
          style={{
            background: `radial-gradient(circle, ${COLOR.secondary}0B 0%, transparent 60%)`,
          }}
        />

        <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4   ">
          {/* Panel */}
          <article
            data-anim-footer
            className="relative border border-white/[0.10] bg-white/[0.035] backdrop-blur-sm overflow-hidden will-change-transform"
          >
            {/* Top accent gradient */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 5%, ${COLOR.secondary} 40%, ${COLOR.primary} 70%, transparent 95%)`,
              }}
            />

            {/* Light streak */}
            <div
              ref={streakDetailsRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-1/4 will-change-transform"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLOR.secondary}08, transparent)`,
              }}
            />

            <CornerBrackets />

            <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-14">
              <h2
                id="contact-details-heading"
                data-anim-footer
                className="text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-white sm:text-2xl md:text-[1.75rem] mb-2"
              >
                Contact <span className="text-cyan-500">Details</span>
              </h2>

              <p
                data-anim-footer
                className="text-white/50 text-sm leading-relaxed mb-8 md:mb-10 max-w-[520px]"
              >
                You can also reach us directly using the contact information
                below:
              </p>

              {/* ── Contact channel grid ─────────────── */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CONTACT_CHANNELS.map((channel, index) => (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target={channel.id === "whatsapp" ? "_blank" : undefined}
                    rel={
                      channel.id === "whatsapp"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    aria-label={channel.ariaLabel}
                    data-anim-footer
                    onMouseEnter={channelHover}
                    onMouseLeave={channelLeave}
                    className={`
                      group relative flex items-start gap-4
                      border border-white/[0.06] bg-white/[0.02]
                      px-5 py-4 min-h-[72px]
                      transition-colors duration-150
                      will-change-transform
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/30
                      focus:ring-offset-2 focus:ring-offset-[#0B0F19]
                      ${
                        channel.id === "location"
                          ? "pointer-events-none cursor-default"
                          : "hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    {/* Icon container */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.08] bg-white/[0.03] text-white/50 group-hover:text-cyan-500/70 transition-colors duration-150">
                      {channel.icon}
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col justify-center min-h-[40px]">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30 mb-0.5 flex items-center gap-1.5">
                        {/* Status dot */}
                        <span
                          ref={(el) => {
                            channelDotRefs.current[index] = el;
                          }}
                          className="inline-block h-1 w-1 rounded-full bg-cyan-500 will-change-[opacity]"
                          style={{ opacity: 0.7 }}
                        />
                        {channel.label}
                      </span>
                      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-150">
                        {channel.value}
                      </span>
                      {/* Location sub-label */}
                      {channel.id === "location" && (
                        <span className="text-xs text-white/30 mt-0.5">
                          Serving clients worldwide
                        </span>
                      )}
                    </div>

                    {/* Hover arrow indicator (not for location) */}
                    {channel.id !== "location" && (
                      <div
                        aria-hidden="true"
                        className="ml-auto self-center text-white/0 group-hover:text-white/20 transition-colors duration-150"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </article>

          <PanelConnector />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          SECTION 6 — SOCIAL MEDIA LINKS
          ═════════════════════════════════════════════════ */}
      <section
        id="social"
        aria-labelledby="social-heading"
        className="relative overflow-hidden"
        style={{ backgroundColor: COLOR.bg }}
      >
        {/* ── Background grid ────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            ].join(","),
            backgroundSize: "72px 72px",
          }}
        />

        {/* ── Ambient light — violet accent ──────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-100 w-100"
          style={{
            background: `radial-gradient(circle, ${COLOR.accent}0D 0%, transparent 55%)`,
          }}
        />

        <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4  ">
          {/* Panel */}
          <article
            data-anim-footer
            className="relative border border-white/[0.10] bg-white/[0.035] backdrop-blur-sm overflow-hidden will-change-transform"
          >
            {/* Top accent gradient */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 5%, ${COLOR.accent} 35%, ${COLOR.secondary} 65%, transparent 95%)`,
              }}
            />

            {/* Light streak */}
            <div
              ref={streakSocialRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-1/4 will-change-transform"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLOR.accent}08, transparent)`,
              }}
            />

        

            <CornerBrackets />

            <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-14">
              <h2
                id="social-heading"
                data-anim-footer
                className="text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-white sm:text-2xl md:text-[1.75rem] mb-2"
              >
                Connect <span className="text-violet-500">With Us</span>
              </h2>

              <p
                data-anim-footer
                className="text-white/50 text-sm leading-relaxed mb-8 md:mb-10 max-w-[560px]"
              >
                Follow us for insights on web design, SEO strategies, AI
                automation trends.
              </p>

              {/* ── Social link row ──────────────────── */}
              <nav aria-label="Social media links" data-anim-footer>
                <ul className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.ariaLabel}
                        onMouseEnter={socialHover}
                        onMouseLeave={socialLeave}
                        className="
                          group flex items-center gap-2.5
                          border border-white/[0.06] bg-white/[0.02]
                          px-4 py-2.5 min-h-[44px]
                          text-white/50 hover:text-white/80
                          hover:border-white/[0.12] hover:bg-white/[0.04]
                          transition-colors duration-150
                          will-change-transform
                          focus:outline-none focus:ring-2 focus:ring-violet-500/30
                          focus:ring-offset-2 focus:ring-offset-[#0B0F19]
                        "
                      >
                        {link.icon}
                        <span className="text-sm font-medium tracking-[-0.01em]">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

            
            </div>
          </article>

          <PanelConnector />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          SECTION 8 — FINAL CTA (Conversion Booster)
          ═════════════════════════════════════════════════ */}
      <section
        id="cta"
        aria-labelledby="cta-heading"
        className="relative overflow-hidden lg:col-span-12"
        style={{ backgroundColor: COLOR.bg }}
      >
        {/* ── Background grid ────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            ].join(","),
            backgroundSize: "72px 72px",
          }}
        />

        {/* ── Ambient lights — convergence of all brand colors ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-30%] left-[20%] h-[520px] w-[520px]"
          style={{
            background: `radial-gradient(circle, ${COLOR.primary}0B 0%, transparent 55%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-20%] right-[15%] h-[420px] w-[420px]"
          style={{
            background: `radial-gradient(circle, ${COLOR.secondary}09 0%, transparent 55%)`,
          }}
        />

        {/* ── Breathing ambient glow behind CTA ──────── */}
        <div
          ref={ctaPulseRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[360px] w-150 will-change-transform"
          style={{
            background: `radial-gradient(ellipse, ${COLOR.primary}0A 0%, transparent 60%)`,
            opacity: 0.06,
          }}
        />

        <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 ">
          {/* Panel */}
          <article
            data-anim-footer
            className="relative border border-white/[0.10] bg-white/[0.035] backdrop-blur-sm overflow-hidden will-change-transform"
          >
            {/* ── Top accent — full brand spectrum ──── */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 2%, ${COLOR.accent} 20%, ${COLOR.primary} 50%, ${COLOR.secondary} 80%, transparent 98%)`,
              }}
            />

            {/* ── Bottom accent line (mirrored) ────── */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 inset-x-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 10%, ${COLOR.primary}40 50%, transparent 90%)`,
              }}
            />

            {/* Light streak */}
            <div
              ref={streakCtaRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-1/4 will-change-transform"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLOR.primary}0C, transparent)`,
              }}
            />

           
         

            <CornerBrackets />

            {/* ── CTA Content ────────────────────────── */}
            <div className="px-6 py-12 sm:px-10 sm:py-14 md:px-14 md:py-16 text-center">
              {/* Coordinate badge — atmospheric authority */}
              <div
                data-anim-footer
                aria-hidden="true"
                className="inline-flex items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-3.5 py-1.5 mb-6 font-mono text-[10px] tracking-[0.12em] uppercase text-white/25"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500/60" />
                Ready to Deploy
              </div>

              <h2
                id="cta-heading"
                data-anim-footer
                className="text-2xl font-semibold tracking-[-0.02em] leading-[1.2] text-white sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] mb-5 max-w-[640px] mx-auto"
              >
                Ready to Start Your{" "}
                <span className="text-amber-500">Project</span>?
              </h2>

              <p
                data-anim-footer
                className="text-white/50 text-sm leading-[1.75] mb-10 md:mb-12 max-w-[580px] mx-auto sm:text-[0.95rem]"
              >
                Let&apos;s discuss your goals and build a website that ranks on{" "}
                <span className="text-cyan-500/80">Google</span>, converts
                visitors into{" "}
                <span className="text-amber-500/80">customers</span>, and uses{" "}
                <span className="text-violet-400/80">AI tools</span> to automate
                your business.
              </p>

              {/* ── CTA Buttons ──────────────────────── */}
              <div
                data-anim-footer
                className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4"
              >
                {/* Primary CTA — Book Consultation */}
                <a
                  href="/book"
                  aria-label="Book a free consultation"
                  onMouseEnter={triggerShimmer(ctaShimmer1Ref)}
                  className="
                    group relative overflow-hidden inline-flex items-center justify-center gap-2.5
                    min-h-[48px] px-8
                    border border-amber-500/40 bg-amber-500/[0.10]
                    font-mono text-sm tracking-[0.06em] uppercase text-amber-500
                    hover:border-amber-500/60 hover:bg-amber-500/[0.15]
                    transition-colors duration-150
                    will-change-transform
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    focus:ring-offset-2 focus:ring-offset-[#0B0F19]
                  "
                >
                  {/* Shimmer sweep */}
                  <div
                    ref={ctaShimmer1Ref}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-1/3 will-change-transform"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(245,158,11,0.14), transparent)",
                      transform: "translateX(-120%)",
                    }}
                  />
                  <span className="relative z-10">
                    Book a Free Consultation
                  </span>
                  <IconArrowRight />
                </a>

                {/* Secondary CTA — Request Quote */}
                <a
                  href="/quote"
                  aria-label="Request a project quote"
                  onMouseEnter={triggerShimmer(ctaShimmer2Ref)}
                  className="
                    group relative overflow-hidden inline-flex items-center justify-center gap-2.5
                    min-h-[48px] px-8
                    border border-white/[0.10] bg-white/[0.03]
                    font-mono text-sm tracking-[0.06em] uppercase text-white/60
                    hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white/80
                    transition-colors duration-150
                    will-change-transform
                    focus:outline-none focus:ring-2 focus:ring-white/20
                    focus:ring-offset-2 focus:ring-offset-[#0B0F19]
                  "
                >
                  {/* Shimmer sweep */}
                  <div
                    ref={ctaShimmer2Ref}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-1/3 will-change-transform"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                      transform: "translateX(-120%)",
                    }}
                  />
                  <span className="relative z-10">Request a Quote</span>
                  <IconArrowRight />
                </a>
              </div>

              {/* ── Structural accent — horizontal line ── */}
              <div
                aria-hidden="true"
                className="mt-10 mx-auto h-px max-w-[200px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${COLOR.primary}30, transparent)`,
                }}
              />
            </div>
          </article>

          {/* ── Final structural terminus line ──────── */}
          <div
            aria-hidden="true"
            className="pointer-events-none mx-auto mt-4 w-px h-12 bg-linear-to-b from-white/[0.06] to-transparent"
          />

           
        </div>
      </section>

    
    </div>
  );
}
