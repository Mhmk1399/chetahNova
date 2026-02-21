// components/contact/Contact.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import styles from "./Contact.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  budget: string;
  consent: boolean;
}

interface FieldErrors {
  [key: string]: string;
}

/* ════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════ */
const SUBJECTS = [
  "General inquiry",
  "Request a demo",
  "Enterprise pricing",
  "Technical support",
  "Partnership",
  "Press & media",
  "Other",
];

const BUDGETS = [
  "Under $5k / mo",
  "$5k – $20k / mo",
  "$20k – $50k / mo",
  "$50k+ / mo",
  "Not sure yet",
];

const CONTACT_METHODS = [
  {
    id: "email",
    label: "Email us",
    value: "hello@axon.systems",
    sub: "Response within 24 hours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M2 8l10 6 10-6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "chat",
    label: "Live chat",
    value: "Available 09:00 – 18:00 UTC",
    sub: "Mon – Fri, instant response",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "call",
    label: "Book a call",
    value: "30-min discovery session",
    sub: "With a senior engineer",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 012.09 4.18 2 2 0 014.09 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.93 6.93l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "office",
    label: "Headquarters",
    value: "San Francisco, CA",
    sub: "450 Market St, Suite 1200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle
          cx="12"
          cy="9"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const TRUST_ITEMS = [
  { value: "< 4h", label: "First response time" },
  { value: "1,400+", label: "Teams trust us" },
  { value: "24/7", label: "Monitoring & support" },
  { value: "SOC 2", label: "Type II certified" },
];

/* ════════════════════════════════════════
   VALIDATION
════════════════════════════════════════ */
const validate = (data: FormData): FieldErrors => {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = "Your name is required";
  if (!data.email.trim()) errors.email = "Email address is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address";
  if (!data.subject) errors.subject = "Please select a subject";
  if (!data.message.trim()) errors.message = "A message is required";
  else if (data.message.trim().length < 20)
    errors.message = "Please write at least 20 characters";
  if (!data.consent) errors.consent = "You must accept to continue";
  return errors;
};

const INIT: FormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  message: "",
  budget: "",
  consent: false,
};

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
        className="absolute inset-0 rounded-full"
        style={{
          background: `${color}44`,
          animation: "ctPing 2s cubic-bezier(0,0,.2,1) infinite",
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

const Bracket = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const m = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`absolute w-2.5 h-2.5 pointer-events-none ${m[pos]}`}
      style={{ borderColor: "rgba(48,192,192,0.38)" }}
      aria-hidden="true"
    />
  );
};

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

/* ════════════════════════════════════════
   FIELD WRAPPER
════════════════════════════════════════ */
const FieldWrap = ({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[9.5px] tracking-[0.2em] uppercase"
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
          className="font-mono text-[8.5px] tracking-[0.1em]"
          style={{ color: "#1A3848" }}
        >
          {hint}
        </span>
      )}
      {error && (
        <span
          role="alert"
          className="font-mono text-[8.5px] tracking-[0.1em] flex items-center gap-1"
          style={{ color: "#C06060" }}
        >
          <span aria-hidden="true">▸</span>
          {error}
        </span>
      )}
    </div>
    {children}
  </div>
);

