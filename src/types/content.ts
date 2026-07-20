export type ContentBlock =
  | {
      type: "text";
      body: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "gallery";
      images: Array<{
        src: string;
        alt: string;
        caption?: string;
      }>;
    }
  | {
      type: "video";
      embedHtml: string;
      caption?: string;
    }
  | {
      type: "instagram";
      postUrl: string;
      caption?: string;
    }
  | {
      type: "quote";
      text: string;
      author?: string;
    }
  | {
      type: "cta";
      text: string;
      buttonText: string;
      buttonLink: string;
    };

export type Destination = {
  slug: string;
  title: string;
  region: string;
  country: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  season: string;
  tags: string[];
  featured: boolean;
  blocks: ContentBlock[];
};

/** Regions + country lists for the destinations explorer (dropdowns on `/destinations`). */
export type DestinationRegionsExplorer = {
  regions: Array<{
    id: string;
    label: string;
    countries: string[];
  }>;
};

/** Masonry frame shape on `/destinations` (optional override; otherwise derived from `src`). */
export type DestinationTileScale = "compact" | "natural" | "tall";

/** Hero masonry on `/destinations` — swap `src` / captions when your photos are ready. */
export type DestinationGalleryItem = {
  /** Stable identity for deterministic masonry ordering across CMS/media migrations. */
  stableKey?: string;
  src: string;
  alt: string;
  /** Width ÷ height (e.g. `16 / 9` ≈ 1.78, `3 / 4` = 0.75). */
  aspectRatio: number;
  /** You in frame / portrait hero — tile is shown taller in the masonry. */
  largeTile?: boolean;
  /** Frame size tier; if omitted, a stable mix of compact / natural / tall is chosen from `src`. */
  tileScale?: DestinationTileScale;
  caption: string;
  captionLine2?: string;
  placeholder?: string;
  href?: string;
};

export type DestinationGalleryContent = {
  /** Short note shown inside the destinations card (e.g. a guest message). Edit in CMS or `destinations-gallery.json`. */
  cardMessage?: string;
  items: DestinationGalleryItem[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  date: string;
  tags: string[];
  featured: boolean;
  blocks: ContentBlock[];
};

export type TravelGuide = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  location: string;
  duration: string;
  tags: string[];
  featured: boolean;
  blocks: ContentBlock[];
};

export type SiteConfig = {
  name: string;
  title: string;
  tagline: string;
  description: string;
  email: string;
  formspreeId: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
  };
  stats: {
    countriesVisited: number;
  };
  seo: {
    siteUrl: string;
    ogImage: string;
  };
};

/** Work page — impact / analytics strip. */
export type WorkPageResultsContent = {
  eyebrow: string;
  title: string;
  description?: string;
  instagram: {
    /** e.g. @irisonthemove — account these stats refer to */
    profileHandle: string;
    platformLabel: string;
    period30d: string;
    totalViews30d: number;
    accountsReached: number;
    reachChangePercent: number;
    /** e.g. "263.9K" for the headline-style figure */
    totalViewsLabel: string;
    /** e.g. "133K" for the small stats pill */
    statsPillLabel: string;
    viewsFromFollowersPercent: number;
    viewsFromNonFollowersPercent: number;
    contentMix: Array<{
      label: string;
      percent: number;
    }>;
    singleReel: {
      /** Short title for the header (e.g. Rocco) */
      reelName: string;
      context: string;
      /** Optional public Instagram reel URL (opens off-site). */
      reelUrl?: string;
      views: number;
      accountsReached: number;
      avgWatchSeconds: number;
      followersFromReel: number;
      likes: number;
      comments: number;
      shares: number;
      saves: number;
    };
  };
  tiktok: {
    platformLabel: string;
    /** Display name next to the logo, e.g. "Iris On The Move" */
    accountName: string;
    /** Public profile URL */
    profileUrl: string;
    period8w: string;
    metrics: Array<{
      label: string;
      value: number;
      changePercent: number;
    }>;
  };
  /** Website visit total (handmatig bij te werken in `work-page.json`, bv. uit Vercel Analytics). Live tellen via oude externe API is verwijderd (onbetrouwbaar). */
  website?: {
    platformLabel: string;
    siteDisplayUrl: string;
    siteHref: string;
    liveSinceLabel: string;
    totalVisits: number;
    /** e.g. "Total website visits" */
    visitsCaption?: string;
  };
};

export type HomepageContent = {
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
    /** Full-bleed section background (CSS / Next Image). */
    backgroundImage: string;
    /** Large portrait / hero image (right column on wide layouts). */
    image: string;
    imageAlt: string;
    /**
     * Optional — reserved for `HeroImageTiles` if you switch the hero layout later.
     */
    tiles?: Array<{
      src: string;
      alt: string;
    }>;
  };
  socialProof: {
    eyebrow: string;
    title: string;
    reels: Array<{
      videoSrc: string;
      /** Optional JPEG/WEBP under `/public` — shows instantly before the video decodes. */
      poster?: string;
      title: string;
      description: string;
    }>;
  };
  services: {
    eyebrow: string;
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  videoCta: {
    posterImage: string;
    quote: string;
    ctaLabel: string;
  };
};

export type AboutPageContent = {
  /** First section is rendered above the gallery (with drop cap on body). */
  sections: Array<{
    title: string;
    body: string;
  }>;
  philosophy: {
    label: string;
    /** Second line of editorial heading (matches SectionHeading `editorialDual`). */
    headline: string;
    quote: string;
  };
};

export type WorkPageContent = {
  intro: {
    eyebrow: string;
    title: string;
    body: string;
  };
  categories: Array<{
    id: string;
    title: string;
    description: string;
    items: Array<{
      image: string;
      imageAlt: string;
      /** Place / venue name shown on hover. */
      location: string;
      /** Optional `object-fit` anchor for `object-cover` (e.g. `top` to keep the top of the photo in frame). */
      objectPosition?: "top" | "center" | "bottom";
    }>;
    /**
     * Exactly three reel slots under the grids: each is an MP4 or a `placeholder` for a
     * coming-soon card (hotels often use one real clip + two placeholders while more files are produced).
     */
    tripleVideos?: Array<
      | { videoSrc: string; title?: string; poster?: string }
      | { placeholder: true; title?: string }
    >;
    /**
     * Exactly six Instagram reel URLs — 2×3 grid. When set, replaces `items` and `tripleVideos` for
     * that category (e.g. Travel guides). Ignored if `travelGridVideos` (six MP4s) is set.
     */
    instagramReels?: string[];
    /**
     * Exactly six self-hosted MP4s — 2×3 grid, same card + autoplay behavior as portfolio reel rows.
     * Takes precedence over `instagramReels` for Travel.
     */
    travelGridVideos?: Array<
      | { videoSrc: string; title?: string; poster?: string }
      | { placeholder: true; title?: string }
    >;
  }>;
  cta: {
    title: string;
    buttonLabel: string;
    buttonHref: string;
    /** Full-bleed background (same role as home video CTA poster). */
    backgroundImage: string;
  };
  results?: WorkPageResultsContent;
};
