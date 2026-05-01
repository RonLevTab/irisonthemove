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
  "mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-10 pb-16 sm:px-8 sm:pb-20 lg:max-w-7xl lg:px-12 lg:pt-12 xl:px-16 xl:pb-24";

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
      className="relative isolate w-full"
      style={latestContentSectionStyle}
    >
      <div className={contactSectionInnerClassName}>
        <ScrollReveal className="mt-8 flex w-full max-w-5xl flex-col gap-12 sm:mt-10 sm:gap-14 lg:mt-12 lg:max-w-6xl">
          <div className="mx-auto grid w-full grid-cols-1 justify-items-center gap-10 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:items-stretch lg:justify-items-stretch lg:gap-0">
            <div
              role="region"
              aria-label="Introduction"
              className="flex w-full max-w-xl flex-col items-center justify-center gap-4 text-center sm:gap-5 lg:max-w-none"
            >
              <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center lg:gap-7 xl:max-w-xl">
                <SectionHeading
                  align="center"
                  eyebrow="Contact"
                  title="Let's work together"
                  titleVariant="editorialDual"
                  stackGapClassName="gap-3 sm:gap-4"
                />
                <p className="mx-auto max-w-xl text-balance text-center text-sm leading-relaxed text-[var(--color-foreground-muted)] sm:text-base sm:leading-relaxed">
                  Serious about your next project? So am I.
                  <br />
                  Partnerships, campaigns or a quick hello? Reach out!
                </p>

                <div className="mt-6 flex w-full flex-col items-center gap-6 text-center sm:mt-8">
                  <p className="font-text-3 text-[0.62rem] font-medium uppercase leading-none tracking-[0.28em] text-[var(--color-primary)] sm:text-[0.74rem] sm:tracking-[0.26em]">
                    Or reach out directly
                  </p>
                  <div className="flex w-full justify-center">
                    <GradientSocialMenu
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
              className="hidden w-px shrink-0 self-stretch bg-[var(--color-border)] lg:block"
              aria-hidden
            />

            <div
              id="contact-form"
              role="region"
              aria-label="Contact form"
              className="flex w-full max-w-xl scroll-mt-20 flex-col items-center justify-center sm:scroll-mt-24 lg:max-w-none lg:justify-self-center lg:scroll-mt-0"
            >
              <div className="mx-auto w-full max-w-lg">
                <ContactForm formId={formId} variant="default" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