/* ════════════════════════════════════════
   INPUT
════════════════════════════════════════ */
const Input = ({
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
  prefix?: React.ReactNode;
}) => (
  <div
    className={`${styles.inputWrap} ${error ? styles.inputWrapError : ""} relative flex items-center`}
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    {prefix && (
      <span
        className="flex-shrink-0 pl-3 flex items-center"
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
      className={`${styles.input} w-full ${prefix ? "pl-2" : ""}`}
    />
  </div>
);

/* ════════════════════════════════════════
   SELECT
════════════════════════════════════════ */
const Select = ({
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
    <span
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: "#1E4058" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 10 6" fill="none" className="w-2.5 h-2.5">
        <path
          d="M1 1l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </div>
);

/* ════════════════════════════════════════
   TEXTAREA
════════════════════════════════════════ */
const Textarea = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 5,
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
      rows={rows}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-invalid={!!error}
      className={`${styles.textarea} w-full`}
    />
    {maxLength && (
      <div
        className="absolute bottom-2.5 right-3 font-mono text-[8px]"
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
   PILL SELECTOR
════════════════════════════════════════ */
const PillGroup = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-wrap gap-2" role="radiogroup">
    {options.map((o) => {
      const active = value === o;
      return (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(o)}
          className={`${styles.pill} ${active ? styles.pillActive : ""} relative`}
        >
          {active && (
            <>
              <Bracket pos="tl" />
              <Bracket pos="br" />
            </>
          )}
          <span
            className="font-mono text-[9.5px] tracking-[0.1em] uppercase"
            style={{
              color: active ? "#30C0C0" : "#2A5060",
              transition: "color 0.2s",
            }}
          >
            {o}
          </span>
        </button>
      );
    })}
  </div>
);

/* ════════════════════════════════════════
   CHECKBOX
════════════════════════════════════════ */
const Checkbox = ({
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
        className={`${styles.checkBox} ${checked ? styles.checkBoxOn : ""} relative flex-shrink-0 flex items-center justify-center mt-0.5`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="#30C0C0"
              strokeWidth="1.5"
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
        className="font-mono text-[8.5px] tracking-[0.1em] flex items-center gap-1 pl-7"
        style={{ color: "#C06060" }}
      >
        <span aria-hidden="true">▸</span>
        {error}
      </span>
    )}
  </div>
);

/* ════════════════════════════════════════
   DECORATIVE ORB SVG
════════════════════════════════════════ */
const ContactOrb = () => (
  <div className={styles.orbWrap} aria-hidden="true">
    <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id="coOrb" cx="42%" cy="36%" r="62%">
          <stop offset="0%" stopColor="#70E8E8" />
          <stop offset="40%" stopColor="#30C0C0" />
          <stop offset="75%" stopColor="#1060A0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#080C14" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coBloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#104060" stopOpacity="0.05" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="coGlow">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="coSatGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id="coRingMask">
          <rect width="280" height="280" fill="white" />
          <circle cx="140" cy="140" r="68" fill="black" />
        </mask>
      </defs>

      {/* bloom */}
      <circle cx="140" cy="140" r="130" fill="url(#coBloom)" />

      {/* outer ring */}
      <circle
        cx="140"
        cy="140"
        r="120"
        stroke="#183858"
        strokeWidth="0.5"
        strokeDasharray="2 6"
        opacity="0.5"
      />

      {/* particles */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * 360;
        const rad = ((angle - 90) * Math.PI) / 180;
        const r = 120 + ((i * 7 + 3) % 11) - 5;
        const x = Number((140 + r * Math.cos(rad)).toFixed(4));
        const y = Number((140 + r * Math.sin(rad)).toFixed(4));
        const op = Number((0.15 + (((i * 13 + 7) % 17) / 17) * 0.45).toFixed(2));
        const size = Number((0.8 + (((i * 5) % 7) / 7) * 1.4).toFixed(2));
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={size}
            fill="#30C0C0"
            opacity={op}
          />
        );
      })}

      {/* ring rotate group */}
      <g mask="url(#coRingMask)" className={styles.particleRing}>
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="#183858"
          strokeWidth="0.4"
          strokeDasharray="1.5 6"
          opacity="0.5"
        />
      </g>

      {/* satellite 1 */}
      <g
        className={styles.satOrbit1}
        style={{ transformOrigin: "140px 140px" }}
      >
        <g filter="url(#coSatGlow)">
          <circle cx="140" cy="20" r="4" fill="#60DFDF" opacity="0.9" />
          <circle
            cx="140"
            cy="20"
            r="7"
            fill="none"
            stroke="#30C0C0"
            strokeWidth="0.6"
            opacity="0.3"
          />
        </g>
      </g>

      {/* satellite 2 (counter) */}
      <g
        className={styles.satOrbit2}
        style={{ transformOrigin: "140px 140px" }}
      >
        <g filter="url(#coSatGlow)">
          <circle cx="140" cy="260" r="2.5" fill="#30A0D0" opacity="0.7" />
        </g>
      </g>

      {/* inner rings */}
      <circle
        cx="140"
        cy="140"
        r="76"
        fill="none"
        stroke="#18405A"
        strokeWidth="0.4"
        strokeDasharray="1.5 8"
        opacity="0.4"
      />

      {/* orb bloom bg */}
      <circle cx="140" cy="140" r="90" fill="url(#coOrb)" opacity="0.18" />

      {/* orb core */}
      <circle
        cx="140"
        cy="140"
        r="56"
        fill="url(#coOrb)"
        filter="url(#coGlow)"
        className={styles.orbPulse}
      />
      <ellipse
        cx="126"
        cy="126"
        rx="18"
        ry="12"
        fill="white"
        opacity="0.06"
        transform="rotate(-25 140 140)"
      />
      <circle
        cx="140"
        cy="140"
        r="56"
        fill="none"
        stroke="#40D8D8"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* crosshair */}
      <line
        x1="128"
        y1="140"
        x2="152"
        y2="140"
        stroke="#60DFDF"
        strokeWidth="0.5"
        opacity="0.35"
      />
      <line
        x1="140"
        y1="128"
        x2="140"
        y2="152"
        stroke="#60DFDF"
        strokeWidth="0.5"
        opacity="0.35"
      />
      <circle cx="140" cy="140" r="2" fill="#90EFEF" opacity="0.9" />

      {/* hex decoration */}
      <path
        d="M140 100 L166 115 L166 145 L140 160 L114 145 L114 115 Z"
        stroke="#183858"
        strokeWidth="0.4"
        fill="none"
        opacity="0.4"
      />
    </svg>
  </div>
);

