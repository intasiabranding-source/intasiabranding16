import { getPageBySlug } from "@/lib/cms/fetch";
import { prisma } from "@/lib/db";
import type { PageSection } from "@prisma/client";


export async function getPublicPage(slug: string) {
  const page = await getPageBySlug(slug);
  if (!page) return null;

  const faqs = await prisma.faq.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  // Fix implicit any in map callbacks


  const sections = (page.sections as PageSection[]).map((s) => ({
    id: s.id,
    type: s.type,
    content: s.content,
    animationPreset: s.animationPreset,
    order: s.order,
  }));

  return {
    slug: page.slug,
    title: page.title,
    sections,
    faqs: faqs.map((f: { id: string; question: string; answer: string }) => ({ 
      id: f.id,
      question: f.question,
      answer: f.answer,
    })),
  };
}

