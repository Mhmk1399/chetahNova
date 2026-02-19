// components/lead/Lead.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import styles from "./Lead.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface FieldError {
  [key: string]: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  teamSize: string;
  budget: string;
  services: string[];
  timeline: string;
  currentStack: string;
  challenges: string;
  message: string;
  referral: string;
  newsletter: boolean;
  terms: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  teamSize: "",
  budget: "",
  services: [],
  timeline: "",
  currentStack: "",
  challenges: "",
  message: "",
  referral: "",
  newsletter: false,
  terms: false,
};

/* ════════════════════════════════════════
   SELECT OPTIONS
════════════════════════════════════════ */
const ROLES = [
  "CTO / VP Engineering",
  "Engineering Manager",
  "Senior Engineer",
  "DevOps / SRE",
  "Product Manager",
  "Founder / CEO",
  "Other",
];

const TEAM_SIZES = [
  "1–10 engineers",
  "11–50 engineers",
  "51–200 engineers",
  "201–500 engineers",
  "500+ engineers",
];

const BUDGETS = [
  "Under $5k / month",
  "$5k – $20k / month",
  "$20k – $50k / month",
  "$50k – $100k / month",
  "$100k+ / month",
  "Not sure yet",
];

const TIMELINES = [
  "ASAP — within 2 weeks",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Just exploring",
];

const SERVICES_OPTIONS = [
  { id: "edge", label: "Edge Compute" },
  { id: "mesh", label: "Mesh Networking" },
  { id: "shield", label: "Threat Shield" },
  { id: "pipeline", label: "Data Pipeline" },
  { id: "observe", label: "Observe & Trace" },
  { id: "vault", label: "Vault & Secrets" },
];

const REFERRAL_OPTIONS = [
  "Search engine",
  "Twitter / X",
  "LinkedIn",
  "GitHub",
  "Word of mouth",
  "Conference / Event",
  "Blog / Article",
  "Other",
];

const CHALLENGES_OPTIONS = [
  "High latency",
  "Security gaps",
  "Scaling issues",
  "Observability blind spots",
  "Complex deployments",
  "High infra costs",
  "Compliance requirements",
  "Team bandwidth",
];

/* ════════════════════════════════════════
   VALIDATION
════════════════════════════════════════ */
const validate = (data: FormData, step: number): FieldError => {
  const errors: FieldError = {};
  if (step === 0) {
    if (!data.firstName.trim()) errors.firstName = "First name is required";
    if (!data.lastName.trim()) errors.lastName = "Last name is required";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = "Enter a valid email address";
    if (!data.company.trim()) errors.company = "Company name is required";
    if (!data.role) errors.role = "Select your role";
  }
  if (step === 1) {
    if (!data.teamSize) errors.teamSize = "Select your team size";
    if (!data.budget) errors.budget = "Select a budget range";
    if (data.services.length === 0)
      errors.services = "Select at least one service";
    if (!data.timeline) errors.timeline = "Select a timeline";
  }
  if (step === 2) {
    if (!data.challenges.trim() && data.challenges.length === 0)
      errors.challenges = "Tell us about your challenges";
    if (!data.terms) errors.terms = "You must accept the terms";
  }
  return errors;
};

