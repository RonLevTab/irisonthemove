import dynamic from "next/dynamic";

import { HeroSection } from "@/components/ui/HeroSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { getHomepageContent } from "@/lib/homepageContent";
import { getSiteConfig, resolveFormspreeFormId } from "@/lib/siteContent";

/** Statisch + ISR: snelle HTML vanaf edge; JSON-wijzigingen binnen enkele minuten live. */
export const revalidate = 120;

const ServicesOverviewSection = dynamic(() =>
  import("@/components/sections/ServicesOverviewSection").then((m) => m.ServicesOverviewSection),
);
const VideoCtaSection = dynamic(() =>
  import("@/components/sections/VideoCtaSection").then((m) => m.VideoCtaSection),
);

export default async function Home() {
  const [site, homepage] = await Promise.all([
    getSiteConfig(),
    getHomepageContent(),
  ]);

  return (
    <div className="relative">
      <HeroSection {...homepage.hero} />
      <SocialProofSection
        {...homepage.socialProof}
        instagramUrl={site.socialLinks.instagram}
        tiktokUrl={site.socialLinks.tiktok}
      />
      <ServicesOverviewSection {...homepage.services} />
      <VideoCtaSection
        {...homepage.videoCta}
        formId={resolveFormspreeFormId(site.formspreeId)}
      />
    </div>
  );
}
