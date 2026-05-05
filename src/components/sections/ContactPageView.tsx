"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  "mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-0 pb-12 sm:px-9 sm:pb-14 lg:max-w-[90rem] lg:px-14 lg:pt-10 lg:pb-24 xl:px-20 xl:pb-28";

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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const scrollToForm = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h !== "form" && h !== "contact-form") return;
      const el = document.getElementById("contact-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
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
      className="relative isolate flex min-h-[calc(100svh-var(--nav-stack-height,6rem))] w-full flex-col justify-center py-0 lg:py-12"
      style={latestContentSectionStyle}
    >
      <div className={contactSectionInnerClassName}>
        <ScrollReveal className="flex w-full max-w-6xl flex-col gap-0 lg:max-w-[78rem]">
          <div className="mx-auto grid w-full grid-cols-1 gap-0 lg:grid-cols-2 lg:items-stretch lg:gap-12 xl:gap-14">
            <div
              role="region"
              aria-label="Introduction"
              className="relative flex min-h-[calc(100svh-var(--nav-stack-height,6rem))] w-full max-w-xl flex-col items-center justify-center gap-5 border-b border-[var(--color-border)] py-12 text-center sm:gap-6 sm:py-14 lg:min-h-0 lg:max-w-none lg:border-b-0 lg:border-r lg:py-0 lg:pr-12 xl:pr-14"
            >
              <div className="mx-auto flex w-full max-w-[min(100%,28rem)] flex-col items-center gap-12 text-center sm:max-w-xl lg:gap-12 xl:max-w-2xl">
                <SectionHeading
                  align="center"
                  titleVariant="editorialDual"
                  titleClassName="!whitespace-normal !text-[clamp(0.71rem,2.65vw+0.36rem,1.58rem)] tracking-[0.13em] sm:!text-[clamp(0.73rem,2.5vw+0.34rem,1.55rem)] sm:tracking-[0.125em] lg:!text-[clamp(0.58rem,1.95vw+0.30rem,1.38rem)] lg:tracking-[0.12em] xl:tracking-[0.14em]"
                  title={
                    <>
                      <span className="block whitespace-nowrap">
                        Serious about your next project?
                      </span>
                      <span className="mt-1 block sm:mt-1.5">So am I.</span>
                    </>
                  }
                />
                <p className="hero-home-subhead font-text-3 mx-auto max-w-[22rem] text-balance text-center !text-[1.04rem] font-medium !leading-[1.72] tracking-[0.02em] text-[var(--color-primary)] sm:max-w-2xl sm:!text-[1.08rem]">
                  I&apos;d love to help you with content creation, short-form
                  videography, photography and creative ideas to elevate your brand.
                </p>

                <div className="flex w-full flex-col items-center gap-7 text-center">
                  <p className="font-text-3 text-[0.78rem] font-medium uppercase leading-none tracking-[0.28em] text-[var(--color-primary)] sm:text-[0.86rem] sm:tracking-[0.26em]">
                    Reach out directly
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

                <a
                  href="#contact-form"
                  className="absolute left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-3 whitespace-nowrap font-sans text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[var(--color-primary)]/75 transition-colors hover:text-[var(--color-primary)] sm:bottom-20 lg:hidden"
                  style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
                >
                  <span>Or scroll down for contact form</span>
                  {reduceMotion ? (
                    <span className="inline-block text-lg leading-none" aria-hidden>
                      ↓
                    </span>
                  ) : (
                    <motion.span
                      className="inline-block text-lg leading-none"
                      aria-hidden
                      animate={{ y: [0, 6, 0] }}
                      transition={{
                        duration: 1.25,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ↓
                    </motion.span>
                  )}
                </a>
              </div>
            </div>

            <div
              id="contact-form"
              role="region"
              aria-label="Contact form"
              className="flex w-full max-w-xl scroll-mt-[var(--nav-stack-height)] flex-col items-center justify-center pt-12 sm:pt-14 lg:max-w-none lg:pt-0 lg:pl-9 xl:pl-11"
            >
              <div className="mx-auto w-full max-w-xl lg:max-w-[40rem]">
                <ContactForm formId={formId} variant="default" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
