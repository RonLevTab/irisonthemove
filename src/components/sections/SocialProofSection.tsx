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
  /** Heading ↔ “reels + social” eén blok; geen justify-between (die zette social aan onderkant viewport). */
  const blockGap = "gap-8";

  return (
    <section
      className={`relative isolate z-[12] flex min-h-[calc(100dvh-var(--nav-stack-height))] w-full flex-col max-md:snap-start max-md:snap-always max-sm:-mt-10 sm:max-md:-mt-6 lg:-mt-2`}
      style={latestContentSectionStyle}
    >
      <div
        className={`${oakSectionInnerAfterHeroClassName} flex min-h-0 w-full flex-1 flex-col max-sm:pt-10 max-sm:pb-11 sm:max-md:pt-9 sm:max-md:pb-11`}
      >
        <ScrollReveal className="flex min-h-0 w-full flex-1 flex-col gap-6 max-sm:gap-8 sm:max-md:gap-7">
          <div className={`flex min-h-0 flex-1 flex-col ${blockGap}`}>
            <div className="shrink-0">
              <SectionHeading
                align="center"
                eyebrow={eyebrow}
                title={title}
                titleVariant="editorialDual"
                stackGapClassName="gap-3 sm:gap-4"
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-4 max-sm:gap-5 sm:gap-5">
              <div className="relative flex min-h-0 flex-1 flex-col">
                <InteractiveReelVideos items={reels} />
              </div>
              <div className="shrink-0 -mt-5 max-md:pt-1 sm:-mt-9">
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
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
