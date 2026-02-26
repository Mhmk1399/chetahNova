"use client";

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════
// BRAND COLORS
// ════════════════════════════════════════════════════════════════════

const colors = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  dark: "#0B0F19",
  darkLighter: "#0F1420",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface FormData {
  fullName: string;
  email: string;
  website: string;
  industry: string;
  service: string;
  budget: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  industry?: string;
  service?: string;
  message?: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
  location: string;
  responseTime: string;
}

interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface ContactSectionProps {
  headline?: string;
  description?: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  phone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  location: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  loader: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  user: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  globe: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  briefcase: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  layers: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  wallet: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  message: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  send: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultContactInfo: ContactInfo = {
  email: "hello@nexus.studio",
  phone: "+1 (555) 123-4567",
  whatsapp: "+1 (555) 123-4567",
  location: "United Kingdom / Worldwide",
  responseTime: "Within 24 hours",
};

const defaultSocialLinks: SocialLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: Icons.linkedin,
  },
  {
    id: "twitter",
    label: "Twitter",
    href: "https://twitter.com",
    icon: Icons.twitter,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/15551234567",
    icon: Icons.whatsapp,
  },
];

const serviceOptions = [
  { value: "", label: "Select a service..." },
  { value: "web-design", label: "Web Design" },
  { value: "seo", label: "SEO" },
  { value: "ai-automation", label: "AI Automation" },
  { value: "full-package", label: "Full Package" },
];

