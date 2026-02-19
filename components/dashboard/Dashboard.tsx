// components/dashboard/Dashboard.tsx
"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from "react";
import styles from "./Dashboard.module.css";

/* ════════════════════════════════════════
   THEME SYSTEM
════════════════════════════════════════ */
type Theme = "dark" | "light";

interface ThemeTokens {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  borderAccent: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
  gridLine: string;
  shadowColor: string;
}

const DARK_TOKENS: ThemeTokens = {
  bg: "#060810",
  bgSecondary: "#080C14",
  bgTertiary: "#0A1020",
  surface: "rgba(7,13,24,0.85)",
  surfaceHover: "rgba(12,22,38,0.9)",
  border: "#0C1828",
  borderStrong: "#112030",
  borderAccent: "rgba(48,192,192,0.25)",
  text: "#B8D8E4",
  textMuted: "#3A6878",
  textFaint: "#1A3848",
  accent: "#30C0C0",
  accentDim: "rgba(48,192,192,0.08)",
  accentGlow: "rgba(48,192,192,0.3)",
  gridLine: "rgba(24,56,88,0.05)",
  shadowColor: "rgba(0,0,0,0.5)",
};

const LIGHT_TOKENS: ThemeTokens = {
  bg: "#F0F4F8",
  bgSecondary: "#E8EFF5",
  bgTertiary: "#DDE6EF",
  surface: "rgba(255,255,255,0.92)",
  surfaceHover: "rgba(240,247,255,0.98)",
  border: "#C8D8E8",
  borderStrong: "#A8C0D4",
  borderAccent: "rgba(14,120,140,0.35)",
  text: "#1A3848",
  textMuted: "#3A6878",
  textFaint: "#7AAABB",
  accent: "#0E7890",
  accentDim: "rgba(14,120,140,0.08)",
  accentGlow: "rgba(14,120,140,0.2)",
  gridLine: "rgba(14,120,140,0.06)",
  shadowColor: "rgba(14,40,70,0.12)",
};

/* ════════════════════════════════════════
   CONTEXT
════════════════════════════════════════ */
interface DashCtxType {
  theme: Theme;
  tokens: ThemeTokens;
  toggleTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  sidebarCollapsed: boolean;
  toggleCollapsed: () => void;
  activeItem: string;
  setActiveItem: (id: string) => void;
}

const DashCtx = createContext<DashCtxType>({} as DashCtxType);
const useDash = () => useContext(DashCtx);

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: "default" | "danger" | "warning";
  children?: NavItem[];
  section: string;
}

interface MetricData {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sub: string;
  accentColor: string;
  sparkData: number[];
}

interface ActivityItem {
  id: string;
  message: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
}

interface ServiceHealth {
  name: string;
  uptime: string;
  latency: string;
  status: "operational" | "degraded" | "outage";
  load: number;
}

/* ════════════════════════════════════════
   ICONS
════════════════════════════════════════ */
const Icons = {
  overview: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <rect
        x="2"
        y="2"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="11"
        y="2"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="2"
        y="11"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="11"
        y="11"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  ),
  edge: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3" />
      <line
        x1="10"
        y1="2.5"
        x2="10"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="13"
        x2="10"
        y2="17.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="2.5"
        y1="10"
        x2="7"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="10"
        x2="17.5"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M10 2L3 5v5c0 4 3 7 7 8 4-1 7-4 7-8V5l-7-3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <polyline
        points="2,16 7,9 11,13 18,5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <rect
        x="2"
        y="3"
        width="16"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="2"
        y="12"
        width="16"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="15" cy="5.5" r="1" fill="currentColor" />
      <circle cx="15" cy="14.5" r="1" fill="currentColor" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2 17c0-3 2.7-5 6-5s6 2 6 5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M14 7c1.1.6 2 1.8 2 3M16 17c0-1.5-.8-2.8-2-3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M10 2a6 6 0 00-6 6v3l-1.5 2h15L16 11V8a6 6 0 00-6-6z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  vault: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <rect
        x="2"
        y="4"
        width="16"
        height="13"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="10"
        cy="10.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <line
        x1="10"
        y1="2"
        x2="10"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  pipeline: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <circle cx="4" cy="10" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="15" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.3" />
      <line
        x1="6"
        y1="10"
        x2="8.2"
        y2="6.8"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="6"
        y1="10"
        x2="8.2"
        y2="13.2"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="11.8"
        y1="6.8"
        x2="14"
        y2="10"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="11.8"
        y1="13.2"
        x2="14"
        y2="10"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  ),
  logs: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M4 5h12M4 9h8M4 13h10M4 17h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  billing: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <rect
        x="2"
        y="5"
        width="16"
        height="11"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <line
        x1="2"
        y1="9"
        x2="18"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="6" cy="13" r="1" fill="currentColor" />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 8c0-1.1.9-2 2-2s2 .9 2 2c0 1-1 1.5-1.5 2C10.2 10.3 10 10.7 10 11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14" r="0.8" fill="currentColor" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
      <path
        d="M3 4.5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <line
        x1="3"
        y1="6"
        x2="17"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="10"
        x2="17"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="14"
        x2="17"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  collapseLeft: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M13 4l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  collapseRight: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M7 4l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M13.5 13.5L17 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M4 10a6 6 0 016-6 6 6 0 014.5 2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M16 10a6 6 0 01-6 6 6 6 0 01-4.5-2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M14.5 5.5l.5-2.5 2.5 1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.3" />
      <line
        x1="10"
        y1="2"
        x2="10"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="16"
        x2="10"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="10"
        x2="4"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="10"
        x2="18"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="4.2"
        y1="4.2"
        x2="5.6"
        y2="5.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="14.4"
        y1="14.4"
        x2="15.8"
        y2="15.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="4.2"
        y1="15.8"
        x2="5.6"
        y2="14.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="14.4"
        y1="5.6"
        x2="15.8"
        y2="4.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M10 3a7 7 0 000 14 7 7 0 006-10.5A5.5 5.5 0 0110 3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  ),
  externalLink: (
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
      <path
        d="M5 3H3a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1V7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M7.5 2h2.5v2.5M10 2L6 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  trendUp: (
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
      <path
        d="M2 9l3-3 2 2 3-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4h2v2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  trendDown: (
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
      <path
        d="M2 3l3 3 2-2 3 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8h2V6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/* ════════════════════════════════════════
   NAV DATA
════════════════════════════════════════ */
const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: Icons.overview, section: "MAIN" },
  {
    id: "edge",
    label: "Edge Compute",
    icon: Icons.edge,
    badge: "38",
    section: "SERVICES",
    children: [
      {
        id: "edge-regions",
        label: "Regions",
        icon: Icons.edge,
        section: "SERVICES",
      },
      {
        id: "edge-functions",
        label: "Functions",
        icon: Icons.edge,
        section: "SERVICES",
      },
      {
        id: "edge-deployments",
        label: "Deployments",
        icon: Icons.edge,
        section: "SERVICES",
      },
    ],
  },
  {
    id: "security",
    label: "Threat Shield",
    icon: Icons.shield,
    badge: "3",
    badgeVariant: "danger",
    section: "SERVICES",
  },
  {
    id: "observe",
    label: "Observe & Trace",
    icon: Icons.chart,
    section: "SERVICES",
  },
  { id: "servers", label: "Servers", icon: Icons.server, section: "SERVICES" },
  {
    id: "pipeline",
    label: "Data Pipeline",
    icon: Icons.pipeline,
    section: "SERVICES",
  },
  {
    id: "vault",
    label: "Vault & Secrets",
    icon: Icons.vault,
    section: "SERVICES",
  },
  {
    id: "users",
    label: "Users",
    icon: Icons.users,
    badge: "12",
    section: "MANAGE",
  },
  { id: "billing", label: "Billing", icon: Icons.billing, section: "MANAGE" },
  { id: "logs", label: "Audit Logs", icon: Icons.logs, section: "MANAGE" },
  {
    id: "settings",
    label: "Settings",
    icon: Icons.settings,
    section: "SYSTEM",
  },
  { id: "help", label: "Help & Docs", icon: Icons.help, section: "SYSTEM" },
];

