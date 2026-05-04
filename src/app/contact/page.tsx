import type { Metadata } from "next";

import { ContactPageView } from "@/components/sections/ContactPageView";
import { getSiteConfig } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Contact",
    description: "Get in touch with Iris On The Move for collaborations and inquiries.",
};

export default async function ContactPage() {
  const site = await getSiteConfig();

  return (
    <ContactPageView
      formId={site.formspreeId}
      email={site.email}
      instagramUrl={site.socialLinks.instagram}
      tiktokUrl={site.socialLinks.tiktok}
    />
  );
}
