import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PhilosophyOakBorderCardProps = {
  children: ReactNode;
  className?: string;
  /** Extra classes on the inner padded content wrapper */
  innerClassName?: string;
};

/**
 * Philosophy block on About — frosted surface, neutral border, soft shadow (see `.philosophy-quote-card`).
 */
export function PhilosophyOakBorderCard({
  children,
  className,
  innerClassName = "px-6 py-7 sm:px-10 sm:py-8",
}: PhilosophyOakBorderCardProps) {
  return (
    <div
      className={cn(
        "philosophy-quote-card relative flex flex-col rounded-2xl sm:rounded-3xl",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col items-center gap-5 text-center sm:gap-6",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
