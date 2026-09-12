import dayjs from "dayjs";
import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site";
import { getAllPosts, getPostsByCategory } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${SITE_INFO.url}/blog/${post.slug}`,
    lastModified: dayjs(post.metadata.updatedAt).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const components = getPostsByCategory("components").map((post) => ({
    url: `${SITE_INFO.url}/components/${post.slug}`,
    lastModified: dayjs(post.metadata.updatedAt).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const routes = [
    {
      url: SITE_INFO.url,
      lastModified: dayjs().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_INFO.url}/blog`,
      lastModified: dayjs().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_INFO.url}/components`,
      lastModified: dayjs().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  return [...routes, ...posts, ...components];
}

