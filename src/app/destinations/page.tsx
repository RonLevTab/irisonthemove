import type { Metadata } from "next";

import { DestinationsInteractive } from "@/components/destinations/DestinationsInteractive";
import { getDestinationsGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Travel moments and places — a visual gallery of destinations from Iris on the Move.",
};

export default async function DestinationsPage() {
  const gallery = await getDestinationsGallery();

  return (
    <section className="w-full bg-gradient-to-b from-[#f1ebe4] via-[#f5f0e8] to-[var(--color-background)]">
      <DestinationsInteractive
        items={gallery.items}
        cardMessage={gallery.cardMessage}
      />
    </section>
  );
}
