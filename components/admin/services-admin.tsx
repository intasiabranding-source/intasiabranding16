"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { upsertService, deleteService } from "@/app/actions/admin/services";
import type { Service } from "@prisma/client";

export function ServicesAdmin({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  const handleSave = async () => {
    if (!editing?.title) return;
    await upsertService({
      id: editing.id,
      title: editing.title,
      description: editing.description ?? "",
      shortDesc: editing.shortDesc ?? undefined,
      category: editing.category ?? "General",
      features: (editing.features as string[]) ?? [],
      pricing: editing.pricing ?? undefined,
      priceNote: editing.priceNote ?? undefined,
      imageUrl: editing.imageUrl ?? undefined,
      published: editing.published ?? true,
    });
    setEditing(null);
    window.location.reload();
  };

  return (
    <div className="mt-8 space-y-4">
      <Button onClick={() => setEditing({ title: "", description: "", category: "Marketing", features: [] })}>
        Add Service
      </Button>

      {editing && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label>Title</Label>
              <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} />
            </div>
            <div>
              <Label>Pricing</Label>
              <Input value={editing.pricing ?? ""} onChange={(e) => setEditing({ ...editing, pricing: e.target.value })} placeholder="From $999" />
            </div>
            <div>
              <Label>Features (comma separated)</Label>
              <Input
                value={((editing.features as string[]) ?? []).join(", ")}
                onChange={(e) => setEditing({ ...editing, features: e.target.value.split(",").map((s) => s.trim()) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {services.map((s) => (
          <Card key={s.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.category} · {s.pricing}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(s)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={async () => { await deleteService(s.id); window.location.reload(); }}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
