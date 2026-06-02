"use client";

import { type ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateSectionContent,
  addSection,
  deleteSection,
  publishPage,
} from "@/app/actions/admin/cms";
import { BLOCK_TYPES, blockLabels, type BlockType } from "@/lib/cms/blocks";
import { Badge } from "@/components/ui/badge";

type Page = {
  id: string;
  slug: string;
  title: string;
  sections: {
    id: string;
    type: string;
    order: number;
    content: unknown;
    animationPreset: string;
  }[];
};

export function PageBuilder({ pages }: { pages: Page[] }) {
  const [selectedPage, setSelectedPage] = useState(pages[0]?.slug ?? "home");
  const page = pages.find((p) => p.slug === selectedPage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJson, setEditJson] = useState("");
  const [message, setMessage] = useState("");

  const handleSaveSection = async () => {
    if (!editingId) return;
    try {
      const content = JSON.parse(editJson);
      await updateSectionContent(editingId, content);
      setMessage("Section saved!");
      setEditingId(null);
    } catch {
      setMessage("Invalid JSON");
    }
  };

  const handleAddSection = async (type: BlockType) => {
    if (!page) return;
    await addSection(page.id, type);
    setMessage(`Added ${blockLabels[type]}`);
    window.location.reload();
  };

  const handlePublish = async () => {
    await publishPage(selectedPage);
    setMessage("Published! Site updated.");
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pages.map((p) => (
            <Button
              key={p.slug}
              variant={selectedPage === p.slug ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedPage(p.slug)}
            >
              {p.title}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{page?.title} Sections</CardTitle>
          <Button onClick={handlePublish}>Publish</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && <p className="text-sm text-green-500">{message}</p>}
          {page?.sections.map((section) => (
            <div key={section.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary">{section.type}</Badge>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Order {section.order} · {section.animationPreset}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(section.id);
                      setEditJson(JSON.stringify(section.content, null, 2));
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await deleteSection(section.id);
                      window.location.reload();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {BLOCK_TYPES.slice(0, 8).map((type: BlockType) => (
              <Button key={type} size="sm" variant="outline" onClick={() => handleAddSection(type)}>
                + {blockLabels[type]}
              </Button>
            ))}
          </div>

          {editingId && (
            <div className="space-y-2 border-t pt-4">
              <Label>Section JSON Content</Label>
              <Textarea
                value={editJson}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditJson(e.target.value)}
                rows={12}
                className="font-mono text-xs"
              />
              <Button onClick={handleSaveSection}>Save Section</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