const NAV_SECTIONS = ["MAIN", "SERVICES", "MANAGE", "SYSTEM"];

/* ════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════ */
const METRICS: MetricData[] = [
  {
    id: "m1",
    label: "API Requests",
    value: "4.2B",
    delta: "+12.4%",
    deltaPositive: true,
    sub: "vs last 30 days",
    accentColor: "#30C0C0",
    sparkData: [42, 55, 49, 63, 71, 65, 78, 72, 85, 90, 83, 97],
  },
  {
    id: "m2",
    label: "Avg Latency",
    value: "18ms",
    delta: "−3.1ms",
    deltaPositive: true,
    sub: "p99 global edge",
    accentColor: "#30A0D0",
    sparkData: [22, 20, 24, 18, 21, 17, 16, 19, 15, 18, 17, 18],
  },
  {
    id: "m3",
    label: "Error Rate",
    value: "0.03%",
    delta: "+0.01%",
    deltaPositive: false,
    sub: "5xx responses",
    accentColor: "#C09030",
    sparkData: [1, 3, 2, 4, 2, 5, 3, 2, 4, 3, 2, 3],
  },
  {
    id: "m4",
    label: "Active Users",
    value: "1,284",
    delta: "+8.7%",
    deltaPositive: true,
    sub: "last 24 hours",
    accentColor: "#30C0A0",
    sparkData: [
      900, 980, 1050, 1100, 1180, 1090, 1200, 1150, 1220, 1260, 1240, 1284,
    ],
  },
];

const ACTIVITIES: ActivityItem[] = [
  {
    id: "a1",
    message: "Edge function aurora-v2 deployed to 38 regions",
    time: "2m ago",
    status: "success",
  },
  {
    id: "a2",
    message: "DDoS pattern detected — auto-mitigated (Layer 4)",
    time: "8m ago",
    status: "warning",
  },
  {
    id: "a3",
    message: "New team member sara@acme.io added to workspace",
    time: "15m ago",
    status: "info",
  },
  {
    id: "a4",
    message: "Vault credential rotation completed — 44 services",
    time: "31m ago",
    status: "success",
  },
  {
    id: "a5",
    message: "Failed auth attempt — IP blocked: 45.32.x.x",
    time: "44m ago",
    status: "error",
  },
  {
    id: "a6",
    message: "Pipeline rollback initiated: v3.1.4 → v3.1.3",
    time: "1h ago",
    status: "warning",
  },
  {
    id: "a7",
    message: "SSL certificates auto-renewed for 12 domains",
    time: "2h ago",
    status: "success",
  },
];

const SERVICES_HEALTH: ServiceHealth[] = [
  {
    name: "Edge Compute",
    uptime: "99.99%",
    latency: "18ms",
    status: "operational",
    load: 62,
  },
  {
    name: "Mesh Network",
    uptime: "99.98%",
    latency: "4ms",
    status: "operational",
    load: 78,
  },
  {
    name: "Threat Shield",
    uptime: "100%",
    latency: "0.8ms",
    status: "operational",
    load: 44,
  },
  {
    name: "Data Pipeline",
    uptime: "99.91%",
    latency: "210ms",
    status: "degraded",
    load: 91,
  },
  {
    name: "Observe & Trace",
    uptime: "99.99%",
    latency: "22ms",
    status: "operational",
    load: 55,
  },
  {
    name: "Vault & Secrets",
    uptime: "100%",
    latency: "2ms",
    status: "operational",
    load: 30,
  },
];

