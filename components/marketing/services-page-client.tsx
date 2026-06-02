"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesGrid } from "./services-grid";
import type { ServiceData } from "./service-modal";
import Link from "next/link";

type Plan = {
  id: string;
  name: string;
  slug: string;
  price: string;
  period: string;
  description: string | null;
  features: unknown;
  highlighted: boolean;
  ctaLabel: string;
  ctaLink: string;
};

export function ServicesPageClient({
  services,
  categories,
  plans,
}: {
  services: ServiceData[];
  categories: string[];
  plans: Plan[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || s.category === category;
      return matchSearch && matchCat;
    });
  }, [services, search, category]);

  return (
    <div className="mt-12 space-y-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={category === null ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <ServicesGrid services={filtered} title="" subtitle="" />

      {plans.length > 0 && (
        <div>
          <h2 className="text-h2 text-center font-display font-bold">Pricing Plans</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={plan.highlighted ? "border-primary shadow-lg shadow-primary/20" : ""}
              >
                <CardHeader>
                  {plan.highlighted && <Badge>Popular</Badge>}
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                  </p>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {((plan.features as string[]) ?? []).map((f) => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6 w-full">
                    <Link href={plan.ctaLink}>{plan.ctaLabel}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
