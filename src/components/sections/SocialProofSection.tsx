"use client";

import { FaInstagram, FaTiktok } from "react-icons/fa6";

import { GradientSocialMenu } from "@/components/ui/GradientSocialMenu";
import { InteractiveReelVideos } from "@/components/ui/InteractiveReelVideos";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  latestContentSectionStyle,
  oakSectionInnerAfterHeroClassName,
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
  /** Same vertical rhythm: title ↔ reels ↔ social buttons */
  const blockGap = "gap-8";

  return (
    <section
      className="relative isolate z-[12] w-full max-sm:-mt-10 max-sm:flex max-sm:min-h-[calc(100svh-var(--nav-stack-height,7rem))] max-sm:flex-col max-sm:justify-center sm:max-md:-mt-6"
      style={latestContentSectionStyle}
    >
      <div
        className={`${oakSectionInnerAfterHeroClassName} w-full max-sm:pt-4 max-sm:pb-5 sm:max-md:pt-[4.5rem] sm:max-md:pb-10`}
      >
        <ScrollReveal className={`flex w-full flex-col ${blockGap}`}>
          <div className={`flex flex-col ${blockGap}`}>
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
