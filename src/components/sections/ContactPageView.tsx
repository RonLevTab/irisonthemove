"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaEnvelope, FaInstagram, FaTiktok } from "react-icons/fa6";

import { ContactForm } from "@/components/ui/ContactForm";
import { GradientSocialMenu } from "@/components/ui/GradientSocialMenu";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { latestContentSectionStyle } from "@/lib/sectionOakTheme";

/** Bottom padding kept moderate so the footer follows soon after content (no long same-section scroll). */
const contactSectionInnerClassName =
  "mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-7 pb-16 sm:px-9 sm:pt-9 sm:pb-20 lg:max-w-[90rem] lg:px-14 lg:pt-10 lg:pb-24 xl:px-20 xl:pb-28";

type ContactPageViewProps = {
  formId: string;
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
};

export function ContactPageView({
  formId,
  email,
  instagramUrl,
  tiktokUrl,
}: ContactPageViewProps) {
  const router = useRouter();

  useEffect(() => {
    const scrollToForm = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h !== "form" && h !== "contact-form") return;
      const el = document.getElementById("contact-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        const input = el.querySelector<HTMLInputElement>("input[name=name], input#name");
        input?.focus({ preventScroll: true });
      }
      router.replace("/contact", { scroll: false });
    };
    scrollToForm();
    window.addEventListener("hashchange", scrollToForm);
    return () => window.removeEventListener("hashchange", scrollToForm);
  }, [router]);

  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-var(--nav-stack-height,6rem))] w-full flex-col justify-center py-8 sm:py-10 lg:py-12"
      style={latestContentSectionStyle}
    >
      <div className={contactSectionInnerClassName}>
        <ScrollReveal className="flex w-full max-w-6xl flex-col gap-12 sm:gap-14 lg:max-w-7xl">
          <div className="mx-auto grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-0">
            <div
              role="region"
              aria-label="Introduction"
              className="flex w-full max-w-xl flex-col items-center justify-center gap-5 border-b border-[var(--color-border)] pb-12 text-center sm:gap-6 lg:max-w-none lg:border-b-0 lg:border-r lg:pb-0 lg:pr-20 xl:pr-24"
            >
              <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-7 text-center lg:gap-8 xl:max-w-2xl">
                <SectionHeading
                  align="center"
                  eyebrow="Contact"
                  title="Let's work together"
                  titleVariant="editorialDual"
                  editorialDualEyebrowClassName="text-[0.72rem] sm:text-[0.88rem]"
                  titleClassName="!text-[clamp(0.7rem,2.35vw+0.38rem,1.88rem)] tracking-[0.16em] sm:tracking-[0.17em]"
                  stackGapClassName="gap-4 sm:gap-5"
                />
                <p className="mx-auto max-w-2xl text-balance text-center text-base leading-relaxed text-[var(--color-foreground-muted)] sm:text-lg sm:leading-relaxed">
                  Serious about your next project? So am I.
                  <span className="mt-4 block text-balance sm:mt-5">
                    I&apos;d love to help with content creation, short-form
                    videography, photography and creative ideas to elevate your brand.
                  </span>
                </p>

                <div className="mt-8 flex w-full flex-col items-center gap-7 text-center sm:mt-10">
                  <p className="font-text-3 text-[0.72rem] font-medium uppercase leading-none tracking-[0.28em] text-[var(--color-primary)] sm:text-[0.86rem] sm:tracking-[0.26em]">
                    Or reach out directly
                  </p>
                  <div className="flex w-full justify-center">
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
              </div>
            </div>

            <div
              id="contact-form"
              role="region"
              aria-label="Contact form"
              className="flex w-full max-w-xl scroll-mt-20 flex-col items-center justify-center sm:scroll-mt-24 lg:max-w-none lg:scroll-mt-0 lg:pl-20 xl:pl-24"
            >
              <div className="mx-auto w-full max-w-xl">
                <ContactForm formId={formId} variant="default" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