/* ════════════════════════════════════════
   STATUS COLOR HELPER
════════════════════════════════════════ */
const STATUS_COLORS = {
  operational: {
    dot: "#30C0A0",
    text: "#30C0A0",
    bg: "rgba(48,192,160,0.08)",
    border: "rgba(48,192,160,0.2)",
    label: "Operational",
  },
  degraded: {
    dot: "#C09030",
    text: "#C09030",
    bg: "rgba(192,144,48,0.08)",
    border: "rgba(192,144,48,0.2)",
    label: "Degraded",
  },
  outage: {
    dot: "#C06060",
    text: "#C06060",
    bg: "rgba(192,96,96,0.08)",
    border: "rgba(192,96,96,0.2)",
    label: "Outage",
  },
};

const ACTIVITY_COLORS = {
  success: "#30C0A0",
  warning: "#C09030",
  error: "#C06060",
  info: "#30A0D0",
};

/* ════════════════════════════════════════
   PRIMITIVE ATOMS
════════════════════════════════════════ */
const Dot = ({
  size = 6,
  color = "#30C0C0",
  pulse = false,
}: {
  size?: number;
  color?: string;
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
          background: `${color}44`,
          animation: "dotPing 2s cubic-bezier(0,0,.2,1) infinite",
        }}
      />
    )}
    <span
      className="relative block rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size + 2}px ${color}`,
      }}
    />
  </span>
);

const Divider = ({ tokens }: { tokens: ThemeTokens }) => (
  <div style={{ height: 1, background: tokens.border }} aria-hidden="true" />
);

/* ════════════════════════════════════════
   SPARKLINE
════════════════════════════════════════ */
const Sparkline = ({
  data,
  color,
  height = 40,
}: {
  data: number[];
  color: string;
  height?: number;
}) => {
  const W = 100;
  const H = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 6) - 3;
    return [x, y] as [number, number];
  });

  // smooth path
  const path = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = pts[i - 1];
    const cpx = (px + x) / 2;
    return `${acc} C${cpx},${py} ${cpx},${y} ${x},${y}`;
  }, "");

  const lastPt = pts[pts.length - 1];
  const firstPt = pts[0];
  const areaPath = `${path} L${lastPt[0]},${H} L${firstPt[0]},${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`spark-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${color.replace("#", "")})`} />
      <path
        d={path}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {lastPt && <circle cx={lastPt[0]} cy={lastPt[1]} r="2" fill={color} />}
    </svg>
  );
};

/* ════════════════════════════════════════
   LOAD BAR
════════════════════════════════════════ */
const LoadBar = ({ value, tokens }: { value: number; tokens: ThemeTokens }) => {
  const color = value > 85 ? "#C09030" : value > 65 ? "#30A0D0" : tokens.accent;
  return (
    <div className="flex items-center gap-2 min-w-22.5">
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: tokens.border }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: `linear-gradient(to right, ${tokens.borderStrong}, ${color})`,
            boxShadow: `0 0 6px ${color}66`,
            borderRadius: 2,
            transition: "width 1.2s ease",
          }}
        />
      </div>
      <span
        className="font-mono text-[9px] shrink-0 w-8 text-right"
        style={{ color: value > 85 ? "#C09030" : tokens.textFaint }}
      >
        {value}%
      </span>
    </div>
  );
};

/* ════════════════════════════════════════
   BADGE
════════════════════════════════════════ */
const Badge = ({
  value,
  variant = "default",
  tokens,
}: {
  value: string | number;
  variant?: "default" | "danger" | "warning";
  tokens: ThemeTokens;
}) => {
  const styles = {
    default: {
      color: tokens.accent,
      bg: tokens.accentDim,
      border: tokens.borderAccent,
    },
    danger: {
      color: "#C06060",
      bg: "rgba(192,96,96,0.08)",
      border: "rgba(192,96,96,0.25)",
    },
    warning: {
      color: "#C09030",
      bg: "rgba(192,144,48,0.08)",
      border: "rgba(192,144,48,0.25)",
    },
  }[variant];

  return (
    <span
      className="font-mono text-[8px] tracking-widest px-1.5 py-0.5 rounded-sm shrink-0"
      style={{
        color: styles.color,
        background: styles.bg,
        border: `1px solid ${styles.border}`,
      }}
    >
      {value}
    </span>
  );
};

/* ════════════════════════════════════════
   ICON BUTTON
════════════════════════════════════════ */
const IconBtn = ({
  icon,
  label,
  onClick,
  active = false,
  tokens,
  size = 30,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  tokens: ThemeTokens;
  size?: number;
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={styles.iconBtn}
    style={{
      width: size,
      height: size,
      border: `1px solid ${active ? tokens.borderAccent : tokens.border}`,
      background: active ? tokens.accentDim : "transparent",
      color: active ? tokens.accent : tokens.textMuted,
    }}
  >
    {icon}
  </button>
);

/* ════════════════════════════════════════
   PANEL WRAPPER
════════════════════════════════════════ */
const Panel = ({
  children,
  tokens,
  className = "",
  style,
}: {
  children: React.ReactNode;
  tokens: ThemeTokens;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`${styles.panel} relative overflow-hidden ${className}`}
    style={{
      border: `1px solid ${tokens.border}`,
      background: tokens.surface,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: `0 2px 16px ${tokens.shadowColor}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ════════════════════════════════════════
   PANEL HEADER
════════════════════════════════════════ */
const PanelHeader = ({
  title,
  action,
  tokens,
  dotPulse = false,
}: {
  title: string;
  action?: React.ReactNode;
  tokens: ThemeTokens;
  dotPulse?: boolean;
}) => (
  <div
    className="flex items-center justify-between px-5 py-3.5"
    style={{ borderBottom: `1px solid ${tokens.border}` }}
  >
    <div className="flex items-center gap-2">
      <Dot size={5} color={tokens.accent} pulse={dotPulse} />
      <span
        className="font-mono text-[9.5px] tracking-[0.2em] uppercase"
        style={{ color: tokens.accent, opacity: 0.85 }}
      >
        {title}
      </span>
    </div>
    {action && <div>{action}</div>}
  </div>
);

