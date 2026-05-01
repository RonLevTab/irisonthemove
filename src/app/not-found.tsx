import Link from "next/link";

import { brandScriptClassName } from "@/lib/brandFonts";

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[60vh] items-center">
      <div className="card-shell mx-auto flex max-w-2xl flex-col items-center gap-6 px-8 py-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
          Not found
        </p>
        <h1
          className={`${brandScriptClassName} text-6xl text-[var(--color-primary)]`}
        >
          This path is still waiting for its next trip
        </h1>
        <p className="text-lg leading-8 text-[var(--color-foreground-muted)]">
          The page you requested does not exist yet or the URL needs checking.
        </p>
        <Link href="/" className="primary-button">
          Back to home
        </Link>
      </div>
    </section>
  );
}
