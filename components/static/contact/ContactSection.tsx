// ─────────────────────────────────────────────────────────
// File: components/contact/ContactSection.tsx
// ─────────────────────────────────────────────────────────
"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type FormEvent,
  type ChangeEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ═══════════════════════════════════════════════════════════
   GSAP PLUGIN REGISTRATION
   ───────────────────────────────────────────────────────────
   Registered outside component to avoid duplicate calls.
   Guard for SSR since GSAP accesses window internally.
   ═══════════════════════════════════════════════════════════ */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
   ───────────────────────────────────────────────────────────
   Every magic number lives here. If a value appears twice
   in the codebase, it becomes a token.
   ═══════════════════════════════════════════════════════════ */
const COLOR = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  bg: "#0B0F19",
} as const;

const MOTION = {
  /** Entrance animation duration in seconds */
  ENTRANCE_DURATION: 0.6,
  /** Y offset before entrance reveal (px) */
  ENTRANCE_Y: 30,
  /** Scale before entrance reveal */
  ENTRANCE_SCALE: 0.98,
  /** Stagger delay between sibling elements (s) */
  ENTRANCE_STAGGER: 0.1,
  /** Easing curve for all entrances */
  ENTRANCE_EASE: "power2.out",
  /** Full cycle duration for light streak sweep (s) */
  STREAK_DURATION: 12,
  /** Duration of one half-pulse for status dot (s) */
  PULSE_HALF: 3,
  /** Background grid cell size (px) */
  GRID_CELL: 72,
  /** ScrollTrigger start position */
  TRIGGER_START: "top 88%",
} as const;

/* ═══════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════ */
interface ContactFormData {
  fullName: string;
  email: string;
  companyName: string;
  websiteUrl: string;
  serviceNeeded: string;
  estimatedBudget: string;
  preferredContact: string;
  message: string;
}

type FormField = keyof ContactFormData;
type SubmitState = "idle" | "submitting" | "success" | "error";

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

/* ═══════════════════════════════════════════════════════════
   STATIC DATA
   ───────────────────────────────────────────────────────────
   Defined outside the component so React never
   re-creates these arrays on re-render.
   ═══════════════════════════════════════════════════════════ */
const SERVICE_OPTIONS: readonly SelectOption[] = [
  { value: "", label: "Select a service" },
  { value: "web-design", label: "Web Design" },
  { value: "seo", label: "SEO Services" },
  { value: "ai-automation", label: "AI Automation Tools" },
  { value: "full-package", label: "Full Package (Web + SEO + AI)" },
  { value: "maintenance", label: "Maintenance & Support" },
] as const;

const BUDGET_OPTIONS: readonly SelectOption[] = [
  { value: "", label: "Select budget range" },
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-3k", label: "$1,000 – $3,000" },
  { value: "3k-7k", label: "$3,000 – $7,000" },
  { value: "7k-plus", label: "$7,000+" },
] as const;

