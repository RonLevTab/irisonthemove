"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

import { BrandWordmark } from "@/components/ui/BrandWordmark";

type NavbarProps = {
  instagramUrl: string;
  tiktokUrl: string;
  email: string;
};

const socialIconClass =
  "nav-social-link inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:h-12 sm:w-12";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/work", label: "My work" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "About me" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ instagramUrl, tiktokUrl, email }: NavbarProps) {
  const pathname = usePathname();

  const linkClassName = (href: string) => {
    const active = pathname === href;
    return [
      "nav-pill-link font-sans inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm font-normal uppercase tracking-[0.18em] transition-colors select-none sm:px-4 sm:text-base lg:py-3 lg:text-[1.0625rem]",
      active
        ? "bg-[#ffffff] text-[var(--color-primary)] [box-shadow:none]"
        : "text-[var(--color-primary)] hover:bg-[#ffffff]",
    ].join(" ");
  };

  const mobileLinkClassName = (href: string) => {
    const active = pathname === href;
    return [
      "font-sans inline-flex items-center justify-center whitespace-nowrap rounded-full px-1 py-1.5 text-[0.56rem] font-normal uppercase tracking-[0.08em] transition-colors select-none min-[380px]:text-[0.62rem] sm:px-3 sm:text-xs sm:tracking-[0.13em]",
      active
        ? "bg-[#ffffff] text-[var(--color-primary)]"
        : "text-[var(--color-primary)] hover:bg-[#ffffff]",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-background)]">
      <div className="nav-bar-row">
        <Link href="/" className="relative z-10 shrink-0 py-0.5 text-[var(--color-primary)]">
          <span className="nav-bar-brand">
            <BrandWordmark size="md" align="left" />
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="nav-desktop hidden min-h-0 min-w-0 flex-1 items-center justify-center lg:flex"
        >
          <div className="nav-desktop-inner flex shrink-0 items-center justify-center gap-[clamp(1.05rem,2vw,2.35rem)]">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClassName(item.href)}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 lg:ml-0">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClass}
            aria-label="Instagram"
          >
            <FaInstagram className="h-[1.28rem] w-[1.28rem] sm:h-[1.4rem] sm:w-[1.4rem]" aria-hidden />
          </a>
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClass}
            aria-label="TikTok"
          >
            <FaTiktok className="h-[1.28rem] w-[1.28rem] sm:h-[1.4rem] sm:w-[1.4rem]" aria-hidden />
          </a>
          <a href={`mailto:${email}`} className={socialIconClass} aria-label="Email">
            <HiOutlineMail className="h-[1.42rem] w-[1.42rem] sm:h-[1.5rem] sm:w-[1.5rem]" aria-hidden />
          </a>
        </div>
      </div>

      <nav
        className="nav-mobile-menu bg-[var(--color-background)] lg:hidden"
        aria-label="Main navigation"
      >
        <div className="flex w-full flex-nowrap items-center justify-between gap-x-0.5 sm:justify-center sm:gap-x-2">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={mobileLinkClassName(item.href)}
                aria-current={active ? "page" : undefined}
              >
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
