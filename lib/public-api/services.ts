import { getServices } from "@/lib/cms/fetch";
import { prisma } from "@/lib/db";
import type { Service as PrismaService } from "@prisma/client";

export async function getPublicServices() {
  const services = (await getServices()) as PrismaService[];
  const plans = await prisma.pricingPlan.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  type PricingPlan = typeof plans[number];

  return {
    services: services.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      description: s.description,
      shortDesc: s.shortDesc,
      category: s.category,
      features: (s.features as string[]) ?? [],
      pricing: s.pricing,
      priceNote: s.priceNote,
      ctaLabel: s.ctaLabel,
      ctaLink: s.ctaLink,
      imageUrl: s.imageUrl,
      gallery: (s.gallery as string[]) ?? [],
    })),
    categories: [...new Set(services.map((s) => s.category).filter(Boolean))],
    plans: plans.map((p: PricingPlan) => ({



      id: p.id,
      name: p.name,
      price: p.price,
      period: p.period,
      features: (p.features as string[]) ?? [],
      highlighted: p.highlighted,
      ctaLabel: p.ctaLabel,
      ctaLink: p.ctaLink,
    })),
  };
}
