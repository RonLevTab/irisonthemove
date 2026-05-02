import Link from "next/link";

import { BrandWordmark } from "@/components/ui/BrandWordmark";

const TAGS = ["Content creator", "Digital maker", "UGC"] as const;

type FooterProps = {
  instagramUrl: string;
  tiktokUrl: string;
  email: string;
};

const eyebrowClassName =
  "text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-[var(--color-primary)] sm:text-[0.82rem] lg:text-[0.875rem]";

const linkStackClassName =
  "flex flex-col gap-1.5 font-sans text-[0.52rem] font-normal normal-case tracking-[0.09em] text-[var(--color-foreground-muted)] sm:gap-2 sm:text-[0.76rem] sm:tracking-[0.12em] lg:text-[0.8125rem]";

/** UGC strip — original sans scale (unchanged vs previous footer strip) */
const tagsRowClassName =
  "flex flex-col items-center justify-center gap-y-1 font-sans text-[0.52rem] font-medium uppercase leading-snug tracking-[0.09em] text-[var(--color-foreground-muted)] sm:flex-row sm:flex-nowrap sm:gap-y-0 sm:gap-x-0 sm:text-xs sm:tracking-[0.14em]";

const exploreConnectBlockClassName =
  "flex min-w-0 flex-col items-start gap-1.5 text-left sm:gap-2.5";

export function Footer({ instagramUrl, tiktokUrl, email }: FooterProps) {
  return (
    <footer className="relative z-10 bg-[var(--color-surface-strong)]">
      <div className="footer-align grid w-full grid-cols-3 items-center justify-items-stretch gap-x-4 gap-y-0 py-5 sm:gap-x-4 sm:py-6 lg:gap-x-4 lg:py-6">
        <div className="flex w-full min-w-0 flex-col flex-nowrap justify-start gap-y-4 sm:flex-row sm:gap-x-8 sm:gap-y-0 lg:gap-x-7">
          <div className={exploreConnectBlockClassName}>
            <p className={eyebrowClassName}>Explore</p>
            <nav
              className={`${linkStackClassName} text-left`}
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
            <div className={`${linkStackClassName} text-left`}>
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
          className="flex w-full min-w-0 items-center justify-center px-1"
          aria-label="Roles and focus"
        >
          <div className={`${tagsRowClassName} max-w-full overflow-x-auto lg:overflow-visible`}>
            {TAGS.map((label, index) => (
              <span key={label} className="inline-flex shrink-0 items-center">
                {index > 0 ? (
                  <span
                    className="hidden select-none text-[var(--color-primary)]/50 sm:mx-2.5 sm:inline"
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

        <div className="flex w-full min-w-0 items-center justify-end">
          <Link
            href="/"
            className="shrink-0 rounded-md text-[var(--color-primary)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            aria-label="Iris on the Move — Home"
          >
            <BrandWordmark
              size="md"
              align="left"
              scriptClassName="text-[2.25rem] sm:text-6xl"
              titleClassName="text-[0.54rem] sm:text-sm"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