/* ════════════════════════════════════════
   STEPS CONFIG
════════════════════════════════════════ */
const STEPS = [
  { index: "01", label: "About You", sub: "Identity & contact" },
  { index: "02", label: "Your Needs", sub: "Services & budget" },
  { index: "03", label: "Context", sub: "Challenges & goals" },
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
      style={{ borderColor: "rgba(48,192,192,0.38)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   FIELD WRAPPER
════════════════════════════════════════ */
const FieldWrap = ({
  label,
  htmlFor,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: error ? "#C06060" : "#2A5868" }}
      >
        {label}
        {required && (
          <span style={{ color: "#30C0C0", marginLeft: 3 }} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && !error && (
        <span
          className="font-mono text-[8.5px] tracking-widest"
          style={{ color: "#1A3848" }}
        >
          {hint}
        </span>
      )}
      {error && (
        <span
          role="alert"
          className="font-mono text-[8.5px] tracking-[0.12em] flex items-center gap-1"
          style={{ color: "#C06060" }}
        >
          <span aria-hidden="true">▸</span> {error}
        </span>
      )}
    </div>
    {children}
  </div>
);

/* ════════════════════════════════════════
   TEXT INPUT
════════════════════════════════════════ */
const TextInput = ({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoComplete,
  prefix,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  prefix?: string;
}) => (
  <div
    className={`${styles.inputWrap} ${error ? styles.inputWrapError : ""} relative flex items-center`}
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    {prefix && (
      <span
        className="font-mono text-[11px] pl-3 shrink-0"
        style={{ color: "#1E4058" }}
      >
        {prefix}
      </span>
    )}
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-invalid={!!error}
      className={`${styles.input} ${prefix ? "pl-1" : ""} w-full`}
    />
  </div>
);

/* ════════════════════════════════════════
   SELECT INPUT
════════════════════════════════════════ */
const SelectInput = ({
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
}) => (
  <div
    className={`${styles.inputWrap} ${error ? styles.inputWrapError : ""} relative`}
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={!!error}
      className={`${styles.select} w-full`}
    >
      <option value="" disabled>
        {placeholder ?? "Select…"}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {/* chevron */}
    <div
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      aria-hidden="true"
    >
      <svg viewBox="0 0 10 6" fill="none" className="w-2.5 h-2.5">
        <path
          d="M1 1l4 4 4-4"
          stroke="#1E4058"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

/* ════════════════════════════════════════
   TEXTAREA
════════════════════════════════════════ */
const TextArea = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  maxLength,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  maxLength?: number;
}) => (
  <div
    className={`${styles.inputWrap} ${error ? styles.inputWrapError : ""} relative`}
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      aria-invalid={!!error}
      className={`${styles.textarea} w-full`}
    />
    {maxLength && (
      <div
        className="absolute bottom-2 right-3 font-mono text-[8px] tracking-widest"
        style={{
          color: value.length > maxLength * 0.85 ? "#C09030" : "#1A3848",
        }}
        aria-live="polite"
      >
        {value.length}/{maxLength}
      </div>
    )}
  </div>
);

/* ════════════════════════════════════════
   CHIP SELECTOR (multi)
════════════════════════════════════════ */
const ChipSelector = ({
  options,
  selected,
  onToggle,
  error,
}: {
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  error?: string;
}) => (
  <div
    className="flex flex-wrap gap-2"
    role="group"
    aria-label="Select services"
  >
    {options.map((opt) => {
      const active = selected.includes(opt.id);
      return (
        <button
          key={opt.id}
          type="button"
          role="checkbox"
          aria-checked={active}
          onClick={() => onToggle(opt.id)}
          className={`${styles.chip} ${active ? styles.chipActive : ""} relative flex items-center gap-2`}
        >
          {active && <Bracket pos="tl" />}
          {active && <Bracket pos="br" />}
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              background: active ? "#30C0C0" : "#1A3848",
              boxShadow: active ? "0 0 6px #30C0C0" : "none",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            aria-hidden="true"
          />
          <span
            className="font-mono text-[10px] tracking-[0.12em] uppercase"
            style={{
              color: active ? "#30C0C0" : "#2A5060",
              transition: "color 0.2s",
            }}
          >
            {opt.label}
          </span>
        </button>
      );
    })}
  </div>
);

/* ════════════════════════════════════════
   PILL SELECTOR (single, tag-style)
════════════════════════════════════════ */
const PillSelector = ({
  options,
  value,
  onChange,
  error,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) => (
  <div className="flex flex-wrap gap-2" role="radiogroup">
    {options.map((opt) => {
      const active = value === opt;
      return (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(opt)}
          className={`${styles.pill} ${active ? styles.pillActive : ""} relative`}
        >
          {active && <Bracket pos="tl" />}
          {active && <Bracket pos="br" />}
          <span
            className="font-mono text-[9.5px] tracking-[0.12em] uppercase"
            style={{
              color: active ? "#30C0C0" : "#2A5060",
              transition: "color 0.2s",
            }}
          >
            {opt}
          </span>
        </button>
      );
    })}
  </div>
);

/* ════════════════════════════════════════
   CHECKBOX
════════════════════════════════════════ */
const CheckboxField = ({
  id,
  checked,
  onChange,
  label,
  error,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  error?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className={`${styles.checkLabel} flex items-start gap-3 cursor-pointer`}
    >
      <div
        className={`${styles.checkBox} ${checked ? styles.checkBoxActive : ""} relative shrink-0 flex items-center justify-center`}
        aria-hidden="true"
      >
        {checked && (
          <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="#30C0C0"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        aria-invalid={!!error}
      />
      <span
        className="font-mono text-[11px] leading-relaxed"
        style={{ color: "#2A5060", letterSpacing: "0.02em" }}
      >
        {label}
      </span>
    </label>
    {error && (
      <span
        role="alert"
        className="font-mono text-[8.5px] tracking-[0.12em] flex items-center gap-1 pl-7"
        style={{ color: "#C06060" }}
      >
        <span aria-hidden="true">▸</span> {error}
      </span>
    )}
  </div>
);

/* ════════════════════════════════════════
   STEP INDICATOR
════════════════════════════════════════ */
const StepIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div
    className="flex items-center gap-3"
    role="list"
    aria-label="Form progress"
  >
    {STEPS.map((step, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={step.index}>
          <div
            className="flex items-center gap-2.5"
            role="listitem"
            aria-current={active ? "step" : undefined}
            aria-label={`Step ${step.index}: ${step.label}${done ? " (completed)" : active ? " (current)" : ""}`}
          >
            {/* circle */}
            <div
              className={`${styles.stepCircle} ${done ? styles.stepCircleDone : ""} ${active ? styles.stepCircleActive : ""} relative flex items-center justify-center`}
            >
              {done ? (
                <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                  <path
                    d="M1 4l2.5 2.5L9 1"
                    stroke="#30C0C0"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: active ? "#30C0C0" : "#1A3848" }}
                >
                  {step.index}
                </span>
              )}
              {active && (
                <span className={styles.stepPulse} aria-hidden="true" />
              )}
            </div>

            {/* label (hidden on small screens) */}
            <div className="hidden sm:flex flex-col">
              <span
                className="font-mono text-[9px] tracking-[0.18em] uppercase leading-none"
                style={{
                  color: active ? "#30C0C0" : done ? "#1E5060" : "#1A3848",
                }}
              >
                {step.label}
              </span>
              <span
                className="font-mono text-[7.5px] tracking-[0.12em] mt-0.5"
                style={{ color: "#112030" }}
              >
                {step.sub}
              </span>
            </div>
          </div>

          {/* connector */}
          {i < total - 1 && (
            <div className={styles.stepConnector} aria-hidden="true">
              <div
                className={styles.stepConnectorFill}
                style={{ width: done ? "100%" : "0%" }}
              />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ════════════════════════════════════════
   PROGRESS BAR
════════════════════════════════════════ */
const ProgressBar = ({ step, total }: { step: number; total: number }) => {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between" aria-hidden="true">
        <span
          className="font-mono text-[8.5px] tracking-[0.16em] uppercase"
          style={{ color: "#1A3848" }}
        >
          Progress
        </span>
        <span
          className="font-mono text-[8.5px] tracking-widest"
          style={{ color: "#30C0C0" }}
        >
          {pct}%
        </span>
      </div>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Form completion: ${pct}%`}
      >
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        <div
          className={styles.progressTip}
          style={{ left: `calc(${pct}% - 2px)` }}
        />
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   SUCCESS SCREEN
════════════════════════════════════════ */
const SuccessScreen = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center gap-8 py-16 px-6 text-center">
    {/* animated orb */}
    <div className={styles.successOrbWrap} aria-hidden="true">
      <svg viewBox="0 0 140 140" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="sucOrb" cx="42%" cy="36%" r="65%">
            <stop offset="0%" stopColor="#70E8E8" />
            <stop offset="45%" stopColor="#30C0C0" />
            <stop offset="100%" stopColor="#083040" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sucBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="sucGlow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="70" cy="70" r="66" fill="url(#sucBloom)" />
        <circle
          cx="70"
          cy="70"
          r="60"
          stroke="#183858"
          strokeWidth="0.5"
          strokeDasharray="2 5"
          opacity="0.6"
        />
        <circle
          cx="70"
          cy="70"
          r="40"
          stroke="#1A4060"
          strokeWidth="0.4"
          strokeDasharray="1 5"
          opacity="0.4"
        />
        <circle
          cx="70"
          cy="70"
          r="30"
          fill="url(#sucOrb)"
          filter="url(#sucGlow)"
          className={styles.successOrbPulse}
        />
        <circle
          cx="70"
          cy="70"
          r="30"
          fill="none"
          stroke="#40D8D8"
          strokeWidth="0.5"
          opacity="0.4"
        />
        {/* checkmark */}
        <path
          d="M56 70l9 9 19-18"
          stroke="#60DFDF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.successCheck}
        />
        {/* orbiting dot */}
        <g
          className={styles.successSat}
          style={{ transformOrigin: "70px 70px" }}
        >
          <circle
            cx="70"
            cy="10"
            r="3"
            fill="#60DFDF"
            opacity="0.9"
            filter="url(#sucGlow)"
          />
        </g>
      </svg>
    </div>

    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex items-center justify-center gap-2">
        <TealDot size={5} pulse />
        <span
          className="font-mono text-[9px] tracking-[0.25em] uppercase"
          style={{ color: "#30C0C0" }}
        >
          Transmission received
        </span>
      </div>

      <h3
        className="font-mono leading-tight"
        style={{
          fontSize: "clamp(18px, 3vw, 26px)",
          color: "#B8D8E4",
          letterSpacing: "-0.01em",
        }}
      >
        We'll be in touch,
        <br />
        <span
          style={{
            color: "#30C0C0",
            textShadow: "0 0 24px rgba(48,192,192,0.4)",
          }}
        >
          {name}.
        </span>
      </h3>

      <p
        className="font-mono text-[11.5px] leading-relaxed"
        style={{ color: "#2A5060", letterSpacing: "0.03em" }}
      >
        Your inquiry has been routed to our solutions team. Expect a response
        from a senior engineer within one business day — usually much sooner.
      </p>
    </div>

    {/* next steps */}
    <div
      className={`${styles.successSteps} w-full max-w-sm flex flex-col gap-0`}
    >
      {[
        { step: "01", text: "Confirmation email sent to your inbox" },
        { step: "02", text: "Senior engineer reviews your profile" },
        { step: "03", text: "Discovery call scheduled within 24h" },
        { step: "04", text: "Custom solution proposal delivered" },
      ].map((s, i) => (
        <div
          key={s.step}
          className={`${styles.successStep} flex items-start gap-4 p-4`}
          style={{ animationDelay: `${i * 150 + 400}ms` }}
        >
          <span
            className="font-mono text-[9px] tracking-[0.15em] shrink-0 mt-0.5"
            style={{ color: "#30C0C0", opacity: 0.6 }}
          >
            {s.step}
          </span>
          <span
            className="font-mono text-[11px] leading-snug"
            style={{ color: "#2A5060", letterSpacing: "0.02em" }}
          >
            {s.text}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════
   TRUST BADGES (left panel)
════════════════════════════════════════ */
const TrustPanel = () => (
  <div className={`${styles.trustPanel} flex flex-col gap-8`}>
    {/* mini orb */}
    <div aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none" className="w-20 h-20">
        <defs>
          <radialGradient id="tpOrb" cx="42%" cy="36%" r="65%">
            <stop offset="0%" stopColor="#60DFDF" />
            <stop offset="50%" stopColor="#30C0C0" />
            <stop offset="100%" stopColor="#083040" stopOpacity="0" />
          </radialGradient>
          <filter id="tpGlow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tpSatGlow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="#183858"
          strokeWidth="0.5"
          strokeDasharray="1.5 4"
          opacity="0.6"
        />
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="#1A4060"
          strokeWidth="0.4"
          opacity="0.4"
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="url(#tpOrb)"
          filter="url(#tpGlow)"
          className={styles.tpOrbPulse}
        />
        <ellipse
          cx="44"
          cy="44"
          rx="6"
          ry="4"
          fill="white"
          opacity="0.06"
          transform="rotate(-20 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#40D8D8"
          strokeWidth="0.4"
          opacity="0.3"
        />
        <g className={styles.tpSat} style={{ transformOrigin: "50px 50px" }}>
          <circle
            cx="50"
            cy="6"
            r="2.5"
            fill="#60DFDF"
            opacity="0.9"
            filter="url(#tpSatGlow)"
          />
        </g>
        <circle cx="50" cy="50" r="1.5" fill="#90EFEF" opacity="0.8" />
      </svg>
    </div>

    {/* headline */}
    <div className="flex flex-col gap-3">
      <SectionLabel>Get in touch</SectionLabel>
      <h2
        className="font-mono leading-tight"
        style={{
          fontSize: "clamp(20px, 2.5vw, 30px)",
          color: "#B8D8E4",
          letterSpacing: "-0.01em",
        }}
      >
        Let's build something
        <br />
        <span
          style={{
            color: "#30C0C0",
            textShadow: "0 0 24px rgba(48,192,192,0.4)",
          }}
        >
          that lasts.
        </span>
      </h2>
      <p
        className="font-mono text-[11px] leading-relaxed"
        style={{ color: "#2A5060", letterSpacing: "0.03em" }}
      >
        Tell us about your infrastructure challenges. A senior engineer will
        review your submission personally.
      </p>
    </div>

    {/* trust bullets */}
    <div className="flex flex-col gap-3">
      {[
        { icon: "⚡", text: "Response within 1 business day" },
        { icon: "🔒", text: "Your data is never sold or shared" },
        { icon: "👤", text: "Named engineer — not a ticket queue" },
        { icon: "📋", text: "NDA available on request" },
        { icon: "🌍", text: "Available across all 38 regions" },
      ].map((b) => (
        <div key={b.text} className="flex items-start gap-3">
          <span
            className="font-mono text-[10px] shrink-0 mt-0.5"
            style={{ color: "#30C0C0", opacity: 0.6 }}
          >
            {b.icon}
          </span>
          <span
            className="font-mono text-[11px] leading-snug"
            style={{ color: "#2A5060", letterSpacing: "0.02em" }}
          >
            {b.text}
          </span>
        </div>
      ))}
    </div>

    {/* divider */}
    <div
      style={{
        height: 1,
        background:
          "linear-gradient(to right, rgba(48,192,192,0.15), transparent)",
      }}
      aria-hidden="true"
    />

    {/* social proof */}
    <div className="flex flex-col gap-3">
      <span
        className="font-mono text-[9px] tracking-[0.2em] uppercase"
        style={{ color: "#1A3848" }}
      >
        Trusted by
      </span>
      {[
        { val: "1,400+", desc: "engineering teams" },
        { val: "99.98%", desc: "average uptime delivered" },
        { val: "< 1 day", desc: "avg first response time" },
      ].map((s) => (
        <div key={s.val} className="flex items-baseline gap-2">
          <span
            className="font-mono font-semibold"
            style={{
              fontSize: 17,
              color: "#6ABFCF",
              letterSpacing: "-0.01em",
            }}
          >
            {s.val}
          </span>
          <span
            className="font-mono text-[9.5px] tracking-widest"
            style={{ color: "#1A3848" }}
          >
            {s.desc}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Lead() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const totalSteps = STEPS.length;

  const set = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setTouched((prev) => new Set([...prev, key]));
      /* clear error on change */
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    },
    [errors],
  );

  const toggleService = useCallback(
    (id: string) => {
      setForm((prev) => ({
        ...prev,
        services: prev.services.includes(id)
          ? prev.services.filter((s) => s !== id)
          : [...prev.services, id],
      }));
      setTouched((prev) => new Set([...prev, "services"]));
      if (errors.services) setErrors((prev) => ({ ...prev, services: "" }));
    },
    [errors.services],
  );

  const toggleChallenge = useCallback(
    (label: string) => {
      setForm((prev) => {
        const current = prev.challenges
          ? prev.challenges
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const next = current.includes(label)
          ? current.filter((c) => c !== label)
          : [...current, label];
        return { ...prev, challenges: next.join(", ") };
      });
      setTouched((prev) => new Set([...prev, "challenges"]));
      if (errors.challenges) setErrors((prev) => ({ ...prev, challenges: "" }));
    },
    [errors.challenges],
  );

  const goNext = () => {
    const errs = validate(form, step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      /* scroll to first error */
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(`${uid}-${firstKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, totalSteps - 1));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form, step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    /* simulate network */
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  /* keyboard: Enter advances unless textarea focused */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.tagName !== "BUTTON" &&
        !submitted
      ) {
        if (step < totalSteps - 1) goNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, form, submitted]);

  /* ─── RENDER STEPS ─── */
  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldWrap
              label="First name"
              htmlFor={`${uid}-firstName`}
              required
              error={errors.firstName}
            >
              <TextInput
                id={`${uid}-firstName`}
                value={form.firstName}
                onChange={(v) => set("firstName", v)}
                placeholder="Ada"
                autoComplete="given-name"
                error={errors.firstName}
              />
            </FieldWrap>

            <FieldWrap
              label="Last name"
              htmlFor={`${uid}-lastName`}
              required
              error={errors.lastName}
            >
              <TextInput
                id={`${uid}-lastName`}
                value={form.lastName}
                onChange={(v) => set("lastName", v)}
                placeholder="Lovelace"
                autoComplete="family-name"
                error={errors.lastName}
              />
            </FieldWrap>
          </div>

          <FieldWrap
            label="Work email"
            htmlFor={`${uid}-email`}
            required
            error={errors.email}
            hint="We'll never spam you"
          >
            <TextInput
              id={`${uid}-email`}
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
              placeholder="ada@company.io"
              autoComplete="email"
              error={errors.email}
            />
          </FieldWrap>

          <FieldWrap label="Phone" htmlFor={`${uid}-phone`} hint="Optional">
            <TextInput
              id={`${uid}-phone`}
              type="tel"
              value={form.phone}
              onChange={(v) => set("phone", v)}
              placeholder="+1 555 000 0000"
              autoComplete="tel"
              prefix="☏"
            />
          </FieldWrap>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldWrap
              label="Company"
              htmlFor={`${uid}-company`}
              required
              error={errors.company}
            >
              <TextInput
                id={`${uid}-company`}
                value={form.company}
                onChange={(v) => set("company", v)}
                placeholder="Acme Corp"
                autoComplete="organization"
                error={errors.company}
              />
            </FieldWrap>

            <FieldWrap
              label="Your role"
              htmlFor={`${uid}-role`}
              required
              error={errors.role}
            >
              <SelectInput
                id={`${uid}-role`}
                value={form.role}
                onChange={(v) => set("role", v)}
                options={ROLES}
                placeholder="Select your role"
                error={errors.role}
              />
            </FieldWrap>
          </div>

          <FieldWrap
            label="How did you find us?"
            htmlFor={`${uid}-referral`}
            hint="Optional"
          >
            <SelectInput
              id={`${uid}-referral`}
              value={form.referral}
              onChange={(v) => set("referral", v)}
              options={REFERRAL_OPTIONS}
              placeholder="Select a source"
            />
          </FieldWrap>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="flex flex-col gap-7">
          <FieldWrap
            label="Engineering team size"
            error={errors.teamSize}
            required
          >
            <PillSelector
              options={TEAM_SIZES}
              value={form.teamSize}
              onChange={(v) => set("teamSize", v)}
              error={errors.teamSize}
            />
          </FieldWrap>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, rgba(48,192,192,0.1), transparent)",
            }}
            aria-hidden="true"
          />

          <FieldWrap
            label="Services you're interested in"
            error={errors.services}
            required
          >
            <ChipSelector
              options={SERVICES_OPTIONS}
              selected={form.services}
              onToggle={toggleService}
              error={errors.services}
            />
            {errors.services && (
              <span
                role="alert"
                className="font-mono text-[8.5px] tracking-[0.12em] flex items-center gap-1 mt-1"
                style={{ color: "#C06060" }}
              >
                <span aria-hidden="true">▸</span> {errors.services}
              </span>
            )}
          </FieldWrap>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, rgba(48,192,192,0.1), transparent)",
            }}
            aria-hidden="true"
          />

          <FieldWrap
            label="Monthly budget range"
            error={errors.budget}
            required
          >
            <PillSelector
              options={BUDGETS}
              value={form.budget}
              onChange={(v) => set("budget", v)}
              error={errors.budget}
            />
          </FieldWrap>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, rgba(48,192,192,0.1), transparent)",
            }}
            aria-hidden="true"
          />

          <FieldWrap
            label="Implementation timeline"
            error={errors.timeline}
            required
          >
            <PillSelector
              options={TIMELINES}
              value={form.timeline}
              onChange={(v) => set("timeline", v)}
              error={errors.timeline}
            />
          </FieldWrap>

          <FieldWrap
            label="Current stack / tools"
            htmlFor={`${uid}-currentStack`}
            hint="Optional — helps us prepare"
          >
            <TextInput
              id={`${uid}-currentStack`}
              value={form.currentStack}
              onChange={(v) => set("currentStack", v)}
              placeholder="AWS, Kubernetes, Datadog, Terraform…"
            />
          </FieldWrap>
        </div>
      );
    }

    if (step === 2) {
      const selectedChallenges = form.challenges
        ? form.challenges
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      return (
        <div className="flex flex-col gap-7">
          <FieldWrap
            label="Key challenges you're facing"
            error={errors.challenges}
            required
            hint="Select all that apply"
          >
            <div className="flex flex-wrap gap-2" role="group">
              {CHALLENGES_OPTIONS.map((ch) => {
                const active = selectedChallenges.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    role="checkbox"
                    aria-checked={active}
                    onClick={() => toggleChallenge(ch)}
                    className={`${styles.chip} ${active ? styles.chipActive : ""} relative flex items-center gap-2`}
                  >
                    {active && <Bracket pos="tl" />}
                    {active && <Bracket pos="br" />}
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        background: active ? "#30C0C0" : "#1A3848",
                        boxShadow: active ? "0 0 6px #30C0C0" : "none",
                        transition: "background 0.2s, box-shadow 0.2s",
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{
                        color: active ? "#30C0C0" : "#2A5060",
                        transition: "color 0.2s",
                      }}
                    >
                      {ch}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.challenges && (
              <span
                role="alert"
                className="font-mono text-[8.5px] tracking-[0.12em] flex items-center gap-1 mt-1"
                style={{ color: "#C06060" }}
              >
                <span aria-hidden="true">▸</span> {errors.challenges}
              </span>
            )}
          </FieldWrap>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, rgba(48,192,192,0.1), transparent)",
            }}
            aria-hidden="true"
          />

          <FieldWrap
            label="Tell us more"
            htmlFor={`${uid}-message`}
            hint="Optional but helpful"
          >
            <TextArea
              id={`${uid}-message`}
              value={form.message}
              onChange={(v) => set("message", v)}
              placeholder="Describe your use case, current pain points, or any specific requirements your team has…"
              rows={5}
              maxLength={600}
            />
          </FieldWrap>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, rgba(48,192,192,0.1), transparent)",
            }}
            aria-hidden="true"
          />

          <div className="flex flex-col gap-4">
            <CheckboxField
              id={`${uid}-newsletter`}
              checked={form.newsletter}
              onChange={(v) => set("newsletter", v)}
              label="Send me occasional updates on infrastructure best practices and new features. (No spam, unsubscribe any time.)"
            />

            <CheckboxField
              id={`${uid}-terms`}
              checked={form.terms}
              onChange={(v) => set("terms", v)}
              error={errors.terms}
              label={
                <>
                  I agree to the{" "}
                  <a
                    href="#"
                    style={{ color: "#30C0C0", textDecoration: "underline" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    style={{ color: "#30C0C0", textDecoration: "underline" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>
                  . *
                </>
              }
            />
          </div>
        </div>
      );
    }
  };

  return (
    <section
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="lead-heading"
    >
      {/* bg */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 xl:gap-20 items-start">
          {/* ══ LEFT TRUST PANEL ══ */}
          <div className="lg:sticky lg:top-24">
            <TrustPanel />
          </div>

          {/* ══ RIGHT FORM PANEL ══ */}
          <div className={`${styles.formPanel} relative flex flex-col`}>
            <Bracket pos="tl" />
            <Bracket pos="tr" />
            <Bracket pos="bl" />
            <Bracket pos="br" />

            {/* panel top line */}
            <div className={styles.panelTopLine} aria-hidden="true" />

            {submitted ? (
              <SuccessScreen name={form.firstName || "there"} />
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Lead generation form"
              >
                {/* ── FORM HEADER ── */}
                <div
                  className="p-6 sm:p-8 border-b"
                  style={{ borderColor: "#0C1828" }}
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <StepIndicator current={step} total={totalSteps} />
                      <span
                        className="font-mono text-[8.5px] tracking-[0.16em] uppercase"
                        style={{ color: "#1A3848" }}
                      >
                        Step {step + 1} of {totalSteps}
                      </span>
                    </div>
                    <ProgressBar step={step} total={totalSteps} />
                  </div>
                </div>

                {/* ── STEP TITLE ── */}
                <div className="px-6 sm:px-8 pt-7 pb-2 flex flex-col gap-1">
                  <h3
                    className="font-mono leading-tight"
                    style={{
                      fontSize: "clamp(16px, 2vw, 20px)",
                      color: "#B8D8E4",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {STEPS[step].label}
                  </h3>
                  <p
                    className="font-mono text-[10.5px] tracking-[0.08em]"
                    style={{ color: "#1E4058" }}
                  >
                    {STEPS[step].sub}
                  </p>
                </div>

                {/* ── STEP BODY ── */}
                <div
                  className={`${styles.stepBody} px-6 sm:px-8 py-6`}
                  key={step}
                >
                  {renderStep()}
                </div>

                {/* ── NAV BUTTONS ── */}
                <div
                  className="px-6 sm:px-8 pb-8 flex items-center justify-between gap-4"
                  style={{ borderTop: "1px solid #0C1828", paddingTop: 20 }}
                >
                  {/* back */}
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className={`${styles.btnBack} relative flex items-center gap-2`}
                    >
                      <Bracket pos="tl" />
                      <Bracket pos="br" />
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="w-2.5 h-2.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M10 6H2M6 2L2 6l4 4"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase">
                        Back
                      </span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {/* hint text */}
                  <span
                    className="hidden sm:block font-mono text-[8.5px] tracking-[0.14em]"
                    style={{ color: "#0E1E2E" }}
                  >
                    {step < totalSteps - 1 ? "Press Enter to continue" : ""}
                  </span>

                  {/* next / submit */}
                  {step < totalSteps - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className={`${styles.btnNext} relative flex items-center gap-2`}
                    >
                      <Bracket pos="tl" />
                      <Bracket pos="br" />
                      <span
                        className="font-mono text-[9.5px] tracking-[0.18em] uppercase"
                        style={{ color: "#7ABFCF" }}
                      >
                        Continue
                      </span>
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="w-2.5 h-2.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 6h10M6 2l4 4-4 4"
                          stroke="#30C0C0"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${styles.btnSubmit} relative flex items-center gap-2.5`}
                    >
                      <Bracket pos="tl" />
                      <Bracket pos="br" />
                      <div
                        className={styles.btnSubmitGlow}
                        aria-hidden="true"
                      />
                      {loading ? (
                        <>
                          <span className={styles.spinner} aria-hidden="true" />
                          <span
                            className="font-mono text-[9.5px] tracking-[0.18em] uppercase"
                            style={{ color: "#7ABFCF" }}
                          >
                            Sending…
                          </span>
                        </>
                      ) : (
                        <>
                          <TealDot size={5} pulse />
                          <span
                            className="font-mono text-[9.5px] tracking-[0.18em] uppercase"
                            style={{ color: "#7ABFCF" }}
                          >
                            Send inquiry
                          </span>
                          <svg
                            viewBox="0 0 12 12"
                            fill="none"
                            className="w-2.5 h-2.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 6h10M6 2l4 4-4 4"
                              stroke="#30C0C0"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* panel bottom line */}
            <div className={styles.panelBottomLine} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
