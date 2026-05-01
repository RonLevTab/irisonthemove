import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type AspectRatioProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Width ÷ height (e.g. `16 / 9` landscape, `3 / 4` = `0.75` portrait). */
  ratio: number;
};

/**
 * Sized with CSS `aspect-ratio` so it behaves correctly inside CSS Grid
 * (grid stretch breaks the old padding-bottom hack).
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio({ ratio, className, style, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("relative w-full overflow-hidden", className)}
        style={{
          aspectRatio: ratio,
          ...style,
        }}
        {...props}
      >
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  },
);
