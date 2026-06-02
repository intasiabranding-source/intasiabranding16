"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMedia, deleteMedia } from "@/app/actions/admin/media";
import type { MediaAsset } from "@prisma/client";
import { Upload, Trash2 } from "lucide-react";

export function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("general");

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      setUploading(true);
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        await uploadMedia(fd);
      }
      setUploading(false);
      window.location.reload();
    },
    [folder]
  );

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      await uploadMedia(fd);
    }
    setUploading(false);
    window.location.reload();
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex gap-4">
        <Input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="Folder" className="max-w-xs" />
        <label>
          <Button asChild disabled={uploading}>
            <span>
              <Upload className="mr-2 h-4 w-4 inline" />
              {uploading ? "Uploading..." : "Upload"}
            </span>
          </Button>
          <input type="file" multiple className="hidden" onChange={handleFileInput} accept="image/*,video/*,.svg" />
        </label>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="mb-8 flex min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center text-muted-foreground"
      >
        Drag & drop images, SVG, GIF, or videos here
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {assets.map((asset) => (
          <div key={asset.id} className="group relative overflow-hidden rounded-lg border">
            <div className="relative aspect-square">
              <Image src={asset.secureUrl} alt={asset.alt ?? asset.filename} fill className="object-cover" />
            </div>
            <div className="p-2">
              <p className="truncate text-xs font-medium">{asset.filename}</p>
              <p className="text-xs text-muted-foreground">{asset.folder}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive"
              onClick={async () => {
                await deleteMedia(asset.publicId);
                window.location.reload();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
