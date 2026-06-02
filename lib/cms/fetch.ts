import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export const getSiteSettings = unstable_cache(
  async () => {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "default" },
      });
    }
    return settings;
  },
  ["site-settings"],
  { tags: ["cms"], revalidate: 60 }
);

export const getSiteTheme = unstable_cache(
  async () => {
    let theme = await prisma.siteTheme.findUnique({
      where: { id: "default" },
    });
    if (!theme) {
      theme = await prisma.siteTheme.create({ data: { id: "default" } });
    }
    return theme;
  },
  ["site-theme"],
  { tags: ["cms"], revalidate: 60 }
);

export async function getPageBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.page.findUnique({
        where: { slug, published: true },
        include: {
          sections: {
            where: { published: true },
            orderBy: { order: "asc" },
          },
        },
      });
    },
    [`page-${slug}`],
    { tags: ["cms"], revalidate: 60 }
  )();
}

export const getServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  },
  ["services"],
  { tags: ["cms"], revalidate: 60 }
);

export const getPublishedBlogPosts = unstable_cache(
  async () => {
    return prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
  },
  ["blog-posts"],
  { tags: ["cms"], revalidate: 60 }
);
