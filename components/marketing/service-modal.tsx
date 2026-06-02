"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export type ServiceData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDesc?: string | null;
  category: string;
  features: string[];
  pricing: string | null;
  priceNote: string | null;
  ctaLabel: string;
  ctaLink: string;
  imageUrl: string | null;
  gallery: string[];
};

export function ServiceModal({
  service,
  open,
  onOpenChange,
}: {
  service: ServiceData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <Badge variant="secondary" className="w-fit">{service.category}</Badge>
          <DialogTitle className="text-2xl">{service.title}</DialogTitle>
        </DialogHeader>
        {service.imageUrl && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image src={service.imageUrl} alt={service.title} fill className="object-cover" />
          </div>
        )}
        <p className="text-muted-foreground">{service.description}</p>
        {service.features.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        )}
        {service.pricing && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-2xl font-bold">{service.pricing}</p>
            {service.priceNote && (
              <p className="text-sm text-muted-foreground">{service.priceNote}</p>
            )}
          </div>
        )}
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={service.ctaLink}>{service.ctaLabel}</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
