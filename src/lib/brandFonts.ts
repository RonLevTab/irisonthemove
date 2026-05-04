import { Castoro_Titling, Cormorant, Monsieur_La_Doulaise } from "next/font/google";

/** Logo wordmark “Iris” only — Monsieur La Doulaise */
export const fontLogoScript = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand-script",
});

/**
 * Cormorant — display headings site-wide and hero tagline tier (`.font-text-3`).
 * Single instance shares `--font-text-3` with `layout.tsx` on `<body>`.
 */
export const fontCormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-text-3",
});

/** “On The Move” in the logo — subtitles, eyebrows, small caps labels */
export const fontBrandSubtitle = Castoro_Titling({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand-subtitle",
});

/** Display headings — Cormorant; use in className next to Tailwind utilities */
export const brandScriptClassName = fontCormorant.className;

/** Eyebrows / subtitles — Castoro Titling */
export const brandSubtitleClassName = fontBrandSubtitle.className;

/**
 * Pixel size for `BrandWordmark` with `size="sm"` (navbar) — the “On The Move” line.
 * Pair with `brandSubtitleClassName`, `uppercase`, and `tracking-[0.18em]` to match the logo.
 */
export const brandWordmarkNavSubtitleTextSizeClassName =
  "text-[0.62rem] sm:text-xs";
