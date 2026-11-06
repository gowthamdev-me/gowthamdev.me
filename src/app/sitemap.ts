import dayjs from "dayjs";
import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_INFO.url,
      lastModified: dayjs().toISOString(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
