// components/contact/ContactSection.tsx
"use client";

import React, { useState, useId, useCallback } from "react";
import styles from "./Lead.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface FieldError {
  [key: string]: string;
}

interface FormData {
  fullName: string;
  email: string;
  website: string;
  industry: string;
  service: string;
  budget: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  email: "",
  website: "",
  industry: "",
  service: "",
  budget: "",
  message: "",
};

/* ════════════════════════════════════════
   SELECT OPTIONS
════════════════════════════════════════ */
const SERVICES = ["Web Design", "SEO", "AI Automation", "Full Package"];

const BUDGETS = [
  "Under $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "Not sure yet",
];

/* ════════════════════════════════════════
   VALIDATION
════════════════════════════════════════ */
const validate = (data: FormData): FieldError => {
  const errors: FieldError = {};
  if (!data.fullName.trim()) errors.fullName = "Name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email";
  if (!data.industry.trim()) errors.industry = "Industry is required";
  if (!data.service) errors.service = "Please select a service";
  if (!data.budget) errors.budget = "Please select a budget range";
  return errors;
};

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
          className="font-mono text-[8.5px] tracking-[0.12em]"
          style={{ color: "#C06060" }}
        >
          ▸ {error}
        </span>
      )}
    </div>
    {children}
  </div>
);

/* ════════════════════════════════════════
   INPUT COMPONENTS
════════════════════════════════════════ */
const TextInput = ({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) => (
  <div
    className={`${styles.inputWrap} ${error ? styles.inputWrapError : ""} relative`}
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-invalid={!!error}
      className={`${styles.input} w-full`}
    />
  </div>
);

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

const TextArea = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 5,
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
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
      aria-invalid={!!error}
      className={`${styles.textarea} w-full`}
    />
  </div>
);

/* ════════════════════════════════════════
   SUCCESS SCREEN
════════════════════════════════════════ */
const SuccessScreen = () => (
  <div className="flex flex-col items-center justify-center gap-8 py-16 px-6 text-center">
    <div className={styles.successOrb} aria-hidden="true">
      <TealDot size={12} pulse />
    </div>

    <div className="flex flex-col gap-3 max-w-md">
      <SectionLabel>Message Sent</SectionLabel>

      <h3
        className="font-mono leading-tight"
        style={{
          fontSize: "clamp(20px, 3vw, 28px)",
          color: "#B8D8E4",
          letterSpacing: "-0.01em",
        }}
      >
        <span
          style={{
            color: "#30C0C0",
            textShadow: "0 0 24px rgba(48,192,192,0.4)",
          }}
        >
          Thank you!
        </span>
        <br />
        We'll be in touch soon.
      </h3>

      <p
        className="font-mono text-[12px] leading-relaxed"
        style={{ color: "#2A5060", letterSpacing: "0.03em" }}
      >
        We received your message and will respond within 24 hours with a clear
        plan and pricing estimate.
      </p>
    </div>
  </div>
);

