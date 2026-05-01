import { ServicesOverviewSection } from "@/components/sections/ServicesOverviewSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { VideoCtaSection } from "@/components/sections/VideoCtaSection";
import { HeroSection } from "@/components/ui/HeroSection";
import { getHomepageContent, getSiteConfig } from "@/lib/content";

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
      <VideoCtaSection {...homepage.videoCta} formId={site.formspreeId} />
    </div>
  );
}
