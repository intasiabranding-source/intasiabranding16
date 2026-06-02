"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  ShoppingCart,
  Palette,
  Megaphone,
  Video,
  FileText,
  Layout,
  Smartphone,
  Search,
  Bot,
  Share2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceModal, type ServiceData } from "./service-modal";
import { AnimatedSection } from "./animated-section";

const iconMap: Record<string, LucideIcon> = {
  "portfolio-development": Layout,
  "e-commerce-development": ShoppingCart,
  "brand-strategy": Palette,
  "brand-showcase": Sparkles,
  "digital-marketing": Megaphone,
  "video-editing": Video,
  "content-optimization": FileText,
  "premium-website-development": Globe,
  "mobile-app-development": Smartphone,
  seo: Search,
  aeo: Bot,
  geo: Bot,
  "ai-automation": Bot,
  "social-media-marketing": Share2,
};

export function ServicesGrid({
  services,
  title = "Our Services",
  subtitle,
}: {
  services: ServiceData[];
  title?: string;
  subtitle?: string;
}) {
  const [selected, setSelected] = useState<ServiceData | null>(null);
  const [open, setOpen] = useState(false);

  const openService = (s: ServiceData) => {
    setSelected(s);
    setOpen(true);
  };

  return (
    <AnimatedSection className="section-padding" preset="FADE_UP">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center">
            {title && <h2 className="text-h2 font-display font-bold">{title}</h2>}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        <div className={`grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${title || subtitle ? "mt-12" : ""}`}>
          {services.map((service, i) => {
            const Icon = iconMap[service.slug] ?? Sparkles;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="group cursor-pointer glass-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => openService(service)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {service.shortDesc ?? service.description.slice(0, 100)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      <ServiceModal service={selected} open={open} onOpenChange={setOpen} />
    </AnimatedSection>
  );
}
