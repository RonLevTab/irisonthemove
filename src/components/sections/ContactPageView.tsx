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
              <div className="mx-auto flex w-full max-w-[23rem] flex-col items-center gap-8 text-center sm:max-w-xl lg:gap-8 xl:max-w-2xl">
                <SectionHeading
                  align="center"
                  eyebrow="Contact"
                  title="Let's work together"
                  titleVariant="editorialDual"
                  editorialDualEyebrowClassName="text-[0.82rem] sm:text-[0.88rem]"
                  titleClassName="!text-[clamp(0.9rem,3.1vw+0.38rem,1.88rem)] tracking-[0.17em] sm:tracking-[0.17em]"
                  stackGapClassName="gap-5"
                />
                <p className="hero-home-subhead font-text-3 mx-auto max-w-[22rem] text-balance text-center !text-[1.04rem] font-medium !leading-[1.72] tracking-[0.02em] text-[var(--color-primary)] sm:max-w-2xl sm:!text-[1.08rem]">
                  Serious about your next project? So am I.
                  <span className="mt-5 block text-balance sm:mt-5">
                    I&apos;d love to help you with content creation, short-form
                    videography, photography and creative ideas to elevate your brand.
                  </span>
                </p>

                <div className="mt-9 flex w-full flex-col items-center gap-7 text-center sm:mt-10">
                  <p className="font-text-3 text-[0.78rem] font-medium uppercase leading-none tracking-[0.28em] text-[var(--color-primary)] sm:text-[0.86rem] sm:tracking-[0.26em]">
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

                <a
                  href="#contact-form"
                  className="absolute bottom-20 left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-2 whitespace-nowrap font-sans text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[var(--color-primary)]/75 transition-colors hover:text-[var(--color-primary)] lg:hidden"
                >
                  <span>Scroll down for contact form</span>
                  <span className="text-lg leading-none" aria-hidden>
                    ↓
                  </span>
                </a>
              </div>
            </div>

            <div
              id="contact-form"
              role="region"
              aria-label="Contact form"
              className="flex w-full max-w-xl scroll-mt-20 flex-col items-center justify-center pt-12 sm:scroll-mt-24 sm:pt-14 lg:max-w-none lg:scroll-mt-0 lg:pt-0 lg:pl-12 xl:pl-14"
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
