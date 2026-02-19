// components/contact/ContactHero.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "./ContactHero.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface Office {
  city: string;
  country: string;
  timezone: string;
  utcOffset: number;
  address: string;
  email: string;
  phone: string;
  coords: { lat: string; lon: string };
  status: "open" | "closed" | "soon";
}

interface Channel {
  id: string;
  label: string;
  sub: string;
  value: string;
  response: string;
  icon: React.ReactNode;
  accent: string;
  href: string;
}

interface FAQ {
  q: string;
  a: string;
}

/* ════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════ */
const OFFICES: Office[] = [
  {
    city: "San Francisco",
    country: "United States",
    timezone: "PST",
    utcOffset: -8,
    address: "450 Market St, Suite 1200",
    email: "us@axon.systems",
    phone: "+1 (415) 000-0000",
    coords: { lat: "37.77°N", lon: "122.41°W" },
    status: "open",
  },
  {
    city: "London",
    country: "United Kingdom",
    timezone: "GMT",
    utcOffset: 0,
    address: "1 Canada Square, Canary Wharf",
    email: "eu@axon.systems",
    phone: "+44 20 0000 0000",
    coords: { lat: "51.50°N", lon: "0.12°W" },
    status: "open",
  },
  {
    city: "Singapore",
    country: "Singapore",
    timezone: "SGT",
    utcOffset: 8,
    address: "1 Raffles Place, Tower 1",
    email: "apac@axon.systems",
    phone: "+65 0000 0000",
    coords: { lat: "1.28°N", lon: "103.85°E" },
    status: "closed",
  },
  {
    city: "Berlin",
    country: "Germany",
    timezone: "CET",
    utcOffset: 1,
    address: "Unter den Linden 77",
    email: "de@axon.systems",
    phone: "+49 30 0000 0000",
    coords: { lat: "52.52°N", lon: "13.40°E" },
    status: "soon",
  },
];

const CHANNELS: Channel[] = [
  {
    id: "sales",
    label: "Talk to Sales",
    sub: "Enterprise & custom pricing",
    value: "sales@axon.systems",
    response: "< 2 hours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h4l4 4 4-4h4a2 2 0 002-2V9a2 2 0 00-2-2z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <line
          x1="8"
          y1="11"
          x2="8"
          y2="11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="11"
          x2="12"
          y2="11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="11"
          x2="16"
          y2="11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: "#30C0C0",
    href: "mailto:sales@axon.systems",
  },
  {
    id: "support",
    label: "Technical Support",
    sub: "For existing customers",
    value: "support@axon.systems",
    response: "< 15 min (P0)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="12" cy="17" r="0.8" fill="currentColor" />
      </svg>
    ),
    accent: "#30A0D0",
    href: "mailto:support@axon.systems",
  },
  {
    id: "press",
    label: "Press & Media",
    sub: "Interviews & partnerships",
    value: "press@axon.systems",
    response: "< 24 hours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M7 8h10M7 12h6M7 16h4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: "#30C0A0",
    href: "mailto:press@axon.systems",
  },
  {
    id: "security",
    label: "Security Reports",
    sub: "Responsible disclosure",
    value: "security@axon.systems",
    response: "< 1 hour",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M12 2L4 5v7c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: "#C09030",
    href: "mailto:security@axon.systems",
  },
];