/* ════════════════════════════════════════
   LOGO
════════════════════════════════════════ */
const Logo = ({
  collapsed,
  tokens,
}: {
  collapsed: boolean;
  tokens: ThemeTokens;
}) => (
  <div className="flex items-center gap-3 px-4 h-14 shrink-0">
    <div
      style={{
        width: 28,
        height: 28,
        flexShrink: 0,
        filter: `drop-shadow(0 0 8px ${tokens.accentGlow})`,
      }}
    >
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <defs>
          <radialGradient id="lgOrb" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#70E8E8" />
            <stop offset="55%" stopColor={tokens.accent} />
            <stop offset="100%" stopColor="#0B3848" stopOpacity="0" />
          </radialGradient>
          <filter id="lgGlow">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="14"
          cy="14"
          r="12"
          stroke={tokens.borderStrong}
          strokeWidth="0.6"
          strokeDasharray="2 4"
          fill="none"
          opacity="0.7"
        />
        <circle
          cx="14"
          cy="14"
          r="7"
          fill="url(#lgOrb)"
          filter="url(#lgGlow)"
        />
        <circle
          cx="14"
          cy="2"
          r="1.8"
          fill="#60DFDF"
          opacity="0.9"
          filter="url(#lgGlow)"
          style={{
            transformOrigin: "14px 14px",
            animation: "satOrbit 7s linear infinite",
          }}
        />
      </svg>
    </div>
    {!collapsed && (
      <div className="flex flex-col overflow-hidden">
        <span
          className="font-mono text-[13px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: tokens.text, lineHeight: 1 }}
        >
          AXON
        </span>
        <span
          className="font-mono text-[7.5px] tracking-[0.22em] uppercase mt-0.5"
          style={{ color: tokens.accent, opacity: 0.6 }}
        >
          SYS · ADMIN
        </span>
      </div>
    )}
  </div>
);