/* ════════════════════════════════════════
   CONTACT METHOD CARD
════════════════════════════════════════ */
const ContactMethodCard = ({
  method,
  index,
}: {
  method: (typeof CONTACT_METHODS)[0];
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`${styles.methodCard} relative flex items-start gap-4 p-4`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />
      <div
        className={styles.methodStripe}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />

      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          border: `1px solid ${hovered ? "rgba(48,192,192,0.3)" : "#112030"}`,
          borderRadius: 2,
          background: hovered ? "rgba(48,192,192,0.06)" : "rgba(8,14,26,0.8)",
          color: hovered ? "#30C0C0" : "#1E4058",
          transition: "all 0.3s",
        }}
      >
        {method.icon}
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="font-mono text-[9px] tracking-[0.2em] uppercase"
          style={{ color: "#1A3848" }}
        >
          {method.label}
        </span>
        <span
          className="font-mono text-[12px] leading-snug"
          style={{
            color: hovered ? "#A8D8E0" : "#4A7A8A",
            transition: "color 0.3s",
          }}
        >
          {method.value}
        </span>
        <span
          className="font-mono text-[9px] tracking-[0.08em]"
          style={{ color: "#1A3040" }}
        >
          {method.sub}
        </span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   SUCCESS SCREEN
════════════════════════════════════════ */
const SuccessScreen = ({ name }: { name: string }) => (
  <div
    className={`${styles.successScreen} flex flex-col items-center gap-8 py-16 px-8 text-center`}
  >
    {/* animated check orb */}
    <div className={styles.successOrb} aria-hidden="true">
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
          r="58"
          stroke="#183858"
          strokeWidth="0.5"
          strokeDasharray="2 5"
          opacity="0.6"
        />
        <circle
          cx="70"
          cy="70"
          r="35"
          fill="url(#sucOrb)"
          filter="url(#sucGlow)"
          className={styles.orbPulse}
        />
        <circle
          cx="70"
          cy="70"
          r="35"
          fill="none"
          stroke="#40D8D8"
          strokeWidth="0.5"
          opacity="0.35"
        />
        <path
          d="M55 70l10 10 20-20"
          stroke="#60DFDF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.checkDraw}
        />
        <g
          className={styles.satOrbit1}
          style={{ transformOrigin: "70px 70px" }}
        >
          <circle
            cx="70"
            cy="12"
            r="3"
            fill="#60DFDF"
            opacity="0.9"
            filter="url(#sucGlow)"
          />
        </g>
      </svg>
    </div>

    <div className="flex flex-col gap-3 max-w-md">
      <div className="flex items-center justify-center gap-2">
        <TealDot size={5} pulse />
        <span
          className="font-mono text-[9px] tracking-[0.25em] uppercase"
          style={{ color: "#30C0C0" }}
        >
          Message received
        </span>
      </div>
      <h3
        className="font-mono leading-tight"
        style={{
          fontSize: "clamp(20px,3vw,30px)",
          color: "#B8D8E4",
          letterSpacing: "-0.01em",
        }}
      >
        Thanks{name ? `, ${name.split(" ")[0]}` : ""}!<br />
        <span
          style={{
            color: "#30C0C0",
            textShadow: "0 0 24px rgba(48,192,192,0.4)",
          }}
        >
          We'll be in touch soon.
        </span>
      </h3>
      <p
        className="font-mono text-[12px] leading-relaxed"
        style={{ color: "#2A5060" }}
      >
        Your message has been routed to the right team. Expect a response within
        one business day — usually much sooner.
      </p>
    </div>

    {/* next steps */}
    <div className={styles.nextSteps}>
      {[
        { n: "01", t: "Confirmation email sent to your inbox" },
        { n: "02", t: "Message reviewed by our team" },
        { n: "03", t: "We reach out within 1 business day" },
      ].map((s, i) => (
        <div
          key={s.n}
          className={`${styles.nextStep} flex items-center gap-3 px-4 py-3`}
          style={{ animationDelay: `${i * 150 + 300}ms` }}
        >
          <span
            className="font-mono text-[9px] tracking-[0.15em] flex-shrink-0"
            style={{ color: "#30C0C0", opacity: 0.6 }}
          >
            {s.n}
          </span>
          <span
            className="font-mono text-[11px] leading-snug"
            style={{ color: "#2A5060" }}
          >
            {s.t}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */
const ContactForm = () => {
  const uid = useId();
  const [form, setForm] = useState<FormData>(INIT);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const set = useCallback(
    <K extends keyof FormData>(key: K, val: FormData[K]) => {
      setForm((p) => ({ ...p, [key]: val }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
    },
    [errors],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document
        .getElementById(`${uid}-${firstKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setState("loading");
    await new Promise((r) => setTimeout(r, 1600));
    setState("success");
  };

  if (state === "success") return <SuccessScreen name={form.name} />;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="flex flex-col gap-6"
    >
      {/* name + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldWrap
          label="Full name"
          htmlFor={`${uid}-name`}
          required
          error={errors.name}
        >
          <Input
            id={`${uid}-name`}
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="Ada Lovelace"
            autoComplete="name"
            error={errors.name}
          />
        </FieldWrap>
        <FieldWrap
          label="Work email"
          htmlFor={`${uid}-email`}
          required
          error={errors.email}
        >
          <Input
            id={`${uid}-email`}
            type="email"
            value={form.email}
            onChange={(v) => set("email", v)}
            placeholder="ada@company.io"
            autoComplete="email"
            error={errors.email}
          />
        </FieldWrap>
      </div>

      {/* phone + company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldWrap label="Phone" htmlFor={`${uid}-phone`} hint="Optional">
          <Input
            id={`${uid}-phone`}
            type="tel"
            value={form.phone}
            onChange={(v) => set("phone", v)}
            placeholder="+1 555 000 0000"
            autoComplete="tel"
            prefix={
              <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                <path
                  d="M13 10.5v2a1 1 0 01-1.09 1A13 13 0 01.9 2.09a1 1 0 011-.09l2 .01a1 1 0 011 .85c.12.69.33 1.37.62 2.01a1 1 0 01-.22 1.05l-.8.8a8 8 0 004.63 4.63l.8-.8a1 1 0 011.05-.22c.64.29 1.32.5 2.01.62a1 1 0 01.85 1.01z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </FieldWrap>
        <FieldWrap label="Company" htmlFor={`${uid}-company`} hint="Optional">
          <Input
            id={`${uid}-company`}
            value={form.company}
            onChange={(v) => set("company", v)}
            placeholder="Acme Corp"
            autoComplete="organization"
          />
        </FieldWrap>
      </div>

      {/* subject */}
      <FieldWrap
        label="Subject"
        htmlFor={`${uid}-subject`}
        required
        error={errors.subject}
      >
        <Select
          id={`${uid}-subject`}
          value={form.subject}
          onChange={(v) => set("subject", v)}
          options={SUBJECTS}
          placeholder="What is this about?"
          error={errors.subject}
        />
      </FieldWrap>

      {/* budget */}
      <FieldWrap label="Budget range" hint="Optional — helps us prepare">
        <PillGroup
          options={BUDGETS}
          value={form.budget}
          onChange={(v) => set("budget", v)}
        />
      </FieldWrap>

      {/* message */}
      <FieldWrap
        label="Message"
        htmlFor={`${uid}-message`}
        required
        error={errors.message}
        hint={`${form.message.length}/500`}
      >
        <Textarea
          id={`${uid}-message`}
          value={form.message}
          onChange={(v) => set("message", v)}
          placeholder="Tell us about your project, challenges, or what you're looking to achieve…"
          rows={5}
          maxLength={500}
          error={errors.message}
        />
      </FieldWrap>

      {/* consent */}
      <Checkbox
        id={`${uid}-consent`}
        checked={form.consent}
        onChange={(v) => set("consent", v)}
        error={errors.consent}
        label={
          <>
            I agree to the{" "}
            <a
              href="#"
              style={{ color: "#30C0C0", textDecoration: "underline" }}
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </a>{" "}
            and consent to being contacted about my inquiry. *
          </>
        }
      />

      {/* submit */}
      <button
        type="submit"
        disabled={state === "loading"}
        className={`${styles.submitBtn} relative flex items-center justify-center gap-3`}
      >
        <Bracket pos="tl" />
        <Bracket pos="br" />
        <div className={styles.submitGlow} aria-hidden="true" />

        {state === "loading" ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            <span
              className="font-mono text-[10px] tracking-[0.22em] uppercase"
              style={{ color: "#7ABFCF" }}
            >
              Sending…
            </span>
          </>
        ) : (
          <>
            <TealDot size={5} pulse />
            <span
              className="font-mono text-[10px] tracking-[0.22em] uppercase"
              style={{ color: "#7ABFCF" }}
            >
              Send message
            </span>
            <svg
              viewBox="0 0 14 14"
              fill="none"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="#30C0C0"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>

      <p
        className="font-mono text-[8.5px] tracking-[0.1em] text-center leading-relaxed"
        style={{ color: "#1A3848" }}
      >
        No spam. No cold calls. Your data is never sold or shared.
      </p>
    </form>
  );
};

/* ════════════════════════════════════════
   MAP PLACEHOLDER (pure CSS/SVG)
════════════════════════════════════════ */
const MapPlaceholder = () => (
  <div
    className={styles.mapWrap}
    aria-label="Office location visualization"
    role="img"
  >
    <svg
      viewBox="0 0 600 200"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#30C0C0" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <pattern
          id="mapGrid"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 30 0 L 0 0 0 30"
            fill="none"
            stroke="rgba(24,56,88,0.3)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="600" height="200" fill="#06080E" />
      <rect width="600" height="200" fill="url(#mapGrid)" />
      <circle cx="300" cy="100" r="80" fill="url(#mapGlow)" />
      {/* continent shapes */}
      <path
        d="M100 80 Q140 60 180 75 Q200 55 230 70 Q250 50 270 65 Q300 45 320 60 Q360 40 390 55 Q420 35 450 50 L450 130 Q430 145 410 135 Q380 150 350 140 Q320 155 290 145 Q260 160 230 148 Q200 165 170 155 Q140 170 110 160 Q80 175 60 165 L60 100 Q80 85 100 80Z"
        fill="rgba(24,56,88,0.4)"
      />
      <path
        d="M200 130 Q220 120 240 128 Q260 115 280 122 Q300 110 320 118 Q340 105 360 112 L360 160 Q340 168 320 162 Q300 170 280 164 Q260 172 240 166 Q220 174 200 168Z"
        fill="rgba(24,56,88,0.3)"
      />
      {/* location pin */}
      <circle
        cx="300"
        cy="100"
        r="6"
        fill="#30C0C0"
        style={{ filter: "drop-shadow(0 0 8px #30C0C0)" }}
      />
      <circle
        cx="300"
        cy="100"
        r="14"
        fill="none"
        stroke="#30C0C0"
        strokeWidth="1"
        opacity="0.4"
        style={{ animation: "mapPing 2s ease-out infinite" }}
      />
      <circle
        cx="300"
        cy="100"
        r="22"
        fill="none"
        stroke="#30C0C0"
        strokeWidth="0.5"
        opacity="0.2"
        style={{ animation: "mapPing 2s ease-out 0.5s infinite" }}
      />
      <line
        x1="300"
        y1="106"
        x2="300"
        y2="140"
        stroke="#30C0C0"
        strokeWidth="0.8"
        opacity="0.4"
        strokeDasharray="2 3"
      />
      {/* labels */}
      <text
        x="300"
        y="158"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
        fill="rgba(48,192,192,0.7)"
        letterSpacing="2"
      >
        SF · 37.77°N
      </text>
    </svg>
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Contact() {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="contact-heading"
    >
      {/* ── bg ── */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        {/* ══ HEADER ══ */}
        <div
          className={`${styles.headerBlock} ${revealed ? styles.revealed : ""} flex flex-col gap-5 mb-16 sm:mb-20`}
        >
          <SectionLabel>Contact us</SectionLabel>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1
              id="contact-heading"
              className="font-mono leading-tight max-w-2xl"
              style={{
                fontSize: "clamp(28px,4.5vw,56px)",
                color: "#B8D8E4",
                letterSpacing: "-0.02em",
              }}
            >
              Let's build something
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 40px rgba(48,192,192,0.45)",
                }}
              >
                extraordinary.
              </span>
            </h1>
            <p
              className="font-mono text-[12px] leading-relaxed max-w-xs lg:text-right"
              style={{ color: "#2E5868", letterSpacing: "0.04em" }}
            >
              Whether you have a question, a project, or just want to see if
              we're the right fit — we're here.
            </p>
          </div>
          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ TRUST STRIP ══ */}
        <div
          className={`${styles.trustStrip} ${revealed ? styles.revealed : ""} grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16`}
          style={{ transitionDelay: "0.1s" }}
        >
          {TRUST_ITEMS.map((t, i) => (
            <div
              key={t.label}
              className={`${styles.trustCard} relative flex flex-col gap-1 p-4`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Bracket pos="tl" />
              <Bracket pos="br" />
              <span
                className="font-mono font-semibold leading-none"
                style={{
                  fontSize: "clamp(18px,2.5vw,24px)",
                  color: "#60C8D0",
                  letterSpacing: "-0.01em",
                }}
              >
                {t.value}
              </span>
              <span
                className="font-mono text-[9px] tracking-[0.16em] uppercase"
                style={{ color: "#1E4058" }}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-10 xl:gap-16">
          {/* LEFT COLUMN */}
          <div
            className={`${styles.leftCol} ${revealed ? styles.revealed : ""} flex flex-col gap-8`}
            style={{ transitionDelay: "0.15s" }}
          >
            {/* orb */}
            <div className="flex justify-center lg:justify-start">
              <ContactOrb />
            </div>

            {/* contact methods */}
            <div
              className="flex flex-col gap-2"
              role="list"
              aria-label="Contact methods"
            >
              {CONTACT_METHODS.map((m, i) => (
                <div key={m.id} role="listitem">
                  <ContactMethodCard method={m} index={i} />
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

            {/* social */}
            <div className="flex flex-col gap-3">
              <span
                className="font-mono text-[9px] tracking-[0.22em] uppercase"
                style={{ color: "#1A3848" }}
              >
                Follow us
              </span>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className={`${styles.socialBtn} relative flex items-center justify-center`}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Bracket pos="tl" />
                    <Bracket pos="br" />
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* map */}
            <div className="flex flex-col gap-3">
              <span
                className="font-mono text-[9px] tracking-[0.22em] uppercase"
                style={{ color: "#1A3848" }}
              >
                Find us
              </span>
              <MapPlaceholder />
            </div>
          </div>

          {/* RIGHT COLUMN — form panel */}
          <div
            className={`${styles.rightCol} ${revealed ? styles.revealed : ""}`}
            style={{ transitionDelay: "0.22s" }}
          >
            <div className={`${styles.formPanel} relative`}>
              <Bracket pos="tl" />
              <Bracket pos="tr" />
              <Bracket pos="bl" />
              <Bracket pos="br" />

              {/* panel top line */}
              <div className={styles.panelTopLine} aria-hidden="true" />

              {/* panel header */}
              <div
                className="flex items-center justify-between px-7 py-5"
                style={{ borderBottom: "1px solid #0C1828" }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <TealDot size={5} pulse />
                    <span
                      className="font-mono text-[9.5px] tracking-[0.22em] uppercase"
                      style={{ color: "#30C0C0", opacity: 0.85 }}
                    >
                      Send a message
                    </span>
                  </div>
                  <p
                    className="font-mono text-[10.5px]"
                    style={{ color: "#1E3848" }}
                  >
                    Fill out the form and we'll get back to you shortly
                  </p>
                </div>
                {/* availability badge */}
                <div
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 flex-shrink-0"
                  style={{
                    border: "1px solid rgba(48,192,192,0.18)",
                    borderRadius: 2,
                    background: "rgba(48,192,192,0.04)",
                  }}
                >
                  <TealDot size={4} color="#30C0A0" pulse />
                  <span
                    className="font-mono text-[8px] tracking-[0.18em] uppercase"
                    style={{ color: "#30C0A0" }}
                  >
                    Online
                  </span>
                </div>
              </div>

              {/* form body */}
              <div className="px-7 py-7 sm:px-8 sm:py-8">
                <ContactForm />
              </div>

              {/* panel bottom line */}
              <div className={styles.panelBottomLine} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ══ BOTTOM STRIP ══ */}
        <div className={`${styles.bottomStrip} mt-16 sm:mt-20`}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Response guaranteed within 24h
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              NDA available on request
            </span>
            <TealDot size={4} />
          </div>
        </div>
      </div>

      {/* global keyframes */}
      <style>{`
        @keyframes ctPing {
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes mapPing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
