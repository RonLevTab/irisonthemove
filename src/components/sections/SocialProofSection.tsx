"use client";

import { FaInstagram, FaTiktok } from "react-icons/fa6";

import { GradientSocialMenu } from "@/components/ui/GradientSocialMenu";
import { InteractiveReelVideos } from "@/components/ui/InteractiveReelVideos";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  latestContentSectionStyle,
  oakSectionInnerClassName,
} from "@/lib/sectionOakTheme";

type SocialProofSectionProps = {
  eyebrow: string;
  title: string;
  reels: Array<{
    videoSrc: string;
    title: string;
    description: string;
  }>;
  instagramUrl: string;
  tiktokUrl: string;
};

export function SocialProofSection({
  eyebrow,
  title,
  reels,
  instagramUrl,
  tiktokUrl,
}: SocialProofSectionProps) {
  const headingToReelsGap = "gap-4";

  return (
    <section
      className="relative isolate w-full"
      style={latestContentSectionStyle}
    >
      <div className={oakSectionInnerClassName}>
        <ScrollReveal className="flex flex-col gap-10">
          <div className={`flex flex-col ${headingToReelsGap}`}>
            <SectionHeading
              align="center"
              eyebrow={eyebrow}
              title={title}
              titleVariant="editorialDual"
              stackGapClassName="gap-3 sm:gap-4"
            />
            <div className="relative w-full min-h-0">
              <InteractiveReelVideos items={reels} />
            </div>
          </div>
          <GradientSocialMenu
            items={[
              {
                href: instagramUrl,
                title: "Instagram",
                icon: <FaInstagram />,
              },
              {
                href: tiktokUrl,
                title: "TikTok",
                icon: <FaTiktok />,
              },
            ]}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
