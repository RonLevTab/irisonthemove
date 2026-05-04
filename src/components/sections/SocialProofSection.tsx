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
      className="relative isolate z-[12] flex w-full scroll-mt-[var(--nav-stack-height)] flex-col max-md:overflow-x-clip"
      style={latestContentSectionStyle}
    >
      <div
        className="mx-auto flex w-full max-w-[min(100%,96rem)] flex-col justify-start px-6 pb-8 pt-16 sm:px-10 sm:max-md:pb-10 sm:max-md:pt-[4.25rem] md:px-10 md:pb-8 md:pt-20 lg:px-12 lg:pb-10 lg:pt-24"
      >
        {/*
          Heading → reels block: ScrollReveal gap. Reels + Sound + social share one column inside
          InteractiveReelVideos so vertical spacing is one even rhythm (gap-5 / md:gap-6).
        */}
        <ScrollReveal className="flex w-full flex-col items-center gap-4 text-center max-md:gap-4 md:gap-7">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleVariant="editorialDual"
            stackGapClassName="gap-3 sm:gap-4"
          />

          <div className="relative w-full min-w-0 max-w-6xl max-md:shrink-0 md:min-h-0 lg:max-w-7xl xl:max-w-[min(100%,90rem)]">
            <InteractiveReelVideos
              items={reels}
              footer={
                <GradientSocialMenu
                  size="compact"
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
              }
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
