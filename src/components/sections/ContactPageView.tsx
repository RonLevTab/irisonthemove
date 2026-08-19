"use client";

import { useEffect } from "react";
import { FaEnvelope, FaInstagram, FaTiktok } from "react-icons/fa6";

import { GradientSocialMenu } from "@/components/ui/GradientSocialMenu";

/** Subheading above contact social icons. */
const contactFindMeTitleClassName =
  "font-text-3 max-w-full text-center font-medium uppercase leading-none tracking-[0.26em] text-[var(--color-primary)] text-[1.1rem] sm:text-[1.25rem] md:text-[1.35rem] sm:tracking-[0.24em]";

/** Bottom padding kept moderate so the footer follows soon after content (no long same-section scroll). */
const contactSectionInnerClassName =
  "mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pt-0 pb-0 sm:px-9 lg:max-w-[90rem] lg:px-14 lg:pt-0 xl:px-20 xl:pb-0";

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
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#faf4ed";
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <section
      className="relative isolate flex w-full flex-col items-center justify-center pb-16"
      style={{ height: "calc(100svh - var(--nav-stack-height, 6rem))" }}
    >
      <div
        role="region"
        aria-label="Contact"
        className="flex flex-col items-center gap-8 text-center sm:gap-10"
      >
        <h1 className={contactFindMeTitleClassName}>My socials &amp; contact</h1>
        <GradientSocialMenu
          size="lg"
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
            {
              href: `mailto:${email}`,
              title: "Email",
              icon: <FaEnvelope />,
            },
          ]}
        />
      </div>
    </section>
  );
}
