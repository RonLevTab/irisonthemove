"use client";

import { FaEnvelope, FaInstagram, FaTiktok } from "react-icons/fa6";

import { GradientSocialMenu } from "@/components/ui/GradientSocialMenu";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { latestContentSectionStyle } from "@/lib/sectionOakTheme";

/** Subheading above contact social icons. */
const contactFindMeTitleClassName =
  "font-text-3 max-w-full text-center font-medium uppercase leading-none tracking-[0.26em] text-[var(--color-primary)] text-[0.92rem] sm:text-[1rem] md:text-[1.06rem] sm:tracking-[0.24em]";

/** Bottom padding kept moderate so the footer follows soon after content (no long same-section scroll). */
const contactSectionInnerClassName =
  "mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-0 pb-12 sm:px-9 sm:pb-14 lg:max-w-[90rem] lg:px-14 lg:pt-10 lg:pb-24 xl:px-20 xl:pb-28";

type ContactPageViewProps = {
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
};

export function ContactPageView({
  email,
  instagramUrl,
  tiktokUrl,
}: ContactPageViewProps) {
  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-var(--nav-stack-height,6rem))] w-full flex-col justify-center py-0 lg:py-12"
      style={latestContentSectionStyle}
    >
      <div className={contactSectionInnerClassName}>
        <ScrollReveal className="flex w-full max-w-6xl flex-col lg:max-w-[78rem]">
          <div
            role="region"
            aria-label="Contact"
            className="mx-auto flex w-full min-h-[calc(100svh-var(--nav-stack-height,6rem))] flex-col items-center justify-center py-12 text-center sm:py-14 lg:min-h-0 lg:py-0"
          >
            <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center sm:max-w-2xl sm:gap-10 xl:max-w-3xl">
              <h1 className={contactFindMeTitleClassName}>Contact &amp; my socials</h1>
              <GradientSocialMenu
                size="lg"
                items={[
                  {
                    href: `mailto:${email}`,
                    title: "Email",
                    icon: <FaEnvelope />,
                  },
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
