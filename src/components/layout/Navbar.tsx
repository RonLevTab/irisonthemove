"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { HiOutlineMail, HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";

import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { brandSubtitleClassName } from "@/lib/brandFonts";

type NavbarProps = {
  instagramUrl: string;
  tiktokUrl: string;
  email: string;
};

const socialIconClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

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
      "font-sans inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-normal uppercase tracking-[0.18em] transition-colors select-none sm:px-3.5 sm:text-base",
      active
        ? "bg-[#ffffff] text-[var(--color-primary)] [box-shadow:none]"
        : "text-[var(--color-primary)] hover:bg-[#ffffff]",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="relative mx-auto flex min-h-[3.5rem] max-w-7xl items-center gap-2 px-6 py-3 sm:px-10 lg:px-12">
        <Link href="/" className="relative z-10 shrink-0 py-1 text-[var(--color-primary)]">
          <BrandWordmark size="sm" align="left" />
        </Link>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
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
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClass}
            aria-label="Instagram"
          >
            <FaInstagram className="h-[1.1rem] w-[1.1rem]" aria-hidden />
          </a>
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClass}
            aria-label="TikTok"
          >
            <FaTiktok className="h-[1.1rem] w-[1.1rem]" aria-hidden />
          </a>
          <a href={`mailto:${email}`} className={socialIconClass} aria-label="Email">
            <HiOutlineMail className="h-[1.2rem] w-[1.2rem]" aria-hidden />
          </a>
          <button
            type="button"
            className="ml-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <HiOutlineX className="h-5 w-5" /> : <HiOutlineMenuAlt3 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-6 py-4 sm:px-10 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
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
