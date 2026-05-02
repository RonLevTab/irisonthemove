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
  /** Eén ritme: titel ↔ reels ↔ social; op telefoon méér lucht onderaan dan boven. */
  const blockGap = "gap-8";

  return (
    <section
      className="relative isolate z-[12] w-full max-sm:-mt-10 sm:max-md:-mt-6"
      style={latestContentSectionStyle}
    >
      <div
        className={`${oakSectionInnerAfterHeroClassName} w-full max-sm:pt-16 max-sm:pb-14 sm:max-md:pt-11 sm:max-md:pb-11`}
      >
        <ScrollReveal className="flex w-full flex-col gap-8 max-sm:gap-10 sm:max-md:gap-9">
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