const CONTACT_OPTIONS: readonly SelectOption[] = [
  { value: "", label: "Select contact method" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone Call" },
  { value: "zoom", label: "Zoom Meeting" },
] as const;

const EMPTY_FORM: ContactFormData = {
  fullName: "",
  email: "",
  companyName: "",
  websiteUrl: "",
  serviceNeeded: "",
  estimatedBudget: "",
  preferredContact: "",
  message: "",
} as const;

/* ═══════════════════════════════════════════════════════════
   UTILITY: CHEVRON SVG
   ───────────────────────────────────────────────────────────
   Extracted to reduce JSX duplication in select wrappers.
   Pure SVG, no state — defined once, reused everywhere.
   ═══════════════════════════════════════════════════════════ */
function SelectChevron() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   UTILITY: CORNER BRACKETS
   ───────────────────────────────────────────────────────────
   Structural glass markers at panel corners.
   Two perpendicular 1px lines, 14px each.
   ═══════════════════════════════════════════════════════════ */
function CornerBrackets() {
  const line = "absolute bg-white/[0.07]";
  const len = "w-3.5"; // 14px
  const tall = "h-3.5";

  return (
    <div aria-hidden="true" className="pointer-events-none">
      {/* Top-left */}
      <span className={`${line} top-0 left-0 h-px ${len}`} />
      <span className={`${line} top-0 left-0 w-px ${tall}`} />
      {/* Top-right */}
      <span className={`${line} top-0 right-0 h-px ${len}`} />
      <span className={`${line} top-0 right-0 w-px ${tall}`} />
      {/* Bottom-left */}
      <span className={`${line} bottom-0 left-0 h-px ${len}`} />
      <span className={`${line} bottom-0 left-0 w-px ${tall}`} />
      {/* Bottom-right */}
      <span className={`${line} bottom-0 right-0 h-px ${len}`} />
      <span className={`${line} bottom-0 right-0 w-px ${tall}`} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ContactSection() {
  /* ─── Refs ───────────────────────────────────────────── */
  const sectionRef = useRef<HTMLElement>(null);
  const streakIntroRef = useRef<HTMLDivElement>(null);
  const streakFormRef = useRef<HTMLDivElement>(null);
  const statusDotRef = useRef<HTMLSpanElement>(null);
  const btnShimmerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  /* ─── State ──────────────────────────────────────────── */
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [status, setStatus] = useState<SubmitState>("idle");

  /* ─── Form Handlers ──────────────────────────────────── */
  const update = useCallback(
    (field: FormField) =>
      (
        e: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("submitting");
      try {
        /*
         * Replace with your API call:
         *   await fetch('/api/contact', {
         *     method: 'POST',
         *     body: JSON.stringify(form),
         *   });
         */
        await new Promise<void>((r) => setTimeout(r, 1400));
        setStatus("success");
        setForm(EMPTY_FORM);
      } catch {
        setStatus("error");
      }
    },
    [form],
  );

  const reset = useCallback(() => setStatus("idle"), []);

  /* ─── GSAP Lifecycle ─────────────────────────────────── */
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>("[data-anim]");

      if (reduced) {
        /* Respect accessibility — show everything, no motion */
        gsap.set(els, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      /* ── Initial hidden state ──────────────────────── */
      gsap.set(els, {
        opacity: 0,
        y: MOTION.ENTRANCE_Y,
        scale: MOTION.ENTRANCE_SCALE,
      });

      /* ── Batched scroll-triggered entrance ─────────── */
      ScrollTrigger.batch(els, {
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
      const streaks = [streakIntroRef.current, streakFormRef.current];
      streaks.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { xPercent: -120 },
          {
            xPercent: 420,
            duration: MOTION.STREAK_DURATION + i * 3,
            ease: "none",
            repeat: -1,
            force3D: true,
            delay: i * 4,
          },
        );
      });

      /* ── Status dot pulse ──────────────────────────── */
      if (statusDotRef.current) {
        gsap.to(statusDotRef.current, {
          opacity: 0.35,
          duration: MOTION.PULSE_HALF,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Animate success state on mount ──────────────────── */
  useEffect(() => {
    if (status === "success" && successRef.current) {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 16, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          force3D: true,
        },
      );
    }
  }, [status]);

  /* ─── Button shimmer on hover ────────────────────────── */
  const shimmer = useCallback(() => {
    if (!btnShimmerRef.current) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    gsap.fromTo(
      btnShimmerRef.current,
      { xPercent: -120 },
      {
        xPercent: 260,
        duration: 0.55,
        ease: "power2.out",
        force3D: true,
      },
    );
  }, []);

  /* ─── Shared Tailwind class strings ──────────────────── */
  const inputBase = [
    "w-full bg-white/[0.03] border border-white/[0.08]",
    "px-4 py-3 text-sm text-white/80",
    "placeholder:text-white/25",
    "focus:outline-none focus:border-white/20",
    "focus:ring-1 focus:ring-amber-500/20",
    "transition-colors duration-150",
    "min-h-[44px]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" ");

  const labelBase =
    "block text-xs font-mono tracking-[0.1em] uppercase text-white/50 mb-2";

  const submitting = status === "submitting";

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: COLOR.bg }}
    >
      {/* ───────────────────────────────────────────────────
          BACKGROUND LAYER 1 — Precision Grid
          ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)`,
            `linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          ].join(","),
          backgroundSize: `${MOTION.GRID_CELL}px ${MOTION.GRID_CELL}px`,
        }}
      />

      {/* ───────────────────────────────────────────────────
          BACKGROUND LAYER 2 — Ambient light sources
          Positioned asymmetrically for visual tension.
          ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-[-10%] h-[640px] w-[640px]"
        style={{
          background: `radial-gradient(circle, ${COLOR.primary}0D 0%, transparent 65%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-15%] left-[-8%] h-[520px] w-[520px]"
        style={{
          background: `radial-gradient(circle, ${COLOR.accent}0F 0%, transparent 60%)`,
        }}
      />

      {/* ───────────────────────────────────────────────────
          SYSTEM MARKERS — atmospheric monospace labels
          ─────────────────────────────────────────────────── */}
      <SystemMarkers statusDotRef={statusDotRef} />

      {/* ───────────────────────────────────────────────────
          CONTENT CONTAINER
          ─────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[960px] px-4 py-16 sm:px-6 md:py-28 lg:py-36">
        {/* ═══════════════════════════════════════════════════
           INTRO PANEL — Trust Builder
           ═══════════════════════════════════════════════════ */}
        <article
          data-anim
          className="relative mb-6 border border-white/[0.10] bg-white/[0.035] backdrop-blur-sm overflow-hidden will-change-transform"
        >
          {/* Top accent gradient */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 5%, ${COLOR.primary} 35%, ${COLOR.secondary} 65%, transparent 95%)`,
            }}
          />

          {/* Light streak */}
          <div
            ref={streakIntroRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/4 will-change-transform"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLOR.primary}0A, transparent)`,
            }}
          />

          {/* Panel system label */}
          <span
            aria-hidden="true"
            className="absolute top-3 right-4 font-mono text-[9px] tracking-[0.14em] text-white/[0.12] select-none"
          >
            SYS::INTRO_TRUST
          </span>

          <CornerBrackets />

          {/* Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-14">
            <h2
              id="contact-heading"
              data-anim
              className="text-2xl font-semibold tracking-[-0.02em] leading-[1.2] text-white sm:text-3xl md:text-[2.25rem] mb-5"
            >
              Tell Us About Your{" "}
              <span className="text-amber-500">Business</span> and{" "}
              <span className="text-cyan-500">Goals</span>
            </h2>

            <p
              data-anim
              className="text-white/60 text-sm leading-[1.75] max-w-[640px] mb-3 sm:text-[0.95rem]"
            >
              The more details you provide, the faster we can understand your
              needs and send you the best solution.
            </p>

            <p
              data-anim
              className="text-white/50 text-sm leading-[1.75] max-w-[640px] sm:text-[0.95rem]"
            >
              Whether you&apos;re looking for a full website redesign, a
              complete SEO system, or AI&#8209;powered automation tools,
              we&apos;ll prepare a roadmap tailored to your business.
            </p>
          </div>
        </article>

        {/* ── Structural connector between panels ──────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none flex flex-col items-center"
        >
          <span className="block h-6 w-px bg-linear-to-b from-white/[0.08] to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════
           FORM PANEL — Lead Capture
           ═══════════════════════════════════════════════════ */}
        <article
          data-anim
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
            ref={streakFormRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/4 will-change-transform"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLOR.secondary}08, transparent)`,
            }}
          />

          {/* Panel system label */}
          <span
            aria-hidden="true"
            className="absolute top-3 right-4 font-mono text-[9px] tracking-[0.14em] text-white/[0.12] select-none"
          >
            SYS::FORM_INPUT
          </span>

          <CornerBrackets />

          <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-14">
            <h2
              data-anim
              className="text-xl font-semibold tracking-[-0.02em] leading-[1.2] text-white sm:text-2xl md:text-[1.75rem] mb-1.5"
            >
              Send Us a <span className="text-amber-500">Message</span>
            </h2>

            <p
              data-anim
              className="text-white/40 text-sm leading-relaxed mb-9 md:mb-11"
            >
              Fill out the form below and our team will contact you shortly.
            </p>

            {/* ─── Success State ───────────────────────── */}
            {status === "success" ? (
              <div
                ref={successRef}
                className="flex flex-col items-center justify-center py-14 text-center will-change-transform"
                role="status"
                aria-live="polite"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center border border-amber-500/30 text-amber-500">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-white text-lg font-medium tracking-[-0.01em] mb-1.5">
                  Message Transmitted
                </p>
                <p className="text-white/45 text-sm mb-7">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="
                    font-mono text-xs tracking-[0.08em] uppercase
                    text-amber-500 hover:text-amber-400
                    transition-colors duration-150
                    min-h-[44px] px-5
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    focus:ring-offset-2 focus:ring-offset-[#0B0F19]
                  "
                  aria-label="Send another message"
                >
                  SEND ANOTHER →
                </button>
              </div>
            ) : (
              /* ─── Form ─────────────────────────────────── */
              <form onSubmit={submit} noValidate autoComplete="on">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  {/* ── Full Name ──────────────────────── */}
                  <div data-anim>
                    <label htmlFor="c-name" className={labelBase}>
                      Full Name <span className="text-amber-500/70">*</span>
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.fullName}
                      onChange={update("fullName")}
                      placeholder="Jane Doe"
                      className={inputBase}
                      disabled={submitting}
                    />
                  </div>

                  {/* ── Email ──────────────────────────── */}
                  <div data-anim>
                    <label htmlFor="c-email" className={labelBase}>
                      Email Address <span className="text-amber-500/70">*</span>
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="jane@company.com"
                      className={inputBase}
                      disabled={submitting}
                    />
                  </div>

                  {/* ── Company Name ───────────────────── */}
                  <div data-anim>
                    <label htmlFor="c-company" className={labelBase}>
                      Company Name
                    </label>
                    <input
                      id="c-company"
                      type="text"
                      autoComplete="organization"
                      value={form.companyName}
                      onChange={update("companyName")}
                      placeholder="Acme Inc."
                      className={inputBase}
                      disabled={submitting}
                    />
                  </div>

                  {/* ── Website URL ────────────────────── */}
                  <div data-anim>
                    <label htmlFor="c-url" className={labelBase}>
                      Website URL{" "}
                      <span className="normal-case tracking-normal text-white/20">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="c-url"
                      type="url"
                      autoComplete="url"
                      value={form.websiteUrl}
                      onChange={update("websiteUrl")}
                      placeholder="https://example.com"
                      className={inputBase}
                      disabled={submitting}
                    />
                  </div>

                  {/* ── Service Needed ─────────────────── */}
                  <div data-anim>
                    <label htmlFor="c-service" className={labelBase}>
                      Service Needed
                    </label>
                    <div className="relative">
                      <select
                        id="c-service"
                        value={form.serviceNeeded}
                        onChange={update("serviceNeeded")}
                        className={`${inputBase} appearance-none cursor-pointer pr-10`}
                        disabled={submitting}
                      >
                        {SERVICE_OPTIONS.map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            className="bg-[#0d1120] text-white"
                          >
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>

                  {/* ── Estimated Budget ───────────────── */}
                  <div data-anim>
                    <label htmlFor="c-budget" className={labelBase}>
                      Estimated Budget
                    </label>
                    <div className="relative">
                      <select
                        id="c-budget"
                        value={form.estimatedBudget}
                        onChange={update("estimatedBudget")}
                        className={`${inputBase} appearance-none cursor-pointer pr-10`}
                        disabled={submitting}
                      >
                        {BUDGET_OPTIONS.map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            className="bg-[#0d1120] text-white"
                          >
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>

                  {/* ── Preferred Contact ──────────────── */}
                  <div data-anim className="md:col-span-1">
                    <label htmlFor="c-contact" className={labelBase}>
                      Preferred Contact
                    </label>
                    <div className="relative">
                      <select
                        id="c-contact"
                        value={form.preferredContact}
                        onChange={update("preferredContact")}
                        className={`${inputBase} appearance-none cursor-pointer pr-10`}
                        disabled={submitting}
                      >
                        {CONTACT_OPTIONS.map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            className="bg-[#0d1120] text-white"
                          >
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>

                  {/* ── Message ────────────────────────── */}
                  <div data-anim className="md:col-span-2">
                    <label htmlFor="c-message" className={labelBase}>
                      Message <span className="text-amber-500/70">*</span>
                    </label>
                    <textarea
                      id="c-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Tell us about your project, goals, and timeline…"
                      className={`${inputBase} resize-none`}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* ── Divider ──────────────────────────── */}
                <div
                  aria-hidden="true"
                  className="my-8 h-px w-full bg-white/5"
                />

                {/* ── Submit Row ───────────────────────── */}
                <div
                  data-anim
                  className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* CTA Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    onMouseEnter={shimmer}
                    aria-label={
                      submitting ? "Sending your message" : "Send message"
                    }
                    className="
                      relative overflow-hidden
                      min-h-[48px] px-9
                      border border-amber-500/40 bg-amber-500/[0.08]
                      font-mono text-sm tracking-[0.08em] uppercase text-amber-500
                      hover:border-amber-500/60 hover:bg-amber-500/[0.13]
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                      focus:ring-offset-2 focus:ring-offset-[#0B0F19]
                      transition-colors duration-150
                      disabled:opacity-40 disabled:cursor-not-allowed
                      will-change-transform
                    "
                  >
                    {/* Shimmer sweep */}
                    <div
                      ref={btnShimmerRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 w-1/3 will-change-transform"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(245,158,11,0.14), transparent)`,
                        transform: "translateX(-120%)",
                      }}
                    />
                    <span className="relative z-10">
                      {submitting ? "TRANSMITTING…" : "SEND MESSAGE"}
                    </span>
                  </button>

                  {/* Privacy note */}
                  <p className="text-white/25 text-xs leading-relaxed max-w-[260px]">
                    By submitting this form, you agree to our{" "}
                    <a
                      href="/privacy"
                      className="
                        text-white/40 underline underline-offset-2
                        decoration-white/20 hover:text-white/60
                        transition-colors duration-150
                      "
                      aria-label="Read our privacy policy"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>

                {/* ── Error State ──────────────────────── */}
                {status === "error" && (
                  <p
                    className="mt-5 font-mono text-xs text-red-400/80 tracking-wide"
                    role="alert"
                  >
                    ◉ Transmission failed — please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </article>

        {/* ── Bottom structural line ───────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none mx-auto mt-4 w-px h-10 bg-linear-to-b from-white/[0.06] to-transparent"
        />
      </div>

      {/* ───────────────────────────────────────────────────
          NOSCRIPT FALLBACK
          ─────────────────────────────────────────────────────
          If JavaScript is disabled, override the data-anim
          opacity:0 so content remains visible.
          ─────────────────────────────────────────────────── */}
      <noscript>
        <style>{`[data-anim]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENT: System Markers
   ───────────────────────────────────────────────────────────
   Atmospheric monospace labels at viewport corners.
   Purely decorative — hidden from assistive tech.
   ═══════════════════════════════════════════════════════════ */
function SystemMarkers({
  statusDotRef,
}: {
  statusDotRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const base =
    "pointer-events-none absolute font-mono text-[10px] tracking-[0.12em] text-white/[0.10] select-none";

  return (
    <div aria-hidden="true">
      <span className={`${base} top-5 left-5`}>SYS::CONTACT_GATEWAY</span>
      <span className={`${base} top-5 right-5 text-right`}>
        48.8566°N 2.3522°E
      </span>
      <span className={`${base} bottom-5 left-5 flex items-center gap-1.5`}>
        <span
          ref={statusDotRef}
          className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 will-change-[opacity]"
          style={{ opacity: 0.7 }}
        />
        ACTIVE
      </span>
      <span className={`${base} bottom-5 right-5 text-right`}>v2.4.1</span>
    </div>
  );
}