/* ════════════════════════════════════════
   NAV ITEM ROW
════════════════════════════════════════ */
const NavRow = ({
  item,
  depth = 0,
  collapsed,
  tokens,
}: {
  item: NavItem;
  depth?: number;
  collapsed: boolean;
  tokens: ThemeTokens;
}) => {
  const { activeItem, setActiveItem } = useDash();
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!item.children?.length;
  const isSelfActive = activeItem === item.id;
  const isChildActive = item.children?.some((c) => c.id === activeItem);
  const isActive = isSelfActive || isChildActive;

  const handleClick = () => {
    if (hasChildren) {
      setExpanded((p) => !p);
      if (!expanded) setActiveItem(item.id);
    } else {
      setActiveItem(item.id);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
        aria-current={isSelfActive && !hasChildren ? "page" : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        className={`${styles.navRow} w-full flex items-center gap-2.5 text-left`}
        style={{
          padding: depth > 0 ? "7px 10px 7px 20px" : "8px 10px",
          background: isActive ? tokens.accentDim : "transparent",
          borderLeft: `2px solid ${isActive ? tokens.accent : "transparent"}`,
          color: isActive ? tokens.accent : tokens.textMuted,
        }}
      >
        {/* icon */}
        <span
          className="shrink-0 flex items-center justify-center"
          style={{ color: "currentColor", opacity: isActive ? 1 : 0.7 }}
        >
          {item.icon}
        </span>

        {!collapsed && (
          <>
            <span
              className="flex-1 font-mono text-[11px] tracking-[0.05em] truncate"
              style={{ color: isActive ? tokens.text : tokens.textMuted }}
            >
              {item.label}
            </span>
            {item.badge !== undefined && (
              <Badge
                value={item.badge}
                variant={item.badgeVariant}
                tokens={tokens}
              />
            )}
            {hasChildren && (
              <span
                style={{
                  color: tokens.textFaint,
                  transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.25s ease",
                }}
              >
                {Icons.chevronDown}
              </span>
            )}
          </>
        )}
      </button>

      {/* children accordion */}
      {hasChildren && !collapsed && (
        <div
          style={{
            maxHeight: expanded ? `${item.children!.length * 38}px` : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {item.children!.map((child) => (
            <NavRow
              key={child.id}
              item={child}
              depth={1}
              collapsed={false}
              tokens={tokens}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════ */
const Sidebar = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleCollapsed,
    tokens,
    theme,
  } = useDash();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      search.trim()
        ? NAV_ITEMS.filter((i) =>
            i.label.toLowerCase().includes(search.toLowerCase()),
          )
        : NAV_ITEMS,
    [search],
  );

  return (
    <>
      {/* mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{
            background: "rgba(2,4,10,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          ${styles.sidebar}
          ${sidebarCollapsed ? styles.sidebarCollapsed : ""}
          ${sidebarOpen ? styles.sidebarOpen : ""}
        `}
        style={{
          background: tokens.surface,
          borderRight: `1px solid ${tokens.border}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        aria-label="Dashboard navigation"
      >
        {/* accent top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(to right, transparent, ${tokens.accentGlow}, transparent)`,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />

        {/* logo row */}
        <div
          className="flex items-center justify-between"
          style={{ borderBottom: `1px solid ${tokens.border}`, height: 56 }}
        >
          <Logo collapsed={sidebarCollapsed} tokens={tokens} />
          {!sidebarCollapsed && (
            <button
              onClick={toggleCollapsed}
              className={styles.collapseBtn}
              style={{ color: tokens.textFaint, marginRight: 12 }}
              aria-label="Collapse sidebar"
            >
              {Icons.collapseLeft}
            </button>
          )}
        </div>

        {/* search */}
        {!sidebarCollapsed && (
          <div
            className="px-3 py-2"
            style={{ borderBottom: `1px solid ${tokens.border}` }}
          >
            <div
              className="relative flex items-center"
              style={{
                border: `1px solid ${tokens.border}`,
                borderRadius: 2,
                background: tokens.bgTertiary,
              }}
            >
              <span
                className="absolute left-2.5 pointer-events-none"
                style={{ color: tokens.textFaint }}
              >
                {Icons.search}
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                aria-label="Search navigation"
                className={styles.searchInput}
                style={{
                  color: tokens.textMuted,
                  caretColor: tokens.accent,
                  paddingLeft: 30,
                }}
              />
            </div>
          </div>
        )}

        {/* nav items */}
        <nav className={`${styles.sidebarNav} flex-1 overflow-y-auto py-2`}>
          {NAV_SECTIONS.map((section) => {
            const items = filtered.filter((i) => i.section === section);
            if (!items.length) return null;
            return (
              <div key={section} className="mb-2">
                {!sidebarCollapsed && (
                  <p
                    className="font-mono text-[7.5px] tracking-[0.3em] uppercase px-4 py-1.5"
                    style={{ color: tokens.textFaint }}
                  >
                    {section}
                  </p>
                )}
                <div className={sidebarCollapsed ? "px-1.5" : "px-2"}>
                  {items.map((item) => (
                    <NavRow
                      key={item.id}
                      item={item}
                      collapsed={sidebarCollapsed}
                      tokens={tokens}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* expand btn when collapsed */}
        {sidebarCollapsed && (
          <div
            className="flex justify-center py-3"
            style={{ borderTop: `1px solid ${tokens.border}` }}
          >
            <button
              onClick={toggleCollapsed}
              className={styles.collapseBtn}
              style={{ color: tokens.textFaint }}
              aria-label="Expand sidebar"
            >
              {Icons.collapseRight}
            </button>
          </div>
        )}

        {/* user card */}
        {!sidebarCollapsed && (
          <div
            className="flex items-center gap-3 px-3 py-3"
            style={{ borderTop: `1px solid ${tokens.border}` }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 34,
                height: 34,
                border: `1px solid ${tokens.borderAccent}`,
                borderRadius: 2,
                background: tokens.accentDim,
                position: "relative",
              }}
            >
              <span
                className="font-mono text-[10px] font-semibold"
                style={{ color: tokens.accent }}
              >
                SA
              </span>
              <Dot
                size={5}
                color="#30C0A0"
                pulse
                style={
                  {
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                  } as React.CSSProperties
                }
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className="font-mono text-[10.5px] truncate"
                style={{ color: tokens.textMuted }}
              >
                Sara Admin
              </span>
              <span
                className="font-mono text-[8px] tracking-[0.14em] uppercase"
                style={{ color: tokens.textFaint }}
              >
                Super Admin
              </span>
            </div>
            <IconBtn
              icon={Icons.settings}
              label="User settings"
              tokens={tokens}
              size={26}
            />
          </div>
        )}
      </aside>
    </>
  );
};

/* ════════════════════════════════════════
   TOP BAR
════════════════════════════════════════ */
const TopBar = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeItem,
    tokens,
    theme,
    toggleTheme,
  } = useDash();
  const [notifOpen, setNotifOpen] = useState(false);
  const [time, setTime] = useState("--:--:--");
  const notifRef = useRef<HTMLDivElement>(null);

  const pageLabel = useMemo(() => {
    return (
      NAV_ITEMS.find((i) => i.id === activeItem)?.label ??
      NAV_ITEMS.flatMap((i) => i.children ?? []).find(
        (c) => c.id === activeItem,
      )?.label ??
      "Overview"
    );
  }, [activeItem]);

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const alertCount = ACTIVITIES.filter((a) => a.status !== "success").length;

  return (
    <header
      className={`${styles.topBar} flex items-center justify-between px-4 sm:px-6 gap-3`}
      style={{
        height: 56,
        background: tokens.surface,
        borderBottom: `1px solid ${tokens.border}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: `0 1px 0 ${tokens.border}`,
      }}
    >
      {/* left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          className={`${styles.iconBtn} lg:hidden`}
          style={{
            border: `1px solid ${tokens.border}`,
            color: tokens.textMuted,
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          {Icons.menu}
        </button>

        {/* breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span
            className="font-mono text-[10px] tracking-[0.16em] uppercase"
            style={{ color: tokens.textFaint }}
          >
            Dashboard
          </span>
          <span style={{ color: tokens.border }}>/</span>
          <span
            className="font-mono text-[10px] tracking-[0.12em]"
            style={{ color: tokens.accent }}
          >
            {pageLabel}
          </span>
        </div>
      </div>

      {/* right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* clock */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-sm"
          style={{
            border: `1px solid ${tokens.border}`,
            background: tokens.bgTertiary,
          }}
        >
          <Dot size={4} color={tokens.accent} pulse />
          <span
            className="font-mono text-[9px] tracking-[0.14em]"
            style={{
              color: tokens.textFaint,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            UTC {time}
          </span>
        </div>

        {/* refresh */}
        <IconBtn icon={Icons.refresh} label="Refresh data" tokens={tokens} />

        {/* theme toggle */}
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          style={{
            border: `1px solid ${tokens.borderAccent}`,
            background: tokens.accentDim,
            color: tokens.accent,
          }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span
            className={`${styles.themeIcon} ${theme === "dark" ? styles.themeIconActive : ""}`}
          >
            {Icons.moon}
          </span>
          <span
            className={`${styles.themeIcon} ${theme === "light" ? styles.themeIconActive : ""}`}
          >
            {Icons.sun}
          </span>
        </button>

        {/* notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className={`${styles.iconBtn} relative`}
            style={{
              border: `1px solid ${notifOpen ? tokens.borderAccent : tokens.border}`,
              background: notifOpen ? tokens.accentDim : "transparent",
              color: notifOpen ? tokens.accent : tokens.textMuted,
            }}
            onClick={() => setNotifOpen((p) => !p)}
            aria-label={`Notifications — ${alertCount} alerts`}
            aria-expanded={notifOpen}
            aria-haspopup="true"
          >
            {Icons.bell}
            {alertCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-mono text-[7px]"
                style={{
                  background: "#C06060",
                  color: "#fff",
                  boxShadow: "0 0 6px #C06060",
                }}
              >
                {alertCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className={styles.dropdown}
              style={{
                border: `1px solid ${tokens.borderStrong}`,
                background: tokens.surface,
                boxShadow: `0 16px 48px ${tokens.shadowColor}`,
              }}
              role="dialog"
              aria-label="Notifications"
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: `1px solid ${tokens.border}` }}
              >
                <span
                  className="font-mono text-[9.5px] tracking-[0.2em] uppercase"
                  style={{ color: tokens.accent }}
                >
                  Alerts
                </span>
                <IconBtn
                  icon={Icons.close}
                  label="Close notifications"
                  onClick={() => setNotifOpen(false)}
                  tokens={tokens}
                  size={24}
                />
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
                {ACTIVITIES.filter((a) => a.status !== "success")
                  .slice(0, 5)
                  .map((a) => (
                    <div
                      key={a.id}
                      className={styles.notifItem}
                      style={{ borderBottom: `1px solid ${tokens.border}` }}
                    >
                      <Dot size={5} color={ACTIVITY_COLORS[a.status]} />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-mono text-[10px] leading-snug"
                          style={{ color: tokens.textMuted }}
                        >
                          {a.message}
                        </p>
                        <p
                          className="font-mono text-[8px] mt-1"
                          style={{ color: tokens.textFaint }}
                        >
                          {a.time}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* avatar */}
        <div
          className="flex items-center justify-center cursor-pointer"
          style={{
            width: 32,
            height: 32,
            border: `1px solid ${tokens.borderAccent}`,
            borderRadius: 2,
            background: tokens.accentDim,
          }}
        >
          <span
            className="font-mono text-[9px] font-semibold"
            style={{ color: tokens.accent }}
          >
            SA
          </span>
        </div>
      </div>
    </header>
  );
};

/* ════════════════════════════════════════
   METRIC CARD
════════════════════════════════════════ */
const MetricCard = ({
  metric,
  tokens,
}: {
  metric: MetricData;
  tokens: ThemeTokens;
}) => {
  const [hovered, setHovered] = useState(false);
  const deltaColor = metric.deltaPositive ? "#30C0A0" : "#C06060";

  return (
    <Panel
      tokens={tokens}
      style={{
        transition: "border-color 0.25s, box-shadow 0.25s",
        borderColor: hovered ? tokens.borderAccent : tokens.border,
        boxShadow: hovered
          ? `0 4px 24px ${tokens.accentGlow}`
          : `0 2px 12px ${tokens.shadowColor}`,
      }}
      className="cursor-default"
    >
      <div
        className="p-5 flex flex-col gap-3"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* top row */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="font-mono text-[9px] tracking-[0.18em] uppercase"
            style={{ color: tokens.textFaint }}
          >
            {metric.label}
          </span>
          <span
            className="flex items-center gap-1 font-mono text-[8.5px] px-1.5 py-0.5 rounded-sm"
            style={{
              color: deltaColor,
              background: `${deltaColor}14`,
              border: `1px solid ${deltaColor}28`,
            }}
          >
            {metric.deltaPositive ? Icons.trendUp : Icons.trendDown}
            {metric.delta}
          </span>
        </div>

        {/* value */}
        <span
          className="font-mono font-semibold leading-none"
          style={{
            fontSize: "clamp(20px,2.8vw,28px)",
            color: metric.accentColor,
            letterSpacing: "-0.02em",
            textShadow: hovered ? `0 0 20px ${metric.accentColor}55` : "none",
            transition: "text-shadow 0.3s",
          }}
        >
          {metric.value}
        </span>

        {/* sparkline */}
        <div style={{ margin: "0 -2px" }}>
          <Sparkline
            data={metric.sparkData}
            color={metric.accentColor}
            height={36}
          />
        </div>

        {/* sub */}
        <span
          className="font-mono text-[8.5px] tracking-widest"
          style={{ color: tokens.textFaint }}
        >
          {metric.sub}
        </span>
      </div>
    </Panel>
  );
};

/* ════════════════════════════════════════
   ACTIVITY FEED
════════════════════════════════════════ */
const ActivityFeed = ({ tokens }: { tokens: ThemeTokens }) => (
  <Panel tokens={tokens} className="flex flex-col">
    <PanelHeader
      title="Activity Feed"
      tokens={tokens}
      dotPulse
      action={
        <span
          className="font-mono text-[8px] tracking-[0.14em] uppercase px-2 py-1 rounded-sm"
          style={{
            color: "#30C0A0",
            background: "rgba(48,192,160,0.08)",
            border: "1px solid rgba(48,192,160,0.2)",
          }}
        >
          Live
        </span>
      }
    />
    <div
      className="flex-1 overflow-y-auto"
      role="log"
      aria-label="Activity log"
      aria-live="polite"
    >
      {ACTIVITIES.map((a, i) => (
        <div
          key={a.id}
          className={styles.activityRow}
          style={{
            borderBottom:
              i < ACTIVITIES.length - 1 ? `1px solid ${tokens.border}` : "none",
          }}
        >
          <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
            <Dot size={6} color={ACTIVITY_COLORS[a.status]} />
            {i < ACTIVITIES.length - 1 && (
              <div
                style={{
                  width: 1,
                  flex: 1,
                  minHeight: 14,
                  background: tokens.border,
                }}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="flex-1 min-w-0 py-3.5 pl-3 pr-4">
            <p
              className="font-mono text-[10.5px] leading-snug"
              style={{ color: tokens.textMuted }}
            >
              {a.message}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: ACTIVITY_COLORS[a.status], opacity: 0.8 }}
              >
                {a.status}
              </span>
              <span style={{ color: tokens.border }}>·</span>
              <span
                className="font-mono text-[8px]"
                style={{ color: tokens.textFaint }}
              >
                {a.time}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

/* ════════════════════════════════════════
   SERVICE HEALTH TABLE
════════════════════════════════════════ */
const ServiceHealthTable = ({ tokens }: { tokens: ThemeTokens }) => (
  <Panel tokens={tokens} className="flex flex-col">
    <PanelHeader
      title="Service Health"
      tokens={tokens}
      action={
        <a
          href="#"
          className="flex items-center gap-1 font-mono text-[8.5px] tracking-[0.12em] uppercase"
          style={{ color: tokens.textFaint, textDecoration: "none" }}
        >
          Status page {Icons.externalLink}
        </a>
      }
    />
    <div className="overflow-x-auto">
      <table className="w-full" role="table" aria-label="Service health">
        <thead>
          <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
            {["Service", "Status", "Uptime", "Latency", "Load"].map((h) => (
              <th key={h} className="text-left px-5 py-2.5">
                <span
                  className="font-mono text-[8px] tracking-[0.2em] uppercase"
                  style={{ color: tokens.textFaint }}
                >
                  {h}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SERVICES_HEALTH.map((svc, i) => {
            const sc = STATUS_COLORS[svc.status];
            return (
              <tr
                key={svc.name}
                className={styles.tableRow}
                style={{
                  borderBottom:
                    i < SERVICES_HEALTH.length - 1
                      ? `1px solid ${tokens.border}`
                      : "none",
                }}
              >
                <td className="px-5 py-3.5">
                  <span
                    className="font-mono text-[10.5px]"
                    style={{ color: tokens.textMuted }}
                  >
                    {svc.name}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="flex items-center gap-1.5 w-fit font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-sm"
                    style={{
                      color: sc.text,
                      background: sc.bg,
                      border: `1px solid ${sc.border}`,
                    }}
                  >
                    <Dot size={4} color={sc.dot} />
                    {sc.label}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: tokens.textMuted }}
                  >
                    {svc.uptime}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: tokens.textMuted }}
                  >
                    {svc.latency}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <LoadBar value={svc.load} tokens={tokens} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Panel>
);

/* ════════════════════════════════════════
   QUICK STAT ROW
════════════════════════════════════════ */
const QuickStats = ({ tokens }: { tokens: ThemeTokens }) => {
  const stats = [
    {
      label: "Req/min",
      value: "72k",
      color: tokens.accent,
      data: [42, 58, 51, 67, 72, 65, 78, 74, 88, 92, 85, 97],
    },
    {
      label: "Latency p99",
      value: "18ms",
      color: "#30A0D0",
      data: [22, 19, 24, 18, 20, 17, 16, 18, 15, 19, 17, 18],
    },
    {
      label: "Error rate",
      value: "0.03%",
      color: "#C09030",
      data: [2, 3, 1, 4, 2, 5, 3, 2, 4, 3, 2, 3],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((s) => (
        <Panel key={s.label} tokens={tokens}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span
                className="font-mono text-[9px] tracking-[0.16em] uppercase"
                style={{ color: tokens.textFaint }}
              >
                {s.label}
              </span>
              <span
                className="font-mono text-[12px] font-semibold"
                style={{ color: s.color }}
              >
                {s.value}
              </span>
            </div>
            <Sparkline data={s.data} color={s.color} height={32} />
          </div>
        </Panel>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   OVERVIEW PAGE
════════════════════════════════════════ */
const OverviewPage = ({ tokens }: { tokens: ThemeTokens }) => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {METRICS.map((m) => (
        <MetricCard key={m.id} metric={m} tokens={tokens} />
      ))}
    </div>
    <QuickStats tokens={tokens} />
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
      <ServiceHealthTable tokens={tokens} />
      <ActivityFeed tokens={tokens} />
    </div>
  </div>
);

/* ════════════════════════════════════════
   PLACEHOLDER
════════════════════════════════════════ */
const PlaceholderPage = ({
  id,
  tokens,
}: {
  id: string;
  tokens: ThemeTokens;
}) => {
  const label =
    NAV_ITEMS.find((i) => i.id === id)?.label ??
    NAV_ITEMS.flatMap((i) => i.children ?? []).find((c) => c.id === id)
      ?.label ??
    id;

  return (
    <Panel
      tokens={tokens}
      className="flex flex-col items-center justify-center gap-8 py-20 px-8"
      style={{ minHeight: 420 }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          filter: `drop-shadow(0 0 20px ${tokens.accentGlow})`,
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <defs>
            <radialGradient id="plOrb" cx="42%" cy="36%" r="65%">
              <stop offset="0%" stopColor="#60DFDF" />
              <stop offset="55%" stopColor={tokens.accent} />
              <stop offset="100%" stopColor="#083040" stopOpacity="0" />
            </radialGradient>
            <filter id="plGlow">
              <feGaussianBlur stdDeviation="3" result="b" />
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
            stroke={tokens.borderStrong}
            strokeWidth="0.5"
            strokeDasharray="1.5 4"
            opacity="0.6"
          />
          <circle
            cx="50"
            cy="50"
            r="22"
            fill="url(#plOrb)"
            filter="url(#plGlow)"
            style={{
              transformOrigin: "50px 50px",
              animation: "orbPulse 4s ease-in-out infinite",
            }}
          />
          <g
            style={{
              transformOrigin: "50px 50px",
              animation: "satOrbit 9s linear infinite",
            }}
          >
            <circle
              cx="50"
              cy="6"
              r="2.5"
              fill="#60DFDF"
              opacity="0.9"
              filter="url(#plGlow)"
            />
          </g>
          <circle
            cx="50"
            cy="50"
            r="22"
            fill="none"
            stroke={tokens.accent}
            strokeWidth="0.4"
            opacity="0.3"
          />
          <line
            x1="43"
            y1="50"
            x2="57"
            y2="50"
            stroke={tokens.accent}
            strokeWidth="0.4"
            opacity="0.3"
          />
          <line
            x1="50"
            y1="43"
            x2="50"
            y2="57"
            stroke={tokens.accent}
            strokeWidth="0.4"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <Dot size={4} color={tokens.accent} />
          <span
            className="font-mono text-[9px] tracking-[0.22em] uppercase"
            style={{ color: tokens.accent, opacity: 0.7 }}
          >
            Module ready
          </span>
        </div>
        <h3 className="font-mono text-[20px]" style={{ color: tokens.text }}>
          {label}
        </h3>
        <p
          className="font-mono text-[11px] leading-relaxed max-w-sm"
          style={{ color: tokens.textMuted, letterSpacing: "0.03em" }}
        >
          Drop your{" "}
          <code
            style={{ color: tokens.accent }}
          >{`<${label.replace(/\s/g, "")} />`}</code>{" "}
          component into the{" "}
          <code style={{ color: tokens.accent }}>ContentRouter</code> and it
          will render here automatically.
        </p>
      </div>

      <div
        className="px-5 py-3 font-mono text-[10px] leading-relaxed rounded-sm"
        style={{
          border: `1px solid ${tokens.border}`,
          background: tokens.bgTertiary,
          color: tokens.textMuted,
          maxWidth: 360,
        }}
      >
        <span style={{ color: tokens.textFaint }}>
          {"// ContentRouter switch case:"}
        </span>
        <br />
        <span style={{ color: tokens.accent }}>{"case "}</span>
        <span style={{ color: "#C09030" }}>{`"${id}"`}</span>
        <span style={{ color: tokens.accent }}>{": return "}</span>
        <span
          style={{ color: tokens.text }}
        >{`<${label.replace(/\s/g, "")} />`}</span>
      </div>
    </Panel>
  );
};

/* ════════════════════════════════════════
   CONTENT ROUTER
════════════════════════════════════════ */
const ContentRouter = ({ tokens }: { tokens: ThemeTokens }) => {
  const { activeItem } = useDash();
  switch (activeItem) {
    case "overview":
      return <OverviewPage tokens={tokens} />;
    default:
      return <PlaceholderPage id={activeItem} tokens={tokens} />;
  }
};

/* ════════════════════════════════════════
   PAGE HEADER
════════════════════════════════════════ */
const PageHeader = ({ tokens }: { tokens: ThemeTokens }) => {
  const { activeItem } = useDash();
  const label = useMemo(
    () =>
      NAV_ITEMS.find((i) => i.id === activeItem)?.label ??
      NAV_ITEMS.flatMap((i) => i.children ?? []).find(
        (c) => c.id === activeItem,
      )?.label ??
      "Overview",
    [activeItem],
  );

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
      <div className="flex flex-col gap-1">
        <h1
          className="font-mono leading-none"
          style={{
            fontSize: "clamp(16px,2.2vw,22px)",
            color: tokens.text,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </h1>
        <p
          className="font-mono text-[9px] tracking-[0.12em]"
          style={{ color: tokens.textFaint }}
        >
          Last updated just now · Auto-refresh every 60s
        </p>
      </div>
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-sm"
        style={{
          border: `1px solid ${tokens.border}`,
          background: tokens.surface,
        }}
      >
        <Dot size={4} color="#30C0A0" pulse />
        <span
          className="font-mono text-[8.5px] tracking-[0.16em] uppercase"
          style={{ color: tokens.textFaint }}
        >
          All systems operational
        </span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════ */
export default function Dashboard() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("overview");

  const tokens = theme === "dark" ? DARK_TOKENS : LIGHT_TOKENS;

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );
  const toggleCollapsed = useCallback(() => setSidebarCollapsed((p) => !p), []);

  /* close sidebar on desktop resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ctx: DashCtxType = useMemo(
    () => ({
      theme,
      tokens,
      toggleTheme,
      sidebarOpen,
      setSidebarOpen,
      sidebarCollapsed,
      toggleCollapsed,
      activeItem,
      setActiveItem,
    }),
    [
      theme,
      tokens,
      toggleTheme,
      sidebarOpen,
      sidebarCollapsed,
      toggleCollapsed,
      activeItem,
    ],
  );

  return (
    <DashCtx.Provider value={ctx}>
      <div
        className={`${styles.root} flex h-screen overflow-hidden`}
        style={{ background: tokens.bg, color: tokens.text }}
        data-theme={theme}
      >
        {/* ambient bg */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(ellipse 80% 60% at 15% 40%, #0a1828 0%, #060810 60%)"
                : "radial-gradient(ellipse 80% 60% at 15% 40%, #DFF0F8 0%, #F0F4F8 60%)",
            zIndex: 0,
          }}
          aria-hidden="true"
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${tokens.gridLine} 1px, transparent 1px),linear-gradient(90deg, ${tokens.gridLine} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* sidebar */}
        <Sidebar />

        {/* main */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
          <TopBar />
          <main
            id="main-content"
            className={`${styles.mainContent} flex-1 overflow-y-auto`}
            style={{ background: "transparent" }}
          >
            <div className="p-4 sm:p-6 max-w-350 mx-auto">
              <PageHeader tokens={tokens} />
              <ContentRouter tokens={tokens} />
            </div>
          </main>
        </div>

        {/* global keyframes */}
        <style>{`
          @keyframes satOrbit {
            from { transform: rotate(0deg) translateX(14px); }
            to   { transform: rotate(360deg) translateX(14px); }
          }
          @keyframes orbPulse {
            0%, 100% { opacity: 0.85; }
            50%       { opacity: 1; }
          }
          @keyframes dotPing {
            75%, 100% { transform: scale(2.4); opacity: 0; }
          }
        `}</style>
      </div>
    </DashCtx.Provider>
  );
}
