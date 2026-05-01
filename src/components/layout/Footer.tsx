import Link from "next/link";

import { BrandWordmark } from "@/components/ui/BrandWordmark";

const TAGS = ["UGC", "Content creator", "Digital maker"] as const;

type FooterProps = {
  instagramUrl: string;
  tiktokUrl: string;
  email: string;
};

const eyebrowClassName =
  "text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] sm:text-[0.56rem]";

const linkStackClassName =
  "flex flex-col gap-1.5 font-sans text-[0.6rem] font-normal normal-case tracking-[0.12em] text-[var(--color-foreground-muted)] sm:text-[0.68rem] sm:tracking-[0.14em]";

/** UGC strip — original sans scale (unchanged vs previous footer strip) */
const tagsRowClassName =
  "flex flex-nowrap items-center justify-center gap-x-0 font-sans text-[0.625rem] font-medium uppercase leading-snug tracking-[0.12em] text-[var(--color-foreground-muted)] sm:text-xs sm:tracking-[0.14em]";

const exploreConnectBlockClassName =
  "flex min-w-0 flex-col items-center gap-2.5 text-center sm:items-start sm:text-left";

export function Footer({ instagramUrl, tiktokUrl, email }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-surface-strong)]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center justify-items-center gap-6 px-6 py-5 sm:gap-7 sm:px-8 sm:py-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-0 lg:justify-items-stretch lg:px-10 lg:py-6">
        {/* Explore + Connect — grouped, left-aligned on desktop (normal footer scan) */}
        <div className="flex w-full min-w-0 flex-row flex-wrap justify-center gap-x-7 gap-y-6 sm:gap-x-9 lg:justify-start lg:gap-x-11">
          <div className={exploreConnectBlockClassName}>
            <p className={eyebrowClassName}>Explore</p>
            <nav
              className={`${linkStackClassName} text-center sm:text-left`}
              aria-label="Explore"
            >
              <Link className="transition-colors hover:text-[var(--color-foreground)]" href="/">
                Home
              </Link>
              <Link className="transition-colors hover:text-[var(--color-foreground)]" href="/work">
                My work
              </Link>
              <Link
                className="transition-colors hover:text-[var(--color-foreground)]"
                href="/destinations"
              >
                Destinations
              </Link>
              <Link
                className="transition-colors hover:text-[var(--color-foreground)]"
                href="/about"
              >
                About me
              </Link>
              <Link
                className="transition-colors hover:text-[var(--color-foreground)]"
                href="/contact"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className={exploreConnectBlockClassName}>
            <p className={eyebrowClassName}>Connect</p>
            <div className={`${linkStackClassName} text-center sm:text-left`}>
              <Link
                className="transition-colors hover:text-[var(--color-foreground)]"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </Link>
              <Link
                className="transition-colors hover:text-[var(--color-foreground)]"
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok
              </Link>
              <a
                className="break-all transition-colors hover:text-[var(--color-foreground)] sm:break-normal"
                href={`mailto:${email}`}
              >
                {email.toLowerCase()}
              </a>
            </div>
          </div>
        </div>

        {/* UGC — centred in middle third */}
        <div
          className="flex w-full min-w-0 items-center justify-center px-1 lg:px-3"
          aria-label="Roles and focus"
        >
          <div className={`${tagsRowClassName} max-w-full overflow-x-auto lg:overflow-visible`}>
            {TAGS.map((label, index) => (
              <span key={label} className="inline-flex shrink-0 items-center">
                {index > 0 ? (
                  <span
                    className="mx-1.5 select-none text-[var(--color-primary)]/50 sm:mx-2.5"
                    aria-hidden
                  >
                    |
                  </span>
                ) : null}
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex w-full min-w-0 items-center justify-center lg:justify-end lg:pr-4">
          <Link
            href="/"
            className="shrink-0 rounded-md text-[var(--color-primary)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            aria-label="Iris on the Move — Home"
          >
            <BrandWordmark size="md" align="left" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
