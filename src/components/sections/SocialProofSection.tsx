"use client";

import { FaInstagram, FaTiktok } from "react-icons/fa6";

import { GradientSocialMenu } from "@/components/ui/GradientSocialMenu";
import { InteractiveReelVideos } from "@/components/ui/InteractiveReelVideos";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { latestContentSectionStyle } from "@/lib/sectionOakTheme";

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
  return (
    <section
      className="relative isolate z-[12] flex w-full scroll-mt-[var(--nav-stack-height)] flex-col md:min-h-[calc(100svh-var(--nav-stack-height,7rem))]"
      style={latestContentSectionStyle}
    >
      <div
        className="mx-auto flex w-full max-w-[min(100%,96rem)] flex-1 flex-col justify-start px-6 max-sm:pt-14 max-sm:pb-8 sm:max-md:pt-16 sm:max-md:pb-10 sm:px-10 md:min-h-[calc(100svh-var(--nav-stack-height,7rem))] md:justify-center md:pt-16 md:pb-16 lg:px-12 lg:pt-20 lg:pb-20"
      >
        {/*
          Mobile: natural height — scroll freely with Services below.
          Desktop: min-h matches other full-bleed sections.
        */}
        <ScrollReveal className="flex w-full flex-col items-center gap-6 text-center sm:gap-7 md:gap-8 lg:gap-8">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleVariant="editorialDual"
            stackGapClassName="gap-3 sm:gap-4"
          />

          <div className="flex w-full min-w-0 max-w-4xl flex-col items-center max-md:shrink-0 max-md:gap-8 md:min-h-0 md:flex-1 md:gap-8 lg:max-w-5xl xl:max-w-6xl">
            <div className="relative w-full max-md:shrink-0 md:min-h-0 md:flex-1">
              <InteractiveReelVideos items={reels} />
            </div>
            <div className="w-full shrink-0 max-md:[&_ul]:justify-center max-md:[&_ul]:gap-3">
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
        </ScrollReveal>
      </div>
    </section>
  );
}
