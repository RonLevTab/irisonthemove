"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { HiOutlineMail, HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";

import { BrandWordmark } from "@/components/ui/BrandWordmark";

type NavbarProps = {
  instagramUrl: string;
  tiktokUrl: string;
  email: string;
};

const socialIconClass =
  "nav-social-link inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:h-11 sm:w-11";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/work", label: "My work" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "About me" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ instagramUrl, tiktokUrl, email }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const linkClassName = (href: string) => {
    const active = pathname === href;
    return [
      "nav-pill-link font-sans inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm font-normal uppercase tracking-[0.18em] transition-colors select-none sm:px-4 sm:text-base lg:py-3 lg:text-[1.0625rem]",
      active
        ? "bg-[#ffffff] text-[var(--color-primary)] [box-shadow:none]"
        : "text-[var(--color-primary)] hover:bg-[#ffffff]",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-background)]/80 backdrop-blur-md">
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
          <div className="nav-desktop-inner flex shrink-0 items-center justify-center gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
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
            <FaInstagram className="h-[1.15rem] w-[1.15rem] sm:h-[1.25rem] sm:w-[1.25rem]" aria-hidden />
          </a>
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClass}
            aria-label="TikTok"
          >
            <FaTiktok className="h-[1.15rem] w-[1.15rem] sm:h-[1.25rem] sm:w-[1.25rem]" aria-hidden />
          </a>
          <a href={`mailto:${email}`} className={socialIconClass} aria-label="Email">
            <HiOutlineMail className="h-[1.3rem] w-[1.3rem] sm:h-[1.35rem] sm:w-[1.35rem]" aria-hidden />
          </a>
          <button
            type="button"
            className="ml-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] sm:h-12 sm:w-12 lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <HiOutlineX className="h-5 w-5" /> : <HiOutlineMenuAlt3 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="nav-mobile-menu border-t border-[var(--color-border)] bg-[var(--color-background)] lg:hidden">
          <div className="flex w-full flex-col gap-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block w-full text-left ${linkClassName(item.href)}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
