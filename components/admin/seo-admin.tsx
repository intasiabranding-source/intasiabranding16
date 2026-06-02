"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertSeo, upsertAeoGeo } from "@/app/actions/admin/settings";
import type { SeoSettings, AeoGeoBlock } from "@prisma/client";

export function SeoAdmin({
  seoSettings,
  aeoGeoBlocks,
}: {
  seoSettings: SeoSettings[];
  aeoGeoBlocks: AeoGeoBlock[];
}) {
  const [path, setPath] = useState("/");
  const [meta, setMeta] = useState({ metaTitle: "", metaDescription: "", canonicalUrl: "", ogImage: "" });
  const [aeo, setAeo] = useState({ question: "", answer: "", entityName: "" });

  const handleSaveSeo = async () => {
    await upsertSeo({ path, ...meta });
    alert("SEO saved");
  };

  const handleSaveAeo = async () => {
    await upsertAeoGeo({ type: "FAQ", question: aeo.question, answer: aeo.answer, entityName: aeo.entityName });
    alert("AEO/GEO block saved");
    window.location.reload();
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Page SEO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Path</Label>
            <Input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/" />
          </div>
          <div>
            <Label>Meta Title</Label>
            <Input value={meta.metaTitle} onChange={(e) => setMeta({ ...meta, metaTitle: e.target.value })} />
          </div>
          <div>
            <Label>Meta Description</Label>
            <Textarea value={meta.metaDescription} onChange={(e) => setMeta({ ...meta, metaDescription: e.target.value })} />
          </div>
          <div>
            <Label>Canonical URL</Label>
            <Input value={meta.canonicalUrl} onChange={(e) => setMeta({ ...meta, canonicalUrl: e.target.value })} />
          </div>
          <div>
            <Label>OG Image URL</Label>
            <Input value={meta.ogImage} onChange={(e) => setMeta({ ...meta, ogImage: e.target.value })} />
          </div>
          <Button onClick={handleSaveSeo}>Save SEO</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>AEO / GEO Block</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Question</Label>
            <Input value={aeo.question} onChange={(e) => setAeo({ ...aeo, question: e.target.value })} />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea value={aeo.answer} onChange={(e) => setAeo({ ...aeo, answer: e.target.value })} rows={4} />
          </div>
          <div>
            <Label>Entity Name (GEO)</Label>
            <Input value={aeo.entityName} onChange={(e) => setAeo({ ...aeo, entityName: e.target.value })} />
          </div>
          <Button onClick={handleSaveAeo}>Save AEO/GEO</Button>

          <div className="pt-4 border-t space-y-2">
            {aeoGeoBlocks.map((b) => (
              <div key={b.id} className="text-sm">
                <p className="font-medium">{b.question ?? b.entityName}</p>
                <p className="text-muted-foreground line-clamp-2">{b.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Existing SEO Entries</CardTitle></CardHeader>
        <CardContent>
          {seoSettings.length === 0 ? (
            <p className="text-muted-foreground">No SEO entries yet.</p>
          ) : (
            <ul className="space-y-2">
              {seoSettings.map((s) => (
                <li key={s.id} className="text-sm">
                  <strong>{s.path}</strong> — {s.metaTitle}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