const QUICK_FAQS: FAQ[] = [
  {
    q: "How fast will you respond?",
    a: "Sales & support inquiries get a response within 2 hours during business hours. P0 incidents: under 15 minutes, guaranteed.",
  },
  {
    q: "Do you offer NDA before demos?",
    a: "Yes. We can execute a mutual NDA before any technical discussion. Just mention it in your message and we'll send it over within the hour.",
  },
  {
    q: "Can I talk to an engineer, not sales?",
    a: "Absolutely. Just select Technical Support or mention it in your inquiry. We'll route you directly to a senior engineer.",
  },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "#",
    followers: "4.2k",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    followers: "12.1k",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    followers: "8.9k",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    followers: "3.4k",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
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
        className="absolute inset-0 rounded-full"
        style={{
          background: `${color}44`,
          animation: "chPing 2s cubic-bezier(0,0,.2,1) infinite",
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
      style={{ borderColor: "rgba(48,192,192,0.35)" }}
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
   LIVE CLOCK PER OFFICE
════════════════════════════════════════ */
const OfficeTime = ({
  utcOffset,
  timezone,
}: {
  utcOffset: number;
  timezone: string;
}) => {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const local = new Date(utc + utcOffset * 3600000);
      setTime(
        local.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [utcOffset]);

  return (
    <span
      className="font-mono text-[11px] tabular-nums"
      style={{ color: "#30C0C0", letterSpacing: "0.05em" }}
    >
      {time} <span style={{ color: "#1E4058", fontSize: 9 }}>{timezone}</span>
    </span>
  );
};

/* ════════════════════════════════════════
   OFFICE STATUS BADGE
════════════════════════════════════════ */
const StatusBadge = ({ status }: { status: Office["status"] }) => {
  const map = {
    open: { color: "#30C0A0", label: "Open now", pulse: true },
    closed: { color: "#C06060", label: "Closed", pulse: false },
    soon: { color: "#C09030", label: "Coming soon", pulse: false },
  };
  const s = map[status];
  return (
    <div className="flex items-center gap-1.5">
      <TealDot size={5} color={s.color} pulse={s.pulse} />
      <span
        className="font-mono text-[8.5px] tracking-[0.14em] uppercase"
        style={{ color: s.color }}
      >
        {s.label}
      </span>
    </div>
  );
};

/* ════════════════════════════════════════
   OFFICE CARD
════════════════════════════════════════ */
const OfficeCard = ({
  office,
  active,
  onClick,
}: {
  office: Office;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    className={`${styles.officeCard} ${active ? styles.officeCardActive : ""} relative w-full text-left`}
    onClick={onClick}
    aria-pressed={active}
    aria-label={`Office in ${office.city}`}
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    <div
      className={styles.officeCardStripe}
      style={{ opacity: active ? 1 : 0 }}
      aria-hidden="true"
    />

    <div className="p-4 flex flex-col gap-3">
      {/* top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span
            className="font-mono text-[13px] leading-none"
            style={{
              color: active ? "#C0DDE8" : "#3A6878",
              transition: "color 0.3s",
              letterSpacing: "0.04em",
            }}
          >
            {office.city}
          </span>
          <span
            className="font-mono text-[8.5px] tracking-[0.15em] uppercase"
            style={{ color: "#1A3848" }}
          >
            {office.country}
          </span>
        </div>
        <OfficeTime utcOffset={office.utcOffset} timezone={office.timezone} />
      </div>

      <StatusBadge status={office.status} />

      {/* address */}
      <div
        className="flex flex-col gap-0.5"
        style={{ borderTop: "1px solid #0A1624", paddingTop: 8, marginTop: 2 }}
      >
        <span
          className="font-mono text-[9.5px] leading-snug"
          style={{ color: "#1E3848" }}
        >
          {office.address}
        </span>
        <span className="font-mono text-[9px]" style={{ color: "#1A3040" }}>
          {office.coords.lat} · {office.coords.lon}
        </span>
      </div>
    </div>
  </button>
);

/* ════════════════════════════════════════
   OFFICE DETAIL PANEL
════════════════════════════════════════ */
const OfficeDetail = ({ office }: { office: Office }) => (
  <div className={`${styles.officeDetail} relative flex flex-col gap-5 p-6`}>
    <Bracket pos="tl" />
    <Bracket pos="tr" />
    <Bracket pos="bl" />
    <Bracket pos="br" />

    {/* scan top */}
    <div className={styles.scanLine} aria-hidden="true" />

    {/* header */}
    <div className="flex items-start justify-between flex-wrap gap-3">
      <div className="flex flex-col gap-1">
        <SectionLabel>Office details</SectionLabel>
        <h3
          className="font-mono text-[22px] mt-2"
          style={{ color: "#B8D8E4", letterSpacing: "0.02em" }}
        >
          {office.city}
          <span className="text-[14px] ml-2" style={{ color: "#1E4058" }}>
            / {office.country}
          </span>
        </h3>
      </div>
      <StatusBadge status={office.status} />
    </div>

    {/* contact details grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        { label: "Address", value: office.address, icon: "📍" },
        {
          label: "Email",
          value: office.email,
          href: `mailto:${office.email}`,
          icon: "✉",
        },
        {
          label: "Phone",
          value: office.phone,
          href: `tel:${office.phone}`,
          icon: "☏",
        },
        {
          label: "Coordinates",
          value: `${office.coords.lat}, ${office.coords.lon}`,
          icon: "🌐",
        },
      ].map((item) => (
        <div
          key={item.label}
          className={`${styles.detailItem} relative p-3 flex gap-3`}
        >
          <Bracket pos="tl" />
          <span className="text-[14px] shrink-0 mt-0.5" aria-hidden="true">
            {item.icon}
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="font-mono text-[8px] tracking-[0.2em] uppercase"
              style={{ color: "#1A3848" }}
            >
              {item.label}
            </span>
            {item.href ? (
              <a
                href={item.href}
                className="font-mono text-[11px] leading-snug hover:text-[#30C0C0] transition-colors truncate"
                style={{ color: "#3A6878", textDecoration: "none" }}
              >
                {item.value}
              </a>
            ) : (
              <span
                className="font-mono text-[11px] leading-snug"
                style={{ color: "#3A6878" }}
              >
                {item.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* local time display */}
    <div className={`${styles.timeDisplay} flex items-center gap-4 p-4`}>
      <div className="flex flex-col gap-0.5">
        <span
          className="font-mono text-[8.5px] tracking-[0.2em] uppercase"
          style={{ color: "#1A3848" }}
        >
          Local time
        </span>
        <OfficeTime utcOffset={office.utcOffset} timezone={office.timezone} />
      </div>
      <div className={styles.timeDivider} aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        <span
          className="font-mono text-[8.5px] tracking-[0.2em] uppercase"
          style={{ color: "#1A3848" }}
        >
          Business hours
        </span>
        <span className="font-mono text-[11px]" style={{ color: "#3A6878" }}>
          09:00 – 18:00 {office.timezone}
        </span>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════
   CHANNEL CARD
════════════════════════════════════════ */
const ChannelCard = ({
  channel,
  index,
}: {
  channel: Channel;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={channel.href}
      className={`${styles.channelCard} relative flex items-start gap-4 p-5`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={`${channel.label}: ${channel.value}`}
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />
      <div
        className={styles.channelGlow}
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(ellipse 80% 80% at 0% 50%, ${channel.accent}10, transparent)`,
        }}
        aria-hidden="true"
      />
      <div
        className={styles.channelStripe}
        style={{
          opacity: hovered ? 1 : 0,
          background: `linear-gradient(to bottom, transparent, ${channel.accent}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* icon */}
      <div
        className="flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          width: 44,
          height: 44,
          border: `1px solid ${hovered ? `${channel.accent}50` : "#0E1E30"}`,
          borderRadius: 2,
          background: hovered ? `${channel.accent}0A` : "rgba(6,12,22,0.8)",
          color: hovered ? channel.accent : "#1E4058",
        }}
      >
        {channel.icon}
      </div>

      {/* content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <span
            className="font-mono text-[13px] leading-snug"
            style={{
              color: hovered ? "#C0DDE8" : "#4A7A8A",
              transition: "color 0.3s",
              letterSpacing: "0.03em",
            }}
          >
            {channel.label}
          </span>
          <span
            className="font-mono text-[8px] tracking-[0.12em] px-1.5 py-0.5 shrink-0"
            style={{
              color: channel.accent,
              border: `1px solid ${channel.accent}30`,
              background: `${channel.accent}0A`,
              borderRadius: 2,
            }}
          >
            {channel.response}
          </span>
        </div>
        <span
          className="font-mono text-[9.5px] tracking-widest"
          style={{ color: "#1A3848" }}
        >
          {channel.sub}
        </span>
        <span
          className="font-mono text-[10.5px] mt-1"
          style={{
            color: hovered ? channel.accent : "#1E4060",
            transition: "color 0.3s",
            letterSpacing: "0.04em",
          }}
        >
          {channel.value}
        </span>
      </div>

      {/* arrow */}
      <div
        className="shrink-0 self-center opacity-0 transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0, color: channel.accent }}
      >
        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
          <path
            d="M2 6h8M6 2l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </a>
  );
};

/* ════════════════════════════════════════
   QUICK FAQ ACCORDION
════════════════════════════════════════ */
const QuickFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={`${styles.faqPanel} relative flex flex-col`}>
      <Bracket pos="tl" />
      <Bracket pos="br" />
      <div
        className="flex items-center gap-2.5 px-5 py-4"
        style={{ borderBottom: "1px solid #0A1624" }}
      >
        <TealDot size={4} />
        <span
          className="font-mono text-[9.5px] tracking-[0.2em] uppercase"
          style={{ color: "#30C0C0", opacity: 0.8 }}
        >
          Quick answers
        </span>
      </div>
      {QUICK_FAQS.map((faq, i) => (
        <div
          key={i}
          style={{
            borderBottom:
              i < QUICK_FAQS.length - 1 ? "1px solid #08121E" : "none",
          }}
        >
          <button
            className={`${styles.faqBtn} w-full flex items-start gap-3 px-5 py-4 text-left`}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span
              className="font-mono text-[9px] tracking-[0.12em] shrink-0 mt-0.5"
              style={{ color: open === i ? "#30C0C0" : "#1E3848" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="flex-1 font-mono text-[11.5px] leading-snug"
              style={{
                color: open === i ? "#A8D8E0" : "#3A6878",
                transition: "color 0.25s",
              }}
            >
              {faq.q}
            </span>
            <span
              style={{
                color: "#1E4058",
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.25s",
                flexShrink: 0,
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              +
            </span>
          </button>
          <div
            style={{
              maxHeight: open === i ? "200px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div className="px-5 pb-4 pl-14">
              <p
                className="font-mono text-[11px] leading-relaxed"
                style={{ color: "#2A5060", letterSpacing: "0.03em" }}
              >
                {faq.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   GLOBAL STATUS TICKER
════════════════════════════════════════ */
const StatusTicker = () => {
  const items = [
    "All systems operational",
    "API latency: 18ms avg",
    "99.98% uptime — 30 days",
    "38 edge regions active",
    "SOC 2 Type II certified",
    "P0 response: < 15 min",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % items.length), 3000);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <div
      className={`${styles.ticker} flex items-center gap-3`}
      aria-live="polite"
      aria-atomic="true"
    >
      <TealDot size={4} color="#30C0A0" pulse />
      <div className={styles.tickerText}>
        <span
          key={idx}
          className={styles.tickerItem}
          style={{ color: "#2A5868" }}
        >
          {items[idx]}
        </span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   SOCIAL CARD
════════════════════════════════════════ */
const SocialCard = ({ link }: { link: (typeof SOCIAL_LINKS)[0] }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={link.href}
      className={`${styles.socialCard} relative flex items-center justify-between gap-3 p-3`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${link.label} — ${link.followers} followers`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />
      <div className="flex items-center gap-2.5">
        <span
          style={{
            color: hovered ? "#30C0C0" : "#1E4058",
            transition: "color 0.25s",
          }}
        >
          {link.icon}
        </span>
        <span
          className="font-mono text-[10.5px]"
          style={{
            color: hovered ? "#7AAABB" : "#2A5060",
            transition: "color 0.25s",
          }}
        >
          {link.label}
        </span>
      </div>
      <span
        className="font-mono text-[9px] tracking-widest"
        style={{ color: "#1A3040" }}
      >
        {link.followers}
      </span>
    </a>
  );
};

/* ════════════════════════════════════════
   WORLD CLOCK STRIP
════════════════════════════════════════ */
const WorldClockStrip = () => {
  const zones = [
    { label: "SF", utc: -8 },
    { label: "NY", utc: -5 },
    { label: "LON", utc: 0 },
    { label: "BER", utc: 1 },
    { label: "DXB", utc: 4 },
    { label: "SGP", utc: 8 },
    { label: "TOK", utc: 9 },
  ];
  const [times, setTimes] = useState<string[]>(zones.map(() => "--:--"));

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      setTimes(
        zones.map((z) => {
          const local = new Date(utcMs + z.utc * 3600000);
          return local.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`${styles.worldClock} flex items-center gap-0 overflow-x-auto`}
      aria-label="World clock"
    >
      {zones.map((z, i) => (
        <div
          key={z.label}
          className={`${styles.clockItem} flex flex-col items-center gap-0.5 px-3 py-2 shrink-0`}
          style={{
            borderRight: i < zones.length - 1 ? "1px solid #0A1624" : "none",
          }}
        >
          <span
            className="font-mono text-[7.5px] tracking-[0.2em] uppercase"
            style={{ color: "#1A3040" }}
          >
            {z.label}
          </span>
          <span
            className="font-mono text-[10px] tabular-nums"
            style={{ color: "#2A5868" }}
          >
            {times[i]}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ContactHero() {
  const [activeOffice, setActiveOffice] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.04 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="contact-hero-heading"
    >
      {/* ── bg ── */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.topLine} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-24 lg:py-32">
        {/* ══ HERO HEADER ══ */}
        <div
          className={`${styles.heroHeader} ${revealed ? styles.revealed : ""} mb-14`}
        >
          {/* status ticker */}
          <StatusTicker />

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-5">
            <h1
              id="contact-hero-heading"
              className="font-mono leading-[1.05] max-w-3xl"
              style={{
                fontSize: "clamp(32px,5.5vw,68px)",
                color: "#B8D8E4",
                letterSpacing: "-0.025em",
              }}
            >
              We're a message
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 50px rgba(48,192,192,0.5)",
                }}
              >
                away.
              </span>
            </h1>

            <div className="flex flex-col gap-4 max-w-sm">
              <p
                className="font-mono text-[12px] leading-[1.8]"
                style={{ color: "#2A5060", letterSpacing: "0.04em" }}
              >
                Real engineers. Real responses. No ticket queues, no bots, no
                runaround. Just direct access to the people who built the
                platform.
              </p>
              {/* world clock */}
              <WorldClockStrip />
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ CHANNELS ROW ══ */}
        <div
          className={`${styles.channelsBlock} ${revealed ? styles.revealed : ""} mb-12`}
          style={{ transitionDelay: "0.1s" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.25em] uppercase"
              style={{ color: "#1A3848" }}
            >
              Contact channels
            </span>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
            role="list"
            aria-label="Contact channels"
          >
            {CHANNELS.map((ch, i) => (
              <div key={ch.id} role="listitem">
                <ChannelCard channel={ch} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* ══ OFFICES + SIDE PANELS ══ */}
        <div
          className={`${styles.officesBlock} ${revealed ? styles.revealed : ""} grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 mb-12`}
          style={{ transitionDelay: "0.18s" }}
        >
          {/* offices */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-1">
              <TealDot size={4} />
              <span
                className="font-mono text-[9px] tracking-[0.25em] uppercase"
                style={{ color: "#1A3848" }}
              >
                Global offices
              </span>
            </div>
            {/* office grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              role="list"
              aria-label="Global offices"
            >
              {OFFICES.map((office, i) => (
                <div key={office.city} role="listitem">
                  <OfficeCard
                    office={office}
                    active={activeOffice === i}
                    onClick={() => setActiveOffice(i)}
                  />
                </div>
              ))}
            </div>
            {/* detail panel */}
            <OfficeDetail office={OFFICES[activeOffice]} />
          </div>

          {/* right side panels */}
          <div className="flex flex-col gap-4">
            {/* quick FAQ */}
            <QuickFAQ />

            {/* social */}
            <div className={`${styles.socialPanel} relative flex flex-col`}>
              <Bracket pos="tl" />
              <Bracket pos="br" />
              <div
                className="flex items-center gap-2.5 px-5 py-4"
                style={{ borderBottom: "1px solid #0A1624" }}
              >
                <TealDot size={4} />
                <span
                  className="font-mono text-[9.5px] tracking-[0.2em] uppercase"
                  style={{ color: "#30C0C0", opacity: 0.8 }}
                >
                  Follow & connect
                </span>
              </div>
              <div className="flex flex-col gap-0 p-2">
                {SOCIAL_LINKS.map((s) => (
                  <SocialCard key={s.label} link={s} />
                ))}
              </div>
            </div>

            {/* emergency contact */}
            <div
              className={`${styles.emergencyCard} relative flex flex-col gap-3 p-5`}
            >
              <Bracket pos="tl" />
              <Bracket pos="br" />
              <div className={styles.emergencyTopLine} aria-hidden="true" />
              <div className="flex items-center gap-2">
                <TealDot size={5} color="#C06060" pulse />
                <span
                  className="font-mono text-[9.5px] tracking-[0.2em] uppercase"
                  style={{ color: "#C06060", opacity: 0.9 }}
                >
                  P0 Emergency
                </span>
              </div>
              <p
                className="font-mono text-[11px] leading-relaxed"
                style={{ color: "#2A4050", letterSpacing: "0.02em" }}
              >
                Critical incident? Skip the form. Call our 24/7 emergency line
                directly.
              </p>
              <a
                href="tel:+18005550000"
                className={`${styles.emergencyBtn} relative flex items-center justify-center gap-2`}
              >
                <Bracket pos="tl" />
                <Bracket pos="br" />
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                >
                  <path
                    d="M13 9.5v2a1.02 1.02 0 01-1.1 1A12.87 12.87 0 01.9 2.1 1.02 1.02 0 011.9.9L3.5 1a1 1 0 011 .85c.11.7.32 1.38.62 2.02a1 1 0 01-.22 1.05l-.8.8A8 8 0 008.57 9.8l.8-.8a1 1 0 011.05-.23 9.1 9.1 0 002.01.62A1 1 0 0113 10.5v-.9"
                    stroke="#C06060"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "#C06060" }}
                >
                  +1 800 555 0000
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ══ BOTTOM STRIP ══ */}
        <div
          className={`${styles.bottomStrip} ${revealed ? styles.revealed : ""} flex items-center gap-4`}
          style={{ transitionDelay: "0.25s" }}
        >
          <div className="flex items-center gap-2.5">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase"
              style={{ color: "#1E4858" }}
            >
              4 offices · 12 countries · 140+ team members
            </span>
          </div>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(24,56,88,0.4), rgba(48,192,192,0.1), rgba(24,56,88,0.4))",
            }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-2.5">
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Always on · Never a bot
            </span>
            <TealDot size={4} />
          </div>
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes chPing { 75%, 100% { transform: scale(2.4); opacity: 0; } }
      `}</style>
    </section>
  );
}