/* ════════════════════════════════════════
   CONTACT INFO SIDEBAR
════════════════════════════════════════ */
const ContactInfo = () => (
  <div className={`${styles.infoPanel} flex flex-col gap-8`}>
    <div className="flex flex-col gap-3">
      <SectionLabel>Contact Details</SectionLabel>
      <h3
        className="font-mono leading-tight"
        style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: "#B8D8E4" }}
      >
        Get In
        <br />
        <span
          style={{
            color: "#30C0C0",
            textShadow: "0 0 24px rgba(48,192,192,0.4)",
          }}
        >
          Touch
        </span>
      </h3>
    </div>

    <div className="flex flex-col gap-5">
      {[
        {
          icon: "✉",
          label: "Email",
          value: "your@email.com",
          link: "mailto:your@email.com",
        },
        {
          icon: "📱",
          label: "WhatsApp / Phone",
          value: "+XX XXXX",
          link: "tel:+XXXXXXXX",
        },
        { icon: "🌍", label: "Location", value: "UK / Worldwide", link: null },
        {
          icon: "⚡",
          label: "Response Time",
          value: "Within 24 hours",
          link: null,
        },
      ].map((item) => (
        <div key={item.label} className={styles.infoItem}>
          <span className={styles.infoIcon}>{item.icon}</span>
          <div className="flex flex-col gap-0.5">
            <span className={styles.infoLabel}>{item.label}</span>
            {item.link ? (
              <a href={item.link} className={styles.infoValue}>
                {item.value}
              </a>
            ) : (
              <span className={styles.infoValueText}>{item.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className={styles.infoDivider} />

    <div className="flex flex-col gap-3">
      <span
        className="font-mono text-[9px] tracking-[0.2em] uppercase"
        style={{ color: "#1A3848" }}
      >
        Why Choose Us?
      </span>
      {[
        "Free consultation",
        "Custom solutions",
        "No hidden fees",
        "Money-back guarantee",
      ].map((text) => (
        <div key={text} className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "#30C0C0" }}
          >
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M5.5 8L7 9.5L10.5 6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="font-mono text-[11px]"
            style={{ color: "#2A5060", letterSpacing: "0.02em" }}
          >
            {text}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ContactSection() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const uid = useId();

  const set = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    },
    [errors],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="contact-heading"
    >
      {/* Background */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 items-start">
          {/* SIDEBAR */}
          <div className="lg:sticky lg:top-24">
            <ContactInfo />
          </div>

          {/* FORM PANEL */}
          <div className={`${styles.formPanel} relative`}>
            <Bracket pos="tl" />
            <Bracket pos="tr" />
            <Bracket pos="bl" />
            <Bracket pos="br" />

            <div className={styles.panelTopLine} aria-hidden="true" />

            {submitted ? (
              <SuccessScreen />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* HEADER */}
                <div className={styles.formHeader}>
                  <h2 id="contact-heading" className={styles.formTitle}>
                    Let's Talk About
                    <br />
                    <span
                      style={{
                        color: "#30C0C0",
                        textShadow: "0 0 28px rgba(48,192,192,0.4)",
                      }}
                    >
                      Your Project
                    </span>
                  </h2>
                  <p className={styles.formSubtitle}>
                    Tell us about your business and what you want to build.
                    We'll respond within 24 hours with a clear plan and pricing
                    estimate.
                  </p>
                  <div className={styles.headerDivider} />
                </div>

                {/* FORM BODY */}
                <div className={styles.formBody}>
                  <FieldWrap
                    label="Full Name"
                    htmlFor={`${uid}-fullName`}
                    required
                    error={errors.fullName}
                  >
                    <TextInput
                      id={`${uid}-fullName`}
                      value={form.fullName}
                      onChange={(v) => set("fullName", v)}
                      placeholder="John Doe"
                      error={errors.fullName}
                    />
                  </FieldWrap>

                  <FieldWrap
                    label="Email Address"
                    htmlFor={`${uid}-email`}
                    required
                    error={errors.email}
                  >
                    <TextInput
                      id={`${uid}-email`}
                      type="email"
                      value={form.email}
                      onChange={(v) => set("email", v)}
                      placeholder="john@company.com"
                      error={errors.email}
                    />
                  </FieldWrap>

                  <FieldWrap
                    label="Business Website"
                    htmlFor={`${uid}-website`}
                    hint="Optional"
                  >
                    <TextInput
                      id={`${uid}-website`}
                      type="url"
                      value={form.website}
                      onChange={(v) => set("website", v)}
                      placeholder="https://yoursite.com"
                    />
                  </FieldWrap>

                  <FieldWrap
                    label="Business Type / Industry"
                    htmlFor={`${uid}-industry`}
                    required
                    error={errors.industry}
                  >
                    <TextInput
                      id={`${uid}-industry`}
                      value={form.industry}
                      onChange={(v) => set("industry", v)}
                      placeholder="E.g., Real Estate, SaaS, Healthcare..."
                      error={errors.industry}
                    />
                  </FieldWrap>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FieldWrap
                      label="Service Needed"
                      htmlFor={`${uid}-service`}
                      required
                      error={errors.service}
                    >
                      <SelectInput
                        id={`${uid}-service`}
                        value={form.service}
                        onChange={(v) => set("service", v)}
                        options={SERVICES}
                        placeholder="Select service"
                        error={errors.service}
                      />
                    </FieldWrap>

                    <FieldWrap
                      label="Budget Range"
                      htmlFor={`${uid}-budget`}
                      required
                      error={errors.budget}
                    >
                      <SelectInput
                        id={`${uid}-budget`}
                        value={form.budget}
                        onChange={(v) => set("budget", v)}
                        options={BUDGETS}
                        placeholder="Select budget"
                        error={errors.budget}
                      />
                    </FieldWrap>
                  </div>

                  <FieldWrap
                    label="Message"
                    htmlFor={`${uid}-message`}
                    hint="Optional"
                  >
                    <TextArea
                      id={`${uid}-message`}
                      value={form.message}
                      onChange={(v) => set("message", v)}
                      placeholder="Tell us more about your project, goals, and timeline..."
                      rows={6}
                    />
                  </FieldWrap>
                </div>

                {/* SUBMIT */}
                <div className={styles.formFooter}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${styles.submitBtn} relative`}
                  >
                    <Bracket pos="tl" />
                    <Bracket pos="tr" />
                    <Bracket pos="bl" />
                    <Bracket pos="br" />
                    <div className={styles.btnGlow} />
                    {loading ? (
                      <>
                        <span className={styles.spinner} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <TealDot size={5} pulse />
                        <span>Send Request</span>
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          className="w-3 h-3"
                        >
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="#30C0C0"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className={styles.panelBottomLine} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
