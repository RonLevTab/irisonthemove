import { cache } from "react";

import homepageData from "@/content/homepage.json";
import type { HomepageContent } from "@/types/content";

const homepage = homepageData as HomepageContent;

export const getHomepageContent = cache(
  async (): Promise<HomepageContent> => homepage,
);
