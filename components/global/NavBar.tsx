"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useMemo,
} from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface SubItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface MegaMenuContent {
  sections: {
    title: string;
    items: SubItem[];
  }[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
    label: string;
  };
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  megaMenu?: MegaMenuContent;
}

interface NavbarConfig {
  logo: {
    text: string;
    href: string;
    image?: string;
  };
  items: NavItem[];
  cta: {
    label: string;
    href: string;
  };
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  ),
  code: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  palette: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="2" fill="currentColor" />
      <circle cx="8" cy="14" r="2" fill="currentColor" />
      <circle cx="16" cy="14" r="2" fill="currentColor" />
    </svg>
  ),
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  bolt: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  chart: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  robot: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
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
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  sparkles: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ════════════════════════════════════════════════════════════════════

const defaultConfig: NavbarConfig = {
  logo: {
    text: "NEXUS",
    href: "/",
    image: "/assets/images/logo.png",
  },
  items: [
    {
      id: "services",
      label: "Services",
      href: "/services",
      megaMenu: {
        sections: [
          {
            title: "Design",
            items: [
              {
                id: "web-design",
                label: "Web Design",
                description: "Beautiful, conversion-focused websites",
                href: "/services/web-design",
                icon: Icons.palette,
              },
              {
                id: "ui-ux",
                label: "UI/UX Design",
                description: "User-centered digital experiences",
                href: "/services/ui-ux",
                icon: Icons.sparkles,
              },
              {
                id: "branding",
                label: "Brand Identity",
                description: "Memorable visual identities",
                href: "/services/branding",
                icon: Icons.globe,
              },
            ],
          },
          {
            title: "Development",
            items: [
              {
                id: "web-dev",
                label: "Web Development",
                description: "Fast, scalable web applications",
                href: "/services/web-development",
                icon: Icons.code,
                badge: "Popular",
              },
              {
                id: "ecommerce",
                label: "E-Commerce",
                description: "Online stores that convert",
                href: "/services/ecommerce",
                icon: Icons.chart,
              },
              {
                id: "api",
                label: "API Integration",
                description: "Connect your systems seamlessly",
                href: "/services/api",
                icon: Icons.bolt,
              },
            ],
          },
          {
            title: "Growth",
            items: [
              {
                id: "seo",
                label: "SEO",
                description: "Rank higher on Google",
                href: "/services/seo",
                icon: Icons.search,
              },
              {
                id: "ai",
                label: "AI Automation",
                description: "Smart business automation",
                href: "/services/ai",
                icon: Icons.robot,
                badge: "New",
              },
              {
                id: "security",
                label: "Security",
                description: "Protect your digital assets",
                href: "/services/security",
                icon: Icons.shield,
              },
            ],
          },
        ],
        featured: {
          title: "Case Study",
          description: "How we helped TechCorp increase conversions by 340%",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
          href: "/case-studies/techcorp",
          label: "Read Story",
        },
      },
    },
    {
      id: "work",
      label: "Work",
      href: "/work",
      megaMenu: {
        sections: [
          {
            title: "By Industry",
            items: [
              {
                id: "saas",
                label: "SaaS",
                description: "Software companies",
                href: "/work/saas",
                icon: Icons.code,
              },
              {
                id: "ecom",
                label: "E-Commerce",
                description: "Online retail",
                href: "/work/ecommerce",
                icon: Icons.chart,
              },
              {
                id: "fintech",
                label: "Fintech",
                description: "Financial services",
                href: "/work/fintech",
                icon: Icons.shield,
              },
            ],
          },
          {
            title: "By Service",
            items: [
              {
                id: "design-work",
                label: "Design Projects",
                description: "Visual & UX work",
                href: "/work/design",
                icon: Icons.palette,
              },
              {
                id: "dev-work",
                label: "Development",
                description: "Technical builds",
                href: "/work/development",
                icon: Icons.bolt,
              },
              {
                id: "growth-work",
                label: "Growth Campaigns",
                description: "Marketing success",
                href: "/work/growth",
                icon: Icons.globe,
              },
            ],
          },
        ],
        featured: {
          title: "Latest Project",
          description: "A complete rebrand for Nova Finance",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
          href: "/work/nova-finance",
          label: "View Project",
        },
      },
    },
    {
      id: "about",
      label: "About",
      href: "/about",
    },
    {
      id: "blog",
      label: "Blog",
      href: "/blog",
    },
  ],
  cta: {
    label: "Login",
    href: "/contact",
  },
};

