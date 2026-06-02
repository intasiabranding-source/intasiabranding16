"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { upsertBlogPost, deleteBlogPost } from "@/app/actions/admin/blog";
import type { BlogPost, BlogStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export function BlogAdmin({ posts }: { posts: BlogPost[] }) {
  const [editing, setEditing] = useState<{
    id?: string;
    title: string;
    excerpt: string;
    body: string;
    status: BlogStatus;
    metaTitle?: string;
    metaDescription?: string;
  } | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    await upsertBlogPost({
      id: editing.id,
      title: editing.title,
      excerpt: editing.excerpt,
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: editing.body }],
          },
        ],
      },
      status: editing.status,
      metaTitle: editing.metaTitle,
      metaDescription: editing.metaDescription,
    });
    setEditing(null);
    window.location.reload();
  };

  return (
    <div className="mt-8 space-y-4">
      <Button
        onClick={() =>
          setEditing({
            title: "",
            excerpt: "",
            body: "",
            status: "DRAFT",
          })
        }
      >
        New Post
      </Button>

      {editing && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label>Title</Label>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} rows={8} />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full rounded-lg border bg-background px-3 py-2"
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as BlogStatus })}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
            <div>
              <Label>Meta Title (SEO)</Label>
              <Input value={editing.metaTitle ?? ""} onChange={(e) => setEditing({ ...editing, metaTitle: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-semibold">{post.title}</p>
              <Badge variant="secondary" className="mt-1">{post.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setEditing({
                    id: post.id,
                    title: post.title,
                    excerpt: post.excerpt ?? "",
                    body: "",
                    status: post.status,
                    metaTitle: post.metaTitle ?? undefined,
                  })
                }
              >
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={async () => { await deleteBlogPost(post.id); window.location.reload(); }}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