const budgetOptions = [
  { value: "", label: "Select your budget..." },
  { value: "3k-5k", label: "$3,000 - $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-20k", label: "$10,000 - $20,000" },
  { value: "20k+", label: "$20,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

const industryOptions = [
  { value: "", label: "Select your industry..." },
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS" },
  { value: "real-estate", label: "Real Estate" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "agency", label: "Agency" },
  { value: "startup", label: "Startup" },
  { value: "other", label: "Other" },
];

// ════════════════════════════════════════════════════════════════════
// BACKGROUND
// ════════════════════════════════════════════════════════════════════

const Background = memo(function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${colors.dark} 0%, ${colors.darkLighter} 50%, ${colors.dark} 100%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="absolute left-0 top-1/4 h-150 w-150 -translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-0 h-125 w-125 translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}06 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-100 w-[800px] -translate-x-1/2 translate-y-1/2"
        style={{
          background: `radial-gradient(ellipse, ${colors.accent}05 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FORM INPUT
// ════════════════════════════════════════════════════════════════════

const FormInput = memo(function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="group">
      {/* Label */}
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-2 text-sm font-medium"
        style={{ color: error ? "#EF4444" : "rgba(255,255,255,0.7)" }}
      >
        {icon && <span className="h-4 w-4 opacity-50">{icon}</span>}
        {label}
        {required && <span style={{ color: colors.primary }}>*</span>}
      </label>

      {/* Input */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full border bg-transparent px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/25"
          style={{
            borderColor: error
              ? "#EF4444"
              : isFocused
                ? `${colors.primary}50`
                : hasValue
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.08)",
            backgroundColor: isFocused
              ? `${colors.primary}05`
              : "rgba(255,255,255,0.02)",
          }}
          required={required}
        />

        {/* Valid Indicator */}
        {hasValue && !error && (
          <span
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: colors.secondary }}
          >
            {Icons.check}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: "#EF4444" }}>
          {error}
        </p>
      )}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FORM SELECT
// ════════════════════════════════════════════════════════════════════

const FormSelect = memo(function FormSelect({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  icon,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="group">
      {/* Label */}
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-2 text-sm font-medium"
        style={{ color: error ? "#EF4444" : "rgba(255,255,255,0.7)" }}
      >
        {icon && <span className="h-4 w-4 opacity-50">{icon}</span>}
        {label}
        {required && <span style={{ color: colors.primary }}>*</span>}
      </label>

      {/* Select */}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full appearance-none border bg-transparent px-4 py-3.5 text-sm text-white outline-none transition-all duration-300"
          style={{
            borderColor: error
              ? "#EF4444"
              : isFocused
                ? `${colors.primary}50`
                : hasValue
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.08)",
            backgroundColor: isFocused
              ? `${colors.primary}05`
              : "rgba(255,255,255,0.02)",
            color: hasValue ? "white" : "rgba(255,255,255,0.25)",
          }}
          required={required}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{ backgroundColor: colors.dark, color: "white" }}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Arrow */}
        <span
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform duration-300"
          style={{
            color: isFocused ? colors.primary : "rgba(255,255,255,0.4)",
            transform: isFocused
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: "#EF4444" }}>
          {error}
        </p>
      )}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FORM TEXTAREA
// ════════════════════════════════════════════════════════════════════

const FormTextarea = memo(function FormTextarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon,
  rows = 5,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const charCount = value.length;
  const maxChars = 1000;

  return (
    <div className="group">
      {/* Label */}
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-2 text-sm font-medium"
        style={{ color: error ? "#EF4444" : "rgba(255,255,255,0.7)" }}
      >
        {icon && <span className="h-4 w-4 opacity-50">{icon}</span>}
        {label}
        {required && <span style={{ color: colors.primary }}>*</span>}
      </label>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxChars}
          className="w-full resize-none border bg-transparent px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/25"
          style={{
            borderColor: error
              ? "#EF4444"
              : isFocused
                ? `${colors.primary}50`
                : hasValue
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.08)",
            backgroundColor: isFocused
              ? `${colors.primary}05`
              : "rgba(255,255,255,0.02)",
          }}
          required={required}
        />

        {/* Character Count */}
        <span
          className="absolute bottom-3 right-3 text-xs"
          style={{
            color:
              charCount > maxChars * 0.9
                ? colors.primary
                : "rgba(255,255,255,0.3)",
          }}
        >
          {charCount}/{maxChars}
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: "#EF4444" }}>
          {error}
        </p>
      )}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CONTACT INFO CARD
// ════════════════════════════════════════════════════════════════════

const ContactInfoCard = memo(function ContactInfoCard({
  contactInfo,
  socialLinks,
}: {
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const infoItems = cardRef.current.querySelectorAll(".info-item");
    if (infoItems.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        infoItems,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const infoItems = [
    {
      icon: Icons.mail,
      label: "Email",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      color: colors.primary,
    },
    {
      icon: Icons.phone,
      label: "Phone",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
      color: colors.secondary,
    },
    {
      icon: Icons.whatsapp,
      label: "WhatsApp",
      value: contactInfo.whatsapp || contactInfo.phone,
      href: `https://wa.me/${(contactInfo.whatsapp || contactInfo.phone).replace(/\D/g, "")}`,
      color: "#25D366",
    },
    {
      icon: Icons.location,
      label: "Location",
      value: contactInfo.location,
      color: colors.accent,
    },
    {
      icon: Icons.clock,
      label: "Response Time",
      value: contactInfo.responseTime,
      color: colors.primary,
    },
  ];

  return (
    <div ref={cardRef} className="h-full">
      <div
        className="h-full border p-6 md:p-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: `linear-gradient(135deg, ${colors.primary}05, transparent 50%, ${colors.secondary}05)`,
        }}
      >
        {/* Title */}
        <h3 className="mb-6 text-lg font-bold    text-white md:text-xl">
          Contact Information
        </h3>

        {/* Info Items */}
        <div className="space-y-5">
          {infoItems.map((item, index) => (
            <div key={index} className="info-item group" style={{ opacity: 0 }}>
              {item.href ? (
                <Link
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-start gap-4 transition-colors duration-300"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center border transition-all duration-300"
                    style={{
                      borderColor: `${item.color}30`,
                      backgroundColor: `${item.color}10`,
                    }}
                  >
                    <span className="h-5 w-5" style={{ color: item.color }}>
                      {item.icon}
                    </span>
                  </span>
                  <div>
                    <div className="text-xs text-white/40">{item.label}</div>
                    <div className="text-sm font-medium text-white/80 transition-colors duration-300 group-hover:text-white">
                      {item.value}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center border"
                    style={{
                      borderColor: `${item.color}30`,
                      backgroundColor: `${item.color}10`,
                    }}
                  >
                    <span className="h-5 w-5" style={{ color: item.color }}>
                      {item.icon}
                    </span>
                  </span>
                  <div>
                    <div className="text-xs text-white/40">{item.label}</div>
                    <div className="text-sm font-medium text-white/80">
                      {item.value}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-white/[0.06]" />

        {/* Social Links */}
        <div>
          <h4 className="mb-4 text-sm font-medium text-white/60">
            Connect With Us
          </h4>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-11 w-11 items-center justify-center border transition-all duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary}50`;
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.02)";
                }}
                aria-label={social.label}
              >
                <span className="h-5 w-5 text-white/50 transition-colors duration-300 group-hover:text-white">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Response Badge */}
        <div
          className="mt-8 flex items-center gap-3 border p-4"
          style={{
            borderColor: `${colors.secondary}20`,
            backgroundColor: `${colors.secondary}05`,
          }}
        >
          <span className="relative flex h-3 w-3">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: colors.secondary }}
            />
            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{ backgroundColor: colors.secondary }}
            />
          </span>
          <span className="text-sm text-white/70">
            Available now • Typically replies within hours
          </span>
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SUCCESS MESSAGE
// ════════════════════════════════════════════════════════════════════

const SuccessMessage = memo(function SuccessMessage({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-12 text-center">
      {/* Success Icon */}
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          backgroundColor: `${colors.secondary}15`,
          border: `2px solid ${colors.secondary}40`,
        }}
      >
        <span className="h-10 w-10" style={{ color: colors.secondary }}>
          {Icons.check}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-3 text-2xl font-bold text-white">Message Sent!</h3>

      {/* Description */}
      <p className="mb-8 max-w-sm text-white/60">
        Thank you for reaching out. We'll get back to you within 24 hours with a
        detailed response.
      </p>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="border px-6 py-3 text-sm font-medium transition-all duration-300"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${colors.primary}50`;
          e.currentTarget.style.color = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
        }}
      >
        Send Another Message
      </button>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CONTACT FORM
// ════════════════════════════════════════════════════════════════════

const ContactForm = memo(function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    website: "",
    industry: "",
    service: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Entrance animation
  useEffect(() => {
    if (!formRef.current) return;

    const formFields = formRef.current.querySelectorAll(".form-field");
    if (formFields.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        formFields,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.industry) {
      newErrors.industry = "Please select your industry";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitting(false);
      setIsSuccess(true);
    },
    [validateForm],
  );

  const handleReset = useCallback(() => {
    setFormData({
      fullName: "",
      email: "",
      website: "",
      industry: "",
      service: "",
      budget: "",
      message: "",
    });
    setErrors({});
    setIsSuccess(false);
  }, []);

  if (isSuccess) {
    return <SuccessMessage onReset={handleReset} />;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Name & Email */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="form-field" style={{ opacity: 0 }}>
          <FormInput
            label="Full Name"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
            icon={Icons.user}
          />
        </div>
        <div className="form-field" style={{ opacity: 0 }}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            icon={Icons.mail}
          />
        </div>
      </div>

      {/* Row 2: Website & Industry */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="form-field" style={{ opacity: 0 }}>
          <FormInput
            label="Business Website"
            name="website"
            placeholder="https://yourcompany.com (optional)"
            value={formData.website}
            onChange={handleChange}
            icon={Icons.globe}
          />
        </div>
        <div className="form-field" style={{ opacity: 0 }}>
          <FormSelect
            label="Business Type / Industry"
            name="industry"
            options={industryOptions}
            value={formData.industry}
            onChange={handleChange}
            error={errors.industry}
            required
            icon={Icons.briefcase}
          />
        </div>
      </div>

      {/* Row 3: Service & Budget */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="form-field" style={{ opacity: 0 }}>
          <FormSelect
            label="Service Needed"
            name="service"
            options={serviceOptions}
            value={formData.service}
            onChange={handleChange}
            error={errors.service}
            required
            icon={Icons.layers}
          />
        </div>
        <div className="form-field" style={{ opacity: 0 }}>
          <FormSelect
            label="Budget Range"
            name="budget"
            options={budgetOptions}
            value={formData.budget}
            onChange={handleChange}
            icon={Icons.wallet}
          />
        </div>
      </div>

      {/* Row 4: Message */}
      <div className="form-field" style={{ opacity: 0 }}>
        <FormTextarea
          label="Message"
          name="message"
          placeholder="Tell us about your project, goals, and any specific requirements..."
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          required
          icon={Icons.message}
          rows={5}
        />
      </div>

      {/* Submit Button */}
      <div className="form-field pt-2" style={{ opacity: 0 }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            backgroundColor: colors.primary,
            color: colors.dark,
          }}
        >
          {isSubmitting ? (
            <>
              <span
                className="h-5 w-5 animate-spin"
                style={{ color: colors.dark }}
              >
                {Icons.loader}
              </span>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span className="h-5 w-5">{Icons.send}</span>
              <span>Send Request</span>
              <span className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
                {Icons.arrow}
              </span>
            </>
          )}

          {/* Shine Effect */}
          <span className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>

      {/* Privacy Note */}
      <p
        className="form-field text-center text-xs text-white/40"
        style={{ opacity: 0 }}
      >
        By submitting this form, you agree to our{" "}
        <Link
          href="/privacy"
          className="underline transition-colors hover:text-white/60"
        >
          Privacy Policy
        </Link>
        . We'll never share your information.
      </p>
    </form>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const ContactSection: React.FC<ContactSectionProps> = ({
  headline = "Let's Talk About Your Project",
  description = "Tell us about your business and what you want to build. We'll respond within 24 hours with a clear plan and pricing estimate.",
  contactInfo = defaultContactInfo,
  socialLinks = defaultSocialLinks,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Header Animation
  useEffect(() => {
    if (!headerRef.current) return;

    const headerElements = headerRef.current.querySelectorAll(".header-anim");
    if (headerElements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: colors.dark }}
      id="contact"
    >
      <Background />

      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Header */}
        <div ref={headerRef} className="mb-12 text-center lg:mb-16">
          {/* Headline */}
          <h2 className="header-anim mb-6 text-3xl font-black text-white md:text-4xl lg:text-5xl">
            Let's Talk About{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Your Project
            </span>
          </h2>

          {/* Description */}
          <p className="header-anim mx-auto max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
            {description}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <div
              className="border p-6 md:p-8"
              style={{
                borderColor: "rgba(255,255,255,0.06)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <ContactForm />
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <ContactInfoCard
              contactInfo={contactInfo}
              socialLinks={socialLinks}
            />
          </div>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="pointer-events-none absolute left-8 top-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}40, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-px w-20"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}40, transparent)`,
          }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(0deg, ${colors.secondary}30, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-px w-20"
          style={{
            background: `linear-gradient(270deg, ${colors.secondary}30, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default memo(ContactSection);
export type { ContactSectionProps, ContactInfo, FormData };