// ════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS BAR
// ════════════════════════════════════════════════════════════════════

const ScrollProgress = memo(function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled =
        scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/3">
      <div
        ref={progressRef}
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #F59E0B, #F59E0B80)",
          boxShadow: "0 0 10px rgba(245, 158, 11, 0.5)",
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MEGA MENU PANEL - FIXED VERSION
// ════════════════════════════════════════════════════════════════════

const MegaMenuPanel = memo(function MegaMenuPanel({
  content,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: {
  content: MegaMenuContent;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current || !contentRef.current) return;

    const panel = panelRef.current;
    const sections = contentRef.current.querySelectorAll(".menu-section");
    const items = contentRef.current.querySelectorAll(".menu-item");
    const featured = contentRef.current.querySelector(".featured-card");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        panel,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3 },
      )
        .fromTo(
          sections,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.25 },
          "-=0.15",
        )
        .fromTo(
          items,
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, stagger: 0.02, duration: 0.2 },
          "-=0.15",
        )
        .fromTo(
          featured,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.3 },
          "-=0.2",
        );
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={panelRef}
      className="absolute left-1/2 top-full z-50 w-full max-w-5xl -translate-x-1/2 pt-3"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ opacity: 0 }}
    >
      {/* Invisible bridge to prevent gap issues */}
      <div className="absolute -top-3 left-0 right-0 h-3" />

      <div
        className="relative overflow-hidden border border-white/8 bg-[#0A0C10]/95 shadow-2xl shadow-black/50"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        {/* Top Accent Line */}
        <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/50 to-transparent" />

        {/* Content */}
        <div ref={contentRef} className="flex">
          {/* Menu Sections */}
          <div className="flex flex-1 p-6">
            {content.sections.map((section, sectionIndex) => (
              <div
                key={section.title}
                className="menu-section flex-1 px-5 first:pl-0 last:pr-0"
                style={{
                  borderLeft:
                    sectionIndex > 0
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                {/* Section Title */}
                <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  {section.title}
                </h3>

                {/* Items */}
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="menu-item group flex items-start gap-3 rounded-md p-2.5 
                                 transition-all duration-200 hover:bg-white/4"
                    >
                      {/* Icon */}
                      <span
                        className="mt-0.5 h-5 w-5 shrink-0 text-white/25 
                                     transition-colors duration-200 group-hover:text-amber-400"
                      >
                        {item.icon}
                      </span>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[13px] font-medium text-white/75 
                                         transition-colors duration-200 group-hover:text-white"
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className="shrink-0 rounded-full bg-amber-400/10 px-2 py-0.5 
                                           text-[9px] font-semibold uppercase tracking-wider text-amber-400"
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p
                            className="mt-0.5 text-[11px] leading-relaxed text-white/35 
                                      transition-colors duration-200 group-hover:text-white/50"
                          >
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <span
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-transparent 
                                     transition-all duration-200 group-hover:text-white/30 
                                     group-hover:translate-x-0.5"
                      >
                        {Icons.arrow}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Featured Card */}
          {content.featured && (
            <div className="featured-card w-64 border-l border-white/5 p-5">
              <Link
                href={content.featured.href}
                onClick={onClose}
                className="group block"
              >
                {/* Image */}
                <div className="relative mb-4 aspect-16/10 overflow-hidden rounded-sm">
                  <Image
                    src={content.featured.image}
                    alt={content.featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  {/* View Indicator */}
                  <div
                    className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center 
                                border border-white/20 bg-black/30 backdrop-blur-sm 
                                transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40"
                  >
                    <span className="h-3.5 w-3.5 text-white">
                      {Icons.arrowUpRight}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-amber-400/70">
                  {content.featured.title}
                </p>
                <h4
                  className="mb-2 text-[13px] font-medium leading-snug text-white/70 
                             transition-colors duration-200 group-hover:text-white"
                >
                  {content.featured.description}
                </h4>

                {/* Link */}
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium 
                               text-white/40 transition-colors duration-200 group-hover:text-amber-400"
                >
                  {content.featured.label}
                  <span className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5">
                    {Icons.arrow}
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/4 px-6 py-3">
          <p className="text-[10px] text-white/25">
            Need help choosing?{" "}
            <Link
              href="/contact"
              onClick={onClose}
              className="text-amber-400/60 hover:text-amber-400 transition-colors"
            >
              Talk to an expert
            </Link>
          </p>
          <Link
            href="/services"
            onClick={onClose}
            className="flex items-center gap-1 text-[10px] font-medium text-white/30 
                     transition-colors hover:text-white/60"
          >
            View all services
            <span className="h-3 w-3">{Icons.arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// NAV LINK COMPONENT
// ════════════════════════════════════════════════════════════════════

const NavLink = memo(function NavLink({
  item,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavItem;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const hasMegaMenu = !!item.megaMenu;

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={item.href}
        className={`
          group relative flex items-center gap-1.5 px-4 py-2 text-sm font-bold
          transition-all duration-200
          ${isActive ? "text-white" : "text-white/50 hover:text-white/80"}
        `}
      >
        <span>{item.label}</span>

        {/* Dropdown Indicator */}
        {hasMegaMenu && (
          <span
            className={`h-3 w-3 transition-all duration-300 ${
              isActive ? "rotate-180 text-amber-400" : "text-white/30"
            }`}
          >
            {Icons.chevronDown}
          </span>
        )}

        {/* Active/Hover Underline */}
        <span
          className={`absolute bottom-0 left-3 right-3 h-px transition-all duration-300 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{
            background: isActive
              ? "linear-gradient(90deg, #F59E0B, transparent)"
              : "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </Link>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MOBILE MENU
// ════════════════════════════════════════════════════════════════════

const MobileMenu = memo(function MobileMenu({
  isOpen,
  items,
  cta,
  onClose,
}: {
  isOpen: boolean;
  items: NavItem[];
  cta: NavbarConfig["cta"];
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      gsap.fromTo(
        menuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );

      gsap.fromTo(
        ".mobile-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.4,
          delay: 0.1,
          ease: "power2.out",
        },
      );
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedItem((prev) => (prev === id ? null : id));
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-40 flex flex-col lg:hidden"
      style={{
        background: "rgba(8, 9, 12, 0.98)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Subtle Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <nav className="relative flex-1 overflow-y-auto px-6 pt-24">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="mobile-item border-b border-white/4"
          >
            {item.megaMenu ? (
              <>
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="flex w-full items-center justify-between py-5"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] text-white/20">
                      0{i + 1}
                    </span>
                    <span className="text-lg text-white/80">{item.label}</span>
                  </div>
                  <span
                    className={`h-5 w-5 text-white/25 transition-transform duration-300 ${
                      expandedItem === item.id ? "rotate-180" : ""
                    }`}
                  >
                    {Icons.chevronDown}
                  </span>
                </button>

                {/* Expanded Content */}
                <div
                  className={`overflow-hidden transition-all duration-400 ease-out ${
                    expandedItem === item.id ? "max-h-150 pb-5" : "max-h-0"
                  }`}
                >
                  {item.megaMenu.sections.map((section) => (
                    <div key={section.title} className="mb-5 pl-10">
                      <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                        {section.title}
                      </p>
                      {section.items.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={subItem.href}
                          onClick={onClose}
                          className="flex items-center gap-3 py-2.5 text-[14px] text-white/50 
                                   transition-colors hover:text-white"
                        >
                          <span className="h-4 w-4 text-white/20">
                            {subItem.icon}
                          </span>
                          <span>{subItem.label}</span>
                          {subItem.badge && (
                            <span
                              className="rounded-full bg-amber-400/10 px-2 py-0.5 
                                           text-[8px] font-bold uppercase text-amber-400"
                            >
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-4 py-5"
              >
                <span className="font-mono text-[10px] text-white/20">
                  0{i + 1}
                </span>
                <span className="text-lg text-white/80 transition-colors hover:text-white">
                  {item.label}
                </span>
              </Link>
            )}
          </div>
        ))}

        {/* CTA */}
        <Link
          href={cta.href}
          onClick={onClose}
          className="mobile-item mt-10 inline-flex items-center gap-2 border border-amber-400/30 
                     bg-amber-400/5 px-5 py-3 text-sm font-medium text-amber-400 
                     transition-all hover:bg-amber-400/10"
        >
          {cta.label}
          <span className="h-4 w-4">{Icons.arrow}</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="mobile-item border-t border-white/4 px-6 py-5">
        <p className="text-[11px] text-white/25">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN NAVBAR COMPONENT
// ════════════════════════════════════════════════════════════════════

const Navbar: React.FC<{ config?: NavbarConfig }> = ({
  config = defaultConfig,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get active mega menu content
  const activeMegaMenu = useMemo(() => {
    const activeItem = config.items.find((item) => item.id === activeMenu);
    return activeItem?.megaMenu || null;
  }, [activeMenu, config.items]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power2.out" },
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Handlers
  const handleMenuOpen = useCallback((id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(id);
  }, []);

  const handleMenuClose = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  const handleMenuPanelEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleMenuPanelLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 -top-4 z-50  py-3  lg:py-4"
        style={{ opacity: 0 }}
      >
        <nav className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
          {/* Main Bar */}
          <div
            className={`
              relative flex items-center justify-between px-5 py-1 
              border transition-all duration-500
              ${
                isScrolled
                  ? "border-white/15 bg-[#08090C]/50 shadow-xl shadow-black/25"
                  : "border-white/5 bg-[#08090C]/10"
              }
            `}
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            {/* Logo */}
            <Link
              href={config.logo.href}
              className="relative z-10 flex items-center gap-3"
            >
              <div className="relative w-36 h-20">
                <Image
                  src={config.logo.image || ""}
                  alt={config.logo.text}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center lg:flex">
              {config.items.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  isActive={activeMenu === item.id}
                  onMouseEnter={() => item.megaMenu && handleMenuOpen(item.id)}
                  onMouseLeave={handleMenuClose}
                />
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href={config.cta.href}
              className="group relative z-10 hidden items-center gap-2 overflow-hidden 
                         border border-amber-400/20 bg-amber-400/5 px-5 py-2 
                         text-[12px] font-semibold uppercase tracking-wider text-amber-400 
                         transition-all duration-300 hover:border-amber-400/40 
                         hover:bg-amber-400/10 lg:flex"
            >
              <span>{config.cta.label}</span>
              <span className="relative h-4 w-4 overflow-hidden">
                <span
                  className="absolute inset-0 flex items-center justify-center 
                               transition-transform duration-300 group-hover:translate-x-5"
                >
                  {Icons.arrow}
                </span>
                <span
                  className="absolute inset-0 flex -translate-x-5 items-center 
                               justify-center transition-transform duration-300 
                               group-hover:translate-x-0"
                >
                  {Icons.arrow}
                </span>
              </span>

              {/* Shine effect */}
              <span
                className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r 
                             from-transparent via-white/10 to-transparent transition-transform 
                             duration-700 group-hover:translate-x-full"
              />
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={toggleMobile}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`h-px w-5 bg-white/80 transition-all duration-300 ${
                  isMobileOpen ? "translate-y-1.25 rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-5 bg-white/80 transition-all duration-300 ${
                  isMobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-5 bg-white/80 transition-all duration-300 ${
                  isMobileOpen ? "-translate-y-1.75 -rotate-45" : ""
                }`}
              />
            </button>

            {/* Scroll Progress Bar */}
            <ScrollProgress />
          </div>

          {/* Mega Menu */}
          {activeMegaMenu && (
            <MegaMenuPanel
              content={activeMegaMenu}
              onMouseEnter={handleMenuPanelEnter}
              onMouseLeave={handleMenuPanelLeave}
              onClose={handleCloseMenu}
            />
          )}
        </nav>
      </header>

      {/* Backdrop for Mega Menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-40 hidden lg:block"
          style={{
            background: "rgba(8, 9, 12, 0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onClick={handleCloseMenu}
        />
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileOpen}
        items={config.items}
        cta={config.cta}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default memo(Navbar);
export type { NavbarConfig, NavItem, MegaMenuContent, SubItem };
